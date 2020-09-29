import mongoose, { Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@diogoptickets/shared';
interface IOrderAttrs {
  id: string;
  price: number;
  status: OrderStatus;
  userId: string;
  version: number;
}

interface IOrderDoc extends Document {
  price: number;
  status: OrderStatus;
  userId: string;
  version: number;
}

interface IOrderModel extends Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<IOrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    userId: {
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = ({ id, ...attrs }: IOrderAttrs) => {
  return new Order({
    _id: id,
    ...attrs,
  });
};

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order, IOrderDoc, OrderStatus, IOrderAttrs };
