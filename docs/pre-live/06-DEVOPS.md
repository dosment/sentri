# DevOps Pre-Live Checklist

**Owner:** Kelsey Hightower
**Last Updated:** December 4, 2025

---

> "The best deployment is the one nobody notices happened."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| CI/CD | 6 | 2 | 4 |
| Infrastructure | 8 | 0 | 8 |
| Monitoring | 6 | 1 | 5 |
| Security | 5 | 2 | 3 |
| Documentation | 4 | 0 | 4 |

---

## 1. CI/CD Pipeline

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1.1 | GitHub Actions workflow exists | [x] | P0 | `.github/workflows/ci.yml` |
| 1.2 | Lint check runs on PR | [x] | P0 | ESLint |
| 1.3 | Type check runs on PR | [x] | P0 | TypeScript |
| 1.4 | Tests run on PR | [ ] | P0 | Blocked - no tests |
| 1.5 | Build succeeds | [ ] | P0 | Server + client |
| 1.6 | Auto-deploy on merge to main | [ ] | P1 | Not configured |

### CI Workflow Verification

```yaml
# .github/workflows/ci.yml should include:
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
```

---

## 2. Infrastructure (Railway)

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 2.1 | Railway project created | [ ] | P0 | |
| 2.2 | PostgreSQL database provisioned | [ ] | P0 | |
| 2.3 | Web service configured (server) | [ ] | P0 | |
| 2.4 | Environment variables set | [ ] | P0 | See list below |
| 2.5 | Health check configured | [ ] | P0 | `/health` endpoint |
| 2.6 | Custom domain configured | [ ] | P0 | sentri.app |
| 2.7 | SSL certificate active | [ ] | P0 | Auto via Railway |
| 2.8 | Redis provisioned | [N/A] | P2 | Not needed for MVP |

### Railway Setup Steps

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Provision PostgreSQL
railway add -p postgresql

# 5. Get connection string
railway variables

# 6. Deploy
railway up
```

### Required Environment Variables

| Variable | Required | Secret | Notes |
|----------|----------|--------|-------|
| `DATABASE_URL` | Yes | Yes | Auto-set by Railway |
| `JWT_SECRET` | Yes | Yes | 32+ random chars |
| `ENCRYPTION_KEY` | Yes | Yes | 32 random chars |
| `TOKEN_ENCRYPTION_KEY` | Yes | Yes | 32 random chars |
| `GEMINI_API_KEY` | Yes | Yes | From Google AI Studio |
| `NODE_ENV` | Yes | No | `production` |
| `PORT` | No | No | Railway sets automatically |
| `GOOGLE_CLIENT_ID` | Yes* | No | *When OAuth ready |
| `GOOGLE_CLIENT_SECRET` | Yes* | Yes | *When OAuth ready |
| `GOOGLE_REDIRECT_URI` | Yes* | No | *When OAuth ready |

### Environment Variable Generation

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -hex 16

# Generate TOKEN_ENCRYPTION_KEY
openssl rand -hex 16
```

---

## 3. Deployment Configuration

### Dockerfile Verification

```dockerfile
# server/Dockerfile should exist with:
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Railway Configuration

```toml
# railway.toml (optional)
[build]
builder = "dockerfile"
dockerfilePath = "server/Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
```

---

## 4. Monitoring & Alerting

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | Application logs accessible | [x] | P0 | Railway dashboard |
| 4.2 | Error alerting configured | [ ] | P0 | Slack/email on 5xx |
| 4.3 | Uptime monitoring | [ ] | P0 | BetterUptime, Pingdom, etc. |
| 4.4 | Health check monitoring | [ ] | P0 | Alert on failures |
| 4.5 | Performance metrics | [ ] | P1 | Response times |
| 4.6 | Resource usage tracking | [ ] | P1 | CPU, memory |

### Recommended Monitoring Stack

```
Uptime: BetterUptime or UptimeRobot (free tier)
Errors: Sentry (free tier)
Logs: Railway built-in + optional Papertrail
Metrics: Railway built-in
```

### Alert Configuration

| Alert | Threshold | Channel | Priority |
|-------|-----------|---------|----------|
| 5xx error rate | > 1% | Slack | P0 |
| Health check fail | 2 consecutive | Slack + SMS | P0 |
| Response time | > 2s p95 | Slack | P1 |
| CPU usage | > 80% 5min | Slack | P2 |
| Memory usage | > 85% | Slack | P2 |

---

## 5. Security

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | HTTPS enforced | [ ] | P0 | Railway auto-SSL |
| 5.2 | Secrets not in logs | [x] | P0 | Verified |
| 5.3 | No debug mode in prod | [x] | P0 | `NODE_ENV=production` |
| 5.4 | Firewall rules | [ ] | P1 | Database not public |
| 5.5 | Dependency audit | [ ] | P1 | `npm audit` |

### Security Verification

```bash
# Run dependency audit before deploy
npm audit --production

