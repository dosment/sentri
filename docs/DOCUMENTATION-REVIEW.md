# Sentri Documentation — Diátaxis Review

**Date:** December 2025
**Reviewer:** Daniele Procida (Documentation Architect)
**Framework:** Diátaxis (Tutorials, How-to Guides, Reference, Explanation)

---

## Opening Statement

> "I am Procida. I've analyzed your `/docs` folder — it is currently a flat list of files. This is not scalable. Let me tell you exactly what's wrong and how to fix it."

---

## Current Documentation Inventory

```
/sentri
├── README.md                    (77 lines)
├── claude.md                    (45 lines)
└── docs/
    ├── AI-ARCHITECTURE-REVIEW.md    (378 lines)
    ├── ARCHITECTURE.md              (436 lines)
    ├── BRAND-ASSETS-SPEC.md         (396 lines)
    ├── BRAND-GUIDELINES.md          (386 lines)
    ├── BUSINESS-PLAN.md             (266 lines)
    ├── EDGE-CASES.md                (484 lines)
    ├── MVP-REVIEW.md                (815 lines)
    ├── PLATFORMS.md                 (107 lines)
    ├── TECHNICAL-DEBT.md            (486 lines)
    └── UI-UX-REVIEW.md              (331 lines)
```

**Total:** 11 documentation files, ~3,707 lines

---

## Diátaxis Quadrant Analysis

### The Four Quadrants

| Quadrant          | Purpose                  | Question Answered        |
|-------------------|--------------------------|--------------------------|
| **Tutorials**     | Learning-oriented        | "How do I get started?"  |
| **How-to Guides** | Problem-oriented         | "How do I solve X?"      |
| **Reference**     | Information-oriented     | "What are the details?"  |
| **Explanation**   | Understanding-oriented   | "Why is it this way?"    |

### Current File Classification

| File                        | Primary Quadrant         | Secondary  | Issues                                                                  |
|-----------------------------|--------------------------|------------|-------------------------------------------------------------------------|
| `README.md`                 | Reference                | —          | Too long, mixes overview with setup                                     |
| `ARCHITECTURE.md`           | Reference + Explanation  | —          | **Mixed modes** — combines schema reference with architectural decisions |
| `BUSINESS-PLAN.md`          | Explanation              | —          | Correct placement, but not technical docs                               |
| `BRAND-GUIDELINES.md`       | Reference + Explanation  | —          | **Mixed modes** — combines brand rules with rationale                   |
| `BRAND-ASSETS-SPEC.md`      | Reference                | —          | Correct, pure technical spec                                            |
| `PLATFORMS.md`              | Reference                | —          | Correct, but incomplete (no request/response examples)                  |
| `EDGE-CASES.md`             | Explanation              | —          | Meeting notes, not documentation                                        |
| `MVP-REVIEW.md`             | Explanation              | —          | Meeting notes, not documentation                                        |
| `UI-UX-REVIEW.md`           | Explanation              | —          | Meeting notes, not documentation                                        |
| `AI-ARCHITECTURE-REVIEW.md` | Explanation              | —          | Review notes, not documentation                                         |
| `TECHNICAL-DEBT.md`         | Reference                | —          | Correct, issue tracking format                                          |

### What's Missing

| Quadrant          | Status            | Critical Gap?                          |
|-------------------|-------------------|----------------------------------------|
| **Tutorials**     | MISSING           | YES — No "Getting Started" guide       |
| **How-to Guides** | MISSING           | YES — No problem-solving guides        |
| **Reference**     | Partial           | API docs incomplete, no env var reference |
| **Explanation**   | Over-represented  | Too many meeting notes masquerading as docs |

---

## Critical Issues

### Issue 1: No Tutorials (CRITICAL)

**Problem:** A new developer cannot onboard. There is no:
- "Getting Started" guide
- "Deploy for the first time" walkthrough
- "Set up local development" tutorial

**Impact:** Every new contributor requires verbal onboarding. Knowledge is trapped in Dan's head.

**Fix:**
```
/docs/tutorials/
├── getting-started.md           # Clone, install, run in 5 minutes
├── local-development-setup.md   # Docker, env vars, database
└── first-deployment.md          # Railway deployment walkthrough
```

