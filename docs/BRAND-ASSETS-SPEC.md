# Sentri — Brand Asset Specifications

**Version:** 1.0
**Date:** December 2024
**Owner:** Marty Neumeier (Brand Strategy)
**Purpose:** Technical specifications for designers to create brand assets

---

## Quick Reference

| Asset | Priority | Status | Sizes |
|-------|----------|--------|-------|
| Wordmark Logo | P0 | Needed | SVG + PNG @1x, 2x, 3x |
| Icon Mark | P0 | Needed | 16, 32, 64, 128, 192, 512px |
| Favicon | P0 | Needed | ICO (16, 32, 48) + PNG (180, 192, 512) |
| OG Image | P1 | Needed | 1200×630px |
| Social Avatars | P1 | Needed | 400×400px |
| Email Header | P2 | Needed | 600×100px |

---

## 1. Primary Wordmark Logo

### Concept
Clean, modern wordmark spelling "Sentri" in a professional sans-serif. Evokes vigilance and trust without being literal (no shield icons in wordmark).

### Typography
- **Font:** Inter Bold (700) or custom lettering based on Inter
- **Letter-spacing:** Slightly tightened (-2% tracking)
- **Case:** Title case — capital S, lowercase entri

### Color Variants

| Variant | Usage | Colors |
|---------|-------|--------|
| **Primary** | Light backgrounds | Sentri Blue (#1E3A5F) |
| **Reversed** | Dark backgrounds | White (#FFFFFF) |
| **Monochrome** | Print, single-color | Black (#000000) or White (#FFFFFF) |

### Size Requirements

| Format | Dimensions | Use Case |
|--------|------------|----------|
| `sentri-logo-primary.svg` | Scalable | Web, print master |
| `sentri-logo-primary@1x.png` | 200×50px | Web default |
| `sentri-logo-primary@2x.png` | 400×100px | Retina web |
| `sentri-logo-primary@3x.png` | 600×150px | High-DPI mobile |
| `sentri-logo-white.svg` | Scalable | Dark backgrounds |
| `sentri-logo-white@1x.png` | 200×50px | Dark backgrounds |
| `sentri-logo-white@2x.png` | 400×100px | Dark backgrounds |

### Clear Space
Minimum clear space around logo = height of the letter "S"

```
┌──────────────────────────────┐
│                              │
│   ┌────────────────────┐     │
│   │      Sentri        │     │
│   └────────────────────┘     │
│                              │
└──────────────────────────────┘
    ↔ S-height on all sides
```

### Minimum Size
- **Digital:** 80px wide minimum
- **Print:** 1 inch wide minimum

---

## 2. Icon Mark

### Concept
Abstract mark for small sizes where wordmark is illegible. Options to explore:

1. **Stylized "S"** — Modern, geometric letterform
2. **Shield beacon** — Subtle shield shape with beacon/signal element
3. **Abstract sentinel** — Geometric form suggesting vigilance

### Design Principles
- Must work at 16×16px (favicon size)
- Single color must be legible
- Should feel related to wordmark without being derivative
- No literal shield or eye imagery (too expected)

### Color Variants

| Variant | Usage |
|---------|-------|
| **Full color** | Blue on white, white on blue |
| **Monochrome** | Single color for any background |

### Size Requirements

| Format | Dimensions | Use Case |
|--------|------------|----------|
| `sentri-icon.svg` | Scalable | Master file |
| `sentri-icon-16.png` | 16×16px | Browser favicon |
| `sentri-icon-32.png` | 32×32px | Browser favicon @2x |
| `sentri-icon-64.png` | 64×64px | Desktop icons |
| `sentri-icon-128.png` | 128×128px | App icons |
| `sentri-icon-180.png` | 180×180px | Apple touch icon |
| `sentri-icon-192.png` | 192×192px | Android icon |
| `sentri-icon-512.png` | 512×512px | PWA icon, app stores |

---

## 3. Favicon

### Technical Requirements

**ICO file (multi-size):**
```
sentri-favicon.ico
├── 16×16px
├── 32×32px
└── 48×48px
```

**PNG files for modern browsers:**
```
favicon-16x16.png
favicon-32x32.png
apple-touch-icon.png (180×180)
android-chrome-192x192.png
android-chrome-512x512.png
```

**SVG favicon (for modern browsers):**
```
favicon.svg
```

### Implementation (index.html)
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

### site.webmanifest
```json
{
  "name": "Sentri",
  "short_name": "Sentri",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1E3A5F",
  "background_color": "#FFFFFF",
  "display": "standalone"
}
```

---

## 4. Open Graph Image

### Purpose
Social media preview when Sentri URLs are shared.

### Specifications

| Property | Value |
|----------|-------|
| **Dimensions** | 1200×630px |
| **Format** | PNG or JPG |
| **File size** | < 300KB |
| **Background** | Sentri Blue (#1E3A5F) or White |

### Content Layout
```
┌────────────────────────────────────────────────┐
│                                                │
│              [Sentri Logo - White]             │
│                                                │
│         "Your reputation, on guard."           │
│                                                │
│     [Dashboard mockup or abstract pattern]     │
│                                                │
└────────────────────────────────────────────────┘
```

### File
```
sentri-og-image.png (1200×630px)
```

### Implementation
```html
<meta property="og:image" content="https://sentri.io/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://sentri.io/og-image.png">
```

---

## 5. Social Media Avatars

### Platforms & Sizes

| Platform | Size | Format |
|----------|------|--------|
| LinkedIn (company) | 400×400px | PNG |
| Twitter/X | 400×400px | PNG |
| Facebook | 170×170px (displays as circle) | PNG |
| Google Business | 250×250px | PNG |

### Design Notes
- Use icon mark, not wordmark (too small)
- Ensure icon works in circular crop
- Sentri Blue background with white icon, OR white background with blue icon

### Files
```
sentri-avatar-400.png  (master, square)
sentri-avatar-250.png  (Google Business)
sentri-avatar-170.png  (Facebook)
```

---

## 6. Email Assets

### Email Header

| Property | Value |
|----------|-------|
| **Dimensions** | 600×100px (max width for email) |
| **Format** | PNG |
| **Content** | Wordmark logo, centered or left-aligned |

### Email Signature Logo

| Property | Value |
|----------|-------|
| **Dimensions** | 150×40px |
| **Format** | PNG |

### Files
```
sentri-email-header.png (600×100px)
sentri-email-signature.png (150×40px)
```

---

## Color Specifications

### Primary Palette

| Color | Hex | RGB | HSL | Pantone |
|-------|-----|-----|-----|---------|
| **Sentri Blue** | #1E3A5F | 30, 58, 95 | 214°, 52%, 25% | 289 C (approx) |
| **Guardian Navy** | #0F2340 | 15, 35, 64 | 216°, 62%, 15% | 289 C Dark |
| **White** | #FFFFFF | 255, 255, 255 | 0°, 0%, 100% | — |

### Secondary Palette

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Success Green** | #10B981 | 16, 185, 129 | Positive states |
| **Warning Amber** | #F59E0B | 245, 158, 11 | Pending states |
| **Alert Red** | #EF4444 | 239, 68, 68 | Errors, negative |
| **Neutral Gray** | #6B7280 | 107, 114, 128 | Secondary text |

### Tailwind CSS Config
```javascript
colors: {
  'sentri-blue': '#1E3A5F',
  'guardian-navy': '#0F2340',
  'success': '#10B981',
  'warning': '#F59E0B',
  'alert': '#EF4444',
}
```

---

## Typography Specifications

### Primary: Inter

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Captions, labels |
| Semibold | 600 | Emphasis |
| Bold | 700 | Headings |

### Google Fonts Implementation
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### CSS
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

## File Organization

```
/brand-assets/
├── logo/
│   ├── sentri-logo-primary.svg
│   ├── sentri-logo-primary@1x.png
│   ├── sentri-logo-primary@2x.png
│   ├── sentri-logo-primary@3x.png
│   ├── sentri-logo-white.svg
│   ├── sentri-logo-white@1x.png
│   └── sentri-logo-white@2x.png
├── icon/
│   ├── sentri-icon.svg
│   ├── sentri-icon-16.png
│   ├── sentri-icon-32.png
│   ├── sentri-icon-64.png
│   ├── sentri-icon-128.png
│   ├── sentri-icon-180.png
│   ├── sentri-icon-192.png
│   └── sentri-icon-512.png
├── favicon/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   └── site.webmanifest
├── social/
│   ├── sentri-og-image.png
│   ├── sentri-avatar-400.png
│   ├── sentri-avatar-250.png
│   └── sentri-avatar-170.png
└── email/
    ├── sentri-email-header.png
    └── sentri-email-signature.png
```

---

## Delivery Checklist

### P0 — Before Pilot
- [ ] Wordmark logo (primary + white, SVG + PNG)
- [ ] Icon mark (SVG + all PNG sizes)
- [ ] Favicon set (ICO + PNGs + manifest)

### P1 — Before Public Launch
- [ ] OG image
- [ ] Social media avatars
- [ ] Email header and signature

### P2 — Marketing Phase
- [ ] Pitch deck template
- [ ] One-pager template
- [ ] Business card design (if needed)

---

## Design Resources

### Inspiration References
- Stripe (clean, professional fintech)
- Linear (modern SaaS simplicity)
- Vercel (bold, minimal)
- Notion (approachable professionalism)

### Tools
- **Design:** Figma
- **Icon generation:** realfavicongenerator.net
- **OG image testing:** opengraph.xyz
- **Color accessibility:** webaim.org/resources/contrastchecker

---

*Specification v1.0 — Ready for designer handoff.*
