# Brand Pre-Live Checklist

**Owner:** Marty Neumeier
**Last Updated:** December 4, 2025

---

> "A brand is a person's gut feeling about a product, service, or company. It's not what you say it is. It's what they say it is."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Brand Assets | 8 | 0 | 8 |
| Visual Identity | 6 | 4 | 2 |
| Brand Voice | 5 | 4 | 1 |
| Differentiation | 4 | 3 | 1 |

---

## Brand Foundation

### The Onliness Statement

**Sentri is the ONLY** review response platform **that** executes automatically — not just monitors.

### Brand Attributes

| Attribute | Expression |
|-----------|------------|
| Vigilant | Always watching, never sleeping |
| Professional | Trustworthy, competent |
| Efficient | Zero effort for dealers |
| Personal | Matches dealer's voice |

### Tagline

**"Your reputation, on guard."**

---

## 1. Brand Assets (CRITICAL)

| # | Asset | Status | Priority | Notes |
|---|-------|--------|----------|-------|
| 1.1 | Primary logo (wordmark) | [ ] | P0 | "Sentri" text |
| 1.2 | Icon mark | [ ] | P0 | "S" shield/sentinel |
| 1.3 | Favicon (.ico, 32x32) | [ ] | P0 | For browser tab |
| 1.4 | Apple touch icon (180x180) | [ ] | P1 | For iOS home screen |
| 1.5 | Open Graph image (1200x630) | [ ] | P1 | For link previews |
| 1.6 | Logo SVG | [ ] | P0 | Scalable version |
| 1.7 | Logo PNG (transparent) | [ ] | P0 | For documents |
| 1.8 | Social media profile (500x500) | [ ] | P1 | Twitter, LinkedIn |

### Asset Specifications

| Asset | Format | Dimensions | Background |
|-------|--------|------------|------------|
| Wordmark | SVG | 200x40 | Transparent |
| Icon | SVG | 40x40 | Transparent |
| Favicon | ICO | 32x32 | #1E3A5F |
| OG Image | PNG | 1200x630 | #1E3A5F |
| Touch Icon | PNG | 180x180 | #1E3A5F |

### Where Assets Go

```
client/public/
├── favicon.ico           # Browser tab icon
├── apple-touch-icon.png  # iOS home screen
├── logo.svg              # In-app logo
├── og-image.png          # Social sharing
└── manifest.json         # PWA manifest
```

---

## 2. Visual Identity

### 2.1 Colors

| Name | Hex | Usage | Status |
|------|-----|-------|--------|
| Sentri Blue | `#1E3A5F` | Primary brand | [x] |
| Guardian Navy | `#0F2340` | Dark accents | [x] |
| Success Green | `#10B981` | Positive actions | [x] |
| Warning Amber | `#F59E0B` | Caution states | [x] |
| Alert Red | `#EF4444` | Errors, negative | [x] |
| Neutral | Gray scale | Text, borders | [x] |

### 2.2 Typography

| Element | Font | Weight | Status |
|---------|------|--------|--------|
| Headlines | Inter | 600 (Semi) | [x] |
| Body | Inter | 400 (Regular) | [x] |
| Buttons | Inter | 500 (Medium) | [x] |
| Numbers | Inter | 600 (Semi) | [x] |

### 2.3 Application

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.3.1 | Colors in Tailwind config | [x] | Custom colors defined |
| 2.3.2 | Font loaded correctly | [x] | Inter from Google Fonts |
| 2.3.3 | Logo in login page | [ ] | Missing asset |
| 2.3.4 | Logo in dashboard header | [ ] | Missing asset |

---

## 3. Brand Voice

### Tone Guidelines

| Do | Don't |
|----|-------|
| Confident, not arrogant | Salesy, pushy |
| Professional, not stiff | Casual, slangy |
| Helpful, not condescending | Robotic, cold |
| Direct, not blunt | Vague, wordy |

### 3.1 Voice in UI

| Location | Current Copy | Status | On-Brand? |
|----------|--------------|--------|-----------|
| Login tagline | "Your reputation, on guard." | [x] | Yes |
| Dashboard greeting | "Welcome back, [Name]" | [x] | Yes |
| Loading state | "Sentri is writing..." | [x] | Yes |
| Response label | "Draft Response" | [x] | Yes |
| Empty state | "No reviews yet" | [x] | Yes |
| Error message | "Something went wrong" | [~] | Generic |

### 3.2 Voice Improvements Needed

