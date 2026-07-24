import fs from 'fs';
import path from 'path';
import { getPrisma } from '../db.ts';
import { EnrollmentRepository } from './EnrollmentRepository.ts';
import { RecruitmentRepository } from './RecruitmentRepository.ts';

const PROFILES_FALLBACK_FILE = path.join(process.cwd(), 'corps-profiles-fallback-db.json');
const SAVED_OPPS_FALLBACK_FILE = path.join(process.cwd(), 'saved-opportunities-fallback-db.json');
const APPLICATIONS_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-applications-fallback-db.json');
const NOTIFICATIONS_FALLBACK_FILE = path.join(process.cwd(), 'user-notifications-fallback-db.json');
const RESOURCES_FALLBACK_FILE = path.join(process.cwd(), 'career-resources-fallback-db.json');

function loadFallback<T>(file: string, initialData: T[]): T[] {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Failed to read fallback file ${file}:`, error);
  }
  return initialData;
}

function saveFallback<T>(file: string, data: T[]): void {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to write fallback file ${file}:`, error);
  }
}

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: "Olatech Standard ATS Resume Template (2026)",
    type: "Template",
    category: "CV & Resume",
    description: "Verified ATS-compliant resume structure specifically formatted for Nigerian youth corps members targeting tech placements.",
    fileUrl: "/downloads/ats-resume-template-2026.docx",
    downloadCount: 420,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Technical Interview Mastery Cheat Sheet",
    type: "Guide",
    category: "Interview Prep",
    description: "Essential behavioral and technical questions asked by top Nigerian fintechs (Moniepoint, Paystack, Sterling Bank).",
    fileUrl: "/downloads/technical-interview-guide.pdf",
    downloadCount: 315,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "NYSC CDS Capstone Project Guide",
    type: "Handbook",
    category: "Projects",
    description: "How to architect and document your community development service project as a portfolio centerpiece.",
    fileUrl: "/downloads/nysc-capstone-guide.pdf",
    downloadCount: 290,
    createdAt: new Date().toISOString()
  }
];

