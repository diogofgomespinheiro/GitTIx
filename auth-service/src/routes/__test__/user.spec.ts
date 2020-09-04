import request from 'supertest';
import { app } from '../../app';

describe('user router', () => {
  it(`should return 201 on successfull signup`, async done => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
    done();
  }, 30000);
});
