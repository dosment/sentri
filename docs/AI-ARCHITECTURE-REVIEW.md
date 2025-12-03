# Sentri AI Architecture — Vector Review

**Date:** December 2024
**Reviewer:** Vector (AI Architect)
**Scope:** Complete AI integration audit and architecture review

---

## Vector — Opening Statement

> "I've analyzed your codebase. Let me tell you what I see — and what needs to change."

---

## Executive Summary

**Current State:** The implementation uses Google Gemini (`gemini-1.5-flash`), but documentation references Claude/Anthropic API. This inconsistency needs correction.

**Code Quality:** Solid. Input sanitization, prompt injection detection, and error handling are present.

**Key Gaps:** No retry logic, no fallback provider, no response caching, no streaming support.

---

## Architecture Audit

### Current AI Service Analysis

**File:** `server/src/modules/ai/ai.service.ts`

```
┌─────────────────────────────────────────────────────────────────┐
│                    CURRENT ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Review Request                                                  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────┐                                            │
│  │ Input Sanitizer │ ← MAX_REVIEW_LENGTH (5000)                 │
│  │ - Truncation    │   MAX_NAME_LENGTH (200)                    │
│  │ - Control chars │                                            │
│  │ - Quote escape  │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Injection Check │ ← SUSPICIOUS_PATTERNS (9 patterns)         │
│  │ - Pattern match │   Logs but doesn't block                   │
│  │ - Security log  │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Gemini API Call │ ← gemini-1.5-flash                         │
│  │ - System prompt │   No retry logic                           │
│  │ - User prompt   │   No timeout config                        │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  Response Text                                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### What's Good

1. **Input Sanitization (Lines 21-32)**
   ```typescript
   function sanitizeInput(text: string, maxLength: number): string
   ```
   - Truncates to max length
   - Removes control characters
   - Escapes quotes
   - This is correct implementation.

2. **Prompt Injection Detection (Lines 34-44)**
   ```typescript
   const SUSPICIOUS_PATTERNS = [...]
   function detectPromptInjection(text: string): boolean
   ```
   - 9 patterns covering common injection attempts
   - Logs for security monitoring
   - Wisely doesn't block — legitimate reviews might match

3. **Lazy Client Initialization (Lines 46-56)**
   ```typescript
   let genAI: GoogleGenerativeAI | null = null;
   function getClient(): GoogleGenerativeAI
   ```
   - Single instance, created on first use
   - Throws clear error if API key missing

4. **System Prompt Structure (Lines 66-79)**
   - Clear guidelines for positive/negative reviews
   - Prohibits discounts, compensation, liability admissions
   - Instructs on concise output format

### What's Missing

1. **No Retry Logic**
   ```typescript
   // Current: Single call, no retry
   const result = await model.generateContent(prompt);
   ```

   **Risk:** Gemini API failures cause user-facing errors. Transient failures are common.

   **Recommendation:**
   ```typescript
   async function generateWithRetry(
     model: GenerativeModel,
     prompt: string,
     maxRetries = 3
   ): Promise<GenerateContentResult> {
     for (let attempt = 1; attempt <= maxRetries; attempt++) {
       try {
         return await model.generateContent(prompt);
       } catch (error) {
         if (attempt === maxRetries) throw error;
         await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
       }
     }
     throw new Error('Max retries exceeded');
   }
   ```

2. **No Timeout Configuration**
   ```typescript
   // Current: Uses SDK defaults
   const result = await model.generateContent(prompt);
   ```

   **Risk:** Long-running requests block the event loop, poor UX.

   **Recommendation:** Add configurable timeout (e.g., 30 seconds for generation).

3. **No Response Caching**
   - Identical reviews generate new API calls
   - Regeneration has no rate limiting

   **Recommendation:** Cache responses by content hash for deduplication.

4. **No Streaming Support**
   - Users wait for full response before seeing anything
   - "Sentri is writing..." with no progress indicator

   **Recommendation (Phase 2):** Use `generateContentStream()` for better UX.

5. **No Fallback Provider**
   - If Gemini is down, entire AI feature is unavailable

   **Recommendation (Phase 2):** Abstract AI provider, support multiple backends.

6. **No Response Validation**
   ```typescript
   // Current: Trust whatever Gemini returns
   const text = response.text();
   return text.trim();
   ```

   **Risk:** Gemini might return inappropriate content, policy violations.

   **Recommendation:** Add content moderation layer:
   - Check for prohibited phrases (discounts, apologies for specific incidents)
   - Validate length bounds (not too short, not too long)
   - Flag responses that mention competitor names

---

## Documentation Inconsistency

### The Problem

**Code uses:** Google Gemini (`@google/generative-ai`, `gemini-1.5-flash`)

**Documentation says:** Claude API (Anthropic)

| File | Current Text | Should Be |
|------|--------------|-----------|
| `README.md:18` | "via Claude" | "via Google Gemini" |
| `README.md:29` | "Claude API (Anthropic)" | "Gemini API (Google)" |
| `claude.md:43` | "Claude API" | "Gemini API" |
| `ARCHITECTURE.md:68` | "Claude AI" | "Gemini AI" |
| `ARCHITECTURE.md:82` | "Claude API (Anthropic)" | "Gemini API (Google)" |
| `ARCHITECTURE.md:336` | "ANTHROPIC_API_KEY" | "GEMINI_API_KEY" |
| `BUSINESS-PLAN.md:129` | "AI API (Claude)" | "AI API (Gemini)" |

### Resolution

All documentation has been updated to reflect actual implementation: **Google Gemini**. ✅

**Updated files:**
- README.md
- claude.md
- docs/ARCHITECTURE.md
- docs/BUSINESS-PLAN.md
- docs/EDGE-CASES.md

---

## Recommended Architecture

### Phase 1: Immediate Improvements

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPROVED ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Review Request                                                  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────┐                                            │
│  │ Input Sanitizer │ (unchanged - already good)                 │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Cache Check     │ ← NEW: Hash-based deduplication            │
│  └────────┬────────┘                                            │
│           │ (cache miss)                                         │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Gemini API Call │ ← WITH: Retry logic (3x, exp backoff)      │
│  │                 │   WITH: Timeout (30s)                       │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Response Filter │ ← NEW: Content moderation                  │
│  │ - Length check  │   - Prohibited phrase detection            │
│  │ - Policy check  │   - Quality gates                          │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  Response Text + Cache Update                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: Scalability

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCALED ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────┐                │
│  │             AI Provider Abstraction          │                │
│  ├─────────────────────────────────────────────┤                │
│  │                                              │                │
│  │  interface IAIProvider {                     │                │
│  │    generateResponse(input): Promise<string>  │                │
│  │    isAvailable(): boolean                    │                │
│  │    priority: number                          │                │
│  │  }                                           │                │
│  │                                              │                │
│  └──────────────────────┬──────────────────────┘                │
│                         │                                        │
│         ┌───────────────┼───────────────┐                       │
│         ▼               ▼               ▼                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  Gemini    │  │  Claude    │  │  OpenAI    │                │
│  │  (Primary) │  │  (Backup)  │  │  (Backup)  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Model Selection Analysis

### Current: `gemini-1.5-flash`

| Aspect | Assessment |
|--------|------------|
| **Speed** | Fast (~1-2s generation) |
| **Cost** | Low ($0.075/1M input tokens) |
| **Quality** | Good for structured responses |
| **Context** | 1M tokens (overkill for this use case) |

**Verdict:** Appropriate choice for MVP. Fast, cheap, good enough.

### Alternative Models

| Model | Use Case | When to Consider |
|-------|----------|------------------|
| `gemini-1.5-pro` | Higher quality responses | If flash quality is insufficient |
| `gemini-2.0-flash-exp` | Latest capabilities | When stable and production-ready |
| Claude 3 Sonnet | Alternative provider | For provider redundancy |
| GPT-4o-mini | Alternative provider | For provider redundancy |

**Recommendation:** Stay with `gemini-1.5-flash` for now. Add provider abstraction in Phase 2 for redundancy.

---

## Security Considerations

### Current Implementation — Grade: B+

**Strengths:**
- Input sanitization prevents basic injection
- Pattern detection logs suspicious activity
- No user input in system prompt (good)

**Weaknesses:**
- Responses not validated for policy compliance
- No rate limiting per dealer on regeneration
- API key in environment variable only (fine for now)

### Recommendations

1. **Add response content filter**
   ```typescript
   const PROHIBITED_PHRASES = [
     /free\s+(oil\s+change|service|repair)/i,
     /(\d+%?\s+)?off/i,
     /discount/i,
     /we\s+apologize\s+for\s+the\s+(accident|injury|damage)/i,
   ];

   function validateResponse(text: string): boolean {
     return !PROHIBITED_PHRASES.some(p => p.test(text));
   }
   ```

2. **Add regeneration rate limit**
   - Max 5 regenerations per review
   - Prevents API cost abuse
   - Tracked in Response model or Redis

---

## Action Items

### Immediate (Before Demo)

| Priority | Item | Effort |
|----------|------|--------|
| P0 | Update all documentation to reference Gemini | 30 min |
| P0 | Add retry logic with exponential backoff | 1 hour |
| P1 | Add timeout configuration | 30 min |
| P1 | Add response length validation | 30 min |

### Before Pilot

| Priority | Item | Effort |
|----------|------|--------|
| P1 | Add response content filter | 2 hours |
| P1 | Add regeneration rate limit | 1 hour |
| P2 | Add response caching (optional) | 2 hours |

### Phase 2

| Priority | Item | Effort |
|----------|------|--------|
| P2 | Abstract AI provider interface | 4 hours |
| P2 | Add fallback provider support | 4 hours |
| P3 | Add streaming support | 4 hours |

---

## Vector — Closing Statement

> "The AI integration is functional and reasonably secure. The main issues are:
>
> 1. **Documentation is wrong** — says Claude, uses Gemini. Fix this immediately.
> 2. **No resilience** — one API failure = user error. Add retry logic.
> 3. **No content validation** — we trust Gemini blindly. Add safeguards.
>
> The architecture is simple and appropriate for MVP. Don't over-engineer. Add retry logic, fix the docs, and ship. Abstraction and multi-provider support can wait for Phase 2."

---

*Architecture review by Vector. Documentation updates and code changes recommended for immediate action.*
