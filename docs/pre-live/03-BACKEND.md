# Backend Pre-Live Checklist

**Owner:** Rob Pike
**Last Updated:** December 4, 2025

---

> "Simplicity is complicated. Clear, obvious code that does one thing well is harder than clever code that does many things poorly."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| API Endpoints | 10 | 10 | 0 |
| Error Handling | 8 | 7 | 1 |
| Database Operations | 6 | 5 | 1 |
| External Services | 5 | 3 | 2 |
| Performance | 5 | 2 | 3 |

---

## 1. API Endpoints

Verify each endpoint works correctly with valid and invalid inputs.

### Authentication Routes (`/api/auth/*`)

| Endpoint | Method | Status | Test Cases |
|----------|--------|--------|------------|
| `/auth/login` | POST | [x] | Valid creds, invalid creds, missing fields |
| `/auth/logout` | POST | [x] | With token, without token |
| `/auth/me` | GET | [x] | Valid token, expired token, malformed token |
| `/auth/onboarding` | GET | [x] | Returns onboarding status |

### Review Routes (`/api/reviews/*`)

| Endpoint | Method | Status | Test Cases |
|----------|--------|--------|------------|
| `/reviews` | GET | [x] | With reviews, empty, pagination |
| `/reviews/:id` | GET | [x] | Valid ID, invalid ID, other dealer's review |
| `/reviews/:id` | PATCH | [x] | Status update, invalid status |

### Response Routes (`/api/responses/*`)

| Endpoint | Method | Status | Test Cases |
|----------|--------|--------|------------|
| `/responses/:id` | PATCH | [x] | Edit text, empty text, too long |
| `/responses/:id/approve` | POST | [x] | Draft → Approved, already approved |
| `/responses/:id/regenerate` | POST | [x] | Success, Gemini failure |

### Verification Commands

```bash
# Test auth endpoints
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo1234"}'

# Test protected endpoint without token
curl http://localhost:3000/api/reviews
# Should return 401

# Test with token
curl http://localhost:3000/api/reviews \
  -H "Authorization: Bearer <token>"
```

---

## 2. Error Handling

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 2.1 | Global error handler catches all errors | [x] | P0 | In `index.ts` |
| 2.2 | Validation errors return 400 | [x] | P0 | Zod errors formatted |
| 2.3 | Auth errors return 401 | [x] | P0 | |
| 2.4 | Not found errors return 404 | [x] | P0 | |
| 2.5 | Server errors return 500 | [x] | P0 | Generic message |
| 2.6 | Error responses don't leak internals | [x] | P0 | Stack traces hidden |
| 2.7 | Async errors caught | [x] | P0 | express-async-errors or try/catch |
| 2.8 | Transaction failures handled | [ ] | P1 | Retry logic not implemented |

### Error Response Format

All errors should return:
```json
{
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

### Test Error Scenarios

```bash
# Test validation error
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'
# Should return 400 with validation message

# Test not found
curl http://localhost:3000/api/reviews/nonexistent-id \
  -H "Authorization: Bearer <token>"
# Should return 404

# Test unauthorized
curl http://localhost:3000/api/reviews
# Should return 401
```

---

## 3. Database Operations

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1 | Prisma client generates correctly | [x] | P0 | `npx prisma generate` |
| 3.2 | Migrations run without error | [x] | P0 | `npx prisma migrate deploy` |
| 3.3 | Seed data loads correctly | [x] | P0 | `npm run db:seed` |
| 3.4 | Transactions used for multi-write ops | [x] | P0 | Response creation |
| 3.5 | Cascade deletes work correctly | [x] | P0 | Dealer → Reviews → Responses |
| 3.6 | Connection pooling configured | [ ] | P1 | Using Prisma defaults |

### Database Verification

```bash
# Test database connection
npx prisma db push --dry-run

# Verify schema matches database
npx prisma migrate status

# Test seed data
npm run db:seed

# Check dealer exists
npx prisma studio  # Visual inspection
```

---

## 4. External Service Integrations

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | Gemini API connection | [x] | P0 | API key configured |
| 4.2 | Gemini error handling | [x] | P0 | Timeout, rate limit, empty response |
| 4.3 | Gemini retry logic | [ ] | P1 | Not implemented |
| 4.4 | Google OAuth flow | [BLOCKED] | P0 | Waiting on credentials |
| 4.5 | Token refresh logic | [BLOCKED] | P0 | Waiting on OAuth |

### Gemini API Tests

```bash
# Test Gemini connection (requires GEMINI_API_KEY)
# Generate a response for a test review

# Test with empty API key - should fail gracefully
GEMINI_API_KEY="" npm run dev
# Should log error but not crash

