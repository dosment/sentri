import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as settingsService from '../modules/settings/settings.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

const updateSettingsSchema = z.object({
  autoPostEnabled: z.boolean().optional(),
  autoPostThreshold: z.number().min(1).max(5).optional(),
  negativeThreshold: z.number().min(1).max(5).optional(),
  responseTone: z.enum(['professional', 'neighborly']).optional(),
  signOffName: z.string().nullable().optional(),
  signOffTitle: z.string().nullable().optional(),
});

// GET /api/settings - Get dealer settings
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getSettings(req.dealer!.id);
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/settings - Update dealer settings
router.patch('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSettingsSchema.parse(req.body);
    const settings = await settingsService.updateSettings(req.dealer!.id, input);
    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
