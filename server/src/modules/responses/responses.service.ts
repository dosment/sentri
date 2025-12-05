import { prisma } from '../../config/database.js';
import { ResponseStatus, ReviewStatus } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../lib/errors.js';

// Maximum age (in days) for a review to be eligible for auto-posting
// Reviews older than this will never be auto-approved, only manually approved
const AUTO_POST_MAX_AGE_DAYS = 7;

/**
 * Check if a review is recent enough for auto-posting
 */
function isReviewRecentEnough(reviewDate: Date, maxAgeDays: number = AUTO_POST_MAX_AGE_DAYS): boolean {
  const now = new Date();
  const ageInMs = now.getTime() - reviewDate.getTime();
  const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
  return ageInDays <= maxAgeDays;
}

export async function getResponse(responseId: string, businessId: string) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, businessId },
    include: {
      review: true,
    },
  });

  if (!response) {
    throw new NotFoundError('Response');
  }

  return response;
}

export async function updateResponse(
  responseId: string,
  businessId: string,
  data: { finalText?: string }
) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, businessId },
  });

  if (!response) {
    throw new NotFoundError('Response');
  }

  return prisma.response.update({
    where: { id: responseId },
    data: {
      finalText: data.finalText,
    },
  });
}

export async function approveResponse(
  responseId: string,
  businessId: string,
  approvedBy: string
) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, businessId },
    include: { review: true },
  });

  if (!response) {
    throw new NotFoundError('Response');
  }

  if (response.status !== ResponseStatus.DRAFT) {
    throw new ValidationError('Response is not in draft status');
  }

  const [updatedResponse] = await prisma.$transaction([
    prisma.response.update({
      where: { id: responseId },
      data: {
        status: ResponseStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
        finalText: response.finalText || response.generatedText,
      },
    }),
    prisma.review.update({
      where: { id: response.reviewId },
      data: { status: ReviewStatus.PENDING_RESPONSE },
    }),
  ]);

  return updatedResponse;
}

export async function createResponse(
  reviewId: string,
  businessId: string,
  generatedText: string
) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, businessId },
    include: {
      business: {
        select: {
          autoPostEnabled: true,
          autoPostThreshold: true,
          negativeThreshold: true,
        },
      },
    },
  });

  if (!review) {
    throw new NotFoundError('Review');
  }

  // Determine if this response should be auto-approved
  const isNegative = review.rating !== null && review.rating <= review.business.negativeThreshold;
  const isAboveThreshold = review.rating !== null && review.rating >= review.business.autoPostThreshold;

  // SAFEGUARD: Never auto-post to historical or old reviews
  // Historical reviews are those imported during first sync
  // Old reviews are those older than AUTO_POST_MAX_AGE_DAYS
  const isEligibleForAutoPost =
    !review.isHistorical &&
    isReviewRecentEnough(review.reviewDate);

  const shouldAutoApprove =
    review.business.autoPostEnabled &&
    isAboveThreshold &&
    !isNegative &&
    isEligibleForAutoPost;

  const existing = await prisma.response.findUnique({
    where: { reviewId },
  });

  if (existing) {
    const updatedResponse = await prisma.response.update({
      where: { id: existing.id },
      data: {
        generatedText,
        finalText: shouldAutoApprove ? generatedText : null,
        status: shouldAutoApprove ? ResponseStatus.APPROVED : ResponseStatus.DRAFT,
        approvedBy: shouldAutoApprove ? 'AUTO' : null,
        approvedAt: shouldAutoApprove ? new Date() : null,
      },
    });

    // If auto-approved, update review status
    if (shouldAutoApprove) {
      await prisma.review.update({
        where: { id: reviewId },
        data: { status: ReviewStatus.PENDING_RESPONSE },
      });
    }

    return updatedResponse;
  }

  const newResponse = await prisma.response.create({
    data: {
      reviewId,
      businessId,
      generatedText,
      finalText: shouldAutoApprove ? generatedText : null,
      status: shouldAutoApprove ? ResponseStatus.APPROVED : ResponseStatus.DRAFT,
      approvedBy: shouldAutoApprove ? 'AUTO' : null,
      approvedAt: shouldAutoApprove ? new Date() : null,
    },
  });

  // If auto-approved, update review status
  if (shouldAutoApprove) {
    await prisma.review.update({
      where: { id: reviewId },
      data: { status: ReviewStatus.PENDING_RESPONSE },
    });
  }

  return newResponse;
}
