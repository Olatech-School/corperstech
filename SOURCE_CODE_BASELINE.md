# CORPERSTECH v1.0 — SOURCE CODE BASELINE
**Structural Map, Code Architecture, and Final File Registry**

---

## 1. Architectural Baseline

CorpersTech v1.0 adheres to a modular, decoupled full-stack React and Express architecture. The application is written entirely in **TypeScript** to provide strict compile-time validation, strong typing interfaces, and high runtime predictability.

*   **Frontend**: Single-Page Application (SPA) driven by React 19 and compiled via Vite. Highly responsive interfaces are rendered using custom Tailwind CSS utility classes and fluidly animated via `motion/react`.
*   **Backend**: Isolated REST API controllers mounted on an Express server (`server.ts`).
*   **Database Client**: Prisma Client mapping strictly to a relational MySQL cluster.

---

## 2. Directory Structure and Module Registry

The frozen directory map is configured as follows:

```
corperstech-root/
│
├── prisma/
│   └── schema.prisma             # Finalized MySQL relational schema
│
├── src/
│   ├── App.tsx                   # Central router & view lifecycle controller
│   ├── index.css                 # Global CSS importing Tailwind and display fonts
│   ├── main.tsx                  # Client entry point
│   │
│   └── components/
│       ├── HomeView.tsx          # Public Portal: Homepage highlights
│       ├── LearnTechView.tsx     # Public Portal: Dynamic tech curricula
│       ├── OpportunitiesView.tsx # Public Portal: Live job opportunities and applications
│       ├── AboutView.tsx         # Public Portal: History and values
│       ├── ContactView.tsx       # Public Portal: User queries & messages
│       ├── AdmissionsView.tsx    # Staff Workspace: Core Admissions & administrative dashboard
│       ├── TrackerView.tsx       # Registration Tracker: Live tracking of enrollments
│       ├── CareerHubView.tsx     # Career Portal: Webinars, templates, study resources
│       ├── CareerDashboardView.tsx # Student Space: Career Coach, custom roadmaps, CV Auditor
│       │
│       # Locked Sub-modules of Admissions Dashboard
│       ├── BackupRecoveryCenterView.tsx # Reliability, telemetry, and database disaster rollback
│       ├── OperationsCenterView.tsx     # Operations CMS (Events, Announcements, Placements)
│       └── DocumentationCenterView.tsx  # Central Knowledge Base & Support manual
│
├── dist/                         # Compiled static assets & bundles directory
│   └── server.cjs                # Compiled production Express server (bundled via esbuild)
│
├── server.ts                     # Express server & API routes
├── package.json                  # Locked dependencies and execution scripts
├── VERSION.json                  # Immutable release version metadata
└── .env.example                  # Template configuration for environment secrets
```

---

## 3. Separation of Concerns & Isolation Guidelines

To maintain clean borders during subsequent development (post-freeze / v1.1+):

1.  **View Layer Isolation**: All client components are kept within `/src/components`. Each major view must occupy its own isolated file. No monolithic consolidation in `App.tsx` is permitted.
2.  **State Hydration**: Client state remains self-contained. Persistent data required across sessions must fetch from server-side APIs proxying to the database.
3.  **Controller Decoupling**: API endpoints in `server.ts` are isolated from database drivers by relying entirely on the Prisma client model interfaces. Direct raw SQL executions are strictly prohibited.

---

## 4. Engineering Verification

The structural layout has been verified to ensure complete compatibility with containerized deployment platforms (e.g. Google Cloud Run).

*   **Ingress Port**: Binds strictly to Port `3000` on host `0.0.0.0` in `server.ts`.
*   **Vite Proxy Mode**: Active and verified in development. Production asset delivery is routed through static path fallbacks.

*Certified by:*  
**Olatech School of Programming Engineering Team**  
**July 1, 2026**
