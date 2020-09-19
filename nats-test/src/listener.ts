import nats from 'node-nats-streaming';
import { v4 as uuidv4 } from 'uuid';

import { TicketCreatedListener } from './events/ticketCreatedListener'

console.clear();

const stan = nats.connect('ticketing', uuidv4(), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());