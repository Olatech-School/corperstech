import { Request, Response } from 'express';
import { CareerExplorerRepository } from '../repositories/CareerExplorerRepository.ts';

export class CareerExplorerController {
  static async getAllProfiles(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await CareerExplorerRepository.getAllProfiles();
      res.status(200).json({ success: true, data: profiles });
    } catch (err: any) {
      console.error("Error fetching career profiles:", err);
      res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
  }

  static async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const profile = await CareerExplorerRepository.getProfileById(id);
      if (!profile) {
        res.status(404).json({ success: false, error: 'Career profile not found' });
        return;
      }
      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await CareerExplorerRepository.updateProfile(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Career profile not found' });
        return;
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async recordView(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email } = req.body || {};
      await CareerExplorerRepository.recordMetric(id, 'VIEW', email);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async recordRegisterClick(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email } = req.body || {};
      await CareerExplorerRepository.recordMetric(id, 'REGISTER_CLICK', email);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async saveBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { email, courseId, courseTitle, notes } = req.body;
      if (!email || !courseId) {
        res.status(400).json({ success: false, error: 'email and courseId are required' });
        return;
      }
      const item = await CareerExplorerRepository.saveBookmark(email, courseId, courseTitle || courseId, notes || '');
      res.status(200).json({ success: true, data: item });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async removeBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { email, courseId } = req.body;
      if (!email || !courseId) {
        res.status(400).json({ success: false, error: 'email and courseId are required' });
        return;
      }
      await CareerExplorerRepository.removeBookmark(email, courseId);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const list = await CareerExplorerRepository.getBookmarks(email);
      res.status(200).json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await CareerExplorerRepository.getCommandCenterStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
