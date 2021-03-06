import { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@diogoptickets/shared';

import { Ticket } from '@models/Ticket';
import { natsWrapper } from '@utils/natsWrapper';
import { TicketCreatedPublisher, TicketUpdatedPublisher } from '@publishers/';

class TicketsController {
  static async store(req: Request, res: Response) {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    const {
      id: savedTicketId,
      title: savedTicketTitle,
      price: savedTicketPrice,
      userId,
      version: savedTicketVersion,
    } = ticket;

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: savedTicketId,
      title: savedTicketTitle,
      price: savedTicketPrice,
      userId,
      version: savedTicketVersion,
    });

    res.status(201).json(ticket);
  }

  static async index(req: Request, res: Response) {
    const tickets = await Ticket.find({});
    res.json(tickets);
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).json(ticket);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    const { userId } = ticket;

    if (userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id,
      title,
      price,
      userId,
      version: ticket.version,
    });

    res.status(200).json(ticket);
  }
}

export default TicketsController;