---

### Issue 2: No How-to Guides (CRITICAL)

**Problem:** No task-oriented documentation exists. A developer who needs to:
- Add a new review platform
- Modify the AI prompt
- Debug a failed response
- Rotate JWT secrets

...has no guide to follow.

**Impact:** Problem-solving requires reading source code or asking Dan.

**Fix:**
```
/docs/guides/
├── add-new-platform.md          # Step-by-step platform integration
├── customize-ai-prompts.md      # Modify response generation
├── debug-failed-responses.md    # Troubleshooting workflow
├── rotate-jwt-secrets.md        # Secret rotation procedure
└── run-database-migrations.md   # Prisma migration process
```

---

### Issue 3: Mixed Modes in Core Docs (HIGH)

**Problem:** `ARCHITECTURE.md` is 436 lines that mix:
- Architectural decisions (Explanation) — "Why monolith?"
- Database schema (Reference) — Prisma model definitions
- API endpoints (Reference) — Route definitions
- Deployment instructions (How-to) — Dockerfile, Railway setup
- Environment variables (Reference) — Config list

**This is a kitchen sink document.** A developer looking for the database schema must scroll past architecture philosophy. A deployer must hunt for the Dockerfile section.

**Fix:** Split into focused documents:

| Current Section          | New Location                                      |
|--------------------------|---------------------------------------------------|
| Architecture Principles  | `/docs/explanation/architecture-decisions.md`     |
| Database Schema          | `/docs/reference/database-schema.md`              |
| API Endpoints            | `/docs/reference/api-endpoints.md`                |
| Environment Variables    | `/docs/reference/environment-variables.md`        |
| Dockerfile & Deployment  | `/docs/guides/deployment.md`                      |
| Tailwind Config          | `/docs/reference/frontend-config.md`              |

---

### Issue 4: Meeting Notes Are Not Documentation (MEDIUM)

**Problem:** Four files are meeting transcripts, not documentation:
- `EDGE-CASES.md` — Gap analysis meeting notes
- `MVP-REVIEW.md` — Team review meeting notes
- `UI-UX-REVIEW.md` — Design review meeting notes
- `AI-ARCHITECTURE-REVIEW.md` — Architecture audit notes

**These are valuable as records, but they are not documentation.** A new developer doesn't need to read a meeting transcript to understand the system.

**Impact:** `/docs` is polluted with non-documentation. Critical information is buried in prose.

**Fix:**
1. Move to `/docs/archive/` or `/docs/decisions/`
2. Extract actionable items into proper documentation
3. Convert key decisions into ADRs (Architecture Decision Records)

```
/docs/
├── archive/                     # Historical meeting notes
│   ├── 2024-12-edge-cases.md
│   ├── 2024-12-mvp-review-v2.md
│   ├── 2024-12-ui-ux-review.md
│   └── 2024-12-ai-review.md
├── decisions/                   # Architecture Decision Records
│   ├── ADR-001-monolith.md      # Why monolith over microservices
│   ├── ADR-002-gemini.md        # Why Gemini over Claude/OpenAI
│   └── ADR-003-railway.md       # Why Railway for hosting
```

---

### Issue 5: README Is Too Long (MEDIUM)

**Problem:** The README is 77 lines. It contains:
- Project overview (correct)
- Features list (correct)
- Tech stack (correct)
- Project structure (should be in reference)
- Getting started commands (should be in tutorial)
- Documentation links (correct)
- Brand table (redundant — points to guidelines anyway)

**The README is a lobby, not a warehouse.** It should orient newcomers in 30 seconds, then send them elsewhere.

**Fix:** Trim README to essentials:

```markdown
# Sentri

> **"Your reputation, on guard."**

AI-powered review response automation for automotive dealerships.

## Quick Start

`npm install && npm run dev`

See [Getting Started](docs/tutorials/getting-started.md) for full setup.

## Documentation

- [Tutorials](docs/tutorials/) — Get started
- [How-to Guides](docs/guides/) — Solve specific problems
- [Reference](docs/reference/) — Technical details
- [Explanation](docs/explanation/) — Design decisions

## Links

- [Architecture](docs/explanation/architecture-decisions.md)
- [API Reference](docs/reference/api-endpoints.md)
- [Brand Guidelines](docs/reference/brand-guidelines.md)
```

