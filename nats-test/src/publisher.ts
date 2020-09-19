import nats from 'node-nats-streaming';
import { v4 as uuidv4 } from 'uuid';

console.clear();

const stan = nats.connect('ticketing', uuidv4(), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  })
});
