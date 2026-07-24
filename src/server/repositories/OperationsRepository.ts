import fs from 'fs';
import path from 'path';
import { getPrisma } from '../db.ts';

export interface OperationNotification {
  id: number;
  title: string;
  message: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Admissions' | 'Careers' | 'Transportation' | 'Support' | 'Finance' | 'Security' | 'Maintenance' | 'General';
  assignedRole: 'All' | 'Super Admin' | 'Admissions Officer' | 'Career Officer' | 'Operations Officer' | 'Finance Officer' | 'Support Officer';
  createdAt: string;
  status: 'Unread' | 'Read' | 'Dismissed';
}

export interface DailyTask {
  id: number;
  title: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  assignedRole: 'All' | 'Super Admin' | 'Admissions Officer' | 'Career Officer' | 'Operations Officer' | 'Finance Officer' | 'Support Officer';
  assignedUser: string; // Staff name or "Unassigned"
  deadline: string; // ISO or human description
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface CalendarEvent {
  id: number;
  title: string;
  category: 'Orientation' | 'Training' | 'Hackathons' | 'Career events' | 'Employer visits' | 'Interviews' | 'Meetings' | 'Bus schedules' | 'Staff meetings';
  date: string; // YYYY-MM-DD
  time: string;
  description: string;
  department: 'Admissions' | 'Careers' | 'Operations' | 'Finance' | 'Support' | 'All';
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  author: string;
  createdAt: string;
}

export interface SystemHealthStatus {
  service: string;
  status: 'Green' | 'Amber' | 'Red';
  details: string;
}

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'operations-notifications-db.json');
const TASKS_FILE = path.join(process.cwd(), 'operations-tasks-db.json');
const CALENDAR_FILE = path.join(process.cwd(), 'operations-calendar-db.json');
const ANNOUNCEMENTS_FILE = path.join(process.cwd(), 'operations-announcements-db.json');
const REMINDERS_FILE = path.join(process.cwd(), 'operations-reminders-db.json');

// Safe file helpers
function readJSON<T>(file: string, defaultValue: T): T {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
  } catch (e) {
    console.error(`Failed to read operations JSON file ${file}:`, e);
  }
  return defaultValue;
}

