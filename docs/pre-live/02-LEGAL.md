# Legal & Privacy Pre-Live Checklist

**Owner:** Max Schrems
**Last Updated:** December 4, 2025

---

> "Privacy is not about having something to hide. It's about having control over your own information."

---

## Summary

| Category | Items | Complete | Blocked |
|----------|-------|----------|---------|
| Privacy Documentation | 6 | 4 | 2 |
| Terms & Conditions | 4 | 2 | 2 |
| Data Processing | 5 | 3 | 0 |
| Regulatory Compliance | 6 | 2 | 0 |
| Third-Party Agreements | 3 | 1 | 0 |

---

## 1. Privacy Documentation

| # | Item | Status | Priority | Location |
|---|------|--------|----------|----------|
| 1.1 | Privacy Policy drafted | [x] | P0 | `docs/PRIVACY-POLICY.md` |
| 1.2 | Privacy Policy reviewed for completeness | [x] | P0 | Covers all data types |
| 1.3 | Privacy Policy deployed to live URL | [BLOCKED] | P0 | Needs company details |
| 1.4 | Legitimate Interest Assessment | [x] | P0 | `docs/LEGITIMATE-INTEREST-ASSESSMENT.md` |
| 1.5 | Data retention periods defined | [x] | P0 | In Privacy Policy Section 6 |
| 1.6 | Cookie policy (if applicable) | [ ] | P1 | Need to verify cookie usage |

### Privacy Policy Must Include:
- [x] Identity of data controller (company name, address)
- [x] Types of personal data collected
- [x] Purpose of processing
- [x] Legal basis for processing (contract, legitimate interest)
- [x] Data retention periods
- [x] Third-party transfers (Gemini AI, hosting)
- [x] Data subject rights (access, deletion, portability)
- [x] Contact information for privacy requests

---

## 2. Terms of Service

| # | Item | Status | Priority | Location |
|---|------|--------|----------|----------|
| 2.1 | Terms of Service drafted | [x] | P0 | `docs/TERMS-OF-SERVICE.md` |
| 2.2 | Terms of Service reviewed | [x] | P0 | Covers key provisions |
| 2.3 | Terms of Service deployed to live URL | [BLOCKED] | P0 | Needs company details |
| 2.4 | Acceptable Use Policy included | [x] | P0 | Within ToS |

### Terms Must Include:
- [x] Service description
- [x] User obligations
- [x] Prohibited uses
- [x] Intellectual property rights
- [x] Limitation of liability
- [x] Termination provisions
- [x] Governing law and jurisdiction
- [ ] Dispute resolution mechanism

---

## 3. Data Processing

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 3.1 | Data inventory documented | [x] | P0 | In LIA document |
| 3.2 | Legal basis for each data type | [x] | P0 | Contract + Legitimate Interest |
| 3.3 | Data flow diagram | [ ] | P1 | Shows data movement through system |
| 3.4 | Data Processing Agreement template (B2B) | [ ] | P1 | For enterprise customers |
| 3.5 | Sub-processor list | [x] | P0 | Google Cloud, Railway |

### Data Inventory

| Data Type | Source | Legal Basis | Retention | Risk Level |
|-----------|--------|-------------|-----------|------------|
| Dealer email | Registration | Contract | Account lifetime | Low |
| Dealer password (hashed) | Registration | Contract | Account lifetime | Low |
| Review text | Google/Facebook | Legitimate Interest | 2 years | Medium |
| Reviewer name | Google/Facebook | Legitimate Interest | 2 years | Medium |
| AI-generated responses | Internal | Contract | 2 years | Low |
| OAuth tokens | Google OAuth | Contract | Until revoked | High |

---

## 4. Regulatory Compliance

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 4.1 | GDPR compliance assessment | [x] | P0 | LIA covers this |
| 4.2 | CCPA disclosures | [x] | P0 | "Do Not Sell" in Privacy Policy |
| 4.3 | Data Subject Access Request (DSAR) process | [ ] | P1 | Manual for now |
| 4.4 | Right to deletion process | [ ] | P1 | Manual for now |
| 4.5 | Breach notification procedure | [ ] | P1 | 72-hour GDPR requirement |
| 4.6 | Data Protection Impact Assessment (DPIA) | [ ] | P2 | For AI processing |

