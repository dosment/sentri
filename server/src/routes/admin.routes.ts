import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

// All admin routes require authentication and admin status
router.use(authenticate);
router.use(requireAdmin);

// Password must have: 8+ chars, uppercase, lowercase, number
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

const createDealerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(1),
  phone: z.string().optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  customInstructions: z.string().optional(),
});

const updateDealerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  customInstructions: z.string().optional(),
});

// GET /api/admin/dealers - List all dealers
router.get('/dealers', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dealers = await prisma.dealer.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        plan: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            responses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(dealers);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/dealers - Create new dealer
router.post('/dealers', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = createDealerSchema.parse(req.body);

    // Check if email exists
    const existing = await prisma.dealer.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const dealer = await prisma.dealer.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        phone: input.phone,
        plan: input.plan || 'STARTER',
        customInstructions: input.customInstructions,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        plan: true,
        createdAt: true,
      },
    });

    res.status(201).json(dealer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

// GET /api/admin/dealers/:id - Get dealer details
router.get('/dealers/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dealer = await prisma.dealer.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        plan: true,
        isAdmin: true,
        customInstructions: true,
        voiceProfile: true,
        autoApproveThreshold: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reviews: true,
            responses: true,
          },
        },
      },
    });

    if (!dealer) {
      res.status(404).json({ error: 'Dealer not found' });
      return;
    }

    // Get review stats
    const reviewStats = await prisma.review.groupBy({
      by: ['status'],
      where: { dealerId: req.params.id },
      _count: { status: true },
    });

    const responseStats = await prisma.response.groupBy({
      by: ['status'],
      where: { dealerId: req.params.id },
      _count: { status: true },
    });

    res.json({
      ...dealer,
      reviewStats: reviewStats.reduce((acc, s) => ({ ...acc, [s.status]: s._count.status }), {}),
      responseStats: responseStats.reduce((acc, s) => ({ ...acc, [s.status]: s._count.status }), {}),
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/dealers/:id - Update dealer
router.patch('/dealers/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateDealerSchema.parse(req.body);

    const dealer = await prisma.dealer.update({
      where: { id: req.params.id },
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        plan: true,
        customInstructions: true,
        updatedAt: true,
      },
    });

    res.json(dealer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
