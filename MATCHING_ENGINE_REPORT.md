# PLACEMENT MATCHING ENGINE REPORT — CORPERS TECH (v1.1)

This report outlines the implementation of the **AI Opportunity Matching Engine** (Module 2) for CorpersTech.

---

## 1. Engine Core Logic
The matching engine acts as an automated bridge correlating active, published placement opportunities with a corps member's live credentials profile:
* **Algorithmic Coefficients**:
  * **Base Registration**: 30% baseline.
  * **Technical Skill Overlap**: Calculated dynamically by dividing matched technical skills by the total requested skills (70% weight).
  * **Educational Alignment Check**: Cross-references the corps member's course stream (e.g. Web Development) with the role's primary category (e.g. Entry-Level Jobs, Internships) and required skill clusters.

---

## 2. Real-Time Gap Analysis
Rather than simply returning a numeric percentage, the engine generates an interactive developmental blueprint for every placement card:
1. **Met Skills**: Highlighting skills already listed on the member's profile that satisfy the job requirements.
2. **Missing Skills Gap**: Identifying necessary technical proficiencies that are absent from the member's profile.
3. **Adaptive Advice**: An inline advisory message suggesting specific Olatech modules or personal projects (e.g., adding a React/Tailwind project if applying for Moniepoint) to help the member acquire the missing skills.

---

## 3. Verified Opportunities Seed Database
To ensure immediate usability upon a database reset or fresh environment start, the matching engine automatically seeds a premium, highly realistic registry of verified opportunities on first access:
* **Moniepoint Nigeria**: Junior Frontend Developer (₦220,000 / month) • Hybrid
* **Sterling Bank**: Data Analyst Intern (₦120,000 / month) • On-site
* **Paystack**: Junior Software Engineer (Node.js) (₦250,000 / month) • Remote
* **Sterling Bank**: Cybersecurity Analyst Intern (₦150,000 / month) • Hybrid
* **Olatech Digital Scholar Fund**: Professional tuition sponsorships (₦500,000 value) • Virtual
