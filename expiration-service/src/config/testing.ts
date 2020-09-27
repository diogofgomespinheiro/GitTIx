import dotenv from 'dotenv';

dotenv.config({ path: '.env.testing' });

export const config = {
  cookieSession: {
    signed: false,
    secure: true,
  },
  redisHost: process.env.REDIS_HOST,
  jwtKey: process.env.JWT_KEY || 'testing',
  natsClientId: 'abc',
  natsClusterId: 'ticketing',
  natsUrl: 'http://nats-srv:4222',
};
