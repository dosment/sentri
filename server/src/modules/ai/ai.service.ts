import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { prisma } from '../../config/database.js';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return genAI;
}

interface GenerateResponseInput {
  dealerName: string;
  reviewerName: string;
  rating: number | null;
  reviewText: string;
  voiceProfile?: any;
}

const SYSTEM_PROMPT = `You are an AI assistant that generates professional, personalized responses to customer reviews for automotive dealerships.

Guidelines:
- Be warm, professional, and authentic
- Thank the customer by name when provided
- For positive reviews (4-5 stars): Express genuine gratitude, highlight specific points they mentioned, invite them back
- For negative reviews (1-3 stars): Apologize sincerely, acknowledge their concerns without being defensive, offer to make it right, provide contact for follow-up
- Keep responses concise (2-4 sentences for positive, 3-5 for negative)
- Never offer discounts, free services, or compensation in the response
- Never admit liability or fault for specific incidents
- Never use generic templates - each response should feel personal
- Match the dealer's voice profile if provided

Output only the response text, nothing else.`;

export async function generateResponse(input: GenerateResponseInput): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const ratingContext = input.rating !== null
    ? `Rating: ${input.rating}/5 stars`
    : 'Rating: Not provided';

  const voiceContext = input.voiceProfile
    ? `\n\nDealer voice profile: ${JSON.stringify(input.voiceProfile)}`
    : '';

  const prompt = `Generate a response for this review:

Dealership: ${input.dealerName}
Reviewer: ${input.reviewerName}
${ratingContext}

Review text:
"${input.reviewText}"${voiceContext}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text.trim();
}

export async function generateResponseForReview(reviewId: string, dealerId: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, dealerId },
    include: {
      dealer: {
        select: { name: true, voiceProfile: true },
      },
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  const responseText = await generateResponse({
    dealerName: review.dealer.name,
    reviewerName: review.reviewerName,
    rating: review.rating,
    reviewText: review.reviewText,
    voiceProfile: review.dealer.voiceProfile,
  });

  return responseText;
}
