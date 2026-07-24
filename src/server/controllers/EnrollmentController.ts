import { Request, Response } from 'express';
import { EnrollmentService } from '../services/EnrollmentService.ts';

export class EnrollmentController {
  static async createEnrollment(req: Request, res: Response) {
    try {
      const enrollment = await EnrollmentService.enroll(req.body);
      res.status(201).json({
        success: true,
        message: 'Enrollment completed successfully.',
        data: enrollment,
      });
    } catch (error: any) {
      console.warn('Enrollment creation request failed:', error.message);
      res.status(400).json({
        success: false,
        error: error.message || 'An unexpected error occurred during enrollment.',
      });
    }
  }

  static async getAllEnrollments(req: Request, res: Response) {
    try {
      const enrollments = await EnrollmentService.getAllEnrollments();
      res.status(200).json({
        success: true,
        data: enrollments,
      });
    } catch (error: any) {
      console.error('Fetching enrollments failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred while fetching enrollments.',
      });
    }
  }

  static async getEnrollmentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const enrollment = await EnrollmentService.getEnrollmentById(id);
      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error: any) {
      console.warn(`Fetching enrollment ID ${req.params.id} failed:`, error.message);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'An unexpected error occurred.',
      });
    }
  }

  static async updateEnrollmentStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required.',
        });
      }

      const updatedEnrollment = await EnrollmentService.updateEnrollmentStatus(id, status);
      res.status(200).json({
        success: true,
        message: `Enrollment status updated to ${status}.`,
        data: updatedEnrollment,
      });
    } catch (error: any) {
      console.warn(`Updating enrollment ID ${req.params.id} failed:`, error.message);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'An unexpected error occurred.',
      });
    }
  }

  static async deleteEnrollment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await EnrollmentService.deleteEnrollment(id);
      res.status(200).json({
        success: true,
        message: 'Enrollment deleted successfully.',
      });
    } catch (error: any) {
      console.warn(`Deleting enrollment ID ${req.params.id} failed:`, error.message);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'An unexpected error occurred.',
      });
    }
  }

  static async trackEnrollment(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Query parameter is required.',
        });
      }
      
      const enrollment = await EnrollmentService.getEnrollmentByRefOrEmail(query);
      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message || 'Enrollment not found.',
      });
    }
  }

  static async updateEnrollmentAdminNotes(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { adminNotes } = req.body;
      
      const updatedEnrollment = await EnrollmentService.updateEnrollmentAdminNotes(id, adminNotes);
      res.status(200).json({
        success: true,
        message: 'Administrative notes updated.',
        data: updatedEnrollment,
      });
    } catch (error: any) {
      console.warn(`Updating admin notes for ID ${req.params.id} failed:`, error.message);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'An unexpected error occurred.',
      });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await EnrollmentService.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Fetching stats failed:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred while fetching stats.',
      });
    }
  }
}
