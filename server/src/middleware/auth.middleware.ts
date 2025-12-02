import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';

export interface AuthRequest extends Request {
  dealer?: {
    id: string;
    email: string;
    name: string;
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
      dealerId: string;
      email: string;
    };

    const dealer = await prisma.dealer.findUnique({
      where: { id: payload.dealerId },
      select: { id: true, email: true, name: true },
    });

    if (!dealer) {
      res.status(401).json({ error: 'Dealer not found' });
      return;
    }

    req.dealer = dealer;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    next(error);
  }
}
