export const RECRUITMENT_MANUAL_PART_2 = `
---

# SECTION 6: AI DISCOVERY ENGINE MECHANICS & INGESTION

## 6.1 Discovery Scheduling & Cron Automations
The AI Discovery Engine operates on an automated, multi-tiered chronological schedule managed by internal system cron daemons (\`/api/recruitment/discovery/trigger\`). This ensures continuous, 24/7 ingestion of new job opportunities without overwhelming external portal servers or incurring rate-limit penalties.

* **Primary Overnight Sweep (02:00 UTC Daily)**: The high-volume ingestion cycle executes during low-traffic overnight hours. The crawler sweeps all 50+ whitelisted target portals, graduate trainee career pages, and banking API endpoints, processing bulk DOM trees and populating the morning Discovery Queue for 08:00 AM staff triage.
* **Intraday Partner Webhook Polling (Every 60 Minutes)**: For Tier-1 Gold Partners (e.g., Paystack, Moniepoint, Sterling Bank), lightweight polling scripts check dedicated RSS feeds and partner webhooks every hour, ensuring flash graduate openings or internship requisitions are captured almost instantaneously.
* **Weekly Deep Web Discovery Audit (Saturdays 04:00 UTC)**: A comprehensive deep-web discovery crawl sweeps secondary remote boards, tech startup incubation registries, and institutional partner pages to discover emerging employers and unindexed entry-level software engineering requisitions.

## 6.2 Manual Scans & On-Demand Triggering
While automated cron jobs handle 95% of routine ingestion, Career Placement Officers and Super Admins retain executive authority to initiate on-demand scraping sweeps at any time.
* **Triggering Manual Scans**: From the Command Center console, staff click the **\`[Run AI Discovery Scan]\`** button. A configuration modal allows the officer to select target parameters:
  * *Target Portal Select*: Choose all portals or select specific sources (e.g., *Only Sterling Bank Careers* or *Only LinkedIn Nigerian Tech Jobs*).
  * *Keyword Override*: Force crawler focus on specific stacks (e.g., \`"Python"\`, \`"React"\`, \`"Data Science"\`).
* **Execution & Feedback**: Upon clicking **\`[Execute Deep Scan]\`**, the system initiates background worker threads. A real-time progress indicator displays pages scanned, raw roles extracted, duplicates intercepted, and new opportunities added to the queue.

## 6.3 Supported Sourcing Channels (LinkedIn, Jobberman, Andela, Banks)
The Discovery Engine is pre-configured with custom scraping adapters tailored to the DOM architectures of major African and global tech recruitment platforms:

| Sourcing Channel | Adapter Type | Extraction Mechanics & Target Focus |
| :--- | :--- | :--- |
| **LinkedIn Tech African Feed** | API / Headless DOM | Focuses on company-verified tech postings in Nigeria, Ghana, Kenya, and remote global engineering roles. Filters out third-party recruiters and staffing agency spam. |
| **Jobberman Graduate & Tech** | Structured DOM Scraper | Scrapes verified entry-level and graduate trainee listings. Enforces strict salary presence rules (discarding postings with "Confidential" salaries unless from Gold corporate employers). |
| **Andela Talent Cloud & TopTal** | Dedicated GraphQL / REST | Connects directly to talent cloud marketplaces to extract remote contract and full-time software engineering roles open to African developers. |
| **Tier-1 Nigerian Banking Portals** | Custom Portal Crawlers | Specialized DOM parsers calibrated for the career portals of Sterling Bank, GTCO, Zenith Bank, FirstBank, and Access Bank graduate trainee and tech academy intakes. |
| **Direct Olatech Partner Feeds** | JSON Webhook Ingestion | Instantaneous REST ingestion where verified Gold/Silver partner HR teams push structured job JSON directly to Olatech endpoints without web scraping. |

## 6.4 Trusted Source Verification & Domain Whitelisting
To prevent malicious injection of fraudulent listings, the engine enforces strict **Domain Whitelisting Protocols**.
* **Whitelist Architecture**: Crawling targets must be explicitly registered in the institutional \`ApprovedSourceRegistry\`. The engine will refuse to crawl or ingest data from any web domain not present on this whitelist.
* **Adding New Target Sources**: If a Career Officer discovers a new legitimate tech startup job board or corporate career portal, they must submit a **Source Whitelist Request** to the AI Tech Lead. The engineering team performs domain reputation checks, SSL certificate verification, and anti-phishing audits before adding the new URL to the crawler's scheduled target matrix.

## 6.5 Safe Scraping Principles & Rate-Limit Evasion
Olatech strictly adheres to ethical web scraping standards and corporate legal frameworks:
* **Robots.txt & Meta Tag Compliance**: Crawlers read and strictly obey \`/robots.txt\` disallow directives and \`nofollow/noindex\` meta tags. We never force entry into protected corporate intranets or authenticated employer portals.
* **Polite Request Throttling**: The engine enforces randomized delays of **3,000 to 7,000 milliseconds** between sequential HTTP requests to the same host domain. This polite throttling prevents server degradation on target corporate portals.
* **Header Normalization & User-Agent Rotation**: Crawlers utilize standard, updated browser User-Agent strings and rotate IP requests through enterprise residential proxy networks, preventing Cloudflare or AWS WAF rate-limit blocks while maintaining transparent, legitimate web citizen behavior.

## 6.6 Confidence Calculation Algorithm & Penalty Weights
The mathematical **Confidence Score (0.00 to 1.00)** serves as the primary automated quality filter for ingested jobs. The score is calculated using an additive and subtractive heuristic weighting engine:

\`\`\`
================================================================================
                    AI CONFIDENCE SCORE MATHEMATICAL MODEL
================================================================================
BASE INITIAL SCORE: 1.00

ADDITIVE BOOSTERS (+):
  + 0.15  -> Employer is a Verified Tier-1 Gold Partner (MOU on file)
  + 0.10  -> Salary Band is explicitly listed in numeric NGN/USD currency
  + 0.08  -> Job Description length > 250 words with clear technical stack
  + 0.05  -> Source is direct corporate career portal (vs. secondary board)

SUBTRACTIVE PENALTIES (-):
  - 0.20  -> Salary Band is missing, unlisted, or tagged as "Confidential"
  - 0.15  -> Application deadline is omitted (requiring 14-day default assumption)
  - 0.25  -> Employer corporate entity is unrecognized in CAC or internal registry
  - 0.30  -> Job Description is brief (< 100 words) or poorly formatted
  - 0.40  -> Non-technical keywords detected (e.g., "sales marketing driver")
  - 0.50  -> Suspicious contact details (e.g., Gmail/Yahoo contact email instead of corporate domain)

CRITICAL KILL-SWITCH FLAGS (-1.00 INSTANT REJECTION):
  - 1.00  -> Scam Keywords Detected: "processing fee", "registration deposit", "laptop fund"
  - 1.00  -> Phishing Contact: "Contact HR via WhatsApp or Telegram"
  - 1.00  -> Blacklisted Domain or previously banned corporate entity
================================================================================
\`\`\`

## 6.7 Deep Metadata Extraction & NLP Keyword Tagging
During Stage 3 normalization, the Gemini NLP engine analyzes the raw job description to generate deep metadata tags essential for algorithmic student matching:
* **Tech Stack Parsing**: Identifies languages, frameworks, databases, and cloud tools, mapping them to standard vocabulary (e.g., converting *"we use Amazon Web Services and Mongo"* to tags \`["AWS", "MongoDB"]\`).
* **Seniority Normalization**: Analyzes qualification text to categorize role seniority: \`Intern / NYSC PPA\`, \`Graduate Trainee (0-1 YOE)\`, \`Junior Engineer (1-2 YOE)\`, or \`Mid-Level (3+ YOE)\`. Postings requiring > 3 years of commercial experience are automatically flagged as **\`[Senior Role - High Experience Barrier]\`** to alert staff during triage.

---

# SECTION 7: HUMAN VERIFICATION PROCESS & AUDIT STANDARDS

While the AI Discovery Engine handles high-volume data extraction and initial scoring, the **Human Verification Process** represents the foundational security barrier of the CorpersTech ecosystem. Every opportunity must undergo manual audit by a certified Career Placement Officer before publication.

## 7.1 Company Legitimacy & CAC Registration Audit
For any opportunity submitted by an unverified or newly discovered employer, the Officer must verify legal corporate existence:
* **Corporate Affairs Commission (CAC) Search**: Officers cross-reference the company name on the official public CAC verification portal to confirm active incorporation status (RC / BN number).
* **Corporate Web Presence & Domain Age**: Check the employer's website URL. If the domain was registered less than 60 days ago or hosts generic template text without clear team or office address details, the Officer must place the posting on **\`[Hold - Pending HR Liaison Phone Verification]\`**.

## 7.2 Career Page Authenticity & Phishing Prevention
Scammers frequently clone legitimate corporate websites (e.g., creating \`"sterlingbank-careers-ng.com"\` to mimic \`"sterling.ng"\`). Officers must conduct strict URL domain verification:
* **Root Domain Audit**: Ensure the application URL matches the official root domain of the verified corporate entity.
* **Email Domain Verification**: If applications require sending a CV via email, verify that the receiving email address terminates in the official corporate domain (e.g., \`careers@paystack.com\`). Absolutely **NEVER approve** any job posting directing student applications to free webmail services (\`@gmail.com\`, \`@yahoo.com\`, \`@outlook.com\`, or \`@zoho.com\`).

## 7.3 Application Gateway Link & Redirect Safety Testing
Before signing off on publication, the Officer must click the external application URL from the triage console to test gateway safety:
* **Link Liveness**: Verify the landing page loads successfully with HTTP 200 status code and displays the exact job title extracted by the AI.
* **Redirect Safety**: Ensure the URL does not execute malicious redirects through ad-shorteners (e.g., Bitly, AdFly) or route to third-party survey harvesting pages.
* **No Paywalls or Login Traps**: Confirm the application gateway allows candidate submission without requiring paid subscriptions or intrusive personal data harvesting (e.g., requesting bank passwords or credit card numbers).

## 7.4 Deadline Auditing & Grace Window Negotiation
Officers audit the application closing date to protect student effort:
* **Immediate Expiry Check**: If the listed deadline is within 48 hours, evaluate whether sufficient time exists for students to prepare quality dossiers. If time is too short, contact the employer HR liaison to negotiate a **7-Day Institutional Grace Extension** for Olatech candidates.
* **Default 14-Day Validation**: For roles where the AI assigned a default 14-day window due to missing dates, Officers check the employer's career site to see if an official closing date has been updated.

## 7.5 Salary Band Benchmarking & Total Compensation Verification
Olatech enforces strict compensation standards to prevent wage suppression and student exploitation:
* **Minimum Stipend Threshold**: For NYSC PPA and internship placement, the monthly stipend must meet or exceed the institutional minimum baseline (**₦150,000 / month** for remote/hybrid tech roles in Lagos/Abuja, in addition to federal NYSC allowances). Roles offering below this threshold are rejected with code \`[Exploitative / Below Institutional Minimum]\`.
* **Standardizing "Competitive" Salaries**: When Tier-1 banks or multinationals list compensation as "Competitive," Officers reference internal historical placement grids for that specific company (e.g., knowing Sterling Bank Graduate Trainees receive ~₦350,000/mo) and append an internal advisory note to the student card: *"Olatech Benchmark Estimate: ~₦350k - ₦400k/mo based on recent cohort placements."*

## 7.6 Graduate & NYSC Corps Member Suitability Assessment
Officers evaluate the technical qualifications against the realistic capability profile of graduating academy fellows:
* **Degree & Certification Flexibility**: If a listing demands a strict 4-year Computer Science university degree, Officers check if the employer accepts equivalent intensive technical certifications (such as the Olatech Diploma in Software Engineering). For Gold Partners, Olatech certifications are pre-approved as degree equivalents.
* **NYSC Clearance Compatibility**: Verify whether the employer accepts active NYSC serving corps members for PPA deployment or requires candidates who have already completed service and hold exemption/discharge certificates. Tag the role appropriately: **\`[NYSC PPA Compatible]\`** vs. **\`[Post-NYSC Only]\`**.

## 7.7 Remote Eligibility & Infrastructure Requirements
For remote and hybrid engineering opportunities, Officers audit technical infrastructure prerequisites:
* **Hardware Requirements**: Check if the employer provides a corporate MacBook/laptop or requires BYOD (Bring Your Own Device). If BYOD is required, verify that specs align with standard student hardware (e.g., Core i5/16GB RAM).
* **Power & Connectivity Stipends**: Check if the remote employer provides a monthly data and solar/inverter electricity stipend (standard for foreign remote companies hiring African engineers). Highlight this perk in the published summary to attract high-performing candidates.

## 7.8 Mandatory 7-Point Officer Verification Checklist
Before clicking the green **\`[Approve & Publish]\`** button in the Command Center, every Career Placement Officer must execute and sign off on this mandatory 7-point cryptographic audit checklist:

\`\`\`
+-----------------------------------------------------------------------------+
|             MANDATORY 7-POINT OFFICER VERIFICATION CHECKLIST                |
+-----------------------------------------------------------------------------+
| [ ] 1. CAC & Corporate Legitimacy: Employer is active in CAC or verified    |
|        Gold/Silver partner directory.                                       |
| [ ] 2. Anti-Phishing Domain Audit: Application URL root domain matches      |
|        official corporate site; zero webmail/Gmail contact addresses.       |
| [ ] 3. Zero-Fee Compliance: Absolute certainty that no application,         |
|        processing, training, or equipment deposits are demanded.            |
| [ ] 4. Salary Benchmark Compliance: Compensation meets or exceeds           |
|        institutional minimums (>= ₦150,000/mo for PPA/Internships).         |
| [ ] 5. Tech Stack & Seniority Alignment: Role is genuine entry-level,       |
|        graduate trainee, or junior engineering position suitable for fellows|
| [ ] 6. Application Gateway Verification: External link clicked, tested,     |
|        confirmed live (HTTP 200), and free of malicious redirects.          |
| [ ] 7. NYSC / PPA Eligibility Tagging: Correctly tagged for active corps    |
|        members vs. post-service graduate requirements.                      |
+-----------------------------------------------------------------------------+
| OFFICER SIGN-OFF: [x] I certify that I have executed all 7 audit steps.     |
+-----------------------------------------------------------------------------+
\`\`\`

---

# SECTION 8: DUPLICATE INTELLIGENCE & COLLISION MANAGEMENT

In high-volume multi-channel scraping, identical job openings are frequently discovered across disparate sources (e.g., an Andela role posted on LinkedIn, Jobberman, and the company's internal portal simultaneously). The **Duplicate Intelligence Engine** ensures students never see repetitive clutter.

## 8.1 SHA-256 Deduplication Hash Mechanics
Every ingested job opportunity undergoes algorithmic normalization before hashing:
1. Strip all special characters, emojis, and punctuation from the job title.
2. Convert company name to standardized lowercase root (removing *Plc, Ltd, LLC, Inc, Limited*).
3. Extract the primary geographic city string.
4. Concatenate into a deterministic string: \`"company_clean + title_clean + city_clean"\`.
5. Execute SHA-256 cryptographic hashing to generate a unique 64-character hex digest:
   \`Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\`

When a new scrape job generates a hash identical to an existing record in the database, the ingestion pipeline flags a **Hash Collision** and routes the item to the Duplicate Workbench.

## 8.2 Merge Logic & Historical Data Preservation
When a collision occurs between an existing active opportunity and a newly scraped listing, the AI executes an automated non-destructive merge:
* **Primary Record Retention**: The earlier published record remains the primary entity in the student portal, preserving its unique URL slug, existing student bookmarks, and application view metrics.
* **Metadata Enrichment**: If the newly scraped record contains rich fields missing from the primary record (e.g., the primary job lacked a salary band, but the new scrape from Jobberman lists \`"₦400,000/mo"\`), the engine automatically enriches the primary record with the new salary data.
* **Source Attribution Logging**: The secondary URL is appended to the primary record's internal \`source_urls\` array, allowing staff to track all external channels where the employer is advertising.

## 8.3 Manual Overrides & Splitting Collided Entities
In rare scenarios, legitimate distinct requisitions generate identical hashes (e.g., when a bank posts two openings titled *"Graduate Trainee Engineer - Lagos"* simultaneously for two different technical directorates—Frontend and DevOps).
* When Officers identify a false collision during review, they click **\`[Split Collided Requisition]\`** in the Duplicate Workbench.
* The system opens a manual override form allowing the officer to append distinct department tags (e.g., *"Graduate Trainee Engineer (Frontend)"* vs. *"Graduate Trainee Engineer (DevOps)"*), generating new unique hashes and publishing both postings independently.

## 8.4 Handling False Positives in High-Volume Sourcing
To minimize false deduplication merges, the engine evaluates **Temporal Distance**:
* If an identical hash collision occurs **more than 90 days after** the original listing was archived or closed, the engine classifies the new scrape as a fresh recruitment intake by the employer rather than a duplicate. It automatically creates a new job ID and routes it to the Discovery Queue with an advisory banner: *"Historical Re-opening Detected: Employer previously hired for this exact role in Q1."*

## 8.5 Metadata Enrichment Post-Merge
The deduplication console automatically consolidates multi-source intelligence:
* **Aggregated Deadline Tracking**: If Source A lists deadline as July 15 and Source B lists July 20, the engine flags the discrepancy to the Career Officer, recommending adoption of the later July 20 deadline to give students maximum application window.

---

# SECTION 9: EMPLOYER INTELLIGENCE & SCORING MATRIX

The Recruitment AI Engine does not merely process individual job listings; it builds dynamic, long-term **Employer Intelligence Profiles** stored in the Command Center registry. This database transforms historical placement data into predictive institutional intelligence.

## 9.1 Vetted Employer Profiles & Contact Matrix
Every company in the system maintains a comprehensive corporate profile dossier:
* **Corporate Profile Fields**: Company Name, CAC Registration Number, Industry Sector (Fintech, EdTech, Banking, E-Commerce, HealthTech), Headquarters City, Official Website, and LinkedIn Company Page URL.
* **HR & Technical Liaison Matrix**: Stores verified names, corporate emails, direct phone numbers, and WhatsApp contact details for key decision-makers (Chief Technology Officers, VPs of Engineering, Talent Acquisition Leads, and NYSC HR Coordinators).

## 9.2 Hiring Frequency & Cohort Absorption Tracking
The system automatically tracks employer recruitment cadence over multi-year institutional relationships:
* **Intake Velocity Metrics**: Logs total opportunities posted per quarter, total Olatech students shortlisted, total candidates interviewed, and final confirmed hires per academic cohort.
* **Cohort Absorption Ratio**: Calculates the percentage of an employer's graduate engineering intake filled by Olatech academy alumni, highlighting top partner institutions for executive relationship management.

## 9.3 Historical Placement & Retention Telemetry
To ensure students are placed in supportive, high-growth professional environments, the engine tracks post-placement retention and alumni feedback:
* **12-Month Retention Rate**: Tracks the percentage of placed corps members and graduates who remain employed with the company after their first year. Companies with high 12-month turnover (< 50% retention) are flagged for formal HR inquiry by the Placement Lead.
* **Alumni Workplace Rating**: Aggregates confidential feedback submitted by placed alumni regarding workplace culture, salary payment punctuality, mentorship quality, and work-life balance.

## 9.4 Graduate Friendliness & Mentorship Rating
Employers are scored on their commitment to entry-level talent development:
* **Mentorship Infrastructure**: Companies that pair graduate trainees with dedicated senior engineering mentors receive a **+0.15 Graduate Friendliness Booster** on all their posted job opportunities.
* **Learning & Development (L&D) Stipends**: Employers offering annual book allowances, AWS/GCP certification sponsorship, or conference travel budgets receive elevated visibility in student search results.

## 9.5 Remote Hiring Ratio & Forex Stipend Compliance
For remote engineering employers hiring across African borders, the intelligence matrix audits compensation structures:
* **Currency Transparency**: Logs whether salaries are paid in localized Naira (NGN), US Dollars (USD), British Pounds (GBP), or Euros (EUR).
* **Forex Compliance**: Verifies whether foreign remote employers utilize compliant payment infrastructure (e.g., Deel, Remote.com, Payoneer, or direct domiciliary bank transfers) ensuring students receive full currency value without predatory black-market conversion losses.

## 9.6 Internship & NYSC PPA Absorption Ratio
Specifically tailored for Nigeria's National Youth Service Corps (NYSC) framework:
* **PPA Conversion Tracking**: Measures the percentage of NYSC corps members accepted for Primary Assignment (PPA) internships who are subsequently converted to permanent full-time software engineers upon passing their Passing-Out Parade (POP).
* **Top PPA Partners**: Companies maintaining a **> 75% PPA-to-Full-Time conversion rate** are designated as **\`[Premier NYSC Career Accelerators]\`** and receive VIP placement priority during institutional graduation demo days.

## 9.7 5-Star Employer Quality Scoring Architecture
All intelligence parameters are synthesized into an automated **5-Star Employer Quality Rating** dynamically displayed on student job cards and staff management tables:

\`\`\`
+-----------------------------------------------------------------------------+
|                  5-STAR EMPLOYER QUALITY SCORING MATRIX                     |
+-----------------------------------------------------------------------------+
| RATING  | CLASSIFICATION | OPERATIONAL CRITERIA & SYSTEM BEHAVIOR           |
|---------+----------------+--------------------------------------------------|
| ⭐⭐⭐⭐⭐ | GOLD PARTNER   | Signed MOU; >80% PPA Conversion; Zero complaints;|
|         | (VIP Tier 1)   | Pay above market benchmark; Instant AI fast-track|
|---------+----------------+--------------------------------------------------|
| ⭐⭐⭐⭐  | SILVER PARTNER | Verified CAC; >60% Retention; Regular hiring;    |
|         | (Trusted Lead) | Responsive HR contacts; Standard triage audit.   |
|---------+----------------+--------------------------------------------------|
| ⭐⭐⭐   | STANDARD VETTED| Legitimate corporate entity; Meets salary floors;|
|         | (Standard)     | No MOU yet; Full 7-point human audit required.   |
|---------+----------------+--------------------------------------------------|
| ⭐⭐    | PROBATIONARY   | New startup / unknown entity; Low initial score; |
|         | (Monitored)    | Requires direct HR phone call before publishing. |
|---------+----------------+--------------------------------------------------|
| ⭐     | RESTRICTED     | History of delayed stipend payments or poor      |
|         | (High Risk)    | alumni feedback; Requires Super Admin sign-off.  |
|---------+----------------+--------------------------------------------------|
| [BANNED]| BLACKLISTED    | Phishing scam, fee demand, ethical violation, or |
|         | (Zero Access)  | student exploitation; Blocked by AI ingestion.   |
+-----------------------------------------------------------------------------+
\`\`\`

---

# SECTION 10: ALGORITHMIC OPPORTUNITY MATCHING ENGINE

When an opportunity is approved and published by a Career Officer, the **Algorithmic Opportunity Matching Engine** immediately activates. This recommendation system bridges the gap between open requisitions and our active talent pool of over 500+ NYSC corps members and graduating fellows.

## 10.1 Technology Track Alignment (Frontend, Backend, Cloud, Data)
The matching algorithm first filters candidates by primary technical discipline:
* A job tagged with \`"Frontend Engineering"\` is routed exclusively to students enrolled in or graduated from the **Frontend Web Development Track (React/TypeScript/Next.js)**.
* Cross-track matching is restricted unless a student explicitly holds dual certification (e.g., certified in both Backend Node.js and Cloud DevOps).

## 10.2 Skill Vector Mapping & NLP Tag Comparison
The engine performs granular tag-level vector comparison between the job's required skill array and the student's certified profile skills:
* Let $J$ be the set of required job skills: $J = \\{\\text{React}, \\text{TypeScript}, \\text{Tailwind}, \\text{Redux}\\}$
* Let $S$ be the student's certified skills: $S = \\{\\text{React}, \\text{JavaScript}, \\text{Tailwind}, \\text{HTML/CSS}\\}$
* The engine calculates overlap coefficient: $\\text{Overlap} = \\frac{|J \\cap S|}{|J|} = \\frac{2}{4} = 50\\%$.
* The system checks synonyms (mapping \`JavaScript\` to \`TypeScript\` with a 0.8 compatibility weight), boosting the adjusted skill match vector to **70%**.

## 10.3 Commercial Experience & Seniority Filter Matching
To prevent students from experiencing rejection fatigue by applying to senior roles beyond their current reach, the algorithm applies seniority gating:
* Students classified as **\`Graduate Trainee (0-1 YOE)\`** receive 100% match weighting for roles tagged \`Intern\`, \`NYSC PPA\`, or \`Junior Dev\`.
* If a role demands \`"3+ Years Production Experience"\`, the algorithm downgrades the match score by **-40 percentage points** for fresh graduates, removing it from their primary recommended dashboard while leaving it accessible via manual search.

## 10.4 Student Career Interest & Role Preference Sync
The engine incorporates student self-reported career preferences stored in their CRM profile:
* **Workplace Modality**: Students expressing preference for *"Remote Only"* receive boosted match scores for global remote listings and downgraded scores for mandatory 5-day on-site roles in distant cities.
* **Sector Preferences**: Students aspiring to work in FinTech receive priority matching when banks and payment gateways publish graduate intakes.

## 10.5 Portfolio Complexity & GitHub Hygiene Weighting
Unlike generic job matchers that rely solely on keyword matching on CV resumes, Olatech's matching engine evaluates real-world technical artifact quality:
* **GitHub Repository Hygiene**: The engine scans the student's linked GitHub profile. Students with active contribution graphs, clean README documentation, and deployed live preview links receive a **+15% Portfolio Quality Bonus** in match score calculations.
* **Capstone Project Alignment**: If a job posting requires \`"E-commerce & Stripe API integration"\` and a student built a full-stack e-commerce marketplace as their final graduation capstone project, the algorithm detects the semantic alignment and boosts the candidate to the top of the recommended referral shortlist.

## 10.6 CV Readiness Index Threshold Gating
To protect Olatech's institutional reputation with partner employers, the matching engine enforces quality gating based on the student's **CV Readiness Index (0% to 100%)**:
* **Gold Benchmark Roles (Tier-1 Banks / Global Remote)**: Require a **CV Readiness Index >= 85%**. Students below this threshold cannot apply directly; clicking apply prompts an automated message: *"This Gold Partner role requires an 85% CV Readiness Index. Your CV is currently at 72%. Please schedule a quick review with your Career Officer to upgrade your resume before applying."*
* **Standard PPA / Internship Roles**: Require a **CV Readiness Index >= 70%**, ensuring all submitted dossiers meet baseline professional formatting standards.

## 10.7 Match Percentage Calculation (0% - 100% Spectrum Explained)
The final synthesized **Match Percentage Score** displayed to students and staff is calculated via the following weighted formula:

\`\`\`
================================================================================
               FINAL ALGORITHMIC MATCH PERCENTAGE FORMULA
================================================================================
MATCH SCORE (%) = (w1 * Tech_Track_Align) + (w2 * Skill_Vector_Overlap) 
                + (w3 * Seniority_Fit)    + (w4 * Modality_Preference) 
                + (w5 * Portfolio_Bonus)

WEIGHTING FACTORS:
  - w1 (Tech Track Alignment)      = 35% Weight
  - w2 (Skill Vector Overlap)      = 30% Weight
  - w3 (Seniority / Experience Fit)= 20% Weight
  - w4 (Modality & Location Sync)  = 10% Weight
  - w5 (Portfolio Quality Bonus)   =  5% Weight

SCORE INTERPRETATION BANDS:
  * 90% - 100% [EXCELLENT MATCH]: Perfect stack alignment; student capstone directly
                                  matches employer tech requirements. Priority push!
  * 75% -  89% [STRONG MATCH]:    Core stack matches; 1 or 2 secondary tools missing
                                  (easily learned on the job). Recommended application.
  * 60% -  74% [POTENTIAL MATCH]: Adjacent stack alignment; requires targeted CV
                                  customization and interview prep before applying.
  * < 60%      [LOW COMPATIBILITY]: Wrong technical track or seniority barrier.
                                  Filtered out of primary recommendation feeds.
================================================================================
\`\`\`
`;
