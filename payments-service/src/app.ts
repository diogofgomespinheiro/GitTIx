import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import config from '@config/';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@diogoptickets/shared';

import { paymentsRouter } from '@routes/payments';

const app = express();
app.set('trust proxy', true);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieSession(config.cookieSession));
app.use(currentUser);
app.use(morgan('dev'));

app.use('/api/payments', paymentsRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
