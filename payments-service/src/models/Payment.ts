import mongoose, { Document } from 'mongoose';

interface IPaymentAtrrs {
  orderId: string;
  stripeId: string;
}

interface IPaymentDoc extends Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<IPaymentDoc> {
  build(attrs: IPaymentAtrrs): IPaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

paymentSchema.statics.build = (attrs: IPaymentAtrrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<IPaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema,
);

export { Payment };
