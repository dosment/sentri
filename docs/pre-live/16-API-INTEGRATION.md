# API Integration Pre-Live Checklist

**Owner:** Google API Specialist
**Last Updated:** December 4, 2025

---

> "APIs are contracts. Break the contract, break the integration."

---

## Summary

| Category | Items | Complete | Blocked |
|----------|-------|----------|---------|
| Google OAuth | 8 | 2 | 6 |
| Review Sync | 6 | 0 | 6 |
| Response Posting | 5 | 0 | 5 |
| Error Handling | 5 | 3 | 2 |

---

## 1. Google OAuth Implementation

### 1.1 OAuth Setup (Owner: Dan)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1.1 | Google Cloud project created | [ ] | Dan's responsibility |
| 1.1.2 | GBP APIs enabled | [ ] | See API list below |
| 1.1.3 | OAuth consent screen configured | [ ] | Needs live Privacy Policy |
| 1.1.4 | OAuth credentials created | [ ] | Client ID + Secret |
| 1.1.5 | Credentials provided to engineering | [ ] | Environment variables |
| 1.1.6 | Test user configured | [ ] | For development |
| 1.1.7 | Verification submitted | [ ] | 1-4 week wait |
| 1.1.8 | Verification approved | [ ] | External dependency |

### 1.2 Required APIs

| API | Purpose | Status |
|-----|---------|--------|
| My Business Account Management API | List accounts | [ ] |
| My Business Business Information API | Get locations | [ ] |
| My Business Reviews API | Read/reply reviews | [ ] |

### 1.3 OAuth Scope

```
https://www.googleapis.com/auth/business.manage
```

This scope provides full access to manage the business profile, including reviews.

---

## 2. Engineering Implementation

### 2.1 Backend Components

| # | Component | Status | Priority | Notes |
|---|-----------|--------|----------|-------|
| 2.1.1 | Token encryption (AES-256-GCM) | [x] | P0 | `crypto.ts` |
| 2.1.2 | Platform service interface | [x] | P0 | Scaffolded |
| 2.1.3 | OAuth callback handler | [ ] | P0 | Waiting on credentials |
| 2.1.4 | Token storage service | [ ] | P0 | Encrypt before save |
| 2.1.5 | Token refresh service | [ ] | P0 | Auto-refresh before expiry |
| 2.1.6 | Review sync service | [ ] | P0 | Fetch and store reviews |
| 2.1.7 | Response posting service | [ ] | P0 | Post replies to Google |

### 2.2 Database Schema

```prisma
model PlatformConnection {
  id                String    @id @default(uuid())
  dealerId          String
  platform          Platform
  platformAccountId String    // Google account ID
  locationId        String?   // Specific location ID
  accessToken       String    // Encrypted
  refreshToken      String?   // Encrypted
  tokenExpiresAt    DateTime?
  isActive          Boolean   @default(true)
  lastSyncAt        DateTime?
  createdAt         DateTime  @default(now())

  dealer            Dealer    @relation(...)
}
```

**Status:** [x] Schema ready

---

## 3. API Endpoint Specifications

### 3.1 Correct API Base URLs

```
✅ CORRECT (use these):
https://mybusinessaccountmanagement.googleapis.com/v1/
https://mybusinessbusinessinformation.googleapis.com/v1/
https://mybusiness.googleapis.com/v4/  (for reviews - still v4)

❌ DEPRECATED (avoid):
https://mybusiness.googleapis.com/v4/accounts/... (legacy monolith)
```

### 3.2 Key Endpoints

| Operation | Endpoint | Method |
|-----------|----------|--------|
| List accounts | `/accounts` | GET |
| List locations | `/accounts/{id}/locations` | GET |
| Get reviews | `/accounts/{id}/locations/{id}/reviews` | GET |
| Reply to review | `/accounts/{id}/locations/{id}/reviews/{id}/reply` | PUT |
| Delete reply | `/accounts/{id}/locations/{id}/reviews/{id}/reply` | DELETE |

### 3.3 Review Response Format

```json
{
  "reviews": [
    {
      "name": "accounts/.../locations/.../reviews/...",
      "reviewId": "abc123",
      "reviewer": {
        "displayName": "John Doe",
        "profilePhotoUrl": "https://..."
      },
      "starRating": "FIVE",
      "comment": "Great service!",
      "createTime": "2025-12-01T10:00:00Z",
      "updateTime": "2025-12-01T10:00:00Z",
      "reviewReply": {
        "comment": "Thank you!",
        "updateTime": "2025-12-02T10:00:00Z"
      }
    }
  ],
  "nextPageToken": "..."
}
```

---

## 4. Error Handling

### 4.1 HTTP Error Codes

