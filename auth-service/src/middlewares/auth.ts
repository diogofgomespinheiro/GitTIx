import { Request, Response, NextFunction } from 'express';

import { JsonWebToken } from '@utils/jwt';
import { NotAuthorizedError } from '@errors/NotAuthorizedError';

interface UserPayload {
  id: string;
  email: string;
}

declare module 'express' {
  export interface Request {
    currentUser?: UserPayload;
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentJwt = req.session?.jwt;

  if (!currentJwt) {
    return next();
  }

  try {
    const payload = JsonWebToken.verifyToken(currentJwt) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
