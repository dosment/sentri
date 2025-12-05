import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as reviewsService from '../modules/reviews/reviews.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { ReviewStatus, Platform } from '@prisma/client';

const router = Router();

router.use(authenticate);

const filtersSchema = z.object({
  status: z.nativeEnum(ReviewStatus).optional(),
  platform: z.nativeEnum(Platform).optional(),
  hasResponse: z.enum(['true', 'false']).optional().transform((v) => v === 'true' ? true : v === 'false' ? false : undefined),
  includeOld: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(ReviewStatus),
});

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, ...filters } = filtersSchema.parse(req.query);
    const result = await reviewsService.getReviews(req.business!.id, filters, { page, limit });
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid filters', details: error.errors });
      return;
    }
    next(error);
  }
});

router.get('/stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await reviewsService.getReviewStats(req.business!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/reporting-stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await reviewsService.getReportingStats(req.business!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await reviewsService.getReview(req.params.id, req.business!.id);
    res.json(review);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = updateStatusSchema.parse(req.body);
    const review = await reviewsService.updateReviewStatus(
      req.params.id,
      req.business!.id,
      status
    );
    res.json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
