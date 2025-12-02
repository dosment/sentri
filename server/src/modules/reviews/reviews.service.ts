import { prisma } from '../../config/database.js';
import { ReviewStatus, Platform } from '@prisma/client';

export interface ReviewFilters {
  status?: ReviewStatus;
  platform?: Platform;
  hasResponse?: boolean;
}

export async function getReviews(dealerId: string, filters: ReviewFilters = {}) {
  const where: any = { dealerId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.platform) {
    where.platform = filters.platform;
  }

  if (filters.hasResponse !== undefined) {
    where.response = filters.hasResponse ? { isNot: null } : null;
  }

  const reviews = await prisma.review.findMany({
    where,
    include: {
      response: {
        select: {
          id: true,
          generatedText: true,
          finalText: true,
          status: true,
          approvedAt: true,
          postedAt: true,
        },
      },
    },
    orderBy: { reviewDate: 'desc' },
  });

  return reviews;
}

export async function getReview(reviewId: string, dealerId: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, dealerId },
    include: {
      response: true,
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
}

export async function updateReviewStatus(
  reviewId: string,
  dealerId: string,
  status: ReviewStatus
) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, dealerId },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });
}

export async function getReviewStats(dealerId: string) {
  const [total, byStatus, byPlatform, avgRating] = await Promise.all([
    prisma.review.count({ where: { dealerId } }),
    prisma.review.groupBy({
      by: ['status'],
      where: { dealerId },
      _count: true,
    }),
    prisma.review.groupBy({
      by: ['platform'],
      where: { dealerId },
      _count: true,
    }),
    prisma.review.aggregate({
      where: { dealerId, rating: { not: null } },
      _avg: { rating: true },
    }),
  ]);

  return {
    total,
    byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
    byPlatform: Object.fromEntries(byPlatform.map((p) => [p.platform, p._count])),
    avgRating: avgRating._avg.rating,
  };
}
