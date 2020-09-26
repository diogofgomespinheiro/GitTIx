import { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@diogoptickets/shared';

import { Order } from '@models/Order';
import { Ticket } from '@models/Ticket';
import { natsWrapper } from '@utils/natsWrapper';
import { OrderCreatedPublisher, OrderCancelledPublisher } from '@publishers/';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

class OrdersController {
  static async index(req: Request, res: Response) {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      'ticket',
    );

    res.json(orders);
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;
    const { id: userId } = req.currentUser!;

    const order = await Order.findById(id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    res.json(order);
  }

  static async store(req: Request, res: Response) {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    const { id, status, userId, expiresAt, version } = order;

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id,
      status,
      userId,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      expiresAt: expiresAt.toISOString(),
      version,
    });

    res.status(201).json(order);
  }

  static async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const { id: userId } = req.currentUser!;

    const order = await Order.findById(id).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    res.status(204).json(order);
  }
}

export default OrdersController;
