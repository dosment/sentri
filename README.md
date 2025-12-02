# Sentri

> **"Your reputation, on guard."**

AI-powered review response automation for automotive dealerships.

## The Onliness Statement

**Sentri is the ONLY review response platform that executes automatically — not just monitors.**

## Overview

Sentri monitors reviews across Google, Facebook, DealerRater, Yelp, and more — then generates personalized, on-brand responses using AI. Auto-approve positive reviews, queue negatives for review. Achieve 100% response rate with zero daily effort.

## Features

- **Multi-platform monitoring** — Google Business Profile, Facebook, DealerRater, Yelp, CarGurus
- **AI response generation** — Personalized, contextual responses via Claude
- **Smart automation** — Auto-approve 4-5 star reviews, queue negatives for human review
- **Unified dashboard** — All reviews in one place, mobile-friendly
- **Real-time alerts** — Email/SMS notifications for new reviews

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, TypeScript, Tailwind CSS
- **Database:** PostgreSQL (Prisma ORM)
- **Queue:** Redis + BullMQ
- **AI:** Claude API (Anthropic)
- **Infrastructure:** Railway

## Project Structure

```
/sentri
├── docs/               # Documentation
├── server/             # Backend API
├── client/             # Frontend React app
└── README.md
```

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Run development server
npm run dev
```

## Documentation

- [Business Plan](docs/BUSINESS-PLAN.md) — Market, pricing, GTM strategy
- [Architecture](docs/ARCHITECTURE.md) — Technical design, database, API
- [Brand Guidelines](docs/BRAND-GUIDELINES.md) — Identity, voice, visual
- [Platforms](docs/PLATFORMS.md) — API integration details
- [Edge Cases](docs/EDGE-CASES.md) — Known gaps and considerations

## Brand

| Element | Value |
|---------|-------|
| **Name** | Sentri |
| **Tagline** | "Your reputation, on guard." |
| **Primary Color** | `#1E3A5F` (Sentri Blue) |
| **Font** | Inter |

See [Brand Guidelines](docs/BRAND-GUIDELINES.md) for complete brand documentation.

## License

Proprietary - All rights reserved.
