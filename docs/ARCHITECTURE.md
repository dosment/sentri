# Sentri — Technical Architecture Plan

**Product:** Sentri — AI Review Response Automation
**Tagline:** "Your reputation, on guard."
**Version:** 1.1
**Date:** December 2024
**Contributors:** Linus Torvalds (Architecture), Rob Pike (Backend), Dan Abramov (Frontend), Martin Kleppmann (Database), Kelsey Hightower (DevOps), Bruce Schneier (Security), Luke Wroblewski (Mobile), Marty Neumeier (Brand)
**Approved by:** Andy Grove (Project Manager)

---

## Brand Identity

> **Sentri is the ONLY review response platform that executes automatically — not just monitors.**

See [BRAND-GUIDELINES.md](BRAND-GUIDELINES.md) for complete brand documentation.

### Quick Reference

| Element | Value |
|---------|-------|
| **Name** | Sentri (always capitalized) |
| **Pronunciation** | SEN-tree |
| **Primary Color** | Sentri Blue `#1E3A5F` |
| **Secondary Color** | Guardian Navy `#0F2340` |
| **Font** | Inter |
| **Domain** | sentri.io |
| **API Domain** | api.sentri.io |
| **App Domain** | app.sentri.io |

---

## Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [System Overview](#system-overview)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Design](#database-design)
6. [External Integrations](#external-integrations)
7. [Security Architecture](#security-architecture)
8. [Infrastructure & DevOps](#infrastructure--devops)
9. [API Specification](#api-specification)
10. [Implementation Plan](#implementation-plan)

---

## Architecture Principles

### Linus Torvalds (Lead Architect)

> "Talk is cheap. Show me the code. But before the code — show me the simplest possible design that works."

**Our Guiding Principles:**

1. **Simplicity over cleverness.** No microservices. No Kubernetes. No GraphQL. One service, one database, one deployment unit.

2. **Boring technology.** PostgreSQL, Node.js, React. Battle-tested. Well-documented. Easy to hire for.

3. **Monolith first.** Extract services only when you have proof of need. You won't need proof for a long time.

4. **Optimize for iteration speed.** The architecture that lets you ship and change fastest wins.

5. **No premature abstraction.** Three instances of duplication before you abstract. Maybe four.

6. **Fail fast, recover gracefully.** Aggressive timeouts. Retry with backoff. Never silent failures.

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Browser   │  │   Mobile    │  │   Email     │  │    SMS      │         │
│  │  (React)    │  │   (PWA)     │  │  (Links)    │  │  (Links)    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOAD BALANCER / CDN                                │
│                        (Cloudflare or Railway built-in)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────────┐
│         API SERVER                │ │         STATIC ASSETS                  │
│      (Node.js + Express)          │ │      (React build on CDN)              │
│                                   │ │                                        │
│  • REST API endpoints             │ │  • Dashboard SPA                       │
│  • OAuth callback handlers        │ │  • JS/CSS bundles                      │
│  • Webhook receivers              │ │  • Images/fonts                        │
│  • WebSocket (notifications)      │ │                                        │
└───────────────┬───────────────────┘ └───────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │   Review    │  │  Response   │  │   Notify    │         │
│  │   Module    │  │   Module    │  │   Module    │  │   Module    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Platform   │  │     AI      │  │  Analytics  │  │   Billing   │         │
│  │   Module    │  │   Module    │  │   Module    │  │   Module    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────┬─────────────────────────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌───────────────┐ ┌───────────────┐
│  PostgreSQL   │ │     Redis     │
│  (Primary DB) │ │ (Cache/Queue) │
└───────────────┘ └───────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Google  │ │Facebook │ │ Dealer  │ │  Yelp   │ │ Claude  │ │ Twilio  │   │
│  │ Business│ │ Graph   │ │ Rater   │ │ Partner │ │   API   │ │   SMS   │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐                                                    │
│  │SendGrid │ │ Stripe  │                                                    │
│  │  Email  │ │ Billing │                                                    │
│  └─────────┘ └─────────┘                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Rob Pike (Backend Lead)

> "Simplicity is complicated. But it's worth it."

**System Components:**

| Component | Technology | Purpose |
|-----------|------------|---------|
| API Server | Node.js 20 + Express | REST API, OAuth, webhooks |
| Background Jobs | BullMQ (Redis-backed) | Review sync, response posting, notifications |
| Database | PostgreSQL 15 | Primary data store |
| Cache/Queue | Redis 7 | Job queue, session cache, rate limiting |
| Frontend | React 18 + TypeScript | Dashboard SPA |
| AI | Claude API (Anthropic) | Response generation |

---

## Backend Architecture

### Rob Pike (Backend Lead)

> "Clear is better than clever. A little copying is better than a little dependency."

### Project Structure

```
/server
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── index.ts             # Environment config
│   │   ├── database.ts          # DB connection
│   │   └── redis.ts             # Redis connection
│   │
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.routes.ts       # Login, OAuth callbacks
│   │   ├── dealers.routes.ts    # Dealer CRUD
│   │   ├── reviews.routes.ts    # Review endpoints
│   │   ├── responses.routes.ts  # Response endpoints
│   │   ├── platforms.routes.ts  # Platform connections
│   │   └── webhooks.routes.ts   # Incoming webhooks
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── jwt.utils.ts
│   │   │
│   │   ├── platforms/
│   │   │   ├── platform.interface.ts    # Common interface
│   │   │   ├── google.platform.ts       # Google implementation
│   │   │   ├── facebook.platform.ts     # Facebook implementation
│   │   │   ├── dealerrater.platform.ts  # DealerRater implementation
│   │   │   ├── yelp.platform.ts         # Yelp implementation
│   │   │   └── platform.factory.ts      # Factory pattern
│   │   │
│   │   ├── reviews/
│   │   │   ├── review.service.ts
│   │   │   ├── review.sync.ts
│   │   │   └── review.types.ts
│   │   │
│   │   ├── responses/
│   │   │   ├── response.service.ts
│   │   │   ├── response.generator.ts    # AI integration
│   │   │   └── response.poster.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.service.ts
│   │   │   ├── prompts.ts               # Prompt templates
│   │   │   └── claude.client.ts
│   │   │
│   │   └── notifications/
│   │       ├── notification.service.ts
│   │       ├── email.client.ts
│   │       └── sms.client.ts
│   │
│   ├── jobs/
│   │   ├── queue.ts                     # BullMQ setup
│   │   ├── sync-reviews.job.ts          # Poll platforms for reviews
│   │   ├── generate-response.job.ts     # AI response generation
│   │   ├── post-response.job.ts         # Post to platform
│   │   └── send-notification.job.ts     # Email/SMS alerts
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   └── errors.ts
│   │
│   └── types/
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Platform Abstraction Layer

```typescript
// src/modules/platforms/platform.interface.ts

export interface Review {
  platformReviewId: string;
  platform: PlatformType;
  reviewerName: string;
  rating: number | null;          // null for Facebook recommendations
  recommendation?: 'recommends' | 'doesnt_recommend';
  reviewText: string;
  reviewDate: Date;
  replyText?: string;             // existing reply if any
}

export interface PlatformConnection {
  dealerId: string;
  platform: PlatformType;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  platformAccountId: string;
}

export interface IPlatformAdapter {
  // OAuth
  getAuthUrl(dealerId: string): string;
  handleCallback(code: string, dealerId: string): Promise<PlatformConnection>;
  refreshToken(connection: PlatformConnection): Promise<PlatformConnection>;

  // Reviews
  fetchReviews(connection: PlatformConnection, since?: Date): Promise<Review[]>;

  // Responses
  postResponse(connection: PlatformConnection, reviewId: string, text: string): Promise<void>;
  deleteResponse(connection: PlatformConnection, reviewId: string): Promise<void>;
}

export type PlatformType = 'google' | 'facebook' | 'dealerrater' | 'yelp' | 'cargurus';
```

```typescript
// src/modules/platforms/google.platform.ts

import { google } from 'googleapis';
import { IPlatformAdapter, Review, PlatformConnection } from './platform.interface';

export class GooglePlatformAdapter implements IPlatformAdapter {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  getAuthUrl(dealerId: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/business.manage'
      ],
      state: dealerId,
      prompt: 'consent'
    });
  }

  async handleCallback(code: string, dealerId: string): Promise<PlatformConnection> {
    const { tokens } = await this.oauth2Client.getToken(code);

    // Get the account/location ID
    this.oauth2Client.setCredentials(tokens);
    const mybusiness = google.mybusinessaccountmanagement({ version: 'v1', auth: this.oauth2Client });
    const accounts = await mybusiness.accounts.list();

    // For MVP, assume first account/location
    const accountId = accounts.data.accounts?.[0]?.name;

    return {
      dealerId,
      platform: 'google',
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      platformAccountId: accountId!
    };
  }

  async refreshToken(connection: PlatformConnection): Promise<PlatformConnection> {
    this.oauth2Client.setCredentials({
      refresh_token: connection.refreshToken
    });

    const { credentials } = await this.oauth2Client.refreshAccessToken();

    return {
      ...connection,
      accessToken: credentials.access_token!,
      expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined
    };
  }

  async fetchReviews(connection: PlatformConnection, since?: Date): Promise<Review[]> {
    this.oauth2Client.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken
    });

    const mybusiness = google.mybusinessbusinessinformation({ version: 'v1', auth: this.oauth2Client });

    // Fetch reviews
    const response = await mybusiness.accounts.locations.reviews.list({
      parent: connection.platformAccountId
    });

    return (response.data.reviews || []).map(review => ({
      platformReviewId: review.reviewId!,
      platform: 'google' as const,
      reviewerName: review.reviewer?.displayName || 'Anonymous',
      rating: this.parseRating(review.starRating),
      reviewText: review.comment || '',
      reviewDate: new Date(review.createTime!),
      replyText: review.reviewReply?.comment
    }));
  }

  async postResponse(connection: PlatformConnection, reviewId: string, text: string): Promise<void> {
    this.oauth2Client.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken
    });

    const mybusiness = google.mybusinessbusinessinformation({ version: 'v1', auth: this.oauth2Client });

    await mybusiness.accounts.locations.reviews.updateReply({
      name: `${connection.platformAccountId}/reviews/${reviewId}`,
      requestBody: {
        comment: text
      }
    });
  }

  async deleteResponse(connection: PlatformConnection, reviewId: string): Promise<void> {
    this.oauth2Client.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken
    });

    const mybusiness = google.mybusinessbusinessinformation({ version: 'v1', auth: this.oauth2Client });

    await mybusiness.accounts.locations.reviews.deleteReply({
      name: `${connection.platformAccountId}/reviews/${reviewId}`
    });
  }

  private parseRating(starRating?: string): number | null {
    const ratingMap: Record<string, number> = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    };
    return starRating ? ratingMap[starRating] || null : null;
  }
}
```

### Job Queue Architecture

```typescript
// src/jobs/queue.ts

