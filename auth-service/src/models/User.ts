import mongoose, { Model, Document } from 'mongoose';
import { hash, genSalt } from 'bcryptjs';
import { BadRequestError } from '@errors/BadRequestError';

interface IUserDoc extends Document {
  email: string;
  password: string;
}

interface IUserAttrs {
  email: string;
  password: string;
}

interface IUserModel extends Model<IUserDoc> {
  build(attrs: IUserAttrs): IUserDoc;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  try {
    if (this.isModified('password')) {
      const salt = await genSalt(10);
      const hashedPassword = await hash(this.get('password'), salt);
      this.set('password', hashedPassword);
    }
    done();
  } catch (err) {
    throw new BadRequestError('Error creating the user');
  }
});

userSchema.statics.build = (attrs: IUserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User };
