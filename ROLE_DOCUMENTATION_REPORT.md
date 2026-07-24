# CorpersTech Role Documentation Report

## 1. Role-Based Visibility Matrix

To ensure security and keep workspaces focused, operational handbooks are filtered by the active staff member's role:

| Staff Role | Visible Manual Categories | Default Recommended Guides |
| :--- | :--- | :--- |
| **Super Admin** | All 16 Categories (Full Access) | Platform Maintenance, Analytics, Security |
| **Admissions Officer** | Admissions, Getting Started, FAQs, Reports | Admissions CRM SOPs, Roster Verification |
| **Career Officer** | Career Launch, Recruitment AI, FAQs | CV Auditing, AI Publishing Guide |
| **Operations Officer** | Transportation, Orientation, Troubleshooting | Commute Routings, Orientation Matrix |
| **Finance Officer** | Finance Operations, Release Notes, FAQs | Installments SOPs, Verification SOPs |
| **Support Officer** | Troubleshooting, Support Operations, Getting Started | SLA Ticket SOPs, FAQ manuals |

### Security Checks
Both the backend (`/api/documents?role=...`) and frontend views enforce role filters:
1. The backend filters standard listings by mapping the query parameters to `visibilityByRole` database fields.
2. The frontend restricts tabs (such as Analytics and Management) to `Super Admin` only.

---

## 2. Bookmarks & Personalization

Every staff member can customize their learning hub:
- **Bookmark State**: Selecting the ribbon bookmarks a guide to `/api/documents/:id/bookmark` under their staff profile.
- **Recent History Tracker**: Opening any document triggers a reading event recorded in `StaffDocumentReading`.
- **Favorites Sidebar**: Recently opened manuals are saved to the local storage and database so staff can resume reading on any device.
