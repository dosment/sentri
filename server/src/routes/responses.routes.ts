import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as responsesService from '../modules/responses/responses.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { logger, AuditEvents } from '../lib/logger.js';

const router = Router();

router.use(authenticate);

const updateSchema = z.object({
  finalText: z.string().optional(),
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const response = await responsesService.getResponse(req.params.id, req.dealer!.id);
    res.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === 'Response not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = updateSchema.parse(req.body);
    const response = await responsesService.updateResponse(
      req.params.id,
      req.dealer!.id,
      data
    );

    logger.audit(AuditEvents.RESPONSE_EDITED, {
      responseId: req.params.id,
      dealerId: req.dealer!.id,
      dealerEmail: req.dealer!.email,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    if (error instanceof Error && error.message === 'Response not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
});

router.post('/:id/approve', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const response = await responsesService.approveResponse(
      req.params.id,
      req.dealer!.id,
      req.dealer!.email
    );

    logger.audit(AuditEvents.RESPONSE_APPROVED, {
      responseId: req.params.id,
      reviewId: response.reviewId,
      dealerId: req.dealer!.id,
      dealerEmail: req.dealer!.email,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Response not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Response is not in draft status') {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
});

export default router;