import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

// Define queues
export const reviewSyncQueue = new Queue('review-sync', { connection });
export const responseGenerateQueue = new Queue('response-generate', { connection });
export const responsePostQueue = new Queue('response-post', { connection });
export const notificationQueue = new Queue('notification', { connection });

// Schedule recurring review sync (every 15 minutes)
export async function scheduleRecurringJobs() {
  await reviewSyncQueue.add(
    'sync-all-dealers',
    {},
    {
      repeat: {
        every: 15 * 60 * 1000  // 15 minutes
      }
    }
  );
}
```

```typescript
// src/jobs/sync-reviews.job.ts

import { Worker, Job } from 'bullmq';
import { prisma } from '../config/database';
import { PlatformFactory } from '../modules/platforms/platform.factory';
import { responseGenerateQueue } from './queue';

const worker = new Worker('review-sync', async (job: Job) => {
  // Get all active platform connections
  const connections = await prisma.platformConnection.findMany({
    where: { isActive: true },
    include: { dealer: true }
  });

  for (const connection of connections) {
    try {
      const adapter = PlatformFactory.getAdapter(connection.platform);

      // Check if token needs refresh
      if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
        const refreshed = await adapter.refreshToken(connection);
        await prisma.platformConnection.update({
          where: { id: connection.id },
          data: {
            accessToken: refreshed.accessToken,
            tokenExpiresAt: refreshed.expiresAt
          }
        });
      }

      // Fetch reviews since last sync
      const reviews = await adapter.fetchReviews(connection, connection.lastSyncAt);

      for (const review of reviews) {
        // Upsert review (idempotent)
        const existing = await prisma.review.findUnique({
          where: {
            platform_platformReviewId: {
              platform: review.platform,
              platformReviewId: review.platformReviewId
            }
          }
        });

        if (!existing) {
          // New review - insert and queue for response
          const created = await prisma.review.create({
            data: {
              dealerId: connection.dealerId,
              platform: review.platform,
              platformReviewId: review.platformReviewId,
              reviewerName: review.reviewerName,
              rating: review.rating,
              recommendation: review.recommendation,
              reviewText: review.reviewText,
              reviewDate: review.reviewDate,
              status: 'new'
            }
          });

          // Queue response generation
          await responseGenerateQueue.add('generate', {
            reviewId: created.id,
            dealerId: connection.dealerId
          });
        }
      }

      // Update last sync time
      await prisma.platformConnection.update({
        where: { id: connection.id },
        data: { lastSyncAt: new Date() }
      });

      // Log success
      await prisma.syncLog.create({
        data: {
          dealerId: connection.dealerId,
          platform: connection.platform,
          syncType: 'incremental',
          reviewsFound: reviews.length,
          reviewsNew: reviews.filter(r => !r.replyText).length,
          status: 'success',
          startedAt: job.timestamp ? new Date(job.timestamp) : new Date(),
          completedAt: new Date()
        }
      });

    } catch (error) {
      // Log failure
      await prisma.syncLog.create({
        data: {
          dealerId: connection.dealerId,
          platform: connection.platform,
          syncType: 'incremental',
          reviewsFound: 0,
          reviewsNew: 0,
          status: 'failed',
          errorMessage: error.message,
          startedAt: job.timestamp ? new Date(job.timestamp) : new Date(),
          completedAt: new Date()
        }
      });
    }
  }
});

