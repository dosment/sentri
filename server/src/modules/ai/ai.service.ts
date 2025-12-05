import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { env } from '../../config/env.js';
import { prisma } from '../../config/database.js';

const MAX_REVIEW_LENGTH = 5000;
const MAX_NAME_LENGTH = 200;
const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 2000;

// Load AI prompt configuration from JSON file
const configPath = join(__dirname, '../../config/ai-prompt.json');

interface AIPromptConfig {
  version: string;
  lastUpdated: string;
  systemPrompt: string;
  immutableRules: string[];
  outputFormat: string[];
  platformLimits: Record<string, number>;
}

let promptConfig: AIPromptConfig | null = null;

function loadPromptConfig(): AIPromptConfig {
  if (!promptConfig) {
    const configFile = readFileSync(configPath, 'utf-8');
    promptConfig = JSON.parse(configFile);
    console.log(`[AI] Loaded prompt config v${promptConfig!.version} (updated: ${promptConfig!.lastUpdated})`);
  }
  return promptConfig!;
}

function buildSystemPrompt(): string {
  const config = loadPromptConfig();

  const prohibitions = config.immutableRules
    .map(rule => `- ${rule}`)
    .join('\n');

  const outputRules = config.outputFormat
    .map(rule => `- ${rule}`)
    .join('\n');

  return `${config.systemPrompt}

Strict Prohibitions:
${prohibitions}

Output Format:
${outputRules}`;
}

function getPlatformLimit(platform?: string): number {
  const config = loadPromptConfig();
  if (platform && config.platformLimits[platform]) {
    return config.platformLimits[platform];
  }
  return config.platformLimits.DEFAULT || 2000;
}

// Reload config from file (call this after editing ai-prompt.json)
export function reloadPromptConfig(): void {
  promptConfig = null;
  loadPromptConfig();
}

// Get current config version (useful for debugging)
export function getPromptConfigVersion(): { version: string; lastUpdated: string } {
  const config = loadPromptConfig();
  return { version: config.version, lastUpdated: config.lastUpdated };
}

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
  businessName: string;
  businessType?: string;
  businessPhone?: string | null;
  businessEmail?: string | null;
  reviewerName: string;
  rating: number | null;
  reviewText: string;
  platform?: string;
  voiceProfile?: any;
  responseTone?: 'professional' | 'neighborly' | 'casual' | 'friendly';
  customInstructions?: string | null;
  signOffName?: string | null;
  signOffTitle?: string | null;
}

// Map business types to human-readable labels for the AI
const BUSINESS_TYPE_LABELS: Record<string, string> = {
  RESTAURANT: 'Restaurant',
  SALON_SPA: 'Salon/Spa',
  MEDICAL_OFFICE: 'Medical Office',
  DENTAL_OFFICE: 'Dental Office',
  LEGAL_SERVICES: 'Legal Services',
  HOME_SERVICES: 'Home Services',
  RETAIL: 'Retail Store',
  AUTOMOTIVE: 'Automotive',
  FITNESS: 'Fitness/Gym',
  HOSPITALITY: 'Hospitality',
  REAL_ESTATE: 'Real Estate',
  OTHER: 'Business',
};

// Reviews that should be flagged for human review instead of AI response
function shouldFlagForHumanReview(reviewText: string, rating: number | null): { flag: boolean; reason?: string } {
  // Empty or very short reviews
  if (!reviewText || reviewText.trim().length < 5) {
    return { flag: true, reason: 'Review text is empty or too short' };
  }

  // Threatening or harassing language patterns
  const threatPatterns = [
    /\b(kill|murder|hurt|attack|destroy)\b.*\b(you|your|staff|employee)/i,
    /\b(lawyer|lawsuit|sue|court|legal action)\b/i,
    /\b(report|complain).*(health department|bbb|attorney general)/i,
  ];

  for (const pattern of threatPatterns) {
    if (pattern.test(reviewText)) {
      return { flag: true, reason: 'Review contains threatening or legal language' };
    }
  }

  // Spam indicators
  const spamPatterns = [
    /(.)\1{10,}/,  // Repeated characters (aaaaaaaaaa)
    /(https?:\/\/[^\s]+){3,}/i,  // Multiple URLs
    /\b(click here|visit my|check out my|follow me)\b/i,
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(reviewText)) {
      return { flag: true, reason: 'Review appears to be spam' };
    }
  }

  return { flag: false };
}

