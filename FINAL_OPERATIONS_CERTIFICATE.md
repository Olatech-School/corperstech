# CORPERSTECH v1.0 — FINAL OPERATIONS CERTIFICATE
**Olatech Staff Workflows, Administration Manual, and Settings Operations**

---

## 1. Executive Operations Statement

This **Operations Certificate** defines the administrative workflows and manual procedures for **Olatech School of Programming** staff. CorpersTech v1.0 implements a unified administrative panel (`/admissions`) that consolidates student enrollment tracking, team provisioning, content publishing, automated recruitment monitoring, and platform reliability controls.

---

## 2. Staff Workflows & Administrative Segregation

Administrative staff can login securely to access their dedicated workspaces. The workspace adjusts dynamically to reflect the permissions assigned to their role:

### A. Student Admissions Workflow (Admissions Officers)
1.  **Review Submissions**: Navigate to the **Admissions Tracking** panel. Filter incoming enrollments by "Pending".
2.  **Verify NYSC Details**: Check the candidate's NYSC Batch, State of Service, PPA, and laptop availability.
3.  **Manage Cohorts**: Approve qualified students and assign them to an active training cohort.
4.  **Logging**: Update administrative notes to document communications or document verification status.

### B. Career Launch & Placements Workflow (Career Officers)
1.  **Publish Openings**: Use the **Job CMS** tool to publish tech internships, entry-level opportunities, and graduate placements.
2.  **Approve Applications**: Filter through candidate CV reviews, portfolio links, and technology stack. Mark applications as Shortlisted or Rejected.
3.  **Publish Success Stories**: Write and upload Olatech alumni success stories to inspire current training cohorts.

### C. System Operations & Calendar Workspace (Operations Officers)
1.  **Announcements & News**: Post global platform announcements (e.g. holiday closures or system upgrades).
2.  **Calendar Events**: Create, edit, and organize webinar sessions, masterclasses, and corporate networking events.
3.  **Webinar Reservations**: Track seat reservations and coordinate student reminders.

### D. System Maintenance & Configuration (Super Admin Only)
1.  **Staff Provisioning**: Add new administrative staff members, modify existing role assignments, reset lost passwords, and trigger soft deletions.
2.  **Platform Settings**: Modify global tuition tiers, course syllabi, and contact details.
3.  **Disaster Recovery**: Access the Backup Center to schedule backups, verify file health, and execute database rollbacks.

---

## 3. Platform Settings Panel Configuration

The **Platform Settings** sub-tab allows authorized administrators to update core parameters:

*   **Tuition and Pricing**: Adjust standard course fees or discount tiers.
*   **Contact Information**: Update the primary helpdesk phone, physical office location, and administrative emails.
*   **Dynamic Syllabi**: Modify training durations, course prerequisites, and curriculum timelines.

---

## 4. The Backup & Reliability Center Dashboard

The **Backup & Recovery Center** is a dedicated administration panel accessible to Super Admins. It displays:

1.  **System Diagnostics**: Live gauges indicating server memory allocation, CPU load, database latency, and gateway response speed.
2.  **Backup Directory Registry**: A chronological list of all saved backup files.
3.  **Automated Backup Scheduler**: Options to toggle the background scheduler loop and define the backup cycle interval (6h, 12h, daily, weekly, monthly).
4.  **Manual Override Backups**: A quick-trigger button to immediately write a full database backup before running major system upgrades.

---

## 5. Manual Override Procedures

In the event of network connectivity issues or database locks, several manual overrides can be triggered:

### Manual Database Refresh:
If relational tables appear out-of-sync or data displays are lagging, click the **Refresh Telemetry** button in the Backup tab header to force a deep-check of Prisma database connections.

### Force Password Override:
If a staff member loses access, the Super Admin can overwrite their login password from the **Team Management** panel:
1.  Locate the staff record and click **Reset Password**.
2.  Define a secure temporary password.
3.  Ensure "Force password change on next login" is checked.
4.  Provide the temporary password to the staff member.

### Manual Expiry Scanner Trigger:
If automated background scanners are paused, navigate to the **Recruitment AI** workspace and click **Trigger Expiry Check** to manually sweep published vacancies and archive stale listings.

---

## 6. Operations Certification Verdict

The CorpersTech administrative suite has been certified as intuitive, secure, and fully operational. Segregation of duties is correctly enforced across all Olatech staff roles, ensuring secure and stable platform operations.
