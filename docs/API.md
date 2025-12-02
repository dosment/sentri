# Sentri API Specification

## Base URL

```
Production: https://api.sentri.io/v1
Development: http://localhost:3000/v1
```

## Authentication

All endpoints (except auth) require Bearer token:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "dealer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "dealer": {
    "id": "uuid",
    "email": "dealer@example.com",
    "name": "ABC Motors",
    "plan": "professional"
  }
}
```

#### POST /auth/logout
Invalidate current session.

#### GET /auth/me
Get current authenticated dealer.

---

### Platforms

#### GET /platforms
List all connected platforms.

**Response:**
```json
{
  "data": [
    {
      "platform": "google",
      "isActive": true,
      "accountName": "ABC Motors - Main Location",
      "lastSyncAt": "2024-12-02T10:30:00Z"
    }
  ]
}
```

#### GET /platforms/:platform/auth-url
Get OAuth URL for connecting a platform.

**Response:**
```json
{
  "url": "https://accounts.google.com/oauth/..."
}
```

#### DELETE /platforms/:platform
Disconnect a platform.

---

### Reviews

#### GET /reviews
List reviews with pagination and filters.

**Query Parameters:**
- `status` — Filter by status (new, pending_response, responded, ignored)
- `platform` — Filter by platform (google, facebook, dealerrater, yelp)
- `rating` — Filter by rating (1-5)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "platform": "google",
      "platformReviewId": "abc123",
      "reviewerName": "John Smith",
      "rating": 5,
      "reviewText": "Great service!",
      "reviewDate": "2024-12-01T10:30:00Z",
      "status": "new",
      "response": {
        "id": "uuid",
        "generatedText": "Thank you, John!...",
        "finalText": null,
        "status": "draft"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasMore": true
  }
}
```

#### GET /reviews/:id
Get single review with response.

#### PATCH /reviews/:id
Update review status.

**Request:**
```json
{
  "status": "ignored"
}
```

---

### Responses

#### GET /responses/:id
Get single response.

#### PATCH /responses/:id
Edit response text.

**Request:**
```json
{
  "finalText": "Updated response text here..."
}
```

#### POST /responses/:id/approve
Approve a response for posting.

**Response:**
```json
{
  "success": true,
  "response": {
    "id": "uuid",
    "status": "approved",
    "approvedBy": "dealer@example.com",
    "approvedAt": "2024-12-02T14:00:00Z"
  }
}
```

#### POST /responses/:id/post
Force post an approved response.

#### POST /responses/:id/regenerate
Regenerate AI response.

---

### Analytics

#### GET /analytics/overview
Dashboard statistics.

**Response:**
```json
{
  "totalReviews": 150,
  "respondedReviews": 142,
  "responseRate": 94.7,
  "averageRating": 4.6,
  "reviewsByPlatform": {
    "google": 80,
    "facebook": 45,
    "dealerrater": 25
  },
  "ratingDistribution": {
    "5": 95,
    "4": 30,
    "3": 15,
    "2": 5,
    "1": 5
  }
}
```

#### GET /analytics/response-rate
Response rate over time.

**Query Parameters:**
- `period` — Time period (7d, 30d, 90d, 1y)

#### GET /analytics/ratings
Rating trends over time.

---

### Settings

#### GET /settings
Get dealer settings.

#### PATCH /settings
Update dealer settings.

**Request:**
```json
{
  "autoApproveThreshold": 4,
  "notifyEmail": true,
  "notifySms": false
}
```

#### PATCH /settings/voice
Update voice profile.

**Request:**
```json
{
  "voiceProfile": {
    "tone": "professional",
    "signOff": "- The ABC Motors Team",
    "specialInstructions": "Always mention our free car wash"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing token |
| FORBIDDEN | 403 | Not allowed to access resource |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limits

- General API: 100 requests per 15 minutes
- Auth endpoints: 10 requests per hour

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701532800
```

---

## Webhooks

### POST /webhooks/stripe
Stripe payment webhooks. Requires signature verification.
