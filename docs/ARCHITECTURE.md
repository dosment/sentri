# Sentri — Technical Architecture

**Version:** 2.0
**Date:** December 2024

---

## Brand Quick Reference

| Element | Value |
|---------|-------|
| **Name** | Sentri |
| **Primary Color** | `#1E3A5F` |
| **Secondary Color** | `#0F2340` |
| **Font** | Inter |
| **Domain** | sentri.io |

See [BRAND-GUIDELINES.md](BRAND-GUIDELINES.md) for complete brand documentation.

---

## Architecture Principles

1. **Monolith first** — One service, one database, one deployment
2. **Boring technology** — PostgreSQL, Node.js, React
3. **Simplicity over cleverness** — No microservices, no Kubernetes
4. **Optimize for iteration** — Ship fast, refactor later

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│   Browser (React)  │  Mobile (PWA)  │  Email/SMS Notifications  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOAD BALANCER / CDN                          │
│                        (Cloudflare)                              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│       API SERVER         │      │       STATIC ASSETS          │
│    (Node.js + Express)   │      │     (React SPA on CDN)       │
└────────────┬─────────────┘      └──────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION MODULES                          │
│  Auth │ Reviews │ Responses │ Platforms │ AI │ Notifications    │
└────────────┬────────────────────────────────────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌───────────┐ ┌───────────┐
│ PostgreSQL│ │   Redis   │
│ (Primary) │ │  (Queue)  │
└───────────┘ └───────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  Google API │ Facebook API │ Claude AI │ Twilio │ SendGrid      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js 20, Express, TypeScript |
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Database** | PostgreSQL 15 (Prisma ORM) |
| **Queue** | Redis 7, BullMQ |
| **AI** | Claude API (Anthropic) |
| **Hosting** | Railway (MVP), AWS (scale) |
| **SMS** | Twilio |
| **Email** | SendGrid |

---

## Project Structure

```
/sentri
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BRAND-GUIDELINES.md
│   ├── BUSINESS-PLAN.md
│   ├── EDGE-CASES.md
│   └── PLATFORMS.md
│
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── redis.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── reviews.routes.ts
│   │   │   ├── responses.routes.ts
│   │   │   └── platforms.routes.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── platforms/
│   │   │   │   ├── platform.interface.ts
│   │   │   │   ├── google.platform.ts
│   │   │   │   ├── facebook.platform.ts
│   │   │   │   └── platform.factory.ts
│   │   │   ├── reviews/
│   │   │   ├── responses/
│   │   │   ├── ai/
│   │   │   └── notifications/
│   │   ├── jobs/
│   │   │   ├── queue.ts
│   │   │   ├── sync-reviews.job.ts
│   │   │   ├── generate-response.job.ts
│   │   │   └── post-response.job.ts
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── Dockerfile
│
└── client/
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── layout/
    │   │   ├── reviews/
    │   │   └── platforms/
    │   ├── pages/
    │   ├── hooks/
    │   ├── api/
    │   └── lib/
    ├── package.json
    └── tailwind.config.js
```

---

## Database Schema

```prisma
model Dealer {
  id                   String   @id @default(uuid())
  email                String   @unique
  passwordHash         String?
  name                 String
  phone                String?
  plan                 Plan     @default(STARTER)
  voiceProfile         Json?
  autoApproveThreshold Int      @default(4)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  platformConnections  PlatformConnection[]
  reviews              Review[]
  responses            Response[]
}

model PlatformConnection {
  id                String    @id @default(uuid())
  dealerId          String
  platform          Platform
  platformAccountId String
  accessToken       String    // Encrypted
  refreshToken      String?   // Encrypted
  tokenExpiresAt    DateTime?
  isActive          Boolean   @default(true)
  lastSyncAt        DateTime?
  createdAt         DateTime  @default(now())

  dealer            Dealer    @relation(fields: [dealerId], references: [id], onDelete: Cascade)

  @@unique([dealerId, platform])
}

model Review {
  id               String       @id @default(uuid())
  dealerId         String
  platform         Platform
  platformReviewId String
  reviewerName     String
  rating           Int?
  recommendation   Recommendation?
  reviewText       String
  reviewDate       DateTime
  status           ReviewStatus @default(NEW)
  createdAt        DateTime     @default(now())

  dealer           Dealer       @relation(fields: [dealerId], references: [id], onDelete: Cascade)
  response         Response?

  @@unique([platform, platformReviewId])
}

model Response {
  id                   String         @id @default(uuid())
  reviewId             String         @unique
  dealerId             String
  generatedText        String
  finalText            String?
  status               ResponseStatus @default(DRAFT)
  approvedBy           String?
  approvedAt           DateTime?
  postedAt             DateTime?
  postError            String?
  createdAt            DateTime       @default(now())

  review               Review         @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  dealer               Dealer         @relation(fields: [dealerId], references: [id], onDelete: Cascade)
}

enum Plan { STARTER, PROFESSIONAL, ENTERPRISE }
enum Platform { GOOGLE, FACEBOOK, DEALERRATER, YELP }
enum ReviewStatus { NEW, PENDING_RESPONSE, RESPONDED, IGNORED }
enum ResponseStatus { DRAFT, APPROVED, POSTED, FAILED }
enum Recommendation { RECOMMENDS, DOESNT_RECOMMEND }
```

