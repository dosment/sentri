# Master Pre-Live Checklist

**Owner:** Frank Slootman (COO)
**Last Updated:** December 4, 2025

---

> "We don't launch when we're ready. We launch when the blockers are cleared and the risks are known. Then we move fast."

---

## Executive Summary

| Category        | Total Items  | Complete  | Blocked  | Remaining  |
|-----------------|--------------|-----------|----------|------------|
| Legal           | 8            | 5         | 3        | 0          |
| Security        | 12           | 9         | 0        | 3          |
| Infrastructure  | 10           | 4         | 0        | 6          |
| Product         | 15           | 10        | 0        | 5          |
| Sales           | 6            | 0         | 0        | 6          |
| **TOTAL**       | **51**       | **28**    | **3**    | **20**     |

---

## Gate 0: Legal & Compliance (BLOCKING)

**Status:** BLOCKED
**Owner:** Dan (CEO) + Max Schrems (Legal)
**Unblock Date:** TBD

| #    | Item                                 | Owner        | Status      | Notes                                   |
|------|--------------------------------------|--------------|-------------|-----------------------------------------|
| 0.1  | Privacy Policy drafted               | Max Schrems  | [x]         | `docs/PRIVACY-POLICY.md`                |
| 0.2  | Terms of Service drafted             | Max Schrems  | [x]         | `docs/TERMS-OF-SERVICE.md`              |
| 0.3  | Legitimate Interest Assessment       | Max Schrems  | [x]         | `docs/LEGITIMATE-INTEREST-ASSESSMENT.md` |
| 0.4  | Company formation complete           | Dan          | [BLOCKED]   | Required for legal docs                 |
| 0.5  | Privacy Policy deployed to live URL  | Dan          | [BLOCKED]   | Needs company details                   |
| 0.6  | Terms of Service deployed to live URL | Dan         | [BLOCKED]   | Needs company details                   |
| 0.7  | Cookie consent mechanism             | Engineering  | [ ]         | If using cookies                        |
| 0.8  | Legal counsel review                 | Dan          | [ ]         | Before first paying customer            |

**Blocker Resolution:**
- Dan must complete company formation
- Fill in `[INSERT...]` placeholders in legal docs
- Deploy to `sentri.app/privacy` and `sentri.app/terms`

---

## Gate 1: Google OAuth (BLOCKING)

**Status:** BLOCKED (depends on Gate 0)
**Owner:** Dan (CEO)
**Estimated Time:** 40 min hands-on + 1-4 weeks Google review

| #    | Item                                | Owner   | Status  | Notes                                      |
|------|-------------------------------------|---------|---------|-------------------------------------------|
| 1.1  | Google Cloud project created        | Dan     | [ ]     | 5 min                                     |
| 1.2  | GBP APIs enabled                    | Dan     | [ ]     | 2 min                                     |
| 1.3  | OAuth consent screen configured     | Dan     | [ ]     | Needs live Privacy Policy                 |
| 1.4  | OAuth credentials created           | Dan     | [ ]     |                                           |
| 1.5  | Credentials shared with engineering | Dan     | [ ]     | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| 1.6  | Demo video recorded                 | Dan     | [ ]     | For Google verification                   |
| 1.7  | Verification submitted to Google    | Dan     | [ ]     |                                           |
| 1.8  | Google verification approved        | Google  | [ ]     | 1-4 week wait                             |

**Engineering Ready:**
- [x] Token encryption implemented (AES-256-GCM)
- [x] Platform service scaffolded
- [x] Database schema ready
- [ ] OAuth callback handler (waiting on credentials)
- [ ] Review sync service (waiting on credentials)

---

## Gate 2: Demo-Ready UI

**Status:** PARTIAL (85% complete)
**Owner:** Steve Jobs (UI/UX) + Marty Neumeier (Brand)

