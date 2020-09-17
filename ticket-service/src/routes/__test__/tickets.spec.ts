import { ticketsRouter } from '@routes/tickets';
import request from 'supertest';
import { app } from '../../app';

describe('tickets router', () => {
  it(`should have crud routes`, () => {
    const routes = [
      // { path: '', method: 'get' },
      // { path: '/:id', method: 'get' },
      { path: '', method: 'post' },
      // { path: '', method: 'put' },
    ];

    routes.forEach(route => {
      const match = ticketsRouter.stack.find(
        s => s.route.path === route.path && s.route.methods[route.method],
      );
      expect(match).toBeTruthy();
    });
  });

  describe('tickets creation', () => {
    it('can only be accessed if the user is signed', async () => {
      await request(app).post('/api/tickets').send({}).expect(401);
    });

    it('returns a status other than 401 if the user it`s signed in', async () => {
      console.log(process.env.JWT_KEY);
      const token = global.generateFakeToken();
      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({});

      expect(response.status).not.toEqual(401);
    });

    it('returns an error if an invalid title is provided', async () => {});

    it('returns an error if an invalid price is provided', async () => {});

    it('creates a ticket with valid inputs', async () => {});
  });
});
