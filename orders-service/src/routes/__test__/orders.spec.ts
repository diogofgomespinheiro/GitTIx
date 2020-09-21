import request from 'supertest';
import mongoose from 'mongoose';
import { natsWrapper } from '@utils/natsWrapper';

import { Order, OrderStatus, IOrderDoc, IOrderAttrs } from '@models/Order';
import { Ticket, ITicketDoc, ITicketAttrs } from '@models/Ticket';
import { ordersRouter } from '@routes/orders';
import { app } from '../../app';

jest.mock('../../utils/natsWrapper');

const createTicket = async (body: ITicketAttrs): Promise<ITicketDoc> => {
  const ticket = Ticket.build(body);

  await ticket.save();

  return ticket;
};

const createOrder = async (body: IOrderAttrs): Promise<IOrderDoc> => {
  const order = Order.build(body);

  await order.save();

  return order;
};

describe('Orders Router', () => {
  it(`should have crud routes`, () => {
    const routes = [
      { path: '', method: 'get' },
      { path: '/:id', method: 'get' },
      { path: '', method: 'post' },
      { path: '/:id', method: 'delete' },
    ];

    routes.forEach(route => {
      const match = ordersRouter.stack.find(
        s => s.route.path === route.path && s.route.methods[route.method],
      );

      expect(match).toBeTruthy();
    });
  });

  describe('==> GET /api/orders', () => {
    it('should return 401 if the user it`s not authenticated', async () => {
      await request(app).post('/api/orders').send({}).expect(401);
    });

    it('should return some status other than 401 if the user it`s authenticated', async () => {
      const token = global.generateFakeToken();
      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', token)
        .send({});

      expect(response.status).not.toEqual(401);
    });

    it('should return all the orders that belong to the user', async () => {
      const ticketOne = await createTicket({
        title: 'ticket 1',
        price: 20,
      });

      const ticketTwo = await createTicket({
        title: 'ticket 2',
        price: 20,
      });

      const ticketThree = await createTicket({
        title: 'ticket 3',
        price: 20,
      });

      const userOneToken = global.generateFakeToken('userOne');
      const userTwoToken = global.generateFakeToken('userTwo');

      await request(app)
        .post('/api/orders')
        .set('Cookie', userOneToken)
        .send({ ticketId: ticketOne.id })
        .expect(201);
      const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwoToken)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
      const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwoToken)
        .send({ ticketId: ticketThree.id })
        .expect(201);

      const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwoToken)
        .expect(200);

      expect(response.body.length).toEqual(2);
      expect(response.body[0].id).toEqual(orderOne.id);
      expect(response.body[1].id).toEqual(orderTwo.id);
    });
  });

  describe('==> GET /api/orders/:id', () => {});

  describe('==> POST /api/orders', () => {
    it('should return 401 if the user it`s not authenticated', async () => {
      await request(app).post('/api/orders').send({}).expect(401);
    });

    it('should return some status other than 401 if the user it`s authenticated', async () => {
      const token = global.generateFakeToken();
      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', token)
        .send({});

      expect(response.status).not.toEqual(401);
    });

    it('should return 404 if the ticket does not exist', async () => {
      const token = global.generateFakeToken();

      const ticketId = new mongoose.Types.ObjectId();
      await request(app)
        .post('/api/orders')
        .set('Cookie', token)
        .send({ ticketId })
        .expect(404);
    });

    it('should an error if the ticket it`s already reserved', async () => {
      const ticket = await createTicket({
        title: 'concert',
        price: 20,
      });

      const token = global.generateFakeToken();

      const ticketId = ticket.id;

      await createOrder({
        ticket,
        userId: 'qwewqe',
        status: OrderStatus.Created,
        expiresAt: new Date(),
      });

      await request(app)
        .post('/api/orders')
        .set('Cookie', token)
        .send({ ticketId })
        .expect(400);
    });

    it('should reserve a ticket', async () => {
      const ticket = await createTicket({
        title: 'concert',
        price: 20,
      });

      const token = global.generateFakeToken();

      const ticketId = ticket.id;

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', token)
        .send({ ticketId })
        .expect(201);

      expect(response.body.status).toEqual(OrderStatus.Created);
      expect(response.body.ticket.title).toEqual(ticket.title);
      expect(response.body.ticket.price).toEqual(ticket.price);
    });

    it.todo('emits an order created event');
  });

  describe('==> DELETE /api/orders/:id', () => {});
});
