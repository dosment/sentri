import { prisma } from '../../config/database.js';
import { NotFoundError, ValidationError } from '../../lib/errors.js';

export interface BusinessSettings {
  autoPostEnabled: boolean;
  autoPostThreshold: number;
  negativeThreshold: number;
  responseTone: string;
  signOffName: string | null;
  signOffTitle: string | null;
  googleReviewUrl: string | null;
  phone: string | null;
  hideOldReviews: boolean;
  oldReviewThresholdDays: number;
}

export interface UpdateSettingsInput {
  autoPostEnabled?: boolean;
  autoPostThreshold?: number;
  negativeThreshold?: number;
  responseTone?: string;
  signOffName?: string | null;
  signOffTitle?: string | null;
  googleReviewUrl?: string | null;
  phone?: string | null;
  hideOldReviews?: boolean;
  oldReviewThresholdDays?: number;
}

export async function getSettings(businessId: string): Promise<BusinessSettings> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      autoPostEnabled: true,
      autoPostThreshold: true,
      negativeThreshold: true,
      responseTone: true,
      signOffName: true,
      signOffTitle: true,
      googleReviewUrl: true,
      phone: true,
      hideOldReviews: true,
      oldReviewThresholdDays: true,
    },
  });

  if (!business) {
    throw new NotFoundError('Business');
  }

  return business;
}

export async function updateSettings(
  businessId: string,
  input: UpdateSettingsInput
): Promise<BusinessSettings> {
  // Validate input ranges
  if (input.autoPostThreshold !== undefined) {
    if (input.autoPostThreshold < 1 || input.autoPostThreshold > 5) {
      throw new ValidationError('autoPostThreshold must be between 1 and 5');
    }
  }

  if (input.negativeThreshold !== undefined) {
    if (input.negativeThreshold < 1 || input.negativeThreshold > 5) {
      throw new ValidationError('negativeThreshold must be between 1 and 5');
    }
  }

  if (input.responseTone !== undefined) {
    if (!['professional', 'neighborly', 'casual', 'humorous'].includes(input.responseTone)) {
      throw new ValidationError('responseTone must be "professional", "neighborly", "casual", or "humorous"');
    }
  }

  // Validate old review threshold (1-365 days)
  if (input.oldReviewThresholdDays !== undefined) {
    if (input.oldReviewThresholdDays < 1 || input.oldReviewThresholdDays > 365) {
      throw new ValidationError('oldReviewThresholdDays must be between 1 and 365');
    }
  }

  // Validate Google review URL format if provided
  if (input.googleReviewUrl !== undefined && input.googleReviewUrl !== null) {
    const urlPattern = /^https:\/\/(www\.)?google\.com\/maps|^https:\/\/g\.page|^https:\/\/search\.google\.com\/local/;
    if (!urlPattern.test(input.googleReviewUrl)) {
      throw new ValidationError('Invalid Google review URL format');
    }
  }

  const business = await prisma.business.update({
    where: { id: businessId },
    data: input,
    select: {
      autoPostEnabled: true,
      autoPostThreshold: true,
      negativeThreshold: true,
      responseTone: true,
      signOffName: true,
      signOffTitle: true,
      googleReviewUrl: true,
      phone: true,
      hideOldReviews: true,
      oldReviewThresholdDays: true,
    },
  });

  return business;
}