| #     | Item                                    | Owner           | Status  | Notes                      |
|-------|-----------------------------------------|-----------------|---------|----------------------------|
| 2.1   | Sentri favicon (replace Vite default)   | Marty Neumeier  | [ ]     | **P0**                     |
| 2.2   | Sentri logo files (SVG, PNG)            | Marty Neumeier  | [ ]     | **P0**                     |
| 2.3   | Empty state for new dealers             | Steve Jobs      | [x]     | With CTA                   |
| 2.4   | Color-coded review cards                | Steve Jobs      | [x]     | Red/green by rating        |
| 2.5   | Personalized dashboard greeting         | Steve Jobs      | [x]     | "Welcome back, [Name]"     |
| 2.6   | Loading skeleton states                 | Dan Abramov     | [x]     |                            |
| 2.7   | Error boundary                          | Dan Abramov     | [x]     | User-friendly error UI     |
| 2.8   | "Sentri is writing..." loading state    | Joanna Wiebe    | [x]     | Branded copy               |
| 2.9   | "Draft Response" label                  | Joanna Wiebe    | [x]     | Not "AI Response"          |
| 2.10  | Demo credentials hidden in prod         | Engineering     | [x]     | `import.meta.env.DEV`      |
| 2.11  | Onboarding checklist                    | Nick Mehta      | [x]     | Progress tracking          |

---

## Gate 3: Core Functionality Verification

**Status:** NOT STARTED
**Owner:** James Bach (QA)
**Required:** 2-hour exploratory session

| #    | Item                                  | Owner             | Status  | Risk      |
|------|---------------------------------------|-------------------|---------|-----------|
| 3.1  | Auth flow — happy path                | James Bach        | [ ]     | HIGH      |
| 3.2  | Auth flow — error cases               | James Bach        | [ ]     | HIGH      |
| 3.3  | AI generation — success               | James Bach        | [ ]     | HIGH      |
| 3.4  | AI generation — failure modes         | James Bach        | [ ]     | CRITICAL  |
| 3.5  | Response approval workflow            | James Bach        | [ ]     | HIGH      |
| 3.6  | Response editing                      | James Bach        | [ ]     | MEDIUM    |
| 3.7  | Dashboard with zero reviews           | James Bach        | [ ]     | HIGH      |
| 3.8  | Dashboard performance (100+ reviews)  | James Bach        | [ ]     | MEDIUM    |
| 3.9  | Mobile responsive behavior            | Luke Wroblewski   | [ ]     | MEDIUM    |
| 3.10 | Cross-browser testing                 | James Bach        | [ ]     | MEDIUM    |

---

## Gate 4: Infrastructure

**Status:** PARTIAL (40% complete)
**Owner:** Kelsey Hightower (DevOps)

| #     | Item                              | Owner           | Status  | Notes                         |
|-------|-----------------------------------|-----------------|---------|-------------------------------|
| 4.1   | CI pipeline (lint, typecheck)     | Kelsey          | [x]     | `.github/workflows/ci.yml`    |
| 4.2   | Health check endpoint             | Rob Pike        | [x]     | Verifies DB connection        |
| 4.3   | Structured JSON logging           | Rob Pike        | [x]     |                               |
| 4.4   | Rate limiting configured          | Bruce Schneier  | [x]     | Auth + AI endpoints           |
| 4.5   | Railway project created           | Kelsey          | [ ]     | **P0**                        |
| 4.6   | PostgreSQL provisioned            | Kelsey          | [ ]     | **P0**                        |
| 4.7   | Environment variables configured  | Kelsey          | [ ]     | **P0**                        |
| 4.8   | Production deployment successful  | Kelsey          | [ ]     | **P0**                        |
| 4.9   | SSL/TLS verified                  | Kelsey          | [ ]     | HTTPS only                    |
| 4.10  | Domain configured (sentri.app)    | Dan             | [ ]     | DNS + SSL                     |

---

## Gate 5: Sales & Demo Materials

