# Mobile Pre-Live Checklist

**Owner:** Luke Wroblewski
**Last Updated:** December 4, 2025

---

> "Mobile isn't just a smaller screen. It's a different context, different constraints, different opportunities."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Responsive Layout | 8 | 6 | 2 |
| Touch Targets | 5 | 4 | 1 |
| Performance | 5 | 2 | 3 |
| Input Handling | 4 | 2 | 2 |
| Device Testing | 6 | 0 | 6 |

---

## 1. Responsive Layout

### 1.1 Breakpoints

| Breakpoint | Width | Status | Notes |
|------------|-------|--------|-------|
| Mobile S | 320px | [ ] | iPhone SE |
| Mobile M | 375px | [ ] | iPhone 12/13 |
| Mobile L | 414px | [ ] | iPhone Pro Max |
| Tablet | 768px | [ ] | iPad Mini |
| Laptop | 1024px | [x] | |
| Desktop | 1440px | [x] | |

### 1.2 Layout Verification

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1.2.1 | Login form stacks on mobile | [x] | P0 | Full width |
| 1.2.2 | Stats cards stack on mobile | [x] | P0 | 1 column |
| 1.2.3 | Review cards full width on mobile | [x] | P0 | |
| 1.2.4 | Buttons remain accessible | [x] | P0 | Don't shrink too small |
| 1.2.5 | Text doesn't overflow | [x] | P0 | Truncation where needed |
| 1.2.6 | Header adapts to mobile | [~] | P0 | Dealer name truncates |
| 1.2.7 | No horizontal scroll | [ ] | P0 | Verify at 320px |
| 1.2.8 | Content not cut off | [ ] | P0 | Verify at all sizes |

---

## 2. Touch Targets

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 2.1 | All buttons 44px minimum height | [x] | P0 | Updated in Button component |
| 2.2 | Links have sufficient padding | [x] | P0 | |
| 2.3 | Close/dismiss targets large enough | [x] | P0 | |
| 2.4 | No overlapping touch targets | [x] | P0 | |
| 2.5 | Buttons have visual feedback on touch | [~] | P1 | Active state exists |

### Touch Target Audit

| Element | Current Size | Meets 44px | Notes |
|---------|--------------|------------|-------|
| Login button | 44px+ | [x] | Full width |
| Generate Response | 44px+ | [x] | |
| Approve button | 44px+ | [x] | |
| Edit button | 44px+ | [x] | |
| Sign out | 44px+ | [x] | Link in header |

---

## 3. Mobile Performance

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1 | Page load < 3s on 3G | [ ] | P0 | Need to test |
| 3.2 | No layout shift on load | [ ] | P1 | CLS score |
| 3.3 | Animations smooth (60fps) | [x] | P1 | |
| 3.4 | Scrolling smooth | [x] | P0 | |
| 3.5 | Memory usage stable | [ ] | P1 | No leaks |

### Performance Testing

```
1. Open Chrome DevTools
2. Enable "Throttling" → "Slow 3G"
3. Enable "CPU throttling" → 4x slowdown
4. Navigate through app
5. Check for jank and delays
```

### Lighthouse Mobile Scores

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Performance | > 70 | | [ ] |
| First Contentful Paint | < 2s | | [ ] |
| Largest Contentful Paint | < 3s | | [ ] |
| Cumulative Layout Shift | < 0.1 | | [ ] |
| Time to Interactive | < 4s | | [ ] |

---

## 4. Input Handling

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | Email field shows email keyboard | [x] | P0 | `type="email"` |
| 4.2 | Password field secure input | [x] | P0 | `type="password"` |
| 4.3 | Virtual keyboard doesn't cover form | [ ] | P1 | Need to test |
| 4.4 | Form fields scroll into view on focus | [ ] | P1 | Need to test |

### Keyboard Behavior Testing

```
On iOS Safari:
1. Tap email field
2. Verify @ symbol is easily accessible
3. Tap password field
4. Verify input is hidden
5. Verify "Done" button dismisses keyboard
6. Verify form isn't hidden behind keyboard

On Android Chrome:
1. Same tests
2. Verify back button dismisses keyboard
```

