# Product Pre-Live Checklist

**Owner:** Marty Cagan
**Last Updated:** December 4, 2025

---

> "Fall in love with the problem, not the solution."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Core Value Proposition | 5 | 4 | 1 |
| Feature Completeness | 8 | 7 | 1 |
| User Validation | 5 | 0 | 5 |
| Metrics | 4 | 1 | 3 |

---

## 1. Core Value Proposition

### The Promise
> "100% review response rate with zero daily effort."

### Value Verification

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | AI generates responses | [x] | Gemini integration works |
| 1.2 | Responses are on-brand | [x] | Voice profile influences tone |
| 1.3 | Approval workflow exists | [x] | Draft → Approved |
| 1.4 | Auto-approve option exists | [~] | Threshold in model, not in UI |
| 1.5 | Zero daily effort achieved | [ ] | Needs Google OAuth for full automation |

### MVP Scope Verification

| In Scope | Implemented | Notes |
|----------|-------------|-------|
| Google Business Profile reviews | [BLOCKED] | OAuth pending |
| AI response generation | [x] | Gemini working |
| Edit responses | [x] | |
| Approve responses | [x] | |
| Dashboard with stats | [x] | |
| Dealer login | [x] | |

| Out of Scope (Phase 2) | Status | Notes |
|------------------------|--------|-------|
| Facebook reviews | Not started | |
| DealerRater reviews | Not started | |
| Auto-posting responses | Not started | Needs Google OAuth |
| Bulk approve | Not started | |
| Notifications | Not started | |

---

## 2. Feature Completeness

### 2.1 Authentication

| Feature | Status | Notes |
|---------|--------|-------|
| Email/password login | [x] | |
| Session persistence | [x] | 24-hour JWT |
| Logout | [x] | |
| Password strength | [x] | Enforced |
| (Future) Registration | [ ] | Admin creates accounts for MVP |
| (Future) Password reset | [ ] | Phase 2 |

### 2.2 Dashboard

| Feature | Status | Notes |
|---------|--------|-------|
| Total reviews count | [x] | |
| New reviews count | [x] | Pending response |
| Response rate | [x] | Percentage |
| Review list | [x] | With filtering |
| Loading states | [x] | Skeletons |
| Empty state | [x] | With CTA |
| Personalized greeting | [x] | |

### 2.3 Review Management

| Feature | Status | Notes |
|---------|--------|-------|
| View review details | [x] | In card |
| Color by sentiment | [x] | Red/green coding |
| Platform source badge | [x] | Google icon |
| Reviewer name | [x] | |
| Rating display | [x] | Stars |
| Review date | [x] | |

### 2.4 Response Management

| Feature | Status | Notes |
|---------|--------|-------|
| Generate AI response | [x] | One-click |
| Regenerate response | [x] | Get new version |
| Edit response | [x] | Inline editing |
| Approve response | [x] | Changes status |
| (Future) Post to platform | [BLOCKED] | Needs OAuth |
| (Future) Bulk approve | [ ] | Phase 2 |

### 2.5 Settings

| Feature | Status | Notes |
|---------|--------|-------|
| Voice profile | [~] | In database, not editable in UI |
| Auto-approve threshold | [~] | In database, not editable in UI |
| Account settings | [ ] | Phase 2 |
| Platform connections | [BLOCKED] | Needs OAuth |

---

## 3. User Flows

### 3.1 Primary Flow (MVP)

```
Dealer logs in
    ↓
Dashboard shows reviews
    ↓
Dealer clicks "Generate Response"
    ↓
AI generates draft
    ↓
Dealer reviews/edits
    ↓
Dealer approves
    ↓
(Future) Response posted to Google
```

**Status:** [~] Works except final posting

### 3.2 Onboarding Flow

```
Dealer receives invite email (manual)
    ↓
Dealer logs in
    ↓
Sees onboarding checklist
    ↓
Connects Google account
    ↓
Reviews sync automatically
    ↓
Dealer generates first response
```

**Status:** [~] Works except Google OAuth

---

## 4. User Validation

| # | Validation Task | Status | Priority | Notes |
|---|-----------------|--------|----------|-------|
| 4.1 | Demo to target dealer | [ ] | P0 | Before launch |
| 4.2 | Collect feedback on AI quality | [ ] | P0 | Critical |
| 4.3 | Test with real negative reviews | [ ] | P0 | Edge cases |
| 4.4 | Verify workflow matches mental model | [ ] | P0 | Is it intuitive? |
| 4.5 | Validate pricing with pilot | [ ] | P1 | Is $149-299 right? |

