import express from 'express';
import { body } from 'express-validator';

import userController from '../controllers/userController';

const router = express.Router();

router.get('/currentUser', userController.getCurrentUser);

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters.')
  ],
  userController.createUser
  );

router.post('/signin', (req, res) => res.send('Diogo'));
router.post('/signout', (req, res) => res.send('Diogo'));

export { router as userRouter };


