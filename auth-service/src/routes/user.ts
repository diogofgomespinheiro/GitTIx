import express from 'express';
import { body } from 'express-validator';

import userController from '@controllers/userController';
import { validateRequest, currentUser } from '@diogoptickets/shared';

const router = express.Router();

router.get('/currentUser', currentUser, userController.getCurrentUser);

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email!'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  validateRequest,
  userController.createUser,
);

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password.'),
  ],
  validateRequest,
  userController.signIn,
);

router.post('/signout', userController.signOut);

export { router as userRouter };
