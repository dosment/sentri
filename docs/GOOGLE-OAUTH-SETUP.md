# Google OAuth Setup — Requirements for Dan

**Owner:** Dan (CEO)
**Created:** December 2025
**Purpose:** Get Google Business Profile OAuth working for Sentri

---

## What You Need to Do

This document tells you exactly what actions YOU need to take to enable Google OAuth. The engineering side is ready — we have token encryption, the platform service, and the database schema. What's missing is the Google Cloud Console setup that only you (as project owner) can complete.

---

## Overview

| Step | Time | Requires | Blocker? |
|------|------|----------|----------|
| 1. Create Google Cloud Project | 5 min | Google account | No |
| 2. Enable APIs | 2 min | Step 1 | No |
| 3. Configure OAuth Consent Screen | 15 min | Business info | **Yes — needs company details** |
| 4. Create OAuth Credentials | 5 min | Step 3 | No |
| 5. Submit for Verification | 10 min | Privacy Policy URL | **Yes — needs live privacy policy** |
| 6. Wait for Google Review | 1-4 weeks | Step 5 | **Yes — external dependency** |

**Total hands-on time:** ~40 minutes
**Total wait time:** 1-4 weeks (Google review)

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown (top left, next to "Google Cloud")
3. Click "New Project"
4. Enter:
   - **Project name:** `Sentri Production` (or `Sentri` if short names preferred)
   - **Organization:** Your company if applicable, otherwise "No organization"
5. Click "Create"
6. Wait 30 seconds for project creation
7. Select the new project from the dropdown

**Save this:** Project ID (shown on dashboard, looks like `sentri-production-123456`)

---

## Step 2: Enable Required APIs

In Google Cloud Console, go to **APIs & Services > Library** and enable these:

| API | Search Term | Purpose |
|-----|-------------|---------|
| Google My Business API | "my business" | Read reviews |
| My Business Account Management API | "business account" | List locations |
| My Business Business Information API | "business information" | Get business details |

For each:
1. Search for the API
2. Click on it
3. Click "Enable"

**Note:** Google Business Profile API is the newer name. Enable all related APIs to be safe.

---

## Step 3: Configure OAuth Consent Screen

Go to **APIs & Services > OAuth consent screen**

### 3a. User Type
Select: **External** (allows any Google user to authorize)

### 3b. App Information

| Field | Value |
|-------|-------|
| App name | `Sentri` |
| User support email | `support@[your-domain].com` |
| App logo | Upload Sentri logo (512x512 PNG) — can skip for now |

### 3c. App Domain

| Field | Value |
|-------|-------|
| Application home page | `https://sentri.app` (or your production URL) |
| Application privacy policy link | `https://sentri.app/privacy` |
| Application terms of service link | `https://sentri.app/terms` |

**BLOCKER:** You need live URLs. The privacy policy and terms must be publicly accessible before Google will approve. Deploy these first.

### 3d. Authorized Domains

Add your domain without `https://`:
```
sentri.app
```

### 3e. Developer Contact Information

| Field | Value |
|-------|-------|
| Email addresses | Your email (dan@...) |

### 3f. Scopes

Click "Add or Remove Scopes" and add:

| Scope | Purpose |
|-------|---------|
| `https://www.googleapis.com/auth/business.manage` | Full access to manage business (includes reviews) |

**Why this scope:** This is the broad scope that includes review reading and responding. Narrower scopes exist but are less documented.

### 3g. Test Users

While in "Testing" mode, only these users can authorize:
1. Click "Add Users"
2. Add your email and any test dealer emails

**Important:** In testing mode, token refresh may be unreliable. Push to production/verification for real use.

---

## Step 4: Create OAuth Credentials

Go to **APIs & Services > Credentials**

1. Click "Create Credentials" > "OAuth client ID"
2. Select:
   - **Application type:** Web application
   - **Name:** `Sentri Web Client`

3. Add Authorized JavaScript origins:
   ```
   https://sentri.app
   http://localhost:5173  (for development)
   ```

4. Add Authorized redirect URIs:
   ```
   https://sentri.app/api/auth/google/callback
   http://localhost:3000/api/auth/google/callback  (for development)
   ```

5. Click "Create"