export default worker;
```

### AI Response Generation

```typescript
// src/modules/ai/ai.service.ts

import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../../config/database';
import { buildPrompt } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export interface GenerateResponseInput {
  reviewId: string;
  dealerId: string;
}

export interface GeneratedResponse {
  text: string;
  promptTokens: number;
  completionTokens: number;
  model: string;
}

export async function generateResponse(input: GenerateResponseInput): Promise<GeneratedResponse> {
  // Fetch review and dealer details
  const review = await prisma.review.findUnique({
    where: { id: input.reviewId }
  });

  const dealer = await prisma.dealer.findUnique({
    where: { id: input.dealerId }
  });

  if (!review || !dealer) {
    throw new Error('Review or dealer not found');
  }

  // Build the prompt
  const prompt = buildPrompt({
    dealerName: dealer.name,
    voiceProfile: dealer.voiceProfile,
    platform: review.platform,
    rating: review.rating,
    recommendation: review.recommendation,
    reviewerName: review.reviewerName,
    reviewText: review.reviewText
  });

  // Call Claude
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 300,
    messages: [
      { role: 'user', content: prompt }
    ]
  });

  const generatedText = response.content[0].type === 'text'
    ? response.content[0].text
    : '';

  return {
    text: generatedText,
    promptTokens: response.usage.input_tokens,
    completionTokens: response.usage.output_tokens,
    model: 'claude-3-5-sonnet-20241022'
  };
}
```

```typescript
// src/modules/ai/prompts.ts

