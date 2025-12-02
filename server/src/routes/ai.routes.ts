import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as aiService from '../modules/ai/ai.service.js';
import * as responsesService from '../modules/responses/responses.service.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { logger, AuditEvents } from '../lib/logger.js';

const router = Router();

router.use(authenticate);

const generateSchema = z.object({
  reviewId: z.string().uuid(),
});

router.post('/generate', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = generateSchema.parse(req.body);

    const generatedText = await aiService.generateResponseForReview(
      reviewId,
      req.dealer!.id
    );

    const response = await responsesService.createResponse(
      reviewId,
      req.dealer!.id,
      generatedText
    );

    logger.audit(AuditEvents.RESPONSE_GENERATED, {
      responseId: response.id,
      reviewId,
      dealerId: req.dealer!.id,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    if (error instanceof Error) {
      if (error.message === 'Review not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'GEMINI_API_KEY not configured') {
        res.status(503).json({ error: 'AI service not configured' });
        return;
      }
    }
    next(error);
  }
});

router.post('/regenerate/:responseId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const existingResponse = await responsesService.getResponse(
      req.params.responseId,
      req.dealer!.id
    );

    const generatedText = await aiService.generateResponseForReview(
      existingResponse.reviewId,
      req.dealer!.id
    );

    const response = await responsesService.createResponse(
      existingResponse.reviewId,
      req.dealer!.id,
      generatedText
    );

    logger.audit(AuditEvents.RESPONSE_GENERATED, {
      responseId: response.id,
      reviewId: existingResponse.reviewId,
      dealerId: req.dealer!.id,
      regenerated: true,
    });

    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Response not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Review not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'GEMINI_API_KEY not configured') {
        res.status(503).json({ error: 'AI service not configured' });
        return;
      }
    }
    next(error);
  }
});

export default router;
