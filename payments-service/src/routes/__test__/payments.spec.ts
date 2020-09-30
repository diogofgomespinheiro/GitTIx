import request from 'supertest';
import mongoose from 'mongoose';

import { Order, OrderStatus } from '@models/Order';
import { Payment } from '@models/Payment';
import { paymentsRouter } from '@routes/payments';
import { stripe } from '@utils/stripe';
import { natsWrapper } from '@utils/natsWrapper';
import { app } from '../../app';
import config from '@config/';

jest.mock('@utils/natsWrapper');

describe('Orders Router', () => {
  it(`should have crud routes`, () => {
    const routes = [{ path: '', method: 'post' }];

    routes.forEach(route => {
      const match = paymentsRouter.stack.find(
        s => s.route.path === route.path && s.route.methods[route.method],
      );

      expect(match).toBeTruthy();
    });
  });

  describe('==> POST /api/payments', () => {
    it('should return 401 if the user it`s not authenticated', async () => {
      await request(app).post('/api/payments').send({}).expect(401);
    });

    it('should return some status other than 401 if the user it`s authenticated', async () => {
      const token = global.generateFakeToken();
      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', token)
        .send({});

      expect(response.status).not.toEqual(401);
    });

    it('should return 404 if the order does not exist', async () => {
      const token = global.generateFakeToken();

      const orderId = new mongoose.Types.ObjectId();
      await request(app)
        .post('/api/payments')
        .set('Cookie', token)
        .send({ orderId, token: '123' })
        .expect(404);
    });

    it('should return 401 if the user doesnt not own the order', async () => {
      const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 25,
        status: OrderStatus.Created,
        userId: '123',
        version: 0,
      });
      await order.save();

      const token = global.generateFakeToken();
      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', token)
        .send({ orderId: order.id, token: '123' });

      expect(response.status).toEqual(401);
    });

    it('should return 400 if the order status it`s cancelled', async () => {
      const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 25,
        status: OrderStatus.Cancelled,
        userId: '123',
        version: 0,
      });
      await order.save();

      const token = global.generateFakeToken('123');
      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', token)
        .send({ orderId: order.id, token: '123' });

      expect(response.status).toEqual(400);
    });

    it('should return 201 if all inputs are valid', async () => {
      const price = Math.floor(Math.random() * 100000);
      const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price,
        status: OrderStatus.Created,
        userId: '123',
        version: 0,
      });
      await order.save();

      const token = global.generateFakeToken('123');
      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', token)
        .send({ orderId: order.id, token: 'tok_visa' });

      expect(natsWrapper.client.publish).toHaveBeenCalled();
      expect(response.status).toEqual(201);

      const stripeCharges = await stripe.charges.list({ limit: 50 });

      const stripeCharge = stripeCharges.data.find(
        charge => charge.amount === price * 100,
      );

      expect(stripeCharge).toBeDefined();
      expect(stripeCharge?.currency).toBe(config.stripeCurrency);

      const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge?.id,
      });

      expect(payment).not.toBeNull();
    });
  });
});
