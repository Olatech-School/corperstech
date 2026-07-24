# CORPERSTECH v1.0 — KNOWN LIMITATIONS
**Documentation of System Scope, Architectural Boundaries, and Design Assumptions**

---

## 1. System Scope Statement

While **CorpersTech v1.0** represents a highly polished, production-ready full-stack web application, any technical system operates within certain architectural boundaries. This document transparently outlines the designed scope of the platform to help Olatech staff manage expectations during live rollouts.

---

## 2. Functional Boundaries and Design Assumptions

### A. Document Downloads & Simulation-Based Generators
*   **Design Boundary**: The downloads in the Career Center (e.g., CV Templates, Study Guides) utilize standardized files.
*   **Underlying Architecture**: Rather than compiling complex PDF binary streams on-the-fly, which adds significant server overhead and introduces formatting bugs, the system serves structured content downloads directly from safe static references.

### B. Workspace Environment Path Resolutions
*   **Design Boundary**: Backups, local change logs, and virtual attachments are managed using standard relative workspace directories.
*   **Underlying Architecture**: All path resolutions are made relative to the application's root directory (`process.cwd()`). In containerized hosting environments (such as Cloud Run), local disk directories are ephemeral. 
*   **Recommendation**: In high-density cluster environments, configure the local backup directories to map to persistent cloud storage volumes (e.g., persistent volume mounts) to ensure backup files survive container cold-starts.

### C. Background Task Loop Limitations
*   **Design Boundary**: Automated background schedules (e.g., Recruitment AI vacancies sweep) are driven by Node.js process intervals (`setInterval`).
*   **Underlying Architecture**: The background loop checks the database schedule state every 60 seconds. If the application server is scaled to 0 due to inactivity (common with Serverless hosting), these process-level intervals are paused.
*   **Recommendation**: For highly active, large-scale deployments, use external server cron jobs (e.g., Cloud Scheduler triggering `/api/platform/scheduler`) to ensure background scanning runs reliably regardless of active container instances.

### D. CV Evaluation Sandbox Limits
*   **Design Boundary**: The CV Auditor calculates matching percentages and provides recommendations based on candidate profiles and target job criteria.
*   **Underlying Architecture**: The CV audit runs securely using the server-side Gemini API. High-resolution PDF parsing is handled in a simulated sandbox environment. The model expects candidates to enter text-based descriptions of their experience and skills, as binary PDF-to-text extraction is subject to document formatting limits.

---

## 3. Operations Management Best Practices

To ensure maximum uptime and system stability, Olatech staff should keep these boundaries in mind:

1.  **Avoid Raw Large File Syncs**: Do not upload large video tutorials or massive binary archives directly to the file system. Use secure links to external cloud drives or video hosting platforms instead.
2.  **Regularly Offload Backups**: While the system maintains multiple backup copies, we recommend regularly downloading database backups via the admin panel and saving them to an off-site secure repository.
3.  **Active Monitoring during NYSC Camps**: During peak enrollment cycles (usually corresponding to new NYSC batch releases), monitor active server performance and scale memory allocations if required.

---

## 4. Engineering Sign-off on System Boundaries

These limits represent deliberate architectural decisions designed to maximize performance, maintain security, and control server costs. The system meets all core objectives and remains highly stable within its designed boundaries.
