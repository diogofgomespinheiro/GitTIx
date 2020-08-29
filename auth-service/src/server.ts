import express, { json, urlencoded } from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import config from '@config/index';
import cors from 'cors';
import { userRouter } from '@routes/user';
import { errorHandler } from '@middlewares/error-handler';
import { NotFoundError } from '@errors/NotFoundError';

const PORT = config.port;

export const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/users', userRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export const start = () => {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};
