import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NotFoundError, TicketUpdatedEvent } from '@diogoptickets/shared';

import { TicketUpdatedListener } from '../ticketUpdatedListener';
import { natsWrapper } from '@utils/natsWrapper';
import { Ticket } from '@models/Ticket';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 25,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: '123',
    version: ticket.version + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe('Ticket Updated Listener', () => {
  it('should find and update a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket?.title).toBe(data.title);
    expect(updatedTicket?.price).toBe(data.price);
    expect(updatedTicket?.version).toBe(data.version);
  });

  it('should not ack the message if the event has the wrong version', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    await expect(listener.onMessage(data, msg)).rejects.toThrow(NotFoundError);

    expect(msg.ack).not.toHaveBeenCalled();
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
