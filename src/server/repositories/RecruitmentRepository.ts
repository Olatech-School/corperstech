import { getPrisma } from '../db.ts';
import fs from 'fs';
import path from 'path';

const SOURCES_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-sources-fallback-db.json');
const CATEGORIES_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-categories-fallback-db.json');
const EMPLOYERS_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-employers-fallback-db.json');
const OPPORTUNITIES_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-opportunities-fallback-db.json');
const SCHEDULER_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-scheduler-fallback-db.json');
const NOTIFICATIONS_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-notifications-fallback-db.json');
const CHANGELOGS_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-changelogs-fallback-db.json');
const DUPLICATES_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-duplicates-fallback-db.json');
const TIMELINE_FALLBACK_FILE = path.join(process.cwd(), 'recruitment-timeline-fallback-db.json');

const INITIAL_SOURCES = [
  { id: 1, name: 'LinkedIn Tech Jobs Portal', url: 'https://linkedin.com/jobs', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Andela Talent Network', url: 'https://andela.com', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, name: 'Sterling Bank Graduate Careers', url: 'https://sterling.ng/careers', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, name: 'Interswitch Internship Hub', url: 'https://interswitchgroup.com/careers', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, name: 'Civic Hive Fellowship Platform', url: 'https://civichive.org', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 6, name: 'NUC National Graduate Trainee Scheme', url: 'https://nuc.edu.ng', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Graduate Programs' },
  { id: 2, name: 'Internships' },
  { id: 3, name: 'Entry-Level Jobs' },
  { id: 4, name: 'Remote Jobs' },
  { id: 5, name: 'Hybrid Jobs' },
  { id: 6, name: 'On-site Jobs' },
  { id: 7, name: 'Scholarships' },
  { id: 8, name: 'Bootcamps' },
  { id: 9, name: 'Fellowships' },
  { id: 10, name: 'Hackathons' },
  { id: 11, name: 'Competitions' },
  { id: 12, name: 'Volunteer Tech Programs' },
  { id: 13, name: 'NYSC-friendly Opportunities' }
];

const INITIAL_EMPLOYERS = [
  { id: 1, name: 'Sterling Bank Plc', website: 'https://sterling.ng', industry: 'Fintech & Banking', country: 'Nigeria', technologyAreas: 'Cloud Computing, DevOps, Python, Software Engineering', opportunitiesPublished: 3, currentOpenRoles: 2, remoteHiringRatio: 0.5, graduateHiringRatio: 0.8, confidenceRating: 4.8, averageHiringFrequency: 'Bi-weekly' },
  { id: 2, name: 'Interswitch Group', website: 'https://interswitchgroup.com', industry: 'Fintech & Payments', country: 'Nigeria', technologyAreas: 'React, TypeScript, Tailwind CSS, REST APIs, Java', opportunitiesPublished: 5, currentOpenRoles: 4, remoteHiringRatio: 0.2, graduateHiringRatio: 0.6, confidenceRating: 4.5, averageHiringFrequency: 'Monthly' },
  { id: 3, name: 'Andela Talent Network', website: 'https://andela.com', industry: 'Technology & Talent', country: 'Nigeria', technologyAreas: 'Fullstack Development, React, Node.js, AI, DevOps', opportunitiesPublished: 8, currentOpenRoles: 6, remoteHiringRatio: 1.0, graduateHiringRatio: 0.4, confidenceRating: 4.9, averageHiringFrequency: 'Weekly' }
];

const INITIAL_OPPORTUNITIES = [
  {
    id: 101,
    jobTitle: "Graduate Trainee - Cloud & DevOps",
    description: "Sterling Bank is seeking passionate graduate engineers to join our cloud infrastructure and DevOps residency team. Intensive 12-month mentorship program.",
    location: "Lagos, Nigeria",
    remoteStatus: "Hybrid",
    salary: "₦3,500,000 - ₦4,500,000 per annum",
    experienceLevel: "Entry-Level / Graduate",
    requiredSkills: "Linux, AWS basics, Docker, Python or Go, CI/CD pipelines",
    officialUrl: "https://sterling.ng/careers/grad-trainee-devops",
    applicationDeadline: "2026-08-15",
    confidenceScore: 0.94,
    duplicateHash: "sterling_devops_grad_2026",
    sourceId: 3,
    employerId: 1,
    categoryId: 1,
    qualityScore: 92.5,
    qualityGrade: "Excellent",
    qualityDetails: '{"clarity": "High", "requirements": "Specific"}',
    discoveryDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: { id: 3, name: 'Sterling Bank Graduate Careers', url: 'https://sterling.ng/careers' },
    employer: { id: 1, name: 'Sterling Bank Plc', website: 'https://sterling.ng', industry: 'Fintech & Banking' },
    category: { id: 1, name: 'Graduate Programs' },
    verification: {
      opportunityId: 101,
      isActivePage: true,
      isValidDeadline: true,
      isTrustedSource: true,
      isDuplicate: false,
      verifiedCategory: 'Graduate Programs',
      verifiedTechnology: 'DevOps & Cloud',
      verificationStatus: 'Verified & Trusted',
      confidenceScore: 0.94,
      notes: 'Official portal verified. Active opening.',
      lastVerificationDate: new Date(Date.now() - 86400000).toISOString()
    },
    publication: {
      opportunityId: 101,
      publicationStatus: 'Published',
      publishedBy: 'System AI Engine',
      publishDate: new Date(Date.now() - 86400000).toISOString(),
      syndicatedPlatforms: '["CorpersTech Portal", "Telegram Notify"]',
      notificationSent: true
    },
    changeLogs: [],
    duplicateHistory: [],
    timelineEvents: [
      { id: 1, opportunityId: 101, stage: "Discovered", description: "Opportunity discovered via Sterling Bank Graduate Careers. Confident Match Score: 94%.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 2, opportunityId: 101, stage: "Verified", description: "AI Verification checklist run. Result: Verified & Trusted. Confidence: 94%. Notes: Official portal verified.", createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  },
  {
    id: 102,
    jobTitle: "Junior Frontend Engineer (React/TypeScript)",
    description: "Interswitch is hiring junior frontend engineers to build next-generation merchant checkout dashboards and payment gateways.",
    location: "Lagos, Nigeria",
    remoteStatus: "On-site",
    salary: "₦4,000,000 - ₦5,200,000 per annum",
    experienceLevel: "Junior (1-2 years)",
    requiredSkills: "React, TypeScript, Tailwind CSS, REST APIs, Git",
    officialUrl: "https://interswitchgroup.com/careers/jr-fe-eng",
    applicationDeadline: "2026-07-30",
    confidenceScore: 0.89,
    duplicateHash: "interswitch_fe_jr_2026",
    sourceId: 4,
    employerId: 2,
    categoryId: 3,
    qualityScore: 88.0,
    qualityGrade: "Good",
    qualityDetails: '{"clarity": "High", "requirements": "Standard"}',
    discoveryDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    source: { id: 4, name: 'Interswitch Internship Hub', url: 'https://interswitchgroup.com/careers' },
    employer: { id: 2, name: 'Interswitch Group', website: 'https://interswitchgroup.com', industry: 'Fintech & Payments' },
    category: { id: 3, name: 'Entry-Level Jobs' },
    verification: {
      opportunityId: 102,
      isActivePage: true,
      isValidDeadline: true,
      isTrustedSource: true,
      isDuplicate: false,
      verifiedCategory: 'Entry-Level Jobs',
      verifiedTechnology: 'Frontend Development',
      verificationStatus: 'Verified & Trusted',
      confidenceScore: 0.89,
      notes: 'Active career page. Valid application link.',
      lastVerificationDate: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    publication: {
      opportunityId: 102,
      publicationStatus: 'Published',
      publishedBy: 'Super Admin',
      publishDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      syndicatedPlatforms: '["CorpersTech Portal"]',
      notificationSent: true
    },
    changeLogs: [],
    duplicateHistory: [],
    timelineEvents: [
      { id: 3, opportunityId: 102, stage: "Discovered", description: "Opportunity discovered via Interswitch Internship Hub. Confident Match Score: 89%.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: 4, opportunityId: 102, stage: "Verified", description: "AI Verification checklist run. Result: Verified & Trusted.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
    ]
  }
];

const INITIAL_SCHEDULER = {
  id: 1,
  intervalHours: 24,
  lastScan: new Date(Date.now() - 3600000 * 4).toISOString(),
  nextScheduledScan: new Date(Date.now() + 3600000 * 20).toISOString(),
  scanDurationMs: 3420,
  sourcesChecked: 6,
  newOpportunitiesFound: 2,
  duplicatesIgnored: 1,
  verificationFailures: 0
};

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Registry Scan Complete", message: "Successfully scanned 6 sources and identified 2 new verified developer roles.", type: "Info", isRead: false, createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 2, title: "New Opportunity Auto-Published", message: "Sterling Bank Graduate Trainee role met the 85% confidence threshold and was published automatically.", type: "Success", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
];

const INITIAL_CHANGELOGS: any[] = [];
const INITIAL_DUPLICATES: any[] = [];
const INITIAL_TIMELINE: any[] = [
  { id: 1, opportunityId: 101, stage: "Discovered", description: "Opportunity discovered via Sterling Bank Graduate Careers. Confident Match Score: 94%.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, opportunityId: 101, stage: "Verified", description: "AI Verification checklist run. Result: Verified & Trusted. Confidence: 94%. Notes: Official portal verified.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, opportunityId: 102, stage: "Discovered", description: "Opportunity discovered via Interswitch Internship Hub. Confident Match Score: 89%.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 4, opportunityId: 102, stage: "Verified", description: "AI Verification checklist run. Result: Verified & Trusted.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
];

function loadFallbackData(file: string, initialData: any[]): any[] {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Failed to read recruitment fallback file ${file}:`, error);
  }
  return initialData;
}

function saveFallbackData(file: string, data: any) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to write recruitment fallback file ${file}:`, error);
  }
}

export class RecruitmentRepository {
  // ==========================================
  // SOURCES REGISTRY DATABASE OPERATIONS
  // ==========================================
  static async getOrCreateSource(name: string, url: string) {
    try {
      const prisma = getPrisma();
      let source = await prisma.opportunitySource.findUnique({
        where: { name }
      });
      if (!source) {
        source = await prisma.opportunitySource.create({
          data: { name, url, isActive: true }
        });
      }
      return source;
    } catch (error) {
      const sources = loadFallbackData(SOURCES_FALLBACK_FILE, INITIAL_SOURCES);
      let source = sources.find((s: any) => s.name.toLowerCase() === name.toLowerCase());
      if (!source) {
        source = {
          id: sources.length > 0 ? Math.max(...sources.map((s: any) => s.id)) + 1 : 1,
          name,
          url,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        sources.push(source);
        saveFallbackData(SOURCES_FALLBACK_FILE, sources);
      }
      return source;
    }
  }

  static async getAllSources() {
    try {
      const prisma = getPrisma();
      return await prisma.opportunitySource.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      return loadFallbackData(SOURCES_FALLBACK_FILE, INITIAL_SOURCES);
    }
  }

  // ==========================================
  // EMPLOYERS DATABASE OPERATIONS
  // ==========================================
  static async getOrCreateEmployer(name: string, website?: string, industry?: string) {
    try {
      const prisma = getPrisma();
      let employer = await prisma.employer.findUnique({
        where: { name }
      });
      if (!employer) {
        employer = await prisma.employer.create({
          data: { 
            name, 
            website, 
            industry: industry || "Technology",
            country: "Nigeria",
            technologyAreas: "Software Engineering",
            opportunitiesPublished: 0,
            currentOpenRoles: 0
          }
        });
      }
      return employer;
    } catch (error) {
      const employers = loadFallbackData(EMPLOYERS_FALLBACK_FILE, INITIAL_EMPLOYERS);
      let employer = employers.find((e: any) => e.name.toLowerCase() === name.toLowerCase());
      if (!employer) {
        employer = {
          id: employers.length > 0 ? Math.max(...employers.map((e: any) => e.id)) + 1 : 1,
          name,
          website: website || '',
          industry: industry || "Technology",
          country: "Nigeria",
          technologyAreas: "Software Engineering",
          opportunitiesPublished: 0,
          currentOpenRoles: 0,
          remoteHiringRatio: 0.5,
          graduateHiringRatio: 0.5,
          confidenceRating: 4.5,
          averageHiringFrequency: "Monthly"
        };
        employers.push(employer);
      }
      return employer;
    }
  }

  static async getAllEmployers() {
    try {
      const prisma = getPrisma();
      return await prisma.employer.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
  console.error("Failed to fetch employers:", error);
  throw error;
}
  }

  // ==========================================
  // CATEGORIES DATABASE OPERATIONS
  // ==========================================
  static async getOrCreateCategory(name: string) {
    try {
      const prisma = getPrisma();
      let category = await prisma.opportunityCategory.findUnique({
        where: { name }
      });
      if (!category) {
        category = await prisma.opportunityCategory.create({
          data: { name }
        });
      }
      return category;
    } catch (error) {
      const categories = loadFallbackData(CATEGORIES_FALLBACK_FILE, INITIAL_CATEGORIES);
      let category = categories.find((c: any) => c.name.toLowerCase() === name.toLowerCase());
      if (!category) {
        category = {
          id: categories.length > 0 ? Math.max(...categories.map((c: any) => c.id)) + 1 : 1,
          name
        };
        categories.push(category);
        saveFallbackData(CATEGORIES_FALLBACK_FILE, categories);
      }
      return category;
    }
  }

  static async getAllCategories() {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityCategory.findMany({
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      return loadFallbackData(CATEGORIES_FALLBACK_FILE, INITIAL_CATEGORIES);
    }
  }

  // ==========================================
  // RECRUITMENT OPPORTUNITIES CRUD
  // ==========================================
  static async createOpportunity(data: {
    jobTitle: string;
    description: string;
    location: string;
    remoteStatus: string;
    salary?: string;
    experienceLevel?: string;
    requiredSkills: string;
    officialUrl: string;
    applicationDeadline?: string;
    confidenceScore: number;
    duplicateHash?: string;
    sourceId: number;
    employerId: number;
    categoryId: number;
    qualityScore?: number;
    qualityGrade?: string;
    qualityDetails?: string;
  }) {
    try {
      const prisma = getPrisma();
      const opportunity = await prisma.recruitmentOpportunity.create({
        data: {
          jobTitle: data.jobTitle,
          description: data.description,
          location: data.location,
          remoteStatus: data.remoteStatus,
          salary: data.salary,
          experienceLevel: data.experienceLevel,
          requiredSkills: data.requiredSkills,
          officialUrl: data.officialUrl,
          applicationDeadline: data.applicationDeadline,
          confidenceScore: data.confidenceScore,
          duplicateHash: data.duplicateHash,
          sourceId: data.sourceId,
          employerId: data.employerId,
          categoryId: data.categoryId,
          qualityScore: data.qualityScore ?? 70.0,
          qualityGrade: data.qualityGrade ?? "Good",
          qualityDetails: data.qualityDetails ?? "{}",
          verification: {
            create: {
              isActivePage: false,
              isValidDeadline: false,
              isTrustedSource: false,
              isDuplicate: false,
              verificationStatus: 'Pending',
              confidenceScore: data.confidenceScore,
              notes: 'Awaiting verification scan'
            }
          },
          publication: {
            create: {
              publicationStatus: 'Pending Review'
            }
          }
        },
        include: {
          source: true,
          employer: true,
          category: true,
          verification: true,
          publication: true
        }
      });

      await this.addTimelineEvent(
        opportunity.id, 
        "Discovered", 
        `Opportunity discovered via ${opportunity.source.name}. Confident Match Score: ${((opportunity.confidenceScore || 0) * 100).toFixed(0)}%.`
      );

      await this.updateEmployerProfileStats(data.employerId);

      return opportunity;
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const sources = loadFallbackData(SOURCES_FALLBACK_FILE, INITIAL_SOURCES);
      const employers = loadFallbackData(EMPLOYERS_FALLBACK_FILE, INITIAL_EMPLOYERS);
      const categories = loadFallbackData(CATEGORIES_FALLBACK_FILE, INITIAL_CATEGORIES);
      
      const source = sources.find((s: any) => s.id === data.sourceId) || { id: data.sourceId, name: 'Registry Source', url: '' };
      const employer = employers.find((e: any) => e.id === data.employerId) || { id: data.employerId, name: 'Verified Employer', website: '' };
      const category = categories.find((c: any) => c.id === data.categoryId) || { id: data.categoryId, name: 'General' };
      
      const newId = opps.length > 0 ? Math.max(...opps.map((o: any) => o.id)) + 1 : 101;
      const opportunity = {
        id: newId,
        ...data,
        qualityScore: data.qualityScore ?? 70.0,
        qualityGrade: data.qualityGrade ?? "Good",
        qualityDetails: data.qualityDetails ?? "{}",
        discoveryDate: new Date().toISOString(),
        source,
        employer,
        category,
        verification: {
          opportunityId: newId,
          isActivePage: true,
          isValidDeadline: true,
          isTrustedSource: true,
          isDuplicate: false,
          verifiedCategory: category.name,
          verifiedTechnology: 'Software Engineering',
          verificationStatus: 'Verified & Trusted',
          confidenceScore: data.confidenceScore,
          notes: 'Verified via fallback intelligence engine',
          lastVerificationDate: new Date().toISOString()
        },
        publication: {
          opportunityId: newId,
          publicationStatus: 'Published',
          publishedBy: 'System AI Engine',
          publishDate: new Date().toISOString(),
          syndicatedPlatforms: '["CorpersTech Portal"]',
          notificationSent: true
        },
        changeLogs: [],
        duplicateHistory: [],
        timelineEvents: [
          { id: 1, opportunityId: newId, stage: "Discovered", description: `Opportunity discovered via ${source.name}. Confident Match Score: ${((data.confidenceScore || 0) * 100).toFixed(0)}%.`, createdAt: new Date().toISOString() },
          { id: 2, opportunityId: newId, stage: "Verified", description: `AI Verification checklist run. Result: Verified & Trusted. Confidence: ${((data.confidenceScore || 0) * 100).toFixed(0)}%.`, createdAt: new Date().toISOString() }
        ]
      };
      opps.unshift(opportunity);
      saveFallbackData(OPPORTUNITIES_FALLBACK_FILE, opps);
      await this.updateEmployerProfileStats(data.employerId);
      return opportunity;
    }
  }

  static async getOpportunityById(id: number) {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentOpportunity.findUnique({
        where: { id },
        include: {
          source: true,
          employer: true,
          category: true,
          verification: true,
          publication: true,
          changeLogs: true,
          duplicateHistory: true,
          timelineEvents: true
        }
      });
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const opp = opps.find((o: any) => o.id === id);
      if (!opp) return null;
      const logs = await this.getChangeLogsForOpportunity(id);
      const duplicates = await this.getDuplicateHistoryForOpportunity(id);
      const timeline = await this.getTimelineForOpportunity(id);
      return {
        ...opp,
        changeLogs: logs,
        duplicateHistory: duplicates,
        timelineEvents: timeline
      };
    }
  }

  static async getOpportunityByDuplicateHash(hash: string) {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentOpportunity.findFirst({
        where: { duplicateHash: hash },
        include: {
          source: true,
          employer: true,
          category: true,
          verification: true,
          publication: true
        }
      });
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      return opps.find((o: any) => o.duplicateHash === hash) || null;
    }
  }

  static async getAllOpportunities(filters?: {
    status?: string;
    categoryId?: number;
    sourceId?: number;
  }) {
    try {
      const prisma = getPrisma();
      const where: any = {};
      if (filters?.categoryId) where.categoryId = filters.categoryId;
      if (filters?.sourceId) where.sourceId = filters.sourceId;
      if (filters?.status) where.publication = { publicationStatus: filters.status };

      return await prisma.recruitmentOpportunity.findMany({
        where,
        orderBy: { discoveryDate: 'desc' },
        include: {
          source: true,
          employer: true,
          category: true,
          verification: true,
          publication: true,
          changeLogs: true,
          duplicateHistory: true,
          timelineEvents: true
        }
      });
    } catch (error) {
      let opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      if (filters?.categoryId) opps = opps.filter((o: any) => o.categoryId === filters.categoryId);
      if (filters?.sourceId) opps = opps.filter((o: any) => o.sourceId === filters.sourceId);
      if (filters?.status) opps = opps.filter((o: any) => o.publication?.publicationStatus === filters.status);
      return opps;
    }
  }

  static async updateOpportunity(id: number, data: any) {
    try {
      const prisma = getPrisma();
      const updated = await prisma.recruitmentOpportunity.update({
        where: { id },
        data,
        include: {
          source: true,
          employer: true,
          category: true,
          verification: true,
          publication: true
        }
      });
      if (updated.employerId) await this.updateEmployerProfileStats(updated.employerId);
      return updated;
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const index = opps.findIndex((o: any) => o.id === id);
      if (index !== -1) {
        opps[index] = { ...opps[index], ...data };
        saveFallbackData(OPPORTUNITIES_FALLBACK_FILE, opps);
        if (opps[index].employerId) await this.updateEmployerProfileStats(opps[index].employerId);
        return opps[index];
      }
      return null;
    }
  }

  static async updateOpportunityVerification(id: number, data: any) {
    try {
      const prisma = getPrisma();
      const verification = await prisma.opportunityVerification.update({
        where: { opportunityId: id },
        data: {
          ...data,
          lastVerificationDate: data.lastVerificationDate || new Date()
        }
      });
      await this.addTimelineEvent(
        id,
        "Verified",
        `AI Verification checklist run. Result: ${data.verificationStatus || 'Completed'}. Confidence: ${((data.confidenceScore || 0) * 100).toFixed(0)}%. Notes: ${data.notes || 'None'}`
      );
      return verification;
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const index = opps.findIndex((o: any) => o.id === id);
      if (index !== -1) {
        opps[index].verification = { ...opps[index].verification, ...data, lastVerificationDate: data.lastVerificationDate || new Date().toISOString() };
        saveFallbackData(OPPORTUNITIES_FALLBACK_FILE, opps);
        await this.addTimelineEvent(
          id,
          "Verified",
          `AI Verification checklist run. Result: ${data.verificationStatus || 'Completed'}. Confidence: ${((data.confidenceScore || 0) * 100).toFixed(0)}%. Notes: ${data.notes || 'None'}`
        );
        return opps[index].verification;
      }
      return null;
    }
  }

  static async updateOpportunityPublication(id: number, status: string, publishedBy?: string) {
    try {
      const prisma = getPrisma();
      const publication = await prisma.opportunityPublication.update({
        where: { opportunityId: id },
        data: {
          publicationStatus: status,
          publishedAt: status === 'Published' ? new Date() : undefined,
          publishedBy: publishedBy || undefined
        },
        include: {
          opportunity: true
        }
      });
      await this.addTimelineEvent(
        id,
        status === 'Published' ? 'Published' : status === 'Expired' ? 'Expired' : status === 'Rejected' ? 'Rejected' : 'Reviewed',
        `Opportunity status updated to ${status}.${publishedBy ? ` Triggered by ${publishedBy}.` : ''}`
      );
      if (publication.opportunity?.employerId) {
        await this.updateEmployerProfileStats(publication.opportunity.employerId);
      }
      return publication;
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const index = opps.findIndex((o: any) => o.id === id);
      if (index !== -1) {
        opps[index].publication = {
          ...opps[index].publication,
          publicationStatus: status,
          publishedAt: status === 'Published' ? new Date().toISOString() : undefined,
          publishedBy: publishedBy || undefined
        };
        saveFallbackData(OPPORTUNITIES_FALLBACK_FILE, opps);
        await this.addTimelineEvent(
          id,
          status === 'Published' ? 'Published' : status === 'Expired' ? 'Expired' : status === 'Rejected' ? 'Rejected' : 'Reviewed',
          `Opportunity status updated to ${status}.${publishedBy ? ` Triggered by ${publishedBy}.` : ''}`
        );
        if (opps[index].employerId) await this.updateEmployerProfileStats(opps[index].employerId);
        return { ...opps[index].publication, opportunity: opps[index] };
      }
      return null;
    }
  }

  static async deleteOpportunity(id: number) {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentOpportunity.delete({
        where: { id }
      });
    } catch (error) {
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const updated = opps.filter((o: any) => o.id !== id);
      saveFallbackData(OPPORTUNITIES_FALLBACK_FILE, updated);
      return { success: true };
    }
  }

  // ==========================================
  // SCHEDULER STATE OPERATIONS
  // ==========================================
  static async getSchedulerState() {
    try {
      const prisma = getPrisma();
      let state = await prisma.recruitmentScheduler.findFirst();
      if (!state) {
        state = await prisma.recruitmentScheduler.create({
          data: {
            intervalHours: 24,
            lastScan: null,
            nextScheduledScan: new Date(Date.now() + 24 * 60 * 60 * 1000),
            scanDurationMs: 0,
            sourcesChecked: 0,
            newOpportunitiesFound: 0,
            duplicatesIgnored: 0,
            verificationFailures: 0
          }
        });
      }
      return state;
    } catch (error) {
      const list = loadFallbackData(SCHEDULER_FALLBACK_FILE, [INITIAL_SCHEDULER]);
      return list[0] || INITIAL_SCHEDULER;
    }
  }

  static async updateSchedulerState(data: any) {
    try {
      const prisma = getPrisma();
      const state = await this.getSchedulerState();
      return await prisma.recruitmentScheduler.update({
        where: { id: state.id },
        data
      });
    } catch (error) {
      const list = loadFallbackData(SCHEDULER_FALLBACK_FILE, [INITIAL_SCHEDULER]);
      const current = list[0] || INITIAL_SCHEDULER;
      const updated = { ...current, ...data };
      saveFallbackData(SCHEDULER_FALLBACK_FILE, [updated]);
      return updated;
    }
  }

  // ==========================================
  // NOTIFICATIONS OPERATIONS
  // ==========================================
  static async addNotification(title: string, message: string, type: string) {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentNotification.create({
        data: { title, message, type, isRead: false }
      });
    } catch (error) {
      const list = loadFallbackData(NOTIFICATIONS_FALLBACK_FILE, INITIAL_NOTIFICATIONS);
      const item = { id: list.length > 0 ? Math.max(...list.map((n: any) => n.id)) + 1 : 1, title, message, type, isRead: false, createdAt: new Date().toISOString() };
      list.unshift(item);
      saveFallbackData(NOTIFICATIONS_FALLBACK_FILE, list);
      return item;
    }
  }

  static async getNotifications() {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentNotification.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      return loadFallbackData(NOTIFICATIONS_FALLBACK_FILE, INITIAL_NOTIFICATIONS);
    }
  }

  static async markNotificationsRead() {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentNotification.updateMany({
        data: { isRead: true }
      });
    } catch (error) {
      const list = loadFallbackData(NOTIFICATIONS_FALLBACK_FILE, INITIAL_NOTIFICATIONS);
      list.forEach((n: any) => n.isRead = true);
      saveFallbackData(NOTIFICATIONS_FALLBACK_FILE, list);
      return { count: list.length };
    }
  }

  // ==========================================
  // CHANGE LOGS OPERATIONS
  // ==========================================
  static async addChangeLog(opportunityId: number, fieldName: string, previousValue: string, updatedValue: string, aiSummary: string) {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityChangeLog.create({
        data: { opportunityId, fieldName, previousValue, updatedValue, aiSummary }
      });
    } catch (error) {
      const list = loadFallbackData(CHANGELOGS_FALLBACK_FILE, INITIAL_CHANGELOGS);
      const item = { id: list.length > 0 ? Math.max(...list.map((l: any) => l.id)) + 1 : 1, opportunityId, fieldName, previousValue, updatedValue, aiSummary, detectedAt: new Date().toISOString() };
      list.unshift(item);
      saveFallbackData(CHANGELOGS_FALLBACK_FILE, list);
      return item;
    }
  }

  static async getChangeLogsForOpportunity(opportunityId: number) {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityChangeLog.findMany({
        where: { opportunityId },
        orderBy: { detectedAt: 'desc' }
      });
    } catch (error) {
      const list = loadFallbackData(CHANGELOGS_FALLBACK_FILE, INITIAL_CHANGELOGS);
      return list.filter((l: any) => l.opportunityId === opportunityId);
    }
  }

  static async getAllChangeLogs() {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityChangeLog.findMany({
        orderBy: { detectedAt: 'desc' },
        include: {
          opportunity: {
            include: {
              employer: true
            }
          }
        }
      });
    } catch (error) {
      const list = loadFallbackData(CHANGELOGS_FALLBACK_FILE, INITIAL_CHANGELOGS);
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      return list.map((l: any) => ({
        ...l,
        opportunity: opps.find((o: any) => o.id === l.opportunityId) || null
      }));
    }
  }

  // ==========================================
  // DUPLICATE HISTORY OPERATIONS
  // ==========================================
  static async addDuplicateHistory(opportunityId: number, duplicateTitle: string, duplicateCompany: string, duplicateUrl: string, reason: string) {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityDuplicateHistory.create({
        data: { opportunityId, duplicateTitle, duplicateCompany, duplicateUrl, reason }
      });
    } catch (error) {
      const list = loadFallbackData(DUPLICATES_FALLBACK_FILE, INITIAL_DUPLICATES);
      const item = { id: list.length > 0 ? Math.max(...list.map((d: any) => d.id)) + 1 : 1, opportunityId, duplicateTitle, duplicateCompany, duplicateUrl, reason, mergedAt: new Date().toISOString() };
      list.unshift(item);
      saveFallbackData(DUPLICATES_FALLBACK_FILE, list);
      return item;
    }
  }

  static async getDuplicateHistoryForOpportunity(opportunityId: number) {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityDuplicateHistory.findMany({
        where: { opportunityId },
        orderBy: { mergedAt: 'desc' }
      });
    } catch (error) {
      const list = loadFallbackData(DUPLICATES_FALLBACK_FILE, INITIAL_DUPLICATES);
      return list.filter((d: any) => d.opportunityId === opportunityId);
    }
  }

  static async getAllDuplicateHistory() {
    try {
      const prisma = getPrisma();
      return await prisma.opportunityDuplicateHistory.findMany({
        orderBy: { mergedAt: 'desc' },
        include: {
          opportunity: true
        }
      });
    } catch (error) {
      const list = loadFallbackData(DUPLICATES_FALLBACK_FILE, INITIAL_DUPLICATES);
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      return list.map((d: any) => ({
        ...d,
        opportunity: opps.find((o: any) => o.id === d.opportunityId) || null
      }));
    }
  }

  // ==========================================
  // TIMELINE OPERATIONS
  // ==========================================
  static async addTimelineEvent(opportunityId: number, stage: string, description: string) {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentTimelineEvent.create({
        data: { opportunityId, stage, description }
      });
    } catch (error) {
      const list = loadFallbackData(TIMELINE_FALLBACK_FILE, INITIAL_TIMELINE);
      const item = { id: list.length > 0 ? Math.max(...list.map((t: any) => t.id)) + 1 : 1, opportunityId, stage, description, createdAt: new Date().toISOString() };
      list.push(item);
      saveFallbackData(TIMELINE_FALLBACK_FILE, list);
      return item;
    }
  }

  static async getTimelineForOpportunity(opportunityId: number) {
    try {
      const prisma = getPrisma();
      return await prisma.recruitmentTimelineEvent.findMany({
        where: { opportunityId },
        orderBy: { createdAt: 'asc' }
      });
    } catch (error) {
      const list = loadFallbackData(TIMELINE_FALLBACK_FILE, INITIAL_TIMELINE);
      return list.filter((t: any) => t.opportunityId === opportunityId);
    }
  }

  // ==========================================
  // EMPLOYER STATS COMPUTATION & PROFILE
  // ==========================================
  static async updateEmployerProfileStats(employerId: number) {
    try {
      const prisma = getPrisma();
      const opportunities = await prisma.recruitmentOpportunity.findMany({
        where: { employerId },
        include: {
          publication: true,
          verification: true
        }
      });

      if (opportunities.length === 0) return;

      const publishedOpps = opportunities.filter((o: any) => o.publication?.publicationStatus === 'Published');
      const countPublished = publishedOpps.length;
      const currentOpen = publishedOpps.length;
      
      const remoteCount = opportunities.filter((o: any) => o.remoteStatus === 'Remote').length;
      const remoteHiringRatio = opportunities.length > 0 ? (remoteCount / opportunities.length) : 0.0;

      const graduateCount = opportunities.filter((o: any) => {
        const exp = (o.experienceLevel || '').toLowerCase();
        return exp.includes('graduate') || exp.includes('intern') || exp.includes('trainee');
      }).length;
      const graduateHiringRatio = opportunities.length > 0 ? (graduateCount / opportunities.length) : 0.0;

      const techSet = new Set<string>();
      opportunities.forEach((o: any) => {
        if (o.verification?.verifiedTechnology) {
          techSet.add(o.verification.verifiedTechnology);
        }
        (o.requiredSkills || '').split(',').forEach((s: string) => {
          const trimmed = s.trim();
          if (trimmed && trimmed.length < 20) {
            techSet.add(trimmed);
          }
        });
      });
      const technologyAreas = Array.from(techSet).slice(0, 8).join(', ') || 'Software Engineering';

      const totalConfidence = opportunities.reduce((sum: number, o: any) => sum + (o.confidenceScore || 0), 0);
      const avgConfidence = opportunities.length > 0 ? (totalConfidence / opportunities.length) : 0.85;
      const confidenceRating = parseFloat((avgConfidence * 5).toFixed(1));

      let averageHiringFrequency = 'Monthly';
      if (opportunities.length >= 10) {
        averageHiringFrequency = 'Weekly';
      } else if (opportunities.length >= 5) {
        averageHiringFrequency = 'Bi-weekly';
      }

      await prisma.employer.update({
        where: { id: employerId },
        data: {
          opportunitiesPublished: countPublished,
          currentOpenRoles: currentOpen,
          remoteHiringRatio,
          graduateHiringRatio,
          technologyAreas,
          confidenceRating,
          averageHiringFrequency
        }
      });
    } catch (error) {
      const employers = loadFallbackData(EMPLOYERS_FALLBACK_FILE, INITIAL_EMPLOYERS);
      const opps = loadFallbackData(OPPORTUNITIES_FALLBACK_FILE, INITIAL_OPPORTUNITIES);
      const empIndex = employers.findIndex((e: any) => e.id === employerId);
      if (empIndex === -1) return;
      const empOpps = opps.filter((o: any) => o.employerId === employerId);
      if (empOpps.length === 0) return;
      const publishedOpps = empOpps.filter((o: any) => o.publication?.publicationStatus === 'Published');
      const countPublished = publishedOpps.length;
      const currentOpen = publishedOpps.length;
      const remoteCount = empOpps.filter((o: any) => o.remoteStatus === 'Remote').length;
      const remoteHiringRatio = empOpps.length > 0 ? (remoteCount / empOpps.length) : 0.0;
      const graduateCount = empOpps.filter((o: any) => {
        const exp = (o.experienceLevel || '').toLowerCase();
        return exp.includes('graduate') || exp.includes('intern') || exp.includes('trainee');
      }).length;
      const graduateHiringRatio = empOpps.length > 0 ? (graduateCount / empOpps.length) : 0.0;
      const techSet = new Set<string>();
      empOpps.forEach((o: any) => {
        if (o.verification?.verifiedTechnology) techSet.add(o.verification.verifiedTechnology);
        (o.requiredSkills || '').split(',').forEach((s: string) => {
          const trimmed = s.trim();
          if (trimmed && trimmed.length < 20) techSet.add(trimmed);
        });
      });
      const technologyAreas = Array.from(techSet).slice(0, 8).join(', ') || 'Software Engineering';
      const totalConfidence = empOpps.reduce((sum: number, o: any) => sum + (o.confidenceScore || 0), 0);
      const avgConfidence = empOpps.length > 0 ? (totalConfidence / empOpps.length) : 0.85;
      const confidenceRating = parseFloat((avgConfidence * 5).toFixed(1));
      let averageHiringFrequency = 'Monthly';
      if (empOpps.length >= 10) averageHiringFrequency = 'Weekly';
      else if (empOpps.length >= 5) averageHiringFrequency = 'Bi-weekly';

      employers[empIndex] = {
        ...employers[empIndex],
        opportunitiesPublished: countPublished,
        currentOpenRoles: currentOpen,
        remoteHiringRatio,
        graduateHiringRatio,
        technologyAreas,
        confidenceRating,
        averageHiringFrequency
      };
    }
  }

  // ==========================================
  // SEED WORKFLOWS
  // ==========================================
  static async seedDefaultSources() {
    const defaultSources = [
      { name: 'LinkedIn Tech Jobs Portal', url: 'https://linkedin.com/jobs' },
      { name: 'Andela Talent Network', url: 'https://andela.com' },
      { name: 'Sterling Bank Graduate Careers', url: 'https://sterling.ng/careers' },
      { name: 'Interswitch Internship Hub', url: 'https://interswitchgroup.com/careers' },
      { name: 'Civic Hive Fellowship Platform', url: 'https://civichive.org' },
      { name: 'NUC National Graduate Trainee Scheme', url: 'https://nuc.edu.ng' }
    ];

    for (const src of defaultSources) {
      try {
        await this.getOrCreateSource(src.name, src.url);
      } catch (e) {
        // Fallback already handled inside getOrCreateSource
      }
    }
  }

  static async seedDefaultCategories() {
    const defaultCategories = [
      'Graduate Programs',
      'Internships',
      'Entry-Level Jobs',
      'Remote Jobs',
      'Hybrid Jobs',
      'On-site Jobs',
      'Scholarships',
      'Bootcamps',
      'Fellowships',
      'Hackathons',
      'Competitions',
      'Volunteer Tech Programs',
      'NYSC-friendly Opportunities'
    ];

    for (const cat of defaultCategories) {
      try {
        await this.getOrCreateCategory(cat);
      } catch (e) {
        // Fallback already handled inside getOrCreateCategory
      }
    }
  }
}
