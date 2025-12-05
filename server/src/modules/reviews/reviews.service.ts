import { prisma } from '../../config/database.js';
import { ReviewStatus, Platform, Prisma } from '@prisma/client';
import { NotFoundError } from '../../lib/errors.js';

export interface ReviewFilters {
  status?: ReviewStatus;
  platform?: Platform;
  hasResponse?: boolean;
  includeOld?: boolean; // Override hideOldReviews setting to show all reviews
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

/**
 * Calculate the cutoff date for old reviews
 */
function getOldReviewCutoffDate(thresholdDays: number): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - thresholdDays);
  return cutoff;
}

export async function getReviews(
  businessId: string,
  filters: ReviewFilters = {},
  pagination: PaginationOptions = {}
) {
  const page = Math.max(1, pagination.page || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, pagination.limit || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * limit;

  // Fetch business settings to check hideOldReviews preference
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      hideOldReviews: true,
      oldReviewThresholdDays: true,
    },
  });

  const where: Prisma.ReviewWhereInput = { businessId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.platform) {
    where.platform = filters.platform;
  }

  if (filters.hasResponse !== undefined) {
    where.response = filters.hasResponse ? { isNot: null } : null;
  }

  // Apply old review filter if enabled and not overridden
  if (business?.hideOldReviews && !filters.includeOld) {
    const cutoffDate = getOldReviewCutoffDate(business.oldReviewThresholdDays);
    where.reviewDate = { gte: cutoffDate };
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + reviews.length < total,
    },
    filters: {
      hideOldReviews: business?.hideOldReviews ?? false,
      oldReviewThresholdDays: business?.oldReviewThresholdDays ?? 30,
    },
  };
}

export async function getReview(reviewId: string, businessId: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, businessId },
    include: {
      response: true,
    },
  });

  if (!review) {
    throw new NotFoundError('Review');
  }

  return review;
}

export async function updateReviewStatus(
  reviewId: string,
  businessId: string,
  status: ReviewStatus
) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, businessId },
  });

  if (!review) {
    throw new NotFoundError('Review');
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });
}

export async function getReviewStats(businessId: string) {
  const [total, byStatus, byPlatform, avgRating] = await Promise.all([
    prisma.review.count({ where: { businessId } }),
    prisma.review.groupBy({
      by: ['status'],
      where: { businessId },
      _count: true,
    }),
    prisma.review.groupBy({
      by: ['platform'],
      where: { businessId },
      _count: true,
    }),
    prisma.review.aggregate({
      where: { businessId, rating: { not: null } },
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

export async function getReportingStats(businessId: string) {
  const [totalReviews, respondedCount, pendingCount, avgRatingResult, responsesGenerated] = await Promise.all([
    prisma.review.count({ where: { businessId } }),
    prisma.review.count({ where: { businessId, status: 'RESPONDED' } }),
    prisma.review.count({ where: { businessId, status: 'NEW' } }),
    prisma.review.aggregate({
      where: { businessId, rating: { not: null } },
      _avg: { rating: true },
    }),
    prisma.response.count({ where: { businessId } }),
  ]);

  const responseRate = totalReviews > 0
    ? Math.round((respondedCount / totalReviews) * 100)
    : 0;

  return {
    responseRate,
    avgRating: avgRatingResult._avg.rating,
    pendingCount,
    totalReviews,
    responsesGenerated,
  };
}
