# PERSONALIZATION & COACHING SUITE REPORT — CORPERS TECH (v1.1)

This report outlines the implementation of the **Personalized Coaching and Profile Suite** (Modules 1, 3, 4, 6, 7) for CorpersTech.

---

## 1. Dynamic Program-Tailored Roadmap (Module 3)
Instead of a static checklist, the roadmap engine automatically tailors learning and professional milestones based on the user's enrolled stream (e.g. Web Development, Cybersecurity):
* **Visual Milestones**: Renders past completed phases, active current tasks (e.g. Capstone Projects), and future corporate placement rounds.
* **Stream-Customized Guidelines**: Integrates specialized text and project schedules matched directly to the student's training stream.

---

## 2. Watchlist & Deadline Monitor (Module 4)
The saved watchlist allows corps members to safeguard, monitor, and prioritize placement targets:
* **Interactive Bookmarks**: Toggle bookmarks directly from matching cards, persisting relationship entries in the `SavedOpportunity` table.
* **Adaptive Expiry Reminders**: Triggers warnings when job application deadlines are within 10 days, alerting the user to prepare final application drafts.

---

## 3. Real-Time Notification Dispatcher (Module 7)
An event-driven user notification system monitors profile and matching events:
* **Event Scenarios**: Dispatch notifications for high-compatibility matches, watchlist deadlines, and scholarship entries.
* **Read-Status Tracker**: Allows members to audit and dismiss messages with a single click.

---

## 4. Olatech AI CV Auditor (Module 6)
An interactive AI-powered resume review assistant:
* **ATS Diagnostics**: Evaluates plain-text resumes and returns a numeric Readiness Score (15–100).
* **Structural Bullet Points**: Leverages Gemini to analyze professional summaries, technical skill completeness, and github/linkedin links, outputting professional improvements.