export interface PromptInput {
  dealerName: string;
  voiceProfile: {
    tone: 'professional' | 'warm' | 'casual';
    signOff?: string;
    specialInstructions?: string;
  } | null;
  platform: string;
  rating: number | null;
  recommendation?: string;
  reviewerName: string;
  reviewText: string;
}

export function buildPrompt(input: PromptInput): string {
  const tone = input.voiceProfile?.tone || 'professional';
  const signOff = input.voiceProfile?.signOff || '';
  const specialInstructions = input.voiceProfile?.specialInstructions || '';

  const ratingContext = input.rating
    ? `${input.rating}/5 stars`
    : input.recommendation === 'recommends'
      ? 'Recommended'
      : 'Not Recommended';

  return `You are a professional response writer for ${input.dealerName}, an automotive dealership.

Your job is to write a thoughtful, personalized response to a customer review.

VOICE PROFILE:
- Tone: ${tone}
${signOff ? `- Sign off with: ${signOff}` : '- No sign-off needed'}
${specialInstructions ? `- Special instructions: ${specialInstructions}` : ''}

GUIDELINES:
- Keep responses 2-4 sentences
- For positive reviews (4-5 stars): Thank them specifically for what they mentioned, reinforce the positive experience, invite them back
- For negative reviews (1-3 stars): Acknowledge their frustration, apologize for the experience, take ownership without excuses, invite offline resolution
- Never be defensive
- Never offer discounts or compensation in the response
- Never use generic phrases like "We value your feedback"
- Reference specific details from their review to show you read it
- Do not include phrases like "I understand your frustration" if there's no frustration expressed

REVIEW TO RESPOND TO:
- Platform: ${input.platform}
- Rating: ${ratingContext}
- Reviewer: ${input.reviewerName}
- Content: "${input.reviewText}"

Write only the response text. Do not include any preamble or explanation.`;
}
```

---

## Frontend Architecture

### Dan Abramov (Frontend Lead)

> "Make it work, make it right, make it fast. In that order. And keep the state simple."

### Project Structure

```
/client
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component
│   ├── index.css                   # Global styles (Tailwind)
│   │
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── reviews/
│   │   │   ├── ReviewList.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewFilters.tsx
│   │   │   └── ResponseEditor.tsx
│   │   │
│   │   ├── platforms/
│   │   │   ├── PlatformConnect.tsx
│   │   │   ├── PlatformStatus.tsx
│   │   │   └── PlatformCard.tsx
│   │   │
│   │   └── analytics/
│   │       ├── StatsCard.tsx
│   │       ├── RatingChart.tsx
│   │       └── ResponseRateChart.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Reviews.tsx
│   │   ├── Platforms.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   └── OAuthCallback.tsx
│   │
│   ├── hooks/
│   │   ├── useReviews.ts           # React Query hooks
│   │   ├── usePlatforms.ts
│   │   ├── useResponses.ts
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   │
│   ├── api/
│   │   ├── client.ts               # Axios instance
│   │   ├── reviews.api.ts
│   │   ├── platforms.api.ts
│   │   ├── responses.api.ts
│   │   └── auth.api.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   └── types/
│       └── index.ts
│
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── Dockerfile
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Routing | React Router v6 |
| State Management | React Query (TanStack Query) |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Validation | Zod |
| Font | Inter (Google Fonts) |

