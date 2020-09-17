import config from '@config/index';
import mongoose from 'mongoose';

export class Mongo {
  static async connectToDb(url = config.dbUrl, opts = {}) {
    try {
      console.log(`Connecting to MongoDB on ${url}`);
      await mongoose.connect(url, {
        ...opts,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log('Connected to MongoDB...');
    } catch (err) {
      console.error(err);
    }
  }
}