### GDPR Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Lawful basis documented | [x] | Contract + Legitimate Interest |
| Data minimization | [x] | Only collect necessary data |
| Purpose limitation | [x] | Only for review management |
| Storage limitation | [x] | Retention periods defined |
| Integrity and confidentiality | [x] | Encryption, access controls |
| Accountability | [~] | Documentation in progress |

### CCPA Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Notice at collection | [x] | In Privacy Policy |
| Right to know | [ ] | Process needed |
| Right to delete | [ ] | Process needed |
| Right to opt-out of sale | [x] | We don't sell data |
| Non-discrimination | [x] | Same service for all |

---

## 5. Third-Party Agreements

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 5.1 | Google Cloud/AI DPA reviewed | [x] | P0 | Standard terms cover Gemini |
| 5.2 | Railway DPA reviewed | [ ] | P1 | Hosting provider |
| 5.3 | Standard Contractual Clauses (SCCs) | [ ] | P2 | For EU-US data transfers |

---

## 6. Application Compliance Features

| # | Item | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 6.1 | Privacy Policy link in footer | [ ] | P0 | On all pages |
| 6.2 | Terms of Service link in footer | [ ] | P0 | On all pages |
| 6.3 | Consent checkbox at registration | [ ] | P0 | "I agree to ToS and Privacy Policy" |
| 6.4 | Cookie consent banner (if needed) | [ ] | P1 | Check cookie usage first |
| 6.5 | Account deletion option | [ ] | P1 | Self-service or contact support |
| 6.6 | Data export option | [ ] | P2 | For data portability |

---

## 7. Pre-Launch Blockers

### BLOCKING: Company Details Required

The following placeholders must be filled before legal docs can be deployed:

```
[INSERT COMPANY LEGAL NAME]
[INSERT COMPANY ADDRESS]
[INSERT COMPANY REGISTRATION NUMBER]
[INSERT DPO EMAIL ADDRESS]
[INSERT SUPPORT EMAIL ADDRESS]
[INSERT EFFECTIVE DATE]
```

**Owner:** Dan (CEO)
**Dependency:** Company formation

### Deployment Checklist

Once company details are available:

1. [ ] Fill in all `[INSERT...]` placeholders in Privacy Policy
2. [ ] Fill in all `[INSERT...]` placeholders in Terms of Service
3. [ ] Deploy Privacy Policy to `https://sentri.app/privacy`
4. [ ] Deploy Terms of Service to `https://sentri.app/terms`
5. [ ] Add footer links in application
6. [ ] Add consent checkbox to registration
7. [ ] Test all links work correctly

---

## 8. Reviewer Data Considerations

Reviewers are not our customers, but we process their data (name, review text).

### Legal Analysis

| Question | Answer | Mitigation |
|----------|--------|------------|
| Do we need reviewer consent? | No — public data, legitimate interest | LIA documented |
| Can reviewers request deletion? | Technically yes, but... | We only store copies of public reviews |
| What if a reviewer complains? | Direct them to the platform | We're not the data controller of reviews |

### Recommended Response Template

```
Thank you for contacting us about your review data.

Sentri processes publicly available reviews from [Google/Facebook] to help
businesses respond to customer feedback. We do not collect data directly
from reviewers.

If you wish to modify or delete your review, please contact [Google/Facebook]
directly, as they are the controller of that data.

For questions about our data practices, please review our Privacy Policy at
https://sentri.app/privacy.
```

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GDPR complaint from EU dealer | LOW | MEDIUM | LIA documented, DPA ready |
| CCPA request from CA dealer | MEDIUM | LOW | Manual process acceptable |
| Reviewer data complaint | LOW | LOW | Public data, redirect to platform |
| Data breach | LOW | HIGH | Encryption, access controls, incident plan |
| FTC enforcement (automotive) | LOW | HIGH | Clear disclosures, no deceptive practices |

---

## Sign-Off

| Check | Verified By | Date |
|-------|-------------|------|
| Privacy Policy complete | Max Schrems | [ ] |
| Terms of Service complete | Max Schrems | [ ] |
| GDPR compliance verified | Max Schrems | [ ] |
| CCPA compliance verified | Max Schrems | [ ] |
| Blockers communicated to Dan | Max Schrems | [x] |

**Legal Approval for Launch:** [ ] Approved / [ ] Rejected (blocked)

**Blocker Status:** Cannot approve until legal docs deployed to live URLs.

---

*"Compliance is not a checkbox. It's an ongoing commitment to respecting the people whose data we handle."*
