export const EMERGENCY_MANUAL_PART_1 = `# CorpersTech
## Emergency SOP Procedures
### Official Incident Response and Business Continuity Manual
#### Olatech School of Programming
**Version 1.0 Gold Master**
**Confidential Internal Document — For Authorized Staff & Faculty Only**

---

## Comprehensive Table of Contents

1. **Purpose of this Manual**
   * 1.1 Why Standard Operating Procedures (SOPs) are Important
   * 1.2 The Importance of Rapid Incident Response
   * 1.3 Staff Responsibilities During Emergencies
   * 1.4 Business Continuity Objectives
2. **Emergency Classification Framework**
   * 2.1 Level 1 – Low Severity
   * 2.2 Level 2 – Moderate Severity
   * 2.3 Level 3 – High Severity
   * 2.4 Level 4 – Critical Severity
3. **Incident Response Workflow**
   * 3.1 Incident Detection & Identification
   * 3.2 Incident Logging & Ticket Creation
   * 3.3 Risk Assessment & Triage
   * 3.4 Internal & External Notification
   * 3.5 Immediate Threat Containment
   * 3.6 Technical & Operational Resolution
   * 3.7 Service Recovery & Verification
   * 3.8 Formal Documentation & Evidence Collection
   * 3.9 Post-Incident Review & Lessons Learned
   * 3.10 Preventive Operational Improvements
4. **Operational Emergencies**
   * 4.1 Student Complaints & Escalations
   * 4.2 Registration & Enrollment Failures
   * 4.3 Duplicate Application Resolution
   * 4.4 Lost Application Records Recovery
   * 4.5 Incorrect Cohort & Track Assignment
   * 4.6 Transportation & Route Disputes
   * 4.7 Orientation & Assembly Disruptions
   * 4.8 Staff Absenteeism & Emergency Coverage
5. **Technical & System Emergencies**
   * 5.1 Server Downtime & Container Unreachability
   * 5.2 Database Interruption & Fallback Execution
   * 5.3 Prisma ORM Schema & Query Errors
   * 5.4 Third-Party API & Integration Failures
   * 5.5 Internet Outages & Campus Gateway Failures
   * 5.6 Backup Generation & Storage Failures
   * 5.7 Authentication & Session Security Failures
   * 5.8 Command Center UI & Client Errors
   * 5.9 Recruitment AI Discovery Engine Failures
6. **Security Incidents & Threat Containment**
   * 6.1 Unauthorized Login Attempts & Brute Force Attacks
   * 6.2 Compromised Staff Accounts & Credential Revocation
   * 6.3 Password Leaks & Administrative Key Rotation
   * 6.4 Data Breaches & PII Exfiltration Protocols
   * 6.5 Suspicious Activity & Anomalous Traffic Monitoring
   * 6.6 Malware Detection & Ransomware Isolation
   * 6.7 Phishing Attempts & Social Engineering Defenses
   * 6.8 Insider Threats & Privilege Abuse Investigation
7. **Transportation & Logistics Emergencies**
   * 7.1 Shuttle Vehicle Breakdown En-Route
   * 7.2 Traffic Accidents & Emergency Medical Services
   * 7.3 Driver Illness or Sudden Incapacitation
   * 7.4 Missing Passengers & Boarding Manifest Discrepancies
   * 7.5 Route Closures, Civil Unrest & Police Roadblocks
   * 7.6 Severe Weather & Flood Navigation
   * 7.7 Emergency Bus Evacuation Protocols
8. **Student Welfare & Safety Emergencies**
   * 8.1 Medical Emergencies & On-Campus First Aid
   * 8.2 Harassment, Bullying & Grievance Reports
   * 8.3 Campus Safety Concerns & Intruders
   * 8.4 Lost Property & Asset Recovery
   * 8.5 Missing Corps Members & NYSC Liaison Tracing
   * 8.6 Mental Health Crises & Counseling Intervention
   * 8.7 Emergency Contacts & Next-of-Kin Notification
9. **Communication Protocols & Hierarchy**
   * 9.1 Internal Communication Hierarchy
   * 9.2 Emergency Staff & Faculty Notifications
   * 9.3 Public Announcements & Media Relations
   * 9.4 Student & Corps Member Broadcasts
   * 9.5 Employer & Placement Partner Notifications
   * 9.6 Escalation Contact Roster & Vendor Hotlines
10. **Business Continuity & Disaster Recovery**
   * 10.1 Backup Restoration & System Rollback
   * 10.2 Recovery Priorities & RTO/RPO Targets
   * 10.3 Complete System Restoration SOP
   * 10.4 Manual Operations During Total Outages
   * 10.5 Recovery Verification & Checksum Audits
   * 10.6 Return-to-Service Checklist
11. **Documentation & Audit Requirements**
   * 11.1 Mandatory Incident Report Generation
   * 11.2 Digital & Physical Evidence Collection
   * 11.3 Audit Logging & System Event Capture
   * 11.4 Root Cause Analysis (RCA) Methodology
   * 11.5 Corrective Action Implementation
   * 11.6 Preventive Maintenance Schedules
12. **Practical Emergency Scenarios (Deep Dives)**
   * 12.1 Scenario 1: Database Becomes Unavailable During Registration
   * 12.2 Scenario 2: Recruitment AI Publishes an Incorrect Opportunity
   * 12.3 Scenario 3: Bus Breaks Down While Transporting Students
   * 12.4 Scenario 4: Staff Account is Compromised
   * 12.5 Scenario 5: Public Website Becomes Inaccessible
   * 12.6 Scenario 6: Student Data is Accidentally Modified
   * 12.7 Scenario 7: Internet Fails During National Orientation
13. **Emergency Checklists (Role-Based Action Sheets)**
   * 13.1 Super Admin Emergency Checklist
   * 13.2 Admissions Officer Emergency Checklist
   * 13.3 Career Officer Emergency Checklist
   * 13.4 Operations Officer Emergency Checklist
   * 13.5 Finance Officer Emergency Checklist
   * 13.6 Support Officer Emergency Checklist
14. **Frequently Asked Questions (50 Emergency Q&As)**
15. **Best Practices & Operational Resilience**
   * 15.1 Incident Prevention Strategies
   * 15.2 Fast Response Techniques
   * 15.3 Accurate Documentation Standards
   * 15.4 Team Coordination & Crisis Command
   * 15.5 Continuous Improvement & Drill Drills
   * 15.6 Final Operational Resilience Pledge

---

## 1. Purpose of this Manual

### 1.1 Why Standard Operating Procedures (SOPs) are Important
In an elite software engineering academy and NYSC transition hub like **Olatech School of Programming**, operational continuity is paramount. We train thousands of Nigerian Youth Service Corps (NYSC) members, manage complex daily shuttle routes across Lagos and Abuja, process corporate career placements, and operate a high-concurrency cloud portal (**CorpersTech Command Center**). 

Standard Operating Procedures (SOPs) remove ambiguity, panic, and hesitation during crises. When an emergency strikes—whether it is a server kernel panic, a transit breakdown on the Third Mainland Bridge, or an acute medical event on campus—staff must not improvise. This Gold Master manual establishes institutional law: pre-engineered, tested, and infallible protocols that guarantee human safety, data integrity, and continuous academy operations.

INFO: All staff members, instructors, bus marshals, and system administrators are legally bound by the procedures contained within this manual. Failure to adhere to these emergency SOPs during a live incident may result in disciplinary review and administrative privilege revocation.

### 1.2 The Importance of Rapid Incident Response
Time is the most critical variable in emergency mitigation. A minor database query latency can cascade into total system deadlock within minutes; a delayed response to a student medical distress call can endanger lives; an unaddressed credential leak can compromise our entire corporate partner repository.

* **Golden Hour Principle**: For physical and welfare emergencies, the first 60 minutes dictate the trajectory of recovery. Immediate first aid, police liaison, and medical dispatch must happen without bureaucratic delay.
* **5-Minute Technical Triage**: For technical and cloud infrastructure alerts, engineers must acknowledge and begin triage within 5 minutes of automated system notification.
* **Reputational Protection**: Prompt, transparent communication prevents misinformation. When students or corporate partners experience an outage or disruption, immediate notification via official channels builds trust and demonstrates executive competence.

### 1.3 Staff Responsibilities During Emergencies
Every employee at Olatech School of Programming occupies a defined functional station within the crisis command hierarchy:
* **Super Admin & Executive Director**: Acts as Incident Commander during Level 3 and Level 4 crises. Possesses unilateral authority to trigger disaster recovery failovers, authorize emergency funds disbursement, and order physical campus evacuations.
* **Operations Officer & Logistics Manager**: Oversees physical facility security, transport shuttle fleets, driver communication, and campus emergency power systems (inverters and diesel generators).
* **Technical Lead & DevOps Engineers**: Responsible for cloud server health, database integrity, Prisma ORM schema rollbacks, firewall rules, and AI scraper crawler throttling.
* **Admissions & Career Officers**: Manage student welfare, candidate communications, NYSC secretariat liaisons, and employer partner notifications during academic or recruitment disruptions.
* **Support Officers & Front Desk**: Act as the primary intake funnel for student distress calls, ticket logging, and initial triage, ensuring zero unanswered inquiries during operational storms.

### 1.4 Business Continuity Objectives
Our institutional disaster recovery and business continuity strategy is governed by three rigorous quantitative targets:
* **Recovery Time Objective (RTO) < 15 Minutes**: Core services—specifically student authentication, attendance check-in, and local database fallbacks—must be restored to functional state within 15 minutes of a primary system failure.
* **Recovery Point Objective (RPO) < 1 Hour**: No more than 60 minutes of transactional data (such as submitted assignments or attendance logs) may be lost during a catastrophic database corruption event, guaranteed by hourly automated JSON checksum snapshots.
* **Zero Human Casualty Mandate**: Physical safety supersedes all technical and financial considerations. In any physical crisis, property and hardware are abandoned immediately in favor of orderly human evacuation.

---

## 2. Emergency Classification Framework

To ensure that resources are deployed proportionally without causing unnecessary alarm or alert fatigue, Olatech School of Programming categorizes all incidents into four distinct severity levels.

| Severity Level | Color Code | Operational Impact | Target Response Time | Target Resolution Time |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1 (Low)** | Green / Blue | Minor localized issue; single user affected; core systems operational. | < 2 Hours | < 24 Hours |
| **Level 2 (Moderate)** | Yellow | Partial feature degradation; cohort-wide annoyance; no data loss. | < 30 Minutes | < 4 Hours |
| **Level 3 (High)** | Orange | Major service outage; transportation breakdown; security threat detected. | < 10 Minutes | < 1 Hour |
| **Level 4 (Critical)**| Red | Total platform collapse; active data breach; human threat or casualty. | **Immediate (< 3 Mins)** | **< 30 Minutes** |

### 2.1 Level 1 – Low Severity
* **Definition**: Incidents that impact a single student, staff member, or non-essential peripheral feature without affecting overall campus instruction, transit schedules, or platform database integrity.
* **Examples**: A student forgets their Command Center password; a single instructor's microphone fails in Lab 2; a minor typo is discovered in an assignment specification; an applicant uploads an incorrectly formatted PDF resume.
* **Required Response Time**: Acknowledged within 2 Hours.
* **Escalation Path**: Handled entirely at the tier-1 support level by Support Officers or Lab Assistants. No executive notification required.
* **Responsible Officers**: Support Officer, Campus Lab Assistant.

### 2.2 Level 2 – Moderate Severity
* **Definition**: Incidents that cause noticeable operational friction or temporary feature unavailability for a group of users, but where a viable workaround exists and core academic instruction continues.
* **Examples**: The automated WhatsApp SMS notification gateway experiences latency; a single shuttle bus's QR code scanner battery dies (requiring manual roster check-in); the Career Placement job board search filter runs slowly; campus Wi-Fi drops in one wing while wired Ethernet remains functional.
* **Required Response Time**: Acknowledged and triaged within 30 Minutes.
* **Escalation Path**: If unresolved after 2 hours, escalate to the Head of Operations or Technical Lead.
* **Responsible Officers**: Operations Officer, Admissions Lead, Assistant Systems Administrator.

### 2.3 Level 3 – High Severity
* **Definition**: Critical operational disruptions that halt instruction for an entire cohort, compromise a primary database service, involve a transit breakdown on public roads, or represent a credible security threat.
* **Examples**: Primary PostgreSQL database connection pool exhaustion; an active shuttle bus breakdown on expressway with 25 corps members onboard; unauthorized administrative login attempts detected from foreign IP addresses; campus main grid power failure coinciding with generator backup battery depletion.
* **Required Response Time**: Immediate mandatory acknowledgment within 10 Minutes.
* **Escalation Path**: Direct immediate notification to Super Admin, Executive Director, and CTO. Emergency crisis command chat channel activated.
* **Responsible Officers**: Technical Lead, Head of Logistics, Super Admin.

### 2.4 Level 4 – Critical Severity
* **Definition**: Catastrophic events involving imminent danger to human life, physical campus destruction, total infrastructure loss, active ransomware encryption, or verified mass exfiltration of confidential student PII and banking data.
* **Examples**: Active fire or structural collapse on campus; a severe road traffic accident involving a student transit shuttle with injuries; confirmed compromise of root AWS/GCP cloud credentials; extortion threats or malicious wipe of production database storage.
* **Required Response Time**: **Immediate (< 3 Minutes)**. All other regular duties are dropped instantly.
* **Escalation Path**: Full institutional alarm. Executive Director assumes absolute command. National emergency services (Police, Ambulance, Fire, NYSC State Coordinator) notified immediately.
* **Responsible Officers**: Executive Director, Super Admin, Legal Counsel, All Department Heads.

---

## 3. Incident Response Workflow

All emergencies at Olatech School of Programming must follow a standardized, 10-stage sequential lifecycle. This structured workflow prevents premature closure of incidents and guarantees thorough root cause investigation.

[1. Detection] ──> [2. Logging] ──> [3. Assessment] ──> [4. Notification] ──> [5. Containment]
                                                                                      │
[10. Prevention] <── [9. Lessons] <── [8. Documentation] <── [7. Recovery] <── [6. Resolution]

### 3.1 Stage 1: Incident Detection & Identification
Incidents are detected via three primary channels: automated cloud monitoring alerts (CPU spike, memory exhaustion, HTTP 500 error thresholds), physical staff observation (security guard reports, instructor observations), or student distress submissions (support tickets, emergency transit hotline calls).
* **Action**: The observing officer immediately verifies that the anomaly is genuine and not a scheduled maintenance test or false positive alarm.

### 3.2 Stage 2: Incident Logging & Ticket Creation
No emergency may be handled off-the-record. Within 5 minutes of verification, the officer must create an official Incident Ticket in the CorpersTech Command Center Support & Error Operations dashboard.
* **Required Metadata**: Timestamp of onset, reporting officer ID, initial classification estimate (Level 1–4), affected subsystem (e.g., *Database*, *Route 02*, *Lab 3*), and a succinct factual description.

### 3.3 Stage 3: Risk Assessment & Triage
The assigned lead evaluates the blast radius of the incident. How many students are affected? Is data actively leaking? Are physical safety hazards present?
* **Action**: Assign the binding Severity Level (1 to 4). If Level 3 or 4 is assigned, automated sirens and SMS alerts trigger across the executive command dashboards.

### 3.4 Stage 4: Internal & External Notification
Communication must be dispatched to stakeholders before rumors form.
* **Internal**: Broadcast incident summary to the #emergency-command Slack/Teams channel and Executive WhatsApp group.
* **External**: If students are stranded or classes are delayed, broadcast an official SMS/email notification via the Command Center Announcement module within 15 minutes.

### 3.5 Stage 5: Immediate Threat Containment
The primary objective of containment is to stop the bleeding—preventing the incident from spreading or worsening.
* **Technical Containment**: Isolate compromised database user accounts, revoke exposed JWT signing secrets, block malicious IP ranges at the nginx reverse proxy, or disconnect affected servers from the public internet.
* **Physical/Operational Containment**: Direct stranded buses to pull into safe fuel stations; evacuate classrooms; switch electrical loads from grid to emergency inverter banks.

### 3.6 Stage 6: Technical & Operational Resolution
With the threat contained, engineers and operational specialists execute the definitive repair or rescue operation.
* **Execution**: Deploy hotfix code patches, execute Prisma schema migrations, dispatch standby rescue shuttles, or replace blown electrical fuses. All actions must be double-checked by a second peer officer before execution.

### 3.7 Stage 7: Service Recovery & Verification
A system or service is not considered resolved simply because a patch was applied. It must be rigorously verified in staging and production environments.
* **Verification Protocol**: Execute automated smoke tests; perform manual login checks across all staff roles; verify that database read/write latency is under 50ms; confirm via voice call that all passengers from a broken-down bus are safely seated in the rescue vehicle.

### 3.8 Stage 8: Formal Documentation & Evidence Collection
Before operational normalcy is declared, all forensic evidence must be harvested and archived in the secure audit vault.
* **Artifacts Collected**: Server system logs (/var/log/nginx/error.log, container stderr dumps), database transaction logs, physical photographs of damaged vehicles or hardware, driver incident statements, and timestamps of all executive commands.

### 3.9 Stage 9: Post-Incident Review & Lessons Learned
Within 48 hours of any Level 3 or Level 4 emergency, the Executive Director convenes a mandatory **Post-Incident Review (PIR)** meeting with all involved stakeholders.
* **Agenda**: Review the timeline of events second-by-second; evaluate what went right and what failed; determine if response time SLAs were met; identify root causes without assigning personal blame (blameless autopsy culture).

### 3.10 Stage 10: Preventive Operational Improvements
The lifecycle concludes when the lessons learned are translated into permanent engineering or policy safeguards.
* **Deliverables**: Updating this Gold Master handbook with new edge-case procedures; adding automated unit tests or linting rules to prevent code regressions; installing redundant hardware components; or conducting refresher training drills for staff and drivers.

---
*End of Part 1. Proceed to Part 2 for detailed Standard Operating Procedures covering Operational Emergencies and Technical/System Infrastructure Breakdown.*
`;
