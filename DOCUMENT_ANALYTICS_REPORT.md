# CorpersTech Document Analytics Report

## 1. Super Admin Analytics Dashboard

Super Admins can access a dedicated analytics engine in the Command Center. The dashboard displays critical database telemetry compiled via `/api/documents/analytics/summary`:

- **Most Viewed Manuals**: A bar chart (using Recharts) of top-read guides.
- **Under-utilized Manuals**: Identifies guides with very low view counts.
- **Search Terms Cloud**: Displays search metrics to show what staff are looking for.
- **Quality Alert Panel**: Automatically lists any guide whose average rating falls below 4.0/5.0, or has outdated report flags.

---

## 2. Interactive Feedback & Outdated Alerts

Every guide includes an interactive rating component:
- **Was this helpful?**: binary thumbs up/down trackers.
- **5-Star Rating**: A rating out of 5 stars.
- **Detailed Suggestions**: Free-text feedback for improvements.
- **Outdated / Update Requested Flags**: Toggle flags that immediately alert Super Admins.

---

## 3. Version Control & Revisions History

Each document in the database supports strict version control:
- **Version Code**: Minor/major release strings (e.g. `1.1.0`).
- **Revision History log**: Every update generates a `StaffDocumentHistory` record containing edit notes, timestamp, and author name. This ensures full operational accountability.
