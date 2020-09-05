import { User } from '@models/User';

describe('User Model', () => {
  describe('Schema', () => {
    test('email', () => {
      const email = User.schema.obj.email;

      expect(email).toEqual({
        type: String,
        required: true,
      });
    });

    test('password', () => {
      const password = User.schema.obj.password;

      expect(password).toEqual({
        type: String,
        required: true,
      });
    });
  });

  describe('User build', () => {
    it('should return valid user', () => {
      const user = User.build({ email: 'test@test.com', password: 'password' });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@test.com');
      expect(user.password).toBe('password');
    });
  });
});
