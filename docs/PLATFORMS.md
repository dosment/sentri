# Platform Integrations

## Overview

Sentri integrates with multiple review platforms to provide unified reputation management for automotive dealerships.

## Platform Priority

| Phase | Platform | API Type | Read Reviews | Post Response | Status |
|-------|----------|----------|--------------|---------------|--------|
| MVP | Google Business Profile | Official OAuth | Yes | Yes | Planned |
| MVP | Facebook | Graph API | Yes | Yes | Planned |
| Phase 2 | DealerRater | Official REST | Yes | Yes | Planned |
| Phase 2 | Cars.com | Via DealerRater | Yes | Yes | Planned |
| Phase 2 | Yelp | Partner REST | Yes | Yes | Planned |
| Phase 3 | CarGurus | Dealer API | Yes | Limited | Planned |
| Phase 3 | Edmunds | Manual/Partnership | TBD | TBD | Research |

## Google Business Profile

### API Documentation
- https://developers.google.com/my-business/content/review-data

### Capabilities
- List all reviews for a location
- Get individual review details
- Reply to reviews
- Delete replies
- Batch operations for multi-location

### Authentication
- OAuth 2.0
- Scopes: `https://www.googleapis.com/auth/business.manage`
- Requires verified Google Business Profile

### Rate Limits
- Standard Google API quotas apply

## Facebook

### API Documentation
- https://developers.facebook.com/docs/graph-api

### Capabilities
- Read recommendations (replaced star ratings)
- Reply via comments on recommendations
- Page-level access

### Authentication
- OAuth 2.0
- Requires Page Access Token
- Must be page admin

### Notes
- Facebook uses recommendations (recommend/don't recommend) instead of star ratings
- Ratings endpoint removed after Graph API v3.2

## DealerRater / Cars.com

### API Documentation
- https://developers.dealerrater.com/

### Capabilities
- Fetch reviews
- Add/update/delete responses
- Access via Certified Dealer Program

### Authentication
- API token
- HTTPS required
- Host: services.dealerrater.com

### Notes
- Cars.com acquired DealerRater in 2016
- Same API serves both platforms
- 97% of customers read dealership responses

## Yelp

### API Documentation
- https://docs.developer.yelp.com/docs/respond-to-reviews-api-v2

### Capabilities
- Read reviews via Fusion API
- Respond via R2R (Respond to Reviews) API

### Authentication
- Partner API access required
- Business user access token

### Endpoint
- POST https://partner-api.yelp.com/reviews/v1/{review_id}

## CarGurus

### API Documentation
- https://www.cargurus.com/Cars/developers/docs/DealerReviews.html

### Capabilities
- Retrieve dealer reviews
- Limited response capabilities

### Notes
- Reviews primarily for internal dealer use
- Max 160 characters for sharing
- Contact: support@cargurus.com
