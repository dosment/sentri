# Copywriting Pre-Live Checklist

**Owner:** Joanna Wiebe
**Last Updated:** December 4, 2025

---

> "Every word is an opportunity to clarify or confuse, to connect or alienate."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| UI Copy | 12 | 8 | 4 |
| Error Messages | 6 | 3 | 3 |
| CTAs | 5 | 4 | 1 |
| Onboarding | 4 | 2 | 2 |

---

## 1. Brand Voice Guidelines

### Tone

| Do | Don't |
|----|-------|
| Confident | Arrogant |
| Professional | Stiff |
| Helpful | Patronizing |
| Direct | Abrupt |
| Human | Robotic |

### Voice Principles

1. **We, not it** — "Sentri is writing..." not "Generating..."
2. **Active, not passive** — "You approved" not "Response was approved"
3. **Specific, not vague** — "3 new reviews" not "Some reviews"
4. **Positive, not negative** — "Ready to approve" not "Not yet approved"

---

## 2. UI Copy Audit

### 2.1 Login Page

| Element | Current | Status | Suggested |
|---------|---------|--------|-----------|
| Page title | "Sign in to Sentri" | [x] | Good |
| Tagline | "Your reputation, on guard." | [x] | Good |
| Email label | "Email" | [x] | Good |
| Password label | "Password" | [x] | Good |
| Submit button | "Sign in" | [x] | Good |
| Demo hint | "Demo: demo@example.com" | [x] | Hidden in prod |

### 2.2 Dashboard

| Element | Current | Status | Suggested |
|---------|---------|--------|-----------|
| Greeting | "Welcome back, [Name]" | [x] | Good |
| Subtitle | "Your reputation, on guard." | [x] | Good |
| Stat: Total | "Total Reviews" | [x] | Good |
| Stat: New | "New Reviews" | [~] | Consider "Awaiting Response" |
| Stat: Responded | "Responded" | [x] | Good |
| Empty state | "No reviews yet" | [x] | Good |
| Connect CTA | "Connect Google Account" | [x] | Good |

### 2.3 Review Cards

| Element | Current | Status | Suggested |
|---------|---------|--------|-----------|
| Response label | "Draft Response" | [x] | Good (not "AI Response") |
| Generate button | "Generate Response" | [~] | Consider "Write Response" |
| Regenerate button | "Regenerate" | [x] | Good |
| Edit button | "Edit" | [x] | Good |
| Approve button | "Approve" | [x] | Good |
| Loading state | "Sentri is writing..." | [x] | Good |

### 2.4 Missing Copy

| Location | Need | Status | Priority |
|----------|------|--------|----------|
| Success toast | "Response approved!" | [ ] | P1 |
| Error toast | Specific error messages | [ ] | P1 |
| Settings page | All copy | [ ] | P2 |
| Help text | Contextual guidance | [ ] | P2 |

---

## 3. Error Messages

### 3.1 Current vs Improved

| Scenario | Current | Status | Improved |
|----------|---------|--------|----------|
| Login failed | "Login failed" | [ ] | "That didn't work. Check your email and password." |
| Network error | "Network error" | [ ] | "We can't reach the server. Check your connection." |
| Generation failed | "Failed to generate" | [x] | "We couldn't generate a response. Try again." |
| Save failed | "Failed to save" | [ ] | "Your changes weren't saved. Try again." |
| Session expired | "Session expired" | [x] | "Your session expired. Please sign in again." |
| Not found | "Not found" | [x] | "We couldn't find that review." |

### 3.2 Error Message Principles

1. **No blame** — "That didn't work" not "You entered wrong password"
2. **Clear action** — Always suggest what to do next
3. **Specific** — Tell them what failed
4. **Human** — Avoid technical jargon

---

## 4. CTAs (Calls to Action)

### 4.1 Primary CTAs

| CTA | Current | Status | Notes |
|-----|---------|--------|-------|
| Login | "Sign in" | [x] | Action-oriented |
| Generate | "Generate Response" | [x] | Clear action |
| Approve | "Approve" | [x] | Commitment word |
| Connect | "Connect Google Account" | [x] | Specific |
| Retry | "Try Again" | [~] | Consider "Retry" |

### 4.2 Button Hierarchy

