# CORPERSTECH v1.0 — DATABASE BASELINE
**MySQL Relational Schema, Constraint Layout, and Seeding Standards**

---

## 1. Relational Database Overview

The CorpersTech platform relies on **MySQL** as its primary, durable relational database. Direct database communication is abstracted and managed through **Prisma ORM**, ensuring type-safe query compositions and stable, incremental migrations.

---

## 2. Relational Schema Blueprint (`schema.prisma`)

The final, frozen schema contains the following highly connected tables:

### A. Staff Account Management (`Staff`)
*   **Column Structure**:
    *   `id`: `Int` — Primary Key (Auto-Increment)
    *   `email`: `String` — Unique Index (Used for login routing)
    *   `firstName` & `lastName`: `String` — Personal identifiers
    *   `role`: `String` — Security role (Super Admin, Admissions, Career, Operations, Finance, Support)
    *   `passwordHash`: `String` — Securely hashed credentials
    *   `status`: `String` — Account status (Active/Suspended)
    *   `isDeleted`: `Boolean` — Flag for soft-deletion safeguarding
*   **Unique Index**: `UNIQUE INDEX (email)`
*   **Auditing Relation**: Maps implicitly to system action tracks in the central ledger.

### B. Core Admissions & Enrollment (`Enrollment`)
*   **Column Structure**:
    *   `id`: `Int` — Primary Key (Auto-Increment)
    *   `firstName` & `lastName`: `String` — Student name details
    *   `email`: `String` — Unique Index (Ensures single entry per email)
    *   `phone`: `String` — Contact channel
    *   `stateOfService`: `String` — NYSC location mapping
    *   `callUpNumber`: `String` — Secondary NYSC verification ID
    *   `course`: `String` — Chosen training pathway (Frontend, Backend, UI/UX, Cyber Security, Data Science)
    *   `status`: `String` — State (Pending, Approved, Rejected)
    *   `registrationDate`: `DateTime` — Log entry creation timestamp
    *   `notes`: `String` (Nullable) — Admissions advisor internal notes

### C. Career Center & Job Pipeline (`JobOpportunity` & `JobApplication`)
*   **Opportunity Schema**:
    *   `id`: `Int` — Primary Key
    *   `title`, `company`, `location`, `type`: `String` — Job posting metadata
    *   `description`, `requirements`: `String` — Technical prerequisites
    *   `salary`: `String` — Remuneration or stipend details
    *   `status`: `String` — (Draft, Published, Filled, Expired)
*   **Application Schema**:
    *   `id`: `Int` — Primary Key
    *   `jobOpportunityId`: `Int` — Foreign Key pointing to `JobOpportunity`
    *   `fullName`, `email`, `phone`, `nyscBatch`: `String` — Applicant identification
    *   `cvPath`: `String` — Simulated cloud attachment reference
    *   `status`: `String` — Review status (Submitted, Shortlisted, Rejected)
*   **Relationship Guard**: A `JobApplication` belongs to a single `JobOpportunity`. Deleting a job opportunity cascade-clears or restricts matching applications to preserve foreign key integrity.

### D. Chronos Security Logging (`AuditLog`)
*   **Column Structure**:
    *   `id`: `Int` — Primary Key
    *   `username`: `String` — Operator identifier
    *   `role`: `String` — Actor privilege
    *   `category`: `String` — Action classification (Staff Management, Admissions, Backup, Content Management)
    *   `description`: `String` — Narrative detail of the transaction
    *   `status`: `String` — Success/Failure outcome
    *   `timestamp`: `DateTime` — Immutable execution time

---

## 3. Database Constraints and Data Integrity

1.  **Unique Indexes**: Email constraints prevent duplicate entries in both staff credentials and student registrations.
2.  **Cascade Constraints**: Deletions on parent entities are checked against active child rows to prevent orphaned database references.
3.  **Soft Deletions**: Rather than executing raw `DELETE` operations on historical staff records, the system applies `isDeleted = true`. This preserves audit logs pointing to former administrators.

---

## 4. Bootstrapping and Automated Seeding

On initial runtime, `server.ts` checks the active relational tables and performs automated bootstrapping:

*   **Super Admin Seeding**: If the `Staff` table is empty, the database seeds an initial Super Admin account:
    *   **Email**: `admin@corperstech.com`
    *   **Role**: `Super Admin`
    *   **Fallback Setup**: Enables immediate administrative access.
*   **Recruitment Categories Seeding**: Inserts initial standard vacancy channels and sources for the Recruitment AI module.

---

## 5. Certification

All migrations are complete. No database schema changes are pending. The MySQL setup is certified as clean, stable, and ready for high-load production.

*Certified by:*  
**Olatech School of Programming Engineering Team**  
**July 1, 2026**
