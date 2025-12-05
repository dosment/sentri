# Database Pre-Live Checklist

**Owner:** Martin Kleppmann
**Last Updated:** December 4, 2025

---

> "Data outlives code. What you put in your database today, you'll be reading for years."

---

## Summary

| Category | Items | Complete | Issues |
|----------|-------|----------|--------|
| Schema Design | 8 | 7 | 1 |
| Indexes | 5 | 4 | 1 |
| Data Integrity | 6 | 5 | 1 |
| Backup & Recovery | 5 | 0 | 5 |
| Performance | 5 | 2 | 3 |

---

## 1. Schema Design

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1.1 | All required tables exist | [x] | P0 | Dealer, Review, Response, PlatformConnection |
| 1.2 | Primary keys are UUIDs | [x] | P0 | `@id @default(uuid())` |
| 1.3 | Foreign key relations defined | [x] | P0 | With `onDelete: Cascade` |
| 1.4 | Unique constraints applied | [x] | P0 | Email, platformReviewId |
| 1.5 | Enums used for fixed values | [x] | P0 | Plan, Platform, Status |
| 1.6 | Timestamps on all tables | [x] | P0 | createdAt, updatedAt |
| 1.7 | Nullable fields explicit | [x] | P0 | `?` where appropriate |
| 1.8 | String length limits defined | [ ] | P1 | Not on all fields |

### Schema Location
```
server/prisma/schema.prisma
```

### Tables Checklist

| Table | Status | Indexes | Relations |
|-------|--------|---------|-----------|
| Dealer | [x] | email (unique) | → Reviews, Responses, Connections |
| Review | [x] | dealerId+status, platform+platformReviewId | → Dealer, Response |
| Response | [x] | reviewId (unique) | → Review, Dealer |
| PlatformConnection | [x] | dealerId+platform (unique) | → Dealer |

---

## 2. Indexes

| # | Index | Table | Status | Purpose |
|---|-------|-------|--------|---------|
| 2.1 | `email` (unique) | Dealer | [x] | Login lookup |
| 2.2 | `dealerId, status` | Review | [x] | Dashboard queries |
| 2.3 | `platform, platformReviewId` (unique) | Review | [x] | Deduplication |
| 2.4 | `dealerId, platform` (unique) | PlatformConnection | [x] | One connection per platform |
| 2.5 | `createdAt` | Review | [ ] | Sorting by date |

### Verify Indexes

```sql
-- Connect to database
psql $DATABASE_URL

-- List all indexes
\di

-- Check index on reviews
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Review';
```

### Index Recommendations

```prisma
// Add to Review model if not present:
@@index([dealerId, status])
@@index([createdAt])

// Add to Response model:
@@index([dealerId, status])
```

---

## 3. Data Integrity

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1 | Cascade deletes configured | [x] | P0 | Dealer deletion cleans up |
| 3.2 | No orphan records possible | [x] | P0 | FK constraints |
| 3.3 | Required fields enforced | [x] | P0 | NOT NULL where needed |
| 3.4 | Enum values validated | [x] | P0 | Prisma enforces |
| 3.5 | Timestamps auto-managed | [x] | P0 | @default(now()), @updatedAt |
| 3.6 | Transactions for multi-write | [~] | P1 | Used but no retry logic |

### Cascade Delete Verification

```sql
-- Test cascade delete (in development only!)
-- Create test dealer, add reviews, delete dealer
-- Verify reviews are deleted

BEGIN;
-- Insert test data
INSERT INTO "Dealer" (id, email, name, ...) VALUES (...);
INSERT INTO "Review" (id, "dealerId", ...) VALUES (...);

-- Delete dealer
DELETE FROM "Dealer" WHERE id = '<test-id>';

-- Verify reviews deleted
SELECT * FROM "Review" WHERE "dealerId" = '<test-id>';
-- Should return 0 rows

ROLLBACK;  -- Don't actually commit
```

---

## 4. Backup & Recovery

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | Automated backups enabled | [ ] | P0 | Railway provides this |
| 4.2 | Backup frequency documented | [ ] | P0 | Daily minimum |
| 4.3 | Backup retention period | [ ] | P1 | 7-30 days |
| 4.4 | Restore procedure documented | [ ] | P0 | Step-by-step |
| 4.5 | Restore tested | [ ] | P0 | At least once |

### Backup Strategy

```
For Railway PostgreSQL:

1. Enable automated backups in Railway dashboard
2. Set retention to 7 days minimum
3. Document restore procedure:
   a. Access Railway dashboard
   b. Navigate to database service
   c. Select backup point
   d. Click restore
   e. Verify data integrity
4. Test restore in staging environment
```

