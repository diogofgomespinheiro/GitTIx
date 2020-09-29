import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@diogoptickets/shared';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
