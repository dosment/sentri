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

## Debt Summary

| Priority | Active | Resolved |
|----------|--------|----------|
| CRITICAL | 1 | 0 |
| HIGH | 2 | 4 |
| MEDIUM | 2 | 3 |
| LOW | 1 | 1 |
| **Total** | **6** | **8** |

---

## Review Schedule

- **Before each sprint:** Review active debt, identify blockers
- **After shipping with shortcuts:** Update immediately
- **Weekly:** Review HIGH/CRITICAL items with team
