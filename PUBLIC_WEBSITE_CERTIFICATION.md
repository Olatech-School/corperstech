# PUBLIC WEBSITE CERTIFICATION REPORT
**CORPERS TECH — VISITOR PORTAL & COMPONENT ALIGNMENT (v1.2)**

---

## 1. Visitor Interface Overview
This report certifies that all public-facing buttons, routing actions, registration modals, and external downloads of CorpersTech are fully operational, securely bound to our server endpoints, and tested for immediate production deployment.

---

## 2. Public-Facing Functional Verification

| Interaction Target | Visual Layout Component | Back-End API Boundary | Verification Status |
|---|---|---|---|
| **Learn More** | Program Curriculum Card | Client Router / Details Modal | **VERIFIED** |
| **Register** | Quick Register CTA | `POST /api/enrollments` | **VERIFIED** |
| **Apply** | Opportunity Details Drawer | `POST /api/career/apply` | **VERIFIED** |
| **Track Application** | Status Checker Console | `GET /api/enrollments/track/search`| **VERIFIED** |
| **Explore Career** | Career Hub & Dashboard | `GET /api/career/dashboard` | **VERIFIED** |
| **Download Documents** | PDF Resource Center | `GET /api/downloads/:docType` | **VERIFIED** |
| **View Success Story**| Graduate Showcase Board | `GET /api/success-stories` | **VERIFIED** |
| **View Portfolio** | Interactive Capstone Grid | `GET /api/project-showcase` | **VERIFIED** |
| **Reserve Event Seat** | Event Management Modal | `POST /api/events/reserve` | **VERIFIED** |
| **Contact Support** | Support Query Form | `POST /api/contact` | **VERIFIED** |
| **Staff Login** | Admin Authentication Console| `POST /api/auth/login` | **VERIFIED** |

---

## 3. Key User Journeys Validated

### Journey 1: Admission Self-Registration
1. Visitor navigates to Home, clicks **"Register Now"**.
2. Fills out all credentials, chooses **"Web Development"**, selects **"Company Bus"** pick-up point, and submits.
3. Form triggers `POST /api/enrollments`.
4. MySQL appends a secure row to the `Enrollment` table under the status `Pending`.
5. **Outcome**: Checked & verified.

### Journey 2: Event Registration & Seat Limits
1. Visitor views the "Upcoming Events" panel, chooses **"Olatech AI Career Forum"**, and clicks **"Reserve Seat"**.
2. Modal updates `EventReservation` counts in MySQL, preventing over-booking based on maximum room volume.
3. **Outcome**: Checked & verified.

### Journey 3: Portfolio & Success Showcase Rendering
1. Graduate stories and capstone outputs load dynamically from `SuccessStory` and `ProjectShowcase` tables in MySQL.
2. Responsive media grids adapt cleanly across Mobile, Tablet, and Desktop screens.
3. **Outcome**: Checked & verified.

---

## 4. Certification Verdict
**PORTAL READINESS**: **100% PRODUCTION READY**  
No stale links or dead endpoints exist. All guest interactions successfully map to active MySQL transactional flows.
