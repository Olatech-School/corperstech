import { Request, Response } from 'express';
import { getPrisma } from '../db.ts';
import { DocumentGenerator } from '../utils/DocumentGenerator.ts';
import { ContentRepository } from '../repositories/ContentRepository.ts';
import { EventsRepository } from '../repositories/EventsRepository.ts';

export class ContentController {
  // ==========================================
  // JOB OPPORTUNITIES
  // ==========================================
  static async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await ContentRepository.getAllJobs(req.query);
      res.json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getJobById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const job = await ContentRepository.getJobById(id);
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      res.json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createJob(req: Request, res: Response) {
    try {
      const job = await ContentRepository.createJob(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateJob(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const job = await ContentRepository.updateJob(id, req.body);
      res.json({ success: true, data: job });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteJob(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deleteJob(id);
      res.json({ success: true, message: 'Job opportunity and associated applications deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // JOB APPLICATIONS (Dedicated Portal)
  // ==========================================
  static async applyForJob(req: Request, res: Response) {
    try {
      const {
        jobOpportunityId,
        fullName,
        email,
        phone,
        currentNyscState,
        nyscBatch
      } = req.body;

      if (!jobOpportunityId || !fullName || !email || !phone || !currentNyscState || !nyscBatch) {
        return res.status(400).json({ success: false, error: 'Required applicant fields are missing.' });
      }

      const id = parseInt(String(jobOpportunityId), 10);
      const job = await ContentRepository.getJobById(id);
      if (!job) {
        return res.status(404).json({ success: false, error: 'The specified job opportunity does not exist.' });
      }

      const application = await ContentRepository.applyForJob({
        ...req.body,
        jobOpportunityId: id,
        appliedAt: new Date().toISOString()
      });

      res.status(201).json({
        success: true,
        message: 'Your job application has been successfully submitted.',
        data: application
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllJobApplications(req: Request, res: Response) {
    try {
      const apps = await ContentRepository.getAllJobApplications();
      res.json({ success: true, data: apps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateJobApplicationStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const app = await ContentRepository.updateJobApplicationStatus(id, status);
      res.json({ success: true, data: app });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteJobApplication(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deleteJobApplication(id);
      res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // SUCCESS STORIES
  // ==========================================
  static async getAllSuccessStories(req: Request, res: Response) {
    try {
      const stories = await ContentRepository.getAllSuccessStories();
      res.json({ success: true, data: stories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createSuccessStory(req: Request, res: Response) {
    try {
      const story = await ContentRepository.createSuccessStory(req.body);
      res.status(201).json({ success: true, data: story });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateSuccessStory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const story = await ContentRepository.updateSuccessStory(id, req.body);
      res.json({ success: true, data: story });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteSuccessStory(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deleteSuccessStory(id);
      res.json({ success: true, message: 'Story deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // PROJECT SHOWCASE
  // ==========================================
  static async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await ContentRepository.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createProject(req: Request, res: Response) {
    try {
      const project = await ContentRepository.createProject(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const project = await ContentRepository.updateProject(id, req.body);
      res.json({ success: true, data: project });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deleteProject(id);
      res.json({ success: true, message: 'Project deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // CAREER RESOURCES & DOWNLOADS
  // ==========================================
  static async getAllResources(req: Request, res: Response) {
    try {
      const categoryFilter = req.query.category as string;
      const resources = await ContentRepository.getAllResources(categoryFilter);
      res.json({ success: true, data: resources });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createResource(req: Request, res: Response) {
    try {
      const resource = await ContentRepository.createResource(req.body);
      res.status(201).json({ success: true, data: resource });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateResource(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const resource = await ContentRepository.updateResource(id, req.body);
      res.json({ success: true, data: resource });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteResource(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deleteResource(id);
      res.json({ success: true, message: 'Resource deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async downloadResource(req: Request, res: Response) {
    try {
      const idParam = req.query.id || req.params?.id;
      const titleParam = req.query.title as string;
      const typeParam = req.query.type as string;
      const formatParam = req.query.format as string;

      let title = titleParam || "Career Resource Guide";
      let category = typeParam || "Career Guide";
      let resRecord: any = null;

      if (idParam && idParam !== 'undefined' && idParam !== 'null') {
        const id = parseInt(String(idParam), 10);
        if (!isNaN(id)) {
          resRecord = await ContentRepository.getResourceById(id);
          if (resRecord) {
            title = resRecord.title || title;
            category = resRecord.type || category;
          }
        }
      }

      // Generate Gold Master professional document content
      const generated = DocumentGenerator.generateProfessionalDocument(title, category);

      // Return JSON payload if format=json or if not explicitly requesting raw stream
      if (formatParam === 'json' || !req.query.stream) {
        return res.json({
          success: true,
          id: idParam || 0,
          filename: generated.filename,
          contentType: generated.contentType,
          content: generated.content,
          title: title,
          category: category
        });
      } else {
        res.setHeader('Content-Disposition', `attachment; filename="${generated.filename}"`);
        res.setHeader('Content-Type', generated.contentType);
        return res.send(generated.content);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to download document.' });
    }
  }

  static async downloadResourceById(req: Request, res: Response) {
    return ContentController.downloadResource(req, res);
  }

  // ==========================================
  // UPCOMING EVENTS & RESERVATIONS
  // ==========================================
  static async getAllEvents(req: Request, res: Response) {
    try {
      const events = await EventsRepository.getAllEvents();
      res.json({ success: true, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const event = await EventsRepository.createEvent(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const event = await EventsRepository.updateEvent(id, req.body);
      res.json({ success: true, data: event });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await EventsRepository.deleteEvent(id);
      res.json({ success: true, message: 'Event deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async reserveEventSeat(req: Request, res: Response) {
    try {
      const eventId = parseInt(req.params.id, 10);
      const { fullName, email, phone, nyscState, nyscBatch } = req.body;

      if (!fullName || !email || !phone) {
        return res.status(400).json({ success: false, error: 'Full Name, Email, and Phone are required.' });
      }

      const result = await EventsRepository.reserveSeat(eventId, {
        fullName,
        email,
        phone,
        nyscState,
        nyscBatch
      });

      res.status(201).json({
        success: true,
        message: 'Seat reserved successfully! A confirmation SMS and email has been generated.',
        data: { reservation: result, event: { id: eventId } }
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // EMPLOYER PARTNERS
  // ==========================================
  static async getAllPartners(req: Request, res: Response) {
    try {
      const partners = await ContentRepository.getAllPartners();
      res.json({ success: true, data: partners });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createPartner(req: Request, res: Response) {
    try {
      const partner = await ContentRepository.createPartner(req.body);
      res.status(201).json({ success: true, data: partner });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updatePartner(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const partner = await ContentRepository.updatePartner(id, req.body);
      res.json({ success: true, data: partner });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deletePartner(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deletePartner(id);
      res.json({ success: true, message: 'Partner deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // HOMEPAGE HIGHLIGHTS
  // ==========================================
  static async getAllHighlights(req: Request, res: Response) {
    try {
      const highlights = await ContentRepository.getAllHighlights();
      res.json({ success: true, data: highlights });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createHighlight(req: Request, res: Response) {
    try {
      const highlight = await ContentRepository.createHighlight(req.body);
      res.status(201).json({ success: true, data: highlight });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateHighlight(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const highlight = await ContentRepository.updateHighlight(id, req.body);
      res.json({ success: true, data: highlight });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteHighlight(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await ContentRepository.deleteHighlight(id);
      res.json({ success: true, message: 'Highlight deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // PROFESSIONAL DOWNLOADS GENERATOR (Module 5)
  // ==========================================
  static async downloadDocument(req: Request, res: Response) {
    try {
      const docType = req.params.docType;
      
      let filename = 'document.txt';
      let content = '';

      switch (docType) {
        case 'student-handbook':
          filename = 'Olatech_CorpersTech_Student_Handbook_V1.0.txt';
          content = `===============================================================
OLATECH SCHOOL OF PROGRAMMING — CORPERS TECH STUDENT HANDBOOK V1.0
===============================================================

Welcome to Olatech School of Programming (CorpersTech Division).
We empower Nigerian youth through advanced software craftsmanship.

SECTION 1: MISSION & CODE OF CONDUCT
We strive for absolute technical excellence, regular attendance, 
collaborative and creative problem solving, and professional development.

SECTION 2: TRAINING TRACKS & CURRICULUM
- Full-Stack Web Development (React, Node.js, Express, databases)
- UI/UX Product Design & User Research
- Mobile App Development (React Native, Flutter)
- Data Analytics & SQL Operations

SECTION 3: GRADUATION REQUIREMENTS
- 90% attendance minimum
- Complete Capstone Project
- Pass Career Readiness Portfolio Evaluation

SECTION 4: TRANSPORTATION SYSTEM
Olatech provides high-capacity Shuttle buses to and from transit hubs
for all authorized CorpersTech program participants.

---------------------------------------------------------------
(c) 2026 Olatech School of Programming. All rights reserved.`;
          break;

        case 'orientation-guide':
          filename = 'CorpersTech_NYSC_Orientation_Survival_Guide.txt';
          content = `===============================================================
CORPERS TECH NYSC SURVIVAL & ORIENTATION GUIDE 1.0
===============================================================

Dear NYSC Member,
This orientation survival guide contains everything you need to leverage
your service year to launch your tech career.

1. REGISTRATION WORKFLOW
   Make sure to sync your PPA location with our center to schedule 
   free transportation.
2. TIMELINE
   - Week 1: Onboarding, system setup, toolkits.
   - Week 12: Core development focus.
   - Week 24: Enterprise internships & career placement.
3. ADVICES & TIPS
   - Dedicate 4 hours daily outside of lectures.
   - Participate in Career Clinics and mock interview challenges.

Enjoy your service year with tech empowerment!
Olatech School of Programming.`;
          break;

        case 'training-calendar':
          filename = 'CorpersTech_Training_Calendar_2026.txt';
          content = `===============================================================
CORPERS TECH 2026 TRAINING ACADEMIC CALENDAR
===============================================================

BATCH A:
- Orientation Day: Feb 15, 2026
- Midterm Hackathon: May 12, 2026
- Showcase Day: Jul 30, 2026

BATCH B:
- Orientation Day: Jun 20, 2026
- Midterm Hackathon: Sep 18, 2026
- Showcase Day: Nov 15, 2026

BATCH C:
- Orientation Day: Nov 05, 2026
- Midterm Hackathon: Feb 10, 2027
- Showcase Day: Apr 22, 2027

All lectures run Mondays, Wednesdays, and Fridays.
Tuesdays and Thursdays are dedicated to lab sessions and mentoring.`;
          break;

        case 'career-roadmap':
          filename = 'CorpersTech_Ultimate_Career_Roadmap.txt';
          content = `===============================================================
CORPERS TECH ULTIMATE TECH CAREER ROADMAP
===============================================================

PHASE 1: FOUNDATIONS (Month 1-3)
- Master HTML5, CSS3, ES6+ JavaScript.
- Version Control with Git & GitHub.
- Basic Figma layouts.

PHASE 2: FRAMEWORKS & ARCHITECTURE (Month 4-6)
- React.js frontend development.
- Server architecture with Express & Node.js.
- Relational databases (SQL, Postgres, SQLite).

PHASE 3: ENTERPRISE SKILLS (Month 7-9)
- Deploying to Cloud Run / AWS.
- Continuous Integration / Delivery (CI/CD).
- Automated unit testing.

PHASE 4: PORTFOLIO & RECRUITMENT (Month 10-12)
- Build 3 unique capstone products.
- Optimize resume and LinkedIn.
- Practice mock technical interviews.`;
          break;

        case 'cv-template':
          filename = 'CorpersTech_Professional_CV_Template.txt';
          content = `===============================================================
OLATECH CORPERS TECH PROFESSIONAL RESUME TEMPLATE
===============================================================

[FULL NAME]
Lagos, Nigeria | +234 800 000 0000 | email@example.com | GitHub | LinkedIn

PROFESSIONAL SUMMARY
Highly motivated Software Engineer and current NYSC Corper with strong foundations
in React, Express, Node.js, and SQL databases. Proven ability to build scalable 
applications and collaborate in agile team settings.

TECHNICAL SKILLS
- Frontend: JavaScript (ES6+), React, Tailwind CSS, HTML5, CSS3
- Backend & Databases: Node.js, Express, SQLite, Prisma ORM, RESTful APIs
- Tools: Git, GitHub, VS Code, Figma, Postman

SELECTED PROJECTS
CorpersTech Management Platform — Full-Stack Developer
- Implemented real-time tracking of 500+ student enrollments with filters.
- Built content management portals for staff scheduling.

EDUCATION
B.Sc. Computer Science — [Your University] (2020 - 2024)
Graduate Software Architect — Olatech School of Programming (2026)

EXPERIENCE
Software Engineering Intern — Olatech Dev Hub (Service Year, 2026)
- Built interactive modules using modern clean code patterns.`;
          break;

        case 'interview-checklist':
          filename = 'CorpersTech_Tech_Interview_Checklist.txt';
          content = `===============================================================
CORPERS TECH SOFTWARE ENGINEERING INTERVIEW PREP CHECKLIST
===============================================================

[ ] GitHub Profile optimized (No empty repos, READMEs completed)
[ ] Resume is single-page and highlights real quantifiable metrics
[ ] LinkedIn profile updated and showing "Open to Work"
[ ] Behavioral interviews prepared (using STAR method)
[ ] Core Technical knowledge:
    [ ] Big O notation and basic data structures
    [ ] How the browser works & DOM manipulation
    [ ] Event loop & async programming in Node.js
    [ ] SQL database schema design and JOIN queries
[ ] A portfolio showing at least 2 deployed live demo projects
[ ] Prepared questions for the interview panel`;
          break;

        case 'bus-route':
          filename = 'CorpersTech_Bus_Transportation_Schedule.txt';
          content = `===============================================================
CORPERS TECH COMPLIMENTARY BUS ROUTE SCHEDULE
===============================================================

ROUTE A: SURULERE EXPRESS
- Pickup Point: National Stadium Gate 1
- Pickup Time: 07:15 AM
- Return Departure: 04:30 PM

ROUTE B: IKEJA EXPRESS
- Pickup Point: Ikeja City Mall Gate 2
- Pickup Time: 07:00 AM
- Return Departure: 04:45 PM

ROUTE C: LEKKI-AJAH EXPRESS
- Pickup Point: Ajah Bus Stop (Under Bridge)
- Pickup Time: 06:45 AM
- Return Departure: 05:00 PM

* Note: Please be at the pickup station 10 minutes prior to departure.`;
          break;

        case 'campus-map':
          filename = 'Olatech_School_Campus_Map.txt';
          content = `===============================================================
OLATECH SCHOOL OF PROGRAMMING CAMPUS MAP & DIRECTORY
===============================================================

GROUND FLOOR:
- Reception and Admissions Desk
- Hall A: Full-Stack Web Development Lab
- Hall B: UI/UX Creative Sandbox

FIRST FLOOR:
- Staff Command Center
- Meeting Rooms & Student Lounge
- Cafe & Outdoors Terrace

SECOND FLOOR:
- Executive Suites
- Enterprise R&D Incubator
- Technical Support Help Desk`;
          break;

        case 'welcome-pack':
          filename = 'CorpersTech_Student_Welcome_Pack.txt';
          content = `===============================================================
OLATECH CORPERS TECH STUDENT WELCOME PACK V1.0
===============================================================

CONGRATULATIONS ON YOUR ACCEPTANCE!
You are officially on your way to becoming a professional Software Engineer.

YOUR ONBOARDING CHECKLIST:
1. Setup your Slack and Discord channels
2. Initialize your local developer environment (Node, Git, VS Code)
3. Connect with your student mentor
4. Familiarize yourself with our bus route schedule
5. Check out our dynamic events on the website

We can't wait to see the incredible products you'll design and build!
Cheers,
The CorpersTech Admissions Team.`;
          break;

        default:
          filename = 'CorpersTech_Document.txt';
          content = 'CorpersTech Document Download Service';
          break;
      }

      res.setHeader('Content-disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-type', 'text/plain; charset=utf-8');
      res.write(content);
      res.end();
    } catch (error: any) {
      res.status(500).send(`Failed to generate download: ${error.message}`);
    }
  }
}
