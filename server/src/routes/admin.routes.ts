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

const createBusinessSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(1),
  phone: z.string().optional(),
  businessType: z.enum([
    'RESTAURANT', 'SALON_SPA', 'MEDICAL_OFFICE', 'DENTAL_OFFICE',
    'LEGAL_SERVICES', 'HOME_SERVICES', 'RETAIL', 'AUTOMOTIVE',
    'FITNESS', 'HOSPITALITY', 'OTHER'
  ]).optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  customInstructions: z.string().optional(),
});

const updateBusinessSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  businessType: z.enum([
    'RESTAURANT', 'SALON_SPA', 'MEDICAL_OFFICE', 'DENTAL_OFFICE',
    'LEGAL_SERVICES', 'HOME_SERVICES', 'RETAIL', 'AUTOMOTIVE',
    'FITNESS', 'HOSPITALITY', 'OTHER'
  ]).optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  customInstructions: z.string().optional(),
});

// GET /api/admin/businesses - List all businesses
router.get('/businesses', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessType: true,
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

    res.json(businesses);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/businesses - Create new business
router.post('/businesses', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = createBusinessSchema.parse(req.body);

    // Check if email exists
    const existing = await prisma.business.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const business = await prisma.business.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        phone: input.phone,
        businessType: input.businessType || 'OTHER',
        plan: input.plan || 'STARTER',
        customInstructions: input.customInstructions,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessType: true,
        plan: true,
        createdAt: true,
      },
    });

    res.status(201).json(business);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

// GET /api/admin/businesses/:id - Get business details
router.get('/businesses/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessType: true,
        plan: true,
        isAdmin: true,
        customInstructions: true,
        voiceProfile: true,
        autoPostThreshold: true,
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

    if (!business) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }

    // Get review stats
    const reviewStats = await prisma.review.groupBy({
      by: ['status'],
      where: { businessId: req.params.id },
      _count: { status: true },
    });

    const responseStats = await prisma.response.groupBy({
      by: ['status'],
      where: { businessId: req.params.id },
      _count: { status: true },
    });

    res.json({
      ...business,
      reviewStats: reviewStats.reduce((acc, s) => ({ ...acc, [s.status]: s._count.status }), {}),
      responseStats: responseStats.reduce((acc, s) => ({ ...acc, [s.status]: s._count.status }), {}),
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/businesses/:id - Update business
router.patch('/businesses/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateBusinessSchema.parse(req.body);

    const business = await prisma.business.update({
      where: { id: req.params.id },
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessType: true,
        plan: true,
        customInstructions: true,
        updatedAt: true,
      },
    });

    res.json(business);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