### Manual Backup Command

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore backup
psql $DATABASE_URL < backup_20251204.sql
```

---

## 5. Performance

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | Query execution time acceptable | [ ] | P1 | < 100ms p95 |
| 5.2 | Connection pooling configured | [ ] | P1 | Prisma defaults |
| 5.3 | No N+1 queries | [ ] | P1 | Review with includes |
| 5.4 | Pagination implemented | [x] | P0 | Limit/offset |
| 5.5 | Large result sets handled | [x] | P0 | Pagination |

### Query Performance Check

```sql
-- Enable query timing
\timing on

-- Test common queries
EXPLAIN ANALYZE
SELECT * FROM "Review"
WHERE "dealerId" = '<id>' AND status = 'NEW'
ORDER BY "createdAt" DESC
LIMIT 20;

-- Should use index, execution time < 10ms
```

### Connection Pool Configuration

```typescript
// In prisma client initialization
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Pool configuration is in connection string:
  // postgresql://...?connection_limit=5&pool_timeout=10
});
```

---

## 6. Migration Management

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 6.1 | All migrations in version control | [x] | P0 | prisma/migrations/ |
| 6.2 | Migrations are idempotent | [x] | P0 | Safe to re-run |
| 6.3 | Production migration strategy | [ ] | P0 | Document process |
| 6.4 | Rollback plan exists | [ ] | P1 | For failed migrations |

### Migration Commands

```bash
# Development - sync schema
npx prisma db push

# Production - apply migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Generate migration from schema changes
npx prisma migrate dev --name <migration-name>
```

### Production Migration Process

```
1. Test migration in staging first
2. Create database backup before migration
3. Run: npx prisma migrate deploy
4. Verify migration applied: npx prisma migrate status
5. Smoke test critical paths
6. If issues: restore from backup, fix migration
```

---

## 7. Security

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 7.1 | Database credentials not in code | [x] | P0 | In env vars |
| 7.2 | SSL connection required | [ ] | P0 | For production |
| 7.3 | Minimal user privileges | [ ] | P1 | App user != admin |
| 7.4 | OAuth tokens encrypted | [x] | P0 | AES-256-GCM |
| 7.5 | Passwords hashed | [x] | P0 | bcrypt |

### SSL Connection

```bash
# Verify SSL in connection string for production
# Should include: ?sslmode=require

DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

---

## 8. Data Model Verification

### Dealer Table

| Column | Type | Constraints | Status |
|--------|------|-------------|--------|
| id | uuid | PK, default uuid | [x] |
| email | string | unique, not null | [x] |
| passwordHash | string | nullable (OAuth users) | [x] |
| name | string | not null | [x] |
| phone | string | nullable | [x] |
| plan | enum | default STARTER | [x] |
| voiceProfile | json | nullable | [x] |
| autoApproveThreshold | int | default 4 | [x] |
| createdAt | datetime | default now | [x] |
| updatedAt | datetime | auto-update | [x] |

### Review Table

| Column | Type | Constraints | Status |
|--------|------|-------------|--------|
| id | uuid | PK | [x] |
| dealerId | uuid | FK, not null | [x] |
| platform | enum | not null | [x] |
| platformReviewId | string | not null | [x] |
| reviewerName | string | not null | [x] |
| rating | int | nullable (FB uses recommendations) | [x] |
| reviewText | string | not null | [x] |
| reviewDate | datetime | not null | [x] |
| status | enum | default NEW | [x] |
| createdAt | datetime | default now | [x] |

### Response Table

| Column | Type | Constraints | Status |
|--------|------|-------------|--------|
| id | uuid | PK | [x] |
| reviewId | uuid | FK, unique | [x] |
| dealerId | uuid | FK | [x] |
| generatedText | string | not null | [x] |
| finalText | string | nullable | [x] |
| status | enum | default DRAFT | [x] |
| approvedBy | string | nullable | [x] |
| approvedAt | datetime | nullable | [x] |
| postedAt | datetime | nullable | [x] |
| postError | string | nullable | [x] |
| createdAt | datetime | default now | [x] |

---

## Pre-Deployment Checklist

Execute before production deployment:

- [ ] Schema matches production database
- [ ] All migrations applied
- [ ] Indexes verified
- [ ] Backup enabled and tested
- [ ] Connection string uses SSL
- [ ] Seed data NOT applied to production

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Schema correct | Martin Kleppmann | [ ] |
| Indexes optimized | Martin Kleppmann | [ ] |
| Backup strategy in place | Martin Kleppmann | [ ] |
| Performance acceptable | Martin Kleppmann | [ ] |
| Security verified | Martin Kleppmann | [ ] |

**Database Approval:** [ ] Approved / [ ] Rejected

---

*"The most important decision you make about your database is what not to store."*