### Brand Integration (Tailwind Config)

```javascript
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'sentri-blue': '#1E3A5F',
        'guardian-navy': '#0F2340',

        // Status Colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'alert': '#EF4444',

        // Neutral
        'neutral': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### CSS Variables (Global)

```css
/* src/index.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Brand Colors */
  --sentri-blue: #1E3A5F;
  --guardian-navy: #0F2340;
  --alert-white: #FFFFFF;

  /* Status Colors */
  --success-green: #10B981;
  --warning-amber: #F59E0B;
  --alert-red: #EF4444;
  --neutral-gray: #6B7280;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Key Component: Review Card

```tsx
// src/components/reviews/ReviewCard.tsx

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Review, Response } from '../../types';
import { approveResponse, editResponse } from '../../api/responses.api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ResponseEditor } from './ResponseEditor';

interface ReviewCardProps {
  review: Review & { response?: Response };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => approveResponse(review.response!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  const platformColors = {
    google: 'bg-blue-100 text-blue-800',
    facebook: 'bg-indigo-100 text-indigo-800',
    dealerrater: 'bg-green-100 text-green-800',
    yelp: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    new: 'bg-yellow-100 text-yellow-800',
    pending_response: 'bg-orange-100 text-orange-800',
    responded: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{review.reviewerName}</span>
            <Badge className={platformColors[review.platform]}>
              {review.platform}
            </Badge>
            <Badge className={statusColors[review.status]}>
              {review.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(review.reviewDate).toLocaleDateString()}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center">
          {review.rating ? (
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < review.rating! ? 'text-yellow-400' : 'text-gray-300'}
                >
                  ★
                </span>
              ))}
            </div>
          ) : (
            <Badge className={review.recommendation === 'recommends'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }>
              {review.recommendation === 'recommends' ? '👍 Recommends' : '👎 Doesn\'t Recommend'}
            </Badge>
          )}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-4">
        "{review.reviewText}"
      </p>

      {/* Response Section */}
      {review.response && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              AI-Generated Response
            </span>
            <Badge className={
              review.response.status === 'posted'
                ? 'bg-green-100 text-green-800'
                : review.response.status === 'approved'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
            }>
              {review.response.status}
            </Badge>
          </div>

          {isEditing ? (
            <ResponseEditor
              response={review.response}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <p className="text-gray-600 bg-gray-50 p-3 rounded mb-3">
                {review.response.finalText || review.response.generatedText}
              </p>

              {review.response.status === 'draft' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => approveMutation.mutate()}
                    loading={approveMutation.isPending}
                  >
                    Approve & Post
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

### Mobile Considerations

**Luke Wroblewski (Mobile Lead):**

> "Mobile isn't a smaller desktop. Design for the thumb."

**Key Mobile Requirements:**

1. **Touch-friendly targets** — All buttons minimum 44x44px
2. **Swipe gestures** — Swipe right to approve, swipe left to skip
3. **Quick actions** — One-tap approve from notification
4. **Offline viewing** — Review list cached locally
5. **Progressive loading** — Load reviews incrementally

```tsx
// src/components/reviews/ReviewCard.tsx - Mobile swipe handling

import { useSwipeable } from 'react-swipeable';

