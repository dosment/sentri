# UI/UX Pre-Live Checklist

**Owner:** Steve Jobs
**Last Updated:** December 4, 2025

---

> "Design is not just what it looks like and feels like. Design is how it works."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Visual Design | 10 | 7 | 3 |
| Interaction Design | 8 | 6 | 2 |
| Information Architecture | 6 | 5 | 1 |
| Emotional Design | 5 | 2 | 3 |
| Polish | 8 | 3 | 5 |

---

## Design Principles

1. **Simplicity** — Remove everything until it breaks, then add one thing back
2. **Focus** — One primary action per screen
3. **Confidence** — The user should never wonder "did that work?"
4. **Delight** — Small moments of surprise and satisfaction

---

## 1. Visual Design

### 1.1 Brand Consistency

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1.1.1 | Sentri Blue (#1E3A5F) used correctly | [x] | P0 | Primary color |
| 1.1.2 | Guardian Navy (#0F2340) for accents | [x] | P0 | Secondary |
| 1.1.3 | Inter font throughout | [x] | P0 | Consistent typography |
| 1.1.4 | Favicon is Sentri mark | [ ] | P0 | Still Vite default |
| 1.1.5 | Logo in header | [ ] | P0 | Not implemented |
| 1.1.6 | Consistent spacing (4px grid) | [x] | P1 | Tailwind defaults |

### 1.2 Visual Hierarchy

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1.2.1 | Primary action is obvious | [x] | P0 | Green approve button |
| 1.2.2 | Negative reviews stand out | [x] | P0 | Red border/accent |
| 1.2.3 | Stats have clear hierarchy | [~] | P1 | Numbers big, labels small |
| 1.2.4 | Review cards scannable | [x] | P0 | Rating, name, preview visible |

---

## 2. Key Screens Audit

### 2.1 Login Page

| Check | Status | Notes |
|-------|--------|-------|
| Sentri logo visible | [ ] | Need logo asset |
| Tagline present | [x] | "Your reputation, on guard." |
| Form is clean, focused | [x] | |
| Error states clear | [x] | Red text below fields |
| Demo credentials visible (dev only) | [x] | Hidden in production |
| Loading state on submit | [x] | |

### 2.2 Dashboard

| Check | Status | Notes |
|-------|--------|-------|
| Personalized greeting | [x] | "Welcome back, [Name]" |
| Stats at a glance | [x] | Total, New, Responded |
| Stats have context | [ ] | No trends yet |
| Review list clear | [x] | Color-coded cards |
| Empty state guides user | [x] | CTA to connect |
| Loading skeletons | [x] | While fetching |

### 2.3 Review Card

| Check | Status | Notes |
|-------|--------|-------|
| Rating immediately visible | [x] | Stars + color |
| Reviewer name shown | [x] | |
| Review text readable | [x] | Truncated with expand |
| Platform source shown | [x] | Google/Facebook badge |
| Date shown | [x] | |
| Actions clearly labeled | [x] | Generate, Approve |

### 2.4 Response Area

| Check | Status | Notes |
|-------|--------|-------|
| "Draft Response" label | [x] | Not "AI Response" |
| Text is editable | [x] | Click to edit |
| Edit mode obvious | [x] | Different styling |
| Save/Cancel clear | [x] | Button labels |
| Loading during generation | [x] | "Sentri is writing..." |

---

## 3. Interaction Design

### 3.1 Feedback & Confirmation

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1.1 | Button states (hover, active, disabled) | [x] | P0 | |
| 3.1.2 | Loading indicators for async actions | [x] | P0 | Spinner + text |
| 3.1.3 | Success confirmation on approve | [~] | P1 | Status changes, but no toast |
| 3.1.4 | Error messages are helpful | [x] | P0 | Action-oriented |
| 3.1.5 | Destructive actions require confirmation | [N/A] | P1 | No destructive actions in MVP |

### 3.2 Navigation

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.2.1 | User knows where they are | [x] | P0 | Dashboard is only page |
| 3.2.2 | Sign out is accessible | [x] | P0 | Header top-right |
| 3.2.3 | Long dealer names truncated | [x] | P0 | Ellipsis after 25 chars |
| 3.2.4 | Back button works correctly | [x] | P0 | Browser history |

---

## 4. Empty States & Edge Cases

| State | Status | Message | CTA |
|-------|--------|---------|-----|
| No reviews (new user) | [x] | "No reviews yet" | Connect Google |
| No responses generated | [x] | Shows "Generate Response" | Generate button |
| Loading reviews | [x] | Skeleton cards | — |
| Error loading reviews | [x] | Error message | Retry button |
| Gemini generation failed | [x] | "Couldn't generate" | Try Again |

---

## 5. Emotional Design

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | First-run experience feels welcoming | [~] | P1 | Onboarding exists but plain |
| 5.2 | AI generation feels "magic" | [~] | P1 | Loading state, but no delight |
| 5.3 | Approval feels satisfying | [ ] | P2 | No animation/celebration |
| 5.4 | Milestones celebrated | [ ] | P2 | "100% response rate!" |
| 5.5 | Brand voice throughout | [x] | P1 | Tagline, microcopy |

### Opportunities for Delight

- [ ] Subtle animation when response appears
- [ ] Confetti or checkmark animation on first approval
- [ ] Progress bar fills as onboarding completes
- [ ] Sound effect option for new review alerts (Phase 2)

---

## 6. Micro-Interactions

| Interaction | Status | Notes |
|-------------|--------|-------|
| Button hover effect | [x] | Color shift |
| Button click feedback | [x] | Scale + color |
| Input focus state | [x] | Blue outline |
| Card hover | [~] | Subtle shadow |
| Loading spinner | [x] | Consistent animation |
| Expand/collapse | [x] | Smooth transition |

---

## 7. Typography & Readability

| # | Item | Status | Notes |
|---|------|--------|-------|
| 7.1 | Body text 16px minimum | [x] | Mobile-friendly |
| 7.2 | Line height 1.5 | [x] | Readable |
| 7.3 | Max line width ~70 chars | [x] | Card constraints |
| 7.4 | Contrast ratio 4.5:1+ | [x] | WCAG AA |
| 7.5 | Heading hierarchy clear | [x] | h1 > h2 > p |

---

## 8. Polish Checklist

### Before Demo

| # | Item | Status | Priority |
|---|------|--------|----------|
| 8.1 | Favicon updated | [ ] | P0 |
| 8.2 | Logo in header | [ ] | P0 |
| 8.3 | No lorem ipsum anywhere | [x] | P0 |
| 8.4 | No console errors | [ ] | P0 |
| 8.5 | No broken images | [x] | P0 |
| 8.6 | No dead links | [x] | P0 |
| 8.7 | All buttons work | [ ] | P0 |
| 8.8 | Mobile layout verified | [ ] | P0 |

---

## 9. Screen Recording Checklist

Before the first demo, record these flows:

1. [ ] Login flow (email → dashboard)
2. [ ] Empty state to first review
3. [ ] Generate → Edit → Approve flow
4. [ ] Mobile responsive behavior
5. [ ] Error recovery flow

---

## 10. Design Debt

Issues to address post-launch:

| Issue | Severity | Notes |
|-------|----------|-------|
| No success toast on actions | Low | User knows by status change |
| Stats lack trend context | Medium | Phase 2 enhancement |
| No celebration animations | Low | Nice to have |
| Settings page basic | Medium | Not in MVP |
| No dark mode | Low | Phase 2 |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Brand consistency | Steve Jobs | [ ] |
| Visual hierarchy clear | Steve Jobs | [ ] |
| Interactions feel good | Steve Jobs | [ ] |
| Edge cases handled | Steve Jobs | [ ] |
| Mobile verified | Steve Jobs | [ ] |

**UI/UX Approval:** [ ] Approved / [ ] Rejected

---

*"Details are not details. They make the design."*
