# Sentri UI Refresh Specification

## Design Direction

**Goal**: Refined, calm, professional aesthetic with generous breathing room. Less "SaaS template", more "premium tool you trust".

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#f5f7f6` | Page backgrounds (replaces pure white) |
| Surface | `#ffffff` | Cards, modals |
| Deep Teal | `#1a2e35` | Primary text, dark accents, CTAs |
| Muted Teal | `#2d4a54` | Secondary text, hover states |

### Supporting Colors
| Name | Hex | Usage |
|------|-----|-------|
| Soft Gray | `#6b7c7f` | Tertiary text, placeholders |
| Border | `#e2e6e5` | Subtle borders, dividers |
| Success | `#2d6a4f` | Positive states (muted green) |
| Warning | `#b8860b` | Attention states (muted gold) |
| Error | `#9b2c2c` | Error states (muted red) |

### Accent (Use Sparingly)
| Name | Hex | Usage |
|------|-----|-------|
| Sentri Blue | `#3b82f6` | Links, active states only |

---

## Typography

### Font Stack
```css
/* Headlines - Elegant serif */
--font-headline: 'Fraunces', 'Playfair Display', Georgia, serif;

/* Body - Clean sans-serif (keep existing) */
--font-body: 'Inter', -apple-system, sans-serif;
```

### Type Scale
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page Title | Serif | 32px | 600 | Deep Teal |
| Section Header | Serif | 24px | 500 | Deep Teal |
| Card Title | Sans | 18px | 600 | Deep Teal |
| Body | Sans | 15px | 400 | Muted Teal |
| Small/Caption | Sans | 13px | 400 | Soft Gray |

### Letter Spacing
- Headlines: `-0.02em` (slightly tighter)
- Small text/labels: `0.02em` (slightly wider)

---

## Spacing & Layout

### Increase Whitespace
- Page padding: `48px` (up from 24px)
- Section gaps: `48px` (up from 24px)
- Card padding: `32px` (up from 24px)
- Between cards: `24px`

### Max Widths
- Content area: `720px` for settings/forms
- Dashboard: `1200px` with proper grid gaps

---

## Components

### Cards
```css
/* Before */
background: white;
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);

/* After */
background: white;
border-radius: 16px;
border: 1px solid #e2e6e5;
box-shadow: none; /* or very subtle: 0 1px 2px rgba(0,0,0,0.04) */
```

### Buttons

**Primary**
```css
background: #1a2e35;
color: white;
border-radius: 999px; /* pill shape */
padding: 12px 28px;
font-weight: 500;
letter-spacing: 0.01em;
```

**Secondary**
```css
background: transparent;
color: #1a2e35;
border: 1px solid #e2e6e5;
border-radius: 999px;
```

**Hover States**
- Primary: `background: #2d4a54`
- Secondary: `background: #f5f7f6`

### Form Inputs
```css
background: #f5f7f6;
border: 1px solid transparent;
border-radius: 12px;
padding: 14px 18px;

/* Focus */
border-color: #1a2e35;
background: white;
```

### Navigation
- Text links, no backgrounds
- Active state: subtle underline or text color change
- CTA button: pill-shaped, dark background

---

## Visual Style

### Shadows
- Minimal to none on cards
- Subtle on modals/dropdowns only: `0 4px 20px rgba(0,0,0,0.08)`

### Borders
- Use borders instead of shadows for definition
- Border color: `#e2e6e5`
- Border radius: `16px` for cards, `12px` for inputs, `999px` for buttons

### Icons
- Stroke weight: 1.5px (lighter feel)
- Color: `#6b7c7f` (Soft Gray)
- Size: 20px standard

---

## Example: Settings Page Header

**Before:**
```
[White background]
Settings (blue text, sans-serif)
```

**After:**
```
[#f5f7f6 background]
Settings (Deep Teal, serif, 32px)
[24px gap]
Subtitle in Soft Gray, 15px
```

---

## Implementation Priority

1. **Colors** - Update Tailwind config with new palette
2. **Typography** - Add serif font, update heading styles
3. **Buttons** - Pill shape, new colors
4. **Cards** - Remove shadows, add subtle borders
5. **Spacing** - Increase padding throughout
6. **Inputs** - Softer background style

---

## Tailwind Config Updates

```js
// tailwind.config.js additions
colors: {
  'bg-page': '#f5f7f6',
  'deep-teal': '#1a2e35',
  'muted-teal': '#2d4a54',
  'soft-gray': '#6b7c7f',
  'border-subtle': '#e2e6e5',
}

fontFamily: {
  'headline': ['Fraunces', 'Georgia', 'serif'],
}
```

---

## Reference

Inspired by: Clean, premium SaaS aesthetics (Pellonium, Linear, Notion)

**Key principles:**
- Trust through restraint
- Whitespace is a feature
- Muted palette = less visual noise
- Serif headlines = authority without stuffiness
