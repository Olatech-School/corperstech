/**
 * EventsRepository.ts
 * 
 * Production-ready Event Registration, Seat Reservation, Check-in, Waiting List,
 * and Analytics engine for CorpersTech Career Launch & Command Center.
 * 
 * Connects to MySQL/Prisma in live environments and automatically utilizes
 * an immutable JSON fallback queue in container edge/preview environments.
 */

import fs from 'fs';
import path from 'path';
import { getPrisma } from '../db.ts';

const FALLBACK_FILE = path.join(process.cwd(), 'events-fallback-db.json');

// Initial seed data for fallback database
function loadFallbackData() {
  if (fs.existsSync(FALLBACK_FILE)) {
    try {
      const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading events fallback file, re-initializing:', err);
    }
  }

  const initialData = {
    events: [
      {
        id: 1,
        title: "Mandatory Stream Technical Briefing",
        type: "Orientation",
        date: "2026-07-08",
        time: "10:00 AM UTC",
        location: "Main Auditorium / Zoom Live",
        totalSeats: 500,
        reservedSeats: 4,
        registrationDeadline: "2026-07-07",
        description: "Introductory roadmap alignment meeting detailing curriculum models, stream schedules, attendance sheets logging, and corporate commute logistics.",
        status: "Published",
        createdAt: new Date("2026-06-15T09:00:00Z").toISOString(),
        updatedAt: new Date("2026-06-15T09:00:00Z").toISOString()
      },
      {
        id: 2,
        title: "Interactive CV Clinic & ATS Optimization",
        type: "CV Clinic",
        date: "2026-07-12",
        time: "02:00 PM UTC",
        location: "Virtual Workshop",
        totalSeats: 150,
        reservedSeats: 3,
        registrationDeadline: "2026-07-11",
        description: "Live review panel where professional Olatech CV branding specialists restructure resumes to satisfy automated screening filters.",
        status: "Published",
        createdAt: new Date("2026-06-18T11:30:00Z").toISOString(),
        updatedAt: new Date("2026-06-18T11:30:00Z").toISOString()
      },
      {
        id: 3,
        title: "National Tech Hackathon Launch Day",
        type: "Hackathon",
        date: "2026-07-25",
        time: "09:00 AM UTC",
        location: "Sterling Bank Hub / Virtual",
        totalSeats: 80,
        reservedSeats: 2,
        registrationDeadline: "2026-07-23",
        description: "Kickoff session of our annual prototype build challenge. Group structures will align to formulate solutions for local payment frameworks.",
        status: "Published",
        createdAt: new Date("2026-06-20T14:15:00Z").toISOString(),
        updatedAt: new Date("2026-06-20T14:15:00Z").toISOString()
      },
      {
        id: 4,
        title: "Careers Day & Recruiter Meetups",
        type: "Career Day",
        date: "2026-08-15",
        time: "11:00 AM UTC",
        location: "Olatech School Campus, Lagos",
        totalSeats: 300,
        reservedSeats: 3,
        registrationDeadline: "2026-08-13",
        description: "Direct offline speed dating session with over 15 recruitment officers from active fintechs, networks, and agencies.",
        status: "Published",
        createdAt: new Date("2026-06-22T08:00:00Z").toISOString(),
        updatedAt: new Date("2026-06-22T08:00:00Z").toISOString()
      }
    ],
    reservations: [
      {
        id: 1,
        reservationId: "RES-2026-1001",
        eventId: 1,
        fullName: "Samuel Okon",
        email: "samuel.okon@example.com",
        phone: "08123456789",
        course: "Software Engineering",
        nyscState: "Lagos",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1001",
        attendanceType: "Physical",
        transportation: "Company Bus",
        pickupLocation: "Lagos Campus Gate - Ikeja",
        status: "Confirmed",
        attendanceStatus: "Present",
        createdAt: new Date("2026-06-25T10:00:00Z").toISOString(),
        updatedAt: new Date("2026-06-25T10:00:00Z").toISOString()
      },
      {
        id: 2,
        reservationId: "RES-2026-1002",
        eventId: 1,
        fullName: "Amaka Eze",
        email: "amaka.eze@example.com",
        phone: "08034567890",
        course: "UI/UX Product Design",
        nyscState: "FCT Abuja",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1002",
        attendanceType: "Virtual",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Present",
        createdAt: new Date("2026-06-26T11:20:00Z").toISOString(),
        updatedAt: new Date("2026-06-26T11:20:00Z").toISOString()
      },
      {
        id: 3,
        reservationId: "RES-2026-1003",
        eventId: 1,
        fullName: "Tunde Bakare",
        email: "tunde.b@example.com",
        phone: "08056789012",
        course: "Cyber Security & SOC",
        nyscState: "Rivers",
        nyscBatch: "2026 Batch A Stream 2",
        referenceNumber: "CT-NYSC-1003",
        attendanceType: "Physical",
        transportation: "Company Bus",
        pickupLocation: "Surulere Stadium Hub",
        status: "Confirmed",
        attendanceStatus: "Late Arrival",
        createdAt: new Date("2026-06-27T09:15:00Z").toISOString(),
        updatedAt: new Date("2026-06-27T09:15:00Z").toISOString()
      },
      {
        id: 4,
        reservationId: "RES-2026-1004",
        eventId: 1,
        fullName: "Chinedu Okafor",
        email: "chinedu.o@example.com",
        phone: "08189012345",
        course: "Data Science & AI",
        nyscState: "Lagos",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1004",
        attendanceType: "Physical",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Absent",
        createdAt: new Date("2026-06-28T14:30:00Z").toISOString(),
        updatedAt: new Date("2026-06-28T14:30:00Z").toISOString()
      },
      {
        id: 5,
        reservationId: "RES-2026-1005",
        eventId: 2,
        fullName: "Samuel Okon",
        email: "samuel.okon@example.com",
        phone: "08123456789",
        course: "Software Engineering",
        nyscState: "Lagos",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1001",
        attendanceType: "Virtual",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-06-29T10:00:00Z").toISOString(),
        updatedAt: new Date("2026-06-29T10:00:00Z").toISOString()
      },
      {
        id: 6,
        reservationId: "RES-2026-1006",
        eventId: 2,
        fullName: "Blessing Adeyemi",
        email: "blessing.a@example.com",
        phone: "07067890123",
        course: "Data Science & AI",
        nyscState: "Oyo",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1005",
        attendanceType: "Virtual",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-06-29T15:10:00Z").toISOString(),
        updatedAt: new Date("2026-06-29T15:10:00Z").toISOString()
      },
      {
        id: 7,
        reservationId: "RES-2026-1007",
        eventId: 2,
        fullName: "Zainab Usman",
        email: "zainab.u@example.com",
        phone: "08090123456",
        course: "Video Editing & Animation",
        nyscState: "Kano",
        nyscBatch: "2026 Batch A Stream 2",
        referenceNumber: "CT-NYSC-1006",
        attendanceType: "Virtual",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-06-30T16:00:00Z").toISOString(),
        updatedAt: new Date("2026-06-30T16:00:00Z").toISOString()
      },
      {
        id: 8,
        reservationId: "RES-2026-1008",
        eventId: 3,
        fullName: "Samuel Okon",
        email: "samuel.okon@example.com",
        phone: "08123456789",
        course: "Software Engineering",
        nyscState: "Lagos",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1001",
        attendanceType: "Physical",
        transportation: "Company Bus",
        pickupLocation: "Lagos Campus Gate - Ikeja",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-07-01T09:00:00Z").toISOString(),
        updatedAt: new Date("2026-07-01T09:00:00Z").toISOString()
      },
      {
        id: 9,
        reservationId: "RES-2026-1009",
        eventId: 3,
        fullName: "Emeka Nwosu",
        email: "emeka.n@example.com",
        phone: "08111223344",
        course: "Cyber Security & SOC",
        nyscState: "Lagos",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1007",
        attendanceType: "Physical",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-07-01T12:00:00Z").toISOString(),
        updatedAt: new Date("2026-07-01T12:00:00Z").toISOString()
      },
      {
        id: 10,
        reservationId: "RES-2026-1010",
        eventId: 4,
        fullName: "Amaka Eze",
        email: "amaka.eze@example.com",
        phone: "08034567890",
        course: "UI/UX Product Design",
        nyscState: "FCT Abuja",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1002",
        attendanceType: "Physical",
        transportation: "Company Bus",
        pickupLocation: "Abuja Central Secretariat",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-07-02T10:00:00Z").toISOString(),
        updatedAt: new Date("2026-07-02T10:00:00Z").toISOString()
      },
      {
        id: 11,
        reservationId: "RES-2026-1011",
        eventId: 4,
        fullName: "Tunde Bakare",
        email: "tunde.b@example.com",
        phone: "08056789012",
        course: "Cyber Security & SOC",
        nyscState: "Rivers",
        nyscBatch: "2026 Batch A Stream 2",
        referenceNumber: "CT-NYSC-1003",
        attendanceType: "Physical",
        transportation: "Company Bus",
        pickupLocation: "Port Harcourt GRA Hub",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-07-02T14:00:00Z").toISOString(),
        updatedAt: new Date("2026-07-02T14:00:00Z").toISOString()
      },
      {
        id: 12,
        reservationId: "RES-2026-1012",
        eventId: 4,
        fullName: "Blessing Adeyemi",
        email: "blessing.a@example.com",
        phone: "07067890123",
        course: "Data Science & AI",
        nyscState: "Oyo",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1005",
        attendanceType: "Physical",
        transportation: "Personal Transportation",
        pickupLocation: "",
        status: "Confirmed",
        attendanceStatus: "Pending",
        createdAt: new Date("2026-07-03T09:30:00Z").toISOString(),
        updatedAt: new Date("2026-07-03T09:30:00Z").toISOString()
      }
    ],
    waitingList: [
      {
        id: 1,
        eventId: 1,
        fullName: "Ibrahim Sani",
        email: "ibrahim.s@example.com",
        phone: "08012349876",
        course: "Software Engineering",
        nyscState: "Kano",
        nyscBatch: "2026 Batch A Stream 1",
        referenceNumber: "CT-NYSC-1008",
        attendanceType: "Virtual",
        transportation: "Personal Transportation",
        pickupLocation: "",
        position: 1,
        status: "Waiting",
        createdAt: new Date("2026-07-03T11:00:00Z").toISOString(),
        updatedAt: new Date("2026-07-03T11:00:00Z").toISOString()
      }
    ],
    attendances: [
      {
        id: 1,
        eventId: 1,
        reservationId: 1,
        attendeeEmail: "samuel.okon@example.com",
        attendeeName: "Samuel Okon",
        attendanceStatus: "Present",
        checkInTime: new Date("2026-07-08T09:45:00Z").toISOString(),
        markedBy: "Staff Admin",
        notes: "Checked in at Main Auditorium gate."
      },
      {
        id: 2,
        eventId: 1,
        reservationId: 2,
        attendeeEmail: "amaka.eze@example.com",
        attendeeName: "Amaka Eze",
        attendanceStatus: "Present",
        checkInTime: new Date("2026-07-08T09:50:00Z").toISOString(),
        markedBy: "Staff Admin",
        notes: "Joined Zoom Live session."
      },
      {
        id: 3,
        eventId: 1,
        reservationId: 3,
        attendeeEmail: "tunde.b@example.com",
        attendeeName: "Tunde Bakare",
        attendanceStatus: "Late Arrival",
        checkInTime: new Date("2026-07-08T10:25:00Z").toISOString(),
        markedBy: "Staff Admin",
        notes: "Bus delayed in Surulere transit."
      },
      {
        id: 4,
        eventId: 1,
        reservationId: 4,
        attendeeEmail: "chinedu.o@example.com",
        attendeeName: "Chinedu Okafor",
        attendanceStatus: "Absent",
        checkInTime: new Date("2026-07-08T11:30:00Z").toISOString(),
        markedBy: "Staff Admin",
        notes: "No check-in recorded."
      }
    ]
  };

  saveFallbackData(initialData);
  return initialData;
}

