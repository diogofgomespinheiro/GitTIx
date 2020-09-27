import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@diogoptickets/shared';

import { OrderCreatedListener } from '../orderCreatedListener';
import { natsWrapper } from '@utils/natsWrapper';
import { Ticket } from '@models/Ticket';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 25,
    userId: '123',
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: 'timestamp',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

describe('Order Created Listener', () => {
  it('should set and orderId to the created ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toBe(data.id);
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it('should emit a ticket:updated event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const mockPublishFunction = natsWrapper.client.publish as jest.Mock;

    expect(mockPublishFunction).toHaveBeenCalled();

    const updatedTicketData = JSON.parse(mockPublishFunction.mock.calls[0][1]);

    expect(updatedTicketData.orderId).toBe(data.id);
  });
});
