import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { JsonWebToken } from '@diogoptickets/shared';

declare global {
  namespace NodeJS {
    interface Global {
      generateFakeToken(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.generateFakeToken = () => {
  const payload = {
    id: 'ko213opo',
    email: 'asd@qqew.com',
  };

  const token = JsonWebToken.generateToken(payload);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64}`];
};