---

## 5. Viewport & Meta Tags

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | Viewport meta tag present | [x] | In index.html |
| 5.2 | Proper viewport config | [x] | `width=device-width, initial-scale=1` |
| 5.3 | No user-scalable=no | [x] | Accessibility requirement |
| 5.4 | Theme color set | [ ] | For browser chrome |

### Expected Meta Tags

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1E3A5F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

---

## 6. Device Testing Matrix

### iOS Devices

| Device | Safari | Chrome | Status | Issues |
|--------|--------|--------|--------|--------|
| iPhone SE (320px) | [ ] | [ ] | | |
| iPhone 13/14 | [ ] | [ ] | | |
| iPhone Pro Max | [ ] | [ ] | | |
| iPad Mini | [ ] | [ ] | | |
| iPad Pro | [ ] | [ ] | | |

### Android Devices

| Device | Chrome | Firefox | Status | Issues |
|--------|--------|---------|--------|--------|
| Small Android (~360px) | [ ] | [ ] | | |
| Pixel 6/7 | [ ] | [ ] | | |
| Samsung Galaxy | [ ] | [ ] | | |
| Android tablet | [ ] | [ ] | | |

---

## 7. Mobile-Specific UX

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 7.1 | Pull-to-refresh | [N/A] | P2 | Native app pattern |
| 7.2 | Swipe gestures | [N/A] | P2 | Not in MVP |
| 7.3 | Offline indicator | [ ] | P2 | Nice to have |
| 7.4 | Connection recovery | [ ] | P2 | Nice to have |
| 7.5 | Loading states clear | [x] | P0 | |

---

## 8. Orientation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 8.1 | Portrait works correctly | [ ] | Primary mode |
| 8.2 | Landscape doesn't break | [ ] | Should degrade gracefully |
| 8.3 | Orientation change handled | [ ] | No content loss |

---

## 9. Text & Readability

| # | Item | Status | Notes |
|---|------|--------|-------|
| 9.1 | Base font size 16px | [x] | Prevents zoom on iOS |
| 9.2 | Text doesn't require zooming | [x] | |
| 9.3 | Long text truncates gracefully | [x] | Ellipsis |
| 9.4 | Review text expandable | [x] | On mobile |
| 9.5 | Line length manageable | [x] | Full width cards |

---

## 10. Mobile Testing Checklist

Execute on at least one real device:

### Login Flow
- [ ] Load login page
- [ ] Enter email (email keyboard appears)
- [ ] Enter password (secure input)
- [ ] Tap Sign In
- [ ] Wait for login
- [ ] Dashboard loads

### Dashboard
- [ ] Stats cards visible
- [ ] Review list scrolls smoothly
- [ ] Cards are readable
- [ ] Color coding visible

### Response Flow
- [ ] Tap Generate Response
- [ ] Loading indicator visible
- [ ] Response appears
- [ ] Edit button accessible
- [ ] Tap to edit (keyboard appears)
- [ ] Type edits
- [ ] Save button accessible above keyboard
- [ ] Save and verify

### Navigation
- [ ] Sign out accessible
- [ ] Logout works
- [ ] Back button works correctly

---

## 11. Known Mobile Issues

| Issue | Severity | Workaround | Fix Status |
|-------|----------|------------|------------|
| Virtual keyboard may cover buttons | Medium | Scroll to reveal | [ ] |
| No haptic feedback | Low | None | Phase 2 |
| No offline support | Low | Requires connection | Phase 2 |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Responsive at all breakpoints | Luke Wroblewski | [ ] |
| Touch targets adequate | Luke Wroblewski | [ ] |
| Performance acceptable | Luke Wroblewski | [ ] |
| Tested on real devices | Luke Wroblewski | [ ] |

**Mobile Approval:** [ ] Approved / [ ] Rejected

**Devices tested:**
- [ ] iOS device (model: _________)
- [ ] Android device (model: _________)

---

*"The best interface is no interface. But when you need one, make it invisible."*
