# Customer Success Pre-Live Checklist

**Owner:** Nick Mehta
**Last Updated:** December 4, 2025

---

> "Customer success is not a department. It's a company-wide commitment."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Onboarding | 6 | 3 | 3 |
| Support | 5 | 0 | 5 |
| Health Metrics | 5 | 1 | 4 |
| Retention | 4 | 0 | 4 |

---

## 1. Onboarding

### 1.1 Time to First Value (TTFV)

**Goal:** Dealer sees first AI-generated response within 10 minutes of login.

| Step | Action | Time | Status |
|------|--------|------|--------|
| 1 | Dealer logs in | 0 | [x] Works |
| 2 | Sees onboarding checklist | +30s | [x] Implemented |
| 3 | Clicks "Connect Google" | +1 min | [BLOCKED] |
| 4 | Reviews sync | +2 min | [BLOCKED] |
| 5 | Clicks "Generate Response" | +1 min | [x] Works |
| 6 | Sees AI response | +5 min | [x] Works |
| **Total TTFV** | | **~10 min** | Blocked on OAuth |

### 1.2 Onboarding Checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.2.1 | Checklist component | [x] | In dashboard |
| 1.2.2 | Progress tracking | [x] | Visual progress bar |
| 1.2.3 | Step-by-step guidance | [~] | Basic, not tutorial |
| 1.2.4 | Connect Google CTA | [x] | Disabled until OAuth ready |
| 1.2.5 | First response celebration | [ ] | No celebration yet |
| 1.2.6 | Completion recognition | [ ] | No "you're all set" moment |

### 1.3 Onboarding Email Sequence

| Day | Email | Status | Notes |
|-----|-------|--------|-------|
| 0 | Welcome + getting started | [ ] | Not drafted |
| 1 | Did you connect Google? | [ ] | Not drafted |
| 3 | Your first response awaits | [ ] | Not drafted |
| 7 | Check-in if incomplete | [ ] | Not drafted |
| 14 | How's it going? Feedback | [ ] | Not drafted |

---

## 2. Support

### 2.1 Support Channels

| Channel | Status | Priority | Notes |
|---------|--------|----------|-------|
| Email (support@sentri.app) | [ ] | P0 | Primary |
| In-app chat | [ ] | P2 | Phase 2 |
| Knowledge base | [ ] | P1 | FAQ articles |
| Phone | [ ] | P3 | For Enterprise |

### 2.2 Support Readiness

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.2.1 | Support email configured | [ ] | Need domain |
| 2.2.2 | Response time SLA defined | [ ] | 4-hour target? |
| 2.2.3 | Escalation path defined | [ ] | Who handles what |
| 2.2.4 | Common issues documented | [ ] | Runbook |
| 2.2.5 | Feedback mechanism | [ ] | How dealers report issues |

### 2.3 FAQ Topics

| Topic | Article Status | Notes |
|-------|----------------|-------|
| How to connect Google | [ ] | Need OAuth first |
| How to edit responses | [ ] | |
| How to approve responses | [ ] | |
| What if AI generates wrong response | [ ] | |
| How to change voice settings | [ ] | |
| Billing questions | [ ] | |

---

## 3. Health Metrics

### 3.1 Customer Health Score

| Signal | Weight | Good | Warning | At Risk |
|--------|--------|------|---------|---------|
| Google connected | 30% | Yes | No (day 1-3) | No (day 3+) |
| Response rate | 25% | > 80% | 50-80% | < 50% |
| Edit rate | 15% | < 20% | 20-40% | > 40% |
| Login frequency | 15% | Weekly+ | Monthly | Never |
| Responses approved | 15% | > 10/mo | 1-10/mo | 0 |

### 3.2 Health Tracking Status

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.2.1 | Health score calculation | [ ] | Not implemented |
| 3.2.2 | Dashboard for CS team | [ ] | Not built |
| 3.2.3 | Automated alerts | [ ] | Not configured |
| 3.2.4 | Integration with support | [ ] | Not connected |
| 3.2.5 | Weekly health report | [ ] | Not automated |

