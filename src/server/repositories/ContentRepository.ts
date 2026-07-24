import fs from 'fs';
import path from 'path';
import { getPrisma } from '../db.ts';

const JOBS_FALLBACK_FILE = path.join(process.cwd(), 'jobs-fallback-db.json');
const JOB_APPS_FALLBACK_FILE = path.join(process.cwd(), 'job-applications-fallback-db.json');
const STORIES_FALLBACK_FILE = path.join(process.cwd(), 'success-stories-fallback-db.json');
const PROJECTS_FALLBACK_FILE = path.join(process.cwd(), 'project-showcase-fallback-db.json');
const RESOURCES_FALLBACK_FILE = path.join(process.cwd(), 'career-resources-fallback-db.json');
const PARTNERS_FALLBACK_FILE = path.join(process.cwd(), 'employer-partners-fallback-db.json');
const HIGHLIGHTS_FALLBACK_FILE = path.join(process.cwd(), 'homepage-highlights-fallback-db.json');

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

const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Junior Frontend Developer',
    company: 'Moniepoint Nigeria',
    location: 'Lagos',
    type: 'Hybrid',
    roleType: 'Entry-level',
    description: 'Build and style reactive interfaces with React and Tailwind CSS. Coordinate with UI/UX researchers to deploy responsive widgets.',
    stipend: '₦220,000 / month',
    datePosted: new Date().toISOString().split('T')[0],
    skills: 'JavaScript, React, Tailwind, HTML, CSS',
    status: 'Published',
    createdAt: new Date().toISOString(),
    applications: []
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company: 'Sterling Bank',
    location: 'Lagos',
    type: 'On-site',
    roleType: 'Internship',
    description: 'Compile daily and weekly transactional sheets, execute SQL queries to analyze customer retention, and draft dashboard reports in Power BI.',
    stipend: '₦120,000 / month',
    datePosted: new Date().toISOString().split('T')[0],
    skills: 'SQL, Excel, Power BI, Data Cleaning',
    status: 'Published',
    createdAt: new Date().toISOString(),
    applications: []
  },
  {
    id: 3,
    title: 'Junior Software Engineer (Node.js)',
    company: 'Paystack',
    location: 'Remote',
    type: 'Remote',
    roleType: 'Entry-level',
    description: 'Develop responsive server REST APIs and connect secure relational databases. Troubleshoot backend routes and maintain optimal server speeds.',
    stipend: '₦250,000 / month',
    datePosted: new Date().toISOString().split('T')[0],
    skills: 'JavaScript, Node.js, Express, SQL, Git',
    status: 'Published',
    createdAt: new Date().toISOString(),
    applications: []
  },
  {
    id: 4,
    title: 'Cybersecurity Analyst Intern',
    company: 'Sterling Bank',
    location: 'Lagos',
    type: 'Hybrid',
    roleType: 'Internship',
    description: 'Conduct vulnerability scanning audits and secure data paths. Trace network packet logs in Wireshark and prepare diagnostic security briefings.',
    stipend: '₦150,000 / month',
    datePosted: new Date().toISOString().split('T')[0],
    skills: 'Wireshark, Nmap, SIEM, Threat Auditing, Network Security',
    status: 'Published',
    createdAt: new Date().toISOString(),
    applications: []
  },
  {
    id: 5,
    title: 'AI & Automation Trainee',
    company: 'Flutterwave',
    location: 'Lagos',
    type: 'Hybrid',
    roleType: 'Graduate Trainee',
    description: 'Implement enterprise automation workflows using LLMs, Zapier, and Python scripts to optimize merchant operations.',
    stipend: '₦180,000 / month',
    datePosted: new Date().toISOString().split('T')[0],
    skills: 'Python, Zapier, Make.com, Prompt Engineering, API Integrations',
    status: 'Published',
    createdAt: new Date().toISOString(),
    applications: []
  }
];

