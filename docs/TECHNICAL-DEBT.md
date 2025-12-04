# Sentri — Technical Debt Register

**Last Updated:** December 4, 2025
**Owner:** Frank Slootman (COO)

---

## Active Debt

### TD-009: JWT Secret in Environment Variable Only
**Priority:** MEDIUM
**Created:** Sprint 1 MVP
**Component:** `server/src/config/env.ts`

**Description:**
No JWT key rotation capability. Single static secret.

**Risk:**
- If secret is leaked, all sessions compromised
- No way to invalidate all sessions without downtime

**Acceptance Criteria:**
- [ ] Support multiple JWT secrets (for rotation)
- [ ] Add session invalidation capability
- [ ] Document key rotation procedure

---

### TD-010: No Database Connection Pooling Configuration
**Priority:** MEDIUM
**Created:** Sprint 1 MVP
**Component:** `server/src/config/database.ts`

**Description:**
Using Prisma defaults for connection pooling. May not be optimal for production load.

**Risk:**
- Connection exhaustion under load
- Database performance issues

**Acceptance Criteria:**
- [ ] Configure connection pool size based on expected load
- [ ] Add connection pool monitoring
- [ ] Document tuning parameters

---

### TD-012: No Automated Tests
**Priority:** HIGH
**Created:** Sprint 1 MVP
**Component:** Entire codebase

**Description:**
Zero test coverage. No unit tests, no integration tests, no e2e tests.

**Risk:**
- Regressions go undetected
- Refactoring is risky
- No confidence in deployments

**Acceptance Criteria:**
- [ ] Add Jest for server unit tests
- [ ] Add Vitest for client unit tests
- [ ] Minimum 60% coverage on critical paths (auth, AI, responses)
- [ ] Add CI pipeline to run tests

---

### TD-013: No CI/CD Pipeline
**Priority:** HIGH
**Created:** Sprint 1 MVP
**Component:** Repository root
**Status:** PARTIAL — CI added, CD pending

**Description:**
No automated build, test, or deployment pipeline.

**Risk:**
- Manual deployments are error-prone
- No automated quality gates
- Slow iteration

**Acceptance Criteria:**
- [x] Add GitHub Actions workflow — `.github/workflows/ci.yml`
- [x] Run linting and type checks
- [ ] Run tests on PR — blocked on TD-012 (no tests yet)
- [ ] Deploy to staging on merge to main
- [ ] Add manual approval for production

---

### TD-014: Hardcoded Demo Credentials in Seed
**Priority:** LOW
**Created:** Sprint 1 MVP
**Component:** `server/prisma/seed.ts`

**Description:**
Demo credentials (demo@example.com / demo1234) are hardcoded and shown in login UI.

**Risk:**
- Acceptable for development
- Must not exist in production

**Acceptance Criteria:**
- [ ] Remove demo credentials from production seed
- [ ] Remove demo hint from login page in production
- [ ] Use environment variable to control demo mode

---

### TD-015: No Privacy Policy or Terms of Service
**Priority:** CRITICAL → BLOCKED
**Created:** Team Review v2
**Component:** Legal documentation
**Owner:** Max Schrems (Privacy/Legal)
**Status:** BLOCKED — drafts complete, waiting on company formation

**Description:**
No legal documentation exists. Privacy Policy and Terms of Service are legally required before collecting real user data.

**Risk:**
- GDPR/CCPA violations
- FTC enforcement action
- Inability to onboard real customers
- Potential lawsuits from data subjects

**Acceptance Criteria:**
- [x] Draft Privacy Policy (disclose AI processing, data retention, third-party transfers) — `docs/PRIVACY-POLICY.md`
- [x] Draft Terms of Service — `docs/TERMS-OF-SERVICE.md`
- [x] Create Legitimate Interest Assessment for review data processing — `docs/LEGITIMATE-INTEREST-ASSESSMENT.md`
- [x] Add CCPA "Do Not Sell" disclosure — included in Privacy Policy Section 8.2
- [x] Define data retention periods — included in Privacy Policy Section 6
- [ ] Document Data Subject Access Request (DSAR) procedure — deferred (handle manually until scale requires automation)
- [ ] Legal counsel review and approval
- [ ] Fill in placeholders ([INSERT...]) with actual company details
- [ ] Add to application UI (footer links, signup checkbox)

