import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ArrowRight, Sparkles, User, Mail, Phone, MapPin, GraduationCap, BookOpen, Laptop, Bus, AlertCircle } from 'lucide-react';
import { NYSC_STATES, NYSC_BATCHES } from '../data';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgramId?: string;
}

interface EnrollmentFormState {
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
  courseOthers?: string;
  transportationOption: string;
  pickupLocation: string;
  whyInterested: string;
  previousTechExperience: string;
  laptopAvailable: string;
}

export default function RegisterModal({ isOpen, onClose, defaultProgramId = '' }: RegisterModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EnrollmentFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    stateOfOrigin: '',
    stateOfService: '',
    localGovernment: '',
    nyscBatch: '',
    ppa: '',
    course: defaultProgramId === 'cybersecurity' ? 'Cybersecurity' :
            defaultProgramId === 'data-analysis' ? 'Data Analysis' :
            defaultProgramId === 'web-dev' ? 'Web Development' :
            defaultProgramId === 'python' ? 'Python Programming' :
            defaultProgramId === 'graphics-design' ? 'Graphics Design' :
            defaultProgramId === 'app-dev' ? 'App Development' :
            defaultProgramId === 'virtual-assistant' ? 'Virtual Assistant' : '',
    courseOthers: '',
    transportationOption: '',
    pickupLocation: '',
    whyInterested: '',
    previousTechExperience: '',
    laptopAvailable: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentFormState, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEnrollment, setCreatedEnrollment] = useState<any>(null);

  const validateStep = (currentStep: number) => {
    const newErrors: Partial<Record<keyof EnrollmentFormState, string>> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    } 
    
    else if (currentStep === 2) {
      if (!formData.stateOfOrigin) newErrors.stateOfOrigin = 'State of origin is required';
      if (!formData.stateOfService) newErrors.stateOfService = 'State of service is required';
      if (!formData.localGovernment.trim()) newErrors.localGovernment = 'Local government is required';
      if (!formData.nyscBatch) newErrors.nyscBatch = 'NYSC batch is required';
      if (!formData.ppa.trim()) newErrors.ppa = 'Place of Primary Assignment (PPA) is required';
    } 
    
    else if (currentStep === 3) {
      if (!formData.course) newErrors.course = 'Please select a tech course';
      if (formData.course === 'Others (Specify)' && !formData.courseOthers?.trim()) {
        newErrors.courseOthers = 'Please specify your course';
      }
      if (!formData.whyInterested.trim()) newErrors.whyInterested = 'Please let us know why you are interested';
      if (!formData.previousTechExperience.trim()) newErrors.previousTechExperience = 'Experience explanation is required (enter "None" if none)';
      if (!formData.laptopAvailable) newErrors.laptopAvailable = 'Please specify if you own a laptop';
    } 
    
    else if (currentStep === 4) {
      if (!formData.transportationOption) newErrors.transportationOption = 'Please select a transportation option';
      if (formData.transportationOption === 'Company Bus' && !formData.pickupLocation.trim()) {
        newErrors.pickupLocation = 'Pickup location is required for company bus';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setApiError(null);

    const finalCourse = formData.course === 'Others (Specify)' 
      ? `Others: ${formData.courseOthers}` 
      : formData.course;

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      stateOfOrigin: formData.stateOfOrigin,
      stateOfService: formData.stateOfService,
      localGovernment: formData.localGovernment,
      nyscBatch: formData.nyscBatch,
      ppa: formData.ppa,
      course: finalCourse,
      transportationOption: formData.transportationOption,
      pickupLocation: formData.transportationOption === 'Company Bus' ? formData.pickupLocation : null,
      whyInterested: formData.whyInterested,
      previousTechExperience: formData.previousTechExperience,
      laptopAvailable: formData.laptopAvailable,
    };

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Server error. Please try again.');
      }

      setCreatedEnrollment(result.data);
      setStep(5); // Show success screen
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setApiError(err.message || 'An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (key: keyof EnrollmentFormState, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
    setApiError(null);
  };

  // Reset modal state on close
  const handleClose = () => {
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      stateOfOrigin: '',
      stateOfService: '',
      localGovernment: '',
      nyscBatch: '',
      ppa: '',
      course: '',
      courseOthers: '',
      transportationOption: '',
      pickupLocation: '',
      whyInterested: '',
      previousTechExperience: '',
      laptopAvailable: '',
    });
    setErrors({});
    setApiError(null);
    setCreatedEnrollment(null);
    onClose();
  };

  if (!isOpen) return null;

  const courses = [
    'Cybersecurity',
    'Data Analysis',
    'Web Development',
    'Python Programming',
    'Graphics Design',
    'Mobile App Development',
    'Virtual Assistant',
    'Video Editing',
    'AI & Automation',
    'Others (Specify)'
  ];

  const referenceNumber = createdEnrollment 
    ? `CT-2026-${String(createdEnrollment.id).padStart(4, '0')}` 
    : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={handleClose}
        />

        {/* Modal Window */}
        <motion.div
          id="registration-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 my-8"
        >
          {/* Top Bar with Step Indicators */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase">
                {step <= 4 ? `Step ${step} of 4` : 'Completed'}
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                {step === 1 && 'Personal Information'}
                {step === 2 && 'NYSC Placement'}
                {step === 3 && 'Learning & Tech'}
                {step === 4 && 'Transportation Choice'}
                {step === 5 && 'Congratulations! 🎉'}
              </h3>
            </div>
            <button
              id="close-modal-btn"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          {step <= 4 && (
            <div className="w-full h-1 bg-slate-100">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: PERSONAL INFORMATION */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-500 mb-2">
                    Let's start with your personal and contact details.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">First Name</label>
                      <input
                        id="reg-input-first-name"
                        type="text"
                        placeholder="Samuel"
                        value={formData.firstName}
                        onChange={e => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.firstName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Last Name</label>
                      <input
                        id="reg-input-last-name"
                        type="text"
                        placeholder="Adebayo"
                        value={formData.lastName}
                        onChange={e => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.lastName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-slate-400">
                        <Mail size={16} />
                      </span>
                      <input
                        id="reg-input-email"
                        type="email"
                        placeholder="e.g. samuel@gmail.com"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-slate-400">
                        <Phone size={16} />
                      </span>
                      <input
                        id="reg-input-phone"
                        type="tel"
                        placeholder="e.g. +2347075958413"
                        value={formData.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Gender</label>
                      <select
                        id="reg-select-gender"
                        value={formData.gender}
                        onChange={e => handleInputChange('gender', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                          errors.gender ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      >
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date of Birth</label>
                      <input
                        id="reg-input-dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                          errors.dateOfBirth ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                      {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: NYSC INFORMATION */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-500 mb-2">
                    Provide your location and NYSC deployment information.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">State of Origin</label>
                      <select
                        id="reg-select-origin"
                        value={formData.stateOfOrigin}
                        onChange={e => handleInputChange('stateOfOrigin', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                          errors.stateOfOrigin ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      >
                        <option value="">-- Select State --</option>
                        {NYSC_STATES.map(state => (
                          <option key={`origin-${state}`} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.stateOfOrigin && <p className="text-xs text-red-500 mt-1">{errors.stateOfOrigin}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">State of Service</label>
                      <select
                        id="reg-select-service"
                        value={formData.stateOfService}
                        onChange={e => handleInputChange('stateOfService', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                          errors.stateOfService ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      >
                        <option value="">-- Select State --</option>
                        {NYSC_STATES.map(state => (
                          <option key={`service-${state}`} value={state}>{state} State</option>
                        ))}
                      </select>
                      {errors.stateOfService && <p className="text-xs text-red-500 mt-1">{errors.stateOfService}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Local Government Area (LGA)</label>
                    <input
                      id="reg-input-lga"
                      type="text"
                      placeholder="e.g. Ikeja"
                      value={formData.localGovernment}
                      onChange={e => handleInputChange('localGovernment', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.localGovernment ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    />
                    {errors.localGovernment && <p className="text-xs text-red-500 mt-1">{errors.localGovernment}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">NYSC Batch & Stream</label>
                    <select
                      id="reg-select-batch"
                      value={formData.nyscBatch}
                      onChange={e => handleInputChange('nyscBatch', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                        errors.nyscBatch ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    >
                      <option value="">-- Select Batch --</option>
                      {NYSC_BATCHES.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                    {errors.nyscBatch && <p className="text-xs text-red-500 mt-1">{errors.nyscBatch}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Place of Primary Assignment (PPA)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-slate-400">
                        <GraduationCap size={16} />
                      </span>
                      <input
                        id="reg-input-ppa"
                        type="text"
                        placeholder="e.g. Government Secondary School, Ikeja"
                        value={formData.ppa}
                        onChange={e => handleInputChange('ppa', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.ppa ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    {errors.ppa && <p className="text-xs text-red-500 mt-1">{errors.ppa}</p>}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: LEARNING INFORMATION */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                >
                  <p className="text-sm text-slate-500 mb-2">
                    Let's explore your technology path and learning background.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Select Technology Course</label>
                    <select
                      id="reg-select-course"
                      value={formData.course}
                      onChange={e => handleInputChange('course', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                        errors.course ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    >
                      <option value="">-- Select Your Technology Path --</option>
                      {courses.map(courseName => (
                        <option key={courseName} value={courseName}>{courseName}</option>
                      ))}
                    </select>
                    {errors.course && <p className="text-xs text-red-500 mt-1">{errors.course}</p>}
                  </div>

                  {formData.course === 'Others (Specify)' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Specify Course Name</label>
                      <input
                        id="reg-input-course-others"
                        type="text"
                        placeholder="e.g. Digital Marketing"
                        value={formData.courseOthers}
                        onChange={e => handleInputChange('courseOthers', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.courseOthers ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                      {errors.courseOthers && <p className="text-xs text-red-500 mt-1">{errors.courseOthers}</p>}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Why do you want to learn this skill?</label>
                    <textarea
                      id="reg-input-why-interested"
                      rows={2}
                      placeholder="Share your goals and why this course matters to you..."
                      value={formData.whyInterested}
                      onChange={e => handleInputChange('whyInterested', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.whyInterested ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    />
                    {errors.whyInterested && <p className="text-xs text-red-500 mt-1">{errors.whyInterested}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Do you already have any experience?</label>
                    <textarea
                      id="reg-input-experience"
                      rows={2}
                      placeholder="e.g. 'None, beginner' or 'I have basic HTML skills'"
                      value={formData.previousTechExperience}
                      onChange={e => handleInputChange('previousTechExperience', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.previousTechExperience ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    />
                    {errors.previousTechExperience && <p className="text-xs text-red-500 mt-1">{errors.previousTechExperience}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                      <Laptop size={14} className="text-slate-500" /> Do you own a laptop?
                    </label>
                    <select
                      id="reg-select-laptop"
                      value={formData.laptopAvailable}
                      onChange={e => handleInputChange('laptopAvailable', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                        errors.laptopAvailable ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    >
                      <option value="">-- Select --</option>
                      <option value="Yes">Yes, I have a laptop</option>
                      <option value="No">No, I do not have a laptop</option>
                    </select>
                    {errors.laptopAvailable && <p className="text-xs text-red-500 mt-1">{errors.laptopAvailable}</p>}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: TRANSPORTATION */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-slate-500 mb-2">
                    Let us know how you plan to commute to our study centers.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                      <Bus size={14} className="text-slate-500" /> Transportation Option
                    </label>
                    <select
                      id="reg-select-transport"
                      value={formData.transportationOption}
                      onChange={e => handleInputChange('transportationOption', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                        errors.transportationOption ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                      }`}
                    >
                      <option value="">-- Choose Option --</option>
                      <option value="Company Bus">Company Bus (provided by Olatech)</option>
                      <option value="Individual Transportation">Individual Transportation (Self Commute)</option>
                    </select>
                    {errors.transportationOption && <p className="text-xs text-red-500 mt-1">{errors.transportationOption}</p>}
                  </div>

                  {formData.transportationOption === 'Company Bus' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Pickup Location</label>
                      <input
                        id="reg-input-pickup"
                        type="text"
                        placeholder="Specify your preferred pick-up point (e.g. Ikeja Bus-Stop)"
                        value={formData.pickupLocation}
                        onChange={e => handleInputChange('pickupLocation', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.pickupLocation ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-emerald-100 focus:border-emerald-500'
                        }`}
                      />
                      {errors.pickupLocation && <p className="text-xs text-red-500 mt-1">{errors.pickupLocation}</p>}
                    </motion.div>
                  )}

                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold">Enrollment Failed:</span> {apiError}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* SUCCESS STATE */}
              {step === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-800">✅ Congratulations</h4>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto px-4">
                      Your registration has been received. Our admissions team will contact you shortly.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl text-left border border-slate-100 space-y-3 text-xs max-w-md mx-auto divide-y divide-slate-100">
                    <div className="pb-2 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Registration Reference Number</span>
                      <p className="text-base font-mono font-bold text-emerald-700 tracking-tight">{referenceNumber}</p>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Selected Course</span>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{createdEnrollment?.course || formData.course}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transportation</span>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{createdEnrollment?.transportationOption || formData.transportationOption}</p>
                      </div>
                    </div>

                    {createdEnrollment?.pickupLocation && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pickup Point</span>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{createdEnrollment.pickupLocation}</p>
                      </div>
                    )}
                  </div>

                  <button
                    id="finish-registration-btn"
                    type="button"
                    onClick={handleClose}
                    className="mt-6 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    Return Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step <= 4 && (
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    id="back-btn"
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    id="next-btn"
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center gap-1.5 transition-all shadow-sm hover:translate-x-0.5"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    id="submit-registration-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/10 disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Enrollment'}
                    {!isSubmitting && <Sparkles size={16} className="text-emerald-200 animate-pulse" />}
                  </button>
                )}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
