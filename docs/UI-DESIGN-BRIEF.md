# Sentri — UI Design Brief

**Prepared for:** External Design Team
**Date:** December 2025
**Version:** 1.0

---

## Executive Summary

Sentri is a B2B SaaS product that automatically responds to customer reviews for automotive dealerships. We need a complete UI redesign that transforms a functional prototype into a polished, professional product.

**The core problem:** Our current UI is flat, lifeless, and feels like an unfinished template. We need it to feel like a command center — a place where dealers feel protected and in control.

---

## Product Overview

### What Sentri Does

1. **Monitors reviews** — Connects to Google Business Profile (and later Facebook, DealerRater) to pull in customer reviews
2. **Generates responses** — AI writes personalized, on-brand responses to each review
3. **Approval workflow** — Dealer reviews the draft, can edit, then approves with one click
4. **Posts automatically** — Response is posted back to the platform

### The Value Proposition

> "Every review answered. Zero daily effort."

Dealers currently respond to ~30% of reviews. With Sentri, they achieve 100% response rate by clicking "Approve" instead of writing from scratch.

### The Differentiator

Most competitors (Podium, Birdeye, Reputation.com) are monitoring tools with templates. They alert you to reviews and give you templates to fill in.

**Sentri executes.** We don't just monitor — we generate the response and post it. The dealer's only job is to approve.

---

## Target Users

### Primary User: Marketing Manager

- **Age:** 28-45
- **Context:** Manages 5-20 things, reviews are one of them
- **Tech comfort:** Moderate — uses CRMs, social tools
- **Pain:** Reviews pile up, never enough time to respond
- **Goal:** Look professional without spending hours
- **Usage pattern:** Quick daily check (2-5 minutes), approves responses, moves on

### Secondary User: General Manager / Dealer Principal

- **Age:** 40-60
- **Context:** Runs the dealership, cares about reputation but delegates details
- **Tech comfort:** Low to moderate
- **Pain:** Doesn't know if reputation is being managed
- **Goal:** Confidence that reviews are handled
- **Usage pattern:** Weekly glance at dashboard, wants to see "everything's fine"

### Environment

- **Devices:** Primarily desktop (dealership office), occasional tablet/phone
- **Time of day:** Morning review (8-10 AM) or end of day (4-6 PM)
- **Attention span:** Low — competing priorities, interruptions common
- **Internet:** Generally reliable (dealership WiFi)

---

## Brand Identity

### Name & Positioning

**Sentri** — derived from "sentry" (a guard)

**Tagline:** "Your reputation, on guard."