---

### TD-019: No Customer Feedback Mechanism
**Priority:** MEDIUM
**Created:** Team Review v2
**Component:** `client/src/components/reviews/ReviewCard.tsx`
**Owner:** Jeff Bezos (Business Strategy)

**Description:**
No way for dealers to rate AI response quality. No feedback loop for improving AI.

**Risk:**
- AI quality drift goes undetected
- No data for improvement
- Churn signals missed

**Acceptance Criteria:**
- [ ] Add "Was this response helpful?" prompt after approval
- [ ] Store feedback in database
- [ ] Track approval rate and edit rate as health signals
- [ ] Surface feedback for AI prompt tuning

---

### TD-020: Brand Assets Missing
**Priority:** MEDIUM
**Created:** Team Review v2
**Component:** Repository root, `client/public/`
**Owner:** Marty Neumeier (Brand Strategy)

**Description:**
No logo files, using default Vite favicon, no brand assets for marketing.

**Risk:**
- Unprofessional appearance
- Can't create marketing materials
- Brand inconsistency

**Acceptance Criteria:**
- [ ] Create wordmark logo (SVG, PNG)
- [ ] Create icon mark (for small sizes)
- [ ] Replace Vite favicon with Sentri icon
- [ ] Add social media profile images
- [ ] Create og-image for link previews

---

### TD-024: No Automation Visibility in UI
**Priority:** HIGH
**Created:** UI/UX Deep Dive Review
**Component:** Multiple client components
**Owner:** Marty Neumeier (Brand Strategy)

**Description:**
The UI doesn't show Sentri's automation in action. Dealers can't see when Sentri generates or auto-approves responses. This hides our core differentiator.

**Risk:**
- Brand value proposition not visible
- Dealers don't understand the automation benefit
- Feels like manual review management tool

**Acceptance Criteria:**
- [ ] Add "Sentri generated this response" indicator on response cards
- [ ] Show "Responses generated by Sentri this week" in dashboard stats
- [ ] Add shimmer/skeleton effect in response area during AI generation
- [ ] Future: "Sentri auto-approved" badge for auto-approved responses

---

### TD-026: Stats Cards Lack Context
**Priority:** MEDIUM
**Created:** UI/UX Deep Dive Review
**Component:** `client/src/pages/DashboardPage.tsx`
**Owner:** Steve Jobs (UI/UX)

**Description:**
Dashboard stat cards show numbers without context. Dealers can't tell if "8 reviews" is good or bad, or how it compares to previous periods.

**Risk:**
- Numbers without meaning
- No sense of progress or trends
- Missed engagement opportunity

**Acceptance Criteria:**
- [ ] Add trend indicators (↑ 2 from last week)
- [ ] Highlight "New Reviews" count with urgency styling if > 0
- [ ] Consider sparkline or mini-chart for trends (Phase 2)

---

### TD-027: No Getting Started Tutorial
**Priority:** HIGH
**Created:** Documentation Review (Diátaxis)
**Component:** `/docs/` directory
**Owner:** Daniele Procida (Documentation)

**Description:**
No tutorial exists for new developers. A new contributor cannot onboard without verbal guidance. There is no "Getting Started" guide, no "Deploy for the first time" walkthrough, no "Set up local development" tutorial.

**Risk:**
- Knowledge trapped in Dan's head
- Every new contributor requires verbal onboarding
- Slows team expansion
- Increases bus factor risk

**Acceptance Criteria:**
- [ ] Create `docs/tutorials/getting-started.md` (clone, install, run in 5 min)
- [ ] Create `docs/tutorials/local-development.md` (Docker, env vars, database)
- [ ] Create `docs/tutorials/first-deployment.md` (Railway walkthrough)

---

### TD-028: No How-To Guides
**Priority:** HIGH
**Created:** Documentation Review (Diátaxis)
**Component:** `/docs/` directory
**Owner:** Daniele Procida (Documentation)

**Description:**
No task-oriented documentation exists. Developers who need to add a platform, modify AI prompts, debug failed responses, or rotate secrets have no guides to follow.

**Risk:**
- Problem-solving requires reading source code
- Repeated questions to Dan
- Inconsistent approaches to common tasks

