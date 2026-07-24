# CorpersTech v1.0 — Deployment Guide

This guide describes how to configure, migrate, compile, and deploy the CorpersTech platform into high-performance hosting environments (Cloud Run, Docker, VPS, etc.).

---

## 1. System Requirements

- **Node.js**: `v18.x` or higher (Recommended: `v20.x`)
- **Package Manager**: `npm` (Lockfile: `package-lock.json`)
- **Database Engine**: MySQL (v8.0) or PostgreSQL
- **Build Tool**: Vite + CJS Server Compiler (`esbuild`)

---

## 2. Configuration Parameters (`.env`)

Create a `.env` configuration file in your server root containing the following variables:

```env
# Database connection string (Prisma schema target)
DATABASE_URL="mysql://username:password@localhost:3306/corperstech"

# Server environment (production or development)
NODE_ENV="production"

# Ingress port (Note: Cloud containers automatically target port 3000)
PORT="3000"

# Google Gemini API key for server operations (keep confidential)
GEMINI_API_KEY="your-gemini-api-key-here"
```

---

## 3. Build & Run Lifecycle

Follow these steps to deploy the application on your server:

### Step 1: Install Node Dependencies
Ensure clean, locked package dependencies are installed:
```bash
npm ci
```

### Step 2: Database Migration
Deploy the database schema using Prisma:
```bash
npx prisma db push
```

### Step 3: Run the Production Build
This executes both Vite's client-side SPA compilation and Bundling of the Express.js server into `dist/server.cjs` via `esbuild`:
```bash
npm run build
```

### Step 4: Launch the Server
Execute the self-contained production bundle using Node:
```bash
npm start
```
The application will launch on port `3000` under host `0.0.0.0`.
