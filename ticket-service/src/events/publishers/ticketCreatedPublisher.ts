import { Publisher, Subjects, TicketCreatedEvent } from '@diogoptickets/shared';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
