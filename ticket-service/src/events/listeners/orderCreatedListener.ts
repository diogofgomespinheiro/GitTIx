import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  NotFoundError,
} from '@diogoptickets/shared';

import { QUEUE_GROUP_NAME } from '@utils/constants';
import { Ticket } from '@models/Ticket';
import { TicketUpdatedPublisher } from '@publishers/';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, ticket: orderTicket } = data;

    const ticket = await Ticket.findById(orderTicket.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId });

    await ticket.save();

    const { id, title, price, userId, version } = ticket;

    await new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      userId,
      orderId,
      version,
    });

    msg.ack();
  }
}
