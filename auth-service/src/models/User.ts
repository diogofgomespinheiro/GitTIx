import mongoose, { Model, Document } from 'mongoose';
import { Bcrypt } from '@utils/bcrypt';
import { BadRequestError } from '@diogoptickets/shared';

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

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

userSchema.pre('save', async function (done) {
  try {
    if (this.isModified('password')) {
      const hashedPassword = await Bcrypt.hashPassword(this.get('password'));
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

export { User, IUserDoc };
