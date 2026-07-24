import { Request, Response } from 'express';
import { AuditLogRepository } from '../repositories/AuditLogRepository.ts';

export class AuditLogController {
  static async getAllLogs(req: Request, res: Response) {
    try {
      const logs = await AuditLogRepository.findAll();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to retrieve audit logs.' });
    }
  }

  static async createLog(req: Request, res: Response) {
    const { user, userRole, eventType, description, status } = req.body;
    if (!user || !userRole || !eventType || !description || !status) {
      return res.status(400).json({ error: 'All fields (user, userRole, eventType, description, status) are required.' });
    }

    try {
      const log = await AuditLogRepository.create({
        user,
        userRole,
        eventType,
        description,
        status
      });
      res.status(214).json(log);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create audit log.' });
    }
  }
}
