import { app } from './app';

import config from '@config/index';
import { Mongo } from '@utils/db';
import { natsWrapper } from '@utils/natsWrapper';
import { EnvKeysChecker } from '@utils/envKeysChecker';

import {
  TicketCreatedListener,
  TicketUpdatedListener,
  ExpirationCompleteListener,
} from '@listeners/';

const PORT = config.port;

const start = async () => {
  EnvKeysChecker.checkKeys();

  await natsWrapper.connect(
    config.natsClusterId,
    config.natsClientId,
    config.natsUrl,
  );
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();

  await Mongo.connectToDb();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
