import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@diogoptickets/shared';

import { OrderCancelledListener } from '../orderCancelledListener';
import { natsWrapper } from '@utils/natsWrapper';
import { Ticket } from '@models/Ticket';

jest.mock('@utils/natsWrapper');

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 25,
    userId: '123',
  });

  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id,
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
  it('should set orderId to undefined on the cancelled order ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).not.toBeDefined();
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
