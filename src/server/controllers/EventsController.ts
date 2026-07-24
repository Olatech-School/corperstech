/**
 * EventsController.ts
 * 
 * Express controller for Event Registration, Seat Reservation, Check-in,
 * Waiting List management, and Recharts analytics.
 */

import { Request, Response } from 'express';
import { EventsRepository } from '../repositories/EventsRepository.ts';

export class EventsController {
  /**
   * GET /api/events
   * Optionally accepts ?email=student@example.com to check reservation status
   */
  static async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const email = typeof req.query.email === 'string' ? req.query.email : undefined;
      const events = await EventsRepository.getAllEvents(email);
      res.json({ success: true, data: events });
    } catch (err: any) {
      console.error("Error fetching events:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to fetch events" });
    }
  }

  /**
   * GET /api/events/analytics
   * Command Center analytics for Recharts
   */
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = await EventsRepository.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (err: any) {
      console.error("Error fetching event analytics:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to fetch analytics" });
    }
  }

  /**
   * GET /api/events/:id
   */
  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const email = typeof req.query.email === 'string' ? req.query.email : undefined;
      const event = await EventsRepository.getEventById(id, email);
      res.json({ success: true, data: event });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message || "Event not found" });
    }
  }

  /**
   * POST /api/events
   */
  static async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const staffEmail = req.body.staffEmail || "admin@corpers.tech";
      const newEvent = await EventsRepository.createEvent(req.body, staffEmail);
      res.status(201).json({ success: true, data: newEvent, message: "Event published successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to create event" });
    }
  }

  /**
   * PUT /api/events/:id
   */
  static async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const staffEmail = req.body.staffEmail || "admin@corpers.tech";
      const updated = await EventsRepository.updateEvent(id, req.body, staffEmail);
      res.json({ success: true, data: updated, message: "Event updated successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to update event" });
    }
  }

  /**
   * DELETE /api/events/:id
   */
  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const staffEmail = typeof req.query.staffEmail === 'string' ? req.query.staffEmail : "admin@corpers.tech";
      await EventsRepository.deleteEvent(id, staffEmail);
      res.json({ success: true, message: "Event deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to delete event" });
    }
  }

  /**
   * POST /api/events/:id/reserve
   */
  static async reserveSeat(req: Request, res: Response): Promise<void> {
    try {
      const eventId = parseInt(req.params.id, 10);
      const result = await EventsRepository.reserveSeat(eventId, req.body);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || "Failed to reserve seat" });
    }
  }

  /**
   * DELETE /api/events/reservations/:id
   */
  static async cancelReservation(req: Request, res: Response): Promise<void> {
    try {
      const idParam = req.params.id;
      const userEmail = typeof req.query.email === 'string' ? req.query.email : undefined;
      const result = await EventsRepository.cancelReservation(idParam, userEmail);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || "Failed to cancel reservation" });
    }
  }

  /**
   * GET /api/student/events?email=student@example.com
   */
  static async getStudentEvents(req: Request, res: Response): Promise<void> {
    try {
      const email = typeof req.query.email === 'string' ? req.query.email : "";
      if (!email) {
        res.json({ success: true, data: [] });
        return;
      }
      const events = await EventsRepository.getStudentEvents(email);
      res.json({ success: true, data: events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch student events" });
    }
  }

  /**
   * POST /api/events/:id/checkin
   */
  static async markAttendance(req: Request, res: Response): Promise<void> {
    try {
      const eventId = parseInt(req.params.id, 10);
      const attendance = await EventsRepository.markAttendance(eventId, req.body);
      res.json({ success: true, data: attendance, message: `Attendance marked as ${req.body.status}` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || "Failed to mark attendance" });
    }
  }

  /**
   * GET /api/events/:id/attendees
   */
  static async getAttendees(req: Request, res: Response): Promise<void> {
    try {
      const eventId = parseInt(req.params.id, 10);
      const data = await EventsRepository.getAttendees(eventId, req.query);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch attendees" });
    }
  }

  /**
   * GET /api/events/:id/calendar or /api/events/:id/ics
   */
  static async downloadIcs(req: Request, res: Response): Promise<void> {
    try {
      const eventId = parseInt(req.params.id, 10);
      const userEmail = typeof req.query.email === 'string' ? req.query.email : undefined;
      const { filename, content } = await EventsRepository.generateIcs(eventId, userEmail);

      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message || "Failed to generate iCalendar file" });
    }
  }
}
