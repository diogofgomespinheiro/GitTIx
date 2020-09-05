import { userRouter } from '@routes/user';

describe('user router', () => {
  it(`should have crud routes`, () => {
    const routes = [
      { path: '/currentUser', method: 'get' },
      { path: '/signup', method: 'post' },
      { path: '/signin', method: 'post' },
      { path: '/signout', method: 'post' },
    ];

    routes.forEach(route => {
      const match = userRouter.stack.find(
        s => s.route.path === route.path && s.route.methods[route.method],
      );
      expect(match).toBeTruthy();
    });
  });
});