const INITIAL_STORIES = [
  {
    id: 1,
    name: 'Samuel Okon',
    nyscBatch: '2025 Batch A Stream I',
    courseEnrolled: 'Full Stack Web Development',
    currentRole: 'Junior Frontend Engineer',
    company: 'Moniepoint Nigeria',
    story: 'Olatech School gave me the structured React and Tailwind training that transformed my NYSC year. Within 4 months of completing my capstone project, I secured a full-time role at Moniepoint!',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    linkedInUrl: 'https://linkedin.com/in/samuelokon-corpers',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Amina Aliyu',
    nyscBatch: '2025 Batch B Stream I',
    courseEnrolled: 'Data Analytics & Business Intelligence',
    currentRole: 'Data Analyst',
    company: 'Access Bank Plc',
    story: 'Learning SQL and Power BI at Olatech while serving in Lagos was the best decision of my life. The career coaching and CV reviews directly prepared me for my technical interviews.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    linkedInUrl: 'https://linkedin.com/in/aminaaliyu-data',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Yusuf Kolawole',
    nyscBatch: '2025 Batch A Stream II',
    courseEnrolled: 'Cybersecurity Operations',
    currentRole: 'SOC Analyst Trainee',
    company: 'Sterling Bank',
    story: 'The hands-on lab audits using Wireshark and SIEM tools made me stand out from hundreds of applicants during corporate placement rounds.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    linkedInUrl: 'https://linkedin.com/in/yusufkolawole-sec',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'NYSC CDS Smart Attendance System',
    studentName: 'Samuel Okon',
    course: 'Full Stack Web Development',
    description: 'A geolocation-based attendance verification web application built for local government inspectors to monitor weekly CDS sessions seamlessly.',
    techStack: 'React, Tailwind CSS, Node.js, Express, SQLite',
    liveUrl: 'https://nysc-smart-attendance.vercel.app',
    githubUrl: 'https://github.com/samuelokon-dev/nysc-attendance',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Hospital Patient Flow Analytics Dashboard',
    studentName: 'Amina Aliyu',
    course: 'Data Analytics & Business Intelligence',
    description: 'An interactive Power BI dashboard analyzing outpatient waiting times and bed occupancy across 5 general hospitals in Lagos State.',
    techStack: 'SQL, Power BI, Excel, Data Cleaning',
    liveUrl: 'https://app.powerbi.com/view?r=eyJrIjoiEXAMPLE',
    githubUrl: 'https://github.com/aminaaliyu/patient-flow-analytics',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Automated Campus Security Incident Alert Engine',
    studentName: 'Yusuf Kolawole',
    course: 'Cybersecurity Operations',
    description: 'A Python-based network log analyzer that detects unauthorized port scans and automatically sends Telegram security alerts to administrators.',
    techStack: 'Python, Wireshark, Fast API, Telegram Bot API',
    liveUrl: 'https://github.com/yusufkolawole-sec/campus-alert-engine',
    githubUrl: 'https://github.com/yusufkolawole-sec/campus-alert-engine',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  }
];

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

