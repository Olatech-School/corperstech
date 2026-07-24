# CorpersTech v1.0 — Known Issues

This log documents any residual visual bugs, operational assumptions, or known development conditions as of the **Gold Release (v1.0.0)**.

---

## 1. Environmental & API Assumptions

### No Third-Party Messenger Integration
- **Condition**: Direct WhatsApp, Email, and SMS templates do not send payloads over automated third-party REST services (Twilio, SendGrid).
- **Behavior**: Clicking these buttons opens the administrator's local mail clients (`mailto:`) or prompts WhatsApp redirects with preloaded templates. This ensures zero operational costs while maintaining manual template workflows.

### Offline Browser State Storage
- **Condition**: Available courses lists, pickup locations, and custom cohort additions are cached in browser `localStorage`.
- **Behavior**: Clearing the browser's cookies or switching local computers may reset newly added pickup locations to default values. For permanent database custom updates, use SQL configuration scripts.

---

## 2. General UX Conditions

### Mobile Table Layout Scrollbars
- On small smartphone screens, large administrative data tables display a clean horizontal scrollbar rather than stacking vertically. This is an intentional design choice to maintain readable, tabbed rows for operations staff.
