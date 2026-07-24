# CORPERSTECH v1.0 — FINAL HANDOVER CHECKLIST
**System Operations and Administrative Sign-off Manual**

---

## 1. Handover Objective

This **Final Handover Checklist** provides a structured, step-by-step verification plan for Olatech administrators and engineering leadership to evaluate, sign off, and take ownership of the **CorpersTech v1.0 Gold Master** platform. By following these steps, you can verify the integrity of all user portals, staff security roles, database connections, AI services, and backup safeguards.

---

## 2. Handover Verification Steps

### Phase A: Public Portal Walkthrough
- [ ] **Home Page Verification**: Open the home page (`/`). Verify that the header, registration portal, dynamic training highlights, and stats trackers render correctly.
- [ ] **Learn Tech View**: Navigate to `/learn-tech`. Click each course curriculum card and verify that the learning modules, syllabus duration, and cost criteria display clearly.
- [ ] **Opportunities Filter Board**: Navigate to `/opportunities`. Click on remote, hybrid, and on-site filters. Click **Apply Now** on any listing to verify that the job application pop-up displays with validation fields and the CV upload simulator.
- [ ] **Career Launch Center**: Navigate to `/career-hub`. Verify that downloadable templates, webinar schedules, and success stories are fully accessible.
- [ ] **Contact Form Submission**: Submit a mock message via the contact form. Ensure success feedback is immediate.

### Phase B: Staff RBAC Verification
- [ ] **Super Admin Entry**: Navigate to `/admissions`. Login with credentials `admin@corperstech.com` (use seeded temporary credentials). Ensure access to all tabs (Team Management, Backups, Platform Settings, Admissions, Documentation, Support).
- [ ] **Admissions Officer Workspace**: Login as a seeded Admissions Officer. Verify that the **Backup & Recovery** and **Platform Settings** tabs are hidden from the layout. Ensure student application status transitions (Pending -> Approved) function correctly.
- [ ] **Career Officer Workspace**: Login as a Career Officer. Verify that the **Job CMS** is fully accessible and that you can publish, edit, draft, and expire job listings.
- [ ] **Support Officer Workspace**: Login as a Support Officer. Verify access to student query logs, ticket replies, and the documentation resource manual.

### Phase C: Advanced AI Engine Verification
- [ ] **Recruitment AI Discovery**: Open the Super Admin or Career Officer dashboard. Navigate to **Recruitment AI**. Trigger a manual vacancy scan. Verify that the scanner retrieves vacancies, scores match standards, extracts stipend info, and flags duplicates.
- [ ] **Personalized Career Coach**: Open the student **Career Dashboard** (`/career-dashboard`). Select the **Career Coach** tab. Ask a technical career question (e.g., "What is the roadmap for React?"). Verify that the AI returns context-specific mentoring answers.
- [ ] **CV Auditor Evaluation**: Paste mock experience details into the **CV Auditor** form. Enter target job requirements. Run the audit and ensure it outputs structured matching scores, core keyword suggestions, and optimization tips.

### Phase D: Database & Disaster Recovery Verification
- [ ] **Audit Logs Ledger**: Perform an administrative action (e.g. updating course tuition fee in Settings). Open the **Chronos Audit Logs** tab and verify that a success event with your username and role is appended immediately.
- [ ] **Disaster Recovery Backup**: Open the **Backup & Recovery Center** under Super Admin. Click **Trigger Manual Backup**. Verify that a new `.json` timestamp record appears in the backup archive history.
- [ ] **Complete System Rollback**: 
  1. Click **Restore** next to the newly created backup.
  2. Enter the official production safety override phrase: `RESTORE_OLATECH_PRODUCTION`
  3. Execute rollback. Verify that database tables refresh and that connectivity is restored within seconds.

---

## 3. Operational Settings and Handoff

Upon completing these validation steps, the Olatech School of Programming team can confidently accept the platform and deploy it live. The codebase, configurations, and baseline documents are fully aligned, locked, and certified.

*Signed by:*  
**Olatech School of Programming Engineering Team**  
**July 1, 2026**
