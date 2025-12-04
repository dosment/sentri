# Sentri

> **"Your reputation, on guard."**

AI-powered review response automation for automotive dealerships.

## The Onliness Statement

**Sentri is the ONLY review response platform that executes automatically — not just monitors.**

## Overview

Sentri monitors reviews across Google, Facebook, DealerRater, Yelp, and more — then generates personalized, on-brand responses using AI. Auto-approve positive reviews, queue negatives for review. Achieve 100% response rate with zero daily effort.

## Features

- **Multi-platform monitoring** — Google Business Profile, Facebook, DealerRater, Yelp, CarGurus
- **AI response generation** — Personalized, contextual responses via Google Gemini
- **Smart automation** — Auto-approve 4-5 star reviews, queue negatives for human review
- **Unified dashboard** — All reviews in one place, mobile-friendly
- **Real-time alerts** — Email/SMS notifications for new reviews

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, TypeScript, Tailwind CSS
- **Database:** PostgreSQL (Prisma ORM)
- **Queue:** Redis + BullMQ
- **AI:** Gemini API (Google)
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

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+ (running locally or via Docker)
- **Redis** (optional for MVP, required for queue processing)

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Set Up Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/sentri
JWT_SECRET=your-jwt-secret-min-32-chars-long
ENCRYPTION_KEY=your-encryption-key-32-chars

# Optional for MVP (demo mode works without these)
GEMINI_API_KEY=your-gemini-api-key
REDIS_URL=redis://localhost:6379
```

### 3. Set Up Database

```bash
# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Start Development Server

```bash
# From project root - starts both server (3000) and client (5173)
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend API
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### 5. Access the App

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000
- **Demo login:** `demo@example.com` / `demo1234`

### Troubleshooting

**"Request failed" on login:**
- Ensure PostgreSQL is running
- Ensure the server is running on port 3000
- Check `server/.env` has correct `DATABASE_URL`

**Database connection errors:**
- Verify PostgreSQL is running: `pg_isready`
- Check database exists: `psql -l | grep sentri`

**Port already in use:**
- Kill existing process: `lsof -ti:3000 | xargs kill -9`

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