# Test with invalid API key
GEMINI_API_KEY="invalid" npm run dev
# Should return error to client, not crash
```

### Gemini Failure Modes to Handle

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| API timeout (>30s) | Return error, suggest retry | [x] |
| Rate limit (429) | Return error with retry-after | [x] |
| Empty response | Return error, log warning | [x] |
| Invalid response format | Return error, log warning | [x] |
| API key invalid | Return error, log error | [x] |

---

## 5. Performance

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | Response time < 500ms (p95) | [ ] | P1 | Need to measure |
| 5.2 | Database queries indexed | [x] | P0 | Indexes added |
| 5.3 | No N+1 queries | [ ] | P1 | Need to verify |
| 5.4 | Payload sizes reasonable | [x] | P0 | <100KB responses |
| 5.5 | Gemini calls don't block server | [ ] | P1 | Should be async |

### Performance Verification

```bash
# Install autocannon for load testing
npm install -g autocannon

# Test login endpoint
autocannon -c 10 -d 10 http://localhost:3000/api/auth/login \
  -m POST \
  -H "Content-Type: application/json" \
  -b '{"email":"demo@example.com","password":"demo1234"}'

# Test reviews endpoint (with auth)
autocannon -c 10 -d 10 http://localhost:3000/api/reviews \
  -H "Authorization: Bearer <token>"
```

---

## 6. Logging & Observability

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 6.1 | Structured JSON logging | [x] | P0 | Using pino or similar |
| 6.2 | Request IDs in logs | [ ] | P1 | For tracing |
| 6.3 | Auth events logged | [x] | P0 | Login, logout, failures |
| 6.4 | Response approvals logged | [x] | P0 | Audit trail |
| 6.5 | Error stack traces logged (not returned) | [x] | P0 | Server-side only |

### Log Verification

```bash
# Check log format
npm run dev 2>&1 | head -20
# Should be JSON format

# Verify auth logging
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"wrong"}'
# Should log failed login attempt
```

---

## 7. Health Checks

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 7.1 | `/health` endpoint exists | [x] | P0 | |
| 7.2 | Health check verifies DB | [x] | P0 | Returns 503 if DB down |
| 7.3 | Health check is fast (<100ms) | [x] | P0 | Simple query |
| 7.4 | Health check doesn't require auth | [x] | P0 | Public endpoint |

### Health Check Verification

```bash
# Should return 200 with DB connected
curl http://localhost:3000/health

# Response should be:
# {"status":"ok","database":"connected","timestamp":"..."}

# Stop PostgreSQL, should return 503
sudo systemctl stop postgresql
curl http://localhost:3000/health
# Should return 503
```

---

## 8. Environment Configuration

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 8.1 | All env vars documented | [x] | P0 | `.env.example` |
| 8.2 | Required vs optional clear | [ ] | P1 | |
| 8.3 | Defaults for development | [x] | P0 | `.env` file |
| 8.4 | No secrets in code | [x] | P0 | All in env vars |
| 8.5 | NODE_ENV used correctly | [x] | P0 | production/development |

### Required Environment Variables

```env
# Required for all environments
DATABASE_URL=postgresql://...
JWT_SECRET=<32+ random chars>
ENCRYPTION_KEY=<32 random chars>

# Required for AI features
GEMINI_API_KEY=<api key>

# Required for Google OAuth (when implemented)
GOOGLE_CLIENT_ID=<client id>
GOOGLE_CLIENT_SECRET=<secret>
GOOGLE_REDIRECT_URI=https://...

# Optional
PORT=3000  # defaults to 3000
NODE_ENV=production  # or development
```

---

## 9. Code Quality

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 9.1 | TypeScript compiles without errors | [x] | P0 | `npm run build` |
| 9.2 | No ESLint errors | [x] | P0 | `npm run lint` |
| 9.3 | No unused dependencies | [ ] | P2 | |
| 9.4 | Code structure follows patterns | [x] | P0 | routes/modules/middleware |

### Build Verification

```bash
cd server

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build

# Verify dist folder created
ls -la dist/
```

---

## Pre-Deployment Checklist

Execute before every deployment:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] All required env vars set in production
- [ ] Database migrations applied
- [ ] Health check returns 200
- [ ] Sample API calls work correctly

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| All endpoints tested | Rob Pike | [ ] |
| Error handling verified | Rob Pike | [ ] |
| Database operations work | Rob Pike | [ ] |
| Logging configured | Rob Pike | [ ] |
| Performance acceptable | Rob Pike | [ ] |

**Backend Approval:** [ ] Approved / [ ] Rejected

---

*"If you have a function with 10 parameters, you probably missed some."*