export function ReviewCard({ review }: ReviewCardProps) {
  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (review.response?.status === 'draft') {
        approveMutation.mutate();
      }
    },
    trackMouse: false,
    delta: 50
  });

  return (
    <div {...handlers} className="...">
      {/* Card content */}
    </div>
  );
}
```

---

## Database Design

### Martin Kleppmann (Database Lead)

> "Your data model will outlive your application code. Design it carefully."

### Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ CORE ENTITIES ============

model Dealer {
  id                  String               @id @default(uuid())
  email               String               @unique
  passwordHash        String?
  name                String
  phone               String?
  plan                Plan                 @default(STARTER)
  voiceProfile        Json?                // { tone, signOff, specialInstructions }
  autoApproveThreshold Int                 @default(4)  // Auto-approve reviews >= this rating
  stripeCustomerId    String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  platformConnections PlatformConnection[]
  reviews             Review[]
  responses           Response[]
  syncLogs            SyncLog[]

  @@map("dealers")
}

model PlatformConnection {
  id                String    @id @default(uuid())
  dealerId          String
  platform          Platform
  platformAccountId String    // Their ID on that platform
  platformAccountName String? // Human-readable name
  accessToken       String    // Encrypted
  refreshToken      String?   // Encrypted
  tokenExpiresAt    DateTime?
  isActive          Boolean   @default(true)
  lastSyncAt        DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  dealer            Dealer    @relation(fields: [dealerId], references: [id], onDelete: Cascade)

  @@unique([dealerId, platform])
  @@index([dealerId])
  @@map("platform_connections")
}

model Review {
  id               String         @id @default(uuid())
  dealerId         String
  platform         Platform
  platformReviewId String
  reviewerName     String
  rating           Int?           // 1-5, null for Facebook
  recommendation   Recommendation?
  reviewText       String
  reviewDate       DateTime
  status           ReviewStatus   @default(NEW)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  dealer           Dealer         @relation(fields: [dealerId], references: [id], onDelete: Cascade)
  response         Response?

  @@unique([platform, platformReviewId])
  @@index([dealerId, status])
  @@index([platform, reviewDate])
  @@map("reviews")
}

model Response {
  id                   String         @id @default(uuid())
  reviewId             String         @unique
  dealerId             String
  generatedText        String
  finalText            String?        // After edits
  status               ResponseStatus @default(DRAFT)
  approvedBy           String?        // 'auto' or user email
  approvedAt           DateTime?
  postedAt             DateTime?
  postError            String?
  generationModel      String
  generationPromptTokens    Int
  generationCompletionTokens Int
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  review               Review         @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  dealer               Dealer         @relation(fields: [dealerId], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([dealerId])
  @@map("responses")
}

model SyncLog {
  id           String     @id @default(uuid())
  dealerId     String
  platform     Platform
  syncType     SyncType
  reviewsFound Int
  reviewsNew   Int
  status       SyncStatus
  errorMessage String?
  startedAt    DateTime
  completedAt  DateTime?

  dealer       Dealer     @relation(fields: [dealerId], references: [id], onDelete: Cascade)

  @@index([dealerId, startedAt])
  @@map("sync_logs")
}

// ============ ENUMS ============

enum Plan {
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum Platform {
  GOOGLE
  FACEBOOK
  DEALERRATER
  YELP
  CARGURUS
}

enum ReviewStatus {
  NEW
  PENDING_RESPONSE
  RESPONDED
  IGNORED
}

enum ResponseStatus {
  DRAFT
  APPROVED
  POSTED
  FAILED
}

enum Recommendation {
  RECOMMENDS
  DOESNT_RECOMMEND
}

enum SyncType {
  FULL
  INCREMENTAL
}

enum SyncStatus {
  SUCCESS
  FAILED
}
```

### Key Design Decisions

1. **Composite unique constraints** — `[platform, platformReviewId]` ensures idempotent sync
2. **Soft references** — `approvedBy` is a string, not FK, to allow 'auto' value
3. **JSON for flexibility** — `voiceProfile` as JSON allows schema evolution without migrations
4. **Encrypted tokens** — Access/refresh tokens marked for encryption in application layer
5. **Audit trail** — `SyncLog` tracks every sync for debugging

### Indexes

```sql
-- Additional indexes for common queries
CREATE INDEX idx_reviews_dealer_date ON reviews(dealer_id, review_date DESC);
CREATE INDEX idx_responses_pending ON responses(status) WHERE status = 'DRAFT';
CREATE INDEX idx_connections_active ON platform_connections(is_active) WHERE is_active = true;
```

---

## External Integrations

### Platform Integration Priority

| Phase | Platform | API Type | Response Capability |
|-------|----------|----------|---------------------|
| MVP | Google Business Profile | Official OAuth | ✅ Full |
| MVP | Facebook | Graph API | ✅ Full |
| Phase 2 | DealerRater | Official REST | ✅ Full |
| Phase 2 | Yelp | Partner REST | ✅ Full |
| Phase 3 | CarGurus | Dealer API | ⚠️ Limited |

### API Credentials Required

```env
# Google
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://app.sentri.io/oauth/google/callback

# Facebook
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
FACEBOOK_REDIRECT_URI=https://app.sentri.io/oauth/facebook/callback

# DealerRater (Phase 2)
DEALERRATER_API_HOST=services.dealerrater.com

# Yelp (Phase 2)
YELP_CLIENT_ID=xxx
YELP_API_KEY=xxx

# Claude AI
ANTHROPIC_API_KEY=xxx

# Communications
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx
SENDGRID_API_KEY=xxx

# Payments
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
```

---

## Security Architecture

### Bruce Schneier (Security Lead)

