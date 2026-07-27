import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { EnrollmentController } from './src/server/controllers/EnrollmentController.ts';
import { StaffController } from './src/server/controllers/StaffController.ts';
import { AuditLogController } from './src/server/controllers/AuditLogController.ts';
import { ContentController } from './src/server/controllers/ContentController.ts';
import { StaffRepository } from './src/server/repositories/StaffRepository.ts';
import { RecruitmentRepository } from './src/server/repositories/RecruitmentRepository.ts';
import { RecruitmentController } from './src/server/controllers/RecruitmentController.ts';
import { RecruitmentIntelligenceEngine } from './src/server/services/RecruitmentIntelligenceEngine.ts';
import { CareerCoachController } from './src/server/controllers/CareerCoachController.ts';
import { DocumentController } from './src/server/controllers/DocumentController.ts';
import { OperationsController } from './src/server/controllers/OperationsController.ts';
import { PlatformController } from './src/server/controllers/PlatformController.ts';
import { EventsController } from './src/server/controllers/EventsController.ts';
import { CareerExplorerController } from './src/server/controllers/CareerExplorerController.ts';

async function startServer() {
  const app = express();
  app.use(helmet());
  const PORT = Number(process.env.PORT) || 3000;

  // Enable JSON body parser
  app.use(express.json());

  // Seed super admin account
  await StaffRepository.seedSuperAdmin().catch((err) => {
    console.error('Failed to seed Super Admin:', err);
  });

  // Seed Default Recruitment Intelligence Sources and Categories
  await RecruitmentRepository.seedDefaultSources().catch((err) => {
    console.error('Failed to seed default recruitment sources:', err);
  });
  await RecruitmentRepository.seedDefaultCategories().catch((err) => {
    console.error('Failed to seed default recruitment categories:', err);
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'Prisma/MySQL' });
  });

  // Staff and Admin routes
  app.post('/api/staff/login', StaffController.login);
  app.post('/api/staff/logout', StaffController.logout);
  app.get('/api/staff', StaffController.getAllStaff);
  app.post('/api/staff', StaffController.createStaff);
  app.put('/api/staff/:id', StaffController.updateStaff);
  app.post('/api/staff/:id/reset-password', StaffController.resetPassword);
  app.delete('/api/staff/:id', StaffController.softDeleteStaff);
  app.post('/api/staff/:id/restore', StaffController.restoreStaff);

  // Chronos Audit Logs routes
  app.get('/api/audit-logs', AuditLogController.getAllLogs);
  app.post('/api/audit-logs', AuditLogController.createLog);

  // Enrollment REST endpoints
  app.post('/api/enrollments', EnrollmentController.createEnrollment);
  app.get('/api/stats', EnrollmentController.getStats);
  app.get('/api/enrollments/track/search', EnrollmentController.trackEnrollment);
  app.get('/api/enrollments', EnrollmentController.getAllEnrollments);
  app.get('/api/enrollments/:id', EnrollmentController.getEnrollmentById);
  app.put('/api/enrollments/:id/status', EnrollmentController.updateEnrollmentStatus);
  app.put('/api/enrollments/:id/notes', EnrollmentController.updateEnrollmentAdminNotes);
  app.delete('/api/enrollments/:id', EnrollmentController.deleteEnrollment);

  // Job Opportunities CMS
  app.get('/api/jobs', ContentController.getAllJobs);
  app.get('/api/jobs/:id', ContentController.getJobById);
  app.post('/api/jobs', ContentController.createJob);
  app.put('/api/jobs/:id', ContentController.updateJob);
  app.delete('/api/jobs/:id', ContentController.deleteJob);

  // Job Applications
  app.get('/api/job-applications', ContentController.getAllJobApplications);
  app.post('/api/job-applications', ContentController.applyForJob);
  app.put('/api/job-applications/:id/status', ContentController.updateJobApplicationStatus);
  app.delete('/api/job-applications/:id', ContentController.deleteJobApplication);

  // Success Stories CMS
  app.get('/api/success-stories', ContentController.getAllSuccessStories);
  app.post('/api/success-stories', ContentController.createSuccessStory);
  app.put('/api/success-stories/:id', ContentController.updateSuccessStory);
  app.delete('/api/success-stories/:id', ContentController.deleteSuccessStory);

  // Projects Showcase CMS
  app.get('/api/projects', ContentController.getAllProjects);
  app.post('/api/projects', ContentController.createProject);
  app.put('/api/projects/:id', ContentController.updateProject);
  app.delete('/api/projects/:id', ContentController.deleteProject);

  // Career Resources CMS
  app.get('/api/career-resources/download', ContentController.downloadResource);
  app.get('/api/career-resources/:id/download', ContentController.downloadResourceById);
  app.get('/api/career-resources', ContentController.getAllResources);
  app.post('/api/career-resources', ContentController.createResource);
  app.put('/api/career-resources/:id', ContentController.updateResource);
  app.delete('/api/career-resources/:id', ContentController.deleteResource);

  // Upcoming Events CMS & Seat Reservation System
  app.get('/api/events/analytics', EventsController.getAnalytics);
  app.get('/api/events', EventsController.getAllEvents);
  app.get('/api/events/:id', EventsController.getEventById);
  app.post('/api/events', EventsController.createEvent);
  app.put('/api/events/:id', EventsController.updateEvent);
  app.delete('/api/events/:id', EventsController.deleteEvent);
  app.post('/api/events/:id/reserve', EventsController.reserveSeat);
  app.delete('/api/events/reservations/:id', EventsController.cancelReservation);
  app.get('/api/student/events', EventsController.getStudentEvents);
  app.post('/api/events/:id/checkin', EventsController.markAttendance);
  app.get('/api/events/:id/attendees', EventsController.getAttendees);
  app.get('/api/events/:id/calendar', EventsController.downloadIcs);
  app.get('/api/events/:id/ics', EventsController.downloadIcs);

  // Employer Partners CMS
  app.get('/api/employer-partners', ContentController.getAllPartners);
  app.post('/api/employer-partners', ContentController.createPartner);
  app.put('/api/employer-partners/:id', ContentController.updatePartner);
  app.delete('/api/employer-partners/:id', ContentController.deletePartner);

  // Homepage Highlights CMS
  app.get('/api/highlights', ContentController.getAllHighlights);
  app.post('/api/highlights', ContentController.createHighlight);
  app.put('/api/highlights/:id', ContentController.updateHighlight);
  app.delete('/api/highlights/:id', ContentController.deleteHighlight);

  // Downloads Center
  app.get('/api/downloads/:docType', ContentController.downloadDocument);

  // Integrated Documentation & Knowledge Base Endpoints
  app.get('/api/documents', DocumentController.getAllDocuments);
  app.get('/api/documents/bookmarks', DocumentController.getBookmarks);
  app.get('/api/documents/history/recent', DocumentController.getReadingHistory);
  app.get('/api/documents/analytics/summary', DocumentController.getAnalytics);
  app.post('/api/documents/search/record', DocumentController.recordSearch);
  app.get('/api/documents/:id', DocumentController.getDocumentById);
  app.post('/api/documents', DocumentController.createDocument);
  app.put('/api/documents/:id', DocumentController.updateDocument);
  app.delete('/api/documents/:id', DocumentController.deleteDocument);
  app.post('/api/documents/:id/bookmark', DocumentController.toggleBookmark);
  app.post('/api/documents/:id/feedback', DocumentController.submitFeedback);

  // AI Recruitment Intelligence Portal Endpoints
  app.post('/api/recruitment/discover', RecruitmentController.runDiscovery);
  app.get('/api/recruitment/opportunities', RecruitmentController.listOpportunities);
  app.post('/api/recruitment/opportunities', RecruitmentController.createOpportunity);
  app.get('/api/recruitment/opportunities/:id', RecruitmentController.getOpportunity);
  app.get('/api/recruitment/opportunities/:id/timeline', RecruitmentController.getOpportunityTimeline);
  app.put('/api/recruitment/opportunities/:id', RecruitmentController.updateOpportunity);
  app.put('/api/recruitment/opportunities/:id/publish', RecruitmentController.updateQueueStatus);
  app.delete('/api/recruitment/opportunities/:id', RecruitmentController.deleteOpportunity);
  app.get('/api/recruitment/sources', RecruitmentController.listSources);
  app.get('/api/recruitment/categories', RecruitmentController.listCategories);
  app.get('/api/recruitment/employers', RecruitmentController.listEmployers);
  app.get('/api/recruitment/employers/profiles', RecruitmentController.listEmployerProfiles);
  app.post('/api/recruitment/seed', RecruitmentController.seedRegistry);

  // New Phase 5.2 scheduler, notifications, change logs, duplicate history & expiry endpoints
  app.get('/api/recruitment/scheduler', RecruitmentController.getScheduler);
  app.put('/api/recruitment/scheduler', RecruitmentController.updateScheduler);
  app.post('/api/recruitment/scheduler/trigger', RecruitmentController.triggerSchedulerScan);
  app.get('/api/recruitment/notifications', RecruitmentController.listNotifications);
  app.post('/api/recruitment/notifications/read', RecruitmentController.markAllNotificationsRead);
  app.get('/api/recruitment/changelogs', RecruitmentController.listChangeLogs);
  app.get('/api/recruitment/duplicates', RecruitmentController.listDuplicateHistory);
  app.post('/api/recruitment/expiry/trigger', RecruitmentController.triggerExpiryVerification);

  // Phase 5.3 Personalized Career Coach & Matching Endpoints
  app.get('/api/career/dashboard', CareerCoachController.getDashboardData.bind(CareerCoachController));
  app.get('/api/career/roadmap', CareerCoachController.getRoadmap.bind(CareerCoachController));
  app.post('/api/career/bookmark', CareerCoachController.toggleBookmark.bind(CareerCoachController));
  app.post('/api/career/apply', CareerCoachController.applyOpportunity.bind(CareerCoachController));
  app.put('/api/career/applications/:id/status', CareerCoachController.updateApplicationStatus.bind(CareerCoachController));
  app.post('/api/career/cv-evaluate', CareerCoachController.evaluateCV.bind(CareerCoachController));
  app.get('/api/career/notifications', CareerCoachController.listNotifications.bind(CareerCoachController));
  app.post('/api/career/notifications/read', CareerCoachController.markAllNotificationsRead.bind(CareerCoachController));
  app.post('/api/career/coach/chat', CareerCoachController.chatWithCoach.bind(CareerCoachController));
  app.get('/api/career/analytics', CareerCoachController.getAnalytics.bind(CareerCoachController));
  app.post('/api/career/profile/update', CareerCoachController.updateProfile.bind(CareerCoachController));

  // Career Launch -> Technology Career Explorer Profiles & Bookmarks Endpoints
  app.get('/api/career-explorer/profiles', CareerExplorerController.getAllProfiles);
  app.get('/api/career-explorer/profiles/:id', CareerExplorerController.getProfileById);
  app.put('/api/career-explorer/profiles/:id', CareerExplorerController.updateProfile);
  app.post('/api/career-explorer/view/:id', CareerExplorerController.recordView);
  app.post('/api/career-explorer/register-click/:id', CareerExplorerController.recordRegisterClick);
  app.post('/api/career-explorer/save', CareerExplorerController.saveBookmark);
  app.post('/api/career-explorer/remove-save', CareerExplorerController.removeBookmark);
  app.get('/api/career-explorer/saved/:email', CareerExplorerController.getBookmarks);
  app.get('/api/career-explorer/analytics', CareerExplorerController.getAnalytics);

  // Phase 5.8 Operations & Notification Center Endpoints
  app.get('/api/operations/notifications', OperationsController.getNotifications);
  app.post('/api/operations/notifications/:id/read', OperationsController.markRead);
  app.post('/api/operations/notifications/:id/dismiss', OperationsController.dismissNotification);
  app.post('/api/operations/notifications/read-all', OperationsController.markAllRead);
  app.get('/api/operations/tasks', OperationsController.getTasks);
  app.post('/api/operations/tasks', OperationsController.createTask);
  app.put('/api/operations/tasks/:id', OperationsController.updateTask);
  app.get('/api/operations/calendar', OperationsController.getCalendar);
  app.post('/api/operations/calendar', OperationsController.createCalendarEvent);
  app.get('/api/operations/announcements', OperationsController.getAnnouncements);
  app.post('/api/operations/announcements', OperationsController.createAnnouncement);
  app.get('/api/operations/reminders', OperationsController.getReminders);
  app.post('/api/operations/reminders', OperationsController.saveReminders);
  app.get('/api/operations/kpis', OperationsController.getKPIs);
  app.get('/api/operations/health', OperationsController.getHealth);
  app.post('/api/operations/rules/trigger', OperationsController.triggerRules);
  app.post('/api/operations/backup', OperationsController.backupDatabase);

  // Platform Backup & Disaster Recovery Endpoints (Phase 5.9)
  app.get('/api/platform/backups', PlatformController.getBackups);
  app.post('/api/platform/backups', PlatformController.createBackup);
  app.post('/api/platform/backups/verify', PlatformController.verifyBackup);
  app.get('/api/platform/backups/:id/download', PlatformController.downloadBackup);
  app.post('/api/platform/backups/restore', PlatformController.restoreBackup);
  app.delete('/api/platform/backups/:id', PlatformController.deleteBackup);
  app.get('/api/platform/scheduler', PlatformController.getScheduler);
  app.post('/api/platform/scheduler', PlatformController.updateScheduler);
  app.get('/api/platform/diagnostics', PlatformController.getDiagnostics);
  app.get('/api/platform/db-inspect', PlatformController.getDatabaseInspector);
  app.get('/api/platform/maintenance', PlatformController.getMaintenance);
  app.post('/api/platform/maintenance', PlatformController.updateMaintenance);
  app.get('/api/platform/errors', PlatformController.getErrors);
  app.post('/api/platform/errors', PlatformController.logNewError);
  app.post('/api/platform/errors/:id/resolve', PlatformController.resolveError);
  app.get('/api/platform/env-validate', PlatformController.getEnvValidation);
  app.get('/api/platform/deployment', PlatformController.getDeploymentInfo);
  app.get('/api/health-check', PlatformController.getHealthCheck);

  // Background automated scheduler loop (checks every 60 seconds)
  setInterval(async () => {
    try {
      const state = await RecruitmentRepository.getSchedulerState();
      if (state && state.nextScheduledScan && new Date().getTime() >= new Date(state.nextScheduledScan).getTime()) {
        console.log("Background scheduler trigger matched scheduled time. Running discovery scan...");
        RecruitmentIntelligenceEngine.runSchedulerDiscoveryCycle().catch(err => {
          console.error("Error in background scheduled scan:", err);
        });
      }
    } catch (err) {
      console.error("Error in scheduler checker loop:", err);
    }
  }, 60000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Dev mode: Vite middleware attached.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production mode: Static files served from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
