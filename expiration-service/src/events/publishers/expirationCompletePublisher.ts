import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@diogoptickets/shared';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