# Check for high/critical vulnerabilities
npm audit --audit-level=high

# Verify no secrets in code
git grep -i "password\|secret\|key" -- "*.ts" | grep -v ".env"
```

---

## 6. Incident Response

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 6.1 | Runbook for common issues | [ ] | P0 | |
| 6.2 | Rollback procedure documented | [ ] | P0 | |
| 6.3 | On-call schedule | [ ] | P1 | Who responds at 2 AM |
| 6.4 | Incident communication plan | [ ] | P1 | Status page, email |

### Runbook: Common Issues

```markdown
## Server Not Responding

1. Check Railway dashboard for service status
2. Check logs for errors: `railway logs`
3. Verify database is accessible
4. Check health endpoint: `curl https://api.sentri.app/health`
5. If unresponsive, redeploy: `railway redeploy`

## Database Connection Errors

1. Check Railway PostgreSQL service status
2. Verify DATABASE_URL is correct
3. Check connection limits not exceeded
4. Restart service if needed

## High Error Rate

1. Check logs for error patterns
2. Identify affected endpoints
3. Check recent deployments
4. Rollback if needed: railway rollback

## Performance Degradation

1. Check CPU/memory usage
2. Check database query performance
3. Check external service status (Gemini)
4. Scale up if needed
```

### Rollback Procedure

```bash
# Railway keeps deployment history
# To rollback:

1. Go to Railway dashboard
2. Select service
3. Go to Deployments tab
4. Click on previous deployment
5. Click "Redeploy"

# Or via CLI:
railway rollback
```

---

## 7. Documentation

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 7.1 | Deployment guide | [ ] | P0 | Step-by-step |
| 7.2 | Environment setup guide | [ ] | P0 | All env vars |
| 7.3 | Runbook | [ ] | P0 | Common issues |
| 7.4 | Architecture diagram | [ ] | P1 | Infrastructure layout |

---

## 8. Pre-Production Deployment Checklist

Execute before deploying to production:

### Code Readiness
- [ ] All CI checks pass
- [ ] No high/critical npm vulnerabilities
- [ ] Latest changes merged to main

### Infrastructure
- [ ] Railway project configured
- [ ] PostgreSQL provisioned
- [ ] All environment variables set
- [ ] Health check endpoint configured

### Domain
- [ ] Custom domain added in Railway
- [ ] DNS records configured
- [ ] SSL certificate active (auto)

### Verification
- [ ] Deploy to Railway
- [ ] Health check returns 200
- [ ] Login works with test account
- [ ] Dashboard loads reviews
- [ ] Generate response works
- [ ] Approve response works

### Monitoring
- [ ] Uptime monitoring active
- [ ] Error alerting configured
- [ ] Logs accessible

---

## 9. Production Deployment Steps

```bash
# Step 1: Final code check
git checkout main
git pull
npm run lint
npm run build

# Step 2: Deploy
railway up --service server

# Step 3: Run migrations
railway run npx prisma migrate deploy

# Step 4: Verify
curl https://api.sentri.app/health
# Should return {"status":"ok",...}

# Step 5: Smoke test
# Login, view dashboard, generate response

# Step 6: Enable monitoring
# Configure uptime checks and alerts
```

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| CI pipeline working | Kelsey Hightower | [ ] |
| Infrastructure provisioned | Kelsey Hightower | [ ] |
| Monitoring configured | Kelsey Hightower | [ ] |
| Security verified | Kelsey Hightower | [ ] |
| Runbooks documented | Kelsey Hightower | [ ] |

**DevOps Approval:** [ ] Approved / [ ] Rejected

---

*"The goal is not to be on call. The goal is to build systems that don't need you."*
