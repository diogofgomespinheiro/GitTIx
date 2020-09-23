import { Request, Response } from 'express';

import { Order } from '@models/Order';
import { Ticket } from '@models/Ticket';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@diogoptickets/shared';

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

    res.status(204).json(order);
  }
}

export default OrdersController;
