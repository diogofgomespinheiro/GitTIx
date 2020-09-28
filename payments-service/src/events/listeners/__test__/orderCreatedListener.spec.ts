import mongoose from 'mongoose';
import { OrderCreatedEvent } from '@diogoptickets/shared';
import { Message } from 'node-nats-streaming';

import { natsWrapper } from '@utils/natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import { Order, OrderStatus } from '@models/Order';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: '123',
    userId: '123',
    version: 0,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 25,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('Order Created Listener', () => {
  it('should replicate the order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order?.price).toBe(data.ticket.price);
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
