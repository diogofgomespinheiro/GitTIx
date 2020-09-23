import { Publisher, Subjects, OrderCreatedEvent } from '@diogoptickets/shared';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
