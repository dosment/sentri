# Sentri — Technical Debt Register

**Last Updated:** December 2024
**Owner:** Andy Grove (Project Manager)

---

## Active Debt

### TD-003: OAuth Tokens Stored in Plaintext
**Priority:** CRITICAL
**Created:** Sprint 1 MVP
**Component:** `server/prisma/schema.prisma` (PlatformConnection model)
**Status:** BLOCKED — waiting for Google OAuth implementation

**Description:**
The schema defines `accessToken` and `refreshToken` fields but they are not encrypted. When Google OAuth is implemented, tokens will be stored in plaintext.

**Risk:**
- Database breach exposes all dealer Google accounts
- Attackers could post responses as dealers
- Regulatory and legal liability

**Acceptance Criteria:**
- [ ] Implement AES-256-GCM encryption for tokens
- [ ] Store encryption key in environment variable
- [ ] Encrypt before save, decrypt on read
- [ ] Add key rotation capability

---

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

**Description:**
No automated build, test, or deployment pipeline.

**Risk:**
- Manual deployments are error-prone
- No automated quality gates
- Slow iteration

**Acceptance Criteria:**
- [ ] Add GitHub Actions workflow
- [ ] Run linting and type checks
- [ ] Run tests on PR
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
**Priority:** CRITICAL
**Created:** Team Review v2
**Component:** Legal documentation (missing)
**Owner:** Max Schrems (Privacy/Legal)
**Status:** BLOCKING — required before pilot with real users

**Description:**
No legal documentation exists. Privacy Policy and Terms of Service are legally required before collecting real user data.

**Risk:**
- GDPR/CCPA violations
- FTC enforcement action
- Inability to onboard real customers
- Potential lawsuits from data subjects

**Acceptance Criteria:**
- [ ] Draft Privacy Policy (disclose AI processing, data retention, third-party transfers)
- [ ] Draft Terms of Service
- [ ] Create Legitimate Interest Assessment for review data processing
- [ ] Add CCPA "Do Not Sell" disclosure
- [ ] Define data retention periods
- [ ] Document Data Subject Access Request (DSAR) procedure

---

### TD-018: No Onboarding Flow
**Priority:** HIGH
**Created:** Team Review v2
**Component:** `client/src/pages/DashboardPage.tsx`
**Owner:** Nick Mehta (Customer Success)

**Description:**
No guided onboarding after signup. Dealers must figure out next steps on their own.

**Risk:**
- Low activation rates
- Dealers abandon before connecting Google
- No measurement of onboarding completion

**Acceptance Criteria:**
- [ ] Add onboarding checklist component
- [ ] Track completion of: account created, Google connected, first review viewed, first response approved
- [ ] Show progress indicator
- [ ] Trigger re-engagement if onboarding incomplete after 24/72 hours

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

## Resolved Debt

### TD-001: No Input Validation on AI Prompts
**Priority:** HIGH | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Sanitize review text before including in prompt
- [x] Implement content length limits (5000 chars)
- [x] Add blocklist for suspicious patterns
- [x] Log and alert on potential injection attempts

---

### TD-002: No Rate Limiting on API Endpoints
**Priority:** HIGH | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Add rate limiting middleware (express-rate-limit)
- [x] Auth endpoints: 10 req/15min per IP
- [x] AI endpoints: 20 req/hour per dealer
- [x] General API: 100 req/15min per dealer

---

### TD-004: No Request Logging or Audit Trail
**Priority:** HIGH | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Add structured JSON logging
- [x] Log all auth events (login, logout, failed attempts)
- [x] Log all response approvals with dealer ID, IP, timestamp
- [ ] Add correlation IDs for request tracing (future enhancement)

---

### TD-005: No Error Boundaries in React
**Priority:** MEDIUM | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Add root error boundary component
- [x] Show user-friendly error UI
- [ ] Implement error reporting (Sentry or similar) (future enhancement)
- [x] Add recovery/retry mechanism

---

### TD-006: No Loading States for Dashboard Stats
**Priority:** LOW | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Add skeleton loading state for stat cards
- [x] Smooth transition when data arrives

---

### TD-007: No Password Strength Validation
**Priority:** MEDIUM | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Require uppercase, lowercase, number
- [ ] Consider zxcvbn for strength scoring (future enhancement)
- [ ] Show strength indicator on frontend (future enhancement)

