export const EMERGENCY_MANUAL_PART_5 = `# 12. Practical Emergency Scenarios (Deep Dives)

To bridge theoretical procedure with live operational execution, this section provides comprehensive, end-to-end response scripts for the seven most probable critical emergency scenarios at Olatech School of Programming.

### 12.1 Scenario 1: Database Becomes Unavailable During Registration
* **Incident Description**: At 10:15 AM on the final day of NYSC batch enrollment, 1,200 applicants simultaneously hit the portal. The primary PostgreSQL database server CPU usage spikes to 100%, and connection pool limits are exceeded. The registration portal displays HTTP 504 Gateway Timeout.
* **Severity Classification**: Level 3 (High Severity).
* **Immediate Containment (Minutes 0 to 5)**:
  1. Automated health monitors detect API latency > 3000ms and trigger PagerDuty/Slack alarms to DevOps.
  2. The Technical Lead acknowledges the alarm at Minute 2 and checks cloud monitoring dashboard, confirming connection pool exhaustion (100/100 active connections).
  3. The Command Center engine automatically trips the circuit breaker, activating **Fallback Mode Active (Local Storage)**.
* **Resolution & Recovery (Minutes 5 to 25)**:
  1. In **Module 2 (Admissions Operations)**, the Admissions Lead verifies that incoming application submissions are seamlessly deflecting into local static edge JSON queues without applicant error messages.
  2. DevOps accesses the cloud PostgreSQL instance and scales the instance class from 4 vCPUs to 8 vCPUs and doubles max connection pool capacity to 200.
  3. At Minute 18, database server metrics stabilize at 35% CPU load with 42 active connections.
  4. In **Module 7 (Disaster Recovery)**, the Technical Lead clicks **[Synchronize Fallback to Primary SQL]**. The system sequentially re-plays the 340 applications buffered in JSON storage during the 15-minute outage into PostgreSQL relational tables.
* **Verification & Post-Mortem (Minutes 25 to 45)**:
  1. Admissions Lead runs a row-count checksum audit: 1,200 total submitted forms verified against SQL records. Zero data loss.
  2. Post-Incident Review concludes that rate-limiting must be applied at the edge nginx reverse proxy during batch opening days (maximum 30 requests/minute per IP).

### 12.2 Scenario 2: Recruitment AI Publishes an Incorrect Opportunity
* **Incident Description**: The Gemini AI discovery crawler scrapes an external career board and ingests a job listing titled *"Junior React Developer - N1.5M Monthly"*. However, the job listing contains a subtle phishing URL redirecting students to an external credential-harvesting scam site. The opportunity is auto-published to Module 3.
* **Severity Classification**: Level 3 (High Severity).
* **Immediate Containment (Minutes 0 to 5)**:
  1. At 02:14 PM, a vigilant Career Officer spots the suspicious salary anomaly and destination URL during routine job board moderation.
  2. Following existing institutional mandate: **Immediately change job status to 'Archived' or delete it from the active database**. The Career Officer clicks **[Archive & Flag Fraudulent]** in Module 3, instantly hiding the opportunity from all student dashboards.
* **Resolution & Recovery (Minutes 5 to 30)**:
  1. The Career Lead queries the audit log to determine if any corps members clicked the outbound application link during the 42 minutes it was live. Results show 7 students clicked the link.
  2. The Support Lead immediately contacts the 7 affected students via phone call and SMS, instructing them not to enter credentials on the third-party website and forcing a security reset of their Command Center passwords.
  3. In **Module 5 (Recruitment AI Operations)**, DevOps adds the domain of the phishing site to the **Global Scraper Blacklist** and increases the AI validation confidence threshold from 0.75 to 0.90.
* **Verification & Post-Mortem**:
  1. Re-run AI validation over all 450 active job listings to ensure no other phishing URLs bypassed the scraper filters.
  2. Implement mandatory human-in-the-loop (HITL) approval for all listings where advertised salary exceeds N800,000 monthly before public broadcasting.

### 12.3 Scenario 3: Bus Breaks Down While Transporting Students
* **Incident Description**: At 07:10 AM during a torrential downpour, Shuttle Bus #4 (Route 02 - Lekki Loop, carrying 28 NYSC members and 1 Bus Marshal) suffers a snapped alternator belt and electrical blackout on the Lekki-Ikoyi Link Bridge.
* **Severity Classification**: Level 3 (High Severity).
* **Immediate Containment (Minutes 0 to 5)**:
  1. The driver coasts the vehicle to the emergency shoulder of the bridge, activates hazard triangles, and instructs students to remain inside the bus out of the heavy rain and bridge traffic.
  2. The Bus Marshal calls the Operations Officer via emergency radio: *"Code Red Route 02. Breakdown on Lekki-Ikoyi Bridge southbound. 28 students onboard, zero injuries. Request immediate rescue van."*
* **Resolution & Recovery (Minutes 5 to 35)**:
  1. The Operations Officer opens **Module 4 (Transportation)**, clicks **[Trigger Route Emergency]** for Bus #4, and dispatches Executive Standby Van #9 from the Victoria Island depot (8 minutes away).
  2. An automated SMS is broadcast to all 28 passengers: *"CorpersTech Transit Advisory: Bus #4 has reported a mechanical delay. Rescue Van #9 is en-route (ETA 8 mins). Please remain seated with your Marshal."*
  3. At 07:22 AM, Van #9 arrives. The Marshal scans each student's QR ID card as they transfer to the rescue van, ensuring a complete 28-passenger head-count.
  4. Van #9 departs for campus, arriving at 07:45 AM (15 minutes before morning lecture commencement).
* **Verification & Post-Mortem**:
  1. Operations Lead verifies manifest completion in Module 4.
  2. Maintenance team tow Bus #4 to depot and log the alternator belt failure in the vehicle maintenance ledger.

### 12.4 Scenario 4: Staff Account is Compromised
* **Incident Description**: At 11:30 PM on a Saturday, automated cloud audit monitors detect that the account of a Career Officer is executing bulk CSV exports of student phone numbers and bank details from an unfamiliar IP address in Eastern Europe.
* **Severity Classification**: Level 4 (Critical Severity).
* **Immediate Containment (Minutes 0 to 3)**:
  1. The Super Admin receives an automated SMS security alert: *"CRITICAL: Anomalous bulk PII export detected for Staff ID CO-008"*.
  2. Within 90 seconds, the Super Admin logs into **Module 1 (Staff Administration)**, locates Staff ID CO-008, and clicks **[Revoke Active Sessions & Suspend Account]**. This terminates the attacker's JWT session mid-download.
  3. In **Module 8 (Security Policies)**, toggle **[Enable Anti-Exfiltration Lockdown]** globally to block all export functions across the platform.
* **Resolution & Recovery (Hours 1 to 12)**:
  1. Forensic analysis of server ingress logs reveals the attacker successfully downloaded 1 partial CSV chunk containing 120 student names and email addresses before session revocation (no banking details exposed).
  2. Contact the legitimate Career Officer via telephone. The officer confirms their home personal laptop was infected with infostealer malware after downloading a third-party browser extension.
  3. Re-provision the officer with a new Command Center account using hardware YubiKey MFA security tokens.
* **Verification & Post-Mortem**:
  1. File regulatory NDPC incident notification detailing the 120 exposed email addresses.
  2. Enforce hardware-bound WebAuthn/FIDO2 MFA for all staff roles with access to student PII.

### 12.5 Scenario 5: Public Website Becomes Inaccessible
* **Incident Description**: At 09:00 AM on a Monday, external users report that visiting canonical domain returns SSL Handshake Failed or DNS Server Not Found.
* **Severity Classification**: Level 3 (High Severity).
* **Immediate Containment (Minutes 0 to 10)**:
  1. DevOps checks cloud registrar and DNS configuration. Discovers that an automated SSL certificate renewal cron job failed, causing edge reverse proxy to reject HTTPS handshakes.
  2. Toggle edge routing to fallback static edge CDN while certificate reissue executes.
* **Resolution & Recovery (Minutes 10 to 25)**:
  1. Execute manual certbot SSL certificate renewal challenge from deployment container: 'certbot renew --force-renewal'.
  2. Reload nginx ingress proxy configuration: 'nginx -s reload'.
  3. Verify HTTPS 200 OK responses across desktop and mobile test devices over global cellular networks.

### 12.6 Scenario 6: Student Data is Accidentally Modified
* **Incident Description**: An Admissions Officer attempting to update attendance grades for a single 30-student lab group accidentally executes a bulk update query without a WHERE clause in an administrative DB utility tool, setting all 2,500 active student statuses to 'Graduated / Discharged'.
* **Severity Classification**: Level 3 (High Severity).
* **Immediate Containment (Minutes 0 to 5)**:
  1. The officer immediately realizes the error and notifies Super Admin: *"I accidentally overwrote global student enrollment status tables!"*
  2. Super Admin immediately enables **[Read-Only Maintenance Mode]** in Module 8 to prevent staff or students from triggering cascading status-dependent workflows (such as automated stipend payouts).
* **Resolution & Recovery (Minutes 5 to 20)**:
  1. Navigate to **Module 7 (Disaster Recovery)**.
  2. Locate the hourly automated JSON backup snapshot taken at 08:00 AM (35 minutes prior to the accidental overwrite).
  3. Click **[Execute Selective Table Restore]**, select target table 'StaffStudentProfile', and click Confirm Rollback.
  4. Within 60 seconds, the 2,500 student status records are restored to their exact state as of 08:00 AM.
* **Verification & Post-Mortem**:
  1. Verify in CRM that active cohort lists display correct enrollments.
  2. Disable direct administrative DB utility access for Admissions Officers; restrict all status mutations strictly to validated GUI forms with mandatory confirmation modals.

### 12.7 Scenario 7: Internet Fails During National Orientation
* **Incident Description**: During a live 500-student national onboarding broadcast in the main auditorium, the campus fiber optic internet feed suffers a total cable cut outside the perimeter gate. Live interactive coding sandboxes on student laptops freeze.
* **Severity Classification**: Level 3 (High Severity).
* **Immediate Containment (Minutes 0 to 3)**:
  1. The auditorium projection screen flashes network disconnected. The Lead Instructor calmly instructs students: *"Do not adjust your Wi-Fi settings. We are switching to campus local intranet fallback."*
  2. The campus edge router automatically detects fiber WAN loss and fails over to dual-SIM 5G cellular modems within 15 seconds.
* **Resolution & Recovery (Minutes 3 to 15)**:
  1. To preserve cellular bandwidth for core Command Center authentication and GitHub code submissions, the IT Lead toggles **[Bandwidth QoS Throttling]** on the router, blocking video streaming and external web browsing.
  2. Instructors instruct students to access the local intranet mirror at 'http://10.0.0.5:3000', where pre-loaded offline coding exercises and markdown manuals are hosted locally over campus Gigabit Ethernet LAN.
  3. Orientation proceeds without interruption until external fiber repair completes at 04:00 PM.

---

## 13. Emergency Checklists (Role-Based Action Sheets)

During a live Level 3 or Level 4 emergency, staff should not read lengthy narrative paragraphs. Each officer must immediately locate their departmental checklist below and execute each item sequentially.

### 13.1 Super Admin Emergency Checklist
* [ ] **Take Command**: Declare Incident Commander status in #emergency-command and assign severity level (Level 1 to Level 4).
* [ ] **Verify Containment**: Confirm with Technical Lead that firewall blocks, account lockouts, or network isolation rules are active.
* [ ] **Authorize Rollbacks**: Review checksum badges in Module 7 before authorizing database snapshot restorations or system failovers.
* [ ] **Approve Public Communications**: Review and sign off on all SMS/email broadcasts to students and placement partners drafted by Support Lead.
* [ ] **Convene Autopsy**: Schedule mandatory Post-Incident Review (PIR) meeting within 48 hours of resolution.

### 13.2 Admissions Officer Emergency Checklist
* [ ] **Check Application Intake**: Monitor incoming registration queues in Module 2 for drop-offs or gateway timeouts.
* [ ] **Toggle Standby Intake**: If database is unreachable during registration, enable **Emergency Application Routing** to buffer forms to local JSON storage.
* [ ] **Verify Applicant Communication**: Ensure automated SMS advisories are sent to applicants experiencing OTP or verification delays.
* [ ] **Sync Fallback Buffer**: Once database health is confirmed, execute **[Import Standby Applications]** to ingest buffered records.

### 13.3 Career Officer Emergency Checklist
* [ ] **Audit Job Listings**: Check Module 3 for suspicious salary claims, unverified employer domains, or reported phishing links.
* [ ] **Execute Immediate Archive Rule**: If any listing is flagged as fraudulent or scam, immediately change status to 'Archived' or delete it. Never leave unverified postings live.
* [ ] **Notify At-Risk Candidates**: Query audit logs for students who viewed or clicked compromised job links and initiate immediate phone advisory.
* [ ] **Reschedule Interviews**: Send immediate rescheduling notices to corporate partners if campus internet or platform downtime interrupts technical screening sessions.

### 13.4 Operations Officer Emergency Checklist
* [ ] **Monitor Shuttle Fleet**: Keep live transportation map open in Module 4 during morning (06:30-08:30) and evening (16:30-18:30) transit windows.
* [ ] **Respond to Breakdown Call**: Upon receiving radio alert from Bus Marshal, immediately click **[Trigger Route Emergency]** on the affected shuttle.
* [ ] **Dispatch Standby Rescue Van**: Deploy nearest reserve Executive Van or Coaster bus to GPS breakdown coordinates within 5 minutes.
* [ ] **Inspect Facility Power**: During grid power failures, verify that 20kVA inverter battery banks are carrying lab loads and call diesel generator maintenance technicians.

### 13.5 Finance Officer Emergency Checklist
* [ ] **Secure Financial Ledgers**: In any Level 4 cyber incident, immediately download offline backup copies of student stipend disbursement tables and lock payroll modification permissions.
* [ ] **Disburse Emergency Petty Cash**: Release up to N150,000 immediately upon request from Operations Lead for student medical admission deposits or emergency vehicle towing.
* [ ] **Audit Transaction Cheques**: During database recovery, run reconciliation audit between bank outflow statements and CRM stipend records to verify zero fraudulent disbursement occurred.

### 13.6 Support Officer Emergency Checklist
* [ ] **Triage Incoming Tickets**: Filter Error & Enquiry Center queue by 'Urgent' priority; respond to student distress tickets within 15 minutes.
* [ ] **Post System Advisory Banners**: Publish global advisory banner across Command Center header explaining active maintenance or transit delays.
* [ ] **Log All Student Inquiries**: Ensure every verbal or phone complaint received during a crisis is formally recorded with a ticket ID for post-mortem tracking.
* [ ] **Verify Resolution Feedback**: After technical recovery, contact 5 random reporting students to confirm their service is fully restored before marking tickets resolved.

---
*End of Part 5. Proceed to Part 6 for Frequently Asked Questions (50 Emergency Q&As), Best Practices, and Final Institutional Verification Checksum.*
`;
