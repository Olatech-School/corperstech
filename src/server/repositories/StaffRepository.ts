import { getPrisma } from '../db.ts';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '../utils/security.ts';

export interface StaffData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string; // 'Active' | 'Suspended' | 'Disabled'
  passwordHash: string;
  forcePasswordChange: boolean;
  lastLogin: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const FALLBACK_FILE = path.join(process.cwd(), 'staff-fallback-db.json');

const INITIAL_SUPER_ADMIN = {
  id: 1,
  firstName: "Super",
  lastName: "Admin",
  email: "admineducert@gmail.com",
  phone: "08000000000",
  role: "Super Admin",
  status: "Active",
  passwordHash: hashPassword("admin3041educert"),
  forcePasswordChange: false,
  lastLogin: null,
  isDeleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

function loadFallbackData(): StaffData[] {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Failed to read staff fallback database:', error);
  }
  return [INITIAL_SUPER_ADMIN];
}

function saveFallbackData(data: StaffData[]) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write staff fallback database:', error);
  }
}

export class StaffRepository {
  static async seedSuperAdmin() {
    try {
      const prisma = getPrisma();
      const existing = await prisma.staff.findUnique({
        where: { email: INITIAL_SUPER_ADMIN.email }
      });
      if (!existing) {
        await prisma.staff.create({
          data: {
            firstName: INITIAL_SUPER_ADMIN.firstName,
            lastName: INITIAL_SUPER_ADMIN.lastName,
            email: INITIAL_SUPER_ADMIN.email,
            phone: INITIAL_SUPER_ADMIN.phone,
            role: INITIAL_SUPER_ADMIN.role,
            status: INITIAL_SUPER_ADMIN.status,
            passwordHash: INITIAL_SUPER_ADMIN.passwordHash,
            forcePasswordChange: INITIAL_SUPER_ADMIN.forcePasswordChange,
            isDeleted: false,
            createdAt: new Date(INITIAL_SUPER_ADMIN.createdAt),
            updatedAt: new Date(INITIAL_SUPER_ADMIN.updatedAt)
          }
        });
        console.log('Seeded initial Super Admin inside Prisma.');
      }
    } catch (error) {
      const list = loadFallbackData();
      if (!list.some(s => s.email.toLowerCase() === INITIAL_SUPER_ADMIN.email.toLowerCase())) {
        list.push(INITIAL_SUPER_ADMIN);
        saveFallbackData(list);
      }
    }
  }

  static async findByEmail(email: string): Promise<StaffData | null> {
    try {
      await this.seedSuperAdmin();
      const prisma = getPrisma();
      const staff = await prisma.staff.findFirst({
        where: { email, isDeleted: false }
      });
      if (!staff) return null;
      return {
        ...staff,
        lastLogin: staff.lastLogin ? staff.lastLogin.toISOString() : null,
        createdAt: staff.createdAt.toISOString(),
        updatedAt: staff.updatedAt.toISOString()
      };
    } catch (error) {
      const list = loadFallbackData();
      const staff = list.find(s => s.email.toLowerCase() === email.toLowerCase() && !s.isDeleted);
      return staff || null;
    }
  }

  static async findAll(): Promise<StaffData[]> {
    try {
      await this.seedSuperAdmin();
      const prisma = getPrisma();
      const records = await prisma.staff.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' }
      });
      return records.map(r => ({
        ...r,
        lastLogin: r.lastLogin ? r.lastLogin.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      }));
    } catch (error) {
      const list = loadFallbackData();
      return list.filter(s => !s.isDeleted).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  static async findById(id: number): Promise<StaffData | null> {
    try {
      const prisma = getPrisma();
      const r = await prisma.staff.findUnique({
        where: { id }
      });
      if (!r || r.isDeleted) return null;
      return {
        ...r,
        lastLogin: r.lastLogin ? r.lastLogin.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
      };
    } catch (error) {
      const list = loadFallbackData();
      const staff = list.find(s => s.id === id && !s.isDeleted);
      return staff || null;
    }
  }

  static async create(data: Omit<StaffData, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'lastLogin'>): Promise<StaffData> {
    const timestamp = new Date().toISOString();
    try {
      const prisma = getPrisma();
      const record = await prisma.staff.create({
        data: {
          ...data,
          isDeleted: false,
          createdAt: new Date(timestamp),
          updatedAt: new Date(timestamp)
        }
      });
      // Sync local JSON just in case
      const list = loadFallbackData();
      const formatted = {
        ...record,
        lastLogin: null,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      list.push(formatted);
      saveFallbackData(list);

      return formatted;
    } catch (error) {
      const list = loadFallbackData();
      const nextId = list.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
      const newRecord: StaffData = {
        id: nextId,
        ...data,
        lastLogin: null,
        isDeleted: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      list.push(newRecord);
      saveFallbackData(list);
      return newRecord;
    }
  }

  static async update(id: number, data: Partial<Omit<StaffData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<StaffData> {
    const timestamp = new Date().toISOString();
    try {
      const prisma = getPrisma();
      const updatePayload: any = { ...data };
      if (data.lastLogin) updatePayload.lastLogin = new Date(data.lastLogin);
      
      const record = await prisma.staff.update({
        where: { id },
        data: {
          ...updatePayload,
          updatedAt: new Date(timestamp)
        }
      });

      // Sync local JSON
      const list = loadFallbackData();
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...data,
          updatedAt: timestamp
        };
        saveFallbackData(list);
      }

      return {
        ...record,
        lastLogin: record.lastLogin ? record.lastLogin.toISOString() : null,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString()
      };
    } catch (error) {
      const list = loadFallbackData();
      const idx = list.findIndex(r => r.id === id);
      if (idx === -1) throw new Error(`Staff with ID ${id} not found.`);
      const updated = {
        ...list[idx],
        ...data,
        updatedAt: timestamp
      };
      list[idx] = updated;
      saveFallbackData(list);
      return updated;
    }
  }

  static async softDelete(id: number): Promise<boolean> {
    try {
      const prisma = getPrisma();
      await prisma.staff.update({
        where: { id },
        data: { isDeleted: true }
      });
      // Sync local JSON
      const list = loadFallbackData();
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx].isDeleted = true;
        list[idx].updatedAt = new Date().toISOString();
        saveFallbackData(list);
      }
      return true;
    } catch (error) {
      const list = loadFallbackData();
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx].isDeleted = true;
        list[idx].updatedAt = new Date().toISOString();
        saveFallbackData(list);
        return true;
      }
      return false;
    }
  }

  static async restore(id: number): Promise<boolean> {
    try {
      const prisma = getPrisma();
      await prisma.staff.update({
        where: { id },
        data: { isDeleted: false }
      });
      // Sync local JSON
      const list = loadFallbackData();
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx].isDeleted = false;
        list[idx].updatedAt = new Date().toISOString();
        saveFallbackData(list);
      }
      return true;
    } catch (error) {
      const list = loadFallbackData();
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx].isDeleted = false;
        list[idx].updatedAt = new Date().toISOString();
        saveFallbackData(list);
        return true;
      }
      return false;
    }
  }
}
