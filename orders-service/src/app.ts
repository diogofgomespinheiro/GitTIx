import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import config from '@config/index';
import cors from 'cors';
import cookieSession from 'cookie-session';

import { ordersRouter } from '@routes/orders';

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@diogoptickets/shared';

const app = express();
app.set('trust proxy', true);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieSession(config.cookieSession));
app.use(currentUser);
app.use(morgan('dev'));

app.use('/api/orders', ordersRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
