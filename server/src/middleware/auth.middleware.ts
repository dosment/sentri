import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';

export interface AuthRequest extends Request {
  business?: {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const token = authHeader.slice(7);

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      businessId: string;
      email: string;
    };

    const business = await prisma.business.findUnique({
      where: { id: payload.businessId },
      select: { id: true, email: true, name: true, isAdmin: true },
    });

    if (!business) {
      res.status(401).json({ error: 'Business not found' });
      return;
    }

    req.business = business;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    next(error);
  }
}
