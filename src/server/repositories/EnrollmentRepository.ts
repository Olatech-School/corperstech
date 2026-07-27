import { getPrisma } from '../db.ts';
import fs from 'fs';
import path from 'path';

export interface CreateEnrollmentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  stateOfService: string;
  localGovernment: string;
  nyscBatch: string;
  ppa: string;
  course: string;
  transportationOption: string;
  pickupLocation?: string | null;
  whyInterested: string;
  previousTechExperience: string;
  laptopAvailable: string;
}

const FALLBACK_FILE = path.join(process.cwd(), 'enrollments-fallback-db.json');

function loadFallbackData(): any[] {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Failed to read fallback database file:', error);
  }

  // Initial seed data to populate the platform when database is offline
  const initialData = [
    {
      id: 1,
      firstName: "Yusuf",
      lastName: "Kolawole",
      email: "yusuf@gmail.com",
      phone: "07075958413",
      gender: "Male",
      dateOfBirth: "1998-05-12",
      stateOfOrigin: "Kwara",
      stateOfService: "Lagos",
      localGovernment: "Ikeja",
      nyscBatch: "2026 Batch A Stream I",
      ppa: "Olatech Technology Campus",
      course: "Cybersecurity",
      transportationOption: "Company Bus",
      pickupLocation: "Lagos Mainland (Yaba Tech Hub)",
      whyInterested: "I want to specialize in defensive cybersecurity operations to defend digital assets.",
      previousTechExperience: "Beginner",
      laptopAvailable: "Yes",
      status: "Enrolled",
      adminNotes: '{"notes": "Verified candidate", "checklist": {"docs": true, "laptop": true, "pay": true, "orient": true, "whatsapp": true, "ready": true}}',
      createdAt: "2026-06-25T10:00:00.000Z",
      updatedAt: "2026-06-25T10:00:00.000Z"
    },
    {
      id: 2,
      firstName: "Amina",
      lastName: "Aliyu",
      email: "amina@hotmail.com",
      phone: "08098765432",
      gender: "Female",
      dateOfBirth: "1999-08-20",
      stateOfOrigin: "Kano",
      stateOfService: "Lagos",
      localGovernment: "Victoria Island",
      nyscBatch: "2026 Batch A Stream II",
      ppa: "Access Bank Plc",
      course: "Data Analysis",
      transportationOption: "Individual Transportation",
      pickupLocation: null,
      whyInterested: "Data is the new oil. I want to build business dashboards and make data-driven decisions.",
      previousTechExperience: "None",
      laptopAvailable: "Yes",
      status: "Pending",
      adminNotes: null,
      createdAt: "2026-06-26T14:30:00.000Z",
      updatedAt: "2026-06-26T14:30:00.000Z"
    },
    {
      id: 3,
      firstName: "Chinedu",
      lastName: "Okonkwo",
      email: "chinedu@gmail.com",
      phone: "07011223344",
      gender: "Male",
      dateOfBirth: "1997-11-05",
      stateOfOrigin: "Anambra",
      stateOfService: "Abuja",
      localGovernment: "Garki",
      nyscBatch: "2026 Batch B Stream I",
      ppa: "Federal Ministry of Finance",
      course: "Web Development",
      transportationOption: "Company Bus",
      pickupLocation: "Abuja (Central Business District)",
      whyInterested: "I love building visual products on the web. Excited to learn React and modern stack.",
      previousTechExperience: "Intermediate",
      laptopAvailable: "Yes",
      status: "Approved",
      adminNotes: '{"notes": "Strong background", "checklist": {"docs": true, "laptop": true, "pay": false, "orient": false, "whatsapp": true, "ready": false}}',
      createdAt: "2026-06-27T08:15:00.000Z",
      updatedAt: "2026-06-27T08:15:00.000Z"
    }
  ];
  saveFallbackData(initialData);
  return initialData;
}

function saveFallbackData(data: any[]): void {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write fallback database file:', error);
  }
}

