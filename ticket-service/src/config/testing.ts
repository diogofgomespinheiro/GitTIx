import dotenv from 'dotenv';

dotenv.config({ path: '.env.testing' });

export const config = {
  cookieSession: {
    signed: false,
    secure: true,
  },
  jwtKey: process.env.JWT_KEY || 'testing',
};