### 3.3 Intervention Triggers

| Trigger | Action | Owner |
|---------|--------|-------|
| No Google connect after 3 days | Email + check-in call | CS |
| Edit rate > 50% | Review AI quality | Engineering |
| No logins in 14 days | Outreach call | CS |
| Response rate < 50% | Check for issues | CS |

---

## 4. Retention

### 4.1 Churn Signals

| Signal | Risk Level | Action |
|--------|------------|--------|
| Support ticket about canceling | Critical | Immediate outreach |
| No activity 30 days | High | Outreach call |
| Decreasing response rate | Medium | Check-in email |
| High edit rate | Medium | AI quality review |
| Billing failed | High | Payment recovery |

### 4.2 Churn Prevention

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.2.1 | At-risk dashboard | [ ] | Not built |
| 4.2.2 | Save playbooks | [ ] | Not defined |
| 4.2.3 | Win-back campaign | [ ] | Not designed |
| 4.2.4 | Exit survey | [ ] | Not created |

### 4.3 Retention Tactics

| Tactic | When | Status |
|--------|------|--------|
| QBR call | Quarterly | [ ] |
| Feature announcement | New releases | [ ] |
| Success celebration | Milestones | [ ] |
| Referral program | Happy customers | [ ] |

---

## 5. Customer Feedback

### 5.1 Feedback Mechanisms

| Method | Frequency | Status | Notes |
|--------|-----------|--------|-------|
| In-app "helpful?" | Per response | [ ] | TD-019 |
| NPS survey | Monthly | [ ] | Not built |
| Pilot feedback call | Day 15, 30 | [ ] | Manual |
| Feature requests | Ongoing | [ ] | No tracking |

### 5.2 Feedback Loop

```
Dealer feedback
      ↓
Categorize (bug, feature, quality)
      ↓
Route to owner (Eng, Product, AI)
      ↓
Acknowledge to dealer
      ↓
Resolve or roadmap
      ↓
Close loop with dealer
```

**Status:** [ ] Not implemented

---

## 6. MVP Support Approach

For initial pilots, lean support model:

| Task | Who | Method |
|------|-----|--------|
| Onboarding | Dan (CEO) | Personal call |
| Issues | Dan + Engineering | Direct email |
| Feedback | Dan | 15-min call |
| Billing | Dan | Manual |

### MVP Support Email Template

```
Subject: Welcome to Sentri — let's get you set up

Hi [Name],

Welcome to Sentri! I'm Dan, the founder.

For the next 30 days, I'm your personal support contact. Email me directly at dan@sentri.app with any questions.

To get started:
1. Log in at app.sentri.app
2. Click "Connect Google" to link your Business Profile
3. Your reviews will sync automatically
4. Click "Generate Response" on any review

I'd love to schedule a 15-minute check-in call next week to hear how it's going.

Reply with a time that works, or grab one here: [calendar link]

Dan
Founder, Sentri
```

---

## 7. Pre-Launch Customer Success Checklist

| # | Item | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 7.1 | Support email configured | [ ] | Nick | Before pilot |
| 7.2 | FAQ articles drafted | [ ] | Nick | Before pilot |
| 7.3 | Onboarding email sequence | [ ] | Nick | Before pilot |
| 7.4 | Health metrics defined | [x] | Nick | Done |
| 7.5 | Pilot feedback call scheduled | [ ] | Nick | Day 15, 30 |
| 7.6 | Escalation path documented | [ ] | Nick | Before pilot |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Onboarding flow works | Nick Mehta | [ ] |
| Support ready | Nick Mehta | [ ] |
| Health metrics trackable | Nick Mehta | [ ] |
| Feedback loop defined | Nick Mehta | [ ] |

**Customer Success Approval:** [ ] Approved / [ ] Rejected

**Blocking issues:**
- Support email not configured
- No FAQ/knowledge base
- Health tracking not implemented

---

*"The best customers are the ones who never need to call support because everything just works."*