**Save these immediately:**
- **Client ID:** `xxxx.apps.googleusercontent.com`
- **Client secret:** `GOCSPX-xxxx`

These go in your environment variables:
```env
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
```

---

## Step 5: Submit for Verification

While in testing mode, your app:
- Only works for listed test users
- Shows scary "unverified app" warning
- May have token refresh issues

To go to production, you need Google's verification.

### 5a. Prepare Verification Materials

Google requires:

| Requirement | What to Prepare |
|-------------|-----------------|
| Privacy Policy | Live URL (we drafted `docs/PRIVACY-POLICY.md` — deploy it) |
| Terms of Service | Live URL (we drafted `docs/TERMS-OF-SERVICE.md` — deploy it) |
| YouTube video | Record 1-2 min demo showing OAuth flow and how you use the data |
| Written justification | Explain why you need the `business.manage` scope |

### 5b. Write the Justification

Here's a template:

```
Sentri is a review management platform for automotive dealerships.

We request the business.manage scope to:
1. Retrieve customer reviews from the dealer's Google Business Profile
2. Post dealer-approved responses to those reviews

The flow works as follows:
1. Dealer logs into Sentri with their own account
2. Dealer clicks "Connect Google" and authorizes access to their business
3. Sentri fetches reviews and generates AI draft responses
4. Dealer reviews, edits, and approves each response
5. Sentri posts the approved response to Google

We do not access reviews for businesses the user doesn't own.
We do not store or share review data beyond providing this service.
All data handling is described in our Privacy Policy.
```

### 5c. Record Demo Video

Record your screen showing:
1. A dealer logging into Sentri
2. Clicking "Connect Google"
3. The OAuth consent screen appearing
4. After authorization, reviews appearing in Sentri
5. Approving a response
6. The response being posted

Upload to YouTube (unlisted is fine) and provide the link.

### 5d. Submit

1. Go to **OAuth consent screen**
2. Click "Publish App" (moves from Testing to In Production)
3. Click "Prepare for Verification"
4. Fill in the form with your materials
5. Submit

---

## Step 6: Wait for Google Review

| Review Type | Timeline | Probability |
|-------------|----------|-------------|
| Standard review | 1-2 weeks | 80% |
| Extended review (if questions) | 2-4 weeks | 15% |
| Rejection (resubmit needed) | 3-6 weeks total | 5% |

**Common rejection reasons:**
- Privacy policy doesn't mention the specific scopes/data accessed
- Demo video doesn't clearly show the OAuth flow
- Scope is too broad for stated purpose

If rejected, you'll get an email with specific feedback. Fix and resubmit.

---

## What Engineering Needs from You

Once you complete steps 1-4, provide these environment variables:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_REDIRECT_URI=https://sentri.app/api/auth/google/callback
```

We can then implement:
1. OAuth flow (authorization URL, token exchange)
2. Review sync service
3. Response posting service

---

## Parallel Work

While you do this, engineering is building:

| Already Done | In Progress | Waiting on OAuth |
|--------------|-------------|------------------|
| Token encryption | CI/CD pipeline | Review sync service |
| Platform service | Test infrastructure | Response posting |
| Database schema | Onboarding UI | Google callback handler |

We're not blocked. When you hand over the credentials, we wire it up.

---

## Action Items for Dan

| Action | Deadline | Notes |
|--------|----------|-------|
| Create Google Cloud project | Today | 5 minutes |
| Enable APIs | Today | 2 minutes |
| Deploy Privacy Policy to production URL | This week | Needed for OAuth consent screen |
| Deploy Terms of Service to production URL | This week | Needed for OAuth consent screen |
| Configure OAuth consent screen | This week | Once legal docs are live |
| Create OAuth credentials | This week | Get credentials to engineering |
| Record demo video | Before verification | ~5 min recording |
| Submit for verification | This week | Then we wait |

---

## Questions?

If you hit a snag:
1. Screenshot the error/screen
2. Describe what you were trying to do
3. Send to engineering

Common issues:
- "Scope not allowed" — API not enabled, go back to Step 2
- "Redirect URI mismatch" — Typo in redirect URI, check Step 4
- "Access blocked: App not verified" — Expected in testing mode, add yourself as test user

---

*Last updated: December 2025*
