import { getPrisma } from '../db.ts';
import fs from 'fs';
import path from 'path';

export interface AuditLogData {
  id: number;
  timestamp: string;
  user: string;
  userRole: string;
  eventType: string;
  description: string;
  status: string; // 'Success' | 'Failed'
}

const FALLBACK_FILE = path.join(process.cwd(), 'auditlogs-fallback-db.json');

function loadFallbackData(): AuditLogData[] {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Failed to read audit logs fallback database:', error);
  }
  return [];
}

function saveFallbackData(data: AuditLogData[]) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write audit logs fallback database:', error);
  }
}

export class AuditLogRepository {
  static async create(data: Omit<AuditLogData, 'id' | 'timestamp'>): Promise<AuditLogData> {
    const timestamp = new Date().toISOString();
    try {
      const prisma = getPrisma();
      const record = await prisma.auditLog.create({
        data: {
          ...data,
          timestamp: new Date(timestamp)
        }
      });
      
      const formatted: AuditLogData = {
        id: record.id,
        user: record.user,
        userRole: record.userRole,
        eventType: record.eventType,
        description: record.description,
        status: record.status,
        timestamp: record.timestamp.toISOString()
      };

      const list = loadFallbackData();
      list.push(formatted);
      saveFallbackData(list);
      
      return formatted;
    } catch (error) {
      const list = loadFallbackData();
      const nextId = list.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
      const newRecord: AuditLogData = {
        id: nextId,
        timestamp,
        ...data
      };
      list.push(newRecord);
      saveFallbackData(list);
      return newRecord;
    }
  }

  static async findAll(): Promise<AuditLogData[]> {
    try {
      const prisma = getPrisma();
      const records = await prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' }
      });
      return records.map(r => ({
        id: r.id,
        user: r.user,
        userRole: r.userRole,
        eventType: r.eventType,
        description: r.description,
        status: r.status,
        timestamp: r.timestamp.toISOString()
      }));
    } catch (error) {
      const list = loadFallbackData();
      return [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }
}
