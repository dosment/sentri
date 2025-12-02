# AI Review Response Automation — Full Business Plan & Architecture

**Product Name:** ReplyEngine (working title)
**Version:** 1.0
**Date:** December 2024
**Prepared by:** Andy Grove (Project Manager) with full team input

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Market Analysis](#market-analysis)
3. [Platform Priority Matrix](#platform-priority-matrix)
4. [Competitive Analysis](#competitive-analysis)
5. [Product Definition](#product-definition)
6. [Business Model](#business-model)
7. [Go-to-Market Strategy](#go-to-market-strategy)
8. [Technical Architecture](#technical-architecture)
9. [Development Roadmap](#development-roadmap)
10. [Risk Analysis](#risk-analysis)
11. [Financial Projections](#financial-projections)
12. [Team Input Summary](#team-input-summary)

---

## Executive Summary

ReplyEngine is an AI-powered review response automation platform for automotive dealerships. We monitor reviews across all major platforms, generate personalized responses using AI, and either auto-post or queue for approval — ensuring 100% response rate with minimal dealer effort.

**The Problem:** Dealers receive dozens of reviews monthly across multiple platforms but respond to fewer than 30%. Poor response rates hurt reputation scores, SEO rankings, and customer trust. Existing tools monitor reviews but still require humans to write responses.

**The Solution:** AI-native review response that actually executes. Responses get posted, not just suggested.

**Target Market:** 18,000+ franchised dealerships and 40,000+ independent dealers in the US.

**Revenue Target:** $10K MRR within 4-6 months (34 dealers at $300/month).

**Competitive Advantage:** We're not a monitoring tool with templates. We're an execution engine that achieves 100% response rate automatically.

---

## Market Analysis

### Review Platform Landscape

**Rebecca Lindland (Market Research):**

"I've analyzed the review ecosystem for automotive dealerships. Here's what the data shows:

#### Consumer Behavior
- **97%** of consumers check online reviews before visiting a local business (2024)
- **95%** of car buyers use digital sources to research vehicles
- **56%** say third-party sites (Edmunds, KBB, Cars.com) are most useful — 3x more than any other source
- The Internet is **20x more influential** than any other media source for car buyers

#### Review Impact
- One-star rating drop = **5-9% revenue decrease**
- **53%** of customers expect businesses to respond within 7 days
- Businesses with higher review counts earn up to **50% more revenue**
- Google reviews have **3x the influence** on local purchase decisions vs. dedicated auto sites

#### Dealer Response Reality
- Average dealer response rate: **under 30%**
- Most have reputation tools but **underutilize them**
- The gap isn't software — it's **execution**

Sources: [BrightLocal](https://www.brightlocal.com/resources/top-review-sites/review-sites-by-industry/car-dealership-review-sites/), [Widewail](https://www.widewail.com/blog/top-automotive-review-sites-every-dealership-should-prioritize-in-2025), [Podium](https://www.podium.com/article/auto-dealership-review-sites)"

---

## Platform Priority Matrix

**Rebecca Lindland (Market Research) + Brian Pasch (Marketing):**

Based on consumer influence, API availability, and implementation complexity, here's our platform prioritization:

### Tier 1: Launch (Must Have)

| Platform | Monthly Visitors | API Status | Response API | Priority |
|----------|------------------|------------|--------------|----------|
| **Google Business Profile** | Dominant | ✅ Official API | ✅ Yes | **P0** |
| **Facebook** | 2.9B users | ⚠️ Limited | ✅ Via Graph API | **P0** |

**Rationale:** Google is non-negotiable — it's the #1 factor in local SEO and the most visible to consumers. Facebook has massive reach and reviews appear in search results. Both have APIs that support response posting.

### Tier 2: Phase 2 (High Value)

| Platform | Monthly Visitors | API Status | Response API | Priority |
|----------|------------------|------------|--------------|----------|
| **DealerRater** | 34M/month | ✅ Official API | ✅ Yes | **P1** |
| **Cars.com** | 31M/month | ✅ Via DealerRater | ✅ Yes | **P1** |
| **Yelp** | High | ✅ Partner API | ✅ R2R API | **P1** |

**Rationale:** DealerRater is the #1 automotive-specific review site with 7M+ reviews. Cars.com owns DealerRater and shares the API. Yelp has official Respond to Reviews API for partners.

### Tier 3: Phase 3 (Expansion)

| Platform | Monthly Visitors | API Status | Response API | Priority |
|----------|------------------|------------|--------------|----------|
| **CarGurus** | High | ✅ Dealer API | ⚠️ Limited | **P2** |
| **Edmunds** | 15.5M/year | ❌ No public API | ❌ Manual | **P2** |
| **Carfax** | High | ❌ No public API | ❌ Manual | **P3** |

**Rationale:** CarGurus has an API but response capabilities are limited. Edmunds and Carfax lack public APIs — would require partnership or manual workflow.

### Platform API Details

#### Google Business Profile API
- **Documentation:** [developers.google.com/my-business](https://developers.google.com/my-business/content/review-data)
- **Capabilities:** List reviews, get review details, reply to reviews, delete replies
- **Authentication:** OAuth 2.0
- **Rate Limits:** Standard Google API quotas
- **Requirements:** Verified Google Business Profile, Google Cloud account

#### Facebook Graph API
- **Documentation:** [developers.facebook.com](https://developers.facebook.com)
- **Capabilities:** Read reviews/recommendations, reply via comments
- **Authentication:** Page Access Token (requires page admin)
- **Note:** Facebook now uses recommendations (recommend/don't recommend) instead of stars
- **Limitations:** Ratings endpoint removed after Graph API v3.2

#### DealerRater / Cars.com API
- **Documentation:** [developers.dealerrater.com](https://developers.dealerrater.com/)
- **Capabilities:** Fetch reviews, add/update/delete responses
- **Authentication:** API token via Certified Dealer Program
- **Host:** services.dealerrater.com (HTTPS required)
- **Note:** 97% of customers read dealership responses; 2-week window to respond to negative reviews

#### Yelp Respond to Reviews API
- **Documentation:** [docs.developer.yelp.com](https://docs.developer.yelp.com/docs/respond-to-reviews-api-v2)
- **Capabilities:** Respond publicly to reviews
- **Authentication:** Business user access token
- **Endpoint:** POST https://partner-api.yelp.com/reviews/v1/{review_id}
- **Requirements:** Partner status, review_id from Full-text Review API

#### CarGurus Dealer Reviews API
- **Documentation:** [cargurus.com/Cars/developers](https://www.cargurus.com/Cars/developers/docs/DealerReviews.html)
- **Capabilities:** Retrieve reviews for dealer
- **Limitations:** Primarily read-only; limited to 160 characters for sharing
- **Contact:** support@cargurus.com for integration

---

## Competitive Analysis

**Jeff Bezos (Business Strategy):**

"Know your competition, but don't copy them. Find the gap they've left open."

### Direct Competitors

| Competitor | Pricing | Strengths | Weaknesses | Our Opportunity |
|------------|---------|-----------|------------|-----------------|
| **Podium** | $350-600+/mo | Full suite (reviews, messaging, payments), strong brand | Complex, requires staff engagement, expensive | Simpler, cheaper, AI-native |
| **Birdeye** | $299-449/mo | Comprehensive features, good automotive focus | Enterprise-oriented, templated responses feel robotic | True AI personalization |
| **Reputation.com** | $500-1,500/mo | Enterprise-grade, multi-location | Overkill for small dealers, expensive | Right-sized for independents |
| **Widewail** | Custom | Automotive-focused, human+AI hybrid | Higher cost for human involvement | Fully automated alternative |
| **ReviewTrackers** | $59-299/mo | Good monitoring, affordable | Limited response automation | AI response generation |

### Competitive Gap Analysis

**What competitors do well:**
- Monitoring across platforms
- Alerting on new reviews
- Providing templates
- Analytics and reporting

**What competitors do poorly:**
- Actual response generation (still requires human writing)
- Personalization (templates are obvious)
- Full automation (still needs daily human attention)
- Simplicity (feature bloat)

**Our differentiation:**
1. **AI-native response generation** — Not templates, actual contextual responses
2. **Execution-first** — Responses get posted, not just suggested
3. **Set-and-forget automation** — Auto-approve positive reviews, queue negatives
4. **Price disruption** — 50-70% less than Birdeye/Podium
5. **Simplicity** — One job, done excellently

---

## Product Definition

**Marty Cagan (Product):**

"Start with the customer problem, not the feature list. What job are they hiring us to do?"

### Customer Job-to-be-Done

*"I want every review about my dealership to receive a thoughtful, personalized response without me or my staff spending time on it."*

### Core Features (MVP)

#### 1. Multi-Platform Review Aggregation
- Connect Google Business Profile, Facebook
- Unified inbox showing all reviews
- Real-time sync (polling every 15-30 minutes)
- New review notifications (email, SMS, push)

#### 2. AI Response Generation
- Analyze review sentiment, content, and context
- Generate personalized response matching dealer voice
- Handle positive reviews (thank, reinforce)
- Handle negative reviews (empathize, address, invite resolution)
- Support for multiple response styles (professional, warm, casual)

#### 3. Response Workflow
- **Auto-approve mode:** 4-5 star reviews auto-post after brief delay
- **Review mode:** All responses queued for human approval
- **Hybrid mode:** Auto-approve positive, queue negative
- Edit capability before posting
- Bulk approval for efficiency

#### 4. Dealer Dashboard
- Review feed with status (new, responded, pending)
- Response rate metrics
- Rating trends over time
- Platform breakdown
- Simple, fast, mobile-friendly

### Future Features (Post-MVP)

- DealerRater/Cars.com integration
- Yelp integration
- Review request campaigns (proactive)
- Competitor monitoring
- Advanced analytics
- Multi-location management
- White-label for agencies
- Sentiment trend analysis

### User Experience Principles

**Steve Jobs (UI/UX):**

"Design is not just what it looks like. Design is how it works. This tool must be invisible — it should feel like the reviews are just... handled."

1. **Zero daily effort** — Dealer logs in weekly to spot-check, not daily to work
2. **Instant value** — See first AI response within 5 minutes of signup
3. **Trust through transparency** — Show exactly what was posted, when, where
4. **Mobile-first** — GMs check on their phone between meetings
5. **Fast** — Dashboard loads in under 2 seconds, always

---

## Business Model

**Jeff Bezos (Business Strategy):**

### Pricing Structure

| Plan | Price | Platforms | Features |
|------|-------|-----------|----------|
| **Starter** | $199/mo | Google + Facebook | Up to 100 reviews/mo, hybrid approval |
| **Professional** | $299/mo | All Tier 1+2 platforms | Unlimited reviews, auto-approve, priority support |
| **Enterprise** | $499/mo | All platforms + multi-location | Volume pricing, dedicated support, custom voice training |

**Per-location pricing** — Each rooftop is a subscription.

**Annual discount:** 15% off for annual prepay ($169/mo Starter, $254/mo Professional)

### Revenue Projections

**Path to $10K MRR:**

| Month | Dealers | Plan Mix | MRR |
|-------|---------|----------|-----|
| 1 | 5 | Pilots (free) | $0 |
| 2 | 10 | 8 Starter, 2 Pro | $2,190 |
| 3 | 18 | 12 Starter, 6 Pro | $4,182 |
| 4 | 28 | 18 Starter, 10 Pro | $6,572 |
| 5 | 38 | 24 Starter, 14 Pro | $8,962 |
| 6 | 45 | 28 Starter, 17 Pro | $10,679 |

**Assumptions:**
- 70% Starter, 30% Professional mix
- 5% monthly churn after month 3
- 2 referrals per happy customer

### Unit Economics

| Metric | Value |
|--------|-------|
| CAC (Customer Acquisition Cost) | $150-300 (target) |
| LTV (Lifetime Value) | $2,500-4,000 (20-month avg lifespan) |
| LTV:CAC Ratio | 10:1+ |
| Gross Margin | 85%+ (API costs minimal) |
| Payback Period | 1-2 months |

### Cost Structure (Monthly at Scale)

| Item | Cost |
|------|------|
| OpenAI/Claude API | $200-500 |
| Google Cloud / AWS | $100-200 |
| Twilio (SMS alerts) | $50-100 |
| Domain, email, misc | $50 |
| **Total** | **$400-850/mo** |

At $10K MRR with $850 costs = **91.5% gross margin**

---

## Go-to-Market Strategy

**Brian Pasch (Automotive Marketing):**

"Dealers buy from people they trust. Trust comes from proof, not promises. Lead with results."

### Phase 1: Validation (Weeks 1-4)

**Objective:** Prove the product works with real dealers.

1. **Recruit 5 pilot dealers** from Dan's network
   - Offer 30 days free
   - Require: honest feedback, testimonial if satisfied
   - Target: mix of franchise and independent

2. **Onboarding process:**
   - 15-minute setup call
   - Connect Google + Facebook
   - Configure voice/tone preferences
   - First responses generated within 1 hour

3. **Success metrics:**
   - Response rate: 0% → 100%
   - Time to respond: days → hours
   - Dealer satisfaction: NPS > 50

### Phase 2: First Revenue (Weeks 5-8)

**Objective:** Convert pilots, get referrals, prove pricing.

1. **Conversion conversation:**
   - Show metrics: reviews responded, time saved
   - Calculate value: "We responded to 47 reviews. At 10 min each, that's 8 hours saved."
   - Ask for credit card

2. **Referral engine:**
   - Ask each paying dealer for 2 introductions
   - Offer: 1 month free for each referral that converts
   - Target: 20 referred leads from 5 customers

3. **Case study development:**
   - Before/after response rates
   - Sample responses (with permission)
   - Testimonial quotes

### Phase 3: Scale (Months 3-6)

**Objective:** Systematic acquisition to $10K MRR.

1. **Direct outreach:**
   - Target dealers with visible review problems (low response rates)
   - Personalized email: "I noticed your Google reviews..."
   - Include screenshot of their unresponded reviews

2. **Content marketing:**
   - Blog: "Why 70% of Dealers Are Losing Customers Before They Walk In"
   - LinkedIn posts with industry data
   - Guest posts on automotive blogs

3. **Industry presence:**
   - Local dealer association meetings
   - 20 Groups presentations (if accessible)
   - Digital Dealer conference (future)

### Sales Process

**The Demo That Sells:**

1. **Before the call:** Pull their Google reviews. Find 5+ unresponded.
2. **Open:** "I looked at your Google reviews. You have 23 reviews in the last 90 days. You responded to 4. That's hurting you."
3. **Show:** Generate a live AI response to one of their reviews
4. **Close:** "For $299/month, you'll respond to 100% of reviews. Can we start today?"

**Objection handling:**

| Objection | Response |
|-----------|----------|
| "We don't have time" | "That's exactly why this exists. It takes zero time." |
| "We tried Podium/Birdeye" | "And you're still not responding. Because those tools require you to write. We don't." |
| "It's too expensive" | "You're spending $50/lead on Cars.com. One customer lost to bad reviews costs more than a year of this." |
| "AI responses seem fake" | "Let me show you. [Generate live response.] Does that sound fake?" |

---

## Technical Architecture

**Linus Torvalds (Architecture) + Rob Pike (Backend):**

"Keep it simple. One database. One service. No microservices until you need them. Boring technology wins."

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  React SPA (Dashboard)  │  Mobile Web  │  Email/SMS Notifications│
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                     Node.js / Express                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │   Auth   │ │ Reviews  │ │ Response │ │ Webhooks │            │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ Review Sync    │  │ AI Response    │  │ Post Response  │     │
│  │ Service        │  │ Generator      │  │ Service        │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ Notification   │  │ Analytics      │  │ Scheduler      │     │
│  │ Service        │  │ Service        │  │ (Cron Jobs)    │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Google   │ │ Facebook │ │ Dealer   │ │  Yelp    │            │
│  │ Business │ │ Graph    │ │ Rater    │ │ Partner  │            │
│  │ API      │ │ API      │ │ API      │ │ API      │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│  │ OpenAI / │ │ Twilio   │ │SendGrid  │                         │
│  │ Claude   │ │ (SMS)    │ │ (Email)  │                         │
│  └──────────┘ └──────────┘ └──────────┘                         │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│           PostgreSQL (Primary Database)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ dealers  │ │ reviews  │ │responses │ │ platform │            │
│  │          │ │          │ │          │ │ _connections│         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│           Redis (Caching, Job Queue)                             │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React + TypeScript | Industry standard, fast development |
| **Backend** | Node.js + Express | Simple, fast, good for I/O-heavy work |
| **Database** | PostgreSQL | Reliable, scalable, JSON support |
| **Cache/Queue** | Redis | Job queue for async processing |
| **AI** | Claude API (primary), OpenAI (fallback) | Best quality for nuanced responses |
| **Hosting** | Railway or Render (MVP), AWS (scale) | Simple deployment, low ops burden |
| **SMS** | Twilio | Industry standard, reliable |
| **Email** | SendGrid | Reliable, good deliverability |

### Database Schema

```sql
-- Dealers (our customers)
CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    plan VARCHAR(50) DEFAULT 'starter',
    voice_profile JSONB, -- tone, style preferences
    auto_approve_threshold INTEGER DEFAULT 4, -- auto-approve 4+ star reviews
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Platform Connections (OAuth tokens, etc.)
CREATE TABLE platform_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'google', 'facebook', 'dealerrater', 'yelp'
    platform_account_id VARCHAR(255), -- their ID on that platform
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(dealer_id, platform)
);

-- Reviews (aggregated from all platforms)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_review_id VARCHAR(255) NOT NULL, -- ID on source platform
    reviewer_name VARCHAR(255),
    rating INTEGER, -- 1-5, NULL for Facebook recommendations
    recommendation VARCHAR(20), -- 'recommends', 'doesnt_recommend' for Facebook
    review_text TEXT,
    review_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'pending_response', 'responded', 'ignored'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, platform_review_id)
);

-- Responses (AI-generated and posted)
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    generated_text TEXT NOT NULL,
    final_text TEXT, -- after any edits
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'posted', 'failed'
    approved_by VARCHAR(255), -- 'auto' or user email
    approved_at TIMESTAMP,
    posted_at TIMESTAMP,
    post_error TEXT,
    generation_model VARCHAR(50), -- 'claude-3-sonnet', etc.
    generation_prompt_tokens INTEGER,
    generation_completion_tokens INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sync Log (for debugging and auditing)
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    sync_type VARCHAR(50), -- 'full', 'incremental'
    reviews_found INTEGER,
    reviews_new INTEGER,
    status VARCHAR(50), -- 'success', 'failed'
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_reviews_dealer_status ON reviews(dealer_id, status);
CREATE INDEX idx_reviews_platform_date ON reviews(platform, review_date DESC);
CREATE INDEX idx_responses_status ON responses(status);
CREATE INDEX idx_platform_connections_dealer ON platform_connections(dealer_id);
```

### Core Workflows

#### 1. Review Sync Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Scheduler  │────▶│  Sync Job   │────▶│  Platform   │
│  (15 min)   │     │  Worker     │     │  API        │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Compare    │
                   │  Reviews    │
                   └──────┬──────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       ┌─────────────┐         ┌─────────────┐
       │  New Review │         │  Existing   │
       │  → Insert   │         │  → Skip     │
       └──────┬──────┘         └─────────────┘
              │
              ▼
       ┌─────────────┐
       │  Trigger    │
       │  Response   │
       │  Generation │
       └─────────────┘
```

#### 2. Response Generation Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  New Review │────▶│  Build      │────▶│  Claude     │
│  Detected   │     │  Prompt     │     │  API        │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Response   │
                                        │  Generated  │
                                        └──────┬──────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    ▼                                                      ▼
             ┌─────────────┐                                        ┌─────────────┐
             │  Rating ≥ 4 │                                        │  Rating < 4 │
             │  Auto Mode? │                                        │  OR Manual  │
             └──────┬──────┘                                        └──────┬──────┘
                    │                                                      │
                    ▼                                                      ▼
             ┌─────────────┐                                        ┌─────────────┐
             │  Auto Post  │                                        │  Queue for  │
             │  (delayed)  │                                        │  Approval   │
             └─────────────┘                                        └─────────────┘
```

#### 3. Response Posting Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Approved   │────▶│  Get        │────▶│  Post via   │
│  Response   │     │  Platform   │     │  Platform   │
└─────────────┘     │  Connection │     │  API        │
                    └─────────────┘     └──────┬──────┘
                                               │
                          ┌────────────────────┴────────────────────┐
                          ▼                                          ▼
                   ┌─────────────┐                            ┌─────────────┐
                   │  Success    │                            │  Failed     │
                   │  → Update   │                            │  → Log      │
                   │    Status   │                            │  → Retry    │
                   └─────────────┘                            └─────────────┘
```

### AI Response Generation

**Prompt Engineering:**

```
System: You are a professional response writer for {dealer_name}, an automotive
dealership. Your job is to write thoughtful, personalized responses to customer
reviews.

Voice profile: {voice_profile}
- Tone: {professional | warm | casual}
- Sign-off: {name or none}
- Special instructions: {any dealer-specific notes}

Guidelines:
- Keep responses 2-4 sentences
- For positive reviews: Thank specifically for what they mentioned, reinforce
  the positive experience, invite them back
- For negative reviews: Acknowledge their frustration, apologize for the
  experience, take ownership without excuses, invite offline resolution
- Never be defensive
- Never offer discounts or compensation in the response
- Never use generic phrases like "We value your feedback"
- Reference specific details from their review to show you read it

Review to respond to:
- Platform: {platform}
- Rating: {rating}/5
- Reviewer: {reviewer_name}
- Content: {review_text}

Write a response:
```

**Response Examples:**

*5-star review:* "Sarah and the service team were amazing! Got my oil change done in 30 minutes and they even washed my car!"

*AI Response:* "Thank you so much! Sarah will be thrilled to hear this — she takes a lot of pride in keeping our service lane running efficiently. The car wash is our little thank-you for trusting us with your vehicle. We'll see you next time!"

*2-star review:* "Waited 2 hours for a scheduled oil change. No one communicated the delay. Disappointed."

*AI Response:* "I'm sorry we let you down. A 2-hour wait for a scheduled service isn't acceptable, and you deserved better communication about the delay. I'd like to make this right — please reach out to me directly at [contact] so we can discuss what happened and ensure your next visit is the experience you should have had."

### Security Considerations

**Bruce Schneier (Security):**

"Security isn't a feature — it's a foundation. Build it in from day one."

#### Data Protection
- All OAuth tokens encrypted at rest (AES-256)
- Refresh tokens stored separately from access tokens
- Database encrypted at rest
- TLS 1.3 for all connections
- No PII in logs

#### Authentication
- OAuth 2.0 for platform connections
- JWT for dealer authentication
- MFA option for enterprise accounts
- Session timeout after 24 hours

#### API Security
- Rate limiting per dealer
- API key rotation support
- Webhook signature verification
- Input sanitization on all endpoints

#### Compliance
- GDPR: Data deletion capability, export capability
- CCPA: Same as GDPR
- Review content is public data (no special privacy concerns)
- OAuth tokens are sensitive — treat accordingly

---

## Development Roadmap

**Andy Grove (PM):**

### Phase 1: MVP (Weeks 1-3)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Core Infrastructure | Database schema, basic API, dealer auth, Google OAuth flow |
| 2 | Review Sync + AI | Google review sync, Claude integration, response generation |
| 3 | Dashboard + Posting | React dashboard, approval workflow, Google response posting |

**MVP Definition of Done:**
- Dealer can connect Google Business Profile
- System syncs reviews every 15 minutes
- AI generates response for each new review
- Dealer can approve/edit/post from dashboard
- Auto-approve works for 4+ star reviews

### Phase 2: Facebook + Polish (Weeks 4-5)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 4 | Facebook Integration | Facebook OAuth, review sync, response posting |
| 5 | Notifications + UX | Email/SMS alerts, mobile-responsive dashboard, onboarding flow |

### Phase 3: Scale Features (Weeks 6-8)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 6 | DealerRater/Cars.com | API integration, unified inbox |
| 7 | Yelp + Analytics | Yelp R2R API, basic analytics dashboard |
| 8 | Multi-location + Billing | Stripe integration, multi-rooftop support |

### Phase 4: Growth Features (Months 3-6)

- Advanced analytics
- Competitor monitoring
- Review request campaigns
- White-label for agencies
- Custom AI voice training

---

## Risk Analysis

**Andy Grove (PM):**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Google API access revoked | Low | Critical | Follow TOS strictly, have manual fallback |
| AI generates inappropriate response | Medium | High | Human review of negative responses, content filters |
| Platform changes API | Medium | Medium | Abstract platform layer, monitor changelogs |
| Slow customer adoption | Medium | High | Free pilots, strong case studies, referral incentives |
| Competitor copies features | High | Medium | Speed to market, customer relationships, continuous improvement |
| AI costs higher than expected | Low | Medium | Response caching, prompt optimization, fallback to cheaper models |

### API Risk Details

**Google Business Profile API:**
- Risk: API access requires verification, could be delayed or denied
- Mitigation: Apply early, have clear use case, comply with all policies
- Policy: No fake reviews, no incentivized reviews, no review gating

**Facebook Graph API:**
- Risk: API is increasingly restricted
- Mitigation: Page admin must authorize, follow platform policies strictly

**DealerRater:**
- Risk: Requires Certified Dealer Program membership
- Mitigation: Only offer after dealer has membership, or help them sign up

---

## Financial Projections

### Year 1 Projections

| Quarter | Dealers | MRR | ARR Run Rate |
|---------|---------|-----|--------------|
| Q1 | 15 | $3,500 | $42,000 |
| Q2 | 45 | $10,500 | $126,000 |
| Q3 | 90 | $22,000 | $264,000 |
| Q4 | 150 | $38,000 | $456,000 |

### Assumptions
- Average revenue per dealer: $275/month (mix of plans)
- Monthly churn: 5% (after month 3)
- Growth: 50% MoM in early months, slowing to 25%

### Break-Even Analysis

| Metric | Value |
|--------|-------|
| Fixed Costs (monthly) | $500 (hosting, tools) |
| Variable Cost per Dealer | ~$5 (API costs) |
| Break-even | 2 paying dealers |

Profitability from day one of paid customers.

---

## Team Input Summary

### Andy Grove (Project Manager)
"This is the right first product. Simple to build, clear value prop, fast path to revenue. The key risk is execution speed — if we take 6 months to build, we lose momentum. Ship MVP in 3 weeks, iterate from there. The platform integrations are the moat — each one added makes switching harder."

### Rebecca Lindland (Market Research)
"The market data validates every assumption. 97% of consumers check reviews, dealers respond to fewer than 30%, and the competition is monitoring tools that still require human effort. The gap is execution. Automotive-specific platforms (DealerRater, Cars.com) should be Phase 2 priority — they influence serious buyers."

### Brian Pasch (Automotive Marketing)
"Lead with proof, not promises. The demo that works: pull up their Google reviews, show the unresponded ones, generate a live response. That's the 'holy shit' moment. Price at $299 — it's low enough for quick approval but high enough to be taken seriously. Dealers who pay $200/month question the quality."

### Jeff Bezos (Business Strategy)
"Recurring revenue is the game. Once a dealer connects platforms and sees responses flowing, switching cost is high. The real expansion play is upselling to lead follow-up (#2) and service-to-sales SMS (#21). Review response is the wedge that gets you in the door."

### Linus Torvalds (Architecture)
"Keep it boring. PostgreSQL, Node.js, React. No microservices, no Kubernetes, no GraphQL. One database, one service, one deployment. You can refactor later when you have revenue. Complexity is the enemy of shipping."

### Rob Pike (Backend)
"The core loop is simple: poll → diff → generate → post. Don't overthink it. The hard part is OAuth token management across platforms — build good abstractions there. Everything else is CRUD."

### Steve Jobs (UI/UX)
"The dashboard should feel like it's working for you, not like more work. When a dealer logs in, they should see green checkmarks — 'all reviews responded.' The only action needed is occasional approval of negative review responses. Make that flow frictionless."

### Bruce Schneier (Security)
"OAuth tokens are the crown jewels. Encrypt at rest, rotate when possible, log access. Review content is public so no PII concerns there, but API credentials are sensitive. Also: never auto-post a response that mentions compensation, discounts, or admits liability — content filtering is mandatory."

### Marty Cagan (Product)
"The job-to-be-done is simple: 'Handle my reviews without me thinking about it.' Every feature should be evaluated against that. If it requires dealer effort, question it. If it's 'nice to have analytics,' defer it. Ship the core value first."

### Dan Abramov (Frontend)
"React with TypeScript. Keep state management simple — React Query for server state, minimal local state. The dashboard needs to load fast and work on mobile. Service workers for offline viewing of the review inbox. Don't over-engineer the frontend."

### Martin Kleppmann (Data)
"Your data model is simple enough that PostgreSQL handles everything. The one thing to get right: idempotent sync. You'll poll the same reviews multiple times — make sure your upsert logic is solid. Use platform_review_id as the dedup key."

### James Bach (QA)
"Test the AI responses extensively before launch. Create a test suite of 100 diverse reviews — different ratings, tones, complaints, praises. Verify every response meets quality bar. One bad auto-posted response can kill a customer relationship."

### Kelsey Hightower (DevOps)
"Railway or Render for MVP — don't waste time on infrastructure. Single container, managed Postgres, managed Redis. Move to AWS/GCP when you hit scaling issues, not before. CI/CD from day one — every push to main deploys to staging."

### Luke Wroblewski (Mobile)
"60% of your dashboard traffic will be mobile. Design mobile-first. The approval flow must be thumb-friendly — swipe to approve, tap to edit. Notifications should deep-link to the specific review."

---

## Appendix A: API Reference Links

- [Google Business Profile API](https://developers.google.com/my-business/content/review-data)
- [Facebook Graph API](https://developers.facebook.com)
- [DealerRater API](https://developers.dealerrater.com/)
- [Yelp Respond to Reviews API](https://docs.developer.yelp.com/docs/respond-to-reviews-api-v2)
- [CarGurus Dealer API](https://www.cargurus.com/Cars/developers/docs/DealerReviews.html)

## Appendix B: Competitor Pricing Reference

- [Birdeye Pricing](https://birdeye.com/pricing/)
- [Podium](https://www.podium.com) — Quote-based, ~$350-600/mo
- [Reputation.com](https://reputation.com) — Enterprise, $500-1,500/mo

---

*Document version 1.0 — Ready for execution.*
