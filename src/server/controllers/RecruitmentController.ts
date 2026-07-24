import { Request, Response } from 'express';
import { RecruitmentRepository } from '../repositories/RecruitmentRepository.ts';
import { RecruitmentIntelligenceEngine } from '../services/RecruitmentIntelligenceEngine.ts';
import { ContentRepository } from '../repositories/ContentRepository.ts';
import { getPrisma } from '../db.ts';

export class RecruitmentController {
  // ==========================================
  // DISCOVERY ENGINE TRIGGER & MONITORING
  // ==========================================
  static async runDiscovery(req: Request, res: Response) {
    try {
      const { sourceName, sourceUrl } = req.body;
      if (!sourceName || !sourceUrl) {
        return res.status(400).json({ success: false, error: 'SourceName and SourceUrl are required.' });
      }

      console.log(`Starting dynamic recruitment discovery scan for source: ${sourceName} (${sourceUrl})...`);
      const discovered = await RecruitmentIntelligenceEngine.runDiscoveryScan(sourceName, sourceUrl);
      
      res.status(200).json({
        success: true,
        message: `Successfully completed discovery scan. Discovered & verified ${discovered.length} items.`,
        data: discovered
      });
    } catch (error: any) {
      console.error("Discovery trigger error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // OPPORTUNITIES LIST & DETAILS
  // ==========================================
  static async listOpportunities(req: Request, res: Response) {
    try {
      const status = req.query.status as string; // e.g. "Pending Review", "Verified", "Published", "Archived", "Expired", "Rejected"
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined;
      const sourceId = req.query.sourceId ? parseInt(req.query.sourceId as string, 10) : undefined;

      const opportunities = await RecruitmentRepository.getAllOpportunities({
        status,
        categoryId,
        sourceId
      });

      res.json({ success: true, data: opportunities });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getOpportunity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const opportunity = await RecruitmentRepository.getOpportunityById(id);
      if (!opportunity) {
        return res.status(404).json({ success: false, error: 'Opportunity not found.' });
      }
      res.json({ success: true, data: opportunity });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createOpportunity(req: Request, res: Response) {
    try {
      const { jobTitle, companyName, description, location, remoteStatus, salary, experienceLevel, requiredSkills, officialUrl, applicationDeadline, sourceId, categoryId } = req.body;
      if (!jobTitle || !officialUrl) {
        return res.status(400).json({ success: false, error: 'Job Title and Official URL are required.' });
      }

      const sources = await RecruitmentRepository.getAllSources();
      const source = sources.find((s: any) => s.id === sourceId) || await RecruitmentRepository.getOrCreateSource("Manual Placement Registry", officialUrl);
      
      const employer = await RecruitmentRepository.getOrCreateEmployer(companyName || "Verified Employer", officialUrl, "Technology");
      
      const categories = await RecruitmentRepository.getAllCategories();
      const category = categories.find((c: any) => c.id === categoryId) || await RecruitmentRepository.getOrCreateCategory("Entry-Level Jobs");

      const opportunity = await RecruitmentRepository.createOpportunity({
        jobTitle,
        description: description || `Professional placement opportunity at ${employer.name}.`,
        location: location || "Lagos, Nigeria",
        remoteStatus: remoteStatus || "Hybrid",
        salary: salary || "₦150,000 / month",
        experienceLevel: experienceLevel || "Entry-level",
        requiredSkills: requiredSkills || "General Tech, Communication, Problem Solving",
        officialUrl,
        applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        confidenceScore: 0.95,
        duplicateHash: `manual_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        sourceId: source.id,
        employerId: employer.id,
        categoryId: category.id,
        qualityScore: 92.0,
        qualityGrade: "Excellent",
        qualityDetails: JSON.stringify({ clarity: "High", requirements: "Manual Placement Validated" })
      });

      res.status(201).json({ success: true, data: opportunity });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateOpportunity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { jobTitle, description, location, remoteStatus, salary, experienceLevel, requiredSkills, officialUrl, applicationDeadline } = req.body;

      const currentOpp = await RecruitmentRepository.getOpportunityById(id);
      if (!currentOpp) {
        return res.status(404).json({ success: false, error: 'Opportunity not found.' });
      }

      // MODULE 2: Change detection triggers upon manual update or background scanner
      await RecruitmentIntelligenceEngine.detectAndLogChanges(id, currentOpp, {
        applicationDeadline,
        salary,
        officialUrl,
        location
      });

      const updated = await RecruitmentRepository.updateOpportunity(id, {
        jobTitle,
        description,
        location,
        remoteStatus,
        salary,
        experienceLevel,
        requiredSkills,
        officialUrl,
        applicationDeadline
      });

      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteOpportunity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await RecruitmentRepository.deleteOpportunity(id);
      res.json({ success: true, message: 'Opportunity deleted successfully.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // VERIFICATION & PUBLICATION TRIGGERS
  // ==========================================
  static async updateQueueStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status, staffEmail } = req.body; // e.g. "Published", "Archived", "Rejected", "Verified"
      if (!status) {
        return res.status(400).json({ success: false, error: 'Target queue status is required.' });
      }

      const updatedPub = await RecruitmentRepository.updateOpportunityPublication(id, status, staffEmail);

      // If published, clone or mirror to public JobOpportunity table
      if (status === 'Published') {
        const opportunity = await RecruitmentRepository.getOpportunityById(id);
        if (opportunity) {
          await ContentRepository.createOrUpdatePublicJob({
            title: opportunity.jobTitle,
            company: opportunity.employer?.name || 'Partner Employer',
            location: opportunity.location || 'Lagos',
            type: opportunity.remoteStatus || 'Hybrid',
            roleType: opportunity.experienceLevel || "Entry-level",
            description: opportunity.description || '',
            stipend: opportunity.salary || "₦150,000 / month",
            datePosted: new Date().toISOString().split('T')[0],
            skills: opportunity.requiredSkills || '',
            status: "Published"
          });
          console.log(`Successfully published Opportunity ID ${id} to public website jobs board.`);
        }
      }

      res.json({ success: true, data: updatedPub });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // SOURCE, CATEGORY, EMPLOYER LISTS
  // ==========================================
  static async listSources(req: Request, res: Response) {
    try {
      const sources = await RecruitmentRepository.getAllSources();
      res.json({ success: true, data: sources });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async listCategories(req: Request, res: Response) {
    try {
      const categories = await RecruitmentRepository.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async listEmployers(req: Request, res: Response) {
    try {
      const employers = await RecruitmentRepository.getAllEmployers();
      res.json({ success: true, data: employers });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async listEmployerProfiles(req: Request, res: Response) {
    try {
      const employers = await RecruitmentRepository.getAllEmployers();
      
      // Update each employer profiles stats dynamically to make sure the board is perfect
      for (const emp of employers) {
        await RecruitmentRepository.updateEmployerProfileStats(emp.id);
      }

      const updatedEmployers = await RecruitmentRepository.getAllEmployers();
      res.json({ success: true, data: updatedEmployers });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Seed default databases
  static async seedRegistry(req: Request, res: Response) {
    try {
      await RecruitmentRepository.seedDefaultSources();
      await RecruitmentRepository.seedDefaultCategories();
      res.json({ success: true, message: 'Registry sources and categories seeded successfully.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // MODULE 1: SCHEDULER CONTROLLERS
  // ==========================================
  static async getScheduler(req: Request, res: Response) {
    try {
      const state = await RecruitmentRepository.getSchedulerState();
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateScheduler(req: Request, res: Response) {
    try {
      const { intervalHours } = req.body;
      const hours = parseInt(intervalHours, 10);
      if (![6, 12, 24].includes(hours)) {
        return res.status(400).json({ success: false, error: 'Scheduler interval must be 6, 12, or 24 hours.' });
      }

      const updated = await RecruitmentRepository.updateSchedulerState({
        intervalHours: hours,
        nextScheduledScan: new Date(Date.now() + hours * 60 * 60 * 1000)
      });
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async triggerSchedulerScan(req: Request, res: Response) {
    try {
      await RecruitmentIntelligenceEngine.runSchedulerDiscoveryCycle();
      const state = await RecruitmentRepository.getSchedulerState();
      res.json({ success: true, message: 'Scheduler discovery scan triggered successfully.', data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // MODULE 9: NOTIFICATION CONTROLLERS
  // ==========================================
  static async listNotifications(req: Request, res: Response) {
    try {
      const notifications = await RecruitmentRepository.getNotifications();
      res.json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async markAllNotificationsRead(req: Request, res: Response) {
    try {
      await RecruitmentRepository.markNotificationsRead();
      res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // MODULE 2: CHANGE LOGS CONTROLLERS
  // ==========================================
  static async listChangeLogs(req: Request, res: Response) {
    try {
      const logs = await RecruitmentRepository.getAllChangeLogs();
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // MODULE 4: DUPLICATE HISTORY CONTROLLERS
  // ==========================================
  static async listDuplicateHistory(req: Request, res: Response) {
    try {
      const history = await RecruitmentRepository.getAllDuplicateHistory();
      res.json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // MODULE 3: MANUAL EXPIRY RUN CONTROLLER
  // ==========================================
  static async triggerExpiryVerification(req: Request, res: Response) {
    try {
      const count = await RecruitmentIntelligenceEngine.runAutomaticExpiryCycle();
      res.json({ success: true, message: `Completed expiry verification scan. Retired ${count} expired roles.` });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // MODULE 6: TIMELINE CONTROLLER
  // ==========================================
  static async getOpportunityTimeline(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const timeline = await RecruitmentRepository.getTimelineForOpportunity(id);
      res.json({ success: true, data: timeline });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