**Acceptance Criteria:**
- [ ] Create `docs/guides/add-new-platform.md`
- [ ] Create `docs/guides/customize-ai-prompts.md`
- [ ] Create `docs/guides/debug-failed-responses.md`
- [ ] Create `docs/guides/rotate-secrets.md`

---

### TD-029: ARCHITECTURE.md Mixes Content Types
**Priority:** MEDIUM
**Created:** Documentation Review (Diátaxis)
**Component:** `docs/ARCHITECTURE.md`
**Owner:** Daniele Procida (Documentation)

**Description:**
ARCHITECTURE.md is 436 lines mixing five content types: architectural decisions (Explanation), database schema (Reference), API endpoints (Reference), deployment instructions (How-to), and environment variables (Reference). This violates "one mode per document" principle.

**Risk:**
- Developers must scroll past irrelevant content
- Updates to one section may break others
- Document will become unmaintainable at scale

**Acceptance Criteria:**
- [ ] Extract architectural decisions to `docs/explanation/architecture-decisions.md`
- [ ] Extract database schema to `docs/reference/database-schema.md`
- [ ] Extract API endpoints to `docs/reference/api-endpoints.md`
- [ ] Extract environment variables to `docs/reference/environment-variables.md`
- [ ] Extract deployment to `docs/guides/deployment.md`

---

### TD-030: Environment Variables Undocumented
**Priority:** MEDIUM
**Created:** Documentation Review (Diátaxis)
**Component:** `/docs/` directory
**Owner:** Daniele Procida (Documentation)

**Description:**
ARCHITECTURE.md lists env vars but lacks: which are required vs optional, default values, valid formats, and how to obtain them (e.g., where to get GEMINI_API_KEY).

**Risk:**
- Setup failures for new developers
- Security issues from misconfiguration
- Support burden

**Acceptance Criteria:**
- [ ] Create `docs/reference/environment-variables.md`
- [ ] Document required vs optional for each variable
- [ ] Document default values where applicable
- [ ] Document valid formats and constraints
- [ ] Add links to obtain API keys (Google AI Studio, etc.)

---

### TD-031: API Documentation Incomplete
**Priority:** MEDIUM
**Created:** Documentation Review (Diátaxis)
**Component:** `docs/ARCHITECTURE.md` (API section)
**Owner:** Daniele Procida (Documentation)

**Description:**
API endpoints are listed as routes only. No request body examples, no response body examples, no error codes, no authentication requirements per endpoint.

**Risk:**
- Frontend/backend integration friction
- Incorrect API usage
- No contract documentation for future developers

**Acceptance Criteria:**
- [ ] Create `docs/reference/api-endpoints.md`
- [ ] Document each endpoint with request/response JSON examples
- [ ] Document authentication requirements
- [ ] Document error codes and meanings
- [ ] Document query parameters and path parameters

---

### TD-032: Meeting Notes in /docs Directory
**Priority:** LOW
**Created:** Documentation Review (Diátaxis)
**Component:** `/docs/` directory
**Owner:** Daniele Procida (Documentation)

**Description:**
Four files are meeting transcripts, not documentation: EDGE-CASES.md, MVP-REVIEW.md, UI-UX-REVIEW.md, AI-ARCHITECTURE-REVIEW.md. These pollute /docs and bury critical information in prose.

**Risk:**
- /docs appears cluttered
- New developers read meeting notes instead of actual docs
- Valuable decisions not extracted into proper documentation

**Acceptance Criteria:**
- [ ] Move meeting notes to `docs/archive/`
- [ ] Extract key decisions into ADRs (Architecture Decision Records)
- [ ] Create `docs/decisions/` for ADRs
- [ ] Update any links to moved files

---

### TD-033: No Default Development Environment
**Priority:** LOW
**Created:** December 2025
**Component:** `server/.env`, `server/src/config/env.ts`
**Owner:** Daniele Procida (Documentation)
**Status:** PARTIAL — `.env` with dev defaults added, proper solution pending

**Description:**
Server crashes on startup without `.env` file. New developers must manually create environment variables before they can run `npm run dev`. The `.env.example` exists but requires copy and modification.

