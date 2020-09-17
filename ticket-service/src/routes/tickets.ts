import express from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth } from '@diogoptickets/shared';

import ticketsController from '@controllers/ticketsController';

const router = express.Router();

router.post('', requireAuth, ticketsController.createTicket);

export { router as ticketsRouter };