---

### TD-008: No CSRF Protection
**Priority:** HIGH | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] CORS hardening with explicit methods and headers
- [x] Using Authorization header (not cookies) mitigates CSRF
- [x] Added request body size limit (10kb)

---

### TD-011: No Health Check for Dependencies
**Priority:** MEDIUM | **Resolved:** December 2024 | **Commit:** 9822b56

- [x] Health check verifies database connectivity
- [ ] Health check verifies Redis connectivity (when added)
- [x] Returns 503 if dependencies are unhealthy

---

### TD-016: No Empty States in UI
**Priority:** HIGH | **Resolved:** December 2024

- [x] Add empty state to ReviewList with guidance and CTA
- [x] Include "Connect Google Account" button for new dealers
- [x] Add reassuring copy ("We'll check for new reviews every hour")
- [x] Personalize dashboard greeting with dealer name
- [x] Add sentiment color-coding to review cards (red for 1-2 stars, green for 4-5)

---

### TD-017: Mobile Touch Targets Too Small
**Priority:** MEDIUM | **Resolved:** December 2024

- [x] Increase sm/md button size to minimum 44px height
- [x] Added `min-h-[44px]` and increased padding to `py-2.5`
- [ ] Test on real mobile devices (manual verification needed)

---

### TD-021: Generic Microcopy Throughout UI
**Priority:** LOW | **Resolved:** December 2024

- [x] Change "AI Response" to "Draft Response"
- [x] Change "Generating..." to "Sentri is writing..."
- [x] Personalize dashboard header with dealer name
- [x] Add brand tagline to dashboard ("Your reputation, on guard.")

---

### TD-022: Dealer Name Overflow in Header
**Priority:** HIGH | **Resolved:** December 2024

- [x] Truncate dealer name with ellipsis after ~25 characters
- [x] Add title attribute for full name on hover
- [x] Changed "Logout" to "Sign out" for consistency

---

### TD-023: Empty State CTA Button Non-Functional
**Priority:** HIGH | **Resolved:** December 2024

- [x] Disabled button with reduced opacity
- [x] Added "Coming Soon" tooltip on hover
- [x] Button is visually disabled until Google OAuth is implemented

---

### TD-025: Demo Credentials Visible in Production UI
**Priority:** HIGH | **Resolved:** December 2024

- [x] Control demo hint visibility via `import.meta.env.DEV`
- [x] Demo credentials only visible in development mode
- [x] Production/demo builds will hide credentials automatically

---

## Debt Summary

| Priority | Active | Resolved |
|----------|--------|----------|
| CRITICAL | 2 | 0 |
| HIGH | 4 | 8 |
| MEDIUM | 5 | 4 |
| LOW | 1 | 2 |
| **Total** | **12** | **14** |

### Active Debt by Category

| Category | Items | Owners |
|----------|-------|--------|
| Legal/Compliance | TD-015 | Max Schrems |
| Security | TD-003, TD-009 | Bruce Schneier |
| Infrastructure | TD-010, TD-012, TD-013 | Kelsey Hightower, James Bach |
| UX/UI | TD-018, TD-020, TD-024, TD-026 | Nick, Marty N, Steve |
| Product | TD-019 | Jeff Bezos |
| Cleanup | TD-014 | — |

### Blocking Items

| ID | Description | Blocks |
|----|-------------|--------|
| TD-015 | Privacy Policy / ToS | **Pilot with real users** |
| TD-003 | Token encryption | Google OAuth implementation |

---

## Review Schedule

- **Before each sprint:** Review active debt, identify blockers
- **After shipping with shortcuts:** Update immediately
- **Weekly:** Review HIGH/CRITICAL items with team

---

## Changelog

| Date | Change |
|------|--------|
| Dec 2024 | Initial register with 14 items from MVP review |
| Dec 2024 | Resolved 8 items (TD-001, 002, 004, 005, 006, 007, 008, 011) |
| Dec 2024 | Added 7 items from Team Review v2 (TD-015 through TD-021) |
| Dec 2024 | Resolved 3 items (TD-016, 017, 021) — UX quick wins |
| Dec 2024 | Added 5 items from UI/UX Deep Dive (TD-022 through TD-026) |
| Dec 2024 | Resolved 3 items (TD-022, 023, 025) — Demo readiness fixes |
