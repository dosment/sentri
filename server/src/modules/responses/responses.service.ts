import { prisma } from '../../config/database.js';
import { ResponseStatus, ReviewStatus } from '@prisma/client';

export async function getResponse(responseId: string, dealerId: string) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, dealerId },
    include: {
      review: true,
    },
  });

  if (!response) {
    throw new Error('Response not found');
  }

  return response;
}

export async function updateResponse(
  responseId: string,
  dealerId: string,
  data: { finalText?: string }
) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, dealerId },
  });

  if (!response) {
    throw new Error('Response not found');
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
  dealerId: string,
  approvedBy: string
) {
  const response = await prisma.response.findFirst({
    where: { id: responseId, dealerId },
    include: { review: true },
  });

  if (!response) {
    throw new Error('Response not found');
  }

  if (response.status !== ResponseStatus.DRAFT) {
    throw new Error('Response is not in draft status');
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
  dealerId: string,
  generatedText: string
) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, dealerId },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  const existing = await prisma.response.findUnique({
    where: { reviewId },
  });

  if (existing) {
    return prisma.response.update({
      where: { id: existing.id },
      data: {
        generatedText,
        finalText: null,
        status: ResponseStatus.DRAFT,
        approvedBy: null,
        approvedAt: null,
      },
    });
  }

  return prisma.response.create({
    data: {
      reviewId,
      dealerId,
      generatedText,
    },
  });
}