**Status:** NOT STARTED
**Owner:** Brian Pasch (Marketing)

| #    | Item                      | Owner            | Status  | Notes                  |
|------|---------------------------|------------------|---------|------------------------|
| 5.1  | One-pager PDF             | Brian Pasch      | [ ]     | **P0** — leave-behind  |
| 5.2  | Demo script (5-min)       | Brian + Marty C  | [ ]     | **P0**                 |
| 5.3  | ROI calculator            | Brian Pasch      | [ ]     | P1                     |
| 5.4  | Competitive comparison    | Brian Pasch      | [ ]     | P1                     |
| 5.5  | Pricing confirmation      | Jeff Bezos       | [ ]     | $149/$299/$Custom      |
| 5.6  | Demo environment stable   | Engineering      | [ ]     | Seed data ready        |

---

## Gate 6: Operational Readiness

**Status:** PARTIAL
**Owner:** Frank Slootman

| #    | Item                            | Owner       | Status  | Notes                      |
|------|---------------------------------|-------------|---------|----------------------------|
| 6.1  | Support email configured        | Nick Mehta  | [ ]     | support@sentri.app         |
| 6.2  | Error alerting configured       | Kelsey      | [ ]     | Slack/email on errors      |
| 6.3  | Backup strategy documented      | Martin K    | [ ]     |                            |
| 6.4  | Incident response plan          | Kelsey      | [ ]     | Who to call at 2 AM        |
| 6.5  | Runbook for common issues       | Kelsey      | [ ]     |                            |
| 6.6  | Customer feedback mechanism     | Nick Mehta  | [ ]     | How dealers report issues  |

---

## Deployment Sequence

When all gates clear, execute in this order:

```
1. Final code freeze (no changes after this)
2. Run full QA checklist (James Bach signs off)
3. Deploy to Railway production (Kelsey)
4. Verify health check passes
5. Configure production domain (Dan)
6. Smoke test production (James Bach)
7. Security scan production URL (Bruce Schneier)
8. Go/No-Go decision (Frank)
9. Announce to pilot dealers
```

---

## Risk Register

| Risk                                 | Likelihood  | Impact    | Mitigation                                    | Owner        |
|--------------------------------------|-------------|-----------|-----------------------------------------------|--------------|
| Google verification rejected         | LOW         | HIGH      | Follow guidelines exactly, have backup plan   | Dan          |
| Gemini API downtime during demo      | MEDIUM      | HIGH      | Pre-generate responses, have fallback         | Engineering  |
| Legal docs incomplete                | HIGH        | CRITICAL  | Block launch until complete                   | Dan          |
| First dealer finds bug               | HIGH        | MEDIUM    | Fast response, direct communication           | James        |
| AI generates inappropriate response  | LOW         | HIGH      | Content filtering in place                    | Bruce        |

---

## Decision Log

| Date   | Decision                          | Rationale                                   | Owner  |
|--------|-----------------------------------|---------------------------------------------|--------|
| Dec 4  | Legal docs block all other gates  | Cannot collect user data without compliance | Frank  |
| Dec 4  | Skip staging, deploy direct to prod | Velocity > safety for MVP with known users | Frank  |
| Dec 4  | 2-hour QA session minimum         | Zero tests = need human verification       | Frank  |

---

## Daily Standup Questions

1. What blockers were cleared yesterday?
2. What blockers remain today?
3. Who needs to unblock whom?

---

## Sign-Off

| Role      | Name            | Approved  | Date  |
|-----------|-----------------|-----------|-------|
| COO       | Frank Slootman  | [ ]       |       |
| CEO       | Dan             | [ ]       |       |
| Security  | Bruce Schneier  | [ ]       |       |
| Legal     | Max Schrems     | [ ]       |       |
| QA        | James Bach      | [ ]       |       |

---

*No deployment without Frank's sign-off. No exceptions.*
