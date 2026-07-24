import { Request, Response } from 'express';
import { StaffRepository } from '../repositories/StaffRepository.ts';
import { AuditLogRepository } from '../repositories/AuditLogRepository.ts';
import { hashPassword, verifyPassword } from '../utils/security.ts';
import { getPrisma } from '../db.ts';

export class StaffController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and passcode are required.' });
    }

    try {
      const staff = await StaffRepository.findByEmail(email);
      if (!staff) {
        await AuditLogRepository.create({
          user: email,
          userRole: 'Unknown',
          eventType: 'Failed Login',
          description: `Failed login attempt for unregistered email: ${email}`,
          status: 'Failed'
        });
        return res.status(401).json({ error: 'Invalid operational credentials.' });
      }

      if (staff.status === 'Suspended' || staff.status === 'Disabled') {
        await AuditLogRepository.create({
          user: `${staff.firstName} ${staff.lastName}`,
          userRole: staff.role,
          eventType: 'Failed Login',
          description: `Blocked login attempt for ${staff.status} account: ${email}`,
          status: 'Failed'
        });
        return res.status(403).json({ error: `Your account is currently ${staff.status}. Please contact the Super Admin.` });
      }

      const isValid = verifyPassword(password, staff.passwordHash);
      if (!isValid) {
        await AuditLogRepository.create({
          user: `${staff.firstName} ${staff.lastName}`,
          userRole: staff.role,
          eventType: 'Failed Login',
          description: `Incorrect passcode entered for ${email}`,
          status: 'Failed'
        });
        return res.status(401).json({ error: 'Invalid operational credentials.' });
      }

      // Update last login
      const lastLoginTime = new Date().toISOString();
      await StaffRepository.update(staff.id, { lastLogin: lastLoginTime });

      await AuditLogRepository.create({
        user: `${staff.firstName} ${staff.lastName}`,
        userRole: staff.role,
        eventType: 'Login',
        description: `Staff member logged in successfully: ${email}`,
        status: 'Success'
      });

      res.json({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        name: `${staff.firstName} ${staff.lastName}`,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        status: staff.status,
        forcePasswordChange: staff.forcePasswordChange,
        lastLogin: lastLoginTime
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Server error during login.' });
    }
  }

  static async logout(req: Request, res: Response) {
    const { email } = req.body;
    try {
      if (email) {
        const staff = await StaffRepository.findByEmail(email);
        if (staff) {
          await AuditLogRepository.create({
            user: `${staff.firstName} ${staff.lastName}`,
            userRole: staff.role,
            eventType: 'Logout',
            description: `Staff member logged out: ${email}`,
            status: 'Success'
          });
        }
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed.' });
    }
  }

  static async getAllStaff(req: Request, res: Response) {
    try {
      const staffList = await StaffRepository.findAll();
      res.json(staffList);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to retrieve staff list.' });
    }
  }

  static async createStaff(req: Request, res: Response) {
    const { firstName, lastName, email, phone, role, password, status, forcePasswordChange } = req.body;
    const adminUser = req.headers['x-admin-user'] as string || 'Super Admin';
    const adminRole = req.headers['x-admin-role'] as string || 'Super Admin';

    if (!firstName || !lastName || !email || !role || !password) {
      return res.status(400).json({ error: 'First name, last name, email, role, and password are required.' });
    }

    try {
      const existing = await StaffRepository.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Duplicate staff email. This email address is already registered.' });
      }

      const pHash = hashPassword(password);
      const newStaff = await StaffRepository.create({
        firstName,
        lastName,
        email,
        phone: phone || '',
        role,
        status: status || 'Active',
        passwordHash: pHash,
        forcePasswordChange: forcePasswordChange || false
      });

      await AuditLogRepository.create({
        user: adminUser,
        userRole: adminRole,
        eventType: 'Staff Creation',
        description: `Created new staff account: ${firstName} ${lastName} (${email}) as ${role}`,
        status: 'Success'
      });

      res.status(214).json({
        id: newStaff.id,
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        name: `${newStaff.firstName} ${newStaff.lastName}`,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        status: newStaff.status,
        forcePasswordChange: newStaff.forcePasswordChange
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create staff.' });
    }
  }

  static async updateStaff(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { firstName, lastName, email, phone, role, status } = req.body;
    const adminUser = req.headers['x-admin-user'] as string || 'Super Admin';
    const adminRole = req.headers['x-admin-role'] as string || 'Super Admin';

    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format.' });

    try {
      const target = await StaffRepository.findById(id);
      if (!target) return res.status(404).json({ error: 'Staff member not found.' });

      if (email && email.toLowerCase() !== target.email.toLowerCase()) {
        const dup = await StaffRepository.findByEmail(email);
        if (dup) return res.status(400).json({ error: 'Email already in use by another staff member.' });
      }

      const updated = await StaffRepository.update(id, {
        firstName,
        lastName,
        email,
        phone,
        role,
        status
      });

      // Log event
      let auditType = 'Staff Update';
      let auditDesc = `Updated details for staff member: ${firstName} ${lastName} (${email})`;
      if (status !== target.status) {
        auditType = 'Staff Suspension';
        auditDesc = `Changed status of ${firstName} ${lastName} to ${status}`;
      }

      await AuditLogRepository.create({
        user: adminUser,
        userRole: adminRole,
        eventType: auditType,
        description: auditDesc,
        status: 'Success'
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update staff.' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { newPassword, forcePasswordChange } = req.body;
    const adminUser = req.headers['x-admin-user'] as string || 'Super Admin';
    const adminRole = req.headers['x-admin-role'] as string || 'Super Admin';

    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format.' });
    if (!newPassword) return res.status(400).json({ error: 'New password is required.' });

    try {
      const target = await StaffRepository.findById(id);
      if (!target) return res.status(404).json({ error: 'Staff member not found.' });

      const passwordHash = hashPassword(newPassword);
      await StaffRepository.update(id, {
        passwordHash,
        forcePasswordChange: forcePasswordChange || false
      });

      await AuditLogRepository.create({
        user: adminUser,
        userRole: adminRole,
        eventType: 'Password Reset',
        description: `Reset password for staff member: ${target.firstName} ${target.lastName}`,
        status: 'Success'
      });

      res.json({ success: true, message: 'Password has been reset successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to reset password.' });
    }
  }

  static async softDeleteStaff(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const adminUser = req.headers['x-admin-user'] as string || 'Super Admin';
    const adminRole = req.headers['x-admin-role'] as string || 'Super Admin';

    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format.' });

    try {
      const target = await StaffRepository.findById(id);
      if (!target) return res.status(404).json({ error: 'Staff member not found.' });

      await StaffRepository.softDelete(id);

      await AuditLogRepository.create({
        user: adminUser,
        userRole: adminRole,
        eventType: 'Staff Update',
        description: `Soft deleted staff account: ${target.firstName} ${target.lastName}`,
        status: 'Success'
      });

      res.json({ success: true, message: 'Staff member soft deleted successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to soft delete staff.' });
    }
  }

  static async restoreStaff(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const adminUser = req.headers['x-admin-user'] as string || 'Super Admin';
    const adminRole = req.headers['x-admin-role'] as string || 'Super Admin';

    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format.' });

    try {
      // Find even in fallback/db deleted records
      const list = await StaffRepository.findAll();
      // Since findAll filter out isDeleted: true, let's look at getPrisma directly or loadFallbackData
      const prisma = getPrisma();
      let targetName = 'Staff Member';
      try {
        const staff = await prisma.staff.findUnique({ where: { id } });
        if (staff) targetName = `${staff.firstName} ${staff.lastName}`;
      } catch {
        // Fallback
      }

      await StaffRepository.restore(id);

      await AuditLogRepository.create({
        user: adminUser,
        userRole: adminRole,
        eventType: 'Staff Update',
        description: `Restored soft deleted staff account: ${targetName}`,
        status: 'Success'
      });

      res.json({ success: true, message: 'Staff member restored successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to restore staff.' });
    }
  }
}
