# Pre-Live Deployment Checklists

**Owner:** Frank Slootman (COO)
**Created:** December 4, 2025
**Purpose:** Complete verification before first customer demo and deployment

---

## Overview

This folder contains department-specific checklists that must be verified before Sentri goes live. Each checklist is owned by a domain expert and contains specific, verifiable items.

**Rule:** No deployment until all BLOCKING items across all checklists are complete.

---

## Checklist Index

| Department           | Owner                | File                                                      | Priority Items                 |
|----------------------|----------------------|-----------------------------------------------------------|--------------------------------|
| **Operations**       | Frank Slootman       | [00-MASTER.md](00-MASTER.md)                              | Gate coordination, blockers    |
| **Security**         | Bruce Schneier       | [01-SECURITY.md](01-SECURITY.md)                          | Auth, encryption, vulnerabilities |
| **Legal & Privacy**  | Max Schrems          | [02-LEGAL.md](02-LEGAL.md)                                | GDPR, policies, compliance     |
| **Backend**          | Rob Pike             | [03-BACKEND.md](03-BACKEND.md)                            | API, error handling, performance |
| **Frontend**         | Dan Abramov          | [04-FRONTEND.md](04-FRONTEND.md)                          | React, state, UX               |
| **Database**         | Martin Kleppmann     | [05-DATABASE.md](05-DATABASE.md)                          | Schema, indexes, backups       |
| **DevOps**           | Kelsey Hightower     | [06-DEVOPS.md](06-DEVOPS.md)                              | CI/CD, deployment, monitoring  |
| **QA**               | James Bach           | [07-QA.md](07-QA.md)                                      | Testing, edge cases, verification |
| **UI/UX**            | Steve Jobs           | [08-UI-UX.md](08-UI-UX.md)                                | Design, flow, polish           |
| **Mobile**           | Luke Wroblewski      | [09-MOBILE.md](09-MOBILE.md)                              | Responsive, touch, performance |
| **Brand**            | Marty Neumeier       | [10-BRAND.md](10-BRAND.md)                                | Assets, voice, consistency     |
| **Product**          | Marty Cagan          | [11-PRODUCT.md](11-PRODUCT.md)                            | Scope, validation, readiness   |
| **Business**         | Jeff Bezos           | [12-BUSINESS.md](12-BUSINESS.md)                          | Pricing, metrics, mechanisms   |
| **Marketing**        | Brian Pasch          | [13-MARKETING.md](13-MARKETING.md)                        | Positioning, materials, demo   |
| **Customer Success** | Nick Mehta           | [14-CUSTOMER-SUCCESS.md](14-CUSTOMER-SUCCESS.md)          | Onboarding, health, support    |
| **Documentation**    | Daniele Procida      | [15-DOCUMENTATION.md](15-DOCUMENTATION.md)                | User docs, developer docs      |
| **API Integration**  | Google API Specialist | [16-API-INTEGRATION.md](16-API-INTEGRATION.md)           | OAuth, endpoints, error handling |
| **Copywriting**      | Joanna Wiebe         | [17-COPYWRITING.md](17-COPYWRITING.md)                    | Microcopy, CTAs, voice         |

---

## Status Legend

| Symbol      | Meaning                          |
|-------------|----------------------------------|
| `[ ]`       | Not started                      |
| `[~]`       | In progress                      |
| `[x]`       | Complete                         |
| `[BLOCKED]` | Blocked by external dependency   |
| `[N/A]`     | Not applicable for MVP           |

---

## Priority Levels

| Level                | Meaning                   | Deployment Impact          |
|----------------------|---------------------------|----------------------------|
| **P0 - BLOCKING**    | Must be complete          | Cannot deploy without this |
| **P1 - CRITICAL**    | Should be complete        | Can deploy but high risk   |
| **P2 - IMPORTANT**   | Complete if time allows   | Acceptable technical debt  |
| **P3 - NICE TO HAVE** | Post-launch              | No deployment impact       |

---

## Quick Status

### Gate Status

| Gate                        | Status       | Blocker                        |
|-----------------------------|--------------|--------------------------------|
| Gate 0: Legal               | BLOCKED      | Company formation, live URLs   |
| Gate 1: Google OAuth        | BLOCKED      | Legal docs must be live first  |
| Gate 2: Demo UI             | PARTIAL      | Missing favicon, logo          |
| Gate 3: Core Verification   | NOT STARTED  | Needs QA session               |
| Gate 4: Infrastructure      | PARTIAL      | Production deployment pending  |
| Gate 5: Sales Materials     | NOT STARTED  | One-pager needed               |
| Gate 6: Demo Script         | NOT STARTED  | Script and fallbacks needed    |

### Critical Path

```
Legal Docs Live → Google OAuth Setup → Google Verification → Production Deploy → First Demo
     ↓                    ↓                    ↓                    ↓
   (Dan)              (Dan)              (1-4 weeks)          (Kelsey)
```

---

## How to Use

1. Each department owner reviews their checklist
2. Mark items as complete with `[x]`
3. Flag blockers immediately to Frank
4. Update status in this README when gates clear

---

## Sign-Off Requirements

Before deployment, each department lead must sign off:

| Department  | Lead              | Signed Off  | Date  |
|-------------|-------------------|-------------|-------|
| Security    | Bruce Schneier    | [ ]         |       |
| Legal       | Max Schrems       | [ ]         |       |
| Backend     | Rob Pike          | [ ]         |       |
| Frontend    | Dan Abramov       | [ ]         |       |
| Database    | Martin Kleppmann  | [ ]         |       |
| DevOps      | Kelsey Hightower  | [ ]         |       |
| QA          | James Bach        | [ ]         |       |
| Product     | Marty Cagan       | [ ]         |       |

---

*Last updated: December 4, 2025*
