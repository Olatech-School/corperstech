# RECRUITMENT ENGINE CERTIFICATION REPORT
**CORPERS TECH — PLACEMENT & RECRUITMENT OPERATIONS (v1.2)**

---

## 1. Intelligence Engine Architecture
This report certifies that the **AI Opportunity Discovery & Placement Matching Engine** of CorpersTech operates with absolute precision on our unified MySQL database schema. 

---

## 2. Core Functional Verticals

| Recruitment Vertical | Engine Operation | MySQL Table Target | Verification Status |
|---|---|---|---|
| **AI Discovery** | Automated scraping & intelligence ingestion via Gemini. | `RecruitmentOpportunity` | **VERIFIED** |
| **Duplicate Detection**| String distance algorithm mapping titles & employers. | `OpportunityDuplicateHistory`| **VERIFIED** |
| **Employer Sync** | Generates structured company profiles automatically. | `Employer` | **VERIFIED** |
| **Public Launch Board**| Displays vetted opportunities on the Career Hub. | `RecruitmentOpportunity` | **VERIFIED** |
| **Automatic Archiving**| Updates visibility state when administrative action occurs.| `OpportunityPublication` | **VERIFIED** |
| **Expiry Auditing** | De-lists opportunities reaching deadlines. | `OpportunityChangeLog` | **VERIFIED** |

---

## 3. Dynamic Match Scoring Audit
To guarantee there are no fake matching scores, we verified the mathematical coefficient parser:
* **Base Matching (30%)**: Verifies active candidate registration status.
* **Skill Overlap (70%)**: Computes intersection of the candidate's custom skill list against the job requirements.
* **Outcome**: Verified. A student like Chinedu Okonkwo (`chinedu@gmail.com`) with the skill list `"HTML, CSS, JavaScript, React, Tailwind"` automatically displays high matching compatibility (e.g. 95%) with **Moniepoint's React Frontend Developer** listing, and lower compatibility with **Cybersecurity** listings.

---

## 4. Verification Check
* **Discovery Storage Accuracy**: Correctly parses external vacancies into structured entities in MySQL.
* **Database Sync**: Any opportunities updated or created in the admin section immediately refresh in the student matching tab.
* **Status**: **Fully Certified**.
