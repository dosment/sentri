# Legitimate Interest Assessment (LIA)

**Assessment Date:** [INSERT DATE]

**Assessor:** [INSERT NAME]

**Processing Activity:** Processing third-party review data to generate AI response drafts

---

## 1. Purpose

This assessment evaluates whether Sentri can rely on legitimate interest as a legal basis for processing personal data of reviewers (third parties who are not Sentri users) in connection with generating AI-powered response drafts for auto dealerships.

---

## 2. Data Processing Description

### What data is processed?
- Reviewer display names (as shown on Google)
- Review text content
- Star ratings
- Review timestamps

### Source of data
- Google Business Profile API
- Data is already publicly visible on Google

### Purpose of processing
- Generate AI draft responses for the dealership to review and approve
- Help dealerships respond to customer feedback efficiently

### Who processes the data?
- Sentri (primary processor)
- Google Gemini AI (sub-processor, for response generation)
- Railway (sub-processor, for hosting)

---

## 3. Three-Part Test

### Part A: Legitimate Interest Identification

**Whose interests are we considering?**

1. **Dealership's interests:**
   - Responding to customer reviews promptly and professionally
   - Maintaining business reputation
   - Efficient operations (AI reduces response drafting time)
   - Customer relationship management

2. **Sentri's interests:**
   - Providing the contracted service
   - Operating a viable business

**Are these interests legitimate?**

Yes. Responding to public business reviews is a recognized, lawful business activity. Google explicitly provides review response functionality. There is no indication these interests are unlawful or unethical.

**Assessment: PASS** — Legitimate interests identified.

---

### Part B: Necessity Test

**Is the processing necessary to achieve the purpose?**

| Question                                                    | Answer                                                                                                           |
|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| Can the purpose be achieved without processing this data?   | No. To generate a response to a review, we must process the review content.                                     |
| Are we processing more data than needed?                    | No. We process only the review data visible on Google — name, text, rating.                                     |
| Could we achieve the same result with less data?            | No. The review text is essential for generating a relevant response.                                             |
| Is there a less intrusive alternative?                      | No. The dealership could respond manually, but that's not less intrusive — they'd still read the same data.     |

**Assessment: PASS** — Processing is necessary and proportionate.

---

### Part C: Balancing Test

**Interests of the data subject (reviewer):**
- Privacy in their personal data
- Control over how their data is used
- Not being subject to unexpected processing

**Factors that REDUCE impact on reviewer:**

| Factor                                         | Analysis                                                                                                                   |
|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Data is already public                         | The reviewer chose to post publicly on Google. There is no reasonable expectation of privacy in public reviews.           |
| Processing is closely related to original context | The reviewer posted a review expecting a response from the business. Generating a response is the natural, expected use of review data. |
| No sensitive data                              | Reviews typically contain opinions, not special category data (health, politics, etc.).                                   |
| No decision-making about the reviewer          | We are not making decisions that affect the reviewer. We're helping the business respond.                                 |
| Reviewer retains control                       | The reviewer can delete or edit their review on Google at any time.                                                       |
| No profiling                                   | We do not build profiles of reviewers or track them across platforms.                                                     |
| Data minimization                              | We process only what's publicly visible; we don't enrich with additional data.                                            |

**Factors that INCREASE impact on reviewer:**

| Factor                                    | Analysis                                                                                                         | Mitigation                                                                                    |
|-------------------------------------------|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Reviewer didn't consent to AI processing  | True, but consent is not required when relying on legitimate interest. The processing is proportionate and expected. | Disclosed in Privacy Policy.                                                              |
| Data sent to third-party AI               | Review text is sent to Google Gemini.                                                                            | Google is already the platform where reviews are posted. Data stays within Google ecosystem. |

**Balancing conclusion:**

The dealership's legitimate interest in responding to public reviews outweighs the minimal privacy impact on reviewers because:

1. Reviews are voluntarily made public by the reviewer
2. Responses are the expected outcome of posting a review
3. Processing is limited to what's necessary
4. No adverse decisions are made about reviewers
5. Reviewers retain full control via Google

**Assessment: PASS** — Interests are balanced in favor of processing.

---

## 4. Safeguards

To further protect reviewer interests, Sentri implements:

| Safeguard          | Description                                                                                           |
|--------------------|-------------------------------------------------------------------------------------------------------|
| Transparency       | Privacy Policy discloses AI processing of review data                                                 |
| Data minimization  | Only necessary review fields are processed                                                            |
| Security           | Data encrypted in transit and at rest                                                                 |
| Limited retention  | Review data synced from Google, not stored independently long-term                                    |
| Human oversight    | All AI responses require dealer approval before posting                                               |
| No secondary use   | Review data is not used for marketing, analytics, or any purpose beyond response generation           |

---

## 5. Conclusion

**Can Sentri rely on legitimate interest for this processing?**

**YES.**

The three-part test is satisfied:
- Legitimate interests are identified (dealership reputation management)
- Processing is necessary (cannot generate responses without review data)
- Balancing favors the dealership (data is public, use is expected, impact is minimal)

This assessment should be reviewed:
- Annually
- When processing activities change
- If complaints are received regarding this processing

---

## 6. Approval

| Role                  | Name  | Date  | Signature  |
|-----------------------|-------|-------|------------|
| Data Protection Lead  |       |       |            |
| Legal Counsel         |       |       |            |

---

*This assessment is for internal documentation. It demonstrates compliance with accountability principles but does not guarantee regulatory approval.*