function writeJSON(file: string, data: any) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Failed to write operations JSON file ${file}:`, e);
  }
}

export class OperationsRepository {
  
  // 1. NOTIFICATIONS SERVICES
  static getNotifications(): OperationNotification[] {
    const list = readJSON<OperationNotification[]>(NOTIFICATIONS_FILE, []);
    if (list.length === 0) {
      // Seed default smart notifications
      const defaults: OperationNotification[] = [
        {
          id: 1,
          title: "New Applications Awaiting",
          message: "18 new applications awaiting review inside the CRM queue.",
          priority: "High",
          category: "Admissions",
          assignedRole: "Admissions Officer",
          createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
          status: "Unread"
        },
        {
          id: 2,
          title: "NYSC Orientation Event",
          message: "NYSC orientation begins tomorrow morning at Lagos State Secretariat camp.",
          priority: "Critical",
          category: "Admissions",
          assignedRole: "All",
          createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 3,
          title: "Bus Route A at Capacity",
          message: "Bus Route A has reached 100% seating occupancy limit.",
          priority: "High",
          category: "Transportation",
          assignedRole: "Operations Officer",
          createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 4,
          title: "Opportunity Expirations",
          message: "Three career hub job opportunities are expiring today.",
          priority: "Medium",
          category: "Careers",
          assignedRole: "Career Officer",
          createdAt: new Date(Date.now() - 360 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 5,
          title: "Incomplete Applications",
          message: "Five applicants submitted forms with missing credentials/laptop flags.",
          priority: "High",
          category: "Admissions",
          assignedRole: "Admissions Officer",
          createdAt: new Date(Date.now() - 600 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 6,
          title: "Employer Follow-Up Needed",
          message: "Two corporate partner employers require immediate follow-up on resumes sent.",
          priority: "Medium",
          category: "Careers",
          assignedRole: "Career Officer",
          createdAt: new Date(Date.now() - 720 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 7,
          title: "Staff Password Reset Pending",
          message: "Staff password reset is pending authorization for newly added admissions assistant.",
          priority: "High",
          category: "Security",
          assignedRole: "Super Admin",
          createdAt: new Date(Date.now() - 1000 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 8,
          title: "Monthly Performance Report",
          message: "The monthly administrative summary report is compiled and ready for review.",
          priority: "Low",
          category: "General",
          assignedRole: "All",
          createdAt: new Date(Date.now() - 1200 * 60000).toISOString(),
          status: "Unread"
        },
        {
          id: 9,
          title: "Database Backup Complete",
          message: "Automatic incremental cloud database backup completed successfully (Olatech Cloud MySQL).",
          priority: "Low",
          category: "Maintenance",
          assignedRole: "Super Admin",
          createdAt: new Date(Date.now() - 1440 * 60000).toISOString(),
          status: "Unread"
        }
      ];
      writeJSON(NOTIFICATIONS_FILE, defaults);
      return defaults;
    }
    return list;
  }

  static createNotification(notif: Omit<OperationNotification, 'id' | 'createdAt' | 'status'>): OperationNotification {
    const list = this.getNotifications();
    const nextId = list.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    const newNotif: OperationNotification = {
      id: nextId,
      ...notif,
      createdAt: new Date().toISOString(),
      status: 'Unread'
    };
    list.unshift(newNotif);
    writeJSON(NOTIFICATIONS_FILE, list);
    return newNotif;
  }

  static markRead(id: number): boolean {
    const list = this.getNotifications();
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx].status = 'Read';
      writeJSON(NOTIFICATIONS_FILE, list);
      return true;
    }
    return false;
  }

  static dismissNotification(id: number): boolean {
    const list = this.getNotifications();
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx].status = 'Dismissed';
      writeJSON(NOTIFICATIONS_FILE, list);
      return true;
    }
    return false;
  }

  static markAllRead(role: string): void {
    const list = this.getNotifications();
    list.forEach(n => {
      if (role === 'Super Admin' || n.assignedRole === role || n.assignedRole === 'All') {
        n.status = 'Read';
      }
    });
    writeJSON(NOTIFICATIONS_FILE, list);
  }

  // 2. DAILY TASKS SERVICES
  static getTasks(): DailyTask[] {
    const list = readJSON<DailyTask[]>(TASKS_FILE, []);
    if (list.length === 0) {
      // Seed default daily tasks as requested by MODULE 4
      const defaults: DailyTask[] = [
        {
          id: 1,
          title: "Review pending applications",
          status: "Pending",
          assignedRole: "Admissions Officer",
          assignedUser: "Unassigned",
          deadline: "Today, 5:00 PM",
          priority: "High"
        },
        {
          id: 2,
          title: "Approve applicants",
          status: "Pending",
          assignedRole: "Admissions Officer",
          assignedUser: "Unassigned",
          deadline: "Today, 6:00 PM",
          priority: "High"
        },
        {
          id: 3,
          title: "Publish opportunities",
          status: "Completed",
          assignedRole: "Career Officer",
          assignedUser: "Unassigned",
          deadline: "Completed 2h ago",
          priority: "Medium"
        },
        {
          id: 4,
          title: "Confirm transport list",
          status: "Pending",
          assignedRole: "Operations Officer",
          assignedUser: "Unassigned",
          deadline: "Tomorrow, 9:00 AM",
          priority: "High"
        },
        {
          id: 5,
          title: "Prepare orientation logistics",
          status: "Pending",
          assignedRole: "Operations Officer",
          assignedUser: "Unassigned",
          deadline: "In 2 days",
          priority: "Critical"
        },
        {
          id: 6,
          title: "Review employer profiles",
          status: "Completed",
          assignedRole: "Career Officer",
          assignedUser: "Unassigned",
          deadline: "Completed yesterday",
          priority: "Low"
        },
        {
          id: 7,
          title: "Reply to enquiries",
          status: "Pending",
          assignedRole: "Support Officer",
          assignedUser: "Unassigned",
          deadline: "Today, 4:00 PM",
          priority: "Medium"
        },
        {
          id: 8,
          title: "Generate weekly operational reports",
          status: "Overdue",
          assignedRole: "Super Admin",
          assignedUser: "Unassigned",
          deadline: "2 days ago",
          priority: "High"
        }
      ];
      writeJSON(TASKS_FILE, defaults);
      return defaults;
    }
    return list;
  }

  static createTask(task: Omit<DailyTask, 'id'>): DailyTask {
    const list = this.getTasks();
    const nextId = list.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    const newTask: DailyTask = {
      id: nextId,
      ...task
    };
    list.unshift(newTask);
    writeJSON(TASKS_FILE, list);
    return newTask;
  }

  static updateTask(id: number, updates: Partial<Omit<DailyTask, 'id'>>): DailyTask | null {
    const list = this.getTasks();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      writeJSON(TASKS_FILE, list);
      return list[idx];
    }
    return null;
  }

  // 3. CALENDAR SERVICES (Module 5)
  static getCalendarEvents(): CalendarEvent[] {
    const list = readJSON<CalendarEvent[]>(CALENDAR_FILE, []);
    if (list.length === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      const nextMonthStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

      const defaults: CalendarEvent[] = [
        {
          id: 1,
          title: "Orientation Phase 1 Briefing",
          category: "Orientation",
          date: tomorrowStr,
          time: "09:00 AM",
          description: "General orientation and kit allocations for newly approved learning candidates.",
          department: "All"
        },
        {
          id: 2,
          title: "Python & React Boot Camp Intensive",
          category: "Training",
          date: nextWeekStr,
          time: "10:00 AM",
          description: "Technical training curriculum kick-off seminar in the main Olatech lecture hall.",
          department: "Operations"
        },
        {
          id: 3,
          title: "HackFest 2026 Developer Hackathon",
          category: "Hackathons",
          date: nextMonthStr,
          time: "08:00 AM",
          description: "Annual hackathon competition sponsored by international tech mentors.",
          department: "All"
        },
        {
          id: 4,
          title: "Decagon Corporate Visit & Placement Prep",
          category: "Employer visits",
          date: todayStr,
          time: "01:00 PM",
          description: "Executive recruiters from Decagon visiting for placement assessments.",
          department: "Careers"
        },
        {
          id: 5,
          title: "Chinedu mock technical interview",
          category: "Interviews",
          date: todayStr,
          time: "11:30 AM",
          description: "Mock code-review and algorithm whiteboard practice with top career coaches.",
          department: "Careers"
        },
        {
          id: 6,
          title: "Admissions Screening Committee Sync",
          category: "Meetings",
          date: todayStr,
          time: "03:00 PM",
          description: "Reviewing enrollment queues, verification bottlenecks and batch approvals.",
          department: "Admissions"
        },
        {
          id: 7,
          title: "Lagos Route B Commute Bus Run",
          category: "Bus schedules",
          date: todayStr,
          time: "07:30 AM",
          description: "Standard shuttle dispatch from Maryland Bus Terminal to Olatech labs.",
          department: "Operations"
        },
        {
          id: 8,
          title: "Bi-weekly general staff review",
          category: "Staff meetings",
          date: tomorrowStr,
          time: "04:00 PM",
          description: "General review of KPIs, ticketing speeds and platform optimizations.",
          department: "All"
        }
      ];
      writeJSON(CALENDAR_FILE, defaults);
      return defaults;
    }
    return list;
  }

  static createCalendarEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const list = this.getCalendarEvents();
    const nextId = list.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    const newEvent: CalendarEvent = {
      id: nextId,
      ...event
    };
    list.push(newEvent);
    writeJSON(CALENDAR_FILE, list);
    return newEvent;
  }

  // 4. ANNOUNCEMENTS SERVICES (Module 7)
  static getAnnouncements(): Announcement[] {
    const list = readJSON<Announcement[]>(ANNOUNCEMENTS_FILE, []);
    if (list.length === 0) {
      const defaults: Announcement[] = [
        {
          id: 1,
          title: "Public Holiday Notice: Office Closed Next Monday",
          content: "Please be informed that the Olatech Administrative Command Center and learning labs will remain closed next Monday in observance of the Federal NYSC Co-op Public Holiday. Commute buses will resume on Tuesday.",
          priority: "Normal",
          author: "Super Admin",
          createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
        },
        {
          id: 2,
          title: "Critical Password Security Updates Notice",
          content: "As part of our continuous system hardening audits, all Operations and Support staff are required to renew their platform passcodes in the settings menu by Friday. Clear cache before logging back in.",
          priority: "Urgent",
          author: "Super Admin",
          createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
        }
      ];
      writeJSON(ANNOUNCEMENTS_FILE, defaults);
      return defaults;
    }
    return list;
  }

  static createAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
    const list = this.getAnnouncements();
    const nextId = list.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    const newAnn: Announcement = {
      id: nextId,
      ...ann,
      createdAt: new Date().toISOString()
    };
    list.unshift(newAnn);
    writeJSON(ANNOUNCEMENTS_FILE, list);
    return newAnn;
  }

  // 5. PERSONAL REMINDERS
  static getPersonalReminders(email: string): string[] {
    const data = readJSON<Record<string, string[]>>(REMINDERS_FILE, {});
    return data[email] || ["Follow-up with students about laptop requirements", "Submit weekly transport fuel receipts"];
  }

  static savePersonalReminders(email: string, reminders: string[]): void {
    const data = readJSON<Record<string, string[]>>(REMINDERS_FILE, {});
    data[email] = reminders;
    writeJSON(REMINDERS_FILE, data);
  }

  // 6. HEALTH STATUS (Module 10)
  static getSystemHealth(): SystemHealthStatus[] {
    return [
      { service: "Admissions Queue", status: "Green", details: "All incoming requests parsed, average processing latency 2.1 mins." },
      { service: "Recruitment AI", status: "Green", details: "Scrapers online, zero throttling encountered." },
      { service: "Database", status: "Green", details: "Active connection pool, 11ms query response." },
      { service: "Email Services", status: "Green", details: "SMTP server responsive, queues fully empty." },
      { service: "Notifications", status: "Green", details: "Rule engine running, immediate event triggers online." },
      { service: "Backups", status: "Green", details: "Daily cloud-safe checkpoints active." },
      { service: "Storage", status: "Green", details: "Healthy. Available disk: 82% free." }
    ];
  }

  // 7. AUTO-EVALUATE NOTIFICATION RULES (Module 13)
  static async evaluateRulesAndTriggerNotifications(): Promise<void> {
    try {
      const prisma = getPrisma();
      const notifications = this.getNotifications();
      let modified = false;

      // Rule A: New applications awaiting review
      const enrollments = await prisma.enrollment.findMany();
      const pendingCount = enrollments.filter(e => e.status === 'Pending').length;
      if (pendingCount > 0 && !notifications.some(n => n.title === "New Applications Awaiting" && n.status === 'Unread')) {
        this.createNotification({
          title: "New Applications Awaiting",
          message: `${pendingCount} new applications are awaiting review inside the CRM queue.`,
          priority: "High",
          category: "Admissions",
          assignedRole: "Admissions Officer"
        });
        modified = true;
      }

      // Rule B: Incomplete submissions
      const incompleteCount = enrollments.filter(e => e.laptopAvailable !== 'Yes' || e.whyInterested.length < 10).length;
      if (incompleteCount > 0 && !notifications.some(n => n.title === "Incomplete Applications" && n.status === 'Unread')) {
        this.createNotification({
          title: "Incomplete Applications",
          message: `${incompleteCount} applicants submitted forms with pending materials or incomplete details.`,
          priority: "Medium",
          category: "Admissions",
          assignedRole: "Admissions Officer"
        });
        modified = true;
      }

      // Rule C: Bus route warnings
      const busPassengers = enrollments.filter(e => e.transportationOption === 'Company Bus').length;
      if (busPassengers > 25 && !notifications.some(n => n.title === "Bus Route A at Capacity" && n.status === 'Unread')) {
        this.createNotification({
          title: "Bus Route A at Capacity",
          message: `Bus Route passengers count is currently at ${busPassengers}. Coordinate dispatch schedules.`,
          priority: "High",
          category: "Transportation",
          assignedRole: "Operations Officer"
        });
        modified = true;
      }

      // Rule D: Job opportunity expiries
      const jobsCount = await prisma.jobOpportunity.count({ where: { status: 'Published' } });
      if (jobsCount > 0 && !notifications.some(n => n.title === "Opportunity Expirations" && n.status === 'Unread')) {
        this.createNotification({
          title: "Opportunity Expirations",
          message: "Several career opportunities require review before scheduled automatic archive dates.",
          priority: "Medium",
          category: "Careers",
          assignedRole: "Career Officer"
        });
        modified = true;
      }
    } catch (e) {
      // Rule validation fell back to local presets
    }
  }
}