> "Security is a process, not a product. Build it into every layer."

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Dealer Login                                                 │
│     └─▶ Email + Password ─▶ Bcrypt verify ─▶ JWT issued         │
│                                                                  │
│  2. JWT Structure                                                │
│     {                                                            │
│       sub: dealerId,                                             │
│       email: dealer@example.com,                                 │
│       plan: 'professional',                                      │
│       iat: timestamp,                                            │
│       exp: timestamp + 24h                                       │
│     }                                                            │
│                                                                  │
│  3. Request Flow                                                 │
│     Request ─▶ Auth Middleware ─▶ Verify JWT ─▶ Attach Dealer   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Protection

| Data Type | Protection Method |
|-----------|-------------------|
| Passwords | Bcrypt (cost factor 12) |
| OAuth Tokens | AES-256-GCM encryption at rest |
| JWT Secret | Environment variable, rotatable |
| Database | TLS in transit, encrypted at rest (provider) |
| API Communication | TLS 1.3 only |

### Token Encryption

```typescript
// src/utils/encryption.ts

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### Content Filtering

```typescript
// src/modules/ai/content-filter.ts

const PROHIBITED_PATTERNS = [
  /discount|coupon|% off|free/i,
  /compensation|refund|money back/i,
  /admit|fault|liable|liability/i,
  /lawyer|attorney|legal|lawsuit/i,
  /\$\d+|\d+\s*dollars/i
];

export function filterResponse(text: string): { safe: boolean; issues: string[] } {
  const issues: string[] = [];

  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(text)) {
      issues.push(`Contains prohibited pattern: ${pattern.source}`);
    }
  }

  return {
    safe: issues.length === 0,
    issues
  };
}
```

### Rate Limiting

```typescript
// src/middleware/rate-limit.middleware.ts

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

// General API rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: 'Too many requests, please try again later' }
});

// Auth endpoints (stricter)
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                    // 10 attempts
  message: { error: 'Too many login attempts, please try again later' }
});
```

---

## Infrastructure & DevOps

### Kelsey Hightower (DevOps Lead)

> "The best infrastructure is the infrastructure you don't have to think about."

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION ENVIRONMENT                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Cloudflare  │───▶│   Railway   │───▶│   Railway   │         │
│  │    CDN      │    │   (API)     │    │  (Worker)   │         │
│  └─────────────┘    └──────┬──────┘    └──────┬──────┘         │
│                            │                   │                 │
│                     ┌──────┴───────────────────┴──────┐         │
│                     │                                  │         │
│                     ▼                                  ▼         │
│              ┌─────────────┐                   ┌─────────────┐  │
│              │  Railway    │                   │  Railway    │  │
│              │  Postgres   │                   │   Redis     │  │
│              └─────────────┘                   └─────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### MVP Stack (Railway)

| Service | Railway Service | Monthly Cost |
|---------|-----------------|--------------|
| API Server | Web Service | $5-20 |
| Background Worker | Worker Service | $5-20 |
| PostgreSQL | Database | $5-20 |
| Redis | Database | $5-10 |
| **Total** | | **$20-70/mo** |

### Dockerfile

```dockerfile
# Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/railway-cli@v3
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Environment Variables

```env
# .env.example

# Database
DATABASE_URL=postgresql://user:pass@host:5432/sentri

# Redis
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=generate-a-secure-random-string
ENCRYPTION_KEY=generate-32-byte-hex-key

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# Facebook OAuth
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_REDIRECT_URI=

# AI
ANTHROPIC_API_KEY=

# Communications
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
APP_URL=https://app.sentri.io
API_URL=https://api.sentri.io
NODE_ENV=production
```

### Monitoring & Logging

```typescript
// src/utils/logger.ts

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  base: {
    service: 'sentri',
    env: process.env.NODE_ENV
  }
});

// Usage
logger.info({ dealerId, platform }, 'Syncing reviews');
logger.error({ err, reviewId }, 'Failed to post response');
```

**Monitoring Stack:**
- **Logs:** Railway built-in (MVP) → Datadog (scale)
- **Errors:** Sentry
- **Uptime:** BetterUptime
- **Metrics:** Railway built-in → Prometheus/Grafana (scale)

---

## API Specification

### REST API Endpoints

