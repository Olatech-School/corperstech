export const ADMISSIONS_MANUAL_PART_3 = `# Chapter 7: Admissions Quality Checklists

To maintain institutional quality and ensure compliance with CorpersTech Gold Master operational standards, Admissions Officers must execute the following structured checklists daily, per-candidate, pre-orientation, and weekly.

## 7.1 Daily Morning Readiness Checklist (08:00 - 08:30 AM)
Every Admissions Officer must complete this 8-point readiness check before initiating candidate vetting:
* [ ] **1. Secure Authentication**: Logged into terminal via official \`@olatech.com\` staff credentials and completed MFA verification.
* [ ] **2. System Health Audit**: Confirmed top-right system status pill displays \`● DATABASE ONLINE\` with normal network latency (< 50ms).
* [ ] **3. Command Center KPI Review**: Inspected Total Applications, Pending Reviews volume, and overnight registration velocity charts.
* [ ] **4. Critical Alert Triage**: Opened Notifications Hub and resolved or acknowledged all red alerts (SLA breach warnings and duplicate detections).
* [ ] **5. Pending Queue Depth Check**: Confirmed total pending applications count and calculated required hourly throughput to prevent SLA expiration.
* [ ] **6. Email & SMS Gateway Test**: Checked Communication Center status to ensure SMTP mail server and SMS broadcast gateways report \`Online / Ready\`.
* [ ] **7. Lab Inventory Sync**: Confirmed physical workstation PC vacancy count with Operations Officer for Ikeja and Abuja campuses.
* [ ] **8. Workstation Security Posture**: Confirmed physical desk space is clean of candidate paperwork and screen auto-lock timeout is set to 15 minutes.

## 7.2 Individual Applicant Vetting Checklist (Per Candidate)
When reviewing an applicant profile in the vetting drawer, execute this 10-point verification checklist:
* [ ] **1. Identity Verification**: Full legal name correctly capitalized; no nicknames, symbols, or numeric characters in name fields.
* [ ] **2. Contact Validity**: Email syntax verified valid; phone number verified active and formatted for WhatsApp communication.
* [ ] **3. NYSC Mobilization Audit**: NYSC State Code and Call-Up Number syntax confirmed valid against official directorate formats.
* [ ] **4. Document Scan Authenticity**: Uploaded NYSC Call-Up letter PDF / exemption certificate opened, inspected, and verified legible and authentic.
* [ ] **5. Academic Qualification Check**: University degree discipline and graduation year checked; confirmed eligibility for intensive software engineering bootcamp.
* [ ] **6. Hardware & Modality Alignment**: If Remote track: personal laptop ownership verified (≥8GB RAM SSD). If Physical track: commuting distance and lab PC availability confirmed.
* [ ] **7. Duplicate Intelligence Audit**: Checked top profile banner for \`⚠️ DUPLICATE SUSPICION\` flags; merged or investigated matching addresses if present.
* [ ] **8. Interview / Screening Screening**: Phone/video screening conducted; verified availability for 15 hours weekly bootcamp workload and NYSC PPA schedule alignment.
* [ ] **9. Mandatory Interviewer Comments**: Typed comprehensive, objective, factual vetting remarks into the Interviewer Comments text box.
* [ ] **10. Status & Cohort Pairing**: Toggled status to \`Enrolled\` (or appropriate decision) AND immediately selected target active \`Assigned Cohort\` before saving.

## 7.3 Pre-Orientation Roster & Handoff Checklist (Friday Afternoon / Pre-Kickoff)
Before passing a new class roster to campus instructors and operations staff, verify this 8-point handoff checklist:
* [ ] **1. Capacity Cap Verification**: Confirmed enrolled student count does not exceed maximum seat limits (max 30 for physical campus labs).
* [ ] **2. Zero Orphaned Students**: Audited database to confirm zero Enrolled students have a \`null\` or empty \`Assigned Cohort\` tag.
* [ ] **3. Welcome Broadcast Dispatch**: Broadcasted Template 01 (Official Welcome & Orientation Instructions) via email and SMS to 100% of cohort members.
* [ ] **4. Slack Workspace Sync**: Confirmed automated webhook generated Slack channel invitation links and monitored student join rate.
* [ ] **5. GitHub Organization Addition**: Verified all enrolled student GitHub handles are added to \`@CorpersTech-Students\` repository organization.
* [ ] **6. Physical Barcode ID Generation**: For physical campus attendees, printed barcode student ID badges and orientation welcome packs.
* [ ] **7. Lab Workstation Seating Chart**: Published physical desk seating map linking Student IDs to specific lab computer terminal numbers.
* [ ] **8. Printed Security Gate Roster**: Printed physical backup roster and delivered to Campus Security Gatekeeper for Monday morning admission verification.

## 7.4 Weekly Compliance & Audit Review Checklist (Friday 17:00 PM)
At the conclusion of each working week, the Admissions Lead and officers execute this institutional compliance review:
* [ ] **1. Zero Weekly SLA Breaches**: Confirmed that zero applications submitted during the week remained pending beyond 48 hours.
* [ ] **2. Rejection Code Audit**: Reviewed all rejected profiles to confirm standardized Rejection Reason Codes and justification notes were properly assigned.
* [ ] **3. Waitlist Maintenance**: Reviewed waitlisted candidates; promoted eligible students to fill dropouts or archived expired waitlist entries.
* [ ] **4. Stipend Disbursal Alignment**: Confirmed that all students approved for transport subsidies were synced to the Finance Officer ledger.
* [ ] **5. Audit Log Security Check**: Inspected weekly administrative access logs for unauthorized exports, after-hours logins, or anomalous IP addresses.
* [ ] **6. Documentation Feedback Review**: Checked Documentation Center feedback ratings and submitted update suggestions if operational workflows evolved.

---

# Chapter 8: Frequently Asked Questions (40+ Realistic Questions & Answers)

This chapter provides comprehensive, authoritative answers to 42 realistic operational questions asked by Admissions Officers, Enrollment Leads, and Administrative Staff during day-to-day CRM usage.

## 8.1 Section A: System Access, Permissions & Security (Q1 - Q8)

* **Q1: What should I do if my staff account (\`admissions@olatech.com\`) is locked after multiple failed MFA attempts?**
  * **Answer**: Account lockouts trigger automatically after 5 consecutive failed MFA or password attempts to prevent brute-force attacks. Do not attempt to reset your password via public self-service. Contact the **Super Admin** or IT Helpdesk directly via internal Slack or emergency phone. The Super Admin will verify your identity, clear the security flag in \`/admissions/audit\`, and issue a temporary one-time login token valid for 15 minutes.
* **Q2: Why am I unable to see or modify the Finance & Stipend Disbursal module in my sidebar?**
  * **Answer**: This is intentional by design under CorpersTech's strict Role-Based Access Control (RBAC) security architecture. Admissions Officers are provisioned with read/write access strictly to \`/admissions\` (CRM, Applicants, Cohorts, Communications) and \`/docs\` (Documentation Center). Financial ledgers, stipend calculations, and global database restore tools are restricted to Finance Officers and Super Admins to maintain segregation of duties and prevent financial conflict of interest.
* **Q3: Can I log into the Admissions CRM from my personal smartphone or tablet while commuting home?**
  * **Answer**: While the React frontend is responsive, administrative policy strictly prohibits conducting formal candidate vetting, toggling admission statuses, or exporting rosters from unmanaged personal smartphones or public Wi-Fi networks. Emergency read-only checks (such as checking pending queue volume) are permitted on corporate-enrolled mobile devices with active VPN and biometric screen locks.
* **Q4: What is the exact auto-logout timeout setting, and how do I prevent losing unsaved notes?**
  * **Answer**: The system enforces an automated inactivity session timeout of exactly **15 minutes**. If no keyboard or mouse input is detected within 15 minutes, your JWT session token expires and you are returned to the login screen. To prevent losing long interview observations, always click **"Save Profile Changes"** regularly during lengthy screening calls.
* **Q5: Why did the system immediately terminate my laptop login session when I opened the CRM on a lab desktop?**
  * **Answer**: CorpersTech enforces a **Single-Session Concurrent Login Intercept**. An administrative staff account cannot maintain active read/write tokens on two separate physical hardware IP addresses simultaneously. When you authenticate on the campus desktop PC, the backend immediately invalidates the JWT session token on your laptop to prevent session hijacking and credential sharing.
* **Q6: Am I permitted to share my login credentials with a junior administrative intern to help clear a registration backlog?**
  * **Answer**: **ABSOLUTELY NOT.** Credential sharing is a Class-1 security violation resulting in immediate administrative dismissal. All actions in the CRM are cryptographically signed and logged in the immutable **Audit Logs Module** under your staff email. If an intern or temporary assistant requires access, request a dedicated restricted account (\`Admissions Intern\` role) from the Super Admin.
* **Q7: What steps should I take if I suspect an unauthorized user accessed my administrative workstation during my lunch break?**
  * **Answer**: Immediately click your profile icon in the top right and select **"Secure Logout & Revoke Tokens"**. Then, open the **Audit Logs Module** (\`/admissions/audit\`) and filter by your staff name for the past 2 hours. Inspect the timestamp and IP address of all recorded transactions. If you identify any status toggles or exports you did not perform, report the incident immediately to the Operations Director and Super Admin for forensic isolation.
* **Q8: How do I request an update to my staff profile display name or assigned campus department?**
  * **Answer**: Staff profile metadata (name, avatar, assigned departmental tag) is managed centrally by the Human Resources & Operations directory. Submit a formal profile update request through the **Operations Center Module** (\`/operations\`) or contact the Super Admin to update your employee master record.

---

## 8.2 Section B: Applicant Screening, Vetting & Interviews (Q9 - Q18)

* **Q9: How do I handle an applicant who registered with a valid NYSC Call-Up number but their degree certificate is from an unaccredited foreign institution?**
  * **Answer**: CorpersTech maintains strict academic standards. If a degree is from an unrecognized or unaccredited institution, do not approve the application immediately. Flag the profile with \`[x] Flag for Document Clarification\` and request an official evaluation letter from the Federal Ministry of Education or NYSC evaluation board via the Communication Center. If unverified within 5 business days, reject with code \`CODE-R6: Unaccredited Academic Qualification\`.
* **Q10: What is the exact operational SLA for processing a newly submitted application from Pending to a final decision?**
  * **Answer**: The mandatory institutional SLA is exactly **48 hours (2 business days)** from the exact timestamp of application submission (\`createdAt\`). Applications approaching the 48-hour mark are highlighted with pulsing amber borders in the Applicant Management Table and trigger automated escalation notices in the Notifications Hub.
* **Q11: An applicant passed the technical screening but admits during the phone interview that their NYSC PPA requires them to work until 6:00 PM daily, conflicting with physical lab hours. How do I proceed?**
  * **Answer**: Physical campus cohorts run mandatory evening lab sessions (typically 4:00 PM to 7:00 PM). If a candidate cannot attend physical labs due to rigid PPA hours, do not reject them! Offer them an immediate transfer to the **Virtual Remote Cohort** for their chosen track, which offers asynchronous lecture recordings and flexible weekend mentorship sessions. If they accept, update their modality to Remote and assign them to the remote cohort roster.
* **Q12: What should I type in the Interviewer Comments box if an applicant fails the phone screening due to extremely poor logical reasoning or inability to explain basic computing concepts?**
  * **Answer**: Maintain strict objective professionalism. Never use insulting or derogatory terms. *Gold Master Approved Notation*: \`"Screening conducted 02/07/2026. Candidate unable to define basic web terminology (HTML/OS concepts) and struggled with fundamental logical sequence reasoning during oral assessment. Recommended for foundational computing pre-work prior to intensive bootcamp entry. Status toggled to Rejected - Code R4: Prerequisite Technical Aptitude Not Met."\`
* **Q13: Can I approve an applicant who is not a current NYSC corps member (e.g., a university undergraduate or someone who finished NYSC 5 years ago)?**
  * **Answer**: CorpersTech's core mandate and funding structure focus on active Nigerian National Youth Service Corps members (Batch A, B, C active streams). However, up to 10% of cohort seats may be allocated to commercial/external candidates or recent alumni under special administrative admission. Check the applicant's registration type: if applying under the **NYSC Subsidized Track**, active NYSC mobilization is mandatory. If applying under the **Commercial / Open Enrollment Track**, verify fee payment status with Finance before toggling status to Enrolled.
* **Q14: Why does the system display a red \`⚠️ DUPLICATE SUSPICION\` banner when two applicants have different names and emails?**
  * **Answer**: Our algorithmic **Email Duplication Intelligence** scans beyond simple string matching. It evaluates phonetic similarity, matching phone numbers, identical Bank Verification Numbers (BVN), and identical physical street addresses. It is common for siblings or roommates serving in the same NYSC batch to apply from the same address. Follow SOP-001: open both profiles, call their phone numbers to verify they are distinct individuals, and if confirmed unique, click **"Override Duplicate Warning - Verified Unique"**.
* **Q15: What is the procedure if an applicant uploads a password-protected PDF or an inaccessible Google Drive link as their NYSC Call-Up letter?**
  * **Answer**: Never attempt to crack passwords or request personal login passwords from candidates. Check \`[x] Flag for Document Clarification\`, select **Template 05 (Document Clarification)** in the Communication Center, and instruct the candidate: *"Please re-upload an standard, unprotected, direct PDF file or high-resolution JPEG scan of your NYSC Call-Up letter directly to the portal within 24 hours. Cloud storage links requiring login permissions cannot be processed by our automated vetting engine."*
* **Q16: Is there a minimum required score on the automated onboarding logical reasoning quiz for admission into advanced tracks like Cybersecurity or Data Science?**
  * **Answer**: Yes. In the **Technical Assessment** tab, check the candidate's logical reasoning score. For foundational tracks (*Web Development*, *Python*, *Graphics Design*), a score of **≥ 50%** is acceptable. For advanced analytical tracks (*Cybersecurity*, *Data Science & AI*), a minimum score of **≥ 70%** is required. Applicants scoring between 50-69% applying for Data Science should be counseled and offered admission into the foundational Python Programming track instead.
* **Q17: Can I edit an applicant's entered phone number or residential address directly in their profile if they made a typographical error during registration?**
  * **Answer**: Yes. Under the **Personal Info** tab, Admissions Officers have read/write permissions to correct typographical errors in contact fields (e.g., correcting an extra digit in a phone number or fixing a misspelled street name). When making edits, you must append an explanation in the Interviewer Comments box: \`"Corrected applicant phone number from 080311122333 to 08031112233 per verbal telephone confirmation on 02/07/2026."\`
* **Q18: What should I do if an applicant contacts support claiming they never received their registration confirmation email?**
  * **Answer**: Search for the applicant in the **Applicant Management Table** using their email or name. Open their profile and check the **Communication History Log** at the bottom of the drawer.
    * If the log shows \`Delivered\`, advise the candidate to check their Spam/Junk folder or promotions tab.
    * If the log shows \`Bounced / Failed\`, verify their email address spelling. If there is a typo (e.g., \`@gmai.com\`), correct the email address in Personal Info, click Save, and then click the **"Resend Welcome Dispatch"** button in the quick actions ribbon.

---

## 8.3 Section C: Cohort Management, Tracks & Allocations (Q19 - Q26)

* **Q19: What is the absolute maximum student seating capacity for a physical on-site campus cohort, and why cannot it be overridden?**
  * **Answer**: The absolute hard-capped seating limit for physical on-site campus cohorts (Lagos Ikeja, Lagos VI, Abuja Central) is exactly **30 students per lab room**. This limit is hardcoded into the CRM database and cannot be overridden by Admissions Officers or Super Admins. It strictly enforced to comply with physical classroom fire safety codes, electrical HVAC load thresholds, and our mandatory 30:1 student-to-instructor educational quality ratio.
* **Q20: How do I handle an admission when a physical lab cohort reaches 30/30 (100%) capacity before the registration deadline?**
  * **Answer**: When a cohort hits 100%, the capacity progress bar turns solid red and direct enrollment is blocked. You have two operational choices:
    1. **Option A (Overflow Cohort)**: Check if an parallel physical class is active (e.g., if *Lagos Web Dev Cohort 1* is full, enroll the student into *Lagos Web Dev Cohort 2*).
    2. **Option B (Waitlisting)**: If all physical cohorts for that track are full, toggle the candidate's status to 🔵 **Waitlisted**. Inform them via email that they are #1 on the priority waitlist and will be automatically enrolled if an accepted student drops out prior to orientation Monday.
* **Q21: Can an enrolled student be transferred from the Lagos Ikeja Campus cohort to the Abuja Campus cohort mid-semester due to NYSC redeployment?**
  * **Answer**: Yes. Follow the inter-cohort transfer procedure detailed in Chapter 3.5.3: Open the student's profile in **Cohort Management**, click **"Transfer Student"**, select the target Abuja cohort, and enter the mandatory administrative transfer note: \`"NYSC formal redeployment from Lagos State to FCT Abuja. Transferred from Lagos Web Dev Cohort 1 to Abuja Web Dev Cohort 1 effective Week 3."\` The system will automatically re-route their Slack channel and lab seating.
* **Q22: What happens in the backend when I assign a candidate to a cohort and click Save Profile Changes?**
  * **Answer**: Saving an enrollment transaction triggers a four-stage asynchronous backend workflow:
    1. Database record updates status to \`Enrolled\` and binds \`cohortId\`.
    2. An automated email/SMS welcome dispatch is queued in the Communication Center.
    3. A webhook fires to our corporate Slack workspace, generating a unique invitation link to the cohort's private channel (e.g., \`#lagos-webdev-batch4\`).
    4. An invitation is dispatched to their GitHub handle to join the \`@CorpersTech-Students\` organization repository.
* **Q23: Why do some cohorts display a \`🌐 Virtual Remote\` modality badge, and what is the maximum seat limit for digital classes?**
  * **Answer**: Virtual Remote cohorts serve NYSC corps members deployed to rural or non-metropolitan states across Nigeria who cannot physically commute to our Lagos or Abuja technical hubs. Because remote classes do not consume physical lab computer hardware or classroom floor space, their capacity cap is set at **100 students per digital cohort**, managed by 3 digital mentorship instructors.
* **Q24: How do I create a new academic cohort for an emerging curriculum track like 'Cloud & DevOps'?**
  * **Answer**: Cohort creation is restricted to **Admissions Leads** and **Super Admins**. In the Cohort Management module, click **"+ Create New Cohort"**, enter the unique cohort alphanumeric code (e.g., \`LAG-CLOUD-2026-Q3\`), select the learning track, set modality (Physical/Remote), assign the Lead Faculty Instructor, and define kickoff/graduation calendar timestamps. Once saved, the cohort immediately appears in the profile drawer dropdowns for candidate allocation.
* **Q25: What is the procedure if a faculty instructor assigned to lead a cohort falls ill or resigns before kickoff?**
  * **Answer**: In the Cohort Management module, open the affected Cohort Card and click **"Edit Cohort Settings"**. In the Lead Instructor dropdown, select the replacement faculty member assigned by the Academic Director and click Save. The system will automatically update faculty permissions across all student dashboards and Slack channels without disrupting enrolled student records.
* **Q26: Can a student be concurrently enrolled in two different cohorts (e.g., studying Web Development on weekdays and Cybersecurity on weekends)?**
  * **Answer**: **No.** CorpersTech institutional policy and database schema strictly enforce a **one-student-to-one-active-cohort** rule during any single academic semester. Intensive software engineering requires 100% focused cognitive immersion; dual enrollment invariably leads to academic burnout and high dropout rates. If a student completes Web Development successfully, they may re-apply as an alumnus for Cybersecurity in a subsequent service year batch.

---

## 8.4 Section D: Transportation, Stipends & Physical Labs (Q27 - Q34)

* **Q27: Who qualifies for corporate shuttle bus seating versus monthly direct bank account transport stipends?**
  * **Answer**:
    * **Shuttle Bus Seating**: Qualified physical campus students residing along official CorpersTech shuttle corridors (e.g., Route 01: Ikeja Express, Route 02: Lekki Loop, Route 03: Kubwa/Abuja Express) are assigned dedicated bus seats.
    * **Direct Bank Stipends**: Physical campus students residing in metropolitan zones outside our corporate bus routes qualify for monthly direct transport stipends (disbursed via Finance) to cover public transit or rideshare expenses.
* **Q28: How do I assign a newly enrolled Lagos on-site student to Shuttle Bus Route 01?**
  * **Answer**: Navigate to the **Transportation Management** module (\`/admissions/transport\`), locate the newly admitted student in the unassigned logistics grid, click the **Route Assignment Dropdown**, select \`Route 01: Ikeja / Maryland Express\`, designate their specific morning pickup bus stop, and click **"Update Bus Manifest"**.
* **Q29: What happens if all 22 seats on Shuttle Bus Route 01 are completely assigned and a new student lives in Ikeja?**
  * **Answer**: When a bus manifest reaches 22/22 (100% seating capacity), the system blocks additional seat assignments to prevent overcrowding and safety violations. You must toggle the student's transport classification to \`Approved for Monthly Transport Stipend\`. Inform the student via automated SMS that while corporate shuttles are full, they will receive direct financial allowances to commute via public transport.
* **Q30: How do I verify a student's bank account details before approving their profile for transport stipend disbursal?**
  * **Answer**: In the **Transportation Management** grid, inspect the student's entered Bank Name, Account Number, and 11-digit Bank Verification Number (BVN). Click the **"Verify BVN & Name Match"** button. The CRM performs a background API check against NYSC payroll records; if the account name matches their legal applicant name, the badge turns solid green (\`✔ BVN Verified\`). You may then click **"Approve Stipend Disbursal"** to sync the profile to the Finance Officer dashboard.
* **Q31: A student assigned to a physical campus iMac workstation breaks the computer mouse or keyboard during lab hours. How is this logged?**
  * **Answer**: While equipment maintenance is primarily managed by Operations Officers, Admissions Officers must note hardware incidents if they impact student attendance. Instruct the student to report to the Lab Technical Supervisor. In the CRM **Orientation Checklist & Onboarding Tracker**, locate the student row, add a lab incident note: \`"Workstation PC-14 peripheral replaced by Operations on 02/07/2026"\`, ensuring no attendance penalties are applied during equipment downtime.
* **Q32: Why must I check the \`Needs Physical Workstation\` box for candidates who answer 'No' to laptop ownership?**
  * **Answer**: Checking this box triggers an automated asset reservation script in the Operations Module (\`/operations\`). It tells the campus laboratory manager that a desktop iMac or PC must be physically set up, imaged with coding software (VS Code, Git, Docker, Python), and tagged with the student's ID badge prior to Monday morning orientation check-in.
* **Q33: Can a remote virtual student request a transport stipend or physical lab workstation allocation?**
  * **Answer**: **No.** Transport stipends and campus laboratory workstation allocations are strictly restricted to students enrolled under the **Physical On-Site Modality** (Lagos or Abuja campuses). The CRM database schema automatically disables transport routing and workstation assignment fields whenever a candidate's modality is set to \`Virtual Remote\`.
* **Q34: How do I generate a printable driver manifest for Shuttle Bus Route 02 on Sunday evening before orientation?**
  * **Answer**: In the **Transportation Management** module, click on the card for \`Route 02: Lekki / VI Loop\`. Click the prominent **"Print Driver Manifest"** action button. The system formats a clean, high-contrast PDF listing all 22 assigned students, their specific pickup bus stops, morning departure timestamps (e.g., \`06:45 AM - Lekki Gate\`), and emergency mobile phone numbers, ready for handover to the corporate shuttle driver.

---

## 8.5 Section E: Technical Troubleshooting, Exporting & Audit Logs (Q35 - Q42)

* **Q35: Why does the CSV export button in the Applicant Management Table sometimes download an empty spreadsheet?**
  * **Answer**: This occurs if your active table filters (e.g., filtering for \`Track = Cybersecurity\`, \`Status = Waitlisted\`, \`State = Kano\`) match zero records in the current database view. Always check the pagination record counter at the bottom of the table (e.g., \`Showing 0 of 0 records\`) before clicking Export. Click **"Reset All Filters"** to restore the full dataset before exporting.
* **Q36: What is the exact difference between 'Soft-Deletions' and permanent database purging?**
  * **Answer**: When an Admissions Officer clicks the trash icon on a candidate row, the system executes a **Soft-Deletion**: it sets an internal database flag (\`isArchived = true\` or \`deletedAt = timestamp\`) and hides the row from active views. Soft-deleted records remain stored in the database and can be restored at any time via SOP-007. Permanent database purging (hard SQL deletion) is restricted exclusively to Super Admins during annual academic year database resets.
* **Q37: How do I locate an applicant who registered 3 months ago if I only remember their first name and university?**
  * **Answer**: Use the **Global Search Syntax** in the top search bar. Type \`name:Emmanuel university:Unilag\` or use partial string matching \`Emmanuel *Lagos*\`. The high-speed search engine will scan all historical records across active and archived tables and return matching profiles in milliseconds.
* **Q38: Why do I see an \`Error 500: Database Write Conflict\` toast message when clicking Save Profile Changes?**
  * **Answer**: A \`500 Write Conflict\` occurs if another staff member (e.g., a colleague Admissions Officer or Super Admin) opened and modified the exact same candidate profile in a separate browser session at the exact same second. To resolve: click **"Cancel / Revert"**, refresh your browser page (\`F5\` or \`Cmd+R\`) to load the latest database state, re-apply your vetting notes, and click Save again.
* **Q39: How can I verify if an automated acceptance email was blocked by a candidate's email spam filter?**
  * **Answer**: In the candidate profile drawer, scroll down to the **Communication History Log**. Locate the row for \`Template 01: Official Welcome\`.
    * If the status badge reads 🟢 **Delivered**, our SMTP server successfully handed the email to Google/Yahoo servers; any spam filtering occurred locally on the user's device. Advise them via SMS to check their Junk folder.
    * If the badge reads 🔴 **Bounced / Rejected**, click the badge to view the SMTP failure code (e.g., \`550 5.1.1 User Unknown\`). Correct the typo in their email address and resend.
* **Q40: Can I export the immutable Security Audit Ledger (\`/admissions/audit\`) to an Excel workbook for an external ministry accreditation audit?**
  * **Answer**: Yes. Navigate to the **Audit Logs Module** (\`/admissions/audit\`). Set the date range picker to cover the required accreditation inspection window (e.g., \`January 1, 2026 to June 30, 2026\`). Click the **"Export Compliance Ledger (CSV / Excel)"** button. The system will generate a digitally signed, timestamped spreadsheet containing every administrative login, status toggle, and cohort assignment executed during that period.
* **Q41: What should I do if the interactive registration velocity charts on the Admissions Dashboard fail to render or appear as blank boxes?**
  * **Answer**: Chart rendering failures are typically caused by ad-blocking browser extensions (such as uBlock Origin or Privacy Badger) blocking JavaScript charting libraries (\`recharts\` or \`d3\`), or an outdated browser cache. Whitelist \`portal.corpers.tech\` in your ad-blocker settings, execute a hard browser refresh (\`Ctrl + Shift + R\` or \`Cmd + Shift + R\`), and confirm that your internet connection allows WebSocket telemetry streaming.
* **Q42: Where can I submit suggestions to improve this Admissions Operations Manual or report a newly discovered operational edge case?**
  * **Answer**: CorpersTech operates a continuous improvement documentation model. When viewing this manual in the **Documentation Center** (\`/docs\`), scroll to the bottom of the reading interface to locate the **"Document Feedback & Revision Request"** panel. Select a rating, type your detailed operational suggestion or new SOP proposal into the text area, and click **"Submit Feedback to Knowledge Base Lead"**. Approved workflows are incorporated into subsequent Gold Master document releases.

---

# Chapter 9: Appendix & Reference Glossaries

## 9.1 Glossary of Terms & Acronyms
* **CRM**: Customer Relationship Management system; the core administrative software used by staff to track student applicant lifecycles.
* **NYSC**: National Youth Service Corps; the mandatory one-year paramilitary and community service scheme for Nigerian university graduates.
* **PPA**: Place of Primary Assignment; the school, government ministry, or private company where an NYSC corps member is deployed for daily service.
* **BVN**: Bank Verification Number; an 11-digit biometric identification number implemented by the Central Bank of Nigeria, used in our CRM to verify student legal names before transport stipend disbursal.
* **RBAC**: Role-Based Access Control; our security architecture that restricts system read/write permissions based on staff job titles (\`Super Admin\`, \`Admissions Officer\`, \`Operations Officer\`, etc.).
* **SLA**: Service Level Agreement; the strict time bound within which operational tasks must be completed (e.g., our mandatory 48-hour application vetting SLA).
* **FIFO**: First-In, First-Out; the chronological triage methodology where oldest submitted applications are reviewed before newer arrivals.
* **MFA**: Multi-Factor Authentication; the mandatory two-step login security protocol requiring a password plus a time-based one-time password (TOTP) mobile app code.
* **NDPR**: Nigeria Data Protection Regulation; the overarching federal legal framework governing the secure collection, storage, and processing of Nigerian citizens' personal data.
* **SOP**: Standard Operating Procedure; documented, step-by-step authoritative instructions designed to handle complex or recurring operational edge cases consistently.
* **UI / UX**: User Interface / User Experience; the visual screens, tables, buttons, and interaction flows within the CorpersTech administrative software.
* **JWT**: JSON Web Token; the cryptographic security token generated upon staff login that authenticates browser sessions across protected API endpoints.

## 9.2 Standard Email & SMS Communication Templates

### 9.2.1 Template 01: Official Admissions Acceptance & Cohort Welcome (Email)
* **Subject Line**: \`Congratulations! You have been Admitted to Olatech School of Programming — {{assigned_cohort}}\`
* **Message Body**:
\`\`\`
Dear {{applicant_name}},

We are thrilled to formally inform you that your application (Ref: {{ref_id}}) has successfully passed our academic and credential vetting review. You have been granted full admission into the Olatech School of Programming for the upcoming academic session!

You have been assigned to the following learning cohort:
* Assigned Cohort: {{assigned_cohort}}
* Kickoff / Orientation Date: {{orientation_date}}
* Campus / Modality Location: {{campus_address}}

MANDATORY NEXT STEPS TO CONFIRM YOUR SEAT:
1. Join our Official Slack Workspace: Please click your unique invitation link sent in a separate email to join your cohort's communication channel immediately.
2. Accept GitHub Organization Invite: Accept the invitation sent to your GitHub account to access our engineering curriculum repositories.
3. Orientation Check-in: Ensure you arrive at the campus reception (or virtual check-in lobby) at least 30 minutes prior to the scheduled orientation timestamp.

If you have any immediate questions regarding your hardware allocation or transport logistics, please reply directly to this email or contact our Admissions Support desk.

Welcome to the CorpersTech engineering ecosystem! We look forward to launching your career.

Warm regards,
Admissions Lead & Operations Committee
Olatech School of Programming (CorpersTech Ecosystem)
\`\`\`

### 9.2.2 Template 02: Interview Invitation & Screening Scheduling (Email / SMS)
* **Subject Line**: \`Action Required: Invitation to CorpersTech Admissions Vetting Screening — {{ref_id}}\`
* **Message Body**:
\`\`\`
Dear {{applicant_name}},

Thank you for your application to the Olatech School of Programming. As part of our comprehensive admissions review for Ref ID {{ref_id}}, we invite you to participate in a mandatory 5-minute telephone / telephone screening interview.

During this brief screening, an Admissions Officer will confirm your current NYSC PPA deployment schedule, verify your hardware / workstation readiness, and answer any curriculum questions you may have.

Please ensure your registered phone number is reachable between 10:00 AM and 3:00 PM over the next 24 hours. If you prefer to schedule a specific time slot, please click the automated calendar link below:
[ Schedule My Screening Call Now ]

Thank you for your cooperation and commitment to academic excellence.

Sincerely,
Admissions Vetting Team
Olatech School of Programming
\`\`\`

### 9.2.3 Template 03: Application Rejection & Future Cohort Advisory (Email)
* **Subject Line**: \`Update on your Application to Olatech School of Programming — {{ref_id}}\`
* **Message Body**:
\`\`\`
Dear {{applicant_name}},

We sincerely appreciate your interest in joining the Olatech School of Programming and the time you invested in submitting your application (Ref: {{ref_id}}).

Our admissions committee has completed a rigorous review of our applicant pool for this academic session. Due to our strict classroom capacity limits and competitive prerequisite requirements, we regret to inform you that we are unable to offer you admission into our cohorts at this time.

Please note that this decision does not reflect negatively on your overall professional potential. We strongly encourage you to continue developing your foundational computing skills using free open-source resources, and we warmly invite you to re-apply during our next quarterly academic intake.

We wish you the very best during your NYSC service year and in your future professional endeavors.

Respectfully,
Admissions Directorate
Olatech School of Programming
\`\`\`

### 9.2.4 Template 04: Orientation Reminder & Physical Campus Checklist (SMS Broadcast)
* **SMS Broadcast Text (Max 160 Chars per SMS segment)**:
\`\`\`
CORPERSTECH ALERT: Welcome {{applicant_name}}! Reminder: Your orientation for {{assigned_cohort}} starts Monday at 08:30 AM sharp at {{campus_address}}. Please bring your NYSC ID card and arrive 30 mins early for barcode badge printing. See you there!
\`\`\`

### 9.2.5 Template 05: Urgent: Document Clarification / Re-upload Request (Email)
* **Subject Line**: \`URGENT: Action Required on your CorpersTech Application Documents — {{ref_id}}\`
* **Message Body**:
\`\`\`
Dear {{applicant_name}},

Our Admissions Officers are currently reviewing your application (Ref: {{ref_id}}) for admission into the Olatech School of Programming. However, we are unable to complete your vetting because your uploaded NYSC Call-Up Letter / Exemption Certificate is blurry, unreadable, or formatted improperly.

To prevent your application from being rejected due to incomplete documentation, please take the following action within the next 24 HOURS:
1. Log into your applicant portal using your registered email address.
2. Navigate to the "Upload Documents" section.
3. Re-upload a clear, high-resolution, un-encrypted PDF scan or JPEG photograph of your official NYSC Call-Up Letter. Ensure all text, watermark seals, and your Call-Up Number are clearly legible.

If clear documentation is not received within 48 hours, your profile will be automatically archived by our system to clear the pending queue.

Thank you for your prompt attention to this matter.

Admissions Compliance Officer
Olatech School of Programming
\`\`\`

## 9.3 System Error Codes and Administrative Remedies
When navigating \`/admissions\` or processing batch operations, Admissions Officers may occasionally encounter system diagnostic codes. Refer to this remedy table for immediate resolution without escalating to IT support:

| System Error Code | Technical Definition / Cause | Immediate Administrative Remedy & SOP |
| :--- | :--- | :--- |
| \`ERR-401-UNAUTH\` | JWT authentication session token expired or invalid MFA token. | Your session timed out after 15 minutes of inactivity. Click OK, return to \`/login\`, re-enter your \`@olatech.com\` credentials, and authenticate via MFA. |
| \`ERR-403-RBAC\` | Access Denied: Staff role lacks permission for target module. | You attempted to access a restricted route (e.g., \`/finance\` or database backup purge). Restrict operations to \`/admissions\` and \`/docs\`. |
| \`ERR-409-DUP\` | Database Conflict: Duplicate Reference ID or email address collision. | You attempted to manually create a record with an email that already exists in SQLite/PostgreSQL. Use search bar to find existing profile and follow SOP-001. |
| \`ERR-422-VALID\` | Form Validation Error: Required field missing during profile save. | You attempted to toggle status to \`Enrolled\` without selecting an \`Assigned Cohort\`, or left mandatory Rejection Reason Code blank. Complete all required dropdowns and save again. |
| \`ERR-500-SYNC\` | Database Write Conflict / Concurrent Modification. | Another staff member modified the same candidate file at the exact same second. Click Revert, refresh browser (\`F5\`), and re-apply changes. |
| \`ERR-502-SMTP\` | Email Gateway Timeout during broadcast dispatch. | The external SMTP mail server timed out while sending a bulk broadcast. Navigate to Communication Center history, isolate failed rows, and click **"Resend Failed"**. |
| \`ERR-503-LAB\` | Physical Workstation Inventory Exhaustion. | You checked \`Needs Physical Workstation\` but the campus lab PC pool is 100% assigned. Contact Operations Lead to commission spare workstations or transfer candidate to remote cohort. |

---
================================================================================
                         END OF OPERATIONAL MANUAL
              OLATECH SCHOOL OF PROGRAMMING — CORPERSTECH v1.0
                  GOLD MASTER CERTIFIED OPERATIONAL GUIDE
================================================================================
`;