export class CareerCoachRepository {
  /**
   * Ensure enrollment and profile exist for an email, with 100% offline JSON fallback.
   */
  static async getOrCreateProfile(emailToFind: string) {
    const email = emailToFind.trim().toLowerCase();
    
    // 1. Get Enrollment (EnrollmentRepository has robust offline JSON fallback)
    let enrollment = await EnrollmentRepository.findByEmail(email);
    if (!enrollment) {
      // In demo/offline preview mode, if student is not found, create a default enrollment record
      enrollment = await EnrollmentRepository.create({
        firstName: "Student",
        lastName: "Member",
        email: email,
        phone: "08123456789",
        gender: "Prefer not to say",
        dateOfBirth: "1998-05-12",
        stateOfOrigin: "Lagos",
        stateOfService: "Lagos",
        localGovernment: "Ikeja",
        nyscBatch: "2026 Batch A Stream I",
        ppa: "Olatech Technology Campus",
        course: "Full Stack Web Development",
        transportationOption: "Company Bus",
        whyInterested: "Looking to build visual web applications and advance my tech career.",
        previousTechExperience: "Intermediate",
        laptopAvailable: "Yes"
      });
    }

    // 2. Get or create CorpsMemberProfile
    let profile: any = null;
    try {
      const prisma = getPrisma();
      profile = await prisma.corpsMemberProfile.findUnique({ where: { email } });
      if (!profile) {
        let skills = 'HTML, CSS, JavaScript, React, Tailwind';
        const course = (enrollment.course || '').toLowerCase();
        if (course.includes('cyber')) {
          skills = 'Wireshark, Nmap, SIEM, Threat Auditing, Network Security';
        } else if (course.includes('data')) {
          skills = 'SQL, Excel, Power BI, Tableau, Python, Pandas';
        } else if (course.includes('design') || course.includes('ux')) {
          skills = 'Figma, Adobe XD, UI Prototyping, Usability Testing, Vector Illustration';
        } else if (course.includes('video')) {
          skills = 'Premiere Pro, DaVinci Resolve, Color Grading, Sound Sync, CapCut';
        } else if (course.includes('automation') || course.includes('ai')) {
          skills = 'Make.com, Zapier, Prompt Engineering, API Integrations, LLM Orchestration';
        }

        profile = await prisma.corpsMemberProfile.create({
          data: {
            email,
            skills,
            linkedinUrl: 'https://linkedin.com/in/samuelokon-corpers',
            githubUrl: 'https://github.com/samuelokon-dev',
            portfolioUrl: 'https://samuelokon.vercel.app',
            cvText: `${enrollment.firstName.toUpperCase()} ${enrollment.lastName.toUpperCase()}
Email: ${email}
Phone: ${enrollment.phone || '0817075958413'}
Education: B.Sc. Computer Science, University of Uyo
Skills: ${skills}
Projects: Personal portfolio, responsive web applications
Experience: Tech Intern at campus IT center (3 months)`,
            cvReadinessScore: 65,
            cvFeedback: 'Your summary is slightly generic. Try highlighting the core full-stack projects you built with Olatech School, and link to live demos instead of just GitHub repositories.',
            careerReadinessScore: 45,
            viewedOpportunityIds: ''
          }
        });
      }
    } catch (error) {
      // Offline fallback for CorpsMemberProfile
      const profiles = loadFallback<any>(PROFILES_FALLBACK_FILE, []);
      profile = profiles.find(p => p.email.toLowerCase() === email);
      if (!profile) {
        let skills = 'HTML, CSS, JavaScript, React, Tailwind';
        const course = (enrollment.course || '').toLowerCase();
        if (course.includes('cyber')) {
          skills = 'Wireshark, Nmap, SIEM, Threat Auditing, Network Security';
        } else if (course.includes('data')) {
          skills = 'SQL, Excel, Power BI, Tableau, Python, Pandas';
        } else if (course.includes('design') || course.includes('ux')) {
          skills = 'Figma, Adobe XD, UI Prototyping, Usability Testing, Vector Illustration';
        } else if (course.includes('video')) {
          skills = 'Premiere Pro, DaVinci Resolve, Color Grading, Sound Sync, CapCut';
        } else if (course.includes('automation') || course.includes('ai')) {
          skills = 'Make.com, Zapier, Prompt Engineering, API Integrations, LLM Orchestration';
        }

        profile = {
          id: profiles.length > 0 ? Math.max(...profiles.map(p => p.id || 0)) + 1 : 1,
          email,
          skills,
          linkedinUrl: 'https://linkedin.com/in/samuelokon-corpers',
          githubUrl: 'https://github.com/samuelokon-dev',
          portfolioUrl: 'https://samuelokon.vercel.app',
          cvText: `${enrollment.firstName.toUpperCase()} ${enrollment.lastName.toUpperCase()}
Email: ${email}
Phone: ${enrollment.phone || '0817075958413'}
Education: B.Sc. Computer Science, University of Uyo
Skills: ${skills}
Projects: Personal portfolio, responsive web applications
Experience: Tech Intern at campus IT center (3 months)`,
          cvReadinessScore: 65,
          cvFeedback: 'Your summary is slightly generic. Try highlighting the core full-stack projects you built with Olatech School, and link to live demos instead of just GitHub repositories.',
          careerReadinessScore: 45,
          viewedOpportunityIds: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        profiles.push(profile);
        saveFallback(PROFILES_FALLBACK_FILE, profiles);
      }
    }

    // 3. Ensure seed opportunities exist in system (RecruitmentRepository handles offline check & seeding automatically)
    await RecruitmentRepository.getAllOpportunities();

    // 4. Ensure seed notifications exist for user
    const notifications = await this.getNotifications(email);
    if (notifications.length === 0) {
      await this.createNotificationsMany([
        {
          userEmail: email,
          title: 'New Match: Junior Frontend Developer',
          message: 'A fresh, highly aligned role with Moniepoint Nigeria has been published. Your match score is 95%!',
          type: 'match'
        },
        {
          userEmail: email,
          title: 'Welcome to Career Intelligence Hub',
          message: 'Your personal AI Recruitment Intelligence platform is now online. Upload your CV to check your readiness score.',
          type: 'internship'
        }
      ]);
    }

    return { enrollment, profile };
  }

  static async updateProfile(emailToFind: string, data: any) {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      return await prisma.corpsMemberProfile.update({
        where: { email },
        data
      });
    } catch (error) {
      const profiles = loadFallback<any>(PROFILES_FALLBACK_FILE, []);
      const index = profiles.findIndex(p => p.email.toLowerCase() === email);
      if (index !== -1) {
        profiles[index] = { ...profiles[index], ...data, updatedAt: new Date().toISOString() };
        saveFallback(PROFILES_FALLBACK_FILE, profiles);
        return profiles[index];
      }
      return null;
    }
  }