// Validate AI output to catch jailbreak attempts or prohibited content
function validateAIResponse(response: string, businessName: string): { valid: boolean; reason?: string } {
  const lowerResponse = response.toLowerCase();

  // Check for system prompt leakage
  const leakageIndicators = [
    'immutable rules',
    'system prompt',
    'my instructions',
    'i am programmed',
    'as an ai',
    'i cannot reveal',
    'never offer discounts',  // Direct quote from our rules
    'never admit liability',   // Direct quote from our rules
  ];

  for (const indicator of leakageIndicators) {
    if (lowerResponse.includes(indicator)) {
      console.warn('[SECURITY] Possible system prompt leakage detected in AI response');
      return { valid: false, reason: 'Response may contain leaked instructions' };
    }
  }

  // Check for prohibited compensation offers
  const compensationPatterns = [
    /\b(free|complimentary)\s+(service|meal|visit|session|consultation|treatment)/i,
    /\b(discount|refund|money back|compensation)\b/i,
    /\b(on the house|no charge|waive the fee)/i,
    /\bwe('ll| will) (give|offer|provide) you\b.*\bfree\b/i,
  ];

  for (const pattern of compensationPatterns) {
    if (pattern.test(response)) {
      console.warn('[SECURITY] Prohibited compensation language detected in AI response');
      return { valid: false, reason: 'Response contains prohibited compensation offer' };
    }
  }

  // Check for liability admissions
  const liabilityPatterns = [
    /\b(our fault|we('re| are) responsible|we caused|our mistake)\b/i,
    /\b(admit|acknowledge|accept)\b.*\b(liability|fault|responsibility|blame)\b/i,
    /\bwe('ll| will) (pay for|cover|compensate)\b/i,
  ];

  for (const pattern of liabilityPatterns) {
    if (pattern.test(response)) {
      console.warn('[SECURITY] Liability admission detected in AI response');
      return { valid: false, reason: 'Response contains liability admission' };
    }
  }

  // Check response is on-topic (basic sanity check)
  const onTopicIndicators = [
    businessName.toLowerCase(),
    'thank',
    'feedback',
    'review',
    'experience',
    'visit',
    'appreciate',
    'sorry',
    'apolog',
  ];

  const isOnTopic = onTopicIndicators.some(indicator => lowerResponse.includes(indicator));
  if (!isOnTopic && response.length > 50) {
    console.warn('[SECURITY] AI response appears off-topic');
    return { valid: false, reason: 'Response appears off-topic' };
  }

  return { valid: true };
}

export interface GenerateResponseResult {
  text: string;
  flaggedForHumanReview: boolean;
  flagReason?: string;
}

export async function generateResponse(
  input: GenerateResponseInput,
  reviewId?: string
): Promise<GenerateResponseResult> {
  // Sanitize all user-provided inputs
  const sanitizedBusinessName = sanitizeInput(input.businessName, MAX_NAME_LENGTH);
  const sanitizedReviewerName = sanitizeInput(input.reviewerName, MAX_NAME_LENGTH);
  const sanitizedReviewText = sanitizeInput(input.reviewText, MAX_REVIEW_LENGTH);

  // Check if this review should be flagged for human review
  const flagCheck = shouldFlagForHumanReview(input.reviewText, input.rating);
  if (flagCheck.flag) {
    console.log(`[AI] Review ${reviewId || 'unknown'} flagged for human review: ${flagCheck.reason}`);
    return {
      text: '',
      flaggedForHumanReview: true,
      flagReason: flagCheck.reason,
    };
  }

  // Check for prompt injection attempts - BLOCK instead of just logging
  if (detectPromptInjection(input.reviewText)) {
    if (reviewId) {
      logSuspiciousInput(reviewId, input.reviewText);
    }
    return {
      text: '',
      flaggedForHumanReview: true,
      flagReason: 'Review contains suspicious content patterns',
    };
  }

  const client = getClient();
  const systemPrompt = buildSystemPrompt();
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const ratingContext = input.rating !== null
    ? `Rating: ${input.rating}/5 stars`
    : 'Rating: Not provided';

  const toneContext = input.responseTone
    ? `\nTone preference: ${input.responseTone}`
    : '';

  const voiceContext = input.voiceProfile
    ? `\n\nBusiness voice profile: ${JSON.stringify(input.voiceProfile)}`
    : '';

  // Get platform-specific character limit from config
  const platformLimit = getPlatformLimit(input.platform);

  // Get human-readable business type
  const businessTypeLabel = input.businessType
    ? BUSINESS_TYPE_LABELS[input.businessType] || input.businessType
    : 'Business';

  // Sanitize and include business custom instructions if provided
  const customInstructionsContext = input.customInstructions
    ? `\n\nBusiness-specific instructions (follow these in addition to core guidelines):\n${sanitizeInput(input.customInstructions, MAX_CUSTOM_INSTRUCTIONS_LENGTH)}`
    : '';

  // Build contact info context for negative reviews
  const contactParts: string[] = [];
  if (input.businessPhone) {
    contactParts.push(`Phone: ${sanitizeInput(input.businessPhone, 50)}`);
  }
  if (input.businessEmail) {
    contactParts.push(`Email: ${sanitizeInput(input.businessEmail, 100)}`);
  }
  const contactContext = contactParts.length > 0
    ? `\n\nBusiness contact information (use in responses to negative reviews for offline follow-up):\n${contactParts.join('\n')}`
    : '\n\nNote: No contact information provided - do not include placeholder contact details like [phone number] or [email address] in the response.';

  const prompt = `Generate a response for this review:

Platform: ${input.platform || 'Unknown'}
Maximum response length: ${platformLimit} characters (IMPORTANT: Do not exceed this limit)

Business: ${sanitizedBusinessName}
Business Type: ${businessTypeLabel}
Reviewer: ${sanitizedReviewerName}
${ratingContext}${toneContext}${customInstructionsContext}

Review text:
"${sanitizedReviewText}"${voiceContext}${contactContext}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text();

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  text = text.trim();

  // Validate AI output for prohibited content or jailbreak attempts
  const validation = validateAIResponse(text, input.businessName);
  if (!validation.valid) {
    console.log(`[AI] Response for review ${reviewId || 'unknown'} failed validation: ${validation.reason}`);
    return {
      text: '',
      flaggedForHumanReview: true,
      flagReason: validation.reason,
    };
  }

  // Append sign-off if provided
  if (input.signOffName) {
    const signOff = input.signOffTitle
      ? `${input.signOffName}, ${input.signOffTitle}`
      : input.signOffName;
    text = `${text}\n\n${signOff}`;
  }

  return {
    text,
    flaggedForHumanReview: false,
  };
}

export async function generateResponseForReview(reviewId: string, businessId: string): Promise<GenerateResponseResult> {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, businessId },
    include: {
      business: {
        select: {
          name: true,
          businessType: true,
          phone: true,
          email: true,
          voiceProfile: true,
          responseTone: true,
          customInstructions: true,
          signOffName: true,
          signOffTitle: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  const result = await generateResponse(
    {
      businessName: review.business.name,
      businessType: review.business.businessType,
      businessPhone: review.business.phone,
      businessEmail: review.business.email,
      reviewerName: review.reviewerName,
      rating: review.rating,
      reviewText: review.reviewText,
      platform: review.platform,
      voiceProfile: review.business.voiceProfile,
      responseTone: review.business.responseTone as 'professional' | 'neighborly' | 'casual' | 'friendly',
      customInstructions: review.business.customInstructions,
      signOffName: review.business.signOffName,
      signOffTitle: review.business.signOffTitle,
    },
    reviewId
  );

  return result;
}
