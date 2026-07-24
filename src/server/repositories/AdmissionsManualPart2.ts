export const ADMISSIONS_MANUAL_PART_2 = `# Chapter 3: Deep-Dive Documentation of Every Admissions Module

This chapter provides comprehensive, exhaustive documentation for each functional module within the CorpersTech Admissions ecosystem. Every screen, table column, action button, dropdown, and background process is detailed to ensure zero operational ambiguity.

---

## 3.1 Admissions Command Center Dashboard (\`/admissions\`)

### 3.1.1 Architectural Overview & Functional Purpose
The **Admissions Command Center Dashboard** serves as the primary executive landing page and real-time operational hub for all Admissions Officers, Enrollment Leads, and Super Admins. Engineered to provide instant institutional situational awareness, the dashboard synthesizes candidate registration telemetry, pipeline conversion bottlenecks, and active SLA compliance metrics into high-contrast visual components.

Upon authentication into the workspace, staff members are greeted by this dashboard to assess daily workload distribution, monitor registration velocity across Nigerian geopolitical zones, and identify immediate operational priorities before entering the detailed applicant registries.

### 3.1.2 UI Layout & Navigation Architecture
The Command Center interface is structured into four distinct horizontal visual tiers:
1. **Top System Status & Quick Actions Header**: Houses the real-time system health indicator pill (\`● DATABASE ONLINE\`), active staff identification banner, and emergency global search bar.
2. **Key Performance Indicator (KPI) Summary Ribbon**: A four-card metric grid displaying real-time aggregate statistics with historical trend comparisons.
3. **Interactive Analytical Charting Deck**: Two responsive visual graphics rendering registration velocity curves and learning track distribution charts.
4. **Actionable Pipeline Summary & Urgent Alerts Panel**: Displays SLA breach warnings, recent registration feeds, and immediate quick-action execution triggers.

[Screenshot: Admissions Command Center Dashboard Overview]

### 3.1.3 Detailed Screen Elements & Table Columns
* **Total Applications Card**: Displays the absolute count of all registration records stored in the database. Includes a dynamic green/red delta badge showing percentage growth over the previous 30-day operational cycle.
* **Pending Reviews Card**: Highlights the exact volume of candidate files currently awaiting initial screening or verification. Styled with an amber warning accent if the queue exceeds 50 candidates.
* **Admitted / Enrolled Card**: Reflects the cumulative count of students who have successfully passed credential vetting and have been assigned to an active learning cohort.
* **Rejection / Dropout Rate Card**: Shows the percentage of processed applications that were declined due to credential non-compliance or academic prerequisite failures.
* **Registration Velocity Chart**: A dynamic area spline graph mapping daily application submissions over the trailing 14 business days. Allows staff to identify viral registration spikes following promotional campaigns.
* **Track Distribution Pie Chart**: A multi-color radial visualization breaking down applicant preferences across our core learning disciplines (*Web Development*, *Data Science & AI*, *Cybersecurity*, *Python Programming*, and *Graphics Design*).

### 3.1.4 Available Action Buttons & Interactive Controls
* **[+ New Manual Registration] Button**: Located in the top right header. Launches the manual entry modal for recording walk-in applicants or VIP paper applications submitted directly at physical campus administrative offices.
* **[Export Analytics Summary] Button**: Triggers an instant background compilation of dashboard KPIs into a high-density CSV or PDF executive summary report for management review.
* **[Refresh Telemetry] Icon Button**: Forces an immediate WebSocket and GraphQL synchronization with the master Cloud SQL / Firestore database, ensuring zero lag in displayed metrics.
* **[View All Pending] Shortcut Link**: Embedded within the Pending Reviews KPI card; clicking this link instantly navigates the user to the Applicant Management Table with the \`Status = Pending\` filter pre-applied.

### 3.1.5 Data Fields & Form Elements
When interacting with the dashboard filter controls, staff encounter the following operational parameters:
* **Date Range Selector**: A dropdown allowing temporal filtering across \`Today\`, \`Last 7 Days\`, \`Trailing 30 Days\`, or \`Custom Academic Quarter\`.
* **Campus Filter Toggle**: Switches dashboard metrics between \`Global All-Campus\`, \`Lagos Ikeja Hub\`, \`Lagos VI Hub\`, \`Abuja Central Hub\`, and \`Virtual Remote Cohort\`.

### 3.1.6 Step-by-Step Operational Workflows
* **Morning Triage Workflow**:
  1. Access \`/admissions\` upon starting the shift at 08:00 AM.
  2. Inspect the **Pending Reviews Card** to gauge overnight application volume.
  3. Check the **Urgent Alerts Panel** for any red SLA breach notices (applications pending > 48 hours).
  4. Click **[View All Pending]** to transition directly into the daily vetting queue.

### 3.1.7 Troubleshooting & Common Error Messages
* **Error: \`Telemetry Sync Timeout (ERR-DASH-001)\`**: Occurs if the local network experiences packet loss during chart data hydration. *Remedy*: Click the **[Refresh Telemetry]** icon button or press \`Ctrl + R\` (\`Cmd + R\`) to re-establish the database connection.
* **Symptom: KPI Cards Displaying \`0\` or \`NaN\`**: Indicates an expired JWT authentication token or temporary database read lock. *Remedy*: Log out of the staff portal, clear browser session storage, and re-authenticate via Multi-Factor Authentication (MFA).

---

## 3.2 Applicant Management System & Registry Grid (\`/admissions/applicants\`)

### 3.2.1 Architectural Overview & Functional Purpose
The **Applicant Management System** is the core database interface and operational powerhouse of the Admissions CRM. It presents a high-performance, paginated data grid containing every individual who has ever registered for Olatech School of Programming. Designed to handle thousands of records without UI degradation, this module enables deep data slicing, batch processing, and granular status governance.

Admissions Officers spend the majority of their operational hours in this module, transforming unstructured incoming applications into verified, organized student records ready for classroom immersion.

### 3.2.2 UI Layout & Navigation Architecture
The module is organized into a clean, productivity-focused layout:
1. **Multi-Parameter Search & Advanced Filtering Bar**: A persistent top ribbon allowing simultaneous filtering by status, track, modality, campus, state of origin, and laptop ownership.
2. **Bulk Action & Export Ribbon**: A floating action toolbar that appears when one or more candidate rows are selected via checkboxes.
3. **Master Applicant Data Grid**: A responsive, sortable table displaying core candidate attributes with color-coded status badges and visual health indicators.
4. **Pagination & Record Footprint Footer**: Controls page navigation, rows-per-page adjustments (10, 25, 50, 100), and displays total filtered dataset counts.

[Screenshot: Applicant Management Registry Grid]

### 3.2.3 Detailed Screen Elements & Table Columns
* **Checkbox Column**: Allows single, multi-row, or universal selection for bulk operations.
* **Applicant Name & Avatar**: Displays the candidate's legal full name alongside a dynamic initials avatar or uploaded profile photograph.
* **Reference ID (\`Ref ID\`)**: A unique, immutable alphanumeric tracking code generated upon registration (e.g., \`OLT-2026-8849\`).
* **NYSC State & Batch**: Identifies the applicant's current NYSC deployment state (e.g., \`Lagos\`, \`FCT Abuja\`, \`Rivers\`) and service stream batch (e.g., \`Batch A Stream 1\`).
* **Selected Track**: The candidate's chosen computing discipline.
* **Modality Tag**: Badged as either 🏢 **Physical On-Site** or 🌐 **Virtual Remote**.
* **Laptop Status Indicator**: Displays a solid green checkmark (\`✔ Owns Laptop\`) or a high-alert red icon (\`✖ Needs Lab PC\`).
* **Status Badge**: A prominent color-coded pill indicating the current lifecycle state: 🟡 **Pending**, 🟢 **Enrolled**, 🔵 **Waitlisted**, 🔴 **Rejected**, or ⚪ **Archived**.
* **Submission Date (\`createdAt\`)**: Timestamp showing exact date and time of application receipt.
* **Actions Column**: Contains quick-access icon buttons: **[View Profile Drawer]**, **[Quick Edit]**, and **[Soft Delete / Archive]**.

### 3.2.4 Available Action Buttons & Interactive Controls
* **[Filter Registry] Dropdown Menu**: Unfolds multi-select checkboxes for isolating specific student cohorts or demographic segments.
* **[Export CSV / Excel] Button**: Compiles the currently visible (filtered) dataset into a standardized spreadsheet for external reporting or ministry audits.
* **[Bulk Enroll Selected] Button**: Available in the bulk action ribbon; transitions all checked candidates to \`Enrolled\` status simultaneously after selecting a target cohort.
* **[Bulk Email / SMS] Button**: Opens the communication modal pre-populated with the contact details of all checked candidates for targeted group messaging.

### 3.2.5 Data Fields & Form Elements
The internal search engine supports both simple string matching and advanced syntax queries:
* **Quick Search Input**: Scans candidate full names, email addresses, phone numbers, and NYSC Call-Up numbers instantly.
* **State of Origin / Deployment Filter**: Allows sorting candidates by any of the 36 Nigerian States and the Federal Capital Territory.

### 3.2.6 Step-by-Step Operational Workflows
* **Standard Candidate Triage Procedure**:
  1. Set the top Status filter to \`Pending\`.
  2. Click the **Submission Date** column header to sort in ascending order (Oldest First / First-In, First-Out triage).
  3. Scan the **Laptop Status** column; flag candidates requiring physical lab workstations.
  4. Click the candidate's name or the **[View Profile Drawer]** icon to open their detailed file for vetting.

### 3.2.7 Troubleshooting & Common Error Messages
* **Error: \`Export Memory Overflow (ERR-GRID-004)\`**: Occurs when attempting to export > 10,000 un-paginated records simultaneously on a low-memory browser tab. *Remedy*: Apply specific filters (e.g., filter by single Track or Status) before exporting, or use the scheduled background export tool.

---

## 3.3 Candidate Vetting & Profile Drawer (\`/admissions/applicants/:id\`)

### 3.3.1 Architectural Overview & Functional Purpose
The **Candidate Vetting Profile Drawer** is the comprehensive inspection console where the actual intellectual work of admissions vetting takes place. When an Admissions Officer clicks on any student row in the registry grid, this slide-out panel emerges from the right side of the screen without navigating away from the parent table.

This drawer consolidates personal demographics, academic credentials, document verification attachments, screening interview scoring, and historical administrative logs into a unified, scrollable interface. It empowers officers to make evidence-based admission decisions and record immutable qualitative observations.

### 3.3.2 UI Layout & Navigation Architecture
The Profile Drawer is organized into an intuitive tabbed interface:
1. **Header Identification Banner**: Displays applicant photo, legal name, Ref ID, current status badge, and immediate quick-action buttons (\`[Call Candidate]\`, \`[Send WhatsApp]\`, \`[Email]\`).
2. **Duplication Intelligence Alert Bar**: A conditional top warning banner that dynamically appears if the system detects matching phone numbers, emails, or physical addresses with another registered profile.
3. **Tab Navigation Ribbon**: Four distinct analytical tabs: **Personal Info**, **Academic & NYSC**, **Technical Assessment**, and **Admin Vetting Logs**.
4. **Action & Decision Footer**: A fixed bottom bar containing status toggle controls, assigned cohort selector dropdown, and the final **[Save Profile Changes]** execution button.

[Screenshot: Candidate Vetting Profile Drawer]

### 3.3.3 Detailed Screen Elements & Table Columns
* **Personal Info Tab**:
  * Full Legal Name, Date of Birth, Gender, Residential Street Address, City, State of Residence.
  * Primary Email Address, Verified WhatsApp Phone Number, Emergency Contact Name and Phone Number.
  * Disability / Special Needs statement (crucial for physical lab accessibility planning).
* **Academic & NYSC Tab**:
  * Higher Education Institution attended, Degree Discipline, Graduation Year, Class of Degree (e.g., Second Class Upper).
  * NYSC Call-Up Number, NYSC State Code, Current PPA (Place of Primary Assignment) organization name and address.
  * Embedded Document Viewer: Displays preview thumbnails of uploaded NYSC Call-Up letters, university degree certificates, and official identification cards.
* **Technical Assessment Tab**:
  * Previous coding experience self-rating (Beginner, Intermediate, Advanced).
  * GitHub Profile URL, LinkedIn Profile URL, Personal Portfolio website link.
  * Automated Onboarding Quiz Score: Numerical logical reasoning test score recorded during registration (e.g., \`85 / 100\`).
* **Admin Vetting Logs Tab**:
  * **Interviewer Comments Field**: A multi-line rich text area where officers record verbal interview observations, technical competency evaluations, and behavioral assessments.
  * **Audit Timeline Log**: A chronological, timestamped feed showing every administrative modification ever made to the profile, including who created, edited, or emailed the candidate.

### 3.3.4 Available Action Buttons & Interactive Controls
* **[Toggle Status] Action Controls**: Radio buttons or styled select dropdowns allowing instant transition between \`Pending\`, \`Enrolled\`, \`Waitlisted\`, and \`Rejected\`.
* **[Assigned Cohort] Selector**: A mandatory dynamic dropdown listing all currently active, non-full learning cohorts corresponding to the candidate's chosen track and modality.
* **[Rejection Reason Code] Selector**: A conditional dropdown that becomes mandatory only when status is set to \`Rejected\`, enforcing standardized Rejection Reason Codes (e.g., \`CODE-R1: Incomplete NYSC Credentials\`, \`CODE-R2: Failed Technical Assessment\`, \`CODE-R3: Unreachable Contact Number\`).
* **[Verify BVN & Identity] Button**: Initiates a secure API handshake to verify the candidate's entered bank account name against Central Bank of Nigeria (CBN) biometric records for transport stipend eligibility.

### 3.3.5 Step-by-Step Operational Workflows
* **Comprehensive Vetting & Admission Procedure (SOP-002)**:
  1. Open candidate Profile Drawer from the pending queue.
  2. Check **Duplication Alert Bar**; if flagged, verify if applicant is a duplicate registration before proceeding.
  3. Under **Academic & NYSC Tab**, click document thumbnails to verify authenticity of NYSC Call-Up letter and degree certificate.
  4. Under **Technical Assessment Tab**, verify logical reasoning score is ≥ 50% for foundational tracks or ≥ 70% for advanced tracks.
  5. Conduct a 5-minute telephone or WhatsApp video screening interview with the candidate.
  6. Switch to **Admin Vetting Logs Tab**; type clear, objective interview remarks in the **Interviewer Comments** box (e.g., *"Candidate verified active NYSC serving in Ikeja. Owns M1 MacBook Air. Highly motivated for Web Dev track. Approved for enrollment."*).
  7. In the Action Footer, select status **Enrolled**.
  8. Select target class from **Assigned Cohort** dropdown (e.g., \`Lagos Web Dev Cohort 1 - Physical\`).
  9. Click **[Save Profile Changes]**. The system automatically triggers admission welcome emails and Slack channel invites.

### 3.3.6 Troubleshooting & Common Error Messages
* **Error: \`Missing Mandatory Vetting Note (ERR-VET-002)\`**: Triggered when attempting to save an \`Enrolled\` or \`Rejected\` status without entering at least 15 characters in the Interviewer Comments field. *Remedy*: Enter complete, professional interview justification notes before saving.
* **Error: \`Cohort Capacity Exhausted (ERR-COH-009)\`**: Occurs if the selected target cohort reached 100% seating capacity while the vetting drawer was open. *Remedy*: Select an alternative overflow cohort from the dropdown or toggle candidate to \`Waitlisted\`.

---

## 3.4 Communication Center (\`/admissions/communications\`)

### 3.4.1 Architectural Overview & Functional Purpose
The **Communication Center** is the centralized messaging engine responsible for managing all outgoing email and SMS correspondence between the institute and applicant pool. Built to eliminate disjointed external email clients, this module enforces institutional brand consistency through pre-approved Gold Master message templates and provides complete automated tracking of communication deliverability.

Whether dispatching automated acceptance letters, broadcasting orientation reminders to entire cohorts, or requesting urgent document re-uploads from individual candidates, all communications are logged against the student's permanent profile.

### 3.4.2 UI Layout & Navigation Architecture
The interface is structured into three responsive operational panels:
1. **Left Template Library & Channel Selector**: Allows staff to toggle between Email and SMS channels and select from categorized communication templates.
2. **Center Message Composer & Variable Injector**: A rich-text editing canvas equipped with dynamic handlebars merge-tag injection tools (\`{{applicant_name}}\`, \`{{assigned_cohort}}\`, \`{{orientation_date}}\`).
3. **Right Target Audience Selector & Dispatch History**: Controls recipient selection (individual, filtered list, or entire cohort roster) and displays real-time SMTP/SMS gateway delivery receipts.

[Screenshot: Communication Center Message Composer]

### 3.4.3 Detailed Screen Elements & Table Columns
* **Template Selector Dropdown**: Accesses standardized templates including: *Template 01: Acceptance & Welcome*, *Template 02: Interview Invitation*, *Template 03: Rejection Notice*, *Template 04: Orientation Reminder*, and *Template 05: Document Clarification*.
* **Subject Line Field**: Pre-populated by templates but editable by Admissions Leads for specialized announcements.
* **Rich Text Message Body**: Supports bolding, bullet points, embedded links, and institutional email signatures.
* **Dispatch History Log Table**: Columns display \`Timestamp\`, \`Recipient Email/Phone\`, \`Template Used\`, \`Channel\`, \`Status Badge\` (🟢 Delivered, 🟡 Pending, 🔴 Bounced), and \`Gateway Response Code\`.

### 3.4.4 Available Action Buttons & Interactive Controls
* **[Insert Variable Tag] Buttons**: One-click pills that inject dynamic database tokens into the message body.
* **[Send Test Dispatch] Button**: Transmits a preview copy of the composed message to the staff member's own employee email or mobile phone for formatting verification.
* **[Execute Bulk Dispatch] Button**: Initiates background batch transmission to the selected target audience, equipped with rate-limiting throttling to prevent email server blacklisting.

### 3.4.5 Step-by-Step Operational Workflows
* **Dispatching Cohort Orientation Reminders**:
  1. Navigate to \`/admissions/communications\`.
  2. Select Channel: \`SMS Broadcast\`.
  3. Select Template: \`Template 04: Orientation Reminder\`.
  4. In the Target Audience selector, choose \`By Cohort\` -> Select \`Lagos Web Dev Cohort 1\`.
  5. Verify preview text displays correct campus address and 08:30 AM arrival time.
  6. Click **[Execute Bulk Dispatch]**. Monitor the Dispatch History table to confirm 100% delivery success.

### 3.4.6 Troubleshooting & Common Error Messages
* **Error: \`SMTP Gateway Authentication Failure (ERR-COMM-503)\`**: Indicates temporary disconnection between CRM backend and corporate mail server. *Remedy*: Notify IT Helpdesk immediately; use SMS broadcast channel as an emergency backup for time-sensitive announcements.
* **Symptom: High Bounce Rate on Email Broadcasts**: Caused by typographical errors in applicant email registration (e.g., \`user@gmai.com\`). *Remedy*: Open bounced records in Applicant Management, correct typographical spelling in Personal Info tab, and re-send individual welcome dispatch.

---

## 3.5 Cohort Management & Academic Tracking (\`/admissions/cohorts\`)

### 3.5.1 Architectural Overview & Functional Purpose
The **Cohort Management Module** bridges the gap between admissions vetting and academic operations. Once candidates are admitted, they must be organized into structured learning classes based on discipline, physical campus capacity, and instructor ratios. This module manages cohort lifecycles from creation and student onboarding through graduation or academic rollover.

It serves as the master roster controller for campus laboratory managers and academic instructors, ensuring that physical classroom seat limits are strictly respected and digital remote groups remain balanced.

### 3.5.2 UI Layout & Navigation Architecture
The layout utilizes a visual card-based grid alongside detailed tabular views:
1. **Cohort Summary Cards Grid**: Top section rendering distinct visual cards for each active class, displaying course title, instructor name, modality badge, graduation countdown, and an interactive seating utilization progress bar.
2. **Tabular Roster Inspector**: When a cohort card is clicked, the lower section expands into a comprehensive roster table showing all assigned students, their lab PC allocation numbers, and attendance eligibility.
3. **Cohort Lifecycle Filter Ribbon**: Allows filtering classes by state: \`Active / In-Progress\`, \`Upcoming Kickoff\`, \`Completed / Graduated\`, and \`Archived\`.

[Screenshot: Cohort Management Roster View]

### 3.5.3 Detailed Screen Elements & Table Columns
* **Cohort Code & Title**: Official alphanumeric identifier (e.g., \`LAG-WEB-2026-Q3\`) and full curriculum name.
* **Lead Faculty Instructor**: Name and contact details of the primary senior engineer assigned to teach the class.
* **Seating Capacity Utilization Bar**: A visual progress bar showing enrolled student count against maximum seating limits (e.g., \`28 / 30 Seats Filled - 93%\`). Turns solid red when capacity reaches 100%.
* **Roster Table Columns**: Displays \`Student Ref ID\`, \`Full Name\`, \`WhatsApp Contact\`, \`Workstation Tag\` (e.g., \`PC-Lab-01-A4\` or \`Personal Laptop\`), \`Slack Join Status\`, and \`Academic Standing\`.

### 3.5.4 Available Action Buttons & Interactive Controls
* **[+ Create New Cohort] Button**: Restricted to Admissions Leads and Super Admins; opens modal to define new class parameters, assign instructors, and set orientation calendar dates.
* **[Export Printed Roster] Button**: Generates a high-contrast, printable PDF attendance sheet formatted specifically for campus security gate check-in and laboratory desk verification.
* **[Transfer Student] Action Button**: Located on individual student rows within the roster table; allows moving a student from one cohort to another (e.g., transferring from Physical Lagos to Virtual Remote due to NYSC relocation).

### 3.5.5 Step-by-Step Operational Workflows
* **Executing Mid-Semester Student Transfer (SOP-005)**:
  1. Locate the student in their current cohort roster within \`/admissions/cohorts\`.
  2. Click the **[Transfer Student]** action icon on their row.
  3. In the transfer modal, select the new target cohort from the dropdown (e.g., switch from \`Abuja Physical Cohort\` to \`Virtual Remote Cohort\`).
  4. Select mandatory transfer justification reason: \`NYSC Official Redeployment\`.
  5. Click **[Confirm Roster Transfer]**. The backend automatically updates their Slack channel permissions and releases their physical campus workstation seat for waitlisted candidates.

### 3.5.6 Troubleshooting & Common Error Messages
* **Error: \`Seat Limit Exceeded - Hard Cap Block (ERR-COH-001)\`**: Triggered when attempting to add a 31st student into a physical campus lab hard-capped at 30 seats. *Remedy*: Do not attempt to override database limits. Assign student to an alternative overflow physical cohort or transfer to the virtual remote track.

---

## 3.6 Transportation Management & Logistics (\`/admissions/transport\`)

### 3.6.1 Architectural Overview & Functional Purpose
To ensure consistent classroom attendance and support NYSC corps members facing economic pressures, Olatech School of Programming provides subsidized transportation logistics for physical campus attendees. The **Transportation Management Module** administers corporate shuttle bus seating rosters, tracks student commuter routes across Lagos and Abuja metropolitan areas, and manages transport stipend eligibility verification.

This module ensures that every physical student has an optimized transit plan before orientation Monday, preventing attendance dropouts caused by commute difficulties.

### 3.6.2 UI Layout & Navigation Architecture
The module is divided into transit route management and stipend verification interfaces:
1. **Metropolitan Shuttle Route Cards**: Displays active bus corridors (e.g., *Route 01: Ikeja Express*, *Route 02: Lekki/VI Loop*, *Route 03: Kubwa/Abuja Express*), showing assigned bus driver details, departure times, and seat occupancy rates.
2. **Unassigned Commuter Grid**: A table listing all newly enrolled physical campus students who have not yet been assigned to a shuttle bus route or approved for monthly transport stipend disbursal.
3. **Stipend Disbursal Audit Table**: Tracks bank account verification statuses, BVN match confirmations, and financial allowance payout schedules.

[Screenshot: Transportation Management Logistics Grid]

### 3.6.3 Detailed Screen Elements & Table Columns
* **Route Name & Corridor**: Identifies the geographical path covered by the corporate shuttle bus.
* **Bus Capacity Occupancy**: Tracks student seat assignments against vehicle passenger limits (e.g., \`18 / 22 Bus Seats Filled\`).
* **Pickup Bus Stop Assignment**: Designates the specific landmark or bus stop where the student will board the shuttle each morning (e.g., \`Maryland Mall Bus Stop - 06:45 AM\`).
* **Stipend Eligibility Status**: Badged as 🟢 **Approved for Direct Stipend**, 🔵 **Assigned to Corporate Shuttle**, or 🟡 **Pending Transit Verification**.
* **BVN Verification Badge**: Displays cryptographic verification status of the student's entered Bank Verification Number against CBN payroll registries.

### 3.6.4 Available Action Buttons & Interactive Controls
* **[Assign Shuttle Seat] Button**: Binds a selected student to a specific bus route and pickup landmark.
* **[Verify BVN & Approve Stipend] Button**: Triggers automated bank account name matching; upon confirmation, tags student profile as approved for monthly financial transit allowance.
* **[Print Driver Manifest] Button**: Generates an emergency contact roster and pickup checklist for corporate shuttle bus drivers.

### 3.6.5 Step-by-Step Operational Workflows
* **Commuter Logistics Onboarding Procedure**:
  1. Open \`/admissions/transport\` and filter unassigned grid by \`Campus = Lagos VI\`.
  2. Inspect candidate residential street address.
  3. If candidate resides along Route 02 corridor and bus seats are available (< 22 assigned), click **[Assign Shuttle Seat]** -> Select \`Route 02\` -> Select closest pickup landmark.
  4. If bus route is full or candidate resides in off-route metropolitan zone, click **[Verify BVN & Approve Stipend]** to route their profile to the Finance Officer for direct transit allowance disbursement.

### 3.6.6 Troubleshooting & Common Error Messages
* **Error: \`BVN Name Mismatch (ERR-TRN-409)\`**: Occurs when the bank account name provided does not match the student's registered legal name. *Remedy*: Place transit stipend on hold; contact student via Communication Center Template 05 to request official bank statement clarification or name correction.

---

## 3.7 Orientation Checklist & Onboarding Tracker

### 3.7.1 Architectural Overview & Functional Purpose
The **Orientation Checklist & Onboarding Tracker** is a specialized quality assurance module designed to govern the critical transition window between student admission and their first day of classroom instruction. It provides a granular, student-by-student verification matrix tracking completion of mandatory pre-boarding tasks: Slack workspace join confirmation, GitHub organization onboarding, physical ID badge printing, and workstation hardware login verification.

By monitoring this tracker on the Friday and Saturday preceding orientation Monday, admissions staff can proactively identify and assist lagging students, ensuring 100% Day-1 operational readiness.

### 3.7.2 UI Layout & Navigation Architecture
The interface features a high-density, multi-column completion matrix:
1. **Cohort Filter & Readiness Summary Banner**: Displays aggregate percentage completion rates for the selected class (e.g., \`Lagos Web Dev Cohort 1 - Overall Onboarding Readiness: 88%\`).
2. **Interactive Student Completion Matrix Grid**: A table where individual rows represent students and columns represent mandatory onboarding checkpoints, equipped with interactive toggle checkboxes.
3. **Bulk Reminder Trigger Toolbar**: Floating controls to immediately dispatch targeted SMS or email reminders exclusively to students with incomplete onboarding items.

[Screenshot: Orientation Checklist & Onboarding Matrix]

### 3.7.3 Detailed Screen Elements & Table Columns
* **Student Name & Ref ID**: Standard candidate identification.
* **Checklist Column 1: \`Slack Workspace Joined\`**: Automatically toggles to green checked status via Slack API webhook when the student authenticates into their class channel.
* **Checklist Column 2: \`GitHub Invite Accepted\`**: Automatically updates via GitHub API webhook when the student joins the \`@CorpersTech-Students\` organization repository.
* **Checklist Column 3: \`Physical Barcode ID Printed\`**: Manually checked by campus administrative staff upon printing the student's access badge.
* **Checklist Column 4: \`Lab PC Workstation Logged In\`**: Verified during Monday morning orientation check-in when the student first authenticates on their assigned lab iMac or PC.
* **Overall Readiness Score**: A percentage indicator summarizing individual student onboarding completion (0%, 25%, 50%, 75%, 100%).

### 3.7.4 Available Action Buttons & Interactive Controls
* **[Manual Toggle Checkbox] Controls**: Allows Admissions Officers to manually override checklist items if webhook automation delays occur or if manual physical verification is conducted.
* **[Ping Lagging Students] Bulk Action Button**: Selects all students with overall readiness < 75% and transmits an automated urgent SMS reminder to complete their setup before Monday morning.
* **[Export Gate Check-in Sheet] Button**: Formats a printable barcode check-in sheet for physical campus security gates.

### 3.7.5 Step-by-Step Operational Workflows
* **Pre-Orientation Friday Audit Procedure (SOP-006)**:
  1. Access the Onboarding Tracker at 14:00 PM on the Friday preceding orientation kickoff.
  2. Select upcoming cohort from top filter.
  3. Sort table by **Overall Readiness Score** ascending (lowest scores at top).
  4. Select all students showing unchecked Slack or GitHub status.
  5. Click **[Ping Lagging Students]** to dispatch automated WhatsApp and SMS onboarding assistance links.
  6. Verify all physical students have **Physical Barcode ID Printed** checked; if not, initiate batch badge printing with Operations staff.

### 3.7.6 Troubleshooting & Common Error Messages
* **Symptom: Slack Webhook Not Updating Checkbox**: Occurs if a student registers on Slack using a different email address than their CRM applicant profile. *Remedy*: Click the checkbox manually to override after visually verifying their presence in the Slack channel, and update their primary email address in Personal Info.

---

## 3.8 Comprehensive Reports & Analytics Engine (\`/admissions/reports\`)

### 3.8.1 Architectural Overview & Functional Purpose
The **Reports & Analytics Engine** is an advanced business intelligence and institutional reporting module embedded directly within the Admissions CRM. Built to serve management oversight, accreditation audits, and strategic academic planning, this module generates deep statistical insights from historical and real-time CRM datasets.

It eliminates guesswork by generating automated visualizations of conversion funnels, demographic heatmaps across Nigerian states, gender diversity ratios, and marketing channel attribution analytics.

### 3.8.2 UI Layout & Navigation Architecture
The analytics suite is organized into themed dashboard tabs:
1. **Report Category Selector Ribbon**: Navigation tabs for **Executive Summary**, **Conversion Funnel Analytics**, **Demographic & State Heatmaps**, **Cohort Academic Performance**, and **Marketing Channel ROI**.
2. **Interactive Charting Canvas**: Large, responsive charting grids powered by Recharts and D3.js, rendering area splines, stacked bar charts, and geographical distribution maps.
3. **Custom Parameter Configuration Toolbar**: Allows setting custom date boundaries, comparing academic quarters YoY (Year-over-Year), and filtering by learning modality.

[Screenshot: Comprehensive Reports & Analytics Engine]

### 3.8.3 Detailed Screen Elements & Table Columns
* **Application-to-Enrollment Conversion Funnel**: A visual pipeline chart showing exact volume drop-offs at each lifecycle stage: *Total Registered* (100%) -> *Document Verified* (78%) -> *Screening Passed* (62%) -> *Enrolled & Admitted* (41%).
* **Geopolitical Zone Distribution Map**: A table and visual breakdown showing applicant origin density across Nigeria's 6 geopolitical zones (South-West, North-Central, South-South, South-East, North-West, North-East).
* **Gender Diversity Indicator**: Real-time ratio tracking female-to-male enrollment representation across engineering tracks, supporting institutional diversity mandates.
* **Laptop Ownership vs. Modality Correlation Grid**: Statistical cross-tabulation showing hardware ownership rates among physical versus remote cohorts.

### 3.8.4 Available Action Buttons & Interactive Controls
* **[Export PDF Executive Brief] Button**: Compiles visual charts and analytical data tables into a clean, multi-page PDF document formatted with corporate branding for presentation to the board of directors.
* **[Schedule Automated Monthly Report] Toggle**: Configures background cron tasks to automatically email PDF analytical summaries to executive stakeholders on the 1st of every month.
* **[Download Raw Data (JSON / CSV)] Button**: Extracts underlying statistical datasets for advanced offline econometric modeling in external tools.

### 3.8.5 Step-by-Step Operational Workflows
* **Generating Quarterly Accreditation Compliance Reports**:
  1. Access \`/admissions/reports\` and select tab: \`Demographic & State Heatmaps\`.
  2. Set Date Range Selector to cover the trailing academic quarter.
  3. Verify that student distribution covers at least 20 different Nigerian states to comply with federal NYSC integration guidelines.
  4. Click **[Export PDF Executive Brief]** and save document to local archive for presentation to ministry inspectors.

### 3.8.6 Troubleshooting & Common Error Messages
* **Error: \`Analytical Query Timeout (ERR-REP-504)\`**: Triggered when executing complex multi-year regression queries across millions of historical log rows during peak server hours. *Remedy*: Switch query range to a specific academic year or run analytical exports during off-peak evening hours.

---

## 3.9 Security Audit Logs & Compliance Monitoring (\`/admissions/audit\`)

### 3.9.1 Architectural Overview & Functional Purpose
In strict compliance with the **Nigeria Data Protection Regulation (NDPR)** and international cybersecurity standards, CorpersTech maintains an immutable, append-only **Security Audit Logs Module**. Every administrative action executed within the CRM—whether viewing a student profile, modifying an admission status, exporting a CSV spreadsheet, or broadcasting an SMS—is cryptographically recorded with a precise timestamp, staff email, IP address, and browser user-agent.

This module provides institutional transparency, prevents administrative fraud, deters unauthorized data exfiltration, and serves as an authoritative forensic ledger during internal security investigations.

### 3.9.2 UI Layout & Navigation Architecture
The module is structured as a high-density, forensic inspection terminal:
1. **Forensic Search & Multi-Parameter Filter Toolbar**: Allows searching audit trails by staff email address, applicant Ref ID, action category, or exact IP address range.
2. **Real-Time Immutable Audit Ledger Grid**: A chronological, auto-refreshing data table displaying historical administrative transactions in reverse-chronological order (newest events first).
3. **Security Alert & Anomaly Banner**: Highlights suspicious patterns, such as multiple bulk CSV exports executed by a single staff account during after-hours timestamps.

[Screenshot: Security Audit Logs Forensic Terminal]

### 3.9.3 Detailed Screen Elements & Table Columns
* **Timestamp (UTC / West Africa Time)**: Exact second-level timestamp of transaction execution (e.g., \`2026-07-02 14:22:10 WAT\`).
* **Staff Actor Name & Role**: Identifies the employee account performing the action (e.g., \`Admissions Officer - Emmanuel O.\`).
* **Action Category Tag**: Badged by event classification: 🔵 \`VIEW_PROFILE\`, 🟢 \`STATUS_TOGGLE\`, 🟡 \`COHORT_ASSIGN\`, 🟣 \`BULK_EMAIL_DISPATCH\`, or 🔴 \`DATA_EXPORT_CSV\`.
* **Target Record ID**: The specific applicant Ref ID or Cohort Code affected by the transaction.
* **Detailed Modification Log**: Displays exact before-and-after state values (e.g., \`Changed status from [Pending] to [Enrolled]; Assigned cohort [LAG-WEB-2026-Q3]\`).
* **Originating IP Address & Device**: Shows network IP address and browser workstation identifier.

### 3.9.4 Available Action Buttons & Interactive Controls
* **[Filter by My Actions] Shortcut Button**: Instantly isolates the audit ledger to display only transactions performed by the currently authenticated staff user.
* **[Export Compliance Ledger] Button**: Generates a tamper-evident, digitally signed PDF or Excel audit report for external data privacy regulators or institutional internal auditors.
* **[Flag Suspicious Transaction] Icon Button**: Allows senior admissions leads to bookmark anomalous entries for forensic review by the Super Admin and IT Security Director.

### 3.9.5 Step-by-Step Operational Workflows
* **Auditing After-Hours Data Access (SOP-008)**:
  1. Access \`/admissions/audit\` every Monday morning.
  2. In the Forensic Filter Toolbar, set Time Range to cover weekend hours (Friday 18:00 PM to Monday 07:00 AM).
  3. Filter Action Category by \`DATA_EXPORT_CSV\`.
  4. Inspect results; if any staff account initiated bulk data exports outside official working hours without documented authorization, immediately flag the transaction and report to the Super Admin.

### 3.9.6 Troubleshooting & Common Error Messages
* **Error: \`Audit Ledger Immutable - Write Denied (ERR-AUD-403)\`**: Occurs if a staff member or unauthorized script attempts to delete, edit, or purge rows from the audit table. *Remedy*: By institutional design, audit logs cannot be altered or deleted by any user, including Super Admins. This error confirms database security integrity is functioning correctly.

---

## 3.10 Quick Actions Ribbon & Global Search

### 3.10.1 Architectural Overview & Functional Purpose
The **Quick Actions Ribbon & Global Search Engine** is a universal navigation and productivity booster embedded persistently across the top header of every CRM module. Designed to eliminate multi-click navigation friction, it empowers Admissions Officers to search for candidates, trigger communication broadcasts, or log walk-in applications from any screen in the ecosystem in under two seconds.

### 3.10.2 UI Layout & Navigation Architecture
The component is divided into a centered search bar and a right-aligned command ribbon:
1. **Universal Global Search Bar**: A prominent text input box supporting shortcut activation (\`Ctrl + K\` or \`Cmd + K\`) with an instant auto-complete dropdown results preview.
2. **Quick Action Icon Ribbon**: Four high-frequency execution buttons: **[+ Walk-in Registration]**, **[⚡ Quick Broadcast]**, **[📋 Print Active View]**, and **[❓ Help & SOP Manual]**.

### 3.10.3 Step-by-Step Operational Workflows
* **Executing Rapid Global Search**:
  1. From any screen, press \`Ctrl + K\` (\`Cmd + K\`) on your keyboard.
  2. Type candidate Ref ID (e.g., \`8849\`) or phone number.
  3. Use arrow keys to highlight the matching applicant in the auto-complete preview and press Enter to open their Profile Drawer immediately.

---

## 3.11 System Notifications Hub & SLA Alerts

### 3.11.1 Architectural Overview & Functional Purpose
The **System Notifications Hub** acts as the central nerve system for operational alerts, automated background event reporting, and SLA monitoring. Accessible via the bell icon in the top right header, it aggregates real-time notifications regarding incoming registration spikes, duplicate profile detections, system health changes, and impending SLA expirations into a prioritized dropdown drawer.

### 3.11.2 UI Layout & Navigation Architecture
The notifications panel is categorized by priority tiers:
1. **🔴 Critical Priority (Immediate Action Required)**: SLA breach warnings (applications pending > 46 hours), system database failover notices, and high-confidence duplicate registration flags.
2. **🟡 Advisory Priority (Operational Updates)**: Roster capacity alerts (cohort reaching 90% fullness), bulk SMS dispatch completion receipts, and student waitlist promotions.
3. **🟢 Informational Priority (Routine Feeds)**: Overnight registration summary digests and automated database backup confirmations.

### 3.11.3 Step-by-Step Operational Workflows
* **SLA Escalation Management Procedure**:
  1. When the notification bell displays a pulsing red badge, click to open the Notifications Hub.
  2. Locate alerts labeled \`⚠️ SLA Breaching Soon (46 Hours Elapsed)\`.
  3. Click the alert card; the CRM automatically redirects to the Applicant Management Table, filtering and highlighting the exact candidate files requiring immediate admission decisions before the 48-hour SLA expires.

---

# Chapter 4: Daily Operational Workflow for an Admissions Officer

To standardize institutional productivity and guarantee Gold Master SLA compliance, every Admissions Officer must adhere to this structured chronological daily operational schedule. This workflow defines specific tasks from morning authentication through evening shift handover.

## 4.1 Chronological Shift Schedule

### Phase 1: Morning System Readiness & Queue Triage (08:00 AM - 09:30 AM)
* **08:00 AM - 08:15 AM: Secure Authentication & Environmental Audit**:
  * Log into the workstation terminal using official staff email (\`@olatech.com\`) and complete Multi-Factor Authentication (MFA).
  * Access \`/admissions\` Command Center; inspect top-right status pill to confirm \`● DATABASE ONLINE\` and verify network latency is < 50ms.
  * Check the **System Notifications Hub**; acknowledge overnight system feeds and isolate any critical red SLA breach warnings.
* **08:15 AM - 09:30 AM: Overnight Registration Queue Triage (SOP-001)**:
  * Navigate to \`/admissions/applicants\` and apply filter: \`Status = Pending\`.
  * Sort table by \`Submission Date\` ascending (oldest first) to enforce FIFO (First-In, First-Out) processing.
  * Perform rapid visual scanning of overnight arrivals; check for red \`⚠️ DUPLICATE SUSPICION\` banners and resolve duplicate profile merges immediately.
  * Flag all remote candidates lacking laptop ownership for transition to physical campus lab pre-requisite counseling.

### Phase 2: Candidate Screening, Vetting & Document Verification (09:30 AM - 13:00 PM)
* **09:30 AM - 11:30 AM: Detailed Candidate Document Vetting (SOP-002)**:
  * Open Candidate Profile Drawers sequentially from the pending queue.
  * Under **Academic & NYSC Tab**, open and inspect uploaded scans of NYSC Call-Up letters and university degree certificates. Verify legibility, watermark authenticity, and graduation dates.
  * If documentation is blurry or unreadable, check \`[x] Flag for Document Clarification\`, select **Template 05 (Document Clarification)** in the Communication Center, and dispatch an immediate re-upload request. Do not reject prematurely!
* **11:30 AM - 13:00 PM: Oral Telephone & Video Vetting Interviews**:
  * Conduct structured 5-minute telephone or WhatsApp video screening interviews with document-verified candidates.
  * Confirm candidate NYSC PPA deployment schedule aligns with classroom hours (morning physical labs vs. evening remote sessions).
  * Confirm personal computer hardware specifications for remote track applicants (minimum 8GB RAM, SSD storage).
  * Record factual, objective interview observations directly into the **Interviewer Comments** box under the Admin Vetting Logs tab.

### Phase 3: Administrative Lunch Break & Workstation Security (13:00 PM - 14:00 PM)
* **13:00 PM: Mandatory Security Lock**:
  * Before vacating the desk for lunch, save all active profile notes.
  * Press \`Win + L\` (\`Cmd + Ctrl + Q\` on macOS) to lock the workstation OS, or click **Secure Logout** in the CRM top header.
  * Ensure physical desk space is clean of printed candidate documents or roster sheets.
* *(Note: System auto-logout will enforce JWT token expiration after 15 minutes of inactivity as a failsafe).*

### Phase 4: Cohort Allocation, Modality Pairing & Dispatch (14:00 PM - 16:30 PM)
* **14:00 PM - 15:30 PM: Cohort Allocation & Admission Decisions (SOP-003)**:
  * Return to vetted profiles in \`/admissions/applicants\`.
  * For approved candidates, toggle status to 🟢 **Enrolled**.
  * Access the **Assigned Cohort** dropdown; select the appropriate active learning class (e.g., \`Lagos Web Dev Cohort 1 - Physical\`). Ensure cohort capacity utilization is < 100%.
  * For candidates who failed technical prerequisite screening, toggle status to 🔴 **Rejected** and assign standardized Rejection Reason Code (e.g., \`CODE-R2: Failed Technical Assessment\`).
  * Click **[Save Profile Changes]** to execute backend database commits and automated webhook triggers.
* **15:30 PM - 16:30 PM: Logistics Pairing & Stipend Sync**:
  * Navigate to \`/admissions/transport\`.
  * For newly admitted physical campus students, check residential addresses against corporate shuttle corridors.
  * Assign eligible students to Shuttle Bus Routes 01, 02, or 03.
  * For off-route physical students, execute BVN biometric name matching and click **[Approve Stipend Disbursal]** to sync records with the Finance Officer dashboard.

### Phase 5: Daily Shift Wrap-Up, SLA Audit & Handover (16:30 PM - 17:00 PM)
* **16:30 PM - 16:45 PM: End-of-Day SLA Compliance Audit**:
  * Navigate to \`/admissions/applicants\`; filter by \`Status = Pending\`.
  * Check the oldest remaining pending record. Guarantee that zero applications submitted > 40 hours ago remain unprocessed, ensuring 100% adherence to the mandatory 48-hour institutional SLA.
* **16:45 PM - 17:00 PM: Administrative Handover & Logging**:
  * Check **Orientation Onboarding Tracker** for upcoming Monday cohorts; trigger automated bulk SMS reminders to lagging students with readiness scores < 75%.
  * Log out of the CorpersTech staff workspace securely and shut down workstation hardware.

---

## 4.2 Standard Operating Procedure (SOP) Reference Table

| SOP Number | Standard Operating Procedure Title | Primary Execution Module | Target Execution Window |
| :--- | :--- | :--- | :--- |
| **SOP-001** | Overnight Queue Triage & Duplication Resolution | \`/admissions/applicants\` | Daily (08:15 AM - 09:30 AM) |
| **SOP-002** | Comprehensive Candidate Vetting & Document Verification | \`/admissions/applicants/:id\` | Daily (09:30 AM - 13:00 PM) |
| **SOP-003** | Cohort Allocation, Seat Hard-Cap Governance & Enrollment | \`/admissions/cohorts\` | Daily (14:00 PM - 15:30 PM) |
| **SOP-004** | Handling Blurry Scans & Document Re-Upload Requests | \`/admissions/communications\` | Immediate upon discovery |
| **SOP-005** | Executing Mid-Semester Inter-Cohort Student Transfers | \`/admissions/cohorts\` | As requested by Academic Lead |
| **SOP-006** | Pre-Orientation Friday Readiness Audit & Bulk Reminders | Onboarding Tracker | Fridays (14:00 PM - 16:30 PM) |
| **SOP-007** | Soft-Deletion Recovery & Archival Profile Restoration | \`/admissions/applicants\` | As required for audit recovery |
| **SOP-008** | Weekly Security Audit Ledger Inspection & Exfiltration Check | \`/admissions/audit\` | Mondays (08:00 AM - 08:30 AM) |

---

# Chapter 5: Real-World Operational Scenarios & Resolution Protocols

This chapter provides step-by-step authoritative administrative protocols for resolving the eight most common and complex operational edge cases encountered during Admissions CRM governance.

## 5.1 Scenario 1: Duplicate Registration Detection & Resolution Protocol
* **Problem Statement**: An applicant registers twice: first using their personal email (\`emmanuel.o@gmail.com\`) with a typo in their phone number, and subsequently using their official NYSC email (\`emmanuel.o@nysc.gov.ng\`) with correct contact details. Both records appear in the Pending queue, generating a red \`⚠️ DUPLICATE SUSPICION\` banner based on matching BVN and physical street address algorithms.
* **Authoritative Resolution Protocol (SOP-001)**:
  1. Do not approve or reject either record immediately. Click on the duplicate alert banner to open the **Duplicate Resolution Comparison Modal**.
  2. Inspect both records side-by-side. Confirm identical legal full name, NYSC Call-Up number, and date of birth.
  3. Identify the primary, most complete record (in this case, the second registration with the verified phone number and official NYSC email).
  4. Open the incomplete/duplicate first record (\`emmanuel.o@gmail.com\`).
  5. In the Action Footer, click **[Soft Delete / Archive]**. In the mandatory archive justification prompt, enter: *"Duplicate registration record merged into primary profile Ref OLT-2026-9912 per SOP-001."*
  6. Return to the primary record; click **"Override Duplicate Warning - Verified Primary"** to clear the red flag from the system.
  7. Proceed with standard document vetting on the validated primary record.

## 5.2 Scenario 2: Wrong Learning Track Selection After Enrollment
* **Problem Statement**: A student successfully admitted and enrolled into *Lagos Python Cohort 1* contacts the Admissions Support desk 3 days before orientation kickoff. They explain that they selected Python by mistake during online registration and urgently wish to be re-assigned to *Lagos Data Science & AI Cohort 1*.
* **Authoritative Resolution Protocol**:
  1. Navigate to \`/admissions/applicants\` and locate the student using Global Search (\`Ctrl + K\`).
  2. Open their Profile Drawer and navigate to the **Technical Assessment Tab**.
  3. Inspect their automated onboarding quiz logical reasoning score. Confirm the student scored **≥ 70%** (the mandatory prerequisite threshold for Data Science & AI).
  4. *If Score < 70%*: Politely inform the student via email that Data Science requires a minimum 70% reasoning aptitude score, and counsel them to remain in Python Programming as a foundational building block.
  5. *If Score ≥ 70%*: Check \`/admissions/cohorts\` to confirm *Lagos Data Science Cohort 1* has available seating (< 30 seats filled).
  6. In the student's Profile Drawer, change **Selected Track** to \`Data Science & AI\`.
  7. Change **Assigned Cohort** from \`Lagos Python Cohort 1\` to \`Lagos Data Science Cohort 1\`.
  8. In **Interviewer Comments**, append: *"Track re-assignment requested by student pre-orientation. Verified logical reasoning score (78%) meets advanced track prerequisites. Transferred from Python to Data Science Cohort 1 on 02/07/2026."*
  9. Click **[Save Profile Changes]**. The backend automatically updates Slack channel memberships and GitHub repository team assignments.

## 5.3 Scenario 3: Physical Shuttle Bus Capacity Exhaustion & Transit Re-Routing
* **Problem Statement**: A newly enrolled physical campus student residing in Kubwa, Abuja qualifies for corporate shuttle transit. However, when the officer attempts to assign them to *Abuja Route 03 (Kubwa Express)* in \`/admissions/transport\`, the system returns error \`ERR-TRN-001: Shuttle Manifest Full (22/22 Seats Assigned)\`.
* **Authoritative Resolution Protocol**:
  1. Do not attempt to force-add a 23rd student onto the vehicle; overcrowding violates corporate transit insurance policies.
  2. In the Transportation Management grid, select the student's row.
  3. Change Transit Classification from \`Corporate Shuttle Candidate\` to \`Approved for Direct Monthly Transport Stipend\`.
  4. Click **[Verify BVN & Name Match]** to validate their entered bank account details against Central Bank of Nigeria records.
  5. Once green BVN verification is confirmed, click **[Approve Stipend Disbursal]**.
  6. Open \`/admissions/communications\`, select SMS Channel, and dispatch a personalized advisory: *"Hello {{applicant_name}}, our Kubwa corporate shuttle is fully booked for this batch. You have been approved for direct monthly transport stipend disbursal to cover your daily commute to the Abuja campus. Please check your email for financial disbursal timelines."*

## 5.4 Scenario 4: Blurry or Inaccessible Document Uploads During Vetting
* **Problem Statement**: While vetting a pending applicant profile in \`/admissions/applicants/:id\`, the officer clicks the NYSC Call-Up letter document thumbnail under the Academic Tab. The PDF file opens, but the uploaded image is extremely blurry, truncated, or dark, making it impossible to read the Call-Up Number or verify the official watermark seal.
* **Authoritative Resolution Protocol (SOP-004)**:
  1. Under no circumstances should the officer click **Rejected**! Blurry scans are a formatting technicality, not an academic failure.
  2. In the Profile Drawer, check the box labeled \`[x] Flag for Document Clarification\`.
  3. Navigate to \`/admissions/communications\` (or click the quick-action **[Email Candidate]** button in the drawer header).
  4. Select **Template 05: Urgent Document Clarification / Re-Upload Request**.
  5. In the message body, verify the automated variable injection clearly states: *"Your NYSC Call-Up Letter scan was unreadable. Please re-upload a clear, high-resolution PDF or JPEG scan within 24 hours to prevent registration archiving."*
  6. Click **[Send Email & SMS Dispatch]**.
  7. In the candidate's **Interviewer Comments**, log: *"Vetting paused 02/07/2026. Blurry Call-Up scan encountered. Dispatched Template 05 clarification request. Profile placed on 48-hour document hold."*
  8. Do not change status from Pending; move to the next candidate in the triage queue.

## 5.5 Scenario 5: Emergency Course Transfer Request Post-Kickoff
* **Problem Statement**: Two weeks after academic kickoff, a physical campus student enrolled in *Lagos Web Development Cohort 1* is formally redeployed by the NYSC State Secretariat from Lagos State to Kano State. The student can no longer attend physical laboratory classes and requests an emergency transfer to continue their education remotely.
* **Authoritative Resolution Protocol (SOP-005)**:
  1. Request and receive a digital copy of the student's official NYSC Redeployment Letter via email for compliance archiving.
  2. Navigate to \`/admissions/cohorts\` and open the roster table for *Lagos Web Development Cohort 1*.
  3. Locate the student row and click the **[Transfer Student]** action button.
  4. In the transfer modal, select New Modality: \`Virtual Remote\`.
  5. Select Target Cohort: \`Virtual Web Development Cohort 1 (Remote)\`.
  6. Enter mandatory transfer note: *"NYSC inter-state redeployment from Lagos to Kano State confirmed via official directorate letter. Transferred from Physical Lagos Cohort 1 to Virtual Remote Cohort 1 effective Week 2."*
  7. Click **[Execute Roster Transfer]**.
  8. Verify that the backend releases their physical iMac workstation in the campus lab inventory (incrementing available lab PC seats by +1 for waitlisted students) and transitions their Slack channel permissions to the remote campus group.

## 5.6 Scenario 6: Student Postponement & Deferral of Admission
* **Problem Statement**: An applicant vetted and approved for *Lagos VI Cybersecurity Cohort 1* suffers a medical emergency or severe maternity conflict 4 days prior to orientation. They contact admissions requesting to defer their admission seat to the next quarterly academic intake (e.g., deferring from Q3 2026 to Q4 2026).
* **Authoritative Resolution Protocol**:
  1. Open the student's Profile Drawer in \`/admissions/applicants\`.
  2. Change their Status badge from 🟢 **Enrolled** to ⚪ **Archived / Deferred**.
  3. Clear the **Assigned Cohort** dropdown field (setting it to \`null\` / Unassigned), immediately releasing their physical classroom seat for the next waitlisted candidate.
  4. In **Interviewer Comments**, append: *"Admission formally deferred to Q4 2026 intake per documented medical postponement request received 02/07/2026. Credential vetting remains valid. Promote to Enrolled upon Q4 registration opening."*
  5. Click **[Save Profile Changes]**.
  6. Send a manual confirmation email advising the student to contact admissions 2 weeks prior to the Q4 kickoff date for rapid seat reinstatement without re-testing.

## 5.7 Scenario 7: Student Voluntary Withdrawal from Program
* **Problem Statement**: Three weeks into the academic semester, an enrolled student in *Abuja Python Cohort 1* secures a demanding full-time corporate job that prevents them from continuing the bootcamp. They submit a formal voluntary withdrawal request.
* **Authoritative Resolution Protocol**:
  1. Open the student's profile in \`/admissions/cohorts\` -> *Abuja Python Cohort 1* Roster.
  2. Click **[Quick Edit]** on their roster entry.
  3. Change Academic Standing from \`Active\` to \`Voluntary Withdrawal\`.
  4. Toggle Profile Status to 🔴 **Rejected / Withdrawn** and assign Rejection Code \`CODE-W1: Voluntary Student Withdrawal\`.
  5. In **Interviewer Comments**, record: *"Student formally withdrew Week 3 due to conflicting full-time employment schedule. Slack workspace and GitHub organization access revoked. Zero negative academic standing applied."*
  6. Click **[Save & Revoke Access]**.
  7. Notify the Finance Officer via system note to immediately terminate any pending monthly transport stipend disbursements for the remainder of the semester.

## 5.8 Scenario 8: Recovering an Accidentally Soft-Deleted or Archived Application
* **Problem Statement**: During rapid morning queue triage, a junior Admissions Officer accidentally clicks the trash icon on the wrong candidate row in \`/admissions/applicants\`, soft-deleting a highly qualified, fully vetted candidate file from the active grid.
* **Authoritative Resolution Protocol (SOP-007)**:
  1. Do not panic; CorpersTech database architecture prevents accidental permanent data destruction via hard-deletion intercepts.
  2. In the Applicant Management Table, navigate to the top persistent filter ribbon.
  3. Click the **[Status Filter]** dropdown and select the hidden view: ⚪ **Archived / Soft-Deleted Records**.
  4. Locate the accidentally deleted applicant record (searchable by name or Ref ID).
  5. Click the **[Restore Record]** action icon (circular counter-clockwise arrow button) in the rightmost Actions column.
  6. In the restoration confirmation dialog, confirm status reset to 🟡 **Pending** or 🟢 **Enrolled**.
  7. Open the restored Profile Drawer, verify all uploaded document attachments and interview comments remain 100% intact, and append a log note: *"Record restored from soft-delete archive on 02/07/2026 per SOP-007."*
  8. Open \`/admissions/audit\` to verify the restoration timestamp is properly recorded in the immutable compliance ledger.

---

# Chapter 6: Operational Wisdom: Best Practices, Common Mistakes, Tips & Warnings

## 6.1 Best Practices for Admissions Excellence
* **The 48-Hour SLA is Absolute**: Treat the 48-hour application turnaround SLA as an unbreakable law. An applicant who waits 5 days for an admission decision loses enthusiasm, seeks alternative programs, or assumes rejection.
* **Objective, Factual Documentation**: Write every interview note as if it will be read in a court of law or reviewed by an international tech recruiter. Use clean, professional sentences. State measurable facts (\`"Owns 16GB M1 Mac, degree verified"\`), never emotional gossip (\`"Seems lazy"\`).
* **Empathy in Candidate Communication**: Remember that NYSC corps members are young graduates navigating a stressful transition into professional life. When requesting document re-uploads or explaining transport route limits, maintain a warm, supportive, and highly professional corporate tone.
* **Continuous Cross-Departmental Sync**: Admissions does not operate on an island. Maintain daily communication with Operations Officers (regarding lab computer hardware status), Career Officers (regarding student technical background), and Finance Officers (regarding transport stipend approval lists).

## 6.2 Common Mistakes & Prevention Strategies

| Common Operational Mistake | Root Cause Analysis | Institutional Prevention Strategy |
| :--- | :--- | :--- |
| **1. The Orphaned Student Trap** | Officer changes status to \`Enrolled\` but forgets to select an \`Assigned Cohort\` from the dropdown before saving. | CRM form validation now prompts an advisory warning if status is Enrolled while cohort field is null. Always double-check cohort tag! |
| **2. Workstation Lab Abandonment** | Staff member leaves administrative terminal logged in and unlocked while taking lunch break in physical campus labs. | Mandatory 15-minute auto-logout session timeout enforced. Staff must press \`Win + L\` or click Secure Logout whenever leaving desk. |
| **3. Blank Interview Comments** | Officer conducts phone interview and approves student but leaves comment text area empty to save time. | Weekly audit reports highlight enrolled students with blank notes. Officers with > 3 blank files receive formal administrative warnings. |
| **4. Premature Rejection of Blurry Scans** | Officer rejects candidate immediately upon seeing a blurry NYSC Call-Up scan instead of requesting re-upload. | Staff retrained on SOP-004. Always dispatch Template 05 (Clarification Request) and allow 48 hours for document resubmission before rejection. |
| **5. Overfilling Physical Lab Cohorts** | Admitting 35 students into a physical campus lab that only contains 30 desktop PCs and chairs. | CRM system intercept now hard-blocks cohort assignments once seat ratio hits 30/30 (100%). Check utilization bar before assigning! |

## 6.3 Power Tips from Experienced Admissions Leads
💡 TIP 1: Master Keyboard Search Shortcuts
When inside the Applicant Management Table, press \`/\` on your keyboard to instantly focus the global search bar without reaching for the mouse. Type \`status:pending state:LA\` and hit Enter for instant triage!

💡 TIP 2: Use Multi-Tab Vetting for High Speed
When processing a large batch of pending records, open 5 candidate profiles in separate browser tabs by middle-clicking their View buttons. While document PDFs load in tabs 3, 4, and 5, conduct verbal phone screenings for tabs 1 and 2!

💡 TIP 3: Leverage Bulk Broadcasts on Friday Afternoons
Never send individual orientation reminder emails one by one! Use the Cohort Management roster view on Friday at 4:00 PM, select the entire class via header checkbox, and dispatch Template 04 in a single 3-second broadcast.

💡 TIP 4: Check Email Duplication Intelligence First
Before spending 10 minutes vetting a candidate's transcripts and calling their phone, glance at the top right of their profile drawer. If the red \`⚠️ DUPLICATE SUSPICION\` banner is active, resolve the merge first to avoid vetting the same human twice!

## 6.4 Critical System Warnings & Security Alerts
⚠️ WARNING: ZERO EXTERNAL SPREADSHEET EXPORTING
Under no circumstances are Admissions Officers permitted to export candidate CSV or Excel lists to personal flash drives, personal Google Drives, or private email accounts. All data extraction is monitored by the Audit Logs Module. Unauthorized data exfiltration constitutes a severe breach of NDPR laws and results in immediate administrative termination and legal prosecution.

⚠️ WARNING: CONCURRENT LOGIN INTERCEPT
Your staff credentials (\`admissions@olatech.com\`) cannot be active on two physical devices simultaneously. If you log into your laptop while logged into a campus desktop PC, the desktop session will be immediately terminated and flagged in the security audit ledger.

⚠️ WARNING: STRICT COHORT CAPACITY ENFORCEMENT
Never attempt to bypass cohort seat limits by modifying front-end HTML parameters or requesting database direct edits. Physical lab safety codes and electrical load limits dictate exactly 30 workstations per lab room. Overflow students must be assigned to remote digital cohorts or waitlisted for the next academic batch.

---

*(Proceeding to Part 3: Chapters 7 through 9...)*
`;
