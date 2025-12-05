# Frontend Pre-Live Checklist

**Owner:** Dan Abramov
**Last Updated:** December 4, 2025

---

> "The best code is the code that doesn't exist. The second best is code that's obvious."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Core Functionality | 10 | 9 | 1 |
| State Management | 6 | 6 | 0 |
| Error Handling | 5 | 4 | 1 |
| Performance | 6 | 3 | 3 |
| Accessibility | 5 | 2 | 3 |

---

## 1. Core Functionality

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1.1 | Login flow works | [x] | P0 | Email + password |
| 1.2 | Logout clears state | [x] | P0 | Token removed, redirect |
| 1.3 | Dashboard loads reviews | [x] | P0 | With loading state |
| 1.4 | Review cards display correctly | [x] | P0 | Rating, text, date |
| 1.5 | Generate response works | [x] | P0 | Shows loading, displays result |
| 1.6 | Edit response works | [x] | P0 | Inline editing |
| 1.7 | Approve response works | [x] | P0 | Status updates |
| 1.8 | Regenerate response works | [x] | P0 | Replaces text |
| 1.9 | Onboarding checklist displays | [x] | P0 | Progress tracking |
| 1.10 | Empty state shows for new users | [x] | P0 | With CTA |

### Manual Test Script

```
1. Open http://localhost:5173
2. Verify login page loads with Sentri branding
3. Enter demo@example.com / demo1234
4. Click Sign In
5. Verify dashboard loads with greeting
6. Verify review cards show with color coding
7. Click "Generate Response" on a review
8. Verify "Sentri is writing..." loading state
9. Verify response appears
10. Click Edit, modify text, click Save
11. Click Approve
12. Verify status changes
13. Click Sign Out
14. Verify redirected to login
```

---

## 2. State Management

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 2.1 | Auth state persists across refresh | [x] | P0 | Token in localStorage |
| 2.2 | useAuth hook provides dealer info | [x] | P0 | Name, email, plan |
| 2.3 | Reviews refetch after approval | [x] | P0 | List updates |
| 2.4 | Editing state isolated per card | [x] | P0 | No cross-card interference |
| 2.5 | Loading states don't flash | [x] | P0 | Minimum 300ms or cached |
| 2.6 | Error states clear on retry | [x] | P0 | Reset on new request |

### State Verification

```javascript
// In browser console:

// Check auth state
localStorage.getItem('token')  // Should be JWT

// Check React Query cache (if using)
window.__REACT_QUERY_DEVTOOLS__  // Install devtools

// Verify state isolation
// Edit one card, another shouldn't enter edit mode
```

---

## 3. Error Handling

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1 | Error boundary catches crashes | [x] | P0 | User-friendly error UI |
| 3.2 | API errors show user message | [x] | P0 | Not raw error |
| 3.3 | Network errors handled | [x] | P0 | "Failed to connect" |
| 3.4 | 401 redirects to login | [x] | P0 | Token expired |
| 3.5 | Error recovery option | [ ] | P1 | Retry button |

### Error Scenarios to Test

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| Server down | Show "Unable to connect" | [x] |
| Invalid token | Redirect to login | [x] |
| Generate fails | Show error, enable retry | [x] |
| Save fails | Keep edit mode, show error | [x] |
| Component crash | Error boundary, recovery option | [x] |

### Test Error Boundary

```javascript
// Add this temporarily to any component to test:
throw new Error('Test error boundary');

// Should show:
// - Friendly error message
// - "Try Again" button
// - Not a white screen
```

---

## 4. Performance

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | Bundle size reasonable | [ ] | P1 | Target < 500KB |
| 4.2 | Lighthouse performance score | [ ] | P1 | Target > 80 |
| 4.3 | No unnecessary re-renders | [x] | P1 | React.memo where needed |
| 4.4 | Images optimized | [N/A] | P2 | No images in MVP |
| 4.5 | Lazy loading for routes | [ ] | P2 | Not implemented |
| 4.6 | Skeleton loaders | [x] | P0 | Dashboard stats, review list |

### Performance Verification

```bash
# Build and analyze bundle
cd client
npm run build

# Check bundle size
ls -la dist/assets/

# Run Lighthouse
# In Chrome DevTools > Lighthouse > Generate report
# Target scores:
# - Performance: > 80
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 80
```

### Bundle Size Targets

| Asset | Target | Status |
|-------|--------|--------|
| Main JS | < 300KB | [ ] |
| Main CSS | < 50KB | [ ] |
| Total | < 500KB | [ ] |

