import Queue from 'bull';

import config from '@config/index';
import { ExpirationCompletePublisher } from '@publishers/';
import { natsWrapper } from '@utils/natsWrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: config.redisHost,
  },
});

expirationQueue.process(async job => {
  const { orderId } = job.data;

  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId,
  });
});

export { expirationQueue };
