export const config = {
  cookieSession: {
    signed: false,
    secure: true,
  },
  redisHost: process.env.REDIS_HOST,
  jwtKey: process.env.JWT_KEY,
  natsClientId: process.env.NATS_CLIENT_ID,
  natsClusterId: process.env.NATS_CLUSTER_ID,
  natsUrl: process.env.NATS_URL,
};
