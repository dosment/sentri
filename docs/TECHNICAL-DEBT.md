# Sentri — Technical Debt Register

**Last Updated:** December 2024
**Owner:** Andy Grove (Project Manager)

---

## Active Debt

### TD-001: No Input Validation on AI Prompts
**Priority:** HIGH
**Created:** Sprint 1 MVP
**Component:** `server/src/modules/ai/ai.service.ts`

**Description:**
Review text is passed directly into the Gemini prompt without sanitization. Malicious review content could potentially inject prompt instructions.

**Risk:**
- Prompt injection attacks could manipulate AI responses
- Could generate inappropriate or off-brand responses
- Reputation damage if exploited

**Acceptance Criteria:**
- [ ] Sanitize review text before including in prompt
- [ ] Implement content length limits
- [ ] Add blocklist for suspicious patterns
- [ ] Log and alert on potential injection attempts

---

### TD-002: No Rate Limiting on API Endpoints
**Priority:** HIGH
**Created:** Sprint 1 MVP
**Component:** `server/src/index.ts`, all routes

**Description:**
API endpoints have no rate limiting. Vulnerable to abuse, brute force attacks on auth, and AI API cost explosion.

**Risk:**
- Auth brute force attacks
- Denial of service
- Runaway Gemini API costs from /api/ai/generate abuse

**Acceptance Criteria:**
- [ ] Add rate limiting middleware (express-rate-limit)
- [ ] Auth endpoints: 10 req/15min per IP
- [ ] AI endpoints: 20 req/hour per dealer
- [ ] General API: 100 req/15min per dealer

---

### TD-003: OAuth Tokens Stored in Plaintext
**Priority:** CRITICAL
**Created:** Sprint 1 MVP
**Component:** `server/prisma/schema.prisma` (PlatformConnection model)

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

### TD-004: No Request Logging or Audit Trail
**Priority:** HIGH
**Created:** Sprint 1 MVP
**Component:** `server/src/index.ts`

**Description:**
No structured logging. No audit trail for who approved what response, when, or from where.

**Risk:**
- Cannot debug production issues
- Cannot detect unauthorized access
- No compliance audit trail
- No incident response capability

**Acceptance Criteria:**
- [ ] Add structured JSON logging (pino or winston)
- [ ] Log all auth events (login, logout, failed attempts)
- [ ] Log all response approvals with dealer ID, IP, timestamp
- [ ] Add correlation IDs for request tracing

---

### TD-005: No Error Boundaries in React
**Priority:** MEDIUM
**Created:** Sprint 1 MVP
**Component:** `client/src/App.tsx`

**Description:**
No React error boundaries. A component crash takes down the entire app with a white screen.

**Risk:**
- Poor user experience on errors
- No error reporting
- Users lose work on crash

**Acceptance Criteria:**
- [ ] Add root error boundary component
- [ ] Show user-friendly error UI
- [ ] Implement error reporting (Sentry or similar)
- [ ] Add recovery/retry mechanism

---

### TD-006: No Loading States for Dashboard Stats
**Priority:** LOW
**Created:** Sprint 1 MVP
**Component:** `client/src/pages/DashboardPage.tsx`

**Description:**
Stats cards show nothing while loading, then pop in. No skeleton or loading indicator.

**Risk:**
- Minor UX issue
- Layout shift when data loads

**Acceptance Criteria:**
- [ ] Add skeleton loading state for stat cards
- [ ] Smooth transition when data arrives

---

### TD-007: No Password Strength Validation
**Priority:** MEDIUM
**Created:** Sprint 1 MVP
**Component:** `server/src/routes/auth.routes.ts`

**Description:**
Password validation only checks minimum 8 characters. No complexity requirements.

**Risk:**
- Weak passwords accepted
- Easier brute force attacks

**Acceptance Criteria:**
- [ ] Require uppercase, lowercase, number
- [ ] Consider zxcvbn for strength scoring
- [ ] Show strength indicator on frontend

---

### TD-008: No CSRF Protection
**Priority:** HIGH
**Created:** Sprint 1 MVP
**Component:** `server/src/index.ts`

**Description:**
No CSRF tokens. State-changing requests vulnerable to cross-site request forgery.

**Risk:**
- Attacker could approve responses on behalf of logged-in dealer
- Could modify account settings

**Acceptance Criteria:**
- [ ] Implement CSRF tokens for state-changing requests
- [ ] Or switch to SameSite=Strict cookies with proper CORS

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

### TD-011: No Health Check for Dependencies
**Priority:** MEDIUM
**Created:** Sprint 1 MVP
**Component:** `server/src/index.ts`

**Description:**
Health check endpoint returns 200 without checking database or Redis connectivity.

**Risk:**
- Load balancer thinks service is healthy when database is down
- Cascading failures

**Acceptance Criteria:**
- [ ] Health check should verify database connectivity
- [ ] Health check should verify Redis connectivity (when added)
- [ ] Return 503 if dependencies are unhealthy

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

## Resolved Debt

*No resolved items yet.*

---

## Debt Summary

| Priority | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 6 |
| MEDIUM | 5 |
| LOW | 2 |
| **Total** | **14** |

---

## Review Schedule

- **Before each sprint:** Review active debt, identify blockers
- **After shipping with shortcuts:** Update immediately
- **Weekly:** Review HIGH/CRITICAL items with team
