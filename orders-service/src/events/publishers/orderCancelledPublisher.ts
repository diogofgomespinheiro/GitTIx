import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@diogoptickets/shared';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
