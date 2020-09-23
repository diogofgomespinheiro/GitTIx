import express from 'express';
import asynchandler from 'express-async-handler';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@diogoptickets/shared';

import ordersController from '@controllers/ordersController';

const router = express.Router();

router.get('', requireAuth, asynchandler(ordersController.index));

router.get('/:id', requireAuth, asynchandler(ordersController.show));

router.post(
  '',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('TicketId must be provided')],
  validateRequest,
  asynchandler(ordersController.store),
);

router.delete('/:id', requireAuth, asynchandler(ordersController.destroy));

export { router as ordersRouter };
