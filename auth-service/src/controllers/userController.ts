import { Request, Response } from 'express';

import { BadRequestError } from '@diogoptickets/shared';
import { JsonWebToken } from '@utils/jwt';
import { Bcrypt } from '@utils/bcrypt';
import { User } from '@models/User';

class UserController {
  static async getCurrentUser(req: Request, res: Response) {
    res.json({ currentUser: req.currentUser || null });
  }

  static async createUser(req: Request, res: Response) {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('User already exists.');
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = JsonWebToken.generateToken(user);

    req.session = {
      jwt: userJwt,
    };

    res.status(201).json(user);
  }

  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Bcrypt.comparePasswords(
      password,
      existingUser.password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = JsonWebToken.generateToken(existingUser);

    req.session = {
      jwt: userJwt,
    };

    res.status(200).json(existingUser);
  }

  static signOut(req: Request, res: Response) {
    req.session = null;

    res.send({});
  }
}

export default UserController;
