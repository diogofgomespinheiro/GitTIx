import express from 'express';
import asynchandler from 'express-async-handler';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@diogoptickets/shared';

import paymentsController from '@controllers/paymentsController';

const router = express.Router();

router.post(
  '',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Token must be provided.'),
    body('orderId').not().isEmpty().withMessage('OrderId must be provided.'),
  ],
  validateRequest,
  asynchandler(paymentsController.store),
);

export { router as paymentsRouter };