### Demo Questions to Answer

1. Does the dealer understand what Sentri does in 30 seconds?
2. Can they generate and approve a response without instruction?
3. Do the AI responses sound like their voice?
4. Would they trust this for their reviews?
5. What would make them pay for this?

### Pilot Dealer Criteria

- [ ] Mix of franchised and independent
- [ ] Varying review volumes (low, medium, high)
- [ ] Different service types (sales-focused, service-focused)
- [ ] Tech-savvy and less-technical users
- [ ] At least one multi-location operator

---

## 5. Success Metrics

| Metric | Definition | Target | Tracking | Status |
|--------|------------|--------|----------|--------|
| Response rate | Responded / Total | 95%+ | [ ] | Not tracking yet |
| AI approval rate | Approved as-is / Total | 80%+ | [ ] | Not tracking yet |
| Time to respond | Generated → Approved | < 5 min | [ ] | Not tracking yet |
| Dealer satisfaction | Survey score | > 4/5 | [N/A] | Post-pilot |

### Analytics Implementation

| Event | Tracked | Notes |
|-------|---------|-------|
| Login | [x] | Audit log |
| Response generated | [~] | Need to add |
| Response edited | [ ] | Need to add |
| Response approved | [x] | Audit log |
| Dashboard viewed | [ ] | Need to add |

---

## 6. Known Gaps

| Gap | Impact | Workaround | Fix Priority |
|-----|--------|------------|--------------|
| No Google OAuth | HIGH | Demo mode only | BLOCKING |
| No settings UI | MEDIUM | Change in database | P1 |
| No bulk approve | LOW | One-by-one | P2 |
| No notifications | LOW | Check dashboard | P2 |
| No mobile app | LOW | Responsive web | P3 |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI responses feel generic | MEDIUM | HIGH | Voice profile tuning |
| AI generates inappropriate | LOW | HIGH | Content filtering |
| Dealers don't trust AI | MEDIUM | HIGH | Approval workflow |
| Google OAuth rejected | LOW | CRITICAL | Follow guidelines |
| Low adoption after trial | UNKNOWN | HIGH | Validate before scaling |

---

## 8. Competitive Positioning

| Competitor | Key Difference | Sentri Advantage |
|------------|----------------|------------------|
| Podium | Monitor + suggest | We execute |
| Birdeye | Monitor + suggest | We execute |
| Reputation.com | Monitor + suggest | We execute |
| Manual response | Time-consuming | Zero effort |

### Positioning Statement

> For automotive dealerships who struggle to respond to every review, Sentri is the only platform that generates and posts responses automatically. Unlike monitoring tools that just alert you, Sentri does the work — giving you 100% response rate with zero daily effort.

---

## 9. Pre-Launch Requirements

### Must Have (P0)

- [x] AI generates quality responses
- [x] Dashboard shows reviews and stats
- [x] Approval workflow works
- [ ] Google OAuth functional
- [ ] Demo script prepared
- [ ] At least 1 pilot dealer committed

### Should Have (P1)

- [ ] Voice profile editable in UI
- [ ] Response rate tracking
- [ ] Basic analytics
- [ ] Onboarding tutorial

### Nice to Have (P2)

- [ ] Bulk approve
- [ ] Notification preferences
- [ ] Export reviews

---

## 10. Launch Readiness Checklist

| # | Item | Status | Owner |
|---|------|--------|-------|
| 10.1 | Core features functional | [x] | Engineering |
| 10.2 | Google OAuth working | [BLOCKED] | Dan |
| 10.3 | Pilot dealer identified | [ ] | Brian Pasch |
| 10.4 | Demo script created | [ ] | Brian + Marty |
| 10.5 | Feedback mechanism ready | [ ] | Nick Mehta |
| 10.6 | Support process defined | [ ] | Nick Mehta |
| 10.7 | Pricing confirmed | [ ] | Jeff Bezos |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Value proposition clear | Marty Cagan | [ ] |
| Core features complete | Marty Cagan | [ ] |
| User validation done | Marty Cagan | [ ] |
| Metrics tracking ready | Marty Cagan | [ ] |

**Product Approval:** [ ] Approved / [ ] Rejected

**Blocking issues:**
- Google OAuth not functional
- No pilot dealer feedback yet

---

*"The biggest risk is building something nobody wants. Validate before you scale."*
