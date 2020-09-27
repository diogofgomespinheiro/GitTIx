import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, Subjects } from '@diogoptickets/shared';

import { ExpirationCompleteListener } from '../expirationCompleteListener';
import { natsWrapper } from '@utils/natsWrapper';
import { Order, OrderStatus } from '@models/Order';
import { Ticket } from '@models/Ticket';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 25,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

describe('Expiration Complete Listener', () => {
  it('should update the order status to cancelled', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.orderId);

    expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
  });

  it('should emit an OrderCancelled event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const mockPublishFunction = natsWrapper.client.publish as jest.Mock;

    expect(mockPublishFunction).toHaveBeenCalled();

    const updatedOrderData = JSON.parse(mockPublishFunction.mock.calls[0][1]);
    const status = mockPublishFunction.mock.calls[0][0];

    expect(updatedOrderData.id).toBe(data.orderId);
    expect(status).toBe(Subjects.OrderCancelled);
  });

  it('should ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
