export const STAFF_HANDBOOK_PART_3 = `# 9. Daily Staff Workflows by Role

To maintain operational excellence across all Olatech campuses and digital touchpoints, staff members must structure their workday around standardized checklists. Below are the mandatory daily, weekly, and monthly workflows for each institutional role.

---

## 9.1 Super Admin (Executive Director & Systems Architect)

### Morning Tasks (08:00 - 09:30)
1. **System Health & Uptime Audit**: Log into the Command Center and verify that the Express server, Prisma database connection, and AI Discovery Engine are operating with zero latency.
2. **Overnight Error Log Review**: Check the system Audit Trail and server console logs for any unhandled exceptions, failed database migrations, or authentication lockouts that occurred overnight.
3. **Executive Dashboard Sync**: Review aggregate metrics on the main dashboard—total active enrollments, daily website visitors, and pending transport seat reservations.

### Midday Responsibilities (11:30 - 14:00)
1. **Departmental Roadblock Clearance**: Conduct a 15-minute standup with Admissions, Career, and Operations Leads to resolve any escalated student disputes or vendor bottlenecks.
2. **AI Scraper Verification Audit**: Spot-check 5 randomly selected job vacancies discovered by the AI engine to verify that confidence scoring and categorization align with institutional standards.
3. **Role & Permission Management**: Review pending staff access requests; provision new user accounts or adjust RBAC scopes as needed.

### End-of-Day Responsibilities (16:30 - 17:30)
1. **Daily Audit Trail Inspection**: Review the immutable audit log to confirm that all student status approvals, document deletions, and financial modifications were executed by authorized personnel.
2. **Database Backup Verification**: Navigate to the Backup Center and confirm that the automated daily JSON backup snapshot was generated successfully and passed checksum verification.
3. **System Security Sign-Off**: Ensure all administrative debug sessions are closed and log out of the active terminal.

### Weekly Routines (Every Friday Afternoon)
1. **Full Database Snapshot & Export**: Trigger a manual Gold Master backup in the Backup Center and securely archive the exported JSON bundle to encrypted offsite cloud storage.
2. **Weekly KPI Sync**: Convene the institutional leadership team to review cohort intake velocity, transport fuel efficiency, and job placement conversion rates against monthly targets.
3. **System Maintenance Window Scheduling**: Review and approve required Node.js package updates or database schema migrations for the upcoming weekend maintenance window.

### Monthly Responsibilities (End of Month)
1. **RBAC & Security Audit**: Conduct a comprehensive audit of all active staff accounts. Deactivate accounts of former employees or seasonal interns immediately.
2. **Institutional Policy Review**: Review student feedback and staff suggestion logs in the Documentation Center; draft necessary SOP updates or handbook revisions.
3. **Board of Advisors Reporting**: Compile executive KPI summaries from the Reports Module and prepare the institutional progress report for board trustees.

---

## 9.2 Admissions Officer (Lead Registrar)

### Morning Tasks (08:30 - 10:00)
1. **Overnight Application Intake**: Open the Admissions Module and sort the enrollee table by *Pending* status to identify candidates who submitted applications overnight.
2. **NYSC Call-Up Letter Vetting**: Cross-reference submitted NYSC call-up numbers against state secretariat deployment lists to verify applicant authenticity.
3. **Initial Candidate Communication**: Send standardized SMS and email onboarding acknowledgments to newly vetted candidates within 2 hours of application submission.

### Midday Responsibilities (11:00 - 14:30)
1. **6-Point Vetting Checklist Execution**: Conduct thorough dossier reviews for shortlisted candidates. Update the interactive checklist modal: verify academic credentials, confirm laptop hardware availability, check scholarship/payment ledger, and assign orientation cohort.
2. **Status Transitions & Handoffs**: Transition fully vetted candidates from *Pending* to *Approved* or *Enrolled*. Append clear administrative notes explaining the approval rationale.
3. **Inter-Departmental Shuttle Sync**: Export the daily list of newly approved enrollees and notify the Operations/Transportation Officer to allocate bus seating based on indicated pickup landmarks.

### End-of-Day Responsibilities (16:00 - 17:00)
1. **Enrollee Queue Zero-Out**: Ensure that no applicant dossier remains in an unreviewed *Pending* state for more than 24 hours.
2. **Daily Admissions Ledger Reconciliation**: Log the total number of applications received, vetted, approved, and rejected in the daily admissions tracking sheet.
3. **Applicant Helpdesk Clearing**: Check the support ticket queue for any pending queries regarding registration form errors or upload failures; resolve or respond before sign-off.

### Weekly Routines (Every Monday Morning)
1. **Cohort Demographics Audit**: Analyze the incoming NYSC stream distribution (e.g., *Batch A Stream I* vs *Batch B Stream II*) and report capacity forecasts to the Executive Director.
2. **Orientation Webinar Preparation**: Prepare attendance manifests and onboarding presentation decks for the mandatory weekly student orientation broadcast.
3. **Admissions Funnel Optimization**: Review drop-off rates between initial application submission and document verification; implement proactive follow-up call schedules.

### Monthly Responsibilities (End of Month)
1. **Intake Conversion Reporting**: Generate the monthly enrollment conversion report in the Analytics Module, highlighting growth trends across different courses (Web Dev vs Data Science vs Cyber).
2. **NYSC Secretariat Compliance Check**: Ensure all enrolled corps members have valid PPA clearance documentation on file to prevent NYSC monthly clearance complications.
3. **Admissions SOP Refinement**: Document frequently encountered candidate vetting edge cases and submit handbook update proposals to the Super Admin.

---

## 9.3 Career Officer (Placement Specialist)

### Morning Tasks (08:30 - 10:00)
1. **AI Scraper Harvest Review**: Access the Recruitment AI Module and inspect job opportunities harvested overnight from LinkedIn, Jobberman, MyJobMag, and Remote.co.
2. **Confidence Score Triage**: Filter discovered openings by AI confidence score. Immediately archive vacancies scoring below 60% (likely spam or unpaid commissions) and move scores above 85% to *Under Review*.
3. **Student Application Monitoring**: Check the Career Launch Hub to review new student job applications submitted to verified employer postings.

### Midday Responsibilities (11:00 - 14:30)
1. **4-Tier Vacancy Verification**: Conduct human verification on shortlisted job openings. Contact employer HR departments or verify corporate website career pages to confirm salary ranges, remote flexibility, and tech stack requirements. Transition status to *Verified & Approved*.
2. **Opportunity Publication**: Publish verified roles to the active student Opportunity Board. Ensure tags (e.g., *React*, *Python*, *Remote*, *Lagos*) are accurately assigned for filtering.
3. **AI CV Evaluator Coaching**: Review flagged student resumes that scored below 70% on the automated CV Evaluator. Provide personalized feedback notes and schedule 1-on-1 portfolio review sessions.

### End-of-Day Responsibilities (15:30 - 17:00)
1. **Employer Partner Outreach**: Send customized introduction emails or follow-up schedules to prospective corporate hiring partners looking for junior engineering talent.
2. **Duplicate & Change Log Scrubbing**: Check the Opportunity Duplicate History and Change Logs to remove expired job postings or consolidate duplicate entries harvested across multiple job boards.
3. **Placement Logging**: Update the institutional Success Stories registry with details of any student who secured an interview or formal job offer during the day.

### Weekly Routines (Every Wednesday Afternoon)
1. **Weekly Career Clinic Workshop**: Host the mandatory weekly online career mentorship clinic covering technical whiteboard interviews, salary negotiation, and LinkedIn profile optimization.
2. **Scraper Rule Tuning**: Review AI discovery keywords and location parameters; update scraper seed URLs if certain tech job boards change their DOM structures or pagination rules.
3. **Active Pipeline Review**: Meet with admissions and teaching instructors to identify top-performing students in the final 30 days of their bootcamp who are ready for immediate career placement.

### Monthly Responsibilities (End of Month)
1. **Employer Satisfaction Audit**: Survey participating corporate hiring partners to evaluate the technical readiness and professionalism of Olatech alumni placed in their organizations.
2. **Placement Velocity & Salary Report**: Compile comprehensive statistics on alumni placement percentages, average starting salaries, and top-hiring industries for executive board review.
3. **Career Resource Library Expansion**: Write and publish at least two new technical interview guides or resume templates into the CorpersTech Documentation Center.

---

## 9.4 Operations Officer (Logistics & Facilities Lead)

### Morning Tasks (07:30 - 09:00)
1. **Shuttle Manifest Synchronization**: Log into the Transportation Module at 07:30 AM. Export the confirmed passenger seat manifests for all morning bus shuttles across Lagos and Abuja routes.
2. **Driver Departure Verification**: Contact assigned shuttle drivers and bus captains via the logistics radio/phone network to confirm prompt departure from designated pickup landmarks (e.g., *Yaba Tech Hub*, *Garki CBD*).
3. **Campus Facility & Lab Check**: Conduct a physical walk-through of campus training labs; verify generator fuel levels, high-speed Wi-Fi router connectivity, and workstation power strips.

### Midday Responsibilities (11:00 - 14:00)
1. **Real-Time Seat Tracking & Route Adjustments**: Monitor inbound student shuttle arrival times. Resolve any reported bus overcrowding or traffic delays by dispatching backup transit vans if necessary.
2. **Public Enquiry Management**: Open the Operations Enquiry Inbox; triage, answer, or reassign incoming public messages and telephone inquiries regarding campus locations and bus schedules.
3. **Attendance & Lab Utilization Auditing**: Cross-reference physical classroom attendance sheets with Command Center digital access logs to track student engagement metrics.

### End-of-Day Responsibilities (16:00 - 17:30)
1. **Evening Return Shuttle Dispatch**: Generate evening return manifests and coordinate orderly boarding for departing corps members at campus bus bays.
2. **Facility Security & Shutdown**: Ensure all air conditioning units, projectors, lab computers, and server backup power units are properly powered down or secured for the night.
3. **Daily Operations Log Entry**: Record daily transport passenger volume, fuel expenditure, and facility maintenance incidents in the Operations Dashboard.

### Weekly Routines (Every Tuesday)
1. **Fleet Maintenance Inspection**: Conduct weekly physical inspections of all company-owned and vendor-leased shuttle buses; audit tire wear, brakes, air conditioning, and vehicle license validity.
2. **Route Optimization Review**: Analyze passenger density maps across Lagos and Abuja local governments; adjust bus pickup waypoints to eliminate under-utilized stops and reduce transit times.
3. **Vendor SLA Review**: Meet with external diesel suppliers, internet Service Providers (ISPs), and cleaning contractors to review performance against institutional service level agreements.

### Monthly Responsibilities (End of Month)
1. **Logistics Budget Reconciliation**: Compile all fuel receipts, vehicle repair invoices, and facility utility bills; submit the consolidated logistics expenditure audit to the Finance Officer.
2. **Campus Safety & Fire Drill**: Execute monthly occupational health and safety checks; inspect fire extinguishers, emergency exit lighting, and first-aid kits across all training labs.
3. **Operations Asset Inventory**: Conduct a comprehensive count of all physical institutional assets (monitors, HDMI cables, routers, testing devices) and update the central asset registry.

---

## 9.5 Finance Officer (Comptroller)

### Morning Tasks (08:30 - 10:00)
1. **Daily Bank & Gateway Reconciliation**: Check institutional bank accounts and online payment gateways; reconcile incoming student fee payments, scholarship top-ups, and book purchases against Command Center transaction logs.
2. **Payment Verification Alerts**: Review the admissions queue for students awaiting payment confirmation; update payment status flags in the CRM to unlock their classroom and shuttle access.
3. **Cash Flow Ledger Update**: Update the institutional daily cash flow spreadsheet with all morning inflows and pending outflow requests.

### Midday Responsibilities (11:00 - 14:00)
1. **Vendor Invoice Processing**: Review and verify submitted invoices from transport shuttle contractors, internet bandwidth providers, and hardware repair technicians. Ensure all invoices match purchase orders.
2. **Scholarship & Fee-Waiver Auditing**: Collaborate with the Admissions Officer to verify the authenticity of NYSC state coordinator scholarship letters and apply appropriate fee discount badges in the database.
3. **Petty Cash & Lab Expense Disbursement**: Administer daily petty cash disbursements for emergency lab supplies or minor facility repairs, ensuring strict receipt documentation.

### End-of-Day Responsibilities (16:00 - 17:00)
1. **Daily Revenue Closing**: Balance daily cash receipts and online payment gateway totals against recorded database entries. Investigate and resolve any discrepancies immediately.
2. **Pending Disbursement Queue**: Queue verified vendor payments and instructor stipends for executive sign-off and bank disbursement.
3. **Financial Secure Sign-Off**: Ensure all accounting ledgers, checkbooks, and financial dashboard terminals are locked and stored in fireproof safes before leaving the office.

### Weekly Routines (Every Thursday)
1. **Instructor & Staff Payroll Prep**: Review instructor teaching hours, staff attendance logs, and overtime records in preparation for bi-weekly or monthly payroll runs.
2. **Budget Variance Analysis**: Compare actual weekly departmental expenditures (Admissions marketing, Career hosting, Operations fuel) against allocated monthly budget ceilings.
3. **Procurement Review**: Audit hardware inventory requests (e.g., purchasing new student laptops or testing smartphones) and solicit competitive bids from approved hardware vendors.

### Monthly Responsibilities (End of Month)
1. **Monthly Financial Statements**: Generate comprehensive Income & Expenditure statements, Balance Sheets, and Cash Flow summaries for the Executive Director and Board of Trustees.
2. **Tax & Statutory Compliance**: Ensure timely calculation and remittance of PAYE taxes, withholding taxes, and pension contributions in strict compliance with Nigerian tax laws.
3. **Financial Audit Trail Archiving**: Export monthly financial transaction logs from the Command Center and archive them alongside physical bank statements for annual statutory external audits.

---

## 9.6 Support Officer (Technical Helpdesk & Systems Engineer)

### Morning Tasks (08:00 - 09:30)
1. **Helpdesk Ticket Triage**: Log into the Support Center at 08:00 AM. Sort overnight student and staff support tickets by severity level (e.g., *Critical Server Error* vs *Password Reset Request*).
2. **Login & Account Unlocking**: Resolve student authentication failures, reset locked passwords, and assist new enrollees experiencing difficulties joining official WhatsApp communication channels.
3. **Lab Workstation Readiness Check**: Verify that all student lab computers boot correctly, have updated code editors (VS Code, Android Studio), and are connected to internal local development servers.

### Midday Responsibilities (11:00 - 14:30)
1. **Live Technical Troubleshooting**: Provide on-the-floor technical support during student coding bootcamps; diagnose Git merge conflicts, environment variable misconfigurations, and Wi-Fi IP routing errors.
2. **Staff Hardware & Software Support**: Assist internal staff members with printer connectivity, Command Center browser caching issues, and spreadsheet export formatting.
3. **Bug & Issue Escalation**: Reproduce software bugs reported by students or staff in the CorpersTech portal; log detailed reproduction steps and stack traces in the technical engineering issue tracker for Super Admin review.

### End-of-Day Responsibilities (16:00 - 17:30)
1. **Ticket Queue Maintenance**: Ensure all high-priority helpdesk tickets opened during the day are either resolved or formally acknowledged with a progress update sent to the user.
2. **Lab Infrastructure Clean-Up**: Run automated script utilities to clear temporary student project files and reset lab workstation desktop environments for the next day's cohort.
3. **Daily Support Log Summary**: Post a brief summary of resolved tickets and recurring technical glitches in the internal engineering staff channel.

### Weekly Routines (Every Friday Afternoon)
1. **Knowledge Base Maintenance**: Identify the top 3 most frequently asked student technical questions of the week and write clear troubleshooting guides for publication in the Documentation Center.
2. **Network & Router Optimization**: Perform routine maintenance on campus network routers; clear DHCP leases, update firewall rules, and test backup 4G/5G modem failover speeds.
3. **Hardware Diagnostic Sweep**: Run diagnostic checks on lab server hard drives, laptop batteries, and projector bulbs; flag degrading hardware to the Operations Officer for replacement.

### Monthly Responsibilities (End of Month)
1. **Support SLA Performance Review**: Analyze monthly ticket resolution speeds and user satisfaction ratings; identify areas where support response times can be improved.
2. **Software License & Patch Audit**: Check all institutional software licenses (operating systems, design suites, security tools) to ensure validity and apply operating system security patches across all lab machines.
3. **Disaster Recovery Simulation Participation**: Assist the Super Admin during monthly database restoration and server failover drills to ensure readiness for real-world emergencies.

---

# 10. Communication Standards & Etiquette

Professional communication is the lifeblood of Olatech School of Programming. How we speak, write, and document our work directly influences institutional trust. All staff must adhere to the following communication tenets:

## 10.1 Internal Staff Communication
* **Primary Channels**: Use official Slack/Discord channels or Command Center administrative notes for all internal operational discussions.
* **Clarity & Brevity**: Keep messages concise and action-oriented. Use bullet points when presenting multi-step problems or status updates.
* **Response SLAs**: During core working hours (08:00 - 17:00), internal direct messages from colleagues or supervisors must be acknowledged within **1 hour**. Urgent operational flags (e.g., bus breakdowns, server outages) demand immediate response.

## 10.2 Student Communication Etiquette
* **The Empathy Imperative**: Remember that corps members are often navigating stressful career transitions in unfamiliar cities. Always maintain an encouraging, respectful, and patient tone, even when handling repetitive questions.
* **Standard Salutations**: Address students formally in written correspondence (e.g., *"Dear Corps Member Aliyu,"* or *"Hello Chinedu,"*). Never use slang, condescending language, or unprofessional abbreviations (e.g., avoid *"k", "u", "asap"*).
* **Timeliness**: Student inquiries submitted via email or the portal helpdesk must receive a meaningful response within **24 hours**. If an inquiry requires complex investigation, send an immediate holding reply acknowledging receipt.

## 10.3 Employer & Partner Communication
* **Corporate Poise**: All external correspondence with corporate hiring managers, NYSC state coordinators, and hardware vendors must reflect executive polish.
* **Institutional Representation**: Never express personal political, religious, or controversial opinions when communicating from official institutional accounts or during partner meetings.

## 10.4 Professional Email Etiquette
* **Subject Lines**: Every email must have a clear, descriptive subject line including relevant identifiers (e.g., *"[Admissions Vetting] NYSC Batch B Stream I - Enrollee #104 Clearance"*).
* **Corporate Signature**: All outgoing staff emails must include the standardized Olatech email signature block:
  \`\`\`
  --
  [Staff Name] | [Job Title]
  Olatech School of Programming | CorpersTech Systems
  Phone: +234 (0) 800 OLATECH | Web: www.olatechschool.com
  Address: Tech Campus, Lagos & Abuja, Nigeria
  \`\`\`
* **Proofreading**: Always check grammar, spelling, and recipient addresses before sending. Never use "Reply All" unless every recipient genuinely requires the information.

## 10.5 Official WhatsApp Usage Guidelines
WhatsApp is a powerful communication tool for NYSC cohorts but poses significant risks if unmanaged.
* **Official Broadcast Groups Only**: Staff members must only communicate with students through official, moderated Olatech WhatsApp groups.
* **Strict Privacy Boundaries**: Do not initiate private, informal WhatsApp chats with individual students late at night or for personal matters.
* **No Administrative Approvals via Chat**: Never confirm enrollment admissions, fee waivers, or grade modifications via WhatsApp text. Instruct students to submit formal documentation through the CorpersTech portal.

## 10.6 Telephone & Voice Etiquette
* **Answering Script**: When answering official institutional phone lines, use the standard greeting: *"Thank you for calling Olatech School of Programming, this is [Staff Name] from [Department]. How may I assist your tech journey today?"*
* **Active Listening**: Listen patiently to the caller without interrupting. Take written notes of key details (enrollee ID, phone number, specific complaint).
* **De-escalation**: If a student or parent is frustrated regarding transport delays or admission vetting, remain calm, lower your vocal pitch, express empathy, and focus immediately on actionable solutions. Never argue or hang up on a caller.

## 10.7 Documentation & Audit Log Standards
* **Objective Language**: When recording administrative notes in student CRM dossiers or system audit logs, use objective, factual, and professional language.
  * *Bad Note*: *"Student is lazy and lied about his call-up letter."*
  * *Good Note*: *"NYSC Call-Up Letter number FCT/2026/00123 could not be verified on the national portal. Candidate contacted via email on 04/07/2026 to provide supporting clearance documentation."*
* **No Deletion of History**: Never attempt to erase or obscure historical administrative notes. Corrections should be appended chronologically with clear explanatory timestamps.

---

# 11. Information Security & Data Privacy

As the custodian of thousands of NYSC student records, employer contracts, and proprietary educational curricula, Olatech School of Programming enforces a rigorous data security regimen. Security is not the sole responsibility of the Super Admin; **every staff member is an active firewall**.

## 11.1 Password Policies & Authentication
* **Complexity Requirements**: All Command Center passwords must be at least **12 characters long** and contain a combination of uppercase letters, lowercase letters, numbers, and cryptographic symbols (\`@, #, $, %, ^, &, *\`).
* **Prohibition of Reuse**: Never use your Olatech Command Center password for personal accounts (social media, personal banking, online shopping).
* **Mandatory Rotation**: System passwords must be updated every **90 days**. The Command Center will automatically prompt password expiration warnings 7 days prior to lockout.
* **No Password Sharing**: Under no circumstances should you share your login credentials with a colleague, intern, or student. If a colleague requires system access, request a dedicated role-based account from the Super Admin.

## 11.2 Multi-User Workstation Security
* **The "Clear Desk & Locked Screen" Rule**: Whenever you step away from your workstation—even for a 2-minute coffee break or restroom visit—you MUST lock your operating system screen (\`Win + L\` on Windows, \`Control + Command + Q\` on macOS).
* **Shared Campus Terminals**: If accessing the Command Center from a shared campus lab instructor terminal, always open an Incognito/Private browsing window and ensure you explicitly click **"Log Out"** and close all browser windows upon completing your task.

## 11.3 Session Management & Access Boundaries
* **Idle Session Timeout**: The CorpersTech platform is engineered to automatically terminate administrative sessions after **30 minutes of inactivity**. Do not attempt to bypass this security feature using automated mouse jiggler scripts or browser refresh extensions.
* **Role-Based Access Control (RBAC) Integrity**: Never attempt to access URL endpoints or administrative modules outside your assigned role permission scope. All unauthorized permission escalation attempts are flagged by system security monitors and recorded in the audit trail.

## 11.4 Hardware & Device Security
* **Encrypted Workspaces**: All institutional laptops and staff workstations must have full-disk encryption enabled (BitLocker on Windows, FileVault on macOS).
* **Prohibition of Unverified USB Devices**: Do not plug personal or student-owned USB flash drives, external hard drives, or mobile phones into institutional staff computers. USB drives are a primary vector for malware and ransomware transmission.
* **Public Wi-Fi Hazards**: If working remotely, never access the CorpersTech Command Center over open, unencrypted public Wi-Fi networks (e.g., cafes, airports, hotels) without utilizing the official institutional Virtual Private Network (VPN).

## 11.5 Phishing Awareness & Social Engineering
* **Email Vigilance**: Cybercriminals frequently target educational institutions using spoofed email addresses. Inspect the sender's actual domain name carefully. Be suspicious of emails urging immediate wire transfers, urgent password resets, or unexpected attachment downloads.
* **Verification Protocol**: If you receive an urgent email seemingly from the Executive Director or Finance Officer requesting emergency funds disbursement or student database exports, **always verify the request via a secondary communication channel** (phone call or face-to-face verbal confirmation) before taking action.

## 11.6 Data Privacy (NDPR & GDPR Compliance)
Olatech School of Programming strictly complies with the Nigeria Data Protection Regulation (NDPR) and international GDPR privacy standards.
* **Data Minimization**: Only collect and retain student personal data that is strictly necessary for educational onboarding, transport coordination, and career placement.
* **Right to be Forgotten**: If a corps member formally withdraws from the academy and requests data deletion, refer the request immediately to the Super Admin to execute a compliant anonymization/soft-deletion protocol in the database.
* **No Unsolicited Marketing**: Student email addresses and phone numbers must never be shared with external third-party advertisers or recruitment agencies without explicit, documented student consent.

## 11.7 Incident Reporting Protocol
If you suspect that your login credentials have been compromised, notice unexplained database mutations, or observe a colleague violating security SOPs, you must act immediately:
1. **Immediate Containment**: If your laptop is suspected of malware infection, disconnect it from the Wi-Fi/LAN network immediately.
2. **Emergency Notification**: Contact the Super Admin and Technical Lead via emergency telephone within **15 minutes** of discovering the security anomaly.
3. **Formal Incident Log**: Submit a formal, encrypted Incident Report detailing the exact timestamp, affected systems, and potential data exposure scope. Never attempt to cover up or hide a security incident.
`;
