export const STAFF_HANDBOOK_PART_4 = `# 12. Emergency Procedures & Disaster Recovery

Operational disruptions—whether caused by server hardware failures, cloud database latency, power grid collapses, or physical campus emergencies—must be met with calm, structured, and rapid execution. All staff must memorize the following emergency standard operating procedures.

---

## 12.1 System Downtime & Express/Vite Server Failure

### Symptom Recognition
* The CorpersTech Command Center URL fails to load, displaying HTTP 500 (Internal Server Error), HTTP 502 (Bad Gateway), or an infinite loading spinner.
* API network requests in browser developer tools return connection timeout errors.

### Action Plan (SOP-EMG-01)
1. **Immediate Verification (Minute 0–3)**: The staff member discovering the outage must test connectivity across multiple devices (desktop LAN vs mobile 4G network) to confirm whether the issue is a local network glitch or a global server outage.
2. **Alerting Technical Lead (Minute 3–5)**: If a global outage is confirmed, post an immediate alert in the \`#system-emergencies\` internal Slack channel and ping the Super Admin and Technical Lead directly.
3. **Student Communication Holding Statement (Minute 10)**: If the outage persists beyond 10 minutes during active bootcamp hours, the Support Officer must deploy the pre-approved holding message across all official student WhatsApp broadcast groups:
   \`\`\`
   "⚠️ CORPSTECH SYSTEM ALERT: Our engineering team is currently resolving a temporary database connectivity latency. Classroom lab instructions and offline Markdown guides remain fully accessible. We will notify all cohorts the moment full interactive portal access is restored. Thank you for your professional patience."
   \`\`\`
4. **Local Fallback Mode Activation**: Instruct active classroom students to switch to local development environments and utilize the downloaded offline Markdown documentation bundles until server restoration is confirmed.

---

## 12.2 Database Failure & Prisma ORM Fallback

### Symptom Recognition
* The Command Center UI loads, but data tables (Enrollees, Jobs, Transport Manifests) appear empty or display red error banners stating: *"Prisma failure in repository. Falling back to localized persistent store."*

### Action Plan (SOP-EMG-02)
1. **Understand the Architecture**: The CorpersTech system is engineered with an automated resilience layer. When the primary PostgreSQL cloud database connection fails, the repository layer automatically catches the exception and falls back to local JSON file persistence (\`docs-fallback-db.json\`, \`enrollees-fallback-db.json\`, etc.).
2. **Operational Continuity**: Staff can continue reading operational documents and processing critical intake data in fallback mode.
3. **Super Admin Restoration Protocol**:
   * Access the server terminal directly via SSH or container management console.
   * Verify cloud database instance health, firewall ingress rules, and connection pool limits.
   * If the cloud database is corrupted, navigate to the Command Center **Backup Center Module**.
   * Select the most recent verified Gold Master JSON backup snapshot and execute an automated database seed restore.
   * Verify schema integrity by running \`prisma generate && prisma db push\`.
4. **Post-Incident Audit**: Once primary database connectivity is restored, cross-reference any records created during fallback mode and merge them into the master relational database.

---

## 12.3 Internet Connectivity Outages (Campus LAN)

### Action Plan (SOP-EMG-03)
1. **Automated Failover Activation**: All Olatech training campuses are equipped with dual-WAN routing. If the primary fiber optic ISP fails, the network router is configured to automatically fail over to secondary high-speed 5G cellular modems within 30 seconds.
2. **Manual Failover Override**: If automated routing fails, the Operations Officer must manually switch lab switch hubs to secondary cellular router ports.
3. **Bandwidth Throttling & Prioritization**: During secondary cellular failover, the Support Officer must enable QoS (Quality of Service) firewall rules to throttle high-bandwidth video streaming and prioritize Command Center API traffic, SSH terminal connections, and code repository syncs.

---

## 12.4 Power Interruptions & Generator Failover

### Action Plan (SOP-EMG-04)
1. **UPS Battery Continuity**: All lab workstations, network switches, and server racks are powered through heavy-duty Online UPS (Uninterruptible Power Supply) units providing 20 minutes of silent battery backup.
2. **Generator Dispatch (3-Minute Rule)**: In the event of a municipal power grid collapse, the Operations Officer must initiate diesel generator startup within **3 minutes**.
3. **Extended Outage Protocol**: If generator mechanical failure occurs and campus power cannot be restored within 15 minutes:
   * Instruct students to save all local code changes immediately to USB or local drives.
   * Coordinate an orderly adjournment of physical lab classes to remote study mode.
   * Ensure all sensitive server hardware is gracefully shut down before UPS batteries deplete completely.

---

## 12.5 Physical Campus & Staff Emergencies

### Medical Emergency (SOP-EMG-05)
1. **Immediate Aid**: If a student or staff member experiences a medical crisis on campus, immediately contact the campus First Aid Officer and call local emergency ambulance services (\`112\` or \`767\` in Lagos/Abuja).
2. **Crowd Control**: Clear the immediate vicinity around the affected individual to ensure adequate airflow and privacy.
3. **Next-of-Kin Notification**: Retrieve the student's emergency contact details from their Command Center enrollment profile and notify their family member with calm, factual details.

### Fire or Evacuation Emergency (SOP-EMG-06)
1. **Alarm Activation**: Sound the physical campus fire alarm immediately upon spotting smoke or uncontrolled fire.
2. **Orderly Evacuation**: Instructors and Operations Officers must guide students calmly along designated emergency exit routes to the outdoor campus assembly point. **Do NOT use elevators.**
3. **Headcount Accountability**: Use the digital morning attendance manifest on a mobile device to conduct an exact headcount at the assembly point. Report any missing persons immediately to arriving fire rescue personnel.

---

# 13. Staff Performance Expectations & KPIs

To ensure Olatech School of Programming remains an elite career accelerator, staff performance is evaluated continuously against objective, data-driven Key Performance Indicators (KPIs). Annual promotions, salary adjustments, and performance bonuses are directly tied to these metrics.

## 13.1 Universal Performance Core Competencies
Regardless of departmental role, all employees are evaluated on six universal core competencies:
1. **Accountability & Ownership**: Taking full personal responsibility for assigned workflows, admitting errors promptly without deflecting blame, and executing solutions to completion.
2. **Productivity & Execution Velocity**: Completing daily checklists, vetting enrollees, and resolving tickets within established Service Level Agreements (SLAs) without requiring micromanagement.
3. **Teamwork & Cross-Departmental Synergy**: Proactively assisting colleagues during peak intake surges, sharing technical knowledge, and communicating with professional warmth across departmental boundaries.
4. **Customer Service Excellence**: Treating NYSC corps members, alumni, and external employers with empathy, respect, and executive poise at all times.
5. **Continuous Learning & Technical Growth**: Dedicating personal professional time to master new software tools, AI prompting frameworks, and emerging programming languages.
6. **System Integrity & SOP Adherence**: Strictly following documented Command Center rules, security protocols, and audit trail mandates.

---

## 13.2 Role-Specific KPI Scorecards

### 13.2.1 Admissions Officer KPI Scorecard
* **Application Vetting Turnaround Time**: Target = **< 24 Hours** from online submission to initial vetting status update.
* **Intake Checklist Accuracy Rate**: Target = **99.5%**. (Percentage of enrolled students with zero missing documents or unverified call-up numbers upon audit).
* **Enquiry Conversion Ratio**: Target = **> 65%**. (Percentage of initial student inquiries successfully converted into active cohort enrollments).
* **Student Onboarding Satisfaction Score**: Target = **> 4.6 / 5.0** on post-orientation student feedback surveys.

### 13.2.2 Career Officer KPI Scorecard
* **AI Scraper Verification Velocity**: Target = **100%** of AI-discovered job vacancies scoring > 80% confidence verified and published within **48 hours** of discovery.
* **Student Placement Conversion Rate**: Target = **> 75%** of graduating cohort students placed in verified tech internships, contract roles, or full-time jobs within **90 days** of bootcamp completion.
* **AI CV Evaluator Coaching Volume**: Target = **< 48 Hours** response turnaround for 1-on-1 portfolio review requests.
* **Employer Partner Retention Rate**: Target = **> 85%** repeat hiring rate among corporate employer partners annually.

### 13.2.3 Operations & Logistics Officer KPI Scorecard
* **Shuttle Bus Punctuality Rate**: Target = **> 98%** of student transport shuttles departing and arriving at designated campus landmarks within **10 minutes** of scheduled times.
* **Campus Lab Infrastructure Uptime**: Target = **> 99.8%** availability of lab power, Wi-Fi connectivity, and projector systems during active bootcamp training hours.
* **Enquiry Resolution Turnaround**: Target = **< 12 Hours** for general public and student operational helpdesk inquiries.
* **Logistics Budget Variance**: Target = **+/- 3%** variance between forecasted monthly fuel/maintenance budgets and actual reconciled expenditure.

### 13.2.4 Finance Officer KPI Scorecard
* **Payment Verification Speed**: Target = **< 4 Hours** from student bank transfer or gateway payment to CRM ledger confirmation and access unlocking.
* **Vendor Invoice Processing Turnaround**: Target = **< 3 Business Days** for verified vendor invoices and instructor stipend disbursements.
* **Financial Reporting Punctuality**: Target = **100%** on-time delivery of monthly Income & Expenditure statements by the 3rd business day of the following month.
* **Audit Compliance Zero-Defect**: Target = **0 Statutory Audit Infractions** or unexplained ledger variances during annual external accounting reviews.

### 13.2.5 Support Officer KPI Scorecard
* **First-Response Time (SLA)**: Target = **< 30 Minutes** for high-priority system outage tickets; **< 2 Hours** for general student technical helpdesk tickets.
* **Ticket Resolution Rate**: Target = **> 95%** of support tickets successfully resolved on first contact without requiring secondary escalation.
* **Helpdesk User Satisfaction Rating**: Target = **> 4.8 / 5.0** average star rating on closed support ticket feedback forms.
* **Documentation Contribution**: Target = **At least 2 new or updated Knowledge Base articles** authored and published in the Documentation Center monthly.

---

## 13.3 Performance Evaluation & Continuous Improvement
* **Monthly One-on-One Check-Ins**: Department leads conduct monthly 30-minute developmental check-ins with each staff member to review dashboard KPI metrics, discuss operational bottlenecks, and align on personal growth goals.
* **Quarterly Performance Reviews**: Comprehensive evaluations combining quantitative KPI scorecard results with qualitative peer feedback and self-assessments.
* **Performance Improvement Plans (PIP)**: If a staff member consistently falls below 75% of their role KPI targets for two consecutive months, they will be placed on a supportive 30-day Performance Improvement Plan, pairing them with a senior mentor to re-establish operational excellence.

---

## 13.4 Mandatory Continuous Professional Development (CPD)
To maintain institutional leadership in tech education, all Olatech staff members must complete at least **40 hours of continuous professional development annually**:
* **Technical Skill Upgrading**: Staff are required to complete at least one advanced certification or internal course per year relevant to their domain:
  * *Admissions & Operations Officers*: Advanced Excel/Data Analytics, Salesforce/CRM Administration, Project Management Professional (PMP).
  * *Career Officers*: Tech Recruiting Certification, Prompt Engineering for AI Scrapers, LinkedIn Recruiter Mastery.
  * *Support Officers & Instructors*: Full-Stack TypeScript/React Certification, Node.js/Express Security Hardening, Prisma ORM Mastery, CompTIA Security+.
* **Documentation Center Immersion**: Staff must actively utilize the CorpersTech Documentation Center, bookmarking key manuals, reading emerging AI recruitment guides, and submitting constructive feedback to keep institutional documentation at the cutting edge of global tech education standards.
`;
