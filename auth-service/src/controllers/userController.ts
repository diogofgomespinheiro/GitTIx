import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { BadRequestError } from '@errors/BadRequestError';
import { RequestValidationError } from '@errors/RequestValidationError';
import { User } from '@models/User';

class UserController {
  static async getCurrentUser(req: Request, res: Response) {
    res.send('Testing Get User');
  }

  static async createUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('User already exists.');
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).json(user);
  }
}

export default UserController;
