import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@diogoptickets/shared';

import { Ticket } from '@models/Ticket';
import { QUEUE_GROUP_NAME } from '@utils/constants';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, price, title } = data;

    const ticket = Ticket.build({
      id,
      price,
      title,
    });

    await ticket.save();

    msg.ack();
  }
}