const INITIAL_PARTNERS = [
  { id: 1, name: 'Moniepoint Nigeria', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', websiteUrl: 'https://moniepoint.com', industry: 'Fintech', partnershipLevel: 'Gold', activeRolesCount: 3, createdAt: new Date().toISOString() },
  { id: 2, name: 'Sterling Bank Plc', logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=150&auto=format&fit=crop&q=80', websiteUrl: 'https://sterling.ng', industry: 'Banking', partnershipLevel: 'Platinum', activeRolesCount: 2, createdAt: new Date().toISOString() },
  { id: 3, name: 'Paystack', logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80', websiteUrl: 'https://paystack.com', industry: 'Fintech', partnershipLevel: 'Gold', activeRolesCount: 1, createdAt: new Date().toISOString() },
  { id: 4, name: 'Flutterwave', logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80', websiteUrl: 'https://flutterwave.com', industry: 'Fintech', partnershipLevel: 'Silver', activeRolesCount: 1, createdAt: new Date().toISOString() },
  { id: 5, name: 'Andela Nigeria', logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', websiteUrl: 'https://andela.com', industry: 'Software Engineering', partnershipLevel: 'Platinum', activeRolesCount: 4, createdAt: new Date().toISOString() }
];

const INITIAL_HIGHLIGHTS = [
  { id: 1, title: '1,250+ Corps Members Enrolled', description: 'Empowering NYSC batch members across 36 states and FCT with high-demand digital skills.', icon: 'Users', displayOrder: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 2, title: '85% Corporate Placement Rate', description: 'Direct talent pipelines to top fintechs, banking institutions, and global tech hubs.', icon: 'Briefcase', displayOrder: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 3, title: '₦250,000 Average Starting Stipend', description: 'Competitive remuneration packages negotiated for certified Olatech program graduates.', icon: 'Award', displayOrder: 3, isActive: true, createdAt: new Date().toISOString() }
];

export class ContentRepository {
  // ==========================================
  // JOBS
  // ==========================================
  static async getAllJobs(filters: any = {}): Promise<any[]> {
    try {
      const prisma = getPrisma();
      const where: any = {};
      if (filters.status) where.status = filters.status;
      return await prisma.jobOpportunity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { applications: true }
      });
    } catch (error) {
    const jobs = loadFallback<any>(JOBS_FALLBACK_FILE, INITIAL_JOBS);

    if (filters.status) {
        return jobs.filter(j => j.status === filters.status);
    }

    return jobs;
}
  }

  static async getJobById(id: number): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.jobOpportunity.findUnique({
        where: { id },
        include: { applications: true }
      });
    } catch (error) {
      const jobs = loadFallback<any>(JOBS_FALLBACK_FILE, INITIAL_JOBS);
      return jobs.find(j => j.id === id) || null;
    }
  }

  static async createJob(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.jobOpportunity.create({ data });
    } catch (error) {
      const jobs = loadFallback<any>(JOBS_FALLBACK_FILE, INITIAL_JOBS);
      const newJob = {
        id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id || 0)) + 1 : 1,
        ...data,
        datePosted: data.datePosted || new Date().toISOString().split('T')[0],
        status: data.status || 'Published',
        createdAt: new Date().toISOString(),
        applications: []
      };
      jobs.unshift(newJob);
      saveFallback(JOBS_FALLBACK_FILE, jobs);
      return newJob;
    }
  }

  static async updateJob(id: number, data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.jobOpportunity.update({ where: { id }, data });
    } catch (error) {
      const jobs = loadFallback<any>(JOBS_FALLBACK_FILE, INITIAL_JOBS);
      const idx = jobs.findIndex(j => j.id === id);
      if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...data };
        saveFallback(JOBS_FALLBACK_FILE, jobs);
        return jobs[idx];
      }
      throw new Error('Job not found');
    }
  }

  static async deleteJob(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.jobApplication.deleteMany({ where: { jobOpportunityId: id } });
      await prisma.jobOpportunity.delete({ where: { id } });
    } catch (error) {
      const jobs = loadFallback<any>(JOBS_FALLBACK_FILE, INITIAL_JOBS);
      const updated = jobs.filter(j => j.id !== id);
      saveFallback(JOBS_FALLBACK_FILE, updated);
    }
  }

  // Helper for RecruitmentController synchronization
  static async createOrUpdatePublicJob(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      const existing = await prisma.jobOpportunity.findFirst({
        where: { title: data.title, company: data.company }
      });
      if (existing) {
        return await prisma.jobOpportunity.update({ where: { id: existing.id }, data });
      } else {
        return await prisma.jobOpportunity.create({ data });
      }
    } catch (error) {
      const jobs = loadFallback<any>(JOBS_FALLBACK_FILE, INITIAL_JOBS);
      const existingIdx = jobs.findIndex(j => j.title.toLowerCase() === data.title.toLowerCase() && j.company.toLowerCase() === data.company.toLowerCase());
      if (existingIdx !== -1) {
        jobs[existingIdx] = { ...jobs[existingIdx], ...data };
        saveFallback(JOBS_FALLBACK_FILE, jobs);
        return jobs[existingIdx];
      } else {
        const newJob = {
          id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id || 0)) + 1 : 1,
          ...data,
          status: data.status || 'Published',
          createdAt: new Date().toISOString(),
          applications: []
        };
        jobs.unshift(newJob);
        saveFallback(JOBS_FALLBACK_FILE, jobs);
        return newJob;
      }
    }
  }

  // ==========================================
  // JOB APPLICATIONS
  // ==========================================
  static async getAllJobApplications(): Promise<any[]> {
    try {
      const prisma = getPrisma();
      return await prisma.jobApplication.findMany({
        orderBy: { createdAt: 'desc' },
        include: { jobOpportunity: true }
      });
    } catch (error) {
      const apps = loadFallback<any>(JOB_APPS_FALLBACK_FILE, []);
      return apps;
    }
  }

  static async applyForJob(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.jobApplication.create({ data });
    } catch (error) {
      const apps = loadFallback<any>(JOB_APPS_FALLBACK_FILE, []);
      const newApp = {
        id: apps.length > 0 ? Math.max(...apps.map(a => a.id || 0)) + 1 : 1,
        ...data,
        status: 'Applied',
        appliedAt: new Date().toISOString()
      };
      apps.unshift(newApp);
      saveFallback(JOB_APPS_FALLBACK_FILE, apps);
      return newApp;
    }
  }

  static async updateJobApplicationStatus(id: number, status: string): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.jobApplication.update({ where: { id }, data: { status } });
    } catch (error) {
      const apps = loadFallback<any>(JOB_APPS_FALLBACK_FILE, []);
      const idx = apps.findIndex(a => a.id === id);
      if (idx !== -1) {
        apps[idx].status = status;
        saveFallback(JOB_APPS_FALLBACK_FILE, apps);
        return apps[idx];
      }
      throw new Error('Application not found');
    }
  }

  static async deleteJobApplication(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.jobApplication.delete({ where: { id } });
    } catch (error) {
      const apps = loadFallback<any>(JOB_APPS_FALLBACK_FILE, []);
      saveFallback(JOB_APPS_FALLBACK_FILE, apps.filter(a => a.id !== id));
    }
  }

  // ==========================================
  // SUCCESS STORIES
  // ==========================================
  static async getAllSuccessStories(): Promise<any[]> {
    try {
      const prisma = getPrisma();
      return await prisma.successStory.findMany({ orderBy: { createdAt: 'desc' } });
    } catch (error) {
      const stories = loadFallback<any>(STORIES_FALLBACK_FILE, INITIAL_STORIES);
      return stories;
    }
  }

  static async createSuccessStory(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.successStory.create({ data });
    } catch (error) {
      const stories = loadFallback<any>(STORIES_FALLBACK_FILE, INITIAL_STORIES);
      const newStory = {
        id: stories.length > 0 ? Math.max(...stories.map(s => s.id || 0)) + 1 : 1,
        ...data,
        createdAt: new Date().toISOString()
      };
      stories.unshift(newStory);
      saveFallback(STORIES_FALLBACK_FILE, stories);
      return newStory;
    }
  }

  static async updateSuccessStory(id: number, data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.successStory.update({ where: { id }, data });
    } catch (error) {
      const stories = loadFallback<any>(STORIES_FALLBACK_FILE, INITIAL_STORIES);
      const idx = stories.findIndex(s => s.id === id);
      if (idx !== -1) {
        stories[idx] = { ...stories[idx], ...data };
        saveFallback(STORIES_FALLBACK_FILE, stories);
        return stories[idx];
      }
      throw new Error('Story not found');
    }
  }

  static async deleteSuccessStory(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.successStory.delete({ where: { id } });
    } catch (error) {
      const stories = loadFallback<any>(STORIES_FALLBACK_FILE, INITIAL_STORIES);
      saveFallback(STORIES_FALLBACK_FILE, stories.filter(s => s.id !== id));
    }
  }

  // ==========================================
  // PROJECT SHOWCASE
  // ==========================================
  static async getAllProjects(): Promise<any[]> {
    try {
      const prisma = getPrisma();
      return await prisma.projectShowcase.findMany({ orderBy: { createdAt: 'desc' } });
    } catch (error) {
      const projects = loadFallback<any>(PROJECTS_FALLBACK_FILE, INITIAL_PROJECTS);
      return projects;
    }
  }

  static async createProject(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.projectShowcase.create({ data });
    } catch (error) {
      const projects = loadFallback<any>(PROJECTS_FALLBACK_FILE, INITIAL_PROJECTS);
      const newProject = {
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id || 0)) + 1 : 1,
        ...data,
        createdAt: new Date().toISOString()
      };
      projects.unshift(newProject);
      saveFallback(PROJECTS_FALLBACK_FILE, projects);
      return newProject;
    }
  }

  static async updateProject(id: number, data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.projectShowcase.update({ where: { id }, data });
    } catch (error) {
      const projects = loadFallback<any>(PROJECTS_FALLBACK_FILE, INITIAL_PROJECTS);
      const idx = projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        projects[idx] = { ...projects[idx], ...data };
        saveFallback(PROJECTS_FALLBACK_FILE, projects);
        return projects[idx];
      }
      throw new Error('Project not found');
    }
  }

  static async deleteProject(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.projectShowcase.delete({ where: { id } });
    } catch (error) {
      const projects = loadFallback<any>(PROJECTS_FALLBACK_FILE, INITIAL_PROJECTS);
      saveFallback(PROJECTS_FALLBACK_FILE, projects.filter(p => p.id !== id));
    }
  }

  // ==========================================
  // CAREER RESOURCES
  // ==========================================
  static async getAllResources(categoryFilter?: string): Promise<any[]> {
    try {
      const prisma = getPrisma();
      const where: any = {};
      if (categoryFilter) where.category = categoryFilter;
      return await prisma.careerResource.findMany({ where, orderBy: { createdAt: 'desc' } });
    } catch (error) {
      const resources = loadFallback<any>(RESOURCES_FALLBACK_FILE, INITIAL_RESOURCES);
      if (categoryFilter) return resources.filter(r => r.category === categoryFilter);
      return resources;
    }
  }

  static async getResourceById(id: number): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.careerResource.findUnique({ where: { id } });
    } catch (error) {
      const resources = loadFallback<any>(RESOURCES_FALLBACK_FILE, INITIAL_RESOURCES);
      return resources.find(r => r.id === id) || null;
    }
  }

  static async createResource(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.careerResource.create({ data });
    } catch (error) {
      const resources = loadFallback<any>(RESOURCES_FALLBACK_FILE, INITIAL_RESOURCES);
      const newRes = {
        id: resources.length > 0 ? Math.max(...resources.map(r => r.id || 0)) + 1 : 1,
        ...data,
        downloadCount: data.downloadCount || 0,
        createdAt: new Date().toISOString()
      };
      resources.unshift(newRes);
      return newRes;
    }
  }

  static async updateResource(id: number, data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.careerResource.update({ where: { id }, data });
    } catch (error) {
      const resources = loadFallback<any>(RESOURCES_FALLBACK_FILE, INITIAL_RESOURCES);
      const idx = resources.findIndex(r => r.id === id);
      if (idx !== -1) {
        resources[idx] = { ...resources[idx], ...data };
        return resources[idx];
      }
      throw new Error('Resource not found');
    }
  }

  static async deleteResource(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.careerResource.delete({ where: { id } });
    } catch (error) {
      const resources = loadFallback<any>(RESOURCES_FALLBACK_FILE, INITIAL_RESOURCES);
      saveFallback(RESOURCES_FALLBACK_FILE, resources.filter(r => r.id !== id));
    }
  }

  // ==========================================
  // EMPLOYER PARTNERS
  // ==========================================
  static async getAllPartners(): Promise<any[]> {
    try {
      const prisma = getPrisma();
      return await prisma.employerPartner.findMany({ orderBy: { createdAt: 'desc' } });
    } catch (error) {
      const partners = loadFallback<any>(PARTNERS_FALLBACK_FILE, INITIAL_PARTNERS);
      return partners;
    }
  }

  static async createPartner(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.employerPartner.create({ data });
    } catch (error) {
      const partners = loadFallback<any>(PARTNERS_FALLBACK_FILE, INITIAL_PARTNERS);
      const newP = {
        id: partners.length > 0 ? Math.max(...partners.map(p => p.id || 0)) + 1 : 1,
        ...data,
        activeRolesCount: data.activeRolesCount || 0,
        createdAt: new Date().toISOString()
      };
      partners.unshift(newP);
      saveFallback(PARTNERS_FALLBACK_FILE, partners);
      return newP;
    }
  }

  static async updatePartner(id: number, data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.employerPartner.update({ where: { id }, data });
    } catch (error) {
      const partners = loadFallback<any>(PARTNERS_FALLBACK_FILE, INITIAL_PARTNERS);
      const idx = partners.findIndex(p => p.id === id);
      if (idx !== -1) {
        partners[idx] = { ...partners[idx], ...data };
        saveFallback(PARTNERS_FALLBACK_FILE, partners);
        return partners[idx];
      }
      throw new Error('Partner not found');
    }
  }

  static async deletePartner(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.employerPartner.delete({ where: { id } });
    } catch (error) {
      const partners = loadFallback<any>(PARTNERS_FALLBACK_FILE, INITIAL_PARTNERS);
      saveFallback(PARTNERS_FALLBACK_FILE, partners.filter(p => p.id !== id));
    }
  }

  // ==========================================
  // HOMEPAGE HIGHLIGHTS
  // ==========================================
  static async getAllHighlights(): Promise<any[]> {
    try {
      const prisma = getPrisma();
      return await prisma.homepageHighlight.findMany({ orderBy: { id: 'asc' } });
    } catch (error) {
      const hils = loadFallback<any>(HIGHLIGHTS_FALLBACK_FILE, INITIAL_HIGHLIGHTS);
      return hils;
    }
  }

  static async createHighlight(data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.homepageHighlight.create({ data });
    } catch (error) {
      const hils = loadFallback<any>(HIGHLIGHTS_FALLBACK_FILE, INITIAL_HIGHLIGHTS);
      const newH = {
        id: hils.length > 0 ? Math.max(...hils.map(h => h.id || 0)) + 1 : 1,
        ...data,
        displayOrder: data.displayOrder || hils.length + 1,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date().toISOString()
      };
      hils.push(newH);
      saveFallback(HIGHLIGHTS_FALLBACK_FILE, hils);
      return newH;
    }
  }

  static async updateHighlight(id: number, data: any): Promise<any> {
    try {
      const prisma = getPrisma();
      return await prisma.homepageHighlight.update({ where: { id }, data });
    } catch (error) {
      const hils = loadFallback<any>(HIGHLIGHTS_FALLBACK_FILE, INITIAL_HIGHLIGHTS);
      const idx = hils.findIndex(h => h.id === id);
      if (idx !== -1) {
        hils[idx] = { ...hils[idx], ...data };
        saveFallback(HIGHLIGHTS_FALLBACK_FILE, hils);
        return hils[idx];
      }
      throw new Error('Highlight not found');
    }
  }

  static async deleteHighlight(id: number): Promise<void> {
    try {
      const prisma = getPrisma();
      await prisma.homepageHighlight.delete({ where: { id } });
    } catch (error) {
      const hils = loadFallback<any>(HIGHLIGHTS_FALLBACK_FILE, INITIAL_HIGHLIGHTS);
      saveFallback(HIGHLIGHTS_FALLBACK_FILE, hils.filter(h => h.id !== id));
    }
  }
}
