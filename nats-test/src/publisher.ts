import nats from 'node-nats-streaming';
import { v4 as uuidv4 } from 'uuid';

import { TicketCreatedPublisher } from './events/ticketCreatedPublisher';

console.clear();

const stan = nats.connect('ticketing', uuidv4(), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try {
    publisher.publish({
      id: '123',
      title: 'title',
      price: 20
    });
  } catch(err) {
    console.error(err);
  }
});
