# CORPERSTECH v1.0 — FINAL DEPLOYMENT CERTIFICATE
**Production Readiness, Migration Guidelines, and Disaster Recovery Playbook**

---

## 1. Production Deployment Checklist

This **Deployment Certificate** certifies that the CorpersTech platform is pre-configured and structured for deployment to production environments. Follow the steps below to orchestrate a deployment of the platform.

### Quick-Reference Launch Sequence:

```
[Prisma Migrations] -> [Build SPA dist/] -> [Compile server.cjs] -> [Port 3000 Ingress] -> [Health Validation]
```

---

## 2. Environment Variables Configuration

Ensure all required environment parameters are populated on your target production host. Document these variables in `.env.example`:

```env
# Database Credentials
DATABASE_URL="mysql://username:password@mysql-host-ip:3306/corperstech"

# Third-Party AI Integrations
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Runtime Environment
NODE_ENV="production"
```

> [!CAUTION]
> Never commit actual secrets to `.env.example` or the Git repository. Private variables must be injected at runtime using secure container secret managers (such as Google Cloud Secret Manager).

---

## 3. Port Configuration

*   **Host Port Standard**: The server is pre-configured to bind to Port `3000` on host `0.0.0.0` (as defined in `server.ts`).
*   **Production Ingress**: Standard production containers route incoming HTTPS web traffic (Port 443) directly to the application container on Port 3000. Do not modify or override this binding.

---

## 4. Prisma Relational Migrations

Before launching the Express backend, synchronize the database schema with the live MySQL instance:

1.  **Initialize Schemas**: Apply all database migrations:
    ```bash
    npx prisma migrate deploy
    ```
2.  **Generate Query Client**: Compile the Prisma client queries:
    ```bash
    npx prisma generate
    ```
3.  **Bootstrapping and Seeding**: When the server first starts, the repositories will automatically seed the initial **Super Admin** account and recruitment categories if they do not exist.

---

## 5. Automated Backup & Cron Configuration

To protect database records from unexpected hardware failures or data loss, the platform includes a self-healing **Backup & Recovery Center**:

*   **Integrated Scheduler Loop**: The backend features an internal background scheduler checking every 60 seconds (using a `setInterval` thread).
*   **Automated Dump Intervals**: Can be scheduled to trigger every 6h, 12h, 24h, weekly, or monthly.
*   **File Isolation**: Backup files are bundled as compact `.json` schemas containing full relational records. These are written directly to safe storage volumes.

---

## 6. Live Health Check Validation

We verified the live health endpoints to facilitate automated load-balancer monitoring (e.g., Kubernetes liveness/readiness probes):

*   **Health Status Endpoint**: `/api/health`
    *   **Response Body**:
        ```json
        { "status": "ok", "database": "Prisma/MySQL" }
        ```
    *   **HTTP Status Code**: `200 OK`
*   **Platform Deep Inspect**: `/api/health-check`
    *   **Response Body**: Validates the environmental variables, verifies MySQL connectivity, and checks workspace filesystem structure.

---

## 7. Disaster Recovery Rollback Guidelines

In the event of database corruption or accidental deletion, follow these recovery procedures:

### Step-by-Step Restore Trigger:
1.  **Locate Backup Archive**: Navigate to the **Backup & Recovery** sub-tab in the Admissions panel. Identify the desired backup timestamp.
2.  **Click Restore**: Select the **Restore** button next to the archive.
3.  **Security Confirm**: Review the warning. Type the official production safety override phrase:
    ```
    RESTORE_OLATECH_PRODUCTION
    ```
4.  **Execute**: Click **Execute Rollback**.
5.  **Relational Database Re-sync**:
    *   The platform locks active write requests to prevent race conditions.
    *   Triggers table drops on active tables.
    *   Unpacks the backup payload and inserts all historical records with intact primary key relations.
    *   Releases database locks and logs a successful restore audit trace.

---

## 8. Deployment Verdict

The deployment pipeline is certified as complete, streamlined, and ready for production launch. Follow standard CI/CD practices using standard container files to roll out the verified v1.0 code.
