import { Listener, OrderCreatedEvent, Subjects } from '@diogoptickets/shared';
import { Message } from 'node-nats-streaming';

import { QUEUE_GROUP_NAME } from '@utils/constants';
import { Order } from '@models/Order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const {
      id,
      status,
      userId,
      version,
      ticket: { price },
    } = data;

    const order = Order.build({
      id,
      price,
      status,
      userId,
      version,
    });
    await order.save();

    msg.ack();
  }
}
