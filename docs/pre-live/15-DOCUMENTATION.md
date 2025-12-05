# Documentation Pre-Live Checklist

**Owner:** Daniele Procida
**Last Updated:** December 4, 2025

---

> "Documentation is a love letter to your future self."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| User Documentation | 5 | 0 | 5 |
| Developer Documentation | 6 | 3 | 3 |
| Operational Documentation | 4 | 1 | 3 |

---

## Diátaxis Framework

Documentation should be organized into four modes:

| Mode | Purpose | Audience | Status |
|------|---------|----------|--------|
| **Tutorials** | Learning-oriented | New users | [ ] Missing |
| **How-to Guides** | Task-oriented | Users with goals | [ ] Missing |
| **Reference** | Information-oriented | Users needing facts | [~] Partial |
| **Explanation** | Understanding-oriented | Users wanting context | [~] Partial |

---

## 1. User Documentation

### 1.1 End User (Dealers)

| # | Document | Status | Priority | Notes |
|---|----------|--------|----------|-------|
| 1.1.1 | Getting Started guide | [ ] | P0 | First-run experience |
| 1.1.2 | How to connect Google | [ ] | P0 | Blocked on OAuth |
| 1.1.3 | How to approve responses | [ ] | P1 | Simple flow |
| 1.1.4 | FAQ | [ ] | P1 | Common questions |
| 1.1.5 | Troubleshooting | [ ] | P1 | Common issues |

### 1.2 Getting Started Outline

```markdown
# Getting Started with Sentri

## Welcome
Quick overview of what Sentri does.

## Step 1: Log In
- Go to app.sentri.app
- Enter your email and password
- Click Sign In

## Step 2: Connect Your Google Business Profile
- Click "Connect Google"
- Select your business location
- Authorize Sentri

## Step 3: Review Your Dashboard
- See your reviews in one place
- Notice the color coding (red = needs attention)

## Step 4: Generate Your First Response
- Find a review
- Click "Generate Response"
- Watch Sentri write a response

## Step 5: Approve and Post
- Review the draft
- Edit if needed
- Click Approve

## You're All Set!
Sentri will now monitor for new reviews.
```

---

## 2. Developer Documentation

### 2.1 Existing Documentation

| Document | Status | Notes |
|----------|--------|-------|
| README.md | [x] | Setup instructions |
| ARCHITECTURE.md | [x] | Technical overview |
| BRAND-GUIDELINES.md | [x] | Visual identity |
| BUSINESS-PLAN.md | [x] | Strategy |
| EDGE-CASES.md | [x] | Known gaps |
| PLATFORMS.md | [x] | API details |

### 2.2 Missing Developer Docs

| # | Document | Status | Priority | Notes |
|---|----------|--------|----------|-------|
| 2.2.1 | Local development setup | [ ] | P0 | TD-027 |
| 2.2.2 | API reference | [ ] | P1 | TD-031 |
| 2.2.3 | Environment variables guide | [ ] | P1 | TD-030 |
| 2.2.4 | Deployment guide | [ ] | P0 | For Railway |
| 2.2.5 | Adding new platforms | [ ] | P2 | TD-028 |
| 2.2.6 | AI prompt customization | [ ] | P2 | TD-028 |

### 2.3 API Reference Format

```markdown
# API Reference

## Authentication

### POST /api/auth/login

Authenticate a dealer and receive a JWT token.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt-token",
  "dealer": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  }
}
```

**Errors:**
- 400: Validation error
- 401: Invalid credentials

---

### GET /api/reviews

Get all reviews for the authenticated dealer.

**Headers:**
- Authorization: Bearer {token}

**Query Parameters:**
- status: NEW | PENDING_RESPONSE | RESPONDED (optional)
- limit: number (default 20)
- offset: number (default 0)

**Response (200):**
```json
{
  "reviews": [...],
  "total": number
}
```
```

---

## 3. Operational Documentation

### 3.1 Runbooks

| # | Runbook | Status | Priority | Notes |
|---|---------|--------|----------|-------|
| 3.1.1 | Server not responding | [ ] | P0 | |
| 3.1.2 | Database connection failed | [ ] | P0 | |
| 3.1.3 | High error rate | [ ] | P0 | |
| 3.1.4 | Rollback procedure | [ ] | P0 | |

### 3.2 Runbook Template

```markdown
# Runbook: Server Not Responding