**Risk:**
- Friction for new developers
- Confusion about required vs optional variables
- Inconsistent local development setups

**Temporary Fix Applied:**
- Created `server/.env` with default PostgreSQL connection string and development JWT secret
- Assumes local PostgreSQL with `postgres:postgres` credentials on default port
- Database name: `sentri_dev`

**Acceptance Criteria:**
- [x] Add `server/.env` to `.gitignore` (credentials should not be committed) — already present
- [ ] Update env.ts to provide sensible defaults for development mode
- [ ] Generate random JWT_SECRET in development if not provided
- [ ] Add Docker Compose for local PostgreSQL (removes external dependency)
- [ ] Document in Getting Started tutorial (blocked on TD-027)

---

## Resolved Debt

### TD-001: No Input Validation on AI Prompts
**Priority:** HIGH | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Sanitize review text before including in prompt
- [x] Implement content length limits (5000 chars)
- [x] Add blocklist for suspicious patterns
- [x] Log and alert on potential injection attempts

---

### TD-002: No Rate Limiting on API Endpoints
**Priority:** HIGH | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Add rate limiting middleware (express-rate-limit)
- [x] Auth endpoints: 10 req/15min per IP
- [x] AI endpoints: 20 req/hour per dealer
- [x] General API: 100 req/15min per dealer

---

### TD-004: No Request Logging or Audit Trail
**Priority:** HIGH | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Add structured JSON logging
- [x] Log all auth events (login, logout, failed attempts)
- [x] Log all response approvals with dealer ID, IP, timestamp
- [ ] Add correlation IDs for request tracing (future enhancement)

---

### TD-005: No Error Boundaries in React
**Priority:** MEDIUM | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Add root error boundary component
- [x] Show user-friendly error UI
- [ ] Implement error reporting (Sentry or similar) (future enhancement)
- [x] Add recovery/retry mechanism

---

### TD-006: No Loading States for Dashboard Stats
**Priority:** LOW | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Add skeleton loading state for stat cards
- [x] Smooth transition when data arrives

---

### TD-007: No Password Strength Validation
**Priority:** MEDIUM | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Require uppercase, lowercase, number
- [ ] Consider zxcvbn for strength scoring (future enhancement)
- [ ] Show strength indicator on frontend (future enhancement)

---

### TD-008: No CSRF Protection
**Priority:** HIGH | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] CORS hardening with explicit methods and headers
- [x] Using Authorization header (not cookies) mitigates CSRF
- [x] Added request body size limit (10kb)

---

### TD-011: No Health Check for Dependencies
**Priority:** MEDIUM | **Resolved:** December 2025 | **Commit:** 9822b56

- [x] Health check verifies database connectivity
- [ ] Health check verifies Redis connectivity (when added)
- [x] Returns 503 if dependencies are unhealthy

---

### TD-016: No Empty States in UI
**Priority:** HIGH | **Resolved:** December 2025

- [x] Add empty state to ReviewList with guidance and CTA
- [x] Include "Connect Google Account" button for new dealers
- [x] Add reassuring copy ("We'll check for new reviews every hour")
- [x] Personalize dashboard greeting with dealer name
- [x] Add sentiment color-coding to review cards (red for 1-2 stars, green for 4-5)

---

### TD-017: Mobile Touch Targets Too Small
**Priority:** MEDIUM | **Resolved:** December 2025

- [x] Increase sm/md button size to minimum 44px height
- [x] Added `min-h-[44px]` and increased padding to `py-2.5`
- [ ] Test on real mobile devices (manual verification needed)

---

### TD-021: Generic Microcopy Throughout UI
**Priority:** LOW | **Resolved:** December 2025

- [x] Change "AI Response" to "Draft Response"
- [x] Change "Generating..." to "Sentri is writing..."
- [x] Personalize dashboard header with dealer name
- [x] Add brand tagline to dashboard ("Your reputation, on guard.")

---

### TD-022: Dealer Name Overflow in Header
**Priority:** HIGH | **Resolved:** December 2025

- [x] Truncate dealer name with ellipsis after ~25 characters
- [x] Add title attribute for full name on hover
- [x] Changed "Logout" to "Sign out" for consistency

---

### TD-023: Empty State CTA Button Non-Functional
**Priority:** HIGH | **Resolved:** December 2025

