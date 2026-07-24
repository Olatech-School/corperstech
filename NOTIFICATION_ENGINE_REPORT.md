# CorpersTech Notification Engine Report

## 1. Event-Driven Alert Synthesizer

The platform features an automated **Smart Notification Engine** that processes operational events as they happen.

### Rules Engine Criteria (Module 13):
- **New Applications**: Triggers an alert when `Enrollment` status is `Pending`.
- **Incomplete Materials**: Flags incomplete student fields (e.g. lack of laptop or missing parameters).
- **Transport Overcapacity**: Monitors seating counts; auto-issues warning whenCompany Bus riders exceed 25 passengers.
- **Expiry Approvals**: Flags job opportunities approaching archive status.
- **System Backups**: Automatically logs completion events and sizes when backups run.

## 2. Notification Metadata Schema

Every notification conforms to a rigid schema to enable precise sorting and routing:
- **Priority**: `Critical` | `High` | `Medium` | `Low`
- **Category**: `Admissions` | `Careers` | `Transportation` | `Support` | `Finance` | `Security` | `Maintenance` | `General`
- **Assigned Staff Role**: Ensures only relevant officers handle actions.
- **Created Time**: ISO timestamp.
- **Status**: `Unread` | `Read` | `Dismissed`
