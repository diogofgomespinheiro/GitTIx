import { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@diogoptickets/shared';

import { stripe } from '@utils/stripe';
import config from '@config/';
import { Order, OrderStatus } from '@models/Order';
import { Payment } from '@models/Payment';
import { PaymentCreatedPublisher } from '@publishers/';
import { natsWrapper } from '@utils/natsWrapper';

class OrdersController {
  static async store(req: Request, res: Response) {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const stripeBody = {
      source: token,
      amount: order.price * 100,
      currency: config.stripeCurrency,
    };

    const charge = await stripe.charges.create(stripeBody);

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({ id: payment.id });
  }
}

export default OrdersController;