| Current | Suggested | Priority |
|---------|-----------|----------|
| "Login failed" | "That didn't work. Try again." | P2 |
| "Something went wrong" | "We hit a snag. Let's try again." | P2 |
| "Generating..." | "Sentri is writing..." | [x] Done |

---

## 4. Differentiation

### 4.1 Onliness Visible in Product

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1.1 | Automation is the hero | [~] | AI does the work |
| 4.1.2 | "Sentri generates" language | [x] | In loading state |
| 4.1.3 | Zero-effort messaging | [ ] | Not prominent |
| 4.1.4 | Response rate metric | [x] | In dashboard stats |

### 4.2 Competitor Differentiation

| Feature | Podium | Birdeye | Sentri |
|---------|--------|---------|--------|
| Review monitoring | Yes | Yes | Yes |
| Response suggestions | Some | Some | AI-generated |
| Auto-response | No | No | **Yes** |
| Zero daily effort | No | No | **Yes** |

---

## 5. Brand Consistency Audit

### 5.1 Login Page

| Element | On-Brand | Notes |
|---------|----------|-------|
| Color scheme | [x] | Sentri Blue |
| Typography | [x] | Inter |
| Logo | [ ] | Missing |
| Tagline | [x] | Present |
| Voice | [x] | Professional |

### 5.2 Dashboard

| Element | On-Brand | Notes |
|---------|----------|-------|
| Color scheme | [x] | Consistent |
| Typography | [x] | Inter throughout |
| Logo | [ ] | Not in header |
| Voice | [x] | Personalized |
| Stats | [x] | Clear metrics |

### 5.3 Review Cards

| Element | On-Brand | Notes |
|---------|----------|-------|
| Color coding | [x] | Sentiment-based |
| Buttons | [x] | Green for primary |
| Labels | [x] | "Draft Response" |
| Loading | [x] | "Sentri is writing..." |

---

## 6. Brand Assets Deliverable

### Immediate Needs (Before Demo)

1. **Favicon** — 32x32 .ico file
   - S icon on Sentri Blue background
   - Simple, recognizable at small size

2. **Wordmark** — SVG
   - "Sentri" in Inter Semi-Bold
   - Sentri Blue (#1E3A5F)
   - Clean, professional

3. **Icon Mark** — SVG
   - Shield or sentinel motif
   - Works at 16x16 and 64x64
   - Sentri Blue

### Creation Notes

```
Design direction:
- Shield shape (protection, guard)
- Letter S integrated
- Modern, minimal
- No gradients (flat design)
- Works in single color
```

---

## 7. Digital Presence

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 7.1 | Domain configured | [ ] | P0 | sentri.app |
| 7.2 | Email domain | [ ] | P1 | @sentri.app |
| 7.3 | Twitter/X handle | [ ] | P2 | @sentri |
| 7.4 | LinkedIn page | [ ] | P2 | |
| 7.5 | OG tags configured | [ ] | P1 | For link sharing |

### OG Tags Required

```html
<meta property="og:title" content="Sentri — Your reputation, on guard." />
<meta property="og:description" content="AI-powered review response automation for dealerships." />
<meta property="og:image" content="https://sentri.app/og-image.png" />
<meta property="og:url" content="https://sentri.app" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## 8. Brand Guidelines Document

Ensure the brand guidelines are complete and accessible:

| Section | Status | Location |
|---------|--------|----------|
| Logo usage | [ ] | docs/BRAND-GUIDELINES.md |
| Color specifications | [x] | docs/BRAND-GUIDELINES.md |
| Typography | [x] | docs/BRAND-GUIDELINES.md |
| Voice & tone | [x] | docs/BRAND-GUIDELINES.md |
| Asset downloads | [ ] | Need to add assets |

---

## Pre-Launch Brand Checklist

- [ ] Favicon replaced (no more Vite logo)
- [ ] Logo in application header
- [ ] OG tags configured
- [ ] Brand voice consistent throughout
- [ ] Color scheme verified
- [ ] Typography consistent

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Brand assets delivered | Marty Neumeier | [ ] |
| Visual identity consistent | Marty Neumeier | [ ] |
| Voice consistent | Marty Neumeier | [ ] |
| Differentiation visible | Marty Neumeier | [ ] |

**Brand Approval:** [ ] Approved / [ ] Rejected

**Blocking issues:**
- Favicon not created
- Logo assets not created

---

*"Brand is not what you say you are. It's what others say you are when you're not in the room."*