| Code | Meaning | Action | Status |
|------|---------|--------|--------|
| 400 | Bad request | Log, fix request | [x] |
| 401 | Unauthorized | Attempt token refresh | [ ] |
| 403 | Forbidden | User lost access, mark inactive | [ ] |
| 404 | Not found | Resource deleted, update local | [x] |
| 429 | Rate limited | Exponential backoff | [x] |
| 500+ | Server error | Retry with backoff | [x] |

### 4.2 Token Refresh Logic

```typescript
async function ensureValidToken(connection: PlatformConnection) {
  // Check if token expires within 5 minutes
  if (connection.tokenExpiresAt < Date.now() + 300000) {
    // Refresh token
    const newTokens = await refreshGoogleToken(connection.refreshToken);

    // Encrypt and save
    await prisma.platformConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: encrypt(newTokens.accessToken),
        refreshToken: encrypt(newTokens.refreshToken),
        tokenExpiresAt: new Date(Date.now() + newTokens.expiresIn * 1000)
      }
    });
  }

  return decrypt(connection.accessToken);
}
```

### 4.3 Rate Limit Handling

```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '60';
      await sleep(parseInt(retryAfter) * 1000 * (i + 1)); // Exponential
      continue;
    }

    return response;
  }

  throw new Error('Rate limit exceeded after retries');
}
```

---

## 5. Pagination

### 5.1 Review Pagination

Google returns max 50 reviews per request. Must loop until `nextPageToken` is empty.

```typescript
async function fetchAllReviews(connection: PlatformConnection) {
  const reviews = [];
  let pageToken = undefined;

  do {
    const response = await fetchReviews(connection, pageToken);
    reviews.push(...response.reviews);
    pageToken = response.nextPageToken;
  } while (pageToken);

  return reviews;
}
```

**Status:** [ ] Not implemented (blocked on OAuth)

---

## 6. Sync Strategy

### 6.1 Initial Sync

On first connection:
1. Fetch all reviews (paginated)
2. Store in database
3. Mark reviews with existing replies as "responded"
4. Generate AI responses for new reviews

### 6.2 Incremental Sync

Every 15 minutes:
1. Fetch reviews since last sync
2. Upsert new reviews
3. Update changed reviews (edited, new reply)
4. Queue response generation for new reviews

### 6.3 Sync State

| Field | Purpose |
|-------|---------|
| `lastSyncAt` | When we last synced |
| `lastReviewTime` | Most recent review timestamp |
| `syncCursor` | For incremental sync |

---

## 7. Response Posting

### 7.1 Post Reply Flow

```typescript
async function postReply(response: Response) {
  const connection = await getConnection(response.dealerId);
  const token = await ensureValidToken(connection);

  const result = await fetch(
    `${BASE_URL}/accounts/.../locations/.../reviews/${response.review.platformReviewId}/reply`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: response.finalText || response.generatedText
      })
    }
  );

  if (result.ok) {
    await prisma.response.update({
      where: { id: response.id },
      data: { status: 'POSTED', postedAt: new Date() }
    });
  } else {
    await prisma.response.update({
      where: { id: response.id },
      data: { status: 'FAILED', postError: await result.text() }
    });
  }
}
```

---

## 8. Testing Strategy

### 8.1 Test Scenarios

| Scenario | Test Method | Status |
|----------|-------------|--------|
| OAuth flow complete | Manual end-to-end | [ ] |
| Token refresh works | Unit test | [ ] |
| Rate limit handled | Mock 429 response | [ ] |
| Pagination works | Mock multiple pages | [ ] |
| Reply posts successfully | Manual verification | [ ] |
| Reply fails gracefully | Mock error | [ ] |

### 8.2 Test Data

```json
// Mock review for testing
{
  "reviewId": "test-123",
  "reviewer": { "displayName": "Test User" },
  "starRating": "FIVE",
  "comment": "Test review for development",
  "createTime": "2025-12-01T00:00:00Z"
}
```

---

## 9. Pre-Launch API Checklist

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 9.1 | Google Cloud project | [ ] | Dan | |
| 9.2 | APIs enabled | [ ] | Dan | |
| 9.3 | OAuth credentials | [ ] | Dan | |
| 9.4 | Credentials in env vars | [ ] | Engineering | |
| 9.5 | OAuth callback handler | [ ] | Engineering | |
| 9.6 | Token encryption working | [x] | Engineering | |
| 9.7 | Review sync service | [ ] | Engineering | |
| 9.8 | Response posting service | [ ] | Engineering | |
| 9.9 | Error handling complete | [~] | Engineering | |
| 9.10 | End-to-end test passed | [ ] | QA | |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| OAuth setup complete | Google API Specialist | [ ] |
| Endpoints correct | Google API Specialist | [ ] |
| Error handling robust | Google API Specialist | [ ] |
| End-to-end tested | Google API Specialist | [ ] |

**API Integration Approval:** [ ] Approved / [ ] Rejected

**Blocking issues:**
- Google Cloud project not created
- OAuth credentials not available
- Cannot complete implementation without credentials

---

*"The best API integration is one the user never thinks about."*
