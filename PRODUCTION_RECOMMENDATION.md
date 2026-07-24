# CorpersTech v1.0 — Production Recommendation

This document outlines the hosting infrastructure, cloud scaling, database health checks, and optimization guidelines recommended for deploying the CorpersTech platform to staging and live production.

---

## 1. Hosting Architecture & Scaling Strategy

We recommend deploying CorpersTech utilizing a multi-tier containerized strategy to ensure maximum uptime, responsive operations, and high security.

### Recommended Stack
* **Container Engine**: **Google Cloud Run** or **Docker**
  - Why: Perfect for full-stack Node environments. Scales to zero when inactive, saving considerable hosting budgets during low NYSC enrollment hours.
* **Database Engine**: **Google Cloud SQL (MySQL v8.0)**
  - Why: Managed failovers, automated nightly backups, and native integration with Prisma ORM.
* **Static Assets Delivery**: Integrated inside Vite production packaging, compressed to gzip or Brotli format during the `esbuild` build process.

---

## 2. Database Maintenance & Relational Integrity

### 1. Unique Email Constraint
Ensure that a database-level unique constraint exists on the `email` field inside your MySQL schemas. Our repositories handle this gracefully on both database and filesystem fallback levels:
```sql
ALTER TABLE `Enrollment` ADD UNIQUE (`email`);
```

### 2. Relational Indexes
To optimize metrics compiling and CRM table lookup times, establish database-level indexing on primary filter attributes:
- `status` (Amber, Emerald, Purple filters)
- `nyscBatch` (Batch grouping)
- `course` (Course tracking)

---

## 3. High-Reliability Operations

To maintain maximum application reliability for Olatech staff, keep the following procedures in mind:

1. **Environmental Backups**: Configure nightly dumps of the MySQL instance to secure cloud buckets.
2. **Local Fallback DB Integrity**: The `enrollments-fallback-db.json` is a robust local safeguard. In hybrid hosting environments, mount this file on a persistent volume mount (such as Cloud Run volume mounts) to ensure that fallback states are preserved across container teardowns and restarts.
3. **Log Aggregation**: Route Express console outputs (`console.warn`, `console.error`) to standard logging aggregators (e.g., Google Cloud Logging) to monitor for connection drops or API response anomalies.

---

## 4. Final Launch Readiness Statement

The CorpersTech v1.0 system has successfully passed UAT verification and has been hardened against DB failures. 

We certify this platform as:  
**"UAT Approved — Ready for Live Corps Member Onboarding and Admissions Operations."**