function saveFallbackData(data: any): void {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write events fallback database:', err);
  }
}

export class EventsRepository {
  /**
   * Helper to record audit actions in both Prisma and fallback
   */
  static async logAudit(action: string, details: string, userEmail: string = "system@corpers.tech"): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.auditLog.create({
        data: {
          user: userEmail,
          userRole: "Staff / Student",
          eventType: "Event System Action",
          description: `${action} — ${details}`,
          status: "Success"
        }
      });
      if ((prisma as any).staffAuditLog) {
        await (prisma as any).staffAuditLog.create({
          data: {
            staffId: "SYS-EVT-001",
            staffEmail: userEmail,
            action,
            module: "Career Launch Events",
            details,
            status: "Success"
          }
        }).catch(() => {});
      }
    } catch (err) {
      // Offline/fallback audit log silently ignored or logged to console
      console.log(`[AUDIT LOG]: ${action} (${details}) by ${userEmail}`);
    }
  }

  /**
   * Helper to trigger student notifications
   */
  static async triggerNotification(userEmail: string, title: string, message: string, type: string = "event_reminder"): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.userNotification.create({
        data: {
          userEmail: userEmail.toLowerCase(),
          title,
          message,
          type,
          isRead: false
        }
      });
    } catch (err) {
      // In fallback mode, store in localStorage or silent
      console.log(`[NOTIFICATION to ${userEmail}]: ${title} - ${message}`);
    }
  }

  /**
   * 1. GET ALL EVENTS (with reservation stats & user reservation status)
   */
  static async getAllEvents(userEmail?: string): Promise<any[]> {
    try {
      const prisma = getPrisma();
      const events = await prisma.upcomingEvent.findMany({
        orderBy: { date: 'asc' },
        include: {
          reservations: true,
          waitingList: true,
          attendances: true
        }
      });

      return events.map(ev => {
        const remainingSeats = Math.max(0, ev.totalSeats - ev.reservedSeats);
        let userHasReserved = false;
        let userReservation: any = null;
        let isOnWaitingList = false;
        let waitingListPosition = 0;

        if (userEmail && userEmail.trim()) {
          const cleanEmail = userEmail.trim().toLowerCase();
          const foundRes = ev.reservations.find(r => r.email.toLowerCase() === cleanEmail && r.status !== 'Cancelled');
          if (foundRes) {
            userHasReserved = true;
            userReservation = foundRes;
          } else {
            const foundWait = ev.waitingList.find(w => w.email.toLowerCase() === cleanEmail && w.status === 'Waiting');
            if (foundWait) {
              isOnWaitingList = true;
              waitingListPosition = foundWait.position;
              userReservation = { ...foundWait, isWaitingList: true };
            }
          }
        }

        return {
          ...ev,
          remainingSeats,
          userHasReserved,
          isOnWaitingList,
          waitingListPosition,
          userReservation,
          totalReservationsCount: ev.reservations.filter(r => r.status === 'Confirmed').length,
          totalWaitingCount: ev.waitingList.filter(w => w.status === 'Waiting').length
        };
      });
    } catch (err) {
      const db = loadFallbackData();
      const events = db.events || [];
      const resList = db.reservations || [];
      const waitList = db.waitingList || [];
      const attList = db.attendances || [];

      return events.map((ev: any) => {
        const evRes = resList.filter((r: any) => r.eventId === ev.id && r.status === 'Confirmed');
        const evWait = waitList.filter((w: any) => w.eventId === ev.id && w.status === 'Waiting');
        const evAtt = attList.filter((a: any) => a.eventId === ev.id);
        const remainingSeats = Math.max(0, ev.totalSeats - evRes.length);

        let userHasReserved = false;
        let userReservation: any = null;
        let isOnWaitingList = false;
        let waitingListPosition = 0;

        if (userEmail && userEmail.trim()) {
          const cleanEmail = userEmail.trim().toLowerCase();
          const foundRes = evRes.find((r: any) => r.email.toLowerCase() === cleanEmail);
          if (foundRes) {
            userHasReserved = true;
            userReservation = foundRes;
          } else {
            const foundWait = evWait.find((w: any) => w.email.toLowerCase() === cleanEmail);
            if (foundWait) {
              isOnWaitingList = true;
              waitingListPosition = foundWait.position;
              userReservation = { ...foundWait, isWaitingList: true };
            }
          }
        }

        return {
          ...ev,
          reservedSeats: evRes.length,
          remainingSeats,
          userHasReserved,
          isOnWaitingList,
          waitingListPosition,
          userReservation,
          reservations: evRes,
          waitingList: evWait,
          attendances: evAtt,
          totalReservationsCount: evRes.length,
          totalWaitingCount: evWait.length
        };
      });
    }
  }

  /**
   * 2. GET EVENT BY ID
   */
  static async getEventById(id: number, userEmail?: string): Promise<any> {
    const events = await this.getAllEvents(userEmail);
    const ev = events.find(e => e.id === id || String(e.id) === String(id));
    if (!ev) throw new Error("Event not found");
    return ev;
  }

  /**
   * 3. CREATE EVENT
   */
  static async createEvent(data: any, staffEmail: string = "admin@corpers.tech"): Promise<any> {
    try {
      const prisma = getPrisma();
      const newEvent = await prisma.upcomingEvent.create({
        data: {
          title: data.title,
          type: data.type || "Workshop",
          date: data.date,
          time: data.time,
          location: data.location,
          totalSeats: parseInt(data.totalSeats, 10) || 100,
          reservedSeats: 0,
          registrationDeadline: data.registrationDeadline || data.date,
          description: data.description || "",
          status: data.status || "Published"
        }
      });
      await this.logAudit("Created Upcoming Event", `Title: ${newEvent.title}, Seats: ${newEvent.totalSeats}`, staffEmail);
      return newEvent;
    } catch (err) {
      const db = loadFallbackData();
      const nextId = db.events.reduce((m: number, e: any) => e.id > m ? e.id : m, 0) + 1;
      const newEvent = {
        id: nextId,
        title: data.title,
        type: data.type || "Workshop",
        date: data.date,
        time: data.time,
        location: data.location,
        totalSeats: parseInt(data.totalSeats, 10) || 100,
        reservedSeats: 0,
        registrationDeadline: data.registrationDeadline || data.date,
        description: data.description || "",
        status: data.status || "Published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.events.push(newEvent);
      saveFallbackData(db);
      await this.logAudit("Created Upcoming Event", `Title: ${newEvent.title}, Seats: ${newEvent.totalSeats}`, staffEmail);
      return newEvent;
    }
  }

  /**
   * 4. UPDATE EVENT
   */
  static async updateEvent(id: number, data: any, staffEmail: string = "admin@corpers.tech"): Promise<any> {
    try {
      const prisma = getPrisma();
      const oldEvent = await prisma.upcomingEvent.findUnique({
        where: { id },
        include: { reservations: true }
      });
      if (!oldEvent) throw new Error("Event not found");

      const updated = await prisma.upcomingEvent.update({
        where: { id },
        data: {
          title: data.title,
          type: data.type,
          date: data.date,
          time: data.time,
          location: data.location,
          totalSeats: parseInt(data.totalSeats, 10),
          registrationDeadline: data.registrationDeadline,
          description: data.description,
          status: data.status
        }
      });

      // Automatically notify reserved students if venue/date changed or cancelled
      if (oldEvent.location !== updated.location || oldEvent.date !== updated.date || oldEvent.time !== updated.time) {
        for (const res of oldEvent.reservations) {
          if (res.status === 'Confirmed') {
            await this.triggerNotification(
              res.email,
              `Event Update: ${updated.title}`,
              `Important schedule/venue update for ${updated.title}. New Venue: ${updated.location}. Date/Time: ${updated.date} at ${updated.time}.`,
              "event_updated"
            );
          }
        }
      } else if (updated.status === 'Cancelled' && oldEvent.status !== 'Cancelled') {
        for (const res of oldEvent.reservations) {
          if (res.status === 'Confirmed') {
            await this.triggerNotification(
              res.email,
              `Event Cancelled: ${updated.title}`,
              `We regret to inform you that ${updated.title} scheduled for ${updated.date} has been cancelled.`,
              "event_cancelled"
            );
          }
        }
      }

      await this.logAudit("Updated Upcoming Event", `ID: ${id}, Title: ${updated.title}`, staffEmail);
      return updated;
    } catch (err) {
      const db = loadFallbackData();
      const idx = db.events.findIndex((e: any) => e.id === id || String(e.id) === String(id));
      if (idx === -1) throw new Error("Event not found");

      const oldEvent = { ...db.events[idx] };
      db.events[idx] = {
        ...db.events[idx],
        ...data,
        totalSeats: parseInt(data.totalSeats, 10) || db.events[idx].totalSeats,
        updatedAt: new Date().toISOString()
      };
      saveFallbackData(db);

      const updated = db.events[idx];
      const evRes = db.reservations.filter((r: any) => r.eventId === id && r.status === 'Confirmed');

      if (oldEvent.location !== updated.location || oldEvent.date !== updated.date || oldEvent.time !== updated.time) {
        for (const res of evRes) {
          await this.triggerNotification(
            res.email,
            `Event Update: ${updated.title}`,
            `Important schedule/venue update for ${updated.title}. New Venue: ${updated.location}. Date/Time: ${updated.date} at ${updated.time}.`,
            "event_updated"
          );
        }
      } else if (updated.status === 'Cancelled' && oldEvent.status !== 'Cancelled') {
        for (const res of evRes) {
          await this.triggerNotification(
            res.email,
            `Event Cancelled: ${updated.title}`,
            `We regret to inform you that ${updated.title} scheduled for ${updated.date} has been cancelled.`,
            "event_cancelled"
          );
        }
      }

      await this.logAudit("Updated Upcoming Event", `ID: ${id}, Title: ${updated.title}`, staffEmail);
      return updated;
    }
  }

  /**
   * 5. DELETE EVENT
   */
  static async deleteEvent(id: number, staffEmail: string = "admin@corpers.tech"): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.eventReservation.deleteMany({ where: { eventId: id } });
      await prisma.waitingList.deleteMany({ where: { eventId: id } });
      await prisma.eventAttendance.deleteMany({ where: { eventId: id } });
      await prisma.upcomingEvent.delete({ where: { id } });
      await this.logAudit("Deleted Upcoming Event", `Event ID: ${id}`, staffEmail);
    } catch (err) {
      const db = loadFallbackData();
      db.events = db.events.filter((e: any) => e.id !== id && String(e.id) !== String(id));
      db.reservations = db.reservations.filter((r: any) => r.eventId !== id && String(r.eventId) !== String(id));
      db.waitingList = db.waitingList.filter((w: any) => w.eventId !== id && String(w.eventId) !== String(id));
      db.attendances = db.attendances.filter((a: any) => a.eventId !== id && String(a.eventId) !== String(id));
      saveFallbackData(db);
      await this.logAudit("Deleted Upcoming Event", `Event ID: ${id}`, staffEmail);
    }
  }

  /**
   * 6. RESERVE SEAT (with duplicate check & Waiting List overflow)
   */
  static async reserveSeat(eventId: number, data: any): Promise<any> {
    const { fullName, email, phone, course, nyscState, nyscBatch, referenceNumber, attendanceType, transportation, pickupLocation } = data;
    if (!fullName || !email || !phone) {
      throw new Error("Full Name, Email, and Phone number are required.");
    }
    const cleanEmail = email.trim().toLowerCase();

    try {
      const prisma = getPrisma();
      const event = await prisma.upcomingEvent.findUnique({
        where: { id: eventId },
        include: { reservations: true, waitingList: true }
      });
      if (!event) throw new Error("Event not found.");

      // Duplicate reservation check
      const existingRes = event.reservations.find(r => r.email.toLowerCase() === cleanEmail && r.status !== 'Cancelled');
      if (existingRes) {
        return {
          success: false,
          error: "You have already reserved a seat for this event.",
          alreadyReserved: true,
          reservation: existingRes
        };
      }
      const existingWait = event.waitingList.find(w => w.email.toLowerCase() === cleanEmail && w.status === 'Waiting');
      if (existingWait) {
        return {
          success: false,
          error: `You are already on the waiting list for this event (Position #${existingWait.position}).`,
          alreadyReserved: true,
          isWaitingList: true,
          reservation: existingWait
        };
      }

      // Generate unique reservation ID
      const timestampPart = Math.floor(1000 + Math.random() * 9000);
      const resId = `RES-${new Date().getFullYear()}-${timestampPart}`;

      // Check if capacity available
      if (event.reservedSeats < event.totalSeats) {
        const reservation = await prisma.eventReservation.create({
          data: {
            reservationId: resId,
            eventId,
            fullName,
            email: cleanEmail,
            phone,
            course: course || "General Tech",
            nyscState: nyscState || "Unknown State",
            nyscBatch: nyscBatch || "2026 Batch A Stream 1",
            referenceNumber: referenceNumber || `CT-NYSC-${Math.floor(1000 + Math.random() * 9000)}`,
            attendanceType: attendanceType || "Physical",
            transportation: transportation || "Personal Transportation",
            pickupLocation: pickupLocation || "",
            status: "Confirmed",
            attendanceStatus: "Pending"
          }
        });

        const updatedEvent = await prisma.upcomingEvent.update({
          where: { id: eventId },
          data: { reservedSeats: { increment: 1 } }
        });

        await this.triggerNotification(
          cleanEmail,
          `Seat Confirmed: ${event.title}`,
          `Your seat reservation (${resId}) is confirmed for ${event.title} on ${event.date} at ${event.time}. Venue: ${event.location}.`,
          "event_confirmed"
        );

        await this.logAudit("Reserved Seat Confirmed", `ResID: ${resId}, Event: ${event.title}, Email: ${cleanEmail}`, cleanEmail);

        return {
          success: true,
          status: "Confirmed",
          message: "Seat reserved successfully! Confirmation generated.",
          reservation,
          event: updatedEvent
        };
      } else {
        // Overflow to Waiting List
        const waitingCount = event.waitingList.filter(w => w.status === 'Waiting').length;
        const position = waitingCount + 1;

        const waitingItem = await prisma.waitingList.create({
          data: {
            eventId,
            fullName,
            email: cleanEmail,
            phone,
            course: course || "General Tech",
            nyscState: nyscState || "Unknown State",
            nyscBatch: nyscBatch || "2026 Batch A Stream 1",
            referenceNumber: referenceNumber || `CT-NYSC-${Math.floor(1000 + Math.random() * 9000)}`,
            attendanceType: attendanceType || "Physical",
            transportation: transportation || "Personal Transportation",
            pickupLocation: pickupLocation || "",
            position,
            status: "Waiting"
          }
        });

        await this.triggerNotification(
          cleanEmail,
          `Added to Waiting List: ${event.title}`,
          `The event is currently full. You have been placed on the waiting list at Position #${position}. We will notify you instantly if a seat opens up.`,
          "event_waiting_list"
        );

        await this.logAudit("Added to Waiting List", `Position #${position}, Event: ${event.title}, Email: ${cleanEmail}`, cleanEmail);

        return {
          success: true,
          status: "Waiting List",
          message: `Event is currently at full capacity. You have been added to the waiting list (Position #${position}).`,
          position,
          reservation: { ...waitingItem, isWaitingList: true },
          event
        };
      }
    } catch (err) {
      const db = loadFallbackData();
      const evIdx = db.events.findIndex((e: any) => e.id === eventId || String(e.id) === String(eventId));
      if (evIdx === -1) throw new Error("Event not found.");
      const event = db.events[evIdx];

      // Duplicate check
      const existingRes = db.reservations.find((r: any) => r.eventId === eventId && r.email.toLowerCase() === cleanEmail && r.status === 'Confirmed');
      if (existingRes) {
        return {
          success: false,
          error: "You have already reserved a seat for this event.",
          alreadyReserved: true,
          reservation: existingRes
        };
      }
      const existingWait = db.waitingList.find((w: any) => w.eventId === eventId && w.email.toLowerCase() === cleanEmail && w.status === 'Waiting');
      if (existingWait) {
        return {
          success: false,
          error: `You are already on the waiting list for this event (Position #${existingWait.position}).`,
          alreadyReserved: true,
          isWaitingList: true,
          reservation: existingWait
        };
      }

      const timestampPart = Math.floor(1000 + Math.random() * 9000);
      const resId = `RES-${new Date().getFullYear()}-${timestampPart}`;

      const confirmedCount = db.reservations.filter((r: any) => r.eventId === eventId && r.status === 'Confirmed').length;

      if (confirmedCount < event.totalSeats) {
        const nextId = db.reservations.reduce((m: number, r: any) => r.id > m ? r.id : m, 0) + 1;
        const reservation = {
          id: nextId,
          reservationId: resId,
          eventId,
          fullName,
          email: cleanEmail,
          phone,
          course: course || "General Tech",
          nyscState: nyscState || "Unknown State",
          nyscBatch: nyscBatch || "2026 Batch A Stream 1",
          referenceNumber: referenceNumber || `CT-NYSC-${Math.floor(1000 + Math.random() * 9000)}`,
          attendanceType: attendanceType || "Physical",
          transportation: transportation || "Personal Transportation",
          pickupLocation: pickupLocation || "",
          status: "Confirmed",
          attendanceStatus: "Pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.reservations.push(reservation);
        db.events[evIdx].reservedSeats = confirmedCount + 1;
        saveFallbackData(db);

        await this.triggerNotification(
          cleanEmail,
          `Seat Confirmed: ${event.title}`,
          `Your seat reservation (${resId}) is confirmed for ${event.title} on ${event.date} at ${event.time}. Venue: ${event.location}.`,
          "event_confirmed"
        );
        await this.logAudit("Reserved Seat Confirmed", `ResID: ${resId}, Event: ${event.title}, Email: ${cleanEmail}`, cleanEmail);

        return {
          success: true,
          status: "Confirmed",
          message: "Seat reserved successfully! Confirmation generated.",
          reservation,
          event: db.events[evIdx]
        };
      } else {
        const waitingCount = db.waitingList.filter((w: any) => w.eventId === eventId && w.status === 'Waiting').length;
        const position = waitingCount + 1;
        const nextId = db.waitingList.reduce((m: number, w: any) => w.id > m ? w.id : m, 0) + 1;
        const waitingItem = {
          id: nextId,
          eventId,
          fullName,
          email: cleanEmail,
          phone,
          course: course || "General Tech",
          nyscState: nyscState || "Unknown State",
          nyscBatch: nyscBatch || "2026 Batch A Stream 1",
          referenceNumber: referenceNumber || `CT-NYSC-${Math.floor(1000 + Math.random() * 9000)}`,
          attendanceType: attendanceType || "Physical",
          transportation: transportation || "Personal Transportation",
          pickupLocation: pickupLocation || "",
          position,
          status: "Waiting",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.waitingList.push(waitingItem);
        saveFallbackData(db);

        await this.triggerNotification(
          cleanEmail,
          `Added to Waiting List: ${event.title}`,
          `The event is currently full. You have been placed on the waiting list at Position #${position}. We will notify you instantly if a seat opens up.`,
          "event_waiting_list"
        );
        await this.logAudit("Added to Waiting List", `Position #${position}, Event: ${event.title}, Email: ${cleanEmail}`, cleanEmail);

        return {
          success: true,
          status: "Waiting List",
          message: `Event is currently at full capacity. You have been added to the waiting list (Position #${position}).`,
          position,
          reservation: { ...waitingItem, isWaitingList: true },
          event
        };
      }
    }
  }

  /**
   * 7. CANCEL RESERVATION (with auto-promotion from Waiting List)
   */
  static async cancelReservation(resIdOrString: string | number, userEmail?: string): Promise<any> {
    try {
      const prisma = getPrisma();
      // Look for reservation first
      let resRecord: any = null;
      let isWaiting = false;
      if (typeof resIdOrString === 'string' && resIdOrString.startsWith('RES-')) {
        resRecord = await prisma.eventReservation.findUnique({ where: { reservationId: resIdOrString } });
      } else {
        const numId = parseInt(String(resIdOrString), 10);
        resRecord = await prisma.eventReservation.findUnique({ where: { id: numId } });
        if (!resRecord) {
          const waitRecord = await prisma.waitingList.findUnique({ where: { id: numId } });
          if (waitRecord) {
            resRecord = waitRecord;
            isWaiting = true;
          }
        }
      }

      if (!resRecord) throw new Error("Reservation or waiting list entry not found.");

      const eventId = resRecord.eventId;
      const event = await prisma.upcomingEvent.findUnique({ where: { id: eventId } });
      if (!event) throw new Error("Associated event not found.");

      if (isWaiting) {
        await prisma.waitingList.delete({ where: { id: resRecord.id } });
        await this.logAudit("Cancelled Waiting List Entry", `Event: ${event.title}, Email: ${resRecord.email}`, userEmail || resRecord.email);
        return { success: true, message: "Waiting list entry removed." };
      } else {
        await prisma.eventReservation.delete({ where: { id: resRecord.id } });
        await prisma.upcomingEvent.update({
          where: { id: eventId },
          data: { reservedSeats: { decrement: 1 } }
        });

        await this.logAudit("Cancelled Event Reservation", `ResID: ${resRecord.reservationId}, Event: ${event.title}`, userEmail || resRecord.email);

        // Check if anyone is waiting
        const nextWaiting = await prisma.waitingList.findFirst({
          where: { eventId, status: "Waiting" },
          orderBy: { position: "asc" }
        });

        if (nextWaiting) {
          const timestampPart = Math.floor(1000 + Math.random() * 9000);
          const newResId = `RES-${new Date().getFullYear()}-${timestampPart}`;

          const promotedRes = await prisma.eventReservation.create({
            data: {
              reservationId: newResId,
              eventId,
              fullName: nextWaiting.fullName,
              email: nextWaiting.email,
              phone: nextWaiting.phone,
              course: nextWaiting.course,
              nyscState: nextWaiting.nyscState,
              nyscBatch: nextWaiting.nyscBatch,
              referenceNumber: nextWaiting.referenceNumber,
              attendanceType: nextWaiting.attendanceType,
              transportation: nextWaiting.transportation,
              pickupLocation: nextWaiting.pickupLocation,
              status: "Confirmed",
              attendanceStatus: "Pending"
            }
          });

          await prisma.waitingList.update({
            where: { id: nextWaiting.id },
            data: { status: "Promoted" }
          });

          await prisma.upcomingEvent.update({
            where: { id: eventId },
            data: { reservedSeats: { increment: 1 } }
          });

          await this.triggerNotification(
            nextWaiting.email,
            `Seat Available! You have been promoted to Confirmed`,
            `Great news! A seat opened up for ${event.title}. Your new confirmed reservation ID is ${newResId}. Date/Time: ${event.date} at ${event.time}.`,
            "event_promoted"
          );

          await this.logAudit("Auto-Promoted from Waiting List", `New ResID: ${newResId}, Email: ${nextWaiting.email}`, "system@corpers.tech");
        }

        return { success: true, message: "Reservation cancelled successfully." };
      }
    } catch (err) {
      const db = loadFallbackData();
      let resIdx = -1;
      let isWaiting = false;

      if (typeof resIdOrString === 'string' && resIdOrString.startsWith('RES-')) {
        resIdx = db.reservations.findIndex((r: any) => r.reservationId === resIdOrString);
      } else {
        const numId = parseInt(String(resIdOrString), 10);
        resIdx = db.reservations.findIndex((r: any) => r.id === numId);
        if (resIdx === -1) {
          resIdx = db.waitingList.findIndex((w: any) => w.id === numId);
          if (resIdx !== -1) isWaiting = true;
        }
      }

      if (resIdx === -1) throw new Error("Reservation or waiting list entry not found.");

      const targetList = isWaiting ? db.waitingList : db.reservations;
      const resRecord = { ...targetList[resIdx] };
      const eventId = resRecord.eventId;
      const evIdx = db.events.findIndex((e: any) => e.id === eventId || String(e.id) === String(eventId));
      const eventTitle = evIdx !== -1 ? db.events[evIdx].title : "Event";

      if (isWaiting) {
        db.waitingList.splice(resIdx, 1);
        saveFallbackData(db);
        await this.logAudit("Cancelled Waiting List Entry", `Event: ${eventTitle}, Email: ${resRecord.email}`, userEmail || resRecord.email);
        return { success: true, message: "Waiting list entry removed." };
      } else {
        db.reservations.splice(resIdx, 1);
        if (evIdx !== -1) {
          const confirmedCount = db.reservations.filter((r: any) => r.eventId === eventId && r.status === 'Confirmed').length;
          db.events[evIdx].reservedSeats = confirmedCount;
        }

        await this.logAudit("Cancelled Event Reservation", `ResID: ${resRecord.reservationId}, Event: ${eventTitle}`, userEmail || resRecord.email);

        // Check if anyone is waiting
        const waitingListForEv = db.waitingList.filter((w: any) => w.eventId === eventId && w.status === 'Waiting');
        waitingListForEv.sort((a: any, b: any) => a.position - b.position);

        if (waitingListForEv.length > 0 && evIdx !== -1) {
          const nextWaiting = waitingListForEv[0];
          const timestampPart = Math.floor(1000 + Math.random() * 9000);
          const newResId = `RES-${new Date().getFullYear()}-${timestampPart}`;
          const nextId = db.reservations.reduce((m: number, r: any) => r.id > m ? r.id : m, 0) + 1;

          const promotedRes = {
            id: nextId,
            reservationId: newResId,
            eventId,
            fullName: nextWaiting.fullName,
            email: nextWaiting.email,
            phone: nextWaiting.phone,
            course: nextWaiting.course,
            nyscState: nextWaiting.nyscState,
            nyscBatch: nextWaiting.nyscBatch,
            referenceNumber: nextWaiting.referenceNumber,
            attendanceType: nextWaiting.attendanceType,
            transportation: nextWaiting.transportation,
            pickupLocation: nextWaiting.pickupLocation,
            status: "Confirmed",
            attendanceStatus: "Pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          db.reservations.push(promotedRes);
          const waitIdx = db.waitingList.findIndex((w: any) => w.id === nextWaiting.id);
          if (waitIdx !== -1) {
            db.waitingList[waitIdx].status = "Promoted";
          }
          db.events[evIdx].reservedSeats = db.reservations.filter((r: any) => r.eventId === eventId && r.status === 'Confirmed').length;

          await this.triggerNotification(
            nextWaiting.email,
            `Seat Available! You have been promoted to Confirmed`,
            `Great news! A seat opened up for ${eventTitle}. Your new confirmed reservation ID is ${newResId}.`,
            "event_promoted"
          );
          await this.logAudit("Auto-Promoted from Waiting List", `New ResID: ${newResId}, Email: ${nextWaiting.email}`, "system@corpers.tech");
        }

        saveFallbackData(db);
        return { success: true, message: "Reservation cancelled successfully." };
      }
    }
  }

  /**
   * 8. GET STUDENT EVENTS (for Student Dashboard -> My Upcoming Events)
   */
  static async getStudentEvents(email: string): Promise<any[]> {
    if (!email || !email.trim()) return [];
    const cleanEmail = email.trim().toLowerCase();
    const allEvents = await this.getAllEvents(cleanEmail);

    return allEvents
      .filter(ev => ev.userHasReserved || ev.isOnWaitingList)
      .map(ev => {
        // Calculate countdown days
        const eventDate = new Date(ev.date);
        const today = new Date();
        const diffTime = eventDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let countdownLabel = `${daysLeft} Days Left`;
        if (daysLeft === 0) countdownLabel = "Live Today";
        else if (daysLeft === 1) countdownLabel = "Tomorrow";
        else if (daysLeft < 0) countdownLabel = "Completed";

        return {
          ...ev,
          daysLeft,
          countdownLabel
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * 9. MARK ATTENDANCE (for Physical/Virtual events in Command Center)
   */
  static async markAttendance(eventId: number, data: { reservationId?: string | number; attendeeEmail?: string; email?: string; status: string; markedBy?: string; notes?: string }): Promise<any> {
    const rawEmail = data.attendeeEmail || data.email || "";
    if (!rawEmail) throw new Error("Attendee email is required for check-in.");
    const cleanEmail = rawEmail.trim().toLowerCase();
    const status = data.status; // "Present" | "Absent" | "Late Arrival" | "No Show"

    try {
      const prisma = getPrisma();
      const reservation = await prisma.eventReservation.findFirst({
        where: {
          eventId,
          email: cleanEmail
        }
      });
      if (reservation) {
        await prisma.eventReservation.update({
          where: { id: reservation.id },
          data: { attendanceStatus: status }
        });
      }

      const attendanceRecord = await prisma.eventAttendance.create({
        data: {
          eventId,
          reservationId: reservation ? reservation.id : null,
          attendeeEmail: cleanEmail,
          attendeeName: reservation ? reservation.fullName : cleanEmail,
          attendanceStatus: status,
          markedBy: data.markedBy || "Staff Admin",
          notes: data.notes || `Attendance marked as ${status}`
        }
      });

      await this.logAudit("Marked Attendance", `Email: ${cleanEmail}, Status: ${status}, Event: ${eventId}`, data.markedBy || "admin@corpers.tech");
      return attendanceRecord;
    } catch (err) {
      const db = loadFallbackData();
      const resIdx = db.reservations.findIndex((r: any) => r.eventId === eventId && r.email.toLowerCase() === cleanEmail);
      let attendeeName = cleanEmail;
      let resIdNum: any = null;
      if (resIdx !== -1) {
        db.reservations[resIdx].attendanceStatus = status;
        attendeeName = db.reservations[resIdx].fullName;
        resIdNum = db.reservations[resIdx].id;
      }

      const nextId = db.attendances.reduce((m: number, a: any) => a.id > m ? a.id : m, 0) + 1;
      const attendanceRecord = {
        id: nextId,
        eventId,
        reservationId: resIdNum,
        attendeeEmail: cleanEmail,
        attendeeName,
        attendanceStatus: status,
        checkInTime: new Date().toISOString(),
        markedBy: data.markedBy || "Staff Admin",
        notes: data.notes || `Attendance marked as ${status}`
      };

      db.attendances.push(attendanceRecord);
      saveFallbackData(db);
      await this.logAudit("Marked Attendance", `Email: ${cleanEmail}, Status: ${status}, Event: ${eventId}`, data.markedBy || "admin@corpers.tech");
      return attendanceRecord;
    }
  }

  /**
   * 10. GET ATTENDEES (with filters & attendance statistics)
   */
  static async getAttendees(eventId: number, filters: any = {}): Promise<any> {
    const db = loadFallbackData(); // or fetch from prisma
    let resList = [];
    let waitList = [];
    let attList = [];
    let eventTitle = "";

    try {
      const prisma = getPrisma();
      const ev = await prisma.upcomingEvent.findUnique({
        where: { id: eventId },
        include: { reservations: true, waitingList: true, attendances: true }
      });
      if (ev) {
        resList = ev.reservations;
        waitList = ev.waitingList;
        attList = ev.attendances;
        eventTitle = ev.title;
      }
    } catch (err) {
      resList = db.reservations.filter((r: any) => r.eventId === eventId && r.status === 'Confirmed');
      waitList = db.waitingList.filter((w: any) => w.eventId === eventId && w.status === 'Waiting');
      attList = db.attendances.filter((a: any) => a.eventId === eventId);
      const foundEv = db.events.find((e: any) => e.id === eventId || String(e.id) === String(eventId));
      if (foundEv) eventTitle = foundEv.title;
    }

    // Apply filters
    let filtered = [...resList];
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter((r: any) => 
        (r.fullName && r.fullName.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.referenceNumber && r.referenceNumber.toLowerCase().includes(q)) ||
        (r.reservationId && r.reservationId.toLowerCase().includes(q))
      );
    }
    if (filters.course && filters.course !== 'All') {
      filtered = filtered.filter((r: any) => r.course && r.course.toLowerCase().includes(filters.course.toLowerCase()));
    }
    if (filters.nyscBatch && filters.nyscBatch !== 'All') {
      filtered = filtered.filter((r: any) => r.nyscBatch && r.nyscBatch.toLowerCase().includes(filters.nyscBatch.toLowerCase()));
    }
    if (filters.state && filters.state !== 'All') {
      filtered = filtered.filter((r: any) => r.nyscState && r.nyscState.toLowerCase().includes(filters.state.toLowerCase()));
    }
    if (filters.attendanceType && filters.attendanceType !== 'All') {
      filtered = filtered.filter((r: any) => r.attendanceType && r.attendanceType.toLowerCase() === filters.attendanceType.toLowerCase());
    }

    // Calculate stats
    const totalConfirmed = resList.length;
    const totalPresent = resList.filter((r: any) => r.attendanceStatus === 'Present').length;
    const totalAbsent = resList.filter((r: any) => r.attendanceStatus === 'Absent').length;
    const totalLate = resList.filter((r: any) => r.attendanceStatus === 'Late Arrival').length;
    const totalNoShow = resList.filter((r: any) => r.attendanceStatus === 'No Show').length;
    const totalPending = resList.filter((r: any) => r.attendanceStatus === 'Pending' || !r.attendanceStatus).length;
    const attendanceRate = totalConfirmed > 0 ? Math.round(((totalPresent + totalLate) / totalConfirmed) * 100) : 0;

    return {
      eventTitle,
      attendees: filtered,
      waitingList: waitList,
      stats: {
        totalConfirmed,
        totalPresent,
        totalAbsent,
        totalLate,
        totalNoShow,
        totalPending,
        attendanceRate,
        waitingListCount: waitList.length
      }
    };
  }

  /**
   * 11. GET ANALYTICS (Recharts Data for Command Center)
   */
  static async getAnalytics(): Promise<any> {
    const db = loadFallbackData();
    let events = db.events || [];
    let reservations = db.reservations || [];
    let waitingList = db.waitingList || [];

    try {
      const prisma = getPrisma();
      const dbEvents = await prisma.upcomingEvent.findMany({ include: { reservations: true, waitingList: true } });
      if (dbEvents && dbEvents.length > 0) {
        events = dbEvents;
        reservations = [];
        dbEvents.forEach(e => {
          if (e.reservations) reservations.push(...e.reservations);
          if (e.waitingList) waitingList.push(...e.waitingList);
        });
      }
    } catch (err) {
      // Use fallback
    }

    // 1. Most Popular Events
    const mostPopularEvents = events.map((ev: any) => {
      const count = reservations.filter((r: any) => r.eventId === ev.id && r.status === 'Confirmed').length;
      return {
        name: ev.title.length > 22 ? ev.title.substring(0, 22) + '...' : ev.title,
        fullTitle: ev.title,
        reservations: count,
        capacity: ev.totalSeats
      };
    }).sort((a: any, b: any) => b.reservations - a.reservations);

    // 2. Attendance Stats (Present vs Late vs Absent vs No Show vs Pending)
    const present = reservations.filter((r: any) => r.attendanceStatus === 'Present').length;
    const late = reservations.filter((r: any) => r.attendanceStatus === 'Late Arrival').length;
    const absent = reservations.filter((r: any) => r.attendanceStatus === 'Absent').length;
    const noShow = reservations.filter((r: any) => r.attendanceStatus === 'No Show').length;
    const pending = reservations.filter((r: any) => !r.attendanceStatus || r.attendanceStatus === 'Pending').length;

    const attendanceStats = [
      { name: "Present", value: present, color: "#16A34A" },
      { name: "Late Arrival", value: late, color: "#D97706" },
      { name: "Absent", value: absent, color: "#EF4444" },
      { name: "No Show", value: noShow, color: "#64748B" },
      { name: "Pending Check-in", value: pending, color: "#94A3B8" }
    ].filter(item => item.value > 0);

    if (attendanceStats.length === 0) {
      attendanceStats.push({ name: "Pending Check-in", value: reservations.length || 1, color: "#94A3B8" });
    }

    // 3. Seat Utilization
    const totalCapacity = events.reduce((acc: number, ev: any) => acc + (ev.totalSeats || 0), 0);
    const totalReserved = reservations.filter((r: any) => r.status === 'Confirmed').length;
    const seatUtilization = totalCapacity > 0 ? Math.round((totalReserved / totalCapacity) * 100) : 0;
    const noShowRate = totalReserved > 0 ? Math.round(((absent + noShow) / totalReserved) * 100) : 0;
    const attendanceRate = totalReserved > 0 ? Math.round(((present + late) / totalReserved) * 100) : 0;

    // 4. Reservations by Course
    const courseMap: Record<string, number> = {};
    reservations.forEach((r: any) => {
      const c = r.course || "General Tech";
      courseMap[c] = (courseMap[c] || 0) + 1;
    });
    const reservationsByCourse = Object.keys(courseMap).map(key => ({
      course: key.length > 18 ? key.substring(0, 18) + '...' : key,
      fullCourse: key,
      count: courseMap[key]
    })).sort((a, b) => b.count - a.count);

    // 5. Reservations by State
    const stateMap: Record<string, number> = {};
    reservations.forEach((r: any) => {
      const s = r.nyscState || "Lagos";
      stateMap[s] = (stateMap[s] || 0) + 1;
    });
    const reservationsByState = Object.keys(stateMap).map(key => ({
      state: key,
      count: stateMap[key]
    })).sort((a, b) => b.count - a.count);

    // 6. Transportation Stats
    const transMap: Record<string, number> = {};
    reservations.forEach((r: any) => {
      const t = r.transportation || "Personal Transportation";
      transMap[t] = (transMap[t] || 0) + 1;
    });
    const transportationStats = Object.keys(transMap).map((key, i) => {
      const colors = ["#16A34A", "#0284C7", "#7C3AED", "#D97706", "#64748B"];
      return {
        name: key,
        value: transMap[key],
        color: colors[i % colors.length]
      };
    });

    return {
      mostPopularEvents,
      attendanceStats,
      seatUtilization,
      noShowRate,
      attendanceRate,
      reservationsByCourse,
      reservationsByState,
      transportationStats,
      summary: {
        totalEvents: events.length,
        totalCapacity,
        totalReserved,
        totalWaiting: waitingList.filter((w: any) => w.status === 'Waiting').length
      }
    };
  }

  /**
   * 12. GENERATE iCALENDAR (.ics) FILE CONTENT
   */
  static async generateIcs(eventId: number, userEmail?: string): Promise<{ filename: string; content: string }> {
    const ev = await this.getEventById(eventId, userEmail);
    const dateStr = ev.date ? ev.date.replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const startTime = "090000";
    const endTime = "130000";
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

    const cleanTitle = ev.title || "Career Launch Event";
    const cleanLoc = ev.location || "Olatech School Campus";
    const cleanDesc = (ev.description || "CorpersTech Career Launch & Upcoming Workshop").replace(/(\r\n|\n|\r)/gm, "\\n");

    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CorpersTech Career Launch//Event Reservation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:evt-${ev.id}-${dateStr}@corpers.tech`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dateStr}T${startTime}Z`,
      `DTEND:${dateStr}T${endTime}Z`,
      `SUMMARY:${cleanTitle}`,
      `LOCATION:${cleanLoc}`,
      `DESCRIPTION:${cleanDesc}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const filename = `event_${ev.id}_${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.ics`;

    return { filename, content };
  }
}