| Type | Style | Examples |
|------|-------|----------|
| Primary | Green, solid | Approve, Save |
| Secondary | Gray, outline | Edit, Cancel |
| Danger | Red | Delete (future) |
| Disabled | Gray, reduced opacity | Connect (blocked) |

---

## 5. Onboarding Copy

### 5.1 Onboarding Checklist

| Step | Current | Status | Suggested |
|------|---------|--------|-----------|
| Account | "Account created" | [x] | Good |
| Google | "Connect Google" | [x] | Good |
| First review | "First review received" | [~] | "Your first review arrived" |
| First response | "First response approved" | [~] | "You approved your first response" |

### 5.2 Empty State Copy

| Scenario | Current | Status | Notes |
|----------|---------|--------|-------|
| No reviews | "No reviews yet. Connect your Google Business Profile to start." | [x] | Good |
| No responses | (implicit) | [x] | Shows Generate button |
| All done | (not implemented) | [ ] | Need "All caught up!" state |

---

## 6. Microcopy Details

### 6.1 Timestamps

| Format | Example | Status |
|--------|---------|--------|
| Relative | "2 hours ago" | [x] | For recent |
| Absolute | "Dec 4, 2025" | [x] | For older |

### 6.2 Numbers

| Context | Format | Example |
|---------|--------|---------|
| Stats | Plain | "47" |
| Percentages | No decimals | "95%" |
| Money | With cents | "$149.00" |

### 6.3 Truncation

| Content | Max Length | Indicator |
|---------|------------|-----------|
| Dealer name | 25 chars | Ellipsis |
| Review preview | 150 chars | "..." |
| Response preview | 200 chars | "..." |

---

## 7. Copy for Future Features

### 7.1 Notifications

| Notification | Copy |
|--------------|------|
| New review | "New 5-star review from [Name]" |
| Negative review | "Needs attention: 1-star review from [Name]" |
| Response posted | "Your response was posted to Google" |
| Post failed | "Response couldn't be posted. Check your connection." |

### 7.2 Settings

| Setting | Label | Help Text |
|---------|-------|-----------|
| Voice | "Response Style" | "How should Sentri sound when writing responses?" |
| Auto-approve | "Automatic Approval" | "Automatically approve responses for 4-5 star reviews" |
| Notifications | "Email Alerts" | "Get notified when new reviews arrive" |

---

## 8. Copy Consistency Checklist

| Term | Standard | Avoid |
|------|----------|-------|
| Sign in | "Sign in" | "Log in", "Login" |
| Sign out | "Sign out" | "Log out", "Logout" |
| Response | "Response" | "Reply", "Answer" |
| Review | "Review" | "Feedback", "Rating" |
| Approve | "Approve" | "Accept", "Confirm" |
| Generate | "Generate" | "Create", "Make" |

---

## 9. Accessibility Copy

| Element | Requirement | Status |
|---------|-------------|--------|
| Button labels | Descriptive text | [x] |
| Image alt text | Descriptive | [N/A] |
| Form labels | Associated with inputs | [x] |
| Error announcements | Screen reader friendly | [ ] |
| Focus indicators | Visible | [x] |

---

## 10. Pre-Launch Copy Checklist

| # | Task | Status | Priority |
|---|------|--------|----------|
| 10.1 | All error messages human-friendly | [ ] | P0 |
| 10.2 | Success confirmations added | [ ] | P1 |
| 10.3 | Loading states have copy | [x] | P0 |
| 10.4 | Empty states have guidance | [x] | P0 |
| 10.5 | CTAs are action-oriented | [x] | P0 |
| 10.6 | No placeholder text remaining | [x] | P0 |
| 10.7 | Consistent terminology | [x] | P0 |
| 10.8 | No typos | [ ] | P0 |

---

## 11. Copy Review Process

Before launch:

1. [ ] Read all UI copy aloud — does it sound human?
2. [ ] Check all error states — are they helpful?
3. [ ] Verify all CTAs — is the action clear?
4. [ ] Test with new user — do they understand?
5. [ ] Proofread everything — any typos?

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| UI copy on-brand | Joanna Wiebe | [ ] |
| Error messages helpful | Joanna Wiebe | [ ] |
| CTAs clear | Joanna Wiebe | [ ] |
| Terminology consistent | Joanna Wiebe | [ ] |

**Copywriting Approval:** [ ] Approved / [ ] Rejected

---

*"If it takes more than 5 words to say, it takes too many words."*
