import { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError } from '@diogoptickets/shared';

import { Ticket } from '@models/Ticket';

class TicketsController {
  static async createTicket(req: Request, res: Response) {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    res.status(201).json(ticket);
  }

  static async getAllTickets(req: Request, res: Response) {
    const tickets = await Ticket.find({});
    res.json(tickets);
  }

  static async findTicketById(req: Request, res: Response) {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).json(ticket);
  }

  static async updateTicket(req: Request, res: Response) {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
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

    res.status(200).json(ticket);
  }
}

export default TicketsController;