export class EnrollmentRepository {
  static async create(data: CreateEnrollmentInput) {
  try {
    const prisma = getPrisma();

    return await prisma.enrollment.create({
      data: {
        ...data,
        status: 'Pending',
      },
    });
  } catch (error) {
    console.error('❌ PRISMA ENROLLMENT CREATE FAILED:', error);

    const list = loadFallbackData();

    // Enforce unique email check
    const emailExists = list.some(
      item => item.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error(
        `Unique constraint failed: an enrollment with email ${data.email} already exists.`
      );
    }

    const nextId =
      list.reduce(
        (max, item) => item.id > max ? item.id : max,
        0
      ) + 1;

    const newRecord = {
      id: nextId,
      ...data,
      status: 'Pending',
      adminNotes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.push(newRecord);
    saveFallbackData(list);

    console.warn(
      `⚠️ Enrollment saved to fallback database with ID ${nextId}.`
    );

    return newRecord;
  }
}

  static async findAll() {
    try {
      const prisma = getPrisma();
      let records = await prisma.enrollment.findMany({
        orderBy: { createdAt: 'desc' },
      });

      if (records.length === 0) {
        const initialData = loadFallbackData();
        for (const item of initialData) {
          const { id, createdAt, updatedAt, ...rest } = item;
          await prisma.enrollment.create({
            data: {
              ...rest,
              adminNotes: typeof rest.adminNotes === 'object' && rest.adminNotes !== null
                ? JSON.stringify(rest.adminNotes)
                : rest.adminNotes,
              createdAt: createdAt ? new Date(createdAt) : new Date(),
              updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
            }
          });
        }
        records = await prisma.enrollment.findMany({
          orderBy: { createdAt: 'desc' },
        });
      }
      return records;
    } catch (error) {
      const list = loadFallbackData();
      return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  static async findById(id: number) {
    try {
      const prisma = getPrisma();
      return await prisma.enrollment.findUnique({
        where: { id },
      });
    } catch (error) {
      const list = loadFallbackData();
      const record = list.find(item => item.id === id);
      return record || null;
    }
  }

  static async findByEmail(email: string) {
    try {
      const prisma = getPrisma();
      return await prisma.enrollment.findUnique({
        where: { email },
      });
    } catch (error) {
      const list = loadFallbackData();
      const record = list.find(item => item.email.toLowerCase() === email.toLowerCase());
      return record || null;
    }
  }

  static async updateStatus(id: number, status: string) {
    try {
      const prisma = getPrisma();
      return await prisma.enrollment.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      const list = loadFallbackData();
      const index = list.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Enrollment not found with ID ${id}`);
      }
      
      const updated = {
        ...list[index],
        status,
        updatedAt: new Date().toISOString()
      };
      list[index] = updated;
      saveFallbackData(list);
      return updated;
    }
  }

  static async updateAdminNotes(id: number, adminNotes: string) {
    try {
      const prisma = getPrisma();
      return await prisma.enrollment.update({
        where: { id },
        data: { adminNotes },
      });
    } catch (error) {
      const list = loadFallbackData();
      const index = list.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Enrollment not found with ID ${id}`);
      }
      
      const updated = {
        ...list[index],
        adminNotes,
        updatedAt: new Date().toISOString()
      };
      list[index] = updated;
      saveFallbackData(list);
      return updated;
    }
  }

  static async findByRefOrEmail(refOrEmail: string) {
    try {
      const prisma = getPrisma();
      const cleanInput = refOrEmail.trim();
      let idMatch: number | null = null;
      
      const match = cleanInput.match(/CT-\d{4}-(\d+)/i);
      if (match) {
        idMatch = parseInt(match[1], 10);
      } else if (/^\d+$/.test(cleanInput)) {
        idMatch = parseInt(cleanInput, 10);
      }

      if (idMatch !== null) {
        const record = await prisma.enrollment.findUnique({
          where: { id: idMatch },
        });
        if (record) return record;
      }

      return await prisma.enrollment.findUnique({
        where: { email: cleanInput.toLowerCase() },
      });
    } catch (error) {
      const list = loadFallbackData();
      const cleanInput = refOrEmail.trim();
      
      // Match ID from reference code CT-2026-0001 -> 1
      let idMatch: number | null = null;
      const match = cleanInput.match(/CT-\d{4}-(\d+)/i);
      if (match) {
        idMatch = parseInt(match[1], 10);
      } else if (/^\d+$/.test(cleanInput)) {
        idMatch = parseInt(cleanInput, 10);
      }

      if (idMatch !== null) {
        const record = list.find(item => item.id === idMatch);
        if (record) return record;
      }

      const recordByEmail = list.find(item => item.email.toLowerCase() === cleanInput.toLowerCase());
      return recordByEmail || null;
    }
  }

  static async delete(id: number) {
    try {
      const prisma = getPrisma();
      return await prisma.enrollment.delete({
        where: { id },
      });
    } catch (error) {
      const list = loadFallbackData();
      const record = list.find(item => item.id === id);
      if (!record) {
        throw new Error(`Enrollment not found with ID ${id}`);
      }
      
      const updatedList = list.filter(item => item.id !== id);
      saveFallbackData(updatedList);
      return record;
    }
  }
}