---

## Core Interfaces

### Platform Adapter

```typescript
// server/src/modules/platforms/platform.interface.ts

export interface IPlatformAdapter {
  getAuthUrl(dealerId: string): string;
  handleCallback(code: string, dealerId: string): Promise<PlatformConnection>;
  refreshToken(connection: PlatformConnection): Promise<PlatformConnection>;
  fetchReviews(connection: PlatformConnection, since?: Date): Promise<Review[]>;
  postResponse(connection: PlatformConnection, reviewId: string, text: string): Promise<void>;
}
```

### Review Sync Job

```typescript
// server/src/jobs/sync-reviews.job.ts

// Runs every 15 minutes
// 1. Get all active platform connections
// 2. For each connection:
//    a. Refresh token if expired
//    b. Fetch reviews since last sync
//    c. Upsert new reviews (idempotent via platformReviewId)
//    d. Queue response generation for new reviews
// 3. Update lastSyncAt
```

### Response Generation

```typescript
// server/src/modules/ai/prompts.ts

// System prompt structure:
// - Dealer name and voice profile
// - Guidelines for positive vs negative reviews
// - Prohibited content (discounts, compensation, liability)
// - Output format requirements
```

---

## API Endpoints

```
BASE: https://api.sentri.io/v1

AUTH
POST   /auth/login
POST   /auth/logout
GET    /auth/me

PLATFORMS
GET    /platforms
GET    /platforms/:platform/auth-url
GET    /platforms/:platform/callback
DELETE /platforms/:platform

REVIEWS
GET    /reviews
GET    /reviews/:id
PATCH  /reviews/:id

RESPONSES
PATCH  /responses/:id
POST   /responses/:id/approve
POST   /responses/:id/regenerate

ANALYTICS
GET    /analytics/overview
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/sentri

# Redis
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=
ENCRYPTION_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://app.sentri.io/oauth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_REDIRECT_URI=https://app.sentri.io/oauth/facebook/callback

# AI
ANTHROPIC_API_KEY=

# Communications
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
SENDGRID_API_KEY=

# App
APP_URL=https://app.sentri.io
API_URL=https://api.sentri.io
NODE_ENV=production
```

---

## Frontend: Brand Integration

```javascript
// client/tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sentri-blue': '#1E3A5F',
        'guardian-navy': '#0F2340',
        'success': '#10B981',
        'warning': '#F59E0B',
        'alert': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## Deployment

### Railway (MVP)

| Service | Type | Est. Cost |
|---------|------|-----------|
| API Server | Web Service | $5-20/mo |
| Worker | Worker Service | $5-20/mo |
| PostgreSQL | Database | $5-20/mo |
| Redis | Database | $5-10/mo |

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Security Checklist

- [ ] OAuth tokens encrypted at rest (AES-256-GCM)
- [ ] JWT with 24-hour expiration
- [ ] Rate limiting (100 req/15min API, 10 req/hr auth)
- [ ] Content filtering on AI responses (no compensation/liability language)
- [ ] Input sanitization for AI prompt injection
- [ ] HTTPS only (TLS 1.3)

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-3)
- Auth, Google OAuth, review sync
- AI response generation
- Basic dashboard, approval workflow

### Phase 2: Expand (Weeks 4-5)
- Facebook integration
- Notifications (email/SMS)
- Bulk approve UI

### Phase 3: Scale (Weeks 6-8)
- DealerRater, Yelp integration
- Analytics dashboard
- Stripe billing
