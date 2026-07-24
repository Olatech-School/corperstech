export const EMERGENCY_MANUAL_PART_2 = `# 4. Operational Emergencies

Operational emergencies occur when day-to-day campus administration, student enrollment, or staffing schedules experience acute disruption. While these incidents rarely threaten hardware infrastructure, they directly impact student morale, academic progression, and institutional reputation. All staff must follow these step-by-step resolution SOPs.

### 4.1 Student Complaints & Escalations (SOP-OP-01)
* **Trigger**: A student or group of corps members submits an urgent formal grievance regarding instruction quality, facility conditions, or peer conflicts via the Support Portal or NYSC Liaison.
* **Severity**: Level 1 (Individual) or Level 2 (Cohort-Wide).
* **Step-by-Step Procedure**:
  1. **Triage & Acknowledge**: The Support Officer must review the ticket within 30 minutes, tagging it with priority **Urgent** in the Error & Enquiry Center. Send an immediate acknowledgment email assuring the student of formal review.
  2. **Fact-Gathering Interview**: Conduct a private, 15-minute fact-finding interview with the complaining student. Document exact dates, times, and witnesses without offering premature promises or admitting institutional liability.
  3. **Departmental Review**: Escalate the grievance report to the relevant Department Head (e.g., Head of Instruction for teaching complaints; Head of Logistics for bus disputes).
  4. **Resolution & Closing**: Formulate a written remediation plan within 24 hours. Once accepted by the student and approved by the Executive Director, log the resolution in the student's CRM profile and close the ticket.
* **Escalation Path**: If a student threatens legal action or media exposure, immediately escalate to Level 3 and transfer lead communication to the Executive Director and Legal Counsel.

### 4.2 Registration & Enrollment Failures (SOP-OP-02)
* **Trigger**: Applicants report an inability to submit application forms, receive OTP verification codes, or complete NYSC call-up number validation during active recruitment windows.
* **Severity**: Level 2 (Moderate) or Level 3 (If enrollment gateway is totally blocked).
* **Step-by-Step Procedure**:
  1. **Gateway Verification**: The Admissions Officer immediately navigates to the Command Center **Admissions Dashboard** and checks the real-time application intake counter. If intake has dropped to zero for over 45 minutes during peak recruitment, declare an enrollment anomaly.
  2. **Manual Override Intake**: Activate the **Emergency Standby Form** (hosted on our fallback static edge server) by toggling the "Enable Emergency Application Routing" switch in Module 2. This redirects applicants to a clean HTML form that buffers applications into local JSON storage.
  3. **Technical Notification**: Notify DevOps via #emergency-command to inspect email/SMS SMTP gateways and database write permissions.
  4. **Batch Re-Sync**: Once backend database services are verified operational, click **[Import Standby Applications]** in the CRM to ingest all buffered records without candidate data loss.

### 4.3 Duplicate Application Resolution (SOP-OP-03)
* **Trigger**: The Command Center flags duplicate NYSC call-up numbers, email addresses, or phone numbers during candidate vetting, locking both profiles.
* **Severity**: Level 1 (Low).
* **Step-by-Step Procedure**:
  1. **Profile Comparison**: Navigate to **Module 2 -> Vetting Queue** and open the Duplicate Resolution modal. Compare timestamps, IP addresses, and uploaded credentials for both conflicting entries.
  2. **Identity Verification**: Contact the applicant via their registered phone number to confirm if the duplicate submission was caused by browser timeouts or if an identity theft attempt is underway.
  3. **Record Merge**: In the CRM, select the verified primary profile and click **[Merge & Archive Duplicate]**. This migrates all application notes and document attachments to the canonical record while soft-deleting the duplicate.

### 4.4 Lost Application Records Recovery (SOP-OP-04)
* **Trigger**: An enrolled student arrives on campus for orientation, but their name and record cannot be found in the active Command Center CRM database.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Check Archival & Fallback Tables**: In the CRM search bar, change the filter from "Active Students" to "All Statuses (Including Archived/Rejected)" and query by NYSC State Code or email address.
  2. **Audit Checksum Log Verification**: If not found in primary tables, open **Module 7 (Backup & Disaster Recovery)** and search the hourly automated JSON backup snapshots from the preceding 7 days using the student's phone number.
  3. **Emergency Re-Creation**: If the record was accidentally purged or lost during a migration, click **[Emergency Profile Reconstruction]**. Enter the student's verified NYSC Call-Up Letter details and override the standard vetting gate with the Super Admin authorization key.

### 4.5 Incorrect Cohort & Track Assignment (SOP-OP-05)
* **Trigger**: A student is assigned to Full-Stack Web Development (Track A) instead of Data Science & AI (Track B), or is placed in an incorrect morning/afternoon lab session.
* **Severity**: Level 1 (Low).
* **Step-by-Step Procedure**:
  1. **Capacity Audit**: Check the target classroom and lab capacity in Module 3 (Academic & Curriculum Operations). Ensure the transfer will not violate the maximum 30-student per lab safety limit.
  2. **Execute Track Migration**: Open the student's profile, click **[Modify Track / Cohort]**, select the correct curriculum stream, and select reason: *Administrative Correction*.
  3. **Sync Learning Assets**: Click **[Re-Provision Lab Access]**. The Command Center automatically revokes access to old course repositories and emails the student their new GitHub classroom invitation and timetable.

### 4.6 Transportation & Route Disputes (SOP-OP-06)
* **Trigger**: Students dispute bus boarding rejections, report overcrowded shuttles, or contest route pick-up timing at bus stops.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Scan Error Verification**: The Bus Marshal reviews the handheld scanner log. If the scanner flashes **WRONG BUS - ASSIGNED TO ROUTE 03**, explain the zoning policy calmly to the student.
  2. **Emergency Override Seating**: If the student is stranded at an unsafe junction in bad weather, the Marshal contacts the Operations Officer via radio to request an **Emergency Override Code**.
  3. **Logistics Dashboard Override**: The Operations Officer opens **Module 4 -> Daily Manifests**, locates the shuttle, and clicks **[Authorize Jump-Seat Boarding]**, temporarily expanding manifest capacity by 1 seat and generating an audit trail.

### 4.7 Orientation & Assembly Disruptions (SOP-OP-07)
* **Trigger**: Power failure, PA system collapse, unruly crowd behavior, or medical events during a 500-student national onboarding assembly.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Immediate Crowd Control**: Instructors take stage microphones (or battery-powered megaphones) to direct students to remain seated and maintain calm.
  2. **Activate Backup PA / Power**: Facility technicians immediately switch on the hall's dedicated 5kVA auxiliary inverter power and secondary wireless microphones.
  3. **Decentralized Assembly Routing**: If the main hall becomes unusable due to heat or technical failure, the Operations Officer orders a **Decentralized Breakout**. Instructors guide students by color-coded lanyards into their 10 designated individual lecture classrooms to continue orientation via classroom screens.

### 4.8 Staff Absenteeism & Emergency Coverage (SOP-OP-08)
* **Trigger**: A lead instructor, bus captain, or campus systems administrator reports acute illness or absence less than 2 hours before daily operations commence.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Roster Check & Standby Activation**: The Department Head opens the Staff Command Module and checks the **Daily Emergency Standby Roster**. Every critical teaching and operational role has a designated secondary backup officer assigned weekly.
  2. **Automated Duty Reassignment**: In Module 1 (Staff Administration), select the absent staff member and click **[Trigger Standby Reassignment]**. The Command Center automatically transfers classroom lab ownership, shuttle manifest permissions, and support ticket queues to the designated backup officer.
  3. **Curriculum Continuity**: If no standby instructor is physically present, the Assistant Lab Officer initiates **Asynchronous Masterclass Mode**, broadcasting pre-recorded Gold Master lecture modules on classroom displays while facilitating hands-on coding exercises.

---

## 5. Technical & System Emergencies

Technical emergencies threaten the digital core of Olatech School of Programming. All engineers must execute these procedures with surgical precision, strictly observing the rules of data preservation and backup verification.

[Screenshot: Error Center & System Diagnostics Command Panel]

### 5.1 Server Downtime & Container Unreachability (SOP-TECH-01)
* **Trigger**: Automated uptime pingers report HTTP 502 Bad Gateway or HTTP 504 Gateway Timeout across the primary cloud domain; Docker/Cloud Run containers fail to respond to ingress traffic on Port 3000.
* **Severity**: Level 3 (High) or Level 4 (Critical if exceeding 15 minutes during peak hours).
* **Step-by-Step Procedure**:
  1. **Verify Ingress Reverse Proxy**: Check the edge nginx reverse proxy logs. Confirm that external traffic is correctly reaching Port 3000 and that SSL certificates are valid and not expired.
  2. **Container Health & Logs**: Access the cloud container console. Execute docker stats or check cloud memory metrics to determine if the container crashed due to out-of-memory (OOM) killer heap exhaustion.
  3. **Hot-Restart & Scaling**: If container instances are deadlocked, execute an emergency rolling restart of the container cluster. Scale instance count from 2 to 6 to absorb surge traffic.
  4. **Stale Lock Cleanup**: If the server fails to boot due to stale PID locks or corrupted temporary sockets, execute clean-boot script removing /tmp/runtime.lock before re-initializing the Node.js server instance.

### 5.2 Database Interruption & Fallback Execution (SOP-TECH-02)
* **Trigger**: PostgreSQL database connection pool exhaustion; Prisma ORM throws P1001 (Can't reach database server) or P2024 (Timed out fetching a new connection from the connection pool).
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure (Incorporating Existing Protocol)**:
  1. **Database Interruption Check**: Immediately check if the local JSON fallback databases are active. The CorpersTech Command Center automatically uses fallbacks when primary cloud PostgreSQL latency exceeds 2000ms or connection fails.
  2. **Verify Fallback Integrity**: Navigate to **Module 7 (Backup & Disaster Recovery)** and verify that the status badge displays **FALLBACK MODE ACTIVE (LOCAL STORAGE)** in warning yellow. Confirm that staff can still read student lists and execute daily check-ins without data loss.
  3. **Connection Pool Reset**: In the cloud database console, terminate idle connections exceeding 300 seconds. Increase connection pool max limit in DATABASE_URL connection string from ?connection_limit=10 to ?connection_limit=35.
  4. **Primary Re-Synchronization**: Once primary PostgreSQL server health is restored, click **[Synchronize Fallback to Primary SQL]** in Module 7. The engine replays all buffered JSON transactions into SQL relational tables sequentially, verifying checksum parity before returning to primary database mode.

### 5.3 Prisma ORM Schema & Query Errors (SOP-TECH-03)
* **Trigger**: Application throws Prisma Client runtime validation errors (P2002 Unique constraint failed, P2025 Record to update not found) during mass student enrollment or grading updates.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Query Isolation**: Check the Error Center trace logs to identify the exact Prisma query causing the failure (e.g., duplicate NYSC state code insertion).
  2. **Schema Synchronization**: If schema drift occurred between production database tables and Prisma client stubs, execute npx prisma generate in the container build environment and restart the server process.
  3. **Data Scrubbing**: For P2002 unique constraint violations, run the automated scrubbing utility in Module 7 to identify and isolate orphaned or duplicate foreign key records before re-executing the batch transaction.

### 5.4 Third-Party API & Integration Failures (SOP-TECH-04)
* **Trigger**: External integrations—such as SMS notification gateways, WhatsApp Business APIs, NYSC verification endpoints, or Google Maps routing services—return HTTP 401 Unauthorized, 429 Too Many Requests, or 503 Service Unavailable.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Circuit Breaker Activation**: The Command Center automatically trips the circuit breaker after 5 consecutive external API failures, preventing thread blocking and application freezes.
  2. **Switch to Secondary Gateway**: In **Module 8 (System Settings)**, navigate to Integration Gateways. If the primary SMS vendor fails, toggle the radio switch to **Secondary Fallback SMS Provider** and click Save Configuration.
  3. **Asynchronous Retry Queue**: All failed outbound student notifications are buffered in the Retry Queue. Once gateway connection is verified, click **[Flush Notification Queue]** to dispatch delayed messages.

### 5.5 Internet Outages & Campus Gateway Failures (SOP-TECH-05)
* **Trigger**: Fiber optic internet feed to the campus computer labs and administrative command room is cut or experiences ISP fiber cut.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Automatic LTE/5G Failover**: The campus enterprise edge router is configured with dual-SIM 5G backup modems. Confirm via network monitor that WAN failover has executed within 15 seconds.
  2. **Bandwidth Throttling**: To preserve cellular data bandwidth for core Command Center CRM operations and classroom code pushes, the router automatically applies QoS rules blocking high-bandwidth video streaming and non-essential downloads across student Wi-Fi networks.
  3. **Local Intranet Mirroring**: If external cellular internet also fails, instruct lab assistants to point student workstations to the local campus LAN mirror (http://10.0.0.5:3000), where local copies of curriculum documentation, video lectures, and offline coding sandboxes remain fully accessible.

### 5.6 Backup Generation & Storage Failures (SOP-TECH-06)
* **Trigger**: Automated hourly cron job generating JSON database backups fails with disk full error or cloud S3/GCS bucket upload permission denied.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Storage Quota Inspection**: Access the server filesystem and check /tmp and backup directory disk utilization. Purge temporary export archives older than 14 days by clicking **[Clean Stale Export Logs]** in Module 7.
  2. **Credential Verification**: Ensure cloud storage IAM service account keys have not expired. Re-authenticate bucket write permissions if token rotation occurred.
  3. **Manual Snapshot Execution**: Click **[Generate Immediate Checksum Snapshot]** in Module 7. Verify that the output SHA-256 hash matches the database record count and that the download file is non-zero in size.

### 5.7 Authentication & Session Security Failures (SOP-TECH-07)
* **Trigger**: Staff report widespread inability to log into Command Center; JWT signature validation fails globally; or session cookies expire prematurely due to clock drift.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Server NTP Clock Sync**: Check container operating system time synchronization. Clock drift exceeding 60 seconds will invalidate JSON Web Token (JWT) timestamps ('iat' and 'exp'). Execute NTP resynchronization immediately.
  2. **Emergency Secret Rotation**: If authentication failure is caused by a suspected secret compromise, the Super Admin must navigate to Module 8 and execute **[Rotate JWT Signing Secret]**.
  3. **Global Session Reset**: Clicking secret rotation automatically logs out all staff globally. Broadcast an advisory on internal Slack instructing staff to clear browser session cache and log in with their permanent credentials.

### 5.8 Command Center UI & Client Errors (SOP-TECH-08)
* **Trigger**: Frontend React application throws white-screen runtime errors, hydration mismatches, or uncaught DOM exceptions after a code deployment.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Rollback Asset Bundle**: In the server build directory, immediately revert static client JavaScript bundles to the previous Gold Master release tag.
  2. **Clear CDN & Browser Cache**: Update the cache-busting version query string in index.html from ?v=1.0 to ?v=1.0.1-hotfix to force client browsers to discard corrupted scripts.
  3. **Error Boundary Recovery**: All modular views in CorpersTech are wrapped in React Error Boundaries. Instruct affected users to click the **[Reset View State]** button displayed on the fallback card to clear corrupted local state.

### 5.9 Recruitment AI Discovery Engine Failures (SOP-TECH-09)
* **Trigger**: The Gemini AI web scraper crawler starts throwing rate-limit errors, parsing malformed job listings, or flagging legitimate employer opportunities as fraudulent.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure (Incorporating Existing Protocol)**:
  1. **Crawler Throttling**: In **Module 5 (Recruitment AI Operations)**, reduce scraper concurrent thread count from 10 to 2 and increase inter-request delay from 1000ms to 5000ms to clear anti-bot rate limits.
  2. **Fraudulent Job Flag Action**: If the AI engine or a staff member flags a scraped opportunity as a fraudulent job posting or scam scam scam, execute the mandatory existing rule: **Immediately change job status to "Archived" or delete it from the active database**. Never allow unverified or suspicious listings to remain visible to corps members.
  3. **Model Prompt Calibration**: If the AI categorization engine mislabels job tracks, click **[Recalibrate System Prompt]** in Module 5 to restore the Gold Master classification instructions and re-run batch validation.

---
*End of Part 2. Proceed to Part 3 for Security Incidents, Threat Containment, and Student Transportation Emergency SOPs.*
`;
