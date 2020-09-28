import mongoose from 'mongoose';
import { OrderCancelledEvent } from '@diogoptickets/shared';
import { Message } from 'node-nats-streaming';

import { natsWrapper } from '@utils/natsWrapper';
import { OrderCancelledListener } from '../orderCancelledListener';
import { Order, OrderStatus } from '@models/Order';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'wqe',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe('Order Cancelled Listener', () => {
  it('should replicate the order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
