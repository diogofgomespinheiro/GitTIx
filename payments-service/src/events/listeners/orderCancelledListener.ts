import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from '@diogoptickets/shared';
import { Message } from 'node-nats-streaming';

import { QUEUE_GROUP_NAME } from '@utils/constants';
import { Order, OrderStatus } from '@models/Order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
