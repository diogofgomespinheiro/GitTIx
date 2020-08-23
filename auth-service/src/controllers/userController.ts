import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

class UserController {
  static async getCurrentUser(req: Request, res: Response) {
    res.send('Testing Get User');
  };

  static async createUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Invalid email or password');
      
      return res.status(400).send(errors.array());
    }

    const { email, password } = req.body;

    console.log('Creating a user...');

    res.send({});
  }
};

export default UserController;