**Target: 30 lines.**

---

### Issue 6: API Documentation Is Incomplete (MEDIUM)

**Problem:** `ARCHITECTURE.md` lists API endpoints but provides:
- No request body examples
- No response body examples
- No error codes
- No authentication requirements per endpoint

```
REVIEWS
GET    /reviews
GET    /reviews/:id
PATCH  /reviews/:id
```

This is a route list, not API documentation.

**Fix:** Create proper API reference:

```markdown
## GET /reviews

Retrieve all reviews for the authenticated dealer.

**Authentication:** Required (Bearer token)

**Query Parameters:**
| Parameter  | Type    | Description                                      |
|------------|---------|--------------------------------------------------|
| status     | string  | Filter by status: NEW, PENDING_RESPONSE, RESPONDED |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "platform": "GOOGLE",
      "reviewerName": "John Doe",
      "rating": 4,
      "reviewText": "Great service!",
      "status": "NEW",
      "createdAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

**Error Codes:**
| Code  | Description                              |
|-------|------------------------------------------|
| 401   | Unauthorized — invalid or missing token  |
| 500   | Server error                             |
```

---

### Issue 7: Environment Variables Not Documented (MEDIUM)

**Problem:** `ARCHITECTURE.md` lists env vars:

```
DATABASE_URL=postgresql://user:pass@host:5432/sentri
REDIS_URL=redis://host:6379
JWT_SECRET=
GEMINI_API_KEY=
```

But no documentation of:
- Which are required vs optional
- Default values
- Valid formats
- How to obtain (e.g., "Get GEMINI_API_KEY from Google AI Studio")

**Fix:** Create `/docs/reference/environment-variables.md`:

```markdown
# Environment Variables

| Variable          | Required  | Default       | Description                                                    |
|-------------------|-----------|---------------|----------------------------------------------------------------|
| `DATABASE_URL`    | Yes       | —             | PostgreSQL connection string                                   |
| `JWT_SECRET`      | Yes       | —             | Secret for signing JWTs. Min 32 chars.                         |
| `GEMINI_API_KEY`  | Yes       | —             | Google AI API key. Get from [AI Studio](https://aistudio.google.com/) |
| `NODE_ENV`        | No        | `development` | `development`, `production`, `test`                            |
```

---

### Issue 8: Duplication Risk (LOW)

**Problem:** Database schema appears in `ARCHITECTURE.md`:

```prisma
model Dealer {
  id                   String   @id @default(uuid())
  email                String   @unique
  ...
}
```

But the source of truth is `server/prisma/schema.prisma`.

**Risk:** These will diverge. The docs will become lies.

**Fix:** Either:
1. Generate schema docs from Prisma (automated)
2. Link to source file, don't copy
3. Accept duplication but add warning: "This may be outdated. See `prisma/schema.prisma` for source."

---

### Issue 9: No PLATFORMS.md Request/Response Examples (LOW)

**Problem:** Platforms documentation lists capabilities but lacks:
- Actual API request examples
- Response payload examples
- Error handling specifics

```markdown
### Capabilities
- List all reviews for a location
- Get individual review details
- Reply to reviews
```

This tells me *what* but not *how*.

**Fix:** Add concrete examples when implementing each platform.

---

## Recommended Structure

