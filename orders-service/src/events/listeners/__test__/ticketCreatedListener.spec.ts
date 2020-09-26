import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@diogoptickets/shared';

import { TicketCreatedListener } from '../ticketCreatedListener';
import { natsWrapper } from '@utils/natsWrapper';
import { Ticket } from '@models/Ticket';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 25,
    userId: '123',
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('Ticket Created Listener', () => {
  it('should create and save a ticket', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket?.title).toBe(data.title);
    expect(ticket?.price).toBe(data.price);
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
