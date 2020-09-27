import config from '@config/index';
import { natsWrapper } from '@utils/natsWrapper';
import { EnvKeysChecker } from '@utils/envKeysChecker';

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
};

start();
