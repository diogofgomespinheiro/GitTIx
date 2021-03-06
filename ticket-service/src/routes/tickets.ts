import express from 'express';
import { body } from 'express-validator';
import asynchandler from 'express-async-handler';
import { validateRequest, requireAuth } from '@diogoptickets/shared';

import ticketsController from '@controllers/ticketsController';

const router = express.Router();

router.post(
  '',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  asynchandler(ticketsController.store),
);

router.get('', asynchandler(ticketsController.index));

router.get('/:id', asynchandler(ticketsController.show));

router.put(
  '/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  asynchandler(ticketsController.update),
);

export { router as ticketsRouter };
