import jwt from 'jsonwebtoken';
import config from '@config/index';
import { IUserDoc } from '@models/User';

export class JsonWebToken {
  static generateToken(user: IUserDoc): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      config.jwtSecret,
    );
  }
}
