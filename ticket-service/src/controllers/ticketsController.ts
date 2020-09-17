import { Request, Response } from 'express';

import { BadRequestError, JsonWebToken } from '@diogoptickets/shared';

class TicketsController {
  static async createTicket(req: Request, res: Response) {
    res.sendStatus(200);
  }
}

export default TicketsController;
