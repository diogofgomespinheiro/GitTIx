import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  NotFoundError,
} from '@diogoptickets/shared';

import { Order, OrderStatus } from '@models/Order';
import { QUEUE_GROUP_NAME } from '@utils/constants';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