## Symptoms
- Health check returns 5xx or timeout
- Users report unable to access app

## Immediate Actions
1. Check Railway dashboard for service status
2. Check logs: `railway logs`
3. Verify database is accessible

## Investigation Steps
1. Check recent deployments
2. Look for error patterns in logs
3. Check external dependencies (Gemini API)

## Resolution
- If deployment issue: Rollback
- If database issue: Restart connection
- If external: Enable fallback mode

## Escalation
- If unresolved in 15 min: Contact [name]
- If data loss suspected: Contact [name]

## Post-Incident
- Document root cause
- Create ticket for prevention
- Update this runbook if needed
```

---

## 4. Documentation Structure

### 4.1 Proposed Structure

```
docs/
├── README.md                    # Documentation index
├── tutorials/
│   ├── getting-started.md       # First-run tutorial
│   ├── local-development.md     # Dev environment
│   └── first-deployment.md      # Railway deployment
├── guides/
│   ├── add-new-platform.md      # How to add platform
│   ├── customize-ai-prompts.md  # AI configuration
│   ├── debug-failed-responses.md
│   └── rotate-secrets.md
├── reference/
│   ├── api-endpoints.md         # Full API docs
│   ├── database-schema.md       # Prisma schema
│   └── environment-variables.md # All env vars
├── explanation/
│   ├── architecture-decisions.md
│   └── ai-design.md
├── runbooks/
│   ├── incident-response.md
│   └── common-issues.md
└── archive/
    ├── MVP-REVIEW.md            # Meeting notes
    └── EDGE-CASES.md
```

### 4.2 Current vs Proposed

| Current | Issues | Proposed |
|---------|--------|----------|
| Flat structure | Hard to find | Categorized folders |
| Mixed content types | Confusing | One mode per doc |
| Meeting notes in /docs | Clutter | Move to /archive |
| ARCHITECTURE.md 400+ lines | Too long | Split into reference docs |

---

## 5. README Improvements

### 5.1 Current README

- [x] Project description
- [x] Tech stack
- [x] Getting started
- [x] Demo credentials
- [ ] Contributing guide
- [ ] License clarity
- [ ] Links to detailed docs

### 5.2 README Additions Needed

```markdown
## Documentation

- [Getting Started](docs/tutorials/getting-started.md)
- [Local Development](docs/tutorials/local-development.md)
- [API Reference](docs/reference/api-endpoints.md)
- [Architecture](docs/explanation/architecture-decisions.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- Issues: [GitHub Issues](link)
- Email: support@sentri.app
```

---

## 6. Documentation Quality Checklist

For each document:

- [ ] Has clear purpose stated at top
- [ ] Follows single-mode principle (one type per doc)
- [ ] Uses consistent formatting
- [ ] Includes code examples where relevant
- [ ] Tested for accuracy
- [ ] Links to related documents
- [ ] Last updated date

---

## 7. Pre-Launch Documentation Priorities

| # | Task | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 7.1 | User getting started guide | [ ] | P0 | For pilot dealers |
| 7.2 | FAQ for common questions | [ ] | P0 | Reduce support |
| 7.3 | Developer local setup | [ ] | P0 | TD-027 |
| 7.4 | Deployment guide | [ ] | P0 | For Kelsey |
| 7.5 | API reference | [ ] | P1 | TD-031 |
| 7.6 | Environment variables | [ ] | P1 | TD-030 |
| 7.7 | Incident runbooks | [ ] | P1 | For operations |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| User docs ready | Daniele Procida | [ ] |
| Developer docs complete | Daniele Procida | [ ] |
| Runbooks written | Daniele Procida | [ ] |
| Structure organized | Daniele Procida | [ ] |

**Documentation Approval:** [ ] Approved / [ ] Rejected

**Blocking issues:**
- No user-facing documentation
- No deployment guide
- Missing API reference

---

*"The only thing worse than no documentation is wrong documentation."*
