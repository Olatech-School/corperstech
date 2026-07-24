export const ADMISSIONS_MANUAL_PART_1 = `# 1. Professional Cover Page

================================================================================
                              CORPERSTECH ECOSYSTEM
                          OLATECH SCHOOL OF PROGRAMMING
================================================================================

                     ADMISSIONS OPERATIONS MANUAL
        Standard Operating Procedures, Comprehensive User Guide, and
             Daily Operational Handbook for Admissions Officers

================================================================================
  Document Classification : CONFIDENTIAL INTERNAL OPERATIONAL MANUAL
  Version                 : Version 1.0 Gold Master
  Target Audience         : Newly Employed & Senior Admissions Officers
  Applicable Systems      : CorpersTech Admissions CRM v1.0 (\`/admissions\`)
  Authoring Body          : Operations Director & Admissions Lead
  Published Date          : Current Academic Release (July 2026)
================================================================================

---

# 2. Comprehensive Table of Contents

## Chapter 1: Overview, Objectives & Staff Authority
* 1.1 Purpose of this Manual & Staff Scope
* 1.2 Final Authority of the Admissions Officer
* 1.3 Core Operational Objectives
  * 1.3.1 Safeguarding Candidate Quality
  * 1.3.2 Standardizing Student Admissions & Cohort Allocation
  * 1.3.3 Maintaining Strict Service Level Agreements (SLAs)
* 1.4 Security & Data Protection Governance (NDPR Compliance)

## Chapter 2: System Architecture, Role Permissions & Access Control
* 2.1 Role-Based Access Control (RBAC) Hierarchy
* 2.2 Admissions Officer (\`Admissions\`) vs. Super Admin (\`Super Admin\`) Permissions
* 2.3 Authentication Protocol & Multi-Factor Authentication (MFA)
* 2.4 Session Governance & Inactivity Lockouts

## Chapter 3: Deep-Dive Documentation of Every Admissions Module
* 3.1 Admissions Command Center Dashboard (\`/admissions\`)
* 3.2 Applicant Management System & Registry Grid (\`/admissions/applicants\`)
* 3.3 Candidate Vetting & Profile Drawer (\`/admissions/applicants/:id\`)
* 3.4 Communication Center (\`/admissions/communications\`)
* 3.5 Cohort Management & Academic Tracking (\`/admissions/cohorts\`)
* 3.6 Transportation Management & Logistics (\`/admissions/transport\`)
* 3.7 Orientation Checklist & Onboarding Tracker
* 3.8 Comprehensive Reports & Analytics Engine (\`/admissions/reports\`)
* 3.9 Security Audit Logs & Compliance Monitoring (\`/admissions/audit\`)
* 3.10 Quick Actions Ribbon & Global Search
* 3.11 System Notifications Hub & SLA Alerts

## Chapter 4: Daily Operational Workflow for an Admissions Officer
* 4.1 Chronological Shift Schedule
  * Phase 1: Morning System Readiness & Queue Triage (08:00 AM - 09:30 AM)
  * Phase 2: Candidate Screening, Vetting & Document Verification (09:30 AM - 13:00 PM)
  * Phase 3: Administrative Lunch Break & Workstation Security (13:00 PM - 14:00 PM)
  * Phase 4: Cohort Allocation, Modality Pairing & Dispatch (14:00 PM - 16:30 PM)
  * Phase 5: Daily Shift Wrap-Up, SLA Audit & Handover (16:30 PM - 17:00 PM)
* 4.2 Standard Operating Procedure (SOP) Reference Table
  * SOP-001: Overnight Queue Triage & Duplication Resolution Protocol
  * SOP-002: Comprehensive Candidate Vetting & Document Verification
  * SOP-003: Cohort Allocation, Seat Hard-Cap Governance & Enrollment
  * SOP-004: Handling Blurry Scans & Document Re-Upload Requests
  * SOP-005: Executing Mid-Semester Inter-Cohort Student Transfers
  * SOP-006: Pre-Orientation Friday Readiness Audit & Bulk Reminders
  * SOP-007: Soft-Deletion Recovery & Archival Profile Restoration
  * SOP-008: Weekly Security Audit Ledger Inspection & Exfiltration Check

## Chapter 5: Real-World Operational Scenarios & Resolution Protocols
* 5.1 Scenario 1: Duplicate Registration Detection & Resolution Protocol
* 5.2 Scenario 2: Wrong Learning Track Selection After Enrollment
* 5.3 Scenario 3: Physical Shuttle Bus Capacity Exhaustion & Transit Re-Routing
* 5.4 Scenario 4: Blurry or Inaccessible Document Uploads During Vetting
* 5.5 Scenario 5: Emergency Course Transfer Request Post-Kickoff
* 5.6 Scenario 6: Student Postponement & Deferral of Admission
* 5.7 Scenario 7: Student Voluntary Withdrawal from Program
* 5.8 Scenario 8: Recovering an Accidentally Soft-Deleted or Archived Application

## Chapter 6: Operational Wisdom: Best Practices, Common Mistakes, Tips & Warnings
* 6.1 Best Practices for Admissions Excellence
* 6.2 Common Mistakes & Prevention Strategies
* 6.3 Power Tips from Experienced Admissions Leads
* 6.4 Critical System Warnings & Security Alerts

## Chapter 7: Admissions Quality Checklists
* 7.1 Daily Morning Readiness Checklist (08:00 - 08:30 AM)
* 7.2 Individual Applicant Vetting Checklist (Per Candidate)
* 7.3 Pre-Orientation Roster & Handoff Checklist (Friday Afternoon / Pre-Kickoff)
* 7.4 Weekly Compliance & Audit Review Checklist (Friday 17:00 PM)

## Chapter 8: Frequently Asked Questions (40+ Realistic Questions & Answers)
* 8.1 Section A: System Access, Permissions & Security (Q1 - Q8)
* 8.2 Section B: Applicant Screening, Vetting & Interviews (Q9 - Q18)
* 8.3 Section C: Cohort Management, Tracks & Allocations (Q19 - Q26)
* 8.4 Section D: Transportation, Stipends & Physical Labs (Q27 - Q34)
* 8.5 Section E: Technical Troubleshooting, Exporting & Audit Logs (Q35 - Q42)

## Chapter 9: Appendix & Reference Glossaries
* 9.1 Glossary of Terms & Acronyms
* 9.2 Standard Email & SMS Communication Templates
  * 9.2.1 Template 01: Official Admissions Acceptance & Cohort Welcome (Email)
  * 9.2.2 Template 02: Interview Invitation & Screening Scheduling (Email / SMS)
  * 9.2.3 Template 03: Application Rejection & Future Cohort Advisory (Email)
  * 9.2.4 Template 04: Orientation Reminder & Physical Campus Checklist (SMS Broadcast)
  * 9.2.5 Template 05: Urgent Document Clarification / Re-upload Request (Email)
* 9.3 System Error Codes and Administrative Remedies

---

# Chapter 1: Overview, Objectives & Staff Authority

## 1.1 Purpose of this Manual & Staff Scope
The **Admissions Operations Manual** is the authoritative, binding operational document governing all admission, candidate vetting, enrollment, and cohort allocation procedures within the CorpersTech ecosystem and the Olatech School of Programming. This manual establishes standardized workflows designed to eliminate subjectivity, prevent operational errors, ensure strict compliance with federal data privacy laws, and guarantee an elite candidate experience.

Every newly employed Admissions Officer must complete a thorough study of this handbook during their mandatory onboarding week. Senior Admissions Leads are required to reference this manual when conducting quality audits or resolving edge-case candidate disputes. Compliance with the Standard Operating Procedures (SOPs) detailed herein is mandatory; willful deviation without written authorization from the Operations Director constitutes an administrative infraction.

## 1.2 Final Authority of the Admissions Officer
Within the CorpersTech administrative hierarchy, the assigned Admissions Officer holds primary operational authority over the evaluation, vetting, and initial lifecycle status of candidate applications. While system algorithms provide automated scoring and duplication intelligence, the human officer exercises final judgment in approving credentials, conducting oral screening interviews, and assigning candidates to appropriate physical or remote learning cohorts.

An Admissions Officer's decision to approve or reject a candidate record is legally binding for that academic session, subject only to formal audit reversal by the Super Admin or academic appeal review by the Admissions Lead. Officers are expected to exercise this authority with absolute objectivity, fairness, and professional integrity.

## 1.3 Core Operational Objectives

### 1.3.1 Safeguarding Candidate Quality
The Olatech School of Programming maintains a rigorous curriculum requiring high logical reasoning aptitude and professional commitment. The primary objective of the admissions team is to protect academic quality by meticulously verifying undergraduate degrees, NYSC Call-Up letters, and technical readiness before granting admission.

### 1.3.2 Standardizing Student Admissions & Cohort Allocation
To prevent classroom overcrowding and maintain our certified 30:1 student-to-instructor educational ratio, officers must execute cohort allocations according to strict capacity formulas. Physical lab allocations must correspond precisely to physical workstation inventory across our Lagos and Abuja hubs.

### 1.3.3 Maintaining Strict Service Level Agreements (SLAs)
In the competitive technology education sector, response velocity directly impacts candidate conversion. CorpersTech enforces an unconditional **48-Hour Turnaround SLA**: no submitted application may remain in the \`Pending\` state for longer than 48 hours (2 business days) without an initial vetting action or document clarification request.

## 1.4 Security & Data Protection Governance (NDPR Compliance)
As an institution processing personal identifiers, academic records, bank account numbers (BVN), and residential addresses of Nigerian National Youth Service Corps members, CorpersTech operates under strict adherence to the **Nigeria Data Protection Regulation (NDPR)**.
* **Confidentiality Mandate**: All candidate records viewed within \`/admissions\` are confidential. Officers are strictly prohibited from discussing candidate files outside secure administrative channels.
* **Zero Data Exfiltration Policy**: Exporting candidate data to unauthorized external devices, personal cloud storage, or private email accounts is a Class-1 security violation resulting in immediate employment termination and legal reporting.
* **Workstation Security**: Workstations must never be left unattended with the CRM interface open. Automated 15-minute inactivity session lockouts are enforced system-wide.

---

# Chapter 2: System Architecture, Role Permissions & Access Control

## 2.1 Role-Based Access Control (RBAC) Hierarchy
The CorpersTech platform utilizes a granular Role-Based Access Control (RBAC) security architecture to segregate administrative duties and prevent unauthorized system modifications. Each staff account is assigned a cryptographic JWT role claim upon login that governs route accessibility and UI rendering.

| Role Title | Primary Access Scope | Restricted / Blocked Modules | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Full System Access (\`/*\`) | None (Unrestricted) | System configuration, staff user provisioning, global audit log oversight, database backup/restore, role elevation. |
| **Admissions Lead** | \`/admissions/*\`, \`/docs\` | \`/finance\`, \`/settings/system\`, global SQL query tools | Managing admissions team, overriding SLA exceptions, creating new learning cohorts, reviewing weekly compliance reports. |
| **Admissions Officer** | \`/admissions/*\`, \`/docs\` | Cohort creation, financial ledgers, staff management, permanent database deletions | Daily candidate vetting, document screening, conducting telephone interviews, status toggles, transport routing. |
| **Operations Officer** | \`/operations/*\`, \`/transport\` | Candidate academic vetting, finance ledgers, staff provisioning | Campus lab PC maintenance, shuttle bus driver manifests, facility management, physical barcode ID printing. |
| **Finance Officer** | \`/finance/*\`, \`/admissions/transport\` | Academic vetting, curriculum edits, system configuration | Transport stipend calculation, BVN verification approval, payroll synchronization, contractor disbursements. |
| **Career / Support Lead** | \`/career/*\`, \`/support/*\` | Admissions vetting, financial ledgers, system settings | Student job placement, corporate hiring partner liaison, ticketing system resolution, alumni tracking. |

## 2.2 Admissions Officer (\`Admissions\`) vs. Super Admin (\`Super Admin\`) Permissions
Admissions Officers operate within a dedicated administrative sandbox designed to streamline enrollment workflows while protecting global system stability.
* **What an Admissions Officer CAN do**: View all registered applicant profiles; edit candidate contact information (phone, address); inspect uploaded documents; add interview notes; toggle application statuses (\`Pending\`, \`Enrolled\`, \`Waitlisted\`, \`Rejected\`); assign students to active cohorts; assign shuttle bus routes; send single or bulk SMS/email dispatches via pre-approved templates; export filtered CSV reports for assigned cohorts; perform soft-deletions.
* **What an Admissions Officer CANNOT do**: Create or delete administrative staff accounts; create or modify learning cohort capacity hard-caps; permanently delete (hard purge) records from the database; modify financial stipend payout amounts; access the system audit log database directly; alter platform environment variables or system settings.

## 2.3 Authentication Protocol & Multi-Factor Authentication (MFA)
To access the administrative workspace at \`portal.corpers.tech/login\`, all staff members must complete a mandatory two-step cryptographic authentication handshake:
1. **Primary Credential Verification**: Enter official institutional email address (must terminate in \`@olatech.com\` or \`@corpers.tech\`) and complex password (minimum 12 characters, requiring uppercase, lowercase, numeric, and special symbols).
2. **Multi-Factor Authentication (TOTP MFA)**: Upon password validation, enter the time-based 6-digit verification code generated by an authorized authenticator app (Google Authenticator, Microsoft Authenticator, or 1Password). SMS-based OTP is prohibited for staff logins due to SIM-swapping vulnerabilities.

## 2.4 Session Governance & Inactivity Lockouts
* **15-Minute Auto-Timeout**: To prevent unauthorized access on shared campus laboratory workstations, the backend enforces a strict 15-minute idle timer. If no mouse movement, keystroke, or API request is detected within 900 seconds, the active JWT token is invalidated, the UI blurs, and the user is redirected to \`/login\`.
* **Single-Session Enforcement**: Staff credentials cannot be actively authenticated across multiple physical IP addresses simultaneously. Attempting to log into a laptop while an active session exists on a campus desktop will automatically terminate the older desktop session and generate an advisory notice in the Security Audit Log.

---

# Chapter 3: Deep-Dive Documentation of Every Admissions Module (Part 1)

## 3.1 Admissions Command Center Dashboard (\`/admissions\`)
The **Admissions Command Center Dashboard** serves as the primary executive landing page and real-time operational hub for all Admissions Officers. Engineered to provide instant institutional situational awareness, the dashboard synthesizes candidate registration telemetry, pipeline conversion bottlenecks, and active SLA compliance metrics into high-contrast visual components.

### 3.1.1 UI Layout & Navigation Architecture
The Command Center interface is structured into four distinct horizontal visual tiers:
1. **Top System Status & Quick Actions Header**: Houses the real-time system health indicator pill (\`● DATABASE ONLINE\`), active staff identification banner, and emergency global search bar.
2. **Key Performance Indicator (KPI) Summary Ribbon**: A four-card metric grid displaying real-time aggregate statistics with historical trend comparisons.
3. **Interactive Analytical Charting Deck**: Two responsive visual graphics rendering registration velocity curves and learning track distribution charts.
4. **Actionable Pipeline Summary & Urgent Alerts Panel**: Displays SLA breach warnings, recent registration feeds, and immediate quick-action execution triggers.

### 3.1.2 Detailed Screen Elements & Table Columns
* **Total Applications Card**: Displays the absolute count of all registration records stored in the database. Includes a dynamic green/red delta badge showing percentage growth over the previous 30-day operational cycle.
* **Pending Reviews Card**: Highlights the exact volume of candidate files currently awaiting initial screening or verification. Styled with an amber warning accent if the queue exceeds 50 candidates.
* **Admitted / Enrolled Card**: Reflects the cumulative count of students who have successfully passed credential vetting and have been assigned to an active learning cohort.
* **Rejection / Dropout Rate Card**: Shows the percentage of processed applications that were declined due to credential non-compliance or academic prerequisite failures.
* **Registration Velocity Chart**: A dynamic area spline graph mapping daily application submissions over the trailing 14 business days.
* **Track Distribution Pie Chart**: A multi-color radial visualization breaking down applicant preferences across our core learning disciplines.

---

## 3.2 Applicant Management System & Registry Grid (\`/admissions/applicants\`)
The **Applicant Management System** is the core database interface and operational powerhouse of the Admissions CRM. It presents a high-performance, paginated data grid containing every individual who has ever registered for Olatech School of Programming.

### 3.2.1 UI Layout & Navigation Architecture
1. **Multi-Parameter Search & Advanced Filtering Bar**: A persistent top ribbon allowing simultaneous filtering by status, track, modality, campus, state of origin, and laptop ownership.
2. **Bulk Action & Export Ribbon**: A floating action toolbar that appears when one or more candidate rows are selected via checkboxes.
3. **Master Applicant Data Grid**: A responsive, sortable table displaying core candidate attributes with color-coded status badges and visual health indicators.
4. **Pagination & Record Footprint Footer**: Controls page navigation, rows-per-page adjustments (10, 25, 50, 100), and displays total filtered dataset counts.

### 3.2.2 Detailed Table Columns
* **Checkbox Column**: Allows single, multi-row, or universal selection for bulk operations.
* **Applicant Name & Avatar**: Displays the candidate's legal full name alongside a dynamic initials avatar.
* **Reference ID (\`Ref ID\`)**: A unique, immutable alphanumeric tracking code generated upon registration (e.g., \`OLT-2026-8849\`).
* **NYSC State & Batch**: Identifies the applicant's current NYSC deployment state and service stream batch.
* **Selected Track**: The candidate's chosen computing discipline.
* **Modality Tag**: Badged as either 🏢 **Physical On-Site** or 🌐 **Virtual Remote**.
* **Laptop Status Indicator**: Displays a solid green checkmark (\`✔ Owns Laptop\`) or a high-alert red icon (\`✖ Needs Lab PC\`).
* **Status Badge**: Prominent color-coded pill indicating lifecycle state: 🟡 **Pending**, 🟢 **Enrolled**, 🔵 **Waitlisted**, 🔴 **Rejected**, or ⚪ **Archived**.
* **Submission Date (\`createdAt\`)**: Timestamp showing exact date and time of application receipt.
* **Actions Column**: Quick-access icon buttons: **[View Profile Drawer]**, **[Quick Edit]**, and **[Soft Delete / Archive]**.

---

## 3.3 Candidate Vetting & Profile Drawer (\`/admissions/applicants/:id\`)
The **Candidate Vetting Profile Drawer** is the comprehensive inspection console where the actual intellectual work of admissions vetting takes place. When an Admissions Officer clicks on any student row in the registry grid, this slide-out panel emerges from the right side of the screen without navigating away from the parent table.

### 3.3.1 UI Layout & Tab Architecture
1. **Header Identification Banner**: Displays applicant photo, legal name, Ref ID, current status badge, and immediate quick-action buttons.
2. **Duplication Intelligence Alert Bar**: A conditional top warning banner that dynamically appears if the system detects matching phone numbers, emails, or physical addresses with another registered profile.
3. **Tab Navigation Ribbon**: Four distinct analytical tabs: **Personal Info**, **Academic & NYSC**, **Technical Assessment**, and **Admin Vetting Logs**.
4. **Action & Decision Footer**: A fixed bottom bar containing status toggle controls, assigned cohort selector dropdown, and the final **[Save Profile Changes]** execution button.

### 3.3.2 Tab Breakdown
* **Personal Info Tab**: Full Legal Name, Date of Birth, Gender, Residential Address, Primary Email, Verified WhatsApp Phone, Emergency Contact, and Disability / Special Needs statement.
* **Academic & NYSC Tab**: Higher Education Institution attended, Degree Discipline, Graduation Year, Class of Degree, NYSC Call-Up Number, NYSC State Code, Current PPA organization name and address, and Embedded Document Viewer for Call-Up letters and certificates.
* **Technical Assessment Tab**: Previous coding experience self-rating, GitHub Profile URL, LinkedIn Profile URL, Personal Portfolio link, and Automated Onboarding Quiz Score.
* **Admin Vetting Logs Tab**: **Interviewer Comments Field** (multi-line rich text area for interview observations) and **Audit Timeline Log** (chronological feed showing every administrative modification).

---

## 3.4 Communication Center (\`/admissions/communications\`)
The **Communication Center** is the centralized messaging engine responsible for managing all outgoing email and SMS correspondence between the institute and applicant pool. Built to eliminate disjointed external email clients, this module enforces institutional brand consistency through pre-approved Gold Master message templates.

### 3.4.1 UI Layout & Navigation Architecture
1. **Left Template Library & Channel Selector**: Allows staff to toggle between Email and SMS channels and select from categorized communication templates.
2. **Center Message Composer & Variable Injector**: A rich-text editing canvas equipped with dynamic handlebars merge-tag injection tools (\`{{applicant_name}}\`, \`{{assigned_cohort}}\`, \`{{orientation_date}}\`).
3. **Right Target Audience Selector & Dispatch History**: Controls recipient selection (individual, filtered list, or entire cohort roster) and displays real-time SMTP/SMS gateway delivery receipts.

### 3.4.2 Detailed Screen Elements & Dispatch Controls
* **Channel Selector Checkboxes**: Choose communication channels:
  * \`[x] Send via Primary Email\` (Uses official SMTP dispatch engine).
  * \`[x] Send via SMS Broadcast\` (Routes via high-priority SMS gateway for urgent alerts).
  * \`[x] Send to In-App Student Console Notification\` (Appears in student dashboard).
* **Subject Line Field**: Pre-populated by template but editable by senior admissions officers.
* **Message Body Editor**: A rich-text editor supporting bold, italics, hyperlinks, and bulleted lists.
* **Attachment Uploader**: Allows attaching official PDF onboarding guides, campus maps, or scholarship terms (maximum 10MB per dispatch).
* **[Test Dispatch] Button**: Sends a copy of the formatted message to the currently logged-in officer's staff email for visual verification before broadcasting.
* **[Send Broadcast Now] Button**: Initiates immediate transmission to selected recipient(s).
* **[Schedule for Later] Toggle**: Allows setting a future date and time for automated dispatch (e.g., scheduling orientation reminders to send at 07:00 AM on Sunday).

### 3.4.3 Communication History & Delivery Logs
The lower section of the Communication Center displays a paginated table of all historical dispatches sent to candidates:
* **Log Columns**: Timestamp, Recipient Name/Email, Subject Line, Channel (Email/SMS), Sender Staff Name, and Delivery Status Badge.
* **Delivery Status Indicators**:
  * 🟢 **Delivered**: Confirmed received by recipient mail server or telecom provider.
  * 🟡 **Queued**: Processing through broadcast pipeline.
  * 🔴 **Bounced / Failed**: Delivery failed due to invalid email syntax or full inbox. Clicking the red badge displays the exact SMTP error code for troubleshooting.
* **[Resend Failed] Action**: A quick button that attempts a single re-transmission for bounced messages after correcting contact details.

---

*(Proceeding to Part 2: Chapters 3.5 through 6...)*
`;
