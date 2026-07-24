export const TRANSPORTATION_MANUAL_PART_2 = `# Student Transportation & Logistic Coordination Manual (Part 2)
---

# SECTION 6: BUS ROUTE MANAGEMENT

Effective bus route management is the architectural foundation of the CorpersTech transportation network. Routes must be dynamically structured to serve the highest density of corps member residences while minimizing vehicular time spent in urban traffic congestion.

## 6.1 Creating New Commuter Routes
When a new intake batch commences or spatial analysis reveals an unserved geographic cluster of ≥12 corps members, the Operations Officer must establish a new commuter route corridor.

### Step-by-Step Route Creation Procedure:
1. **Access Route Workspace**: Navigate to \`/admissions/transport\` and click the **"Routes Overview"** tab. Click the primary action button labeled **"+ Create New Route"**.
2. **Define Route Metadata**:
   * **Route Identifier**: Assign a standardized alphanumeric code (e.g., \`RT-LOS-05\` for Lagos Route 5, or \`RT-ABJ-02\` for Abuja Route 2).
   * **Corridor Title**: Enter a clear descriptive title reflecting the major landmarks traversed (e.g., *Surulere / Stadium / Ojuelegba Express*).
   * **Target Campus Hub**: Select the destination training laboratory from the dropdown (\`Mainland Hub - Ikeja\`, \`Island Hub - VI\`, or \`Abuja Hub - CBD\`).
3. **Establish Origin Depot**: Set the starting dispatch point where the assigned shuttle bus overnight parks (e.g., *Oshodi Central Motor Depot*).
4. **Configure Waypoints (Bus Stops)**:
   * Click **"+ Add Waypoint"** to attach sequential student pickup stops.
   * For each stop, define the **Scheduled Pickup Time Window** (e.g., \`06:30 AM - 06:35 AM\`).
   * Set the **Maximum Stop Duration** (standard is exactly **5 minutes** per waypoint; buses must depart promptly at the end of the window even if students are running late).
5. **Assign Vehicle Class**: Select the appropriate vehicle classification based on initial student mapping (Class A Coaster, Class B Hiace, or Class C Transit).
6. **Publish Route**: Click **"Save & Validate Route"**. The system performs a simulated time-distance calculation against Google Maps historical traffic data; if valid, the route status transitions to **"Active - Unassigned"**.

---

## 6.2 Modifying Existing Routes & Waypoint Adjustments
As student demographics shift during the academic semester, existing routes require periodic recalibration to maintain efficiency.

### Waypoint Pruning & Addition Protocol:
* **Underutilized Waypoints**: If weekly attendance telemetry reveals that a specific bus stop has consistently averaged **<2 boarding students** over a 14-day trailing period, the Operations Officer must initiate a **Waypoint Pruning Review**.
  1. Contact the affected students via CRM SMS messaging, proposing relocation to the nearest adjacent waypoint (must be within 1.5km).
  2. If agreed, reassign the students' profiles in the Passenger Roster.
  3. Open the Route Editor, remove the underutilized waypoint, and recalculate downstream arrival timestamps (saving approximately 8–12 minutes of morning transit time).
* **High-Density Split**: If a single waypoint experiences a surge exceeding 20 boarding students, creating dangerous street-level crowding, the Officer must split the stop into two distinct physical waypoints separated by at least 300 meters (e.g., *Maryland Bus Stop North* and *Maryland Tunnel South*), assigning half the student roster to each.

---

## 6.3 Assigning & Calibrating Pickup Points
Every approved pickup point in the CorpersTech ecosystem must undergo strict physical and digital calibration before being activated for student boarding.

### Physical Waypoint Calibration Standards:
1. **Safety & Lighting Audit**: The station must be located at a well-lit, paved commercial junction or official bus shelter. Unpaved highway shoulders, blind curves, or high-crime alleyways are strictly prohibited.
2. **Layby Availability**: There must be sufficient vehicular layby space for a 30-seater Coaster bus to pull completely out of active traffic lanes during boarding.
3. **Landmark Tagging**: The Operations Officer must record an unambiguous visual landmark in the waypoint database (e.g., *"Directly in front of GTBank ATM Gallery, by the pedestrian bridge"*).
4. **GPS Geocoding**: The Officer must capture precise GPS coordinates using the mobile logistics app while physically standing at the curb, ensuring a geolocation precision error of \`<5 meters\`.

\`\`\`
+-----------------------------------------------------------------------------+
|                     WAYPOINT CALIBRATION CHECKLIST                          |
+-----------------------------------------------------------------------------+
| [ ] Verified paved layby with adequate Coaster bus clearance.               |
| [ ] Confirmed street lighting and commercial security presence.             |
| [ ] Recorded precise GPS coordinates (Lat/Long within 5m accuracy).         |
| [ ] Documented unambiguous visual landmark description in CRM.              |
| [ ] Conducted test pull-in with senior corporate driver during morning rush.|
+-----------------------------------------------------------------------------+
\`\`\`

---

## 6.4 Optimizing Routes for Fuel Economy & Travel Time
To control institutional overhead and reduce carbon footprint, the Operations Officer must run the **Corridor Optimization Algorithm** on the first Monday of every month.
* **Left-Turn Minimization**: In right-hand drive traffic systems like Nigeria, left-hand turns across oncoming traffic at major intersections cause severe delays and increase collision risks. The optimization algorithm re-sequences waypoints to maximize right-hand loop turns and arterial expressway usage.
* **Deadhead Mileage Reduction**: "Deadhead" refers to the distance a bus travels empty from its overnight parking depot to the first student pickup point. By reassigning vehicles to overnight depots closest to their Route Origin, the Officer minimizes non-revenue fuel consumption.
* **Speed & Gear Telemetry**: Shuttles equipped with OBD-II telematics devices report average engine RPM and idling duration. The Officer reviews weekly fuel reports; drivers exceeding **15 minutes of stationary idling** during morning pick-ups are mandated to undergo eco-driving retraining.

---

## 6.5 Handling Emergency Route Changes & Road Closures
Metropolitan infrastructure projects, sudden flooding, or political demonstrations can instantly sever established commuter corridors. The Operations Officer must execute immediate tactical diversions.

### Emergency Route Diversion SOP:
1. **Detection**: Traffic status badge on dashboard transitions to \`🛑 CRITICAL BOTTLENECK\`, or an assigned driver calls the emergency dispatch line reporting an impassable road hazard.
2. **Identify Diversion Corridor**: The Officer opens the live GIS traffic map, identifying an approved secondary arterial diversion route that bypasses the bottleneck while re-joining the corridor before the next major waypoint.
3. **Execute System Override**: In the Route Editor, click **"Activate Diversion Protocol"** and select the temporary detour routing.
4. **Automated Commuter Notification**: The CRM instantly blasts an urgent SMS and push notification to all students waiting at downstream waypoints:
   * \`[CORPERSTECH ALERT] Route 01 shuttle is diverting via Mobolaji Bank Anthony Way due to Ikorodu Road blockage. Expected arrival at Maryland stop delayed by 12 mins. Do not leave the station.\`
5. **Driver Navigation Sync**: The diversion routing is pushed directly to the driver's dashboard navigation display, accompanied by voice-prompted turn-by-turn guidance.

---

## 6.6 Managing Route Capacity & Dynamic Overflow Load Balancing
When route passenger demand exceeds the seating capacity of a single deployed bus, the system enforces **Dynamic Load Balancing**.
* **The 95% Threshold Rule**: When a route's assigned student roster reaches **95% of total vehicle capacity** (e.g., 28 students assigned to a 30-seater bus), the system flags the route in amber as \`Near Capacity\`. Further student self-registration on that route is automatically restricted.
* **Overflow Split Deployment**: If demand reaches 130% of capacity (e.g., 39 students on Route 01), the Operations Officer must deploy an **Auxiliary Shuttle**:
  1. Assign a secondary standby vehicle (e.g., an 18-seater Hiace, designated as \`Route 01-B\`).
  2. Split the waypoint assignments: \`Route 01-A (Coaster)\` covers Waypoints 1, 2, and 3; \`Route 01-B (Hiace)\` covers Waypoints 4, 5, and 6.
  3. Re-generate and lock separate manifests for both vehicles, ensuring zero seat duplication.

[Screenshot: Route Capacity Load Balancing Grid & Auxiliary Shuttle Assignment]

---

# SECTION 7: PASSENGER MANAGEMENT

Passenger management governs the lifecycle of student commuters within the transportation database, ensuring exact alignment between academic enrollment and boarding rights.

## 7.1 Assigning Passengers to Active Shuttle Bus Rosters
Upon successful screening in the Admissions module, students opting for corporate shuttle service appear in the **Unassigned Logistics Queue**.

### Manual & Bulk Assignment Procedure:
1. Open the **"Passenger Roster"** tab in \`/admissions/transport\`.
2. Filter the table by \`Status: Unassigned\` and \`Campus: Mainland Hub\`.
3. The system displays recommended route matches based on the student's geocoded address.
4. **Single Assignment**: Click the dropdown in the student's row, select the appropriate route (e.g., \`RT-LOS-01\`), choose their designated pickup stop, and click **"Assign"**.
5. **Bulk Assignment**: Check the selection boxes next to multiple students residing in the same neighborhood cluster (e.g., 8 students living in Surulere), click the bulk action bar **"Assign to Route"**, select \`RT-LOS-03\`, and confirm.
6. The students' profiles instantly transfer to the active route roster, and automated onboarding emails containing their route map and scheduled pickup times are dispatched.

---

## 7.2 Removing & De-authorizing Passengers
To maintain institutional discipline and seat efficiency, students must be promptly removed from shuttle rosters under specific administrative conditions.

### Triggers for Roster De-authorization:
* **Academic Graduation / Completion**: Upon successful completion of the boot camp batch, the system automatically purges graduating cohorts from active transport rosters at midnight on graduation day.
* **Program Withdrawal / Expulsion**: If a student formally withdraws or is dismissed for disciplinary infractions, the Admissions Officer marks their CRM profile as \`Terminated\`. The transportation module instantly revokes their digital boarding badge QR code and removes their seat allocation.
* **Habitual Commuter No-Show**: If a student fails to board their assigned morning shuttle for **5 consecutive academic days** without submitting a valid medical excuse in the LMS, the system generates an administrative flag. The Operations Officer sends a 48-hour warning notice; if unacknowledged, the student is de-authorized, and their seat is reassigned to the waiting list.
* **Switching to Self-Commute**: When a student formally transitions to private commuting, their seat allocation is wiped, and their profile is transferred to the Stipend Verification Table.

---

## 7.3 Handling Pickup Location Change Requests
Corps members frequently experience residential relocations during their service year (e.g., shifting from temporary NYSC orientation camp housing to permanent apartment rentals).

### Location Change SOP:
1. **Student Submission**: The student logs into the student portal and submits a **"Transit Relocation Request"**, providing their new street address and effective relocation date.
2. **Officer Review**: The request appears in the Operations Officer's pending task tray.
3. **Capacity Audit**: The Officer checks if the waypoint nearest the new address has available seating capacity.
   * **If Seats Available**: Click **"Approve Relocation"**. The system updates the student's assigned route, waypoint, and seat number effective from the requested date.
   * **If Route Full**: Click **"Place on Waiting List"**. The student is assigned a temporary overflow jump-seat or directed to self-commute with stipend reimbursement until a permanent seat opens on the target route.

---

## 7.4 Managing Waiting Lists & Automated Queue Promotion
When a popular commuter corridor reaches 100% capacity, subsequent student registrants are placed in the **Route Waiting List Queue**.
* **Queue Priority Algorithm**: The waiting list is ranked strictly by **Registration Timestamp** (First-Come, First-Served), with priority weighting given to physically disabled corps members or pregnant students.
* **Automated Promotion Engine**: When an active passenger is de-authorized or graduates, creating a vacant seat on Route 01, the system automatically promotes the #1 student on the Route 01 Waiting List.
* **Promotion Notification**: The promoted student receives an immediate SMS:
  * \`[CORPERSTECH LOGISTICS] Good news! A seat has opened on Route 01 (Ikeja Express). You have been assigned Seat 18B starting tomorrow morning. View manifest in your portal.\`

---

## 7.5 Attendance Verification & Boarding Reconciliation
Attendance verification is the critical bridge between physical transportation logistics and academic grading in the LMS.

| Boarding Status Badge | System Definition | Academic & Financial Consequence |
| :--- | :--- | :--- |
| \`Boarded\` (Solid Blue) | Student scanned QR badge at morning neighborhood waypoint. | Confirms student is physically en route to campus. |
| \`Checked-In\` (Solid Green) | Shuttle confirmed arrival at campus gate; student disembarked. | Logs formal 100% attendance in academic grading database. |
| \`Missed Bus\` (Solid Red) | Manifest locked; student did not scan badge at waypoint before bus departure. | Student must self-commute; no transportation stipend awarded for the day. |
| \`Excused Absence\` (Amber) | Student submitted approved medical/official leave prior to 06:00 AM. | Seat marked vacant for overflow use; attendance score frozen without penalty. |

---

## 7.6 Handling Absentees, No-Shows, & Late Comers
Punctuality is a core institutional tenet of Olatech School of Programming. Shuttles operate on strict synchronized schedules and **do not wait for late students**.
* **The 0-Minute Wait Policy**: If a waypoint departure is scheduled for **06:45 AM**, the driver and Campus Marshal must close the vehicle doors and depart at 06:45:00 AM exactly.
* **Late Comer Protocol**: If a student arrives at the waypoint at 06:46 AM as the bus is pulling away, they are strictly prohibited from chasing the vehicle or attempting to board in moving traffic. They must arrange private commercial transit to campus at their own expense.
* **No-Show Logging**: At 07:00 AM, the Campus Marshal clicks **"Finalize Waypoint Boarding"** on the mobile scanner. All un-scanned students on the manifest are automatically transitioned to \`Missed Bus\` status, alerting campus academic coordinators that the students will arrive late or are absent.

---

# SECTION 8: SEAT ALLOCATION & SEATING GOVERNANCE

Seating governance eliminates onboarding friction, prevents vehicle overcrowding, and ensures institutional compliance with vehicle safety regulations.

## 8.1 Automatic Seat Allocation Algorithms
When a student is assigned to a commuter route, the CorpersTech CRM executes an algorithmic seating assignment based on vehicle geometry.

\`\`\`
+-----------------------------------------------------------------------------+
|                     TOYOTA COASTER 30-SEATER MATRIX                         |
+-----------------------------------------------------------------------------+
| [DRIVER CABIN]   | [ENGINE HOOD]       | [DOOR / ENTRANCE WAY]              |
|-----------------------------------------------------------------------------|
| Row 1:  [Seat 01A (Med)]  [Seat 01B (Med)]  | AISLE |  [Seat 02A (Med)]  [Seat 02B]|
| Row 2:  [Seat 03A]        [Seat 03B]        | AISLE |  [Seat 04A]        [Seat 04B]|
| Row 3:  [Seat 05A]        [Seat 05B]        | AISLE |  [Seat 06A]        [Seat 06B]|
| Row 4:  [Seat 07A]        [Seat 07B]        | AISLE |  [Seat 08A]        [Seat 08B]|
| Row 5:  [Seat 09A]        [Seat 09B]        | AISLE |  [Seat 10A]        [Seat 10B]|
| Row 6:  [Seat 11A]        [Seat 11B]        | AISLE |  [Seat 12A]        [Seat 12B]|
| Row 7:  [Seat 13A]        [Seat 13B]        | AISLE |  [Seat 14A]        [Seat 14B]|
| Rear:   [Seat 15A (Mrsh)] [Seat 15B (Mrsh)] [Seat 15C] [Seat 15D] [Seat 15E]|
+-----------------------------------------------------------------------------+
\`\`\`

* **Allocation Sequencing**: The algorithm populates seats from front to rear, alternating between window and aisle seats to balance vehicle chassis weight distribution.
* **Gender & Batch Clustering**: To foster professional cohort camaraderie, the algorithm groups students from the same academic learning tracks (e.g., grouping AI Engineering scholars in consecutive rows) while maintaining balanced seating distributions.

---

## 8.2 Manual Seat Allocation & Special Override Procedures
The Operations Officer retains absolute administrative authority to manually override algorithmic seat assignments when operational realities demand human intervention.

### Manual Override SOP:
1. Open the **"Seat Allocation Matrix"** tab and select the target bus layout.
2. Locate the seat requiring adjustment.
3. Click **"Unlock Seating Cell"** (requires entering Admin PIN or Super Admin credentials).
4. Perform drag-and-drop reassignment or click **"Assign Specific Commuter"** to input a student ID.
5. **Mandatory Audit Reason**: The system prompts a mandatory text box: *Enter reason for manual seating override*. Approved reasons include: \`Medical Priority Accommodations\`, \`Disciplinary Separation\`, \`Marshal Supervisory Placement\`, or \`Vehicle Weight Re-balancing\`.
6. Click **"Commit Seating Override"**. An updated digital pass is immediately pushed to the affected students' mobile apps.

---

## 8.3 Seat Numbering Protocols & Physical Tagging Standards
Digital seating assignments are meaningless without physical alignment within the vehicle cabin. CorpersTech enforces strict physical tagging standards across all contracted and owned shuttle vehicles.
* **Physical Tag Specifications**: Every passenger seat must be affixed with a permanent, high-contrast, tamper-proof vinyl label displaying the exact alphanumeric seat identifier (e.g., \`SEAT 04B\`).
* **Placement Standard**: Labels must be positioned centered on the top rear headrest of the seat preceding it (visible to the approaching seated passenger) AND on the upper ceiling trim directly above the seat.
* **Quarterly Audit**: During quarterly fleet reviews, the Operations Officer inspects all vehicles. Damaged, faded, or peeled seat tags must be replaced immediately; a bus cannot be deployed for student transit if seat labels are missing.

---

## 8.4 Reserved Seating for Medical Needs & Mobility Impairments
CorpersTech is committed to inclusive educational access. Shuttles must provide safe, comfortable accommodations for students with medical conditions, advanced pregnancies, or physical disabilities.
* **Medical Priority Verification**: Students requiring priority seating submit medical documentation during enrollment. Upon medical officer verification, their CRM profile is tagged with \`FLAG_MEDICAL_PRIORITY\`.
* **Row 1 Reservation Lock**: The seating algorithm permanently blocks **Row 1 (Seats 01A, 01B, 02A, 02B)** from general student allocation, reserving them exclusively for priority profiles.
* **Mobility Storage**: For students utilizing crutches or folding wheelchairs, drivers are mandated to securely stow mobility aids in the lower luggage compartments or dedicated secure cabin brackets prior to student boarding.

---

## 8.5 Real-Time Capacity Monitoring & Overcrowding Prevention
Overcrowding a shuttle bus is a severe safety violation under Nigerian federal traffic laws and CorpersTech institutional governance.
* **Zero Standee Rule**: **No student is permitted to stand in the aisle of a moving CorpersTech shuttle bus.** Every passenger onboard must occupy a designated, seatbelt-equipped passenger seat.
* **Digital Capacity Lock**: The mobile scanning application physically blocks the Campus Marshal from checking in additional students once the scanned count reaches 100% of vehicle seating capacity. If a 30-seater bus records 30 verified scans, the scanner rejects the 31st scan with an override-proof error: \`🛑 BUS FULL - ZERO STANDING CAPACITY\`.
* **Driver Liability**: Any corporate driver observed operating a bus with standing passengers or passengers sitting on floor aisles faces immediate contract termination and forfeiture of monthly performance bonuses.

---

## 8.6 Overflow Procedures & Emergency Standby Shuttle Deployment
In rare instances where sudden route surges occur (e.g., when multiple self-commuting students experience vehicle breakdowns and converge on a corporate waypoint), the Operations Officer must execute **Overflow Logistics**.
* **Standby Fleet Reserve**: CorpersTech maintains a **10% standby vehicle reserve** at all times (typically two 14-seater executive vans stationed at central motor depots).
* **Overflow Dispatch SOP**:
  1. Campus Marshal at Maryland Waypoint reports 8 stranded students exceeding vehicle seating capacity at 06:50 AM.
  2. Marshal clicks **"Request Emergency Overflow Shuttle"** on the mobile dashboard app.
  3. The alert flashes red on the Operations Officer's command workbench.
  4. The Officer dispatches Standby Van 01 (\`LND-882-EE\`), transmitting GPS coordinates of the Maryland Waypoint directly to the standby driver.
  5. The standby van arrives within 15 minutes, extracts the stranded students, and transports them to campus via expressway routing to ensure they arrive before the 09:00 AM lecture lock.

---

# SECTION 9: DRIVER & VEHICLE MANAGEMENT

The safety and reliability of the transportation program depend directly on the professional competence of our driving fleet and the mechanical excellence of our vehicles.

## 9.1 Driver Assignment & Background Screening Requirements
No individual may operate a vehicle transporting CorpersTech corps members without clearing our exhaustive 5-stage background vetting protocol.

\`\`\`
+-----------------------------------------------------------------------------+
|                 DRIVER BACKGROUND VETTING PROTOCOL                          |
+-----------------------------------------------------------------------------+
| STAGE 1: Identity & Legal Verification                                      |
|          > Valid National Driver's License (Commercial Class G/E).          |
|          > National Identification Number (NIN) & BVN biometric match.      |
|-----------------------------------------------------------------------------|
| STAGE 2: Security & Criminal Background Screening                           |
|          > Nigerian Police Force (NPF) Criminal Record Clearance Certificate|
|          > NDLEA Substance Abuse & Narcotics Laboratory Screening.          |
|-----------------------------------------------------------------------------|
| STAGE 3: Driving Record & Traffic Infraction Audit                          |
|          > FRSC (Federal Road Safety Corps) Accident History Check.         |
|          > Zero DUI or reckless driving convictions over trailing 10 years. |
|-----------------------------------------------------------------------------|
| STAGE 4: Technical & Defensive Driving Assessment                           |
|          > Mandatory 3-day practical road assessment with Chief Driver.     |
|          > Night driving, rain driving, and emergency braking evaluations.  |
|-----------------------------------------------------------------------------|
| STAGE 5: Medical & Psychological Fitness Clearance                          |
|          > Comprehensive vision screening (depth perception & color test).  |
|          > Cardiovascular fitness and psychological stress evaluation.      |
+-----------------------------------------------------------------------------+
\`\`\`

---

## 9.2 Vehicle Records, Insurance Vetting, & Roadworthiness Certificates
Every vehicle in the active fleet must maintain a pristine documentation binder stored both physically in the glove compartment and digitally in the \`/operations/transport\` database.
* **Mandatory Digital Documents**:
  1. **Vehicle Registration Booklet**: Proof of legal ownership or corporate lease registration.
  2. **Comprehensive Motor Insurance Policy**: Must include unlimited third-party personal injury liability and passenger indemnity coverage.
  3. **Roadworthiness Certificate**: Issued by the State Vehicle Inspection Service (VIS), subject to mandatory semi-annual physical testing.
  4. **Hackney Permit & Commercial Passenger License**: Validating legal commercial transport operations across municipal jurisdictions.
* **Automated Expiration Lockout**: If any mandatory certificate expires without a renewed digital copy uploaded to the CRM, the system changes the vehicle status to \`Decommissioned - Compliance Lock\`, preventing its assignment to any daily route manifest.

---

## 9.3 Comprehensive Vehicle Inspections (Pre-Trip & Post-Trip)
To guarantee zero en-route mechanical failures, drivers and marshals must enforce strict inspection routines.

### Pre-Trip Inspection SOP (Executed Daily between 05:30 AM - 05:45 AM):
Before engine ignition, the driver must complete the digital **Pre-Trip Checklist** on their mobile terminal.
* **Exterior & Tires**: Inspect all 6 tires (for Coasters) or 4 tires (for Hiace) for proper inflation PSI, tread depth (must be ≥3mm), and sidewall cuts. Check lug nut tightness.
* **Under-Hood Fluids**: Verify engine oil level on dipstick, radiator coolant level, brake fluid reservoir, and power steering fluid.
* **Lighting & Electrical**: Test left/right turn signals, hazard flashers, high/low headlights, brake lights, and reverse backup beepers.
* **Cabin & Safety Gear**: Verify operation of all seatbelts, test emergency door exit latches, confirm presence of fully charged 5kg dry-chemical Fire Extinguisher, and check visual expiration date on standardized First Aid Kit.
* **Submission**: Driver digitally signs checklist. If any item fails (e.g., brake light out), the system alerts the Operations Officer instantly to deploy a backup vehicle.

### Post-Trip Inspection SOP (Executed Daily at 06:30 PM upon Depot Return):
* Driver inspects cabin for left-behind student items (laptops, phones, notebooks), logging any recovered items in the Lost & Found registry.
* Conducts visual check for interior seat damage or vandalism.
* Records final evening odometer reading and fuel gauge percentage.

---

## 9.4 Maintenance Tracking & Preventive Service Scheduling
CorpersTech operates a proactive, mileage-based **Preventive Maintenance Schedule** governed by the CRM vehicle tracker.

| Service Interval | Maintenance Scope | Mandatory Mechanical Actions |
| :--- | :--- | :--- |
| **Every 5,000 KM** (Minor Service) | Engine Lubrication & Safety Check | Drain and replace engine oil; replace oil filter; inspect air filter; top up windshield washer fluid; inspect brake pad thickness and tire wear balance. |
| **Every 15,000 KM** (Intermediate Service) | Fuel Systems & Alignment | Replace primary and secondary fuel filters; clean throttle body; rotate tires and perform 4-wheel computerized alignment; flush and bleed brake fluid lines. |
| **Every 30,000 KM** (Major Overhaul) | Transmission & Suspension | Replace transmission fluid and filter; flush radiator cooling system; inspect tie-rod ends, ball joints, and shock absorbers; test alternator charging voltage and battery load. |

> **TIP: PREVENTIVE GROUNDING**
> When a vehicle reaches within 200 kilometers of its scheduled maintenance interval, the dashboard automatically highlights the vehicle card in blue (\`Service Due\`). The Operations Officer must schedule the bus for weekend workshop servicing to avoid weekday route disruption.

---

## 9.5 Fuel Monitoring, Mileage Logs, & Expense Reconciliation
Fuel management is a critical financial control point requiring daily reconciliation to prevent fuel skimming or administrative wastage.
* **Digital Fuel Log**: Every fuel refill must be conducted at officially contracted corporate filling stations (e.g., TotalEnergies or NNPC Mega Stations) using corporate fuel cards.
* **Refill SOP**:
  1. Driver inputs current odometer reading into station terminal before fueling.
  2. Fuel station pumps exact liters to fill tank nozzle cutoff.
  3. Driver captures a digital photograph of the pump meter display and the printed POS receipt using the logistics mobile app.
* **Automated Audit**: The CRM calculates the vehicle's actual fuel efficiency (\`Kilometers Traveled ÷ Liters Consumed\`). If a Coaster bus drops below **4.2 km/liter** (indicating engine inefficiencies or potential fuel siphon theft), the system triggers an automatic **Fuel Variance Audit** for administrative investigation.

---

## 9.6 Emergency Contacts & Rapid Escalation Directory
Every corporate vehicle must carry a laminated physical dashboard card and digital app directory containing emergency command numbers.

\`\`\`
+-----------------------------------------------------------------------------+
|                 EMERGENCY ESCALATION CONTACT DIRECTORY                      |
+-----------------------------------------------------------------------------+
| PRIMARY COMMAND & CONTROL:                                                  |
| > CorpersTech Logistics Command Center (24/7):   0800-CORPERS (0800-267-7377)|
| > Operations Officer (Logistics Lead Mobile):    0812-345-6789              |
| > Super Admin / Director of Operations:          0803-000-1122              |
|-----------------------------------------------------------------------------|
| FEDERAL & STATE EMERGENCY SERVICES:                                         |
| > Lagos State Emergency Management Agency (LASEMA): 112 or 767              |
| > Federal Road Safety Corps (FRSC Command):         122                     |
| > Nigerian Police Force (Rapid Response Squad - RRS): 0805-555-5555         |
| > State Ambulance Service (LASAMBUS):               0800-000-2628           |
|-----------------------------------------------------------------------------|
| CONTRACTED RECOVERY & MEDICAL PARTNERS:                                     |
| > Corporate Heavy Towing & Rescue Services:       0802-999-8877             |
| > St. Nicholas Hospital (Emergency Trauma Unit):  01-271-4400               |
| > Reddington Hospital (Victoria Island Command):  01-271-5341               |
+-----------------------------------------------------------------------------+
\`\`\`

---
*End of Section 6 to Section 9. Proceed to Part 3 for Daily Operations SOPs, Emergency Procedures, Reports & Analytics, and Comprehensive Troubleshooting Scenarios.*
`;