```
/docs/
├── README.md                           # Navigation hub (10 lines max)
│
├── tutorials/                          # Learning-oriented
│   ├── getting-started.md              # First run in 5 minutes
│   ├── local-development.md            # Full dev environment
│   └── first-deployment.md             # Deploy to Railway
│
├── guides/                             # Problem-oriented
│   ├── add-new-platform.md             # Platform integration steps
│   ├── customize-ai-prompts.md         # Modify AI behavior
│   ├── debug-failed-responses.md       # Troubleshooting
│   ├── rotate-secrets.md               # Security procedures
│   └── database-migrations.md          # Schema changes
│
├── reference/                          # Information-oriented
│   ├── api-endpoints.md                # Full API documentation
│   ├── database-schema.md              # Prisma models explained
│   ├── environment-variables.md        # All config options
│   ├── brand-guidelines.md             # Visual identity
│   ├── brand-assets-spec.md            # Asset specifications
│   └── platforms-api.md                # Platform integration details
│
├── explanation/                        # Understanding-oriented
│   ├── architecture-decisions.md       # Why monolith, why Gemini
│   ├── security-model.md               # Auth, encryption, threats
│   └── ai-response-design.md           # Prompt engineering decisions
│
├── decisions/                          # Architecture Decision Records
│   ├── ADR-001-monolith.md
│   ├── ADR-002-gemini.md
│   └── ADR-003-railway.md
│
└── archive/                            # Historical records
    ├── 2024-12-edge-cases.md
    ├── 2024-12-mvp-review-v2.md
    ├── 2024-12-ui-ux-review.md
    └── 2024-12-ai-review.md
```

---

## Priority Action Items

### P0 — Blocking (Before Pilot)

| Item                                          | Owner  | Effort   |
|-----------------------------------------------|--------|----------|
| Create `tutorials/getting-started.md`         | Dan    | 2 hours  |
| Create `reference/environment-variables.md`   | Dan    | 1 hour   |
| Split `ARCHITECTURE.md` into focused docs     | Dan    | 3 hours  |

### P1 — Important (Before Production)

| Item                                                   | Owner  | Effort   |
|--------------------------------------------------------|--------|----------|
| Create `guides/add-new-platform.md`                    | Dan    | 2 hours  |
| Expand `reference/api-endpoints.md` with examples      | Dan    | 3 hours  |
| Move meeting notes to `/archive/`                      | Dan    | 30 min   |
| Trim README to 30 lines                                | Dan    | 30 min   |

### P2 — Nice to Have

| Item                                            | Owner  | Effort   |
|-------------------------------------------------|--------|----------|
| Create ADR templates and convert decisions      | Dan    | 2 hours  |
| Add automated schema generation                 | Dan    | 4 hours  |
| Create `guides/debug-failed-responses.md`       | Dan    | 1 hour   |

---

## Documentation Standards Going Forward

### 1. Single Source of Truth
Never copy-paste code or schemas into docs. Link to source files or generate from them.

### 2. One Mode Per Document
Is this a Guide (action) or an Explanation (theory)? Separate them. If a document answers both "how to do X" and "why X works this way," it's two documents.

### 3. Docs as Code
- Documentation errors are bugs. Track in issues.
- If code changes, docs must change. No exceptions.
- Review docs in PRs alongside code.

### 4. Every Env Var Documented
If you add an environment variable, update `reference/environment-variables.md` in the same PR.

### 5. Every API Endpoint Documented
If you add an endpoint, add it to `reference/api-endpoints.md` with request/response examples.

---

## Daniele Procida — Closing Statement

> "Your documentation is not terrible. It exists, which puts you ahead of most projects. But it's a flat list of files with no structure, mixing tutorials, reference, and meeting notes into an undifferentiated blob.
>
> A new developer cannot onboard. A deployer cannot deploy. A maintainer cannot troubleshoot. The information exists, but it's hidden in 3,700 lines of unstructured prose.
>
> Here's the fix:
>
> 1. **Create one tutorial** — 'Getting Started in 5 Minutes.' This is your highest-leverage improvement.
> 2. **Split ARCHITECTURE.md** — It's doing five jobs. Let it do one.
> 3. **Move meeting notes** — They're valuable, but they're not documentation.
> 4. **Document env vars** — A table. 30 minutes. High value.
>
> The Diátaxis structure I've proposed will scale from 10 docs to 100 docs without losing navigability. Adopt it now, before the documentation becomes legacy debt alongside the technical debt.
>
> Every developer who joins this project will thank you. Or more accurately, they won't have to thank you, because they'll just read the docs and get started. That's the goal."

---

*Documentation review by Daniele Procida. Structure recommendations ready for implementation.*
