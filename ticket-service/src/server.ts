import { app } from './app';

import config from '@config/index';
import { Mongo } from '@utils/db';

const PORT = config.port;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not defined');
  }

  await Mongo.connectToDb();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
