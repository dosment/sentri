import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { prisma } from '../../config/database.js';

const MAX_REVIEW_LENGTH = 5000;
const MAX_NAME_LENGTH = 200;

// Patterns that might indicate prompt injection attempts
const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /forget\s+(everything|all|what)/i,
  /you\s+are\s+now/i,
  /new\s+instructions?:/i,
  /system\s*:/i,
  /\[system\]/i,
  /assistant\s*:/i,
  /<\/?(?:system|assistant|user)>/i,
];

function sanitizeInput(text: string, maxLength: number): string {
  // Truncate to max length
  let sanitized = text.slice(0, maxLength);

  // Remove null bytes and other control characters (keep newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Escape quotes to prevent breaking out of the quoted context
  sanitized = sanitized.replace(/"/g, '\\"');

  return sanitized.trim();
}

function detectPromptInjection(text: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(text));
}

function logSuspiciousInput(reviewId: string, text: string): void {
  console.warn('[SECURITY] Potential prompt injection detected', {
    reviewId,
    textPreview: text.slice(0, 100),
    timestamp: new Date().toISOString(),
  });
}

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

export async function generateResponse(
  input: GenerateResponseInput,
  reviewId?: string
): Promise<string> {
  // Sanitize all user-provided inputs
  const sanitizedDealerName = sanitizeInput(input.dealerName, MAX_NAME_LENGTH);
  const sanitizedReviewerName = sanitizeInput(input.reviewerName, MAX_NAME_LENGTH);
  const sanitizedReviewText = sanitizeInput(input.reviewText, MAX_REVIEW_LENGTH);

  // Check for prompt injection attempts
  if (detectPromptInjection(input.reviewText)) {
    if (reviewId) {
      logSuspiciousInput(reviewId, input.reviewText);
    }
    // Still process but flag for review - don't block legitimate reviews that happen to match patterns
  }

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

Dealership: ${sanitizedDealerName}
Reviewer: ${sanitizedReviewerName}
${ratingContext}

Review text:
"${sanitizedReviewText}"${voiceContext}`;

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

  const responseText = await generateResponse(
    {
      dealerName: review.dealer.name,
      reviewerName: review.reviewerName,
      rating: review.rating,
      reviewText: review.reviewText,
      voiceProfile: review.dealer.voiceProfile,
    },
    reviewId
  );

  return responseText;
}
