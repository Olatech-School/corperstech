export const EMERGENCY_MANUAL_PART_3 = `# 6. Security Incidents & Threat Containment

Security incidents threaten student privacy, financial assets, and intellectual property. When a cyber attack or credential leak is detected, containment takes absolute precedence over uptime. Every minute an attacker retains access multiplies institutional liability.

WARNING: Never attempt to negotiate with extortionists or ransomware actors. Immediately isolate affected networks, preserve forensic log evidence, and notify the Executive Director and Legal Counsel.

### 6.1 Unauthorized Login Attempts & Brute Force Attacks (SOP-SEC-01)
* **Trigger**: Automated security monitors detect more than 10 consecutive failed administrative login attempts from a single IP address within a 60-second window, or geo-velocity alerts trigger (e.g., successful login from Lagos followed by an attempt from Amsterdam 10 minutes later).
* **Severity**: Level 2 (Moderate) or Level 3 (If account lockouts become widespread).
* **Step-by-Step Procedure**:
  1. **IP Range Block**: The edge firewall automatically drops TCP connections from the offending IP address for 24 hours. Verify in **Module 8 (Security Policies)** that the block rule is actively enforcing.
  2. **Account Lockout Inspection**: Check the target staff account status. If locked by the brute-force mitigation circuit, contact the employee via their registered mobile number to verify if they were attempting to log in or if an attack was underway.
  3. **Force Password & MFA Reset**: Once identity is verbally confirmed, click **[Reset Staff Credentials]** in Module 1. Require the user to re-bind their Time-based One-Time Password (TOTP) authenticator app before granting access.

### 6.2 Compromised Staff Accounts & Credential Revocation (SOP-SEC-02)
* **Trigger**: A staff member reports that their laptop was stolen, their email was hacked, or anomalous administrative actions (such as bulk student data exports or grading modifications) occur under their Command Center profile.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Immediate Session Kill**: The Super Admin immediately opens **Module 1 (Staff Administration)**, locates the compromised profile, and clicks **[Revoke Active Sessions & Suspend Account]**. This terminates all active JWT tokens globally within 1 second.
  2. **Audit Log Reconstruction**: Open **Module 6 (Reporting & Analytics)** and filter system audit logs by the compromised employee ID over the preceding 48 hours. Export the complete ledger of accessed records to identify potential PII exposure.
  3. **Credential Re-Provisioning**: Issue a brand-new administrative identity with randomized credentials only after the employee's workstation has been forensically wiped and re-verified by DevOps.

### 6.3 Password Leaks & Administrative Key Rotation (SOP-SEC-03)
* **Trigger**: A developer accidentally commits a '.env' file containing database passwords, API keys, or JWT signing secrets to a public GitHub repository, or an external credential monitoring alert fires.
* **Severity**: Level 4 (Critical).
* **Step-by-Step Procedure**:
  1. **Immediate Secret Invalidation**: Treat the leaked secret as actively exploited. Do not wait for git history rewriting. Immediately log into cloud provider consoles (AWS/GCP/PostgreSQL/Gemini) and delete the exposed API keys and database user passwords.
  2. **Generate Replacement Secrets**: Provision new cryptographic 256-bit signing secrets and database connection strings. Update the cloud runtime environment variables across all active deployment containers.
  3. **Rolling Server Restart**: Execute an immediate zero-downtime rolling deployment so containers pick up the fresh environment variables.
  4. **Git History Scrubbing**: Execute BFG Repo-Cleaner or git filter-repo on the source code repository to expunge the credential from all commit histories before force-pushing to canonical remote branches.

### 6.4 Data Breaches & PII Exfiltration Protocols (SOP-SEC-04)
* **Trigger**: Unauthorized bulk download of student Personally Identifiable Information (PII), such as NYSC call-up letters, phone numbers, residential addresses, or bank stipend records.
* **Severity**: Level 4 (Critical).
* **Step-by-Step Procedure**:
  1. **Containment & Network Isolation**: Immediately restrict Command Center database query limits. Toggle **[Enable Anti-Exfiltration Lockdown]** in Module 8, which blocks all CSV/JSON export buttons across all staff roles except Super Admin.
  2. **Forensic Snapshot**: Capture an immutable disk and memory snapshot of the database ingress servers for forensic chain-of-custody preservation.
  3. **Executive & Legal Notification**: Within 30 minutes of verification, brief the Executive Director and Legal Counsel. Prepare the mandatory data breach notification filing for the Nigeria Data Protection Commission (NDPC) as required by the Nigeria Data Protection Act (NDPA).
  4. **Student Advisory**: Under legal guidance, draft and dispatch a transparent email advisory to affected corps members explaining the exact scope of compromised data and offering credit/identity monitoring guidelines.

### 6.5 Suspicious Activity & Anomalous Traffic Monitoring (SOP-SEC-05)
* **Trigger**: Traffic monitoring spikes show unusual scraping patterns against candidate profile endpoints, or SQL injection payload characters are detected in search filter query parameters.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **WAF Rule Enforcement**: Inspect Web Application Firewall (WAF) logs. If automated bots are attempting query string injection, toggle **[Strict Input Sanitization & Bot Shield]** in Module 8.
  2. **Rate-Limit Adjustments**: Lower global API rate limits from 100 requests/minute per IP to 20 requests/minute per IP for unauthenticated or student-tier endpoints.
  3. **Pattern Analysis**: Analyze user-agent strings and ASN origins. Blacklist offending ASNs at the cloud routing layer if traffic originates from known bulletproof hosting providers.

### 6.6 Malware Detection & Ransomware Isolation (SOP-SEC-06)
* **Trigger**: Antivirus or cloud endpoint detection flags malicious executables, ransomware file renaming, or unauthorized crypto-mining background processes on campus administrative workstations or server pods.
* **Severity**: Level 4 (Critical).
* **Step-by-Step Procedure**:
  1. **Physical & Network Severance**: Immediately unplug Ethernet cables and disable Wi-Fi adapters on any workstation showing signs of ransomware encryption or malware execution. **Do NOT power off the machine**, as volatile RAM contains critical cryptographic keys needed for forensic analysis.
  2. **Server Pod Termination**: If a cloud container pod is infected with crypto-mining malware, terminate the container instance immediately. The container orchestration engine will spin up a fresh, uncompromised image from our verified Gold Master container registry.
  3. **Storage Scan & Restore**: Scan all shared cloud storage buckets and local fallback JSON databases for infected file mutations. Revert any corrupted archives from the last verified clean hourly backup snapshot.

### 6.7 Phishing Attempts & Social Engineering Defenses (SOP-SEC-07)
* **Trigger**: Staff or students receive fraudulent emails impersonating the Executive Director, CFO, or NYSC State Coordinator requesting emergency fund transfers, salary advances, or student password resets.
* **Severity**: Level 2 (Moderate).
* **Step-by-Step Procedure**:
  1. **Domain & Sender Verification**: Inspect email email headers (Received-SPF, DKIM, DMARC). Identify the lookalike domain (e.g., *cooperstech-edu.ng* instead of *corperstech.ng*).
  2. **Global Advisory Broadcast**: The Support Officer immediately posts an urgent banner notification across the Command Center and internal Slack: *"ALERT: Active phishing campaign underway. Leadership will NEVER ask for password resets or direct bank transfers via email."*
  3. **Mail Server Takedown Request**: Submit an abuse takedown report to the registrar and hosting provider of the fraudulent lookalike domain, attaching raw email headers as proof of identity impersonation.

### 6.8 Insider Threats & Privilege Abuse Investigation (SOP-SEC-08)
* **Trigger**: Audit logs reveal an authenticated staff member accessing student records outside their assigned departmental jurisdiction, altering attendance grades without authorization, or modifying financial stipend tables.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Silent Audit Surveillance**: Do not immediately confront the employee. In Module 8, enable **[Enhanced Forensic Tracing]** for the target employee ID to record full request bodies and screen clicks.
  2. **Privilege Freeze**: Temporarily downgrade the user's role from *Operations Officer* or *Career Officer* to *Read-Only Support* to prevent further data tampering while investigation proceeds.
  3. **Executive Autopsy Meeting**: Present the immutable audit log evidence to the Executive Director and HR Lead. If malicious intent is proven, execute immediate termination and hand over digital evidence to law enforcement agencies.

---

## 7. Transportation & Logistics Emergencies

With daily shuttle fleets transporting hundreds of NYSC members across Lagos (Lekki, Ikeja, Yaba) and Abuja (Garki, Wuse, Maitama), transportation emergencies carry high risks of bodily injury and public disorder. Bus Marshals and Operations Officers must memorize these road survival protocols.

[Screenshot: Live Transportation & Manifest Command Dashboard]

### 7.1 Shuttle Vehicle Breakdown En-Route (SOP-TRN-01)
* **Trigger**: A transit shuttle bus experiences mechanical failure (engine overheat, tire puncture, transmission failure, battery death) while actively transporting students on public roadways.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure (Incorporating Existing Protocol)**:
  1. **Safe Pull-Over & Hazard Warning**: The bus driver immediately pulls the vehicle onto the shoulder or off the expressway, activates emergency hazard flashers, and deploys reflective warning triangles 50 meters behind the bus.
  2. **Notify Operations Command**: The Bus Marshal immediately calls the Operations Officer via emergency radio/mobile telephone and reports exact GPS location, landmarks, passenger count, and nature of breakdown.
  3. **Trigger Route Emergency**: The Operations Officer opens **Module 4 (Transportation & Logistics)**, locates the affected vehicle on the live dashboard, and clicks **[Trigger Route Emergency]**. This automatically broadcasts an urgent SMS/WhatsApp alert to all passengers on that manifest advising them of a standby rescue dispatch.
  4. **Rescue Shuttle Dispatch**: The Operations Officer dispatches the nearest standby rescue van (Executive Class C Van or reserve coaster bus) to the GPS coordinates. Once arrived, the Marshal transfers all passengers using handheld QR manifest scanners to verify zero passenger loss.

### 7.2 Traffic Accidents & Emergency Medical Services (SOP-TRN-02)
* **Trigger**: A shuttle bus is involved in a road traffic collision involving physical vehicle damage, passenger injury, or third-party casualties.
* **Severity**: Level 4 (Critical).
* **Step-by-Step Procedure**:
  1. **Immediate Medical Triage**: The Bus Marshal checks all passengers for injuries. If casualties exist, immediately dial national emergency services (112 or 767) and request ambulance and police dispatch.
  2. **Executive Emergency Notification**: Call the Super Admin / Head of Logistics within 3 minutes. State clearly: *"We have an active Level 4 transit collision on [Road Name]. Casualties reported: [Number]. Ambulance requested."*
  3. **Secure the Scene & Protect Passengers**: Guide uninjured students out of the vehicle away from traffic and moving vehicles. Do not allow students to engage in verbal or physical arguments with third-party drivers or hostile crowds.
  4. **Hospital Liaison Deployment**: The Executive Director immediately dispatches an Operations Officer and Campus Medical Officer with emergency cash funds to the receiving hospital to coordinate treatment and notify student next-of-kin.

### 7.3 Driver Illness or Sudden Incapacitation (SOP-TRN-03)
* **Trigger**: A shuttle bus driver experiences sudden severe illness (fainting, cardiac symptoms, severe fatigue, visual impairment) while operating the vehicle or prior to departure.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Immediate Vehicle Control**: If driving, the Bus Marshal or front-seat passenger must guide the vehicle to an immediate stop on the roadside and turn off the ignition key.
  2. **Medical First Aid**: Administer first aid to the driver and call emergency ambulance services if symptoms are acute.
  3. **Standby Driver Replacement**: Contact Operations Command. The Head of Logistics checks driver profiles in Module 4 and dispatches a certified reserve standby driver to take over the route within 30 minutes.

### 7.4 Missing Passengers & Boarding Manifest Discrepancies (SOP-TRN-04)
* **Trigger**: A student marked "Boarded" on the morning manifest at a pickup junction fails to disembark at the campus terminal, or a student fails to return to the shuttle after a rest stop.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure (Incorporating Existing Protocol)**:
  1. **Immediate Safety Alert Trigger**: If a student was marked "Boarded" at 06:45 AM but did not check in at campus by 08:30 AM, the Command Center triggers an **Immediate Safety Alert** (investigating possible en-route medical disembarkation or emergency).
  2. **Phone & Emergency Contact Contact**: The Operations Officer immediately calls the student's mobile number. If unreachable within 10 minutes, contact their registered next-of-kin from their CRM profile.
  3. **Route Backtracking**: Speak with the Bus Marshal and adjacent passengers to confirm where the student was last seen. If the student disembarked due to illness or personal emergency without notifying the Marshal, log the welfare check outcome in their permanent record.

### 7.5 Route Closures, Civil Unrest & Police Roadblocks (SOP-TRN-05)
* **Trigger**: Major expressways are blocked due to political riots, protests, severe flooding, or unannounced security agency roadblocks, trapping transit shuttles.
* **Severity**: Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Hold & Assess**: Drivers must stop at a safe, secure public area (such as a major filling station or government compound) before encountering hostile crowds. Never attempt to force a bus through a riot or violent roadblock.
  2. **Command Center Route Rerouting**: The Marshal notifies Operations Command. The Logistics Officer opens Google Maps live traffic feed, calculates a safe alternative bypass corridor, and pushes new turn-by-turn routing coordinates to the driver's GPS unit.
  3. **Student Shelter-in-Place**: If all return routes are impassable, the Head of Logistics authorizes an emergency shelter-in-place at an approved corporate partner hotel or secure facility, covering all accommodation and meal stipends from the emergency disaster fund.

### 7.6 Severe Weather & Flood Navigation (SOP-TRN-06)
* **Trigger**: Torrential rainfall submerges key transport arteries in Lagos (e.g., Lekki-Epe Expressway flooding) or Abuja, creating hazardous driving conditions.
* **Severity**: Level 2 (Moderate) or Level 3 (High).
* **Step-by-Step Procedure**:
  1. **Depth Threshold Rule**: Drivers are strictly prohibited from driving through floodwaters exceeding 30 centimeters (axle height). Attempting to cross deep water risks engine hydro-locking and electrical failure.
  2. **Schedule Delay & Broadcast**: When severe weather alerts are issued by meteorological agencies, the Operations Officer clicks **[Broadcast Transit Advisory]** in Module 4, delaying morning departures by 60 to 120 minutes until floodwaters recede.

### 7.7 Emergency Bus Evacuation Protocols (SOP-TRN-07)
* **Trigger**: Vehicle fire, fuel leak, heavy smoke, or impending collision risk requires immediate evacuation of all 30 passengers.
* **Severity**: Level 4 (Critical).
* **Step-by-Step Procedure**:
  1. **Evacuation Command**: The Bus Marshal shouts the mandatory command: *"EMERGENCY EVACUATION! LEAVE ALL BAGS! EXIT THROUGH FRONT AND REAR DOORS NOW!"*
  2. **Emergency Exit Deployment**: If doors are jammed due to collision impact, the Marshal pushes the emergency window exit levers or uses the window-breaker safety hammer located near the emergency escape hatch.
  3. **Muster Point Assembly**: Assemble all passengers at a safe muster point at least 100 meters upwind from the vehicle. Conduct an immediate head-count against the digital QR boarding manifest to ensure nobody is trapped inside.

---
*End of Part 3. Proceed to Part 4 for Student Welfare & Safety Emergencies, Communication Protocols, and Disaster Recovery Restoration Checklists.*
`;
