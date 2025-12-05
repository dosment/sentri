# Business Pre-Live Checklist

**Owner:** Jeff Bezos
**Last Updated:** December 4, 2025

---

> "Your margin is my opportunity. Obsess over customers, not competitors."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Pricing | 6 | 3 | 3 |
| Billing | 4 | 0 | 4 |
| Metrics | 5 | 1 | 4 |
| Customer Mechanisms | 4 | 1 | 3 |

---

## 1. Pricing Strategy

### 1.1 Pricing Tiers

| Tier | Price | Target | Status | Notes |
|------|-------|--------|--------|-------|
| Starter | $149/mo | 1-2 locations | [x] | Defined |
| Professional | $299/mo | 3-5 locations | [x] | Defined |
| Enterprise | Custom | 6+ locations | [x] | Custom pricing |

### 1.2 Pricing Verification

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.2.1 | Pricing page content | [ ] | Need to create |
| 1.2.2 | Pricing validated with dealers | [ ] | Need pilot feedback |
| 1.2.3 | Discount for annual billing | [x] | 15% off annual |
| 1.2.4 | Trial period defined | [ ] | 14-day? 30-day? |
| 1.2.5 | Referral program terms | [ ] | 1 month free? |
| 1.2.6 | Enterprise negotiation framework | [ ] | Minimum floor |

### 1.3 Pricing Questions to Resolve

| Question | Options | Decision | Owner |
|----------|---------|----------|-------|
| Trial length | 14 vs 30 days | TBD | Jeff |
| Credit card for trial | Yes vs No | TBD | Jeff |
| Annual discount | 15% vs 20% | 15% | Decided |
| Referral credit | 1 month vs % | TBD | Jeff |

---

## 2. Billing Infrastructure

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 2.1 | Stripe account created | [ ] | P0 | Blocked on company formation |
| 2.2 | Stripe products configured | [ ] | P0 | After Stripe account |
| 2.3 | Billing page in app | [ ] | P1 | Phase 2 for MVP |
| 2.4 | Invoice generation | [ ] | P1 | Stripe handles |

### MVP Billing Approach

For initial pilots:
- Manual invoicing via Stripe dashboard
- Or: Free pilot period (no billing needed)
- Full billing automation in Phase 2

---

## 3. Unit Economics

### 3.1 Cost Structure

| Cost | Per Dealer/Mo | Notes |
|------|---------------|-------|
| Gemini API | ~$2-5 | ~50-100 reviews/mo |
| Infrastructure | ~$1-2 | Railway compute |
| Support | ~$5-10 | Amortized |
| **Total COGS** | **~$10-15** | |

### 3.2 Margin Analysis

| Tier | Price | COGS | Gross Margin | Margin % |
|------|-------|------|--------------|----------|
| Starter | $149 | $15 | $134 | 90% |
| Professional | $299 | $15 | $284 | 95% |
| Enterprise | $599+ | $20 | $579+ | 96%+ |

**Target gross margin: 85%+** — On track

### 3.3 LTV:CAC

| Metric | Target | Status | Notes |
|--------|--------|--------|-------|
| LTV | $3,000+ | [ ] | Need churn data |
| CAC | < $300 | [ ] | Need acquisition data |
| LTV:CAC | > 10:1 | [ ] | Dependent on above |
| Payback | < 3 months | [ ] | $149 plan: payback month 1 |

---

## 4. Success Metrics

### 4.1 Business Metrics to Track

| Metric | Definition | Target | Status |
|--------|------------|--------|--------|
| MRR | Monthly recurring revenue | Growth | [ ] Not tracking |
| Churn | Monthly cancellations | < 5% | [ ] Not tracking |
| NPS | Net promoter score | > 40 | [ ] Not tracking |
| Response rate | Dealer's response rate | > 95% | [x] In dashboard |

### 4.2 Leading Indicators

| Indicator | What It Shows | Status |
|-----------|---------------|--------|
| Login frequency | Engagement | [ ] Not tracking |
| Responses approved | Value delivered | [~] Audit logged |
| Edit rate | AI quality perception | [ ] Not tracking |
| Time to first response | Onboarding success | [ ] Not tracking |

---

## 5. Customer Mechanisms

### 5.1 Feedback Loop

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1.1 | "Was this helpful?" on responses | [ ] | P1 | TD-019 |
| 5.1.2 | Track edit frequency | [ ] | P1 | AI quality signal |
| 5.1.3 | Customer satisfaction survey | [ ] | P1 | After 30 days |
| 5.1.4 | Churn exit survey | [ ] | P2 | When canceling |

### 5.2 Flywheel

```
Better AI responses
        ↓
Higher approval rate
        ↓
More responses approved
        ↓
Better training data
        ↓
Better AI responses...
```

**Status:** Not implemented — need feedback mechanism

---

## 6. Go-to-Market

### 6.1 Initial Target

- **Geography:** US only (MVP)
- **Segment:** Single-location franchised dealers
- **Size:** 20-100 reviews/month
- **Pain point:** Low response rate, no time

### 6.2 Launch Sequence

| Phase | Target | Dealers | Notes |
|-------|--------|---------|-------|
| Alpha | Internal testing | 1-2 | Engineering + friends |
| Pilot | Validation | 5-10 | Free or discounted |
| Beta | Early adopters | 20-50 | Full pricing |
| Launch | General availability | 100+ | Marketing push |

### 6.3 Current Phase

**Status:** Pre-Alpha (Google OAuth blocking)

---

## 7. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pricing too high | LOW | MEDIUM | Pilot feedback |
| Pricing too low | MEDIUM | LOW | Raise later |
| High churn | UNKNOWN | HIGH | Quality focus |
| Slow growth | MEDIUM | MEDIUM | Marketing investment |
| Competitor response | LOW | MEDIUM | Speed to market |

---

## 8. Financial Projections

### Year 1 Targets (Illustrative)

| Month | Dealers | MRR | Notes |
|-------|---------|-----|-------|
| M1 | 5 | $0 | Pilot (free) |
| M3 | 15 | $2,000 | First paid |
| M6 | 50 | $7,500 | Growing |
| M12 | 150 | $25,000 | Sustainable |

**Assumption:** $175 average per dealer (mix of tiers)

---

## 9. Legal & Compliance

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9.1 | Company formation | [BLOCKED] | Needed for Stripe |
| 9.2 | Business bank account | [ ] | After formation |
| 9.3 | Terms of Service | [x] | Drafted |
| 9.4 | Pricing terms in ToS | [ ] | Need to add |

---

## 10. Pre-Launch Business Checklist

| # | Item | Status | Owner |
|---|------|--------|-------|
| 10.1 | Company legally formed | [BLOCKED] | Dan |
| 10.2 | Stripe account created | [ ] | Dan |
| 10.3 | Pricing finalized | [~] | Jeff |
| 10.4 | Trial terms defined | [ ] | Jeff |
| 10.5 | First pilot dealer | [ ] | Brian |
| 10.6 | Pricing page content | [ ] | Brian |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Pricing strategy sound | Jeff Bezos | [ ] |
| Unit economics viable | Jeff Bezos | [ ] |
| Metrics defined | Jeff Bezos | [ ] |
| Go-to-market clear | Jeff Bezos | [ ] |

**Business Approval:** [ ] Approved / [ ] Rejected

**Blocking issues:**
- Company formation pending
- No billing infrastructure

---

*"We're not in the business of selling software. We're in the business of saving dealers time."*
