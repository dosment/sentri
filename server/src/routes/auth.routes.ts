import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../modules/auth/auth.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { logger, AuditEvents } from '../lib/logger.js';

const router = Router();

// Password must have: 8+ chars, uppercase, lowercase, number
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function getClientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';
}

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);

    logger.audit(AuditEvents.AUTH_REGISTER, {
      dealerId: result.dealer.id,
      email: result.dealer.email,
      ip,
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  const email = req.body?.email || 'unknown';

  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);

    logger.audit(AuditEvents.AUTH_LOGIN_SUCCESS, {
      dealerId: result.dealer.id,
      email: result.dealer.email,
      ip,
    });

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    if (error instanceof Error && error.message === 'Invalid credentials') {
      logger.audit(AuditEvents.AUTH_LOGIN_FAILED, { email, ip });
      res.status(401).json({ error: error.message });
      return;
    }
    next(error);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dealer = await authService.getDealer(req.dealer!.id);
    res.json(dealer);
  } catch (error) {
    next(error);
  }
});

export default router;
