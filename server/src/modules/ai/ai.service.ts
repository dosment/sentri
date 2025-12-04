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
  responseTone?: 'professional' | 'neighborly';
  signOffName?: string | null;
  signOffTitle?: string | null;
}

const SYSTEM_PROMPT = `You are an AI assistant that generates professional, personalized responses to customer reviews for automotive dealerships.

Core Guidelines:
- Be warm, professional, and authentic
- Thank the customer by name when provided
- Vary your sentence structure and opening phrases to avoid sounding templated
- If the review is in a language other than English, respond in the same language

Response Strategy by Rating:
- For positive reviews (4-5 stars):
  * Express genuine gratitude
  * Highlight specific points they mentioned
  * Invite them back
  * Keep responses 2-4 sentences

- For neutral reviews (3 stars):
  * Thank them for their feedback
  * Acknowledge their experience
  * Express commitment to improvement
  * Keep responses 2-4 sentences

- For negative reviews (1-2 stars):
  * Apologize sincerely
  * Acknowledge their concerns without being defensive
  * Offer to make it right
  * Provide clear next step for offline resolution
  * Keep responses 3-5 sentences

Tone Adaptation:
- Professional tone: Use measured, formal language ("We sincerely apologize", "Please contact us", "We appreciate your feedback")
- Neighborly tone: Use warm, conversational language ("We're really sorry", "Give us a call", "Thanks so much for sharing")

Strict Prohibitions:
- NEVER offer discounts, free services, refunds, or any form of compensation
- NEVER admit liability or fault for specific incidents (accidents, injuries, damages)
- NEVER mention competitor dealerships or brands
- NEVER use identical phrasing for consecutive reviews from the same dealer
- NEVER make promises you can't keep ("we'll fix this immediately")

Output Format:
- Output only the response text, nothing else
- Do not include a sign-off (the system will add this automatically)
- Keep responses concise and conversational`;

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

  const toneContext = input.responseTone
    ? `\nTone preference: ${input.responseTone}`
    : '';

  const voiceContext = input.voiceProfile
    ? `\n\nDealer voice profile: ${JSON.stringify(input.voiceProfile)}`
    : '';

  const prompt = `Generate a response for this review:

Dealership: ${sanitizedDealerName}
Reviewer: ${sanitizedReviewerName}
${ratingContext}${toneContext}

Review text:
"${sanitizedReviewText}"${voiceContext}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  text = text.trim();

  // Append sign-off if provided
  if (input.signOffName) {
    const signOff = input.signOffTitle
      ? `${input.signOffName}, ${input.signOffTitle}`
      : input.signOffName;
    text = `${text}\n\n${signOff}`;
  }

  return text;
}

export async function generateResponseForReview(reviewId: string, dealerId: string) {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, dealerId },
    include: {
      dealer: {
        select: {
          name: true,
          voiceProfile: true,
          responseTone: true,
          signOffName: true,
          signOffTitle: true,
        },
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
      responseTone: review.dealer.responseTone as 'professional' | 'neighborly',
      signOffName: review.dealer.signOffName,
      signOffTitle: review.dealer.signOffTitle,
    },
    reviewId
  );

  return responseText;
}
