import { EnrollmentRepository, CreateEnrollmentInput } from '../repositories/EnrollmentRepository.ts';

export class EnrollmentService {
  static async enroll(data: CreateEnrollmentInput) {
    // Validate required fields
    const requiredFields: (keyof CreateEnrollmentInput)[] = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
      'dateOfBirth',
      'stateOfOrigin',
      'stateOfService',
      'localGovernment',
      'nyscBatch',
      'ppa',
      'course',
      'transportationOption',
      'whyInterested',
      'previousTechExperience',
      'laptopAvailable'
    ];

    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === '') {
        throw new Error(`The field '${field}' is required.`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address.');
    }

    // Validate phone number (simple validation, can be adjusted)
    if (data.phone.trim().length < 8) {
      throw new Error('Please enter a valid phone number.');
    }

    // Prevent duplicate registrations using email
    const existingEnrollment = await EnrollmentRepository.findByEmail(data.email.trim().toLowerCase());
    if (existingEnrollment) {
      throw new Error('This email address is already registered. Please use a different email or contact support.');
    }

    // Sanitize email and values
    const sanitizedData: CreateEnrollmentInput = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      gender: data.gender.trim(),
      dateOfBirth: data.dateOfBirth.trim(),
      stateOfOrigin: data.stateOfOrigin.trim(),
      stateOfService: data.stateOfService.trim(),
      localGovernment: data.localGovernment.trim(),
      nyscBatch: data.nyscBatch.trim(),
      ppa: data.ppa.trim(),
      course: data.course.trim(),
      transportationOption: data.transportationOption.trim(),
      pickupLocation: data.transportationOption === 'Company Bus' ? (data.pickupLocation?.trim() || null) : null,
      whyInterested: data.whyInterested.trim(),
      previousTechExperience: data.previousTechExperience.trim(),
      laptopAvailable: data.laptopAvailable.trim()
    };

    return await EnrollmentRepository.create(sanitizedData);
  }

  static async getAllEnrollments() {
    return await EnrollmentRepository.findAll();
  }

  static async getEnrollmentById(id: number) {
    if (isNaN(id)) {
      throw new Error('Invalid enrollment ID format.');
    }
    const enrollment = await EnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error(`Enrollment with ID ${id} not found.`);
    }
    return enrollment;
  }

  static async updateEnrollmentStatus(id: number, status: string) {
    if (isNaN(id)) {
      throw new Error('Invalid enrollment ID format.');
    }
    const allowedStatuses = ['Pending', 'Reviewed', 'Approved', 'Rejected', 'Enrolled'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
    }

    // Ensure it exists first
    await this.getEnrollmentById(id);

    return await EnrollmentRepository.updateStatus(id, status);
  }

  static async updateEnrollmentAdminNotes(id: number, adminNotes: string) {
    if (isNaN(id)) {
      throw new Error('Invalid enrollment ID format.');
    }
    // Ensure it exists first
    await this.getEnrollmentById(id);

    return await EnrollmentRepository.updateAdminNotes(id, adminNotes);
  }

  static async getEnrollmentByRefOrEmail(refOrEmail: string) {
    if (!refOrEmail || refOrEmail.trim() === '') {
      throw new Error('Please enter a registration reference or email address.');
    }
    const enrollment = await EnrollmentRepository.findByRefOrEmail(refOrEmail);
    if (!enrollment) {
      throw new Error(`No application found for '${refOrEmail}'. Please verify your reference number or email.`);
    }
    return enrollment;
  }

  static async getStats() {
    const enrollments = await EnrollmentRepository.findAll();
    
    const total = enrollments.length;
    
    const statusCounts = {
      Pending: 0,
      Reviewed: 0,
      Approved: 0,
      Rejected: 0,
      Enrolled: 0
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayCount = 0;
    
    const courseDistribution: Record<string, number> = {};
    
    const transportationCounts = {
      'Company Bus': 0,
      'Individual Transportation': 0
    };
    
    const laptopCounts = {
      'Yes': 0,
      'No': 0
    };
    
    const genderCounts: Record<string, number> = {};
    const stateOfServiceCounts: Record<string, number> = {};
    const batchCounts: Record<string, number> = {};
    
    for (const item of enrollments) {
      const statusKey = item.status as keyof typeof statusCounts;
      if (statusKey in statusCounts) {
        statusCounts[statusKey]++;
      }
      
      const itemDate = new Date(item.createdAt);
      if (itemDate >= today) {
        todayCount++;
      }
      
      courseDistribution[item.course] = (courseDistribution[item.course] || 0) + 1;
      
      const transKey = item.transportationOption as keyof typeof transportationCounts;
      if (transKey in transportationCounts) {
        transportationCounts[transKey]++;
      }
      
      const laptopKey = item.laptopAvailable as keyof typeof laptopCounts;
      if (laptopKey in laptopCounts) {
        laptopCounts[laptopKey]++;
      }
      
      genderCounts[item.gender] = (genderCounts[item.gender] || 0) + 1;
      stateOfServiceCounts[item.stateOfService] = (stateOfServiceCounts[item.stateOfService] || 0) + 1;
      batchCounts[item.nyscBatch] = (batchCounts[item.nyscBatch] || 0) + 1;
    }
    
    return {
      total,
      todayCount,
      statusCounts,
      courseDistribution,
      transportationCounts,
      laptopCounts,
      genderCounts,
      stateOfServiceCounts,
      batchCounts
    };
  }

  static async deleteEnrollment(id: number) {
    if (isNaN(id)) {
      throw new Error('Invalid enrollment ID format.');
    }
    
    // Ensure it exists first
    await this.getEnrollmentById(id);

    return await EnrollmentRepository.delete(id);
  }
}
