export const config = {
  cookieSession: {
    signed: false,
    secure: true,
  },
  dbUrl: 'mongodb://ticket-mongo-srv:27017/auth',
  jwtKey: process.env.JWT_KEY,
};