  static async getSavedOpportunities(emailToFind: string): Promise<any[]> {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      return await prisma.savedOpportunity.findMany({ where: { userEmail: email } });
    } catch (error) {
      const saved = loadFallback<any>(SAVED_OPPS_FALLBACK_FILE, []);
      return saved.filter(s => s.userEmail.toLowerCase() === email);
    }
  }

  static async toggleBookmark(emailToFind: string, opportunityId: number): Promise<{ saved: boolean }> {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      const existing = await prisma.savedOpportunity.findUnique({
        where: {
          userEmail_opportunityId: {
            userEmail: email,
            opportunityId
          }
        }
      });
      if (existing) {
        await prisma.savedOpportunity.delete({ where: { id: existing.id } });
        return { saved: false };
      } else {
        await prisma.savedOpportunity.create({
          data: { userEmail: email, opportunityId }
        });
        await this.createNotification(
          email,
          'Opportunity Saved',
          'Opportunity has been added to your watchlist. We will notify you 5 days before the official deadline.',
          'deadline'
        );
        return { saved: true };
      }
    } catch (error) {
      const saved = loadFallback<any>(SAVED_OPPS_FALLBACK_FILE, []);
      const index = saved.findIndex(s => s.userEmail.toLowerCase() === email && s.opportunityId === opportunityId);
      if (index !== -1) {
        saved.splice(index, 1);
        saveFallback(SAVED_OPPS_FALLBACK_FILE, saved);
        return { saved: false };
      } else {
        const newRecord = {
          id: saved.length > 0 ? Math.max(...saved.map(s => s.id || 0)) + 1 : 1,
          userEmail: email,
          opportunityId,
          createdAt: new Date().toISOString()
        };
        saved.push(newRecord);
        saveFallback(SAVED_OPPS_FALLBACK_FILE, saved);
        await this.createNotification(
          email,
          'Opportunity Saved',
          'Opportunity has been added to your watchlist. We will notify you 5 days before the official deadline.',
          'deadline'
        );
        return { saved: true };
      }
    }
  }

  static async getApplications(emailToFind: string): Promise<any[]> {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentApplication.findMany({ where: { userEmail: email } });
    } catch (error) {
      const apps = loadFallback<any>(APPLICATIONS_FALLBACK_FILE, []);
      return apps.filter(a => a.userEmail.toLowerCase() === email);
    }
  }

  static async createApplication(emailToFind: string, opportunityId: number, notes?: string): Promise<any> {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      const existing = await prisma.recruitmentApplication.findUnique({
        where: {
          userEmail_opportunityId: {
            userEmail: email,
            opportunityId
          }
        }
      });
      if (existing) {
        throw new Error('You have already applied for this opportunity.');
      }
      return await prisma.recruitmentApplication.create({
        data: {
          userEmail: email,
          opportunityId,
          status: 'Applied',
          notes: notes || 'Applied via CorpersTech Career Dashboard.'
        }
      });
    } catch (error: any) {
      if (error.message && error.message.includes('already applied')) {
        throw error;
      }
      const apps = loadFallback<any>(APPLICATIONS_FALLBACK_FILE, []);
      const existing = apps.find(a => a.userEmail.toLowerCase() === email && a.opportunityId === opportunityId);
      if (existing) {
        throw new Error('You have already applied for this opportunity.');
      }
      const newApp = {
        id: apps.length > 0 ? Math.max(...apps.map(a => a.id || 0)) + 1 : 1,
        userEmail: email,
        opportunityId,
        status: 'Applied',
        notes: notes || 'Applied via CorpersTech Career Dashboard.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      apps.push(newApp);
      saveFallback(APPLICATIONS_FALLBACK_FILE, apps);
      return newApp;
    }
  }

  static async updateApplicationStatus(id: number, status: string, notes?: string): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentApplication.update({
        where: { id },
        data: {
          status,
          notes: notes || undefined
        }
      });
    } catch (error) {
      const apps = loadFallback<any>(APPLICATIONS_FALLBACK_FILE, []);
      const index = apps.findIndex(a => a.id === id);
      if (index !== -1) {
        apps[index].status = status;
        if (notes) apps[index].notes = notes;
        apps[index].updatedAt = new Date().toISOString();
        saveFallback(APPLICATIONS_FALLBACK_FILE, apps);
        return apps[index];
      }
      throw new Error(`Application not found with id ${id}`);
    }
  }

  static async getNotifications(emailToFind: string): Promise<any[]> {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      return await prisma.userNotification.findMany({
        where: { userEmail: email },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      const notifs = loadFallback<any>(NOTIFICATIONS_FALLBACK_FILE, []);
      return notifs.filter(n => n.userEmail.toLowerCase() === email).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  static async markAllNotificationsRead(emailToFind: string): Promise<void> {
    const email = emailToFind.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      await prisma.userNotification.updateMany({
        where: { userEmail: email },
        data: { isRead: true }
      });
    } catch (error) {
      const notifs = loadFallback<any>(NOTIFICATIONS_FALLBACK_FILE, []);
      let changed = false;
      notifs.forEach(n => {
        if (n.userEmail.toLowerCase() === email && !n.isRead) {
          n.isRead = true;
          changed = true;
        }
      });
      if (changed) saveFallback(NOTIFICATIONS_FALLBACK_FILE, notifs);
    }
  }

  static async createNotification(userEmail: string, title: string, message: string, type: string = 'match'): Promise<any> {
    const email = userEmail.trim().toLowerCase();
    try {
      const prisma = getPrisma();
      return await prisma.userNotification.create({
        data: { userEmail: email, title, message, type, isRead: false }
      });
    } catch (error) {
      const notifs = loadFallback<any>(NOTIFICATIONS_FALLBACK_FILE, []);
      const newRecord = {
        id: notifs.length > 0 ? Math.max(...notifs.map(n => n.id || 0)) + 1 : 1,
        userEmail: email,
        title,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      notifs.unshift(newRecord);
      saveFallback(NOTIFICATIONS_FALLBACK_FILE, notifs);
      return newRecord;
    }
  }

  static async createNotificationsMany(dataArray: Array<{ userEmail: string; title: string; message: string; type: string }>): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.userNotification.createMany({
        data: dataArray.map(d => ({ ...d, userEmail: d.userEmail.trim().toLowerCase(), isRead: false }))
      });
    } catch (error) {
      const notifs = loadFallback<any>(NOTIFICATIONS_FALLBACK_FILE, []);
      let maxId = notifs.length > 0 ? Math.max(...notifs.map(n => n.id || 0)) : 0;
      dataArray.forEach(d => {
        maxId++;
        notifs.unshift({
          id: maxId,
          userEmail: d.userEmail.trim().toLowerCase(),
          title: d.title,
          message: d.message,
          type: d.type || 'match',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      });
      saveFallback(NOTIFICATIONS_FALLBACK_FILE, notifs);
    }
  }

  static async getCareerResources(limit: number = 5): Promise<any[]> {
    try {
      const prisma = getPrisma();
      return await prisma.careerResource.findMany({ take: limit });
    } catch (error) {
      const resources = loadFallback<any>(RESOURCES_FALLBACK_FILE, INITIAL_RESOURCES);
      saveFallback(RESOURCES_FALLBACK_FILE, resources);
      return resources.slice(0, limit);
    }
  }
}
