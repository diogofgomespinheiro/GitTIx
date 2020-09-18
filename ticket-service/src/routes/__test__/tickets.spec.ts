import { Ticket } from '@models/Ticket';
import { ticketsRouter } from '@routes/tickets';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

const createTicket = () => {
  const token = global.generateFakeToken();
  return request(app)['post']('/api/tickets').set('Cookie', token).send({
    title: 'title',
    price: 10,
  });
};

describe('Tickets Router', () => {
  it(`should have crud routes`, () => {
    const routes = [
      { path: '', method: 'get' },
      { path: '', method: 'post' },
      { path: '/:id', method: 'get' },
      { path: '/:id', method: 'put' },
    ];

    routes.forEach(route => {
      const match = ticketsRouter.stack.find(
        s => s.route.path === route.path && s.route.methods[route.method],
      );
      expect(match).toBeTruthy();
    });
  });

  describe('==> POST /api/tickets', () => {
    it('should return 401 if the user it`s not authenticated', async () => {
      await request(app).post('/api/tickets').send({}).expect(401);
    });

    it('should return some status other than 401 if the user it`s authenticated', async () => {
      const token = global.generateFakeToken();
      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({});

      expect(response.status).not.toEqual(401);
    });

    it('should return an error if an invalid title is provided', async () => {
      const token = global.generateFakeToken();
      await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
          price: 10,
        })
        .expect(400);

      await request(app)
        ['post']('/api/tickets')
        .set('Cookie', token)
        .send({
          title: '',
          price: 10,
        })
        .expect(400);
    });

    it('should return an error if an invalid price is provided', async () => {
      const token = global.generateFakeToken();
      await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
          title: 'wkeqkjl',
        })
        .expect(400);

      await request(app)
        ['post']('/api/tickets')
        .set('Cookie', token)
        .send({
          title: 'wqewqe',
          price: -10,
        })
        .expect(400);
    });

    it('should create a ticket with valid inputs', async () => {
      let tickets = await Ticket.find({});
      expect(tickets.length).toEqual(0);

      const token = global.generateFakeToken();
      await request(app)
        ['post']('/api/tickets')
        .set('Cookie', token)
        .send({
          title: 'title',
          price: 10,
        })
        .expect(201);

      tickets = await Ticket.find({});
      expect(tickets.length).toEqual(1);
      expect(tickets[0].title).toEqual('title');
      expect(tickets[0].price).toEqual(10);
    });
  });

  describe('==> GET /api/tickets', () => {
    it('should return an empty array if there is no tickets', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

      expect(response.body.length).toEqual(0);
    });

    it('should fetch a list of tickets', async () => {
      await createTicket();
      await createTicket();
      await createTicket();
      await createTicket();
      await createTicket();

      const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

      expect(response.body.length).toEqual(5);
    });
  });

  describe('==> GET /api/tickets/:id', () => {
    it('should throw a 404 if a ticket it`s not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toHexString();
      await request(app).get(`/api/tickets/${fakeId}`).send().expect(404);
    });

    it('should return a ticket if it`s found', async () => {
      const title = 'title';
      const price = 20;

      const token = global.generateFakeToken();

      const createdTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({
          title,
          price,
        })
        .expect(201);

      const foundTicketResponse = await request(app)
        .get(`/api/tickets/${createdTicketResponse.body.id}`)
        .set('Cookie', token)
        .send()
        .expect(200);

      expect(foundTicketResponse.body.title).toEqual(title);
      expect(foundTicketResponse.body.price).toEqual(price);
    });
  });

  describe('==> PUT /api/tickets', () => {
    it('should return 404 if the provided ticket id does not exist', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const token = global.generateFakeToken();

      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          title: 'title',
          price: 20,
        })
        .expect(404);
    });

    it('should return 401 if the user is not authenticated', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();

      await request(app)
        .put(`/api/tickets/${id}`)
        .send({
          title: 'title',
          price: 20,
        })
        .expect(401);
    });

    it('should return 401 if the user does not own the ticket', async () => {
      const newTicketResponse = await createTicket();

      const { id } = newTicketResponse.body;
      const token = global.generateFakeToken('testing');

      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          title: 'title',
          price: 20,
        })
        .expect(401);
    });

    it('should return 400 if the user provides an invalid title', async () => {
      const newTicketResponse = await createTicket();

      const { id } = newTicketResponse.body;
      const token = global.generateFakeToken();

      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          price: 20,
        })
        .expect(400);

      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          title: '',
          price: 20,
        })
        .expect(400);
    });

    it('should return 400 if the user provides an invalid price', async () => {
      const newTicketResponse = await createTicket();

      const { id } = newTicketResponse.body;
      const token = global.generateFakeToken();

      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          title: 'title',
        })
        .expect(400);

      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          title: 'title',
          price: -20,
        })
        .expect(400);
    });

    it('should update the ticket if all the inputs are valid', async () => {
      const newTicketResponse = await createTicket();

      const { id } = newTicketResponse.body;
      const token = global.generateFakeToken();

      const title = 'new title';
      const price = 55;

      const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', token)
        .send({
          title,
          price,
        })
        .expect(200);

      expect(response.body.title).toEqual(title);
      expect(response.body.price).toEqual(price);
    });
  });
});
