import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  NotFoundError,
  OrderStatus,
} from '@diogoptickets/shared';

import { Order } from '@models/Order';
import { QUEUE_GROUP_NAME } from '@utils/constants';
import { natsWrapper } from '@utils/natsWrapper';
import { OrderCancelledPublisher } from '@publishers/';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