---

## 5. Accessibility

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | Keyboard navigation works | [ ] | P1 | Tab through forms |
| 5.2 | Focus states visible | [x] | P0 | Blue outline |
| 5.3 | Color contrast sufficient | [x] | P0 | 4.5:1 ratio |
| 5.4 | Screen reader labels | [ ] | P1 | aria-labels |
| 5.5 | Form error announcements | [ ] | P2 | aria-live |

### Accessibility Tests

```
1. Tab through login form - all fields reachable?
2. Tab through dashboard - all buttons reachable?
3. Use keyboard to approve a response
4. Check color contrast with browser devtools
5. Run axe DevTools extension
```

---

## 6. Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | [x] | Primary |
| Firefox | Latest | [ ] | Need to test |
| Safari | Latest | [ ] | Need to test |
| Edge | Latest | [ ] | Need to test |
| Mobile Chrome | Latest | [ ] | Need to test |
| Mobile Safari | Latest | [ ] | Need to test |

### Browser Testing Script

```
For each browser:
1. Open login page
2. Complete login
3. View dashboard
4. Generate a response
5. Approve a response
6. Check responsive layout
7. Test on mobile viewport
```

---

## 7. UI Components

| Component | Status | Notes |
|-----------|--------|-------|
| Button | [x] | All variants (primary, secondary, danger) |
| Card | [x] | With shadows, borders |
| Input | [x] | With validation states |
| Loading spinner | [x] | Consistent animation |
| Skeleton | [x] | For async content |
| Alert | [x] | Error, success, warning |
| Modal | [N/A] | Not used in MVP |
| Dropdown | [N/A] | Not used in MVP |

### Component Verification

```
For each component:
1. Check all variant styles
2. Check hover states
3. Check focus states
4. Check disabled states
5. Check loading states
6. Check error states
```

---

## 8. Forms

| Form | Status | Validation | Notes |
|------|--------|------------|-------|
| Login | [x] | Email format, required fields | |
| Edit Response | [x] | Not empty, max length | |
| (Future) Registration | [N/A] | | Not in MVP |
| (Future) Settings | [N/A] | | Not in MVP |

### Form Testing

```
Login form:
1. Submit empty - shows required errors
2. Submit invalid email - shows format error
3. Submit wrong password - shows error from server
4. Submit valid - redirects to dashboard

Edit Response form:
1. Clear text and save - shows error
2. Paste very long text - truncates or shows error
3. Edit and save - updates display
4. Edit and cancel - reverts to original
```

---

## 9. Environment Configuration

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 9.1 | API URL configurable | [x] | P0 | `VITE_API_URL` |
| 9.2 | Environment detection | [x] | P0 | `import.meta.env.DEV` |
| 9.3 | Demo credentials hidden in prod | [x] | P0 | Only in dev |
| 9.4 | No console.logs in prod | [ ] | P1 | Need to verify |

### Environment Verification

```bash
# Check for console.log statements
grep -r "console.log" client/src/ --include="*.tsx" --include="*.ts"
# Should be minimal or wrapped in DEV checks

# Build for production
npm run build

# Verify no dev artifacts in build
grep -r "demo@example.com" client/dist/
# Should not find demo credentials
```

---

## 10. Build & Deploy

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 10.1 | `npm run build` succeeds | [x] | P0 | No errors |
| 10.2 | `npm run lint` passes | [x] | P0 | No warnings |
| 10.3 | TypeScript compiles | [x] | P0 | `tsc --noEmit` |
| 10.4 | Build artifacts in dist/ | [x] | P0 | Ready for CDN |
| 10.5 | Index.html has correct meta tags | [ ] | P1 | Title, description |

### Build Verification

```bash
cd client

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build

# Preview production build
npm run preview
# Open http://localhost:4173 and verify everything works
```

---

## Pre-Deployment Checklist

Execute before every deployment:

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Production preview tested
- [ ] No console errors in browser
- [ ] API_URL points to production
- [ ] Demo credentials hidden

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Core flows work | Dan Abramov | [ ] |
| Error handling complete | Dan Abramov | [ ] |
| Performance acceptable | Dan Abramov | [ ] |
| Accessibility checked | Dan Abramov | [ ] |
| Cross-browser tested | Dan Abramov | [ ] |

**Frontend Approval:** [ ] Approved / [ ] Rejected

---

*"Make it work, make it right, make it fast. In that order."*
