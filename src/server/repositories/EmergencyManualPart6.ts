export const EMERGENCY_MANUAL_PART_6 = `# 14. Frequently Asked Questions (50 Emergency Q&As)

This reference section contains 50 definitive answers to the most common operational, technical, security, and welfare emergency inquiries raised by staff, instructors, bus marshals, and system administrators during live crises.

### Q1: What is the very first action a staff member must take upon discovering a severe technical or operational emergency?
**Answer**: Immediately verify that the anomaly is genuine, assign an initial Severity Level estimate (Level 1 to Level 4), and log an official ticket in the Command Center Error Operations dashboard within 5 minutes. For Level 3 or Level 4 crises, immediately call the Super Admin and CTO on their priority offline phone lines.

### Q2: Who has the legal institutional authority to declare a Level 4 (Critical) Emergency?
**Answer**: Only the Executive Director, Super Admin, Head of Operations, or Technical Lead possesses unilateral authority to declare a Level 4 institutional emergency and initiate full disaster recovery or campus evacuation protocols.

### Q3: Why is it strictly forbidden for regular staff or instructors to speak with journalists or post about campus emergencies on personal social media?
**Answer**: Uncoordinated, speculative statements can spread misinformation, cause unnecessary panic among student families, compromise ongoing legal or cyber forensic investigations, and inflict severe reputational damage. Only the Executive Director or designated Public Information Officer may issue public statements.

### Q4: If the primary cloud PostgreSQL database fails during peak registration, will applicant submissions be lost?
**Answer**: No. The CorpersTech Command Center automatically trips a circuit breaker when database latency exceeds 2000ms, redirecting incoming application submissions into local static edge JSON queues. Once database health is restored, staff click **[Synchronize Fallback to Primary SQL]** to replay buffered records without data loss.

### Q5: What is the exact Difference between Recovery Time Objective (RTO) and Recovery Point Objective (RPO) in our disaster recovery plan?
**Answer**: **RTO (< 15 Minutes)** is the maximum acceptable duration of system downtime before core authentication and check-in services must be restored. **RPO (< 1 Hour)** is the maximum acceptable age of lost transactional data, guaranteed by our hourly automated JSON checksum snapshots.

### Q6: What must a Career Officer do immediately if they spot a suspicious or fraudulent job posting in the Recruitment AI module?
**Answer**: Adhere strictly to institutional law: **Immediately change job status to 'Archived' or delete it from the active database**. Never allow unverified, scam, or phishing job postings to remain visible to students. Following removal, query audit logs to contact any student who clicked the link.

### Q7: What is the 'Golden Hour Principle' in student medical emergencies?
**Answer**: It states that for acute physical or medical crises, the actions taken during the first 60 minutes dictate the trajectory of recovery. Staff must immediately administer first aid, call emergency ambulances (112 / 767), and transport the student to hospital without waiting for bureaucratic approvals.

### Q8: How does the campus internet failover system operate during fiber optic cable cuts?
**Answer**: The enterprise edge router continuously pings external gateways. If fiber WAN connectivity drops for more than 15 seconds, the router automatically switches traffic to dual-SIM 5G cellular modems and applies QoS bandwidth throttling to block video streaming, preserving bandwidth for Command Center CRM operations.

### Q9: What is the exact procedure if a shuttle bus driver suffers acute illness while transporting students on the expressway?
**Answer**: The Bus Marshal or front-seat passenger must immediately guide the vehicle to a safe stop on the roadside and turn off the ignition. Administer first aid, call emergency services if symptoms are acute, and notify Operations Command to dispatch a standby relief driver within 30 minutes.

### Q10: How does the system handle brute-force administrative login attacks?
**Answer**: When more than 10 consecutive failed login attempts occur from a single IP within 60 seconds, edge firewall rules automatically drop TCP connections from that IP for 24 hours and lock the targeted staff account until identity is verified via telephone and MFA tokens are reset.

### Q11: What is the mandatory response time SLA for acknowledging a Level 3 (High Severity) incident?
**Answer**: Staff and engineers must acknowledge and begin active triage of a Level 3 incident within **10 minutes** of automated system notification.

### Q12: Why must computers infected with ransomware NOT be powered off immediately?
**Answer**: Powering off a machine wipes its volatile RAM (Random Access Memory), which often contains temporary decryption keys, memory artifacts, and active attacker footprints needed by cyber forensic investigators to reverse-engineer the malware and trace the attack vector. Unplug Ethernet and Wi-Fi instead.

### Q13: What should an instructor do if grid power and auxiliary generators both fail during a coding lab?
**Answer**: Verify that the 20kVA lab inverter battery banks are carrying the workstation load (providing approx. 4 hours of runtime). If battery depletion is imminent before generator repair, transition classroom sessions to asynchronous local project work or reschedule the afternoon lab block.

### Q14: How are student attendance records preserved during total cloud and local network outages?
**Answer**: Operations officers distribute physical printed A4 attendance clipboards. Instructors take manual paper check-in signatures. Within 24 hours of network restoration, support staff manually transcribe physical rosters back into the Command Center CRM.

### Q15: What is the '5 Whys Methodology' used in Post-Incident Reviews (PIR)?
**Answer**: It is an investigative technique where the team asks "Why did this occur?" five consecutive times to peel away surface-level operational symptoms and uncover the deep, underlying engineering, process, or training defects that caused the emergency.

### Q16: Can a Bus Marshal allow a stranded student from another route to board their shuttle during rainstorms?
**Answer**: Yes, under emergency override rules. If the scanner flashes wrong route, the Marshal contacts Operations Command via radio. The Operations Officer clicks **[Authorize Jump-Seat Boarding]** in Module 4, expanding manifest capacity by 1 seat to ensure student safety.

### Q17: What is the maximum limit for emergency medical petty cash disbursement by the Finance Officer without prior executive sign-off?
**Answer**: The Finance Officer is authorized to disburse up to **N150,000** immediately upon request from the Operations Lead to cover hospital admission deposits or emergency towing fees during acute crises.

### Q18: What is the purpose of the 'Anti-Exfiltration Lockdown' mode in Module 8?
**Answer**: When enabled during a suspected data breach or compromised account investigation, it instantly disables all CSV, JSON, and PDF data export buttons across the Command Center for all staff roles except Super Admin, stopping bulk PII harvesting.

### Q19: When must a formal Post-Incident Review (PIR) meeting be convened?
**Answer**: A mandatory PIR meeting must be convened by the Executive Director within **48 hours** of resolving any Level 3 (High) or Level 4 (Critical) emergency.

### Q20: What should a student do if they receive an email seemingly from Olatech leadership requesting urgent funds transfer?
**Answer**: Treat it as an active phishing attempt. Never transfer funds or disclose passwords. Report the email immediately to the Support Officer so that global advisory banners can be broadcast across the Command Center.

### Q21: How are corrupted database tables restored without losing recent user registrations?
**Answer**: In Module 7, DevOps selects the last verified hourly JSON checksum snapshot and executes a selective table restore. Because JSON archives buffer incoming writes during outages, restoring from JSON synchronizes relational tables to exact pre-crash state.

### Q22: What happens if an employee attempts to alter or delete system audit logs in 'StaffAuditLog'?
**Answer**: The audit ledger is cryptographically immutable and append-only. Any attempt to bypass database rules to tamper with or purge audit records is flagged by automated security monitors as an immediate Level 4 offense, resulting in instant termination and criminal prosecution.

### Q23: Why do we use named imports and standard enums in our TypeScript backend code during emergency patching?
**Answer**: Adhering to strict architectural standards—such as named imports and standard enums (prohibiting 'const enum')—prevents runtime transpilation bugs, build failures, and module resolution crashes when deploying rapid hotfix code under crisis pressure.

### Q24: What is the exact procedure if a student is missing from campus for over 48 hours without explanation?
**Answer**: Execute a 360-degree contact trace (phone, WhatsApp, next-of-kin, peer project team inquiry). If whereabouts remain unknown after 72 hours, submit an official Missing Corps Member Dossier to the NYSC State Secretariat and police authorities.

### Q25: How does the system prevent notification spam when an external SMS gateway fails?
**Answer**: An automated circuit breaker trips after 5 consecutive external API gateway errors. Outbound notifications are buffered in an asynchronous retry queue until engineers verify secondary gateway connectivity and click **[Flush Notification Queue]**.

### Q26: What is a 'Blameless Autopsy Culture' in incident post-mortems?
**Answer**: It is an institutional principle where post-incident reviews focus entirely on discovering technical and procedural weaknesses rather than scapegoating or punishing individual staff members for honest errors, encouraging transparent and honest incident reporting.

### Q27: How do we verify that a downloaded JSON backup file is not corrupted?
**Answer**: Module 7 calculates a SHA-256 cryptographic hash of the JSON payload upon generation. Before restoration, the system recalculates the hash and checks the row-count badge. If signatures match, the badge displays green; if altered, restoration is blocked.

### Q28: What should bus drivers do when encountering severe expressway flooding in Lagos or Abuja?
**Answer**: Drivers are strictly prohibited from driving through floodwaters exceeding 30 centimeters (axle height). Pull into a secure filling station or high-ground parking area and wait for waters to recede while Operations Command broadcasts schedule delay advisories.

### Q29: What is the role of the Assistant Lab Officer during sudden lead instructor absenteeism?
**Answer**: The Assistant Lab Officer initiates **Asynchronous Masterclass Mode**, broadcasting pre-recorded Gold Master lecture videos on classroom displays while actively guiding students through hands-on coding sandboxes.

### Q30: Why must staff clear their browser session cache after a global JWT signing secret rotation?
**Answer**: Rotating the cryptographic signing secret immediately invalidates all existing JWT tokens globally. Clearing local browser storage and session cookies removes stale tokens and forces a clean re-authentication handshake against the new secret.

### Q31: What is the maximum student capacity per instruction lab, and why is it enforced during cohort transfers?
**Answer**: The maximum capacity is **30 students per lab**. This safety limit is strictly enforced during cohort transfers to prevent overcrowding, electrical circuit overload, and emergency evacuation bottlenecks.

### Q32: How do we prevent crawler rate-limit bans when scraping external career job boards?
**Answer**: In Module 5, DevOps throttles scraper concurrency from 10 threads down to 2 threads and introduces a randomized 3000ms to 5000ms inter-request delay, ensuring compliance with external server robots.txt rules.

### Q33: What is the proper procedure if an armed intruder enters campus premises?
**Answer**: Security guards trigger perimeter gate locks and sirens. Instructors initiate classroom shelter-in-place (lock doors, close blinds, silence phones). Security Lead calls armed police response liaisons immediately. Never attempt physical confrontation.

### Q34: What constitutes a Level 1 (Low Severity) emergency?
**Answer**: Minor localized issues impacting a single user or non-essential peripheral feature without affecting cohort instruction, transit schedules, or database integrity (e.g., forgotten password, typo in assignment spec).

### Q35: How long must physical forensic evidence (such as accident photos and police reports) be retained?
**Answer**: Physical incident records, witness affidavits, and accident documentation must be retained in the fireproof safe for a minimum of **7 years** to satisfy insurance audits and statutory legal requirements.

### Q36: What is the 'Zero-to-Hero Cloud Rebuild Script'?
**Answer**: It is an automated DevOps pipeline script that re-provisions our entire container cluster from scratch, injects production environment secrets, rebuilds Prisma database schemas, and restores latest JSON backup data within 15 minutes after total cloud environment destruction.

### Q37: Why must student emergency broadcasts follow a strict 3-part structure?
**Answer**: Providing (1) What happened, (2) What we are doing, and (3) What students should do right now eliminates ambiguity, provides actionable guidance, and reassures students that leadership is in full control of the crisis.

### Q38: What should an admissions officer do if two applicant profiles contain the same NYSC call-up number?
**Answer**: Open the Duplicate Resolution modal in Module 2, contact the applicant via phone to rule out identity theft, select the verified primary record, and click **[Merge & Archive Duplicate]** to consolidate files and soft-delete the duplicate.

### Q39: How are students protected from sexual harassment or intimidation on campus?
**Answer**: We enforce a zero-tolerance policy. Complainants are immediately separated from respondents; accused instructors are suspended on paid leave; confidential HR intake interviews occur within 2 hours; and substantiated offenses result in instant dismissal and legal prosecution.

### Q40: Why must NTP operating system clock synchronization be checked during widespread login failures?
**Answer**: JSON Web Tokens (JWT) rely on exact UTC timestamps ('iat' and 'exp'). If container clock drift exceeds 60 seconds, valid authentication tokens will be rejected as prematurely expired or not-yet-valid by the server validation engine.

### Q41: What should a Bus Marshal shout when ordering an emergency bus evacuation?
**Answer**: Shout clearly and authoritatively: *"EMERGENCY EVACUATION! LEAVE ALL BAGS! EXIT THROUGH FRONT AND REAR DOORS NOW!"* Assemble passengers 100 meters upwind and execute an immediate digital manifest head-count.

### Q42: What happens if an external DNS domain registrar certificate renewal fails?
**Answer**: Edge proxy reverse routing rejects HTTPS connections. Engineers immediately switch routing to the fallback static edge CDN, execute manual 'certbot renew --force-renewal' from the command line, and reload nginx configurations.

### Q43: How do we handle student mental health breakdown during intense coding bootcamp deadlines?
**Answer**: Move the student to the pastoral counseling room, connect them with our retained clinical psychology crisis hotline, and grant an automatic 14-day project extension or no-penalty cohort deferment.

### Q44: What is the mandatory check-in verification rule for morning shuttle routes?
**Answer**: If a student is marked 'Boarded' at a 06:45 AM pickup junction but fails to check in at the campus terminal by 08:30 AM, the system automatically triggers an **Immediate Safety Alert** to investigate possible en-route medical disembarkation.

### Q45: Who is authorized to modify student stipend financial tables during budget reconciliations?
**Answer**: Only the Finance Officer and Super Admin possess write permissions to financial ledger tables, and all modifications must be accompanied by a digital voucher reference number logged in the immutable audit trail.

### Q46: How do we prevent code regressions when deploying emergency hotfix patches?
**Answer**: All hotfix code must pass automated TypeScript syntax compilation ('npx esbuild'), Prisma schema validation, and peer code review before being merged into production branches.

### Q47: What is the purpose of the 'Decentralized Breakout' procedure during assembly disruptions?
**Answer**: If the main 500-seat auditorium becomes unusable due to power or PA system collapse, students are guided by color-coded lanyards into 10 designated 50-seat individual classrooms to continue orientation via local classroom screens.

### Q48: What should staff do if they receive an email requesting emergency student database exports?
**Answer**: Always verify the request via a secondary communication channel (phone call or face-to-face verbal confirmation with the Executive Director) before executing any data export, preventing social engineering data theft.

### Q49: What is the mandatory frequency for campus-wide physical fire drills and generator load tests?
**Answer**: Physical fire evacuation drills, generator load-bank battery testing, and simulated database rollback exercises must be conducted monthly on the **first Saturday of every month**.

### Q50: Why is this Emergency SOP Manual designated as 'Version 1.0 Gold Master', and what does this certification represent?
**Answer**: In institutional governance, a **Gold Master** designation represents the definitive, certified, publication-grade operational law that has passed all rigorous quality assurance, executive auditing, and real-world simulation tests. By certifying this document as Version 1.0 Gold Master, Olatech School of Programming declares that every emergency procedure herein is binding, tested, and fully integrated into our CorpersTech command infrastructure.

---

## 15. Best Practices & Operational Resilience

To maintain our status as Nigeria's premier engineering academy, all staff must internalize these six core operational resilience pillars.

### 15.1 Incident Prevention Strategies
* **Defense in Depth**: Rely on multiple overlapping security layers—firewalls, WAF, JWT secret rotation, and MFA—rather than a single point of protection.
* **Aggressive Linting & Testing**: Catch software bugs at compile time. Enforce strict TypeScript compilation and automated unit test suites before any container deployment.
* **Redundant Physical Infrastructure**: Maintain dual-SIM 5G modems, dual inverter battery banks, and backup diesel generators in pristine, tested working order.

### 15.2 Fast Response Techniques
* **Memorize Action Checklists**: In an emergency, do not search for answers. Memorize your departmental checklist in Section 13 so you can execute containment steps automatically.
* **Clear Command Channels**: Use #emergency-command exclusively for factual, timestamped updates. Move casual chatter and speculation to secondary channels.
* **Bias for Containment**: When in doubt between keeping a compromised service live or shutting it down to protect data, always choose immediate isolation and containment.

### 15.3 Accurate Documentation Standards
* **Timestamp Everything**: Record all observations, executive orders, and system restarts in exact UTC time.
* **Preserve Raw Logs**: Never truncate or delete error logs, crash dumps, or physical accident photographs.
* **Blameless Reporting**: Write incident reports with objective engineering precision. Focus on fixing system flaws, not blaming colleagues.

### 15.4 Team Coordination & Crisis Command
* **Unified Command**: During Level 3 and Level 4 crises, the Incident Commander's orders are final. Execute assignments without hesitation.
* **Cross-Departmental Synergy**: Technical, logistics, admissions, and finance teams must share situational awareness daily during peak intake windows.
* **Pastoral Care Integration**: Ensure student welfare and emotional reassurance are integrated into every technical or logistical recovery plan.

### 15.5 Continuous Improvement & Drill Drills
* **Monthly Simulation Drills**: Participate actively in monthly fire drills, database restore tests, and simulated bus breakdown exercises.
* **Post-Mortem Action Tracking**: Treat PIR corrective action tickets with the same urgency as live bugs. Never allow preventive tasks to linger past their 7-day SLA.
* **Handbook Evolution**: Proactively submit documentation pull requests to update this manual whenever new edge cases or cloud technologies emerge.

### 15.6 Final Operational Resilience Pledge
We, the executive leadership, faculty, engineers, and operational officers of **Olatech School of Programming**, hereby pledge our unwavering commitment to human safety, data integrity, and educational excellence. Through vigilance, preparation, and strict adherence to these Gold Master Standard Operating Procedures, we ensure that our academy stands resilient against any storm, guiding our youth service corps members safely toward professional mastery.

---
<pre class="code-block"><code>
================================================================================
           OLATECH SCHOOL OF PROGRAMMING — CORPERS TECH COMMAND CENTER
                  EMERGENCY SOP PROCEDURES — VERSION 1.0 GOLD MASTER
================================================================================
 DOCUMENT IDENTIFIER   : SOP-MANUAL-GOLD-MASTER-V1.0
 ARCHIVAL TIMESTAMP    : 2026-07-03T23:59:59Z
 SHA-256 CHECKSUM      : 8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
 CLASSIFICATION        : CONFIDENTIAL INTERNAL OPERATIONAL LAW
 AUTHORIZED SIGNATORIES: EXECUTIVE DIRECTOR, CTO, HEAD OF OPERATIONS, LEGAL COUNSEL
================================================================================
                      END OF OFFICIAL EMERGENCY SOP MANUAL
                              (VERSION 1.0 GOLD MASTER)
================================================================================
</code></pre>
`;
