export const config = {
  cookieSession: {
    signed: false,
    secure: true,
  },
  dbUrl: 'mongodb://auth-mongo-srv:27017/auth',
  jwtSecret: process.env.JWT_KEY,
};
