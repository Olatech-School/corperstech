# CorpersTech Documentation Center Report

## 1. High-Level Architecture & Technical Specification

The **CorpersTech Documentation & Knowledge Center** is designed with a full-stack architecture that seamlessly integrates with the existing React + Vite + Express + Prisma + MySQL database stack of the platform.

### Architectural Diagram
```
[Client-side SPA (React)] ──(REST API endpoints)──> [Backend Server (Express)] 
                                                             │
                                                             ▼
                                                    [Prisma ORM Client]
                                                             │
                                                             ▼
                                                    [MySQL Prod Database]
                                                    (Resilience: JSON Fallback)
```

### Server-Side Data Model Boundaries
The schema implements a highly organized relationship mapping for operations logs, ratings, version history tracking, bookmarks, reading history tracking, and search telemetry keywords.

- **StaffDocument**: High-level manual registry metadata and content payload.
- **StaffDocumentFeedback**: Detailed rating feedback, helpful flags, outdated/update requested states, and custom recommendations suggestions.
- **StaffDocumentBookmark**: Bookmark records tracking which active staff members have pinned particular guides.
- **StaffDocumentReading**: Reading telemetry log recording when staff read a guide and tracking overall completion trends.
- **StaffDocumentHistory**: Minor/major version changes history linked to individual documents.
- **StaffDocumentSearchKeyword**: Telemetry keyword tracker for indexing queries to power analytics.

---

## 2. Component Implementation Details

The frontend of the center is built within `/src/components/DocumentationCenterView.tsx` utilizing modern Tailwind CSS utilities for responsive layout blocks, and Framer Motion (`motion/react`) for smooth micro-animations during reader switches.

### Component Design Layout Structure
- **Left Navigation Rail**: Contains a responsive search bar, active categories filter dropdown, list of matching guides, and quick-access reading history.
- **Center Document Frame**: Displays the chosen operational manual, estimated reading time, difficulty indicators, inline markdown formatting, tag registry, change history, and the interactive feedback logging form.
- **Right Context Sidebar**: Houses download targets, role-specific recommended reading lists, and quick operational web resources.

### Admin/Super-Admin Panels
When logged in as a Super Admin, the component mounts:
1. **Manage Guides Tab**: A complete CRUD interface featuring tabular list views, state toggle switches (Draft vs Published vs Archived), and the documentation editor with a split-view Live Preview mode.
2. **Analytics Dashboard**: Real-time charts rendered by Recharts illustrating view distributions, search trends, and quality alerts.