**Personality:**
- Vigilant (always watching)
- Confident (we know what we're doing)
- Direct (no fluff)
- Professional (trustworthy)
- Efficient (results with minimal effort)

**Not:**
- Playful or cute
- Generic SaaS
- "AI-powered" (dealers are skeptical of AI claims)

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Sentri Blue** | `#1E3A5F` | Primary brand, CTAs, interactive elements |
| **Guardian Navy** | `#0F2340` | Dark backgrounds, headers, navigation |
| **White** | `#FFFFFF` | Content backgrounds, cards |
| **Success Green** | `#10B981` | Positive states, completed items, 4-5 star reviews |
| **Warning Amber** | `#F59E0B` | Pending states, items needing attention |
| **Alert Red** | `#EF4444` | Negative reviews (1-2 stars), errors |
| **Neutral Gray** | `#6B7280` | Secondary text, subtle elements |

### Typography

**Primary Font:** Inter (Google Fonts)
- Headers: Bold (700)
- Body: Regular (400)
- Captions: Medium (500)

### The Feeling We Want to Create

| Feel | Not |
|------|-----|
| Protected | Anxious |
| In control | Overwhelmed |
| Professional | Scrambling |
| Confident | Uncertain |
| Relieved | Burdened |

---

## Current State (What Exists)

We have a functional React + TypeScript frontend using Tailwind CSS. The functionality works, but the visual design needs significant improvement.

### Current Problems

1. **Flat and lifeless** — Everything is white cards on gray background, no depth
2. **No brand presence** — Colors exist in brand guidelines but aren't used effectively
3. **No visual hierarchy** — Everything has equal weight
4. **Missing dark anchor** — Brand guidelines specified navy sidebar/header, not implemented
5. **No motion** — Static, no hover states, no transitions
6. **Generic feeling** — Could be any SaaS product

### Current Screens

1. **Login Page** — Email/password form with logo
2. **Dashboard** — Stats cards + review list + onboarding checklist
3. **Review Cards** — Individual review with response section

### What's Implemented (Keep These)

- Sentiment color-coding (red/green left border on review cards by rating)
- "Sentri is writing..." loading state
- Onboarding checklist with progress bar
- Empty state with CTA
- Mobile-responsive grid

---

## Design Vision

Based on internal team discussions, here's the direction we want:

### "Command Center" Not "Task List"

The dashboard should feel like walking into a control room, not opening an inbox.

- **Task list says:** "Here are things to do"
- **Command center says:** "Here's what you need to know"

The dealer should feel that Sentri is watching, protecting, working on their behalf.

### Automation Should Be Visible

Our differentiator is that we execute, not just monitor. The UI should show this:

- "Sentri generated this response" indicator
- "Responses generated by Sentri this week" stat
- Visual activity during AI generation (shimmer, animation)
- Future: "Sentri auto-approved" badge

### Intelligence Layer (Future-Proofing)

We plan to add pattern intelligence — showing dealers insights from their reviews:

> "Customers mentioned 'wait time' 4x more this month than last month"

Design should include space for an "Insights" section, even if minimal at launch.

### Layout Direction

**Preferred approach:** Navy/blue hero zone at top containing greeting and stats, with content area below.

```
┌─────────────────────────────────────────────────────┐
│ HEADER (Logo, user name, sign out)                  │
├─────────────────────────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓  HERO ZONE (Navy/Blue gradient)                  ▓│
│▓  - Personalized greeting                         ▓│
│▓  - Stats cards (Total, New, Responded, Avg)      ▓│
│▓  - [Future: Insight card]                        ▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                                     │
│  CONTENT AREA                                       │
│  - Filter tabs (All, New, Pending, Responded)       │
│  - Review cards                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Alternative (for future consideration):** Navy sidebar with navigation when we have multiple pages (Settings, Reports, etc.)

---

## Screens to Design

### 1. Login Page

**Current:** Simple form with "S" logo placeholder

**Needs:**
- Professional logo treatment (we have brand guidelines, need designed mark)
- Polished form design
- Subtle background treatment (gradient, pattern, or imagery)
- Error states
- Loading state

**Copy:**
- Title: "Sentri"
- Tagline: "Your reputation, on guard."
- Button: "Sign in"
- Error: "That didn't work. Try again." (not "Login failed")

---

### 2. Dashboard (Main Screen)

**Components:**

#### Hero Section
- Personalized greeting: "Welcome back, [Dealer Name]"
- Tagline: "Your reputation, on guard."
- Stats cards (see below)
- [Future] Insight card: "This week: customers mentioned 'service' 4x"

#### Stats Cards
| Stat | Notes |
|------|-------|
| Total Reviews | Neutral styling |
| New Reviews | **Urgency styling if > 0** (amber glow, badge, pulse) |
| Responded | Success styling |
| Avg Rating | Show as X.X format |

**Future enhancement:** Trend indicators (↑ 2 from last week)

#### Onboarding Checklist
- Shows for new users who haven't completed setup
- Progress bar
- Steps: Account created, Google connected, First review, First response
- Dismissible

#### Filter Tabs
- All / New / Pending / Responded
- Active state should be clear

#### Review List
- Empty state when no reviews (with CTA to connect Google)
- Review cards (see below)

---

### 3. Review Card

**The most important component.** This is where the core workflow happens.

**Structure:**
```
┌────────────────────────────────────────────────────┐
│ [Platform] [Status] [Response Status]    Dec 3, 2025
│
│ John Smith  ★★★★★
│ "Great service! The team was helpful and..."
│
│ ┌────────────────────────────────────────────────┐
│ │ DRAFT RESPONSE                                 │
│ │ "Thank you for your kind words, John!..."     │
│ │                     [Regenerate] [Edit]        │
│ └────────────────────────────────────────────────┘
│
│                                        [Approve ✓]
└────────────────────────────────────────────────────┘
```

**Key Design Requirements:**

1. **Sentiment indication** — Red left border for 1-2 stars, green for 4-5 stars. Should be immediately visible when scanning.

2. **Response section distinction** — This is where AI magic happens. Should feel special, not just a gray box. Consider:
   - Subtle brand color tint
   - Left accent border
   - "Sentri generated" indicator (small icon or text)

3. **Button hierarchy:**
   - Approve = Primary action (green, prominent)
   - Edit = Secondary action
   - Regenerate = Tertiary action (subtle)

4. **States:**
   - No response yet → "Generate Response" button
   - Generating → Shimmer/loading animation in response area
   - Draft ready → Show response with Edit/Regenerate/Approve
   - Approved → Success indication
   - Posted → "Posted to Google" confirmation

5. **Edit mode:**
   - Inline textarea
   - Save / Cancel buttons
   - Should feel smooth, not jarring

---

### 4. Empty State

When a dealer has no reviews (new account):

**Elements:**
- Icon (shield or star — not chat bubble)
- Headline: "Your reviews will appear here"
- Subtext: "Connect your Google account and Sentri will start responding automatically"
- CTA button: "Connect Google" (disabled for now, with "Coming Soon" note)
- Reassurance: "We'll check for new reviews every hour"

---

### 5. Loading States

**Skeletons** — Match the shape of content they replace

**Branding opportunity:** Consider using brand blue tint instead of gray for skeleton pulse

**AI Generation** — When generating a response:
- Button shows "Sentri is writing..."
- Response area should show activity (shimmer, typing indicator, or similar)
- This is the "magic moment" — make it feel like something is happening

---

### 6. Header

**Elements:**
- Logo (left)
- Dealer name (right, truncate if long)
- Sign out button (right)

**Considerations:**
- Could be white header with blue accent, or navy header with white text
- Should feel anchored, not floating

---

### 7. Error States

**Form errors:**
- Inline, below field
- Red text with icon
- Helpful copy (what went wrong + what to do)

**API errors:**
- Toast or inline message
- "Something went wrong. Try again." with retry button
- Never blame the user

---

## Design Principles

From our internal design review:

### 1. Depth Over Flatness
- Use shadows to create hierarchy
- Cards should lift off the page
- Interactive elements should have hover states that elevate

### 2. Motion = Life
- Subtle transitions on all state changes (200-300ms)
- Hover states on cards (slight lift)
- Loading animations that feel alive
- Numbers that animate when they change

### 3. Brand Presence
- Navy/blue should be prominent, not hidden
- The brand wraps around the user
- Every screen should feel like Sentri, not generic SaaS

### 4. Urgency Where Needed
- New reviews = attention needed
- Visual distinction for items requiring action
- But not alarming — confident, not anxious

### 5. Progressive Disclosure
- Show what's needed, when it's needed
- Don't overwhelm with options
- Core flow: See review → See response → Approve

---

## Technical Constraints

### Stack
- React 18 + TypeScript
- Tailwind CSS
- Component-based architecture
- Mobile-responsive (320px minimum)

### Deliverables We Need
1. **Figma designs** for all screens/states
2. **Component specifications** (spacing, colors, typography)
3. **Responsive breakpoints** (mobile, tablet, desktop)
4. **Interaction notes** (hover states, transitions, animations)
5. **Icon set** or recommendations (we currently use Heroicons outline style)

### Logo/Mark
We need a designed logo mark. Current placeholder is just the letter "S" in a blue square. Brand guidelines suggest:
- Abstract shield or beacon mark
- Works at small sizes (favicon)
- Wordmark "Sentri" for larger uses

---

## Reference & Inspiration

### Products with similar "command center" feel:
- Linear (clean, purposeful, dark accents)
- Stripe Dashboard (clear hierarchy, professional)
- Notion (content-focused, subtle interactions)

### What we DON'T want:
- Cluttered enterprise dashboards
- Generic Bootstrap templates
- Overly playful/colorful SaaS
- Dark mode (not now — stick with light)

---

## Success Criteria

The redesign is successful if:

1. **A dealer logs in and immediately feels:** "This knows who I am. This is watching out for me."

2. **The core flow feels effortless:** See review → See response → Approve (3 clicks)

3. **The brand is unmistakable:** This could only be Sentri, not any other product

4. **New reviews demand attention:** Can't miss that there's work to be done

5. **AI feels like magic, not machinery:** The response generation feels special

---

## Attachments

Please refer to these existing documents:

- `docs/BRAND-GUIDELINES.md` — Full brand guidelines
- `docs/BRAND-ASSETS-SPEC.md` — Logo/asset specifications
- `docs/UI-UX-REVIEW.md` — Detailed internal critique

---

## Contact

For questions about product functionality, user flows, or technical constraints, contact the product team.

For questions about brand guidelines or positioning, refer to BRAND-GUIDELINES.md or ask.

---

*Document prepared December 2025*