- [x] Disabled button with reduced opacity
- [x] Added "Coming Soon" tooltip on hover
- [x] Button is visually disabled until Google OAuth is implemented

---

### TD-025: Demo Credentials Visible in Production UI
**Priority:** HIGH | **Resolved:** December 2025

- [x] Control demo hint visibility via `import.meta.env.DEV`
- [x] Demo credentials only visible in development mode
- [x] Production/demo builds will hide credentials automatically

---

### TD-003: OAuth Tokens Stored in Plaintext
**Priority:** CRITICAL | **Resolved:** December 2025

- [x] Implement AES-256-GCM encryption for tokens — `server/src/lib/crypto.ts`
- [x] Store encryption key in environment variable — `TOKEN_ENCRYPTION_KEY` in `env.ts`
- [x] Encrypt before save, decrypt on read — `server/src/modules/platforms/platforms.service.ts`
- [ ] Add key rotation capability — deferred to TD-009 (document procedure first)

---

### TD-018: No Onboarding Flow
**Priority:** HIGH | **Resolved:** December 2025

- [x] Add onboarding checklist component — `client/src/components/onboarding/OnboardingChecklist.tsx`
- [x] Track completion of: account created, Google connected, first review received, first response approved
- [x] Show progress indicator with visual progress bar
- [x] Add server-side onboarding status endpoint — `GET /auth/onboarding`
- [ ] Trigger re-engagement if onboarding incomplete after 24/72 hours (future enhancement)

---

## Debt Summary

| Priority | Active | Blocked | Resolved |
|----------|--------|---------|----------|
| CRITICAL | 0 | 1 | 1 |
| HIGH | 5 | 0 | 9 |
| MEDIUM | 8 | 0 | 4 |
| LOW | 3 | 0 | 2 |
| **Total** | **16** | **1** | **16** |

### Active Debt by Category

| Category | Items | Owners |
|----------|-------|--------|
| Security | TD-009 | Bruce Schneier |
| Infrastructure | TD-010, TD-012, TD-013 | Kelsey Hightower, James Bach |
| UX/UI | TD-020, TD-024, TD-026 | Marty N, Steve |
| Product | TD-019 | Jeff Bezos |
| Documentation | TD-027, TD-028, TD-029, TD-030, TD-031, TD-032, TD-033 | Daniele Procida |
| Cleanup | TD-014 | — |

### Blocked Debt

| Category | Items | Owners | Blocker |
|----------|-------|--------|---------|
| Legal/Compliance | TD-015 | Max Schrems | Company formation |

### Blocking Items

| ID | Description | Blocks |
|----|-------------|--------|
| TD-012 | No automated tests | CI test runs, confident refactoring |
| TD-027 | No Getting Started tutorial | **New developer onboarding** |

*Note: TD-015 (Legal docs) blocked on company formation, TD-003 (Token encryption) resolved.*

---

## Review Schedule

- **Before each sprint:** Review active debt, identify blockers
- **After shipping with shortcuts:** Update immediately
- **Weekly:** Review HIGH/CRITICAL items with team

---

## Changelog

| Date | Change |
|------|--------|
| Dec 2025 | Initial register with 14 items from MVP review |
| Dec 2025 | Resolved 8 items (TD-001, 002, 004, 005, 006, 007, 008, 011) |
| Dec 2025 | Added 7 items from Team Review v2 (TD-015 through TD-021) |
| Dec 2025 | Resolved 3 items (TD-016, 017, 021) — UX quick wins |
| Dec 2025 | Added 5 items from UI/UX Deep Dive (TD-022 through TD-026) |
| Dec 2025 | Resolved 3 items (TD-022, 023, 025) — Demo readiness fixes |
| Dec 2025 | Added 6 items from Documentation Review (TD-027 through TD-032) — Diátaxis analysis |
| Dec 2025 | Added TD-033 — No default dev environment (partial fix applied with `.env` defaults) |
| Dec 2025 | Resolved TD-003 — Token encryption complete (AES-256-GCM) |
| Dec 2025 | Blocked TD-015 — Legal docs drafted, waiting on company formation |
| Dec 2025 | Resolved TD-018 — Onboarding checklist with progress tracking |
