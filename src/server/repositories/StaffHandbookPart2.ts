export const STAFF_HANDBOOK_PART_2 = `# 6. Organizational Structure & Authority

## 6.1 Institutional Command Hierarchy
Olatech School of Programming operates under a streamlined, functional organizational structure designed to maximize accountability while promoting cross-departmental agility. Every staff member must understand their reporting lines, authority boundaries, and collaborative peers.

\`\`\`
+-----------------------------------------------------------------------------------+
|                           EXECUTIVE DIRECTOR / SUPER ADMIN                        |
|                     (Ultimate System & Institutional Authority)                   |
+-----------------------------------------+-----------------------------------------+
                                          |
             +----------------------------+----------------------------+
             |                                                         |
             v                                                         v
+-------------------------+                               +-------------------------+
|    OPERATIONS OFFICER   |                               |     FINANCE OFFICER     |
| (Logistics, Facilities, |                               |  (Budgets, Stipends,    |
|   Transport & Systems)  |                               |   Vendor Disbursements) |
+------------+------------+                               +------------+------------+
             |                                                         |
             +----------------------------+----------------------------+
                                          |
             +----------------------------+----------------------------+
             |                            |                            |
             v                            v                            v
+-------------------------+  +-------------------------+  +-------------------------+
|   ADMISSIONS OFFICER    |  |     CAREER OFFICER      |  |     SUPPORT OFFICER     |
|  (Enrollment Vetting,   |  | (Placement, AI Scraper, |  |  (Helpdesk Tickets,     |
|   Checklists & Onboard) |  |  Employer Partnerships) |  |   Lab Infrastructure)   |
+-------------------------+  +-------------------------+  +-------------------------+
\`\`\`

---

## 6.2 Detailed Role Definition Matrix

### 6.2.1 Super Admin (Executive Director & Chief Systems Architect)
* **Core Responsibilities**: Overall strategic leadership of Olatech School of Programming. Absolute governance of the CorpersTech platform architecture, database integrity, financial auditing, and institutional partnerships. Responsible for system backups, disaster recovery execution, and final policy approval.
* **Authority Level & Permissions**: **Level 5 (Unrestricted Global Access)**. Can create, edit, modify, soft-delete, and permanently restore any record across all modules. Can provision new staff accounts, modify role permissions, trigger database restorations, and override automated system rules.
* **Collaboration Protocols**: Conducts weekly executive syncs with Operations, Finance, Admissions, and Career Officers. Receives daily automated statistical summaries and incident reports.
* **Reporting Relationship**: Reports to the Olatech Board of Advisors and institutional governance trustees. Direct supervisor to all departmental leads.

### 6.2.2 Admissions Officer (Lead Registrar & Student Vetting Specialist)
* **Core Responsibilities**: Managing the entire front-end student intake pipeline. Responsible for reviewing incoming enrollment applications from NYSC corps members, verifying call-up letters and academic certificates, executing 6-point administrative onboarding checklists (Docs, Laptop, Pay, Orient, WhatsApp, Ready), and transitioning applicant statuses from *Pending* to *Approved* or *Enrolled*.
* **Authority Level & Permissions**: **Level 3 (Admissions & Student CRM Scope)**. Full read, write, and update permissions within the Admissions Module and Student Registry. Cannot modify financial ledgers, system backup states, or staff user accounts. Can append administrative notes and update student transportation preferences.
* **Collaboration Protocols**: Collaborates daily with **Support Officers** to resolve applicant login/registration hurdles. Handshakes with **Operations/Transportation Officers** upon approving new enrollees to ensure bus shuttle seating allocation.
* **Reporting Relationship**: Reports directly to the Executive Director / Super Admin.

### 6.2.3 Career Officer (Placement Specialist & Opportunity Manager)
* **Core Responsibilities**: Driving student career launch and employer matching. Manages the Recruitment Intelligence Engine, configures automated AI web scrapers (scraping LinkedIn, Jobberman, MyJobMag, and Remote.co), audits AI confidence scores, conducts 4-tier opportunity verification checks, and publishes verified job vacancies to the student Career Hub. Manages the AI CV Evaluator and student mentorship scheduling.
* **Authority Level & Permissions**: **Level 3 (Career Hub & AI Engine Scope)**. Full read, write, update, and publication permissions across Career Resources, Job Opportunities, Recruitment Applications, and Employer Partner directories. Can trigger manual AI scraper discovery cycles and edit scraped vacancy metadata.
* **Collaboration Protocols**: Collaborates closely with **Admissions** to track graduating cohorts ready for placement. Interfaces with external **Employer Partners** to curate exclusive tech roles for Olatech alumni.
* **Reporting Relationship**: Reports directly to the Executive Director / Super Admin.

### 6.2.4 Operations Officer (Logistics, Transport & Facilities Lead)
* **Core Responsibilities**: Ensuring seamless physical and digital infrastructure execution. Manages campus lab facilities, monitors student attendance metrics, oversees the Transportation & Shuttle Coordination module (bus routes, driver manifests, pickup point optimization), and manages general institutional enquiries.
* **Authority Level & Permissions**: **Level 3 (Operations & Logistics Scope)**. Full read and write permissions within the Operations Center, Transportation Module, and Enquiry Management dashboards. Can generate transport manifests and update shuttle departure schedules.
* **Collaboration Protocols**: Works hand-in-glove with **Admissions** to forecast transport demands for new NYSC streams. Collaborates with **Finance** to audit transport fuel budgets and bus maintenance vendor invoices.
* **Reporting Relationship**: Reports directly to the Executive Director / Super Admin.

### 6.2.5 Finance Officer (Financial Comptroller & Vendor Management)
* **Core Responsibilities**: Managing institutional cash flows, student scholarship allocations, instructor stipends, hardware (laptop) procurement budgets, and vendor disbursements. Ensures financial data integrity and generates monthly fiscal reports.
* **Authority Level & Permissions**: **Level 3 (Finance & Procurement Scope)**. Read and write access to financial reporting modules, scholarship registries, and vendor invoices. No access to alter student grades or technical system configurations.
* **Collaboration Protocols**: Syncs with **Operations** on facility maintenance expenses and with **Admissions** on fee-waiver/scholarship validations.
* **Reporting Relationship**: Reports directly to the Executive Director / Super Admin.

### 6.2.6 Support Officer (Technical Helpdesk & Lab Systems Engineer)
* **Core Responsibilities**: First line of defense for student and staff technical support. Resolves command center login failures, troubleshoots lab hardware/network outages, assists students with software environment setup (VS Code, Git, Node.js), and manages internal ticket queues.
* **Authority Level & Permissions**: **Level 2 (Helpdesk & Diagnostic Scope)**. Read access to student profiles and system error logs; write access to support ticket resolutions and lab maintenance schedules. Cannot delete records or modify institutional policies.
* **Collaboration Protocols**: Assists **Admissions** during heavy intake windows to resolve applicant technical glitches. Escalates severe server or database anomalies directly to the **Super Admin**.
* **Reporting Relationship**: Reports to the Operations Officer and Super Admin.

---

# 7. Staff Code of Conduct & Ethics

## 7.1 Professional Behavior & Workplace Poise
All staff members represent the Olatech School of Programming brand both on campus and in digital spaces. Employees must conduct themselves with dignity, composure, and absolute fairness. Emotional outbursts, use of profane language, or unprofessional arguments with students, colleagues, or external stakeholders are strictly prohibited and constitute grounds for immediate disciplinary review.

## 7.2 Confidentiality & Data Protection (NDPR & GDPR Compliance)
In the course of your duties, you will have access to sensitive Personal Identifiable Information (PII) belonging to NYSC corps members, including full names, personal phone numbers, email addresses, dates of birth, states of origin, NYSC call-up numbers, academic histories, and Place of Primary Assignment (PPA) locations.
* **Strict Non-Disclosure**: You must NEVER disclose, export, sell, or share student PII with unauthorized third parties, external marketers, or unverified employers.
* **Local Data Storage Rule**: Do not download student lists onto personal, unencrypted USB drives or personal mobile phones. All administrative work must be conducted securely within the authenticated CorpersTech Command Center.
* **Session Termination**: Always log out of your administrative session when leaving your desk or workstation. Never save command center passwords in shared or public browser computers.

## 7.3 Mutual Respect & Anti-Harassment Policy
Olatech School of Programming maintains a **Zero-Tolerance Policy** regarding harassment, discrimination, intimidation, or bullying.
* **Abuse of Authority**: Staff members hold positions of authority over corps members. Any attempt to exploit this authority for personal favors, financial kickbacks, or romantic/sexual advances is a severe violation of institutional ethics and will result in immediate termination and reporting to relevant NYSC authorities.
* **Equitable Treatment**: All corps members and colleagues must be treated with equal respect regardless of gender, ethnicity, religious belief, socioeconomic background, or state of origin.

## 7.4 Communication Ethics
* **Truthfulness**: All written and verbal communications from staff must be accurate. Do not make misleading promises to students regarding guaranteed salaries or automatic job placements without standard qualification fulfillment.
* **Official Channels Only**: Professional correspondence must occur through official institutional email addresses (\`@olatechschool.com\` or authorized \`@gmail.com\` operational aliases) and official CorpersTech dashboards. Avoid conducting official administrative approvals via private personal messaging.

## 7.5 Dress Code & Corporate Appearance
* **Campus & Lab Days**: Smart casual attire is required. Clothes must be clean, neat, and professional. Olatech branded polos or hoodies are highly encouraged during training sessions.
* **Official Events & Employer Partner Meetings**: Formal corporate business attire (suits, ties, formal dresses, or pristine traditional executive attire) is mandatory when hosting NYSC state coordinators, corporate employers, or press executives.

## 7.6 Conflict of Interest
* **No Outside Paid Tutoring**: Staff members and instructors are prohibited from charging active Olatech students private fees for supplementary tutoring, mentorship, or assignment completion.
* **Vendor Neutrality**: Staff members involved in procurement (laptops, transport buses, lab equipment) must not accept gifts, kickbacks, or financial commissions from external vendors. Any familial or financial tie to a prospective vendor must be disclosed immediately to the Executive Director.

## 7.7 Social Media Guidelines
* **Brand Advocacy**: Staff are encouraged to celebrate student graduation milestones and showcase professional achievements on platforms like LinkedIn and X (formerly Twitter), using official hashtags (\`#OlatechProgramming\`, \`#CorpersTech\`, \`#NYSCTech\`).
* **Prohibited Postings**: Never post screenshots of internal Command Center dashboards containing student names, phone numbers, or administrative notes. Never engage in public online disputes regarding institutional policies or NYSC administrative affairs.

---

# 8. Using the Command Center (Module Guide)

The CorpersTech Command Center is partitioned into 10 specialized operational modules. The following guide details the purpose, role access, and core functionalities of each module:

\`\`\`
+-----------------------------------------------------------------------------+
|                        CORPERSTECH COMMAND CENTER                           |
+-----------------------------------------------------------------------------+
|  [1. Admissions]      [2. Career Launch]   [3. Recruitment AI]              |
|  [4. Transportation]  [5. Operations]      [6. Documentation]               |
|  [7. Backup Center]   [8. Reports & KPI]   [9. Settings & RBAC]             |
|  [10. Notifications Panel & Audit Log Banner]                               |
+-----------------------------------------------------------------------------+
\`\`\`

## 8.1 Module 1: Admissions & Enrollment CRM
* **Purpose**: Governs student onboarding, application vetting, and cohort management.
* **Primary Roles**: Admissions Officer, Super Admin (Read-only for Support).
* **Key Features**:
  * **Enrollee Table & Filtering**: Search and filter thousands of students by NYSC Batch (e.g., *2026 Batch B Stream I*), gender, course of study, or enrollment status (*Pending*, *Approved*, *Enrolled*, *Rejected*).
  * **6-Point Vetting Checklist**: Interactive modal allowing staff to verify: (1) Documents verified, (2) Laptop available, (3) Payment/Scholarship confirmed, (4) Orientation completed, (5) WhatsApp group joined, and (6) Ready for classes.
  * **Admin Notes & Audit Logging**: Append timestamped observations to student dossiers without overwriting previous notes.

## 8.2 Module 2: Career Launch & Placement Hub
* **Purpose**: Connects students to industry employment, career coaching, and technical skill showcasing.
* **Primary Roles**: Career Officer, Super Admin.
* **Key Features**:
  * **AI CV Evaluator**: Automated scoring engine that analyzes student resumes against target tech roles, providing actionable feedback on formatting, keyword density, and project descriptions.
  * **Verified Opportunity Board**: Curated repository of internships, junior engineering roles, and remote contracts available to students.
  * **Success Stories & Showcase Gallery**: Administrative interface to publish high-performing student capstone projects and alumni testimonials.

## 8.3 Module 3: Recruitment AI Discovery Engine & Scraper
* **Purpose**: Automates the ingestion, scoring, and verification of tech job openings across the African digital ecosystem.
* **Primary Roles**: Career Officer, Super Admin.
* **Key Features**:
  * **Multi-Source Scraper Configuration**: Manage automated discovery schedules targeting LinkedIn Nigeria, Jobberman, MyJobMag, Remote.co, and TechCabal.
  * **Confidence Scoring & AI Categorization**: Evaluates scraped roles using Google Gemini AI to assign confidence scores (0–100%) based on job description legitimacy, salary transparency, and tech stack alignment.
  * **4-Tier Verification Workflow**: Transition discovered opportunities through *Unverified* -> *Under Review* -> *Verified & Approved* -> *Published to Students*.
  * **Change Log & Duplicate Detector**: Automatically flags duplicate vacancy postings and tracks historical salary or deadline modifications.

## 8.4 Module 4: Transportation & Logistics Coordination
* **Purpose**: Manages student bus shuttles, route optimization, and driver seat manifests.
* **Primary Roles**: Operations Officer, Super Admin.
* **Key Features**:
  * **Shuttle Route Mapping**: Manage active bus routes across Lagos (e.g., *Mainland Yaba Hub*, *Victoria Island Campus*) and Abuja (e.g., *Garki CBD*, *Kubwa Express*).
  * **Real-Time Seat Manifests**: Track bus capacity, passenger counts, and assigned departure times. Automatically synchronizes with enrollee transportation preferences.
  * **Driver & Vehicle Registry**: Maintain records of assigned shuttle drivers, bus license plates, and maintenance schedules.

## 8.5 Module 5: Operations & Enquiry Center
* **Purpose**: Real-time institutional health monitoring and general public enquiry resolution.
* **Primary Roles**: Operations Officer, Support Officer, Super Admin.
* **Key Features**:
  * **Live Statistics Compilation**: Aggregates total active students, staff count, pending applications, and daily system reads.
  * **Contact Enquiry Inbox**: Review, assign, and respond to incoming messages submitted via the public portal or student helpdesk.
  * **Facility & Lab Scheduling**: Coordinate physical classroom utilization and instructor time slots.

## 8.6 Module 6: Documentation Center (Gold Master Repository)
* **Purpose**: The central digital library hosting all certified institutional handbooks, standard operating procedures, and training manuals.
* **Primary Roles**: All Staff Members (Read/Download); Super Admin & Department Leads (Publish/Edit).
* **Key Features**:
  * **Gold Master Manual Registry**: Instant access to the *Olatech Staff Handbook*, *Admissions Operations Manual*, *Career Placement Handbook*, *Recruitment AI Manual*, and *Transportation Manual*.
  * **Print-to-PDF Engine**: Compiles raw markdown documents into beautifully formatted, publication-grade A4 HTML print views with exact margins and page breaks.
  * **Offline Markdown Export**: One-click download of \`.md\` files for offline reference during field missions.
  * **Knowledge Analytics**: Tracks document reading history, bookmarks, staff feedback ratings, and top search keywords to continuously optimize documentation quality.

## 8.7 Module 7: Backup Center & Disaster Recovery
* **Purpose**: Ensures institutional data survivability through automated JSON database backups and rollback mechanisms.
* **Primary Roles**: Super Admin Only.
* **Key Features**:
  * **One-Click Backup Generation**: Compiles all database models (Enrollments, Staff, Jobs, Applications, Audit Logs, Documents) into a secure, downloadable JSON snapshot.
  * **Verification & Checksum Auditing**: Analyzes backup files for data corruption, schema integrity, and foreign key consistency before archiving.
  * **Emergency Restore & Rollback**: Enables complete restoration of platform state from a verified backup snapshot in the event of hardware failure or database migration errors.

## 8.8 Module 8: Reports & KPI Analytics
* **Purpose**: Generates executive insights, demographic breakdowns, and placement success metrics.
* **Primary Roles**: Super Admin, Finance Officer, Department Leads.
* **Key Features**:
  * **Visual Demographic Charts**: Interactive data visualizations showing student distribution by state of origin, NYSC batch, and gender.
  * **Placement Velocity Tracking**: Measure the average time taken for graduates to secure employment post-bootcamp.
  * **Exportable CSV/Excel Summaries**: Generate raw spreadsheet reports for external audits and institutional board reviews.

## 8.9 Module 9: Settings & Role-Based Access Control (RBAC)
* **Purpose**: Governs system security, user permissions, and API integrations.
* **Primary Roles**: Super Admin Only.
* **Key Features**:
  * **Staff Account Management**: Provision new staff accounts, assign administrative roles, and enforce mandatory password resets.
  * **API Key & Scraper Configuration**: Securely store and rotate Google Gemini API keys, external scraper endpoints, and email SMTP credentials.
  * **Session Security Controls**: Configure idle session timeouts and two-factor authentication (2FA) enforcement rules.

## 8.10 Module 10: Notifications Panel & Audit Log Banner
* **Purpose**: Real-time awareness of system mutations and high-priority administrative alerts.
* **Primary Roles**: All Staff Members.
* **Key Features**:
  * **Live Alert Bell**: Displays instant badges for newly submitted enrollment applications, pending support tickets, and AI scraper completion alerts.
  * **Immutable Audit Trail Banner**: Displays a streaming ticker of recent system actions (e.g., *"Admissions Lead approved Enrollee #45"*, *"Super Admin generated Backup #12"*), ensuring total transparency across the organization.
`;
