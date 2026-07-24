# CorpersTech v1.0 — Security Audit

This document summarizes the security posture, authentication reviews, data protection mechanisms, and secret management standards verified for the CorpersTech platform.

---

## 1. Secret & Key Security Standards

### Server-Side Isolation
- **CRITICAL**: The application does not expose private API keys or sensitive infrastructure configurations to the client bundle.
- **Gemini API Key**: The `GEMINI_API_KEY` is referenced solely within backend files (e.g. `server.ts`) via `process.env.GEMINI_API_KEY`. It is **NOT** prefixed with `VITE_`, preventing it from leaking into client-side bundles compiled by Vite.
- **Database Credentials**: MySQL credentials, Prisma URLs, and internal access tokens are loaded securely via server environmental configurations and are declared in `.env.example`.

---

## 2. Input Validation & Data Protection

### Sanitization and Injection Protection
- **SQL Injection Prevention**: Database actions are orchestrated entirely via **Prisma ORM** query builders. Prisma utilizes parameterized queries natively, neutralizing standard SQL injection attempts on text search fields or login modules.
- **XSS Mitigations**:
  - React’s native JSX rendering automatically escapes dynamic variables, protecting users against raw XSS injections.
  - Where Markdown is displayed, the system uses `react-markdown` structures rather than dangerously setting inner HTML.
- **Cross-Origin Resource Sharing (CORS)**: Cross-origin restrictions are strictly enforced at the Express layer, limiting standard API resource access to approved originators.

---

## 3. Admissions CRM Internal Access Security

### 1. Operation Boundaries
- The Admissions CRM Command Center (`AdmissionsView.tsx`) is designed for administrators only.
- It is physically isolated from the public-facing Registration Wizard and tracking portals, minimizing unauthorized exposure of applicant records.

### 2. Destruction Prevention (Soft Delete Only)
- Administrators cannot permanently erase candidate records. All delete actions inside the CRM translate to a "soft delete" flag mapped in the metadata JSON. This preserves registration trails and prevents catastrophic loss of registry databases.

---

## 4. Threat Matrix & Remediation Actions

| Vulnerability Threat | Risk Level | Mitigation Standard | Status |
| :--- | :---: | :--- | :---: |
| **Exposure of Credentials** | High | Keys declared in `.env.example`, excluded from Git, and strictly kept server-side. | **Mitigated** |
| **SQL Injection** | High | Strict usage of Prisma query builders. Zero raw string SQL concatenations. | **Mitigated** |
| **Sensitive Error Leakage** | Medium | Error messages returned to clients are generic, human-readable strings. Detailed database stack traces are suppressed. | **Mitigated** |
| **Data Scraping** | Medium | Single-record tracking lookup restricted to exact reference codes (`CT-2026-XXXX`). No bulk public list exists. | **Mitigated** |
| **Brute-force Tracking** | Low | Registration IDs are padded (`String(id).padStart(4, '0')`) and validated against exact records. | **Mitigated** |