```
BASE URL: https://api.sentri.io/v1

AUTHENTICATION
POST   /auth/login              # Email/password login
POST   /auth/logout             # Invalidate session
GET    /auth/me                 # Get current dealer

PLATFORMS
GET    /platforms               # List connected platforms
GET    /platforms/:platform/auth-url    # Get OAuth URL
GET    /platforms/:platform/callback    # OAuth callback
DELETE /platforms/:platform     # Disconnect platform

REVIEWS
GET    /reviews                 # List reviews (paginated, filterable)
GET    /reviews/:id             # Get single review
PATCH  /reviews/:id             # Update review status

RESPONSES
GET    /responses               # List responses (paginated)
GET    /responses/:id           # Get single response
PATCH  /responses/:id           # Edit response text
POST   /responses/:id/approve   # Approve response
POST   /responses/:id/post      # Force post (already approved)
POST   /responses/:id/regenerate # Regenerate AI response

ANALYTICS
GET    /analytics/overview      # Dashboard stats
GET    /analytics/response-rate # Response rate over time
GET    /analytics/ratings       # Rating distribution

SETTINGS
GET    /settings                # Get dealer settings
PATCH  /settings                # Update settings
PATCH  /settings/voice          # Update voice profile

WEBHOOKS (internal)
POST   /webhooks/stripe         # Stripe payment webhooks
```

### Example API Responses

```json
// GET /reviews?status=new&limit=10

{
  "data": [
    {
      "id": "uuid",
      "platform": "google",
      "reviewerName": "John Smith",
      "rating": 5,
      "reviewText": "Great service!",
      "reviewDate": "2024-12-01T10:30:00Z",
      "status": "new",
      "response": {
        "id": "uuid",
        "generatedText": "Thank you so much, John!...",
        "status": "draft"
      }
    }
  ],
  "pagination": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

```json
// POST /responses/:id/approve

{
  "success": true,
  "response": {
    "id": "uuid",
    "status": "approved",
    "approvedBy": "dealer@example.com",
    "approvedAt": "2024-12-02T14:20:00Z"
  }
}
```

---

## Implementation Plan

### Andy Grove (Project Manager)

> "A plan is only as good as its execution. Ship weekly."

### Phase 1: MVP (Weeks 1-3)

**Week 1: Foundation**
| Day | Task | Owner |
|-----|------|-------|
| 1-2 | Project setup, database schema, Prisma | Backend |
| 2-3 | Auth (login, JWT, middleware) | Backend |
| 3-4 | Google OAuth flow | Backend |
| 4-5 | Review sync job (Google) | Backend |

**Week 2: Core Features**
| Day | Task | Owner |
|-----|------|-------|
| 1-2 | Claude integration, response generation | Backend |
| 2-3 | Response posting (Google) | Backend |
| 3-4 | React project setup, auth pages | Frontend |
| 4-5 | Dashboard layout, review list | Frontend |

**Week 3: Polish & Deploy**
| Day | Task | Owner |
|-----|------|-------|
| 1-2 | Response approval workflow | Full stack |
| 2-3 | Settings page, voice profile | Full stack |
| 3-4 | Testing, bug fixes | All |
| 4-5 | Railway deployment, DNS | DevOps |

**MVP Definition of Done:**
- [ ] Dealer can sign up and log in
- [ ] Dealer can connect Google Business Profile
- [ ] Reviews sync automatically every 15 minutes
- [ ] AI generates response for each new review
- [ ] Dealer can view, edit, approve, and post responses
- [ ] Auto-approve works for 4+ star reviews
- [ ] Mobile-responsive dashboard
- [ ] Deployed to production

### Phase 2: Facebook + Polish (Weeks 4-5)

| Task | Owner |
|------|-------|
| Facebook OAuth integration | Backend |
| Facebook review sync | Backend |
| Facebook response posting | Backend |
| Email notifications (new reviews) | Backend |
| SMS notifications (optional) | Backend |
| Onboarding flow improvements | Frontend |
| Performance optimization | Full stack |

### Phase 3: Scale Features (Weeks 6-8)

| Task | Owner |
|------|-------|
| DealerRater integration | Backend |
| Yelp integration | Backend |
| Stripe billing integration | Backend |
| Analytics dashboard | Full stack |
| Multi-location support | Full stack |

---

## Appendix: Quick Reference

### Commands

```bash
# Development
npm run dev           # Start dev server
npm run db:migrate    # Run migrations
npm run db:seed       # Seed test data
npm run test          # Run tests
npm run lint          # Lint code

# Production
npm run build         # Build for production
npm start             # Start production server

# Database
npx prisma studio     # Open Prisma Studio
npx prisma generate   # Regenerate client
```

### Key File Locations

```
Server entry:     /server/src/index.ts
Routes:           /server/src/routes/
Platform adapters:/server/src/modules/platforms/
AI prompts:       /server/src/modules/ai/prompts.ts
DB schema:        /server/prisma/schema.prisma

Client entry:     /client/src/main.tsx
Pages:            /client/src/pages/
Components:       /client/src/components/
API client:       /client/src/api/
```

---

**Document Status:** Ready for implementation
**Next Step:** Begin Week 1, Day 1 — Project setup

*Signed off by the architecture team: Linus, Rob, Dan, Martin, Kelsey, Bruce, Luke*
*Approved by: Andy Grove*
