import { Publisher, Subjects, TicketUpdatedEvent } from '@diogoptickets/shared';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
