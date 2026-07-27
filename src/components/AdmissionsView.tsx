import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, RefreshCw, Eye, Trash2, CheckCircle2, XCircle, AlertCircle, 
  Clock, Check, ArrowRight, User, Mail, Phone, MapPin, Calendar, BookOpen, 
  Laptop, Bus, FileText, X, BarChart3, TrendingUp, Save, Plus, Printer, UsersRound, 
  Download, MessageSquare, Users, CheckSquare, Square, Settings, Activity, 
  PhoneCall, Shield, Trash, Undo2, ChevronRight, Sliders, Info, ExternalLink,
  Menu, Bell, LogOut, ChevronDown, Briefcase, Globe, DollarSign, Github, Sparkles, Database,
  QrCode, Loader2, Video, Compass, UserCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import DocumentationCenterView from './DocumentationCenterView';
import OperationsCenterView from './OperationsCenterView';
import BackupRecoveryCenterView from './BackupRecoveryCenterView';

interface Enrollment {
  id: number;
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
  pickupLocation: string | null;
  whyInterested: string;
  previousTechExperience: string;
  laptopAvailable: string;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OperationalMeta {
  notes: string;
  deleted?: boolean;
  cohortId?: string;
  seatAllocation?: string;
  checklist?: {
    docs: boolean;
    laptop: boolean;
    pay: boolean;
    orient: boolean;
    whatsapp: boolean;
    ready: boolean;
  };
  timeline?: { date: string; action: string; by: string }[];
  comms?: { date: string; type: string; template: string; text: string; notes: string }[];
}

interface Cohort {
  id: string;
  name: string;
  course: string;
  startDate: string;
  orientDate: string;
  trainer: string;
  status: 'Active' | 'Enrolling' | 'Completed';
}

const COLORS = ['#16a34a', '#2563eb', '#ca8a04', '#7c3aed', '#db2777', '#0891b2', '#475569'];

function parseAdminNotes(rawNotes: string | null | undefined): OperationalMeta {
  const defaultMeta: OperationalMeta = {
    notes: '',
    deleted: false,
    cohortId: '',
    seatAllocation: '',
    checklist: { docs: false, laptop: false, pay: false, orient: false, whatsapp: false, ready: false },
    timeline: [],
    comms: []
  };
  if (!rawNotes) return defaultMeta;
  try {
    const trimmed = rawNotes.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      return {
        ...defaultMeta,
        ...parsed,
        checklist: { ...defaultMeta.checklist, ...(parsed.checklist || {}) },
        timeline: parsed.timeline || [],
        comms: parsed.comms || []
      };
    }
  } catch (e) {}
  return { ...defaultMeta, notes: rawNotes };
}

export interface Staff {
  id?: number;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Super Admin' | 'Admissions Officer' | 'Operations Officer' | 'Career Officer' | 'Finance Officer' | 'Support Officer';
  status?: string;
  forcePasswordChange?: boolean;
  lastLogin?: string | null;
}

export const SUPPORTED_OPPORTUNITY_CATEGORIES = [
  'Graduate Programs',
  'Internships',
  'Entry-Level Jobs',
  'Remote Jobs',
  'Hybrid Jobs',
  'On-site Jobs',
  'Scholarships',
  'Bootcamps',
  'Fellowships',
  'Hackathons',
  'Special Placement Programs'
];

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  time: string;
}

export default function AdmissionsView() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('operations');

  // Recruitment Intelligence State
  const [recruitmentOpps, setRecruitmentOpps] = useState<any[]>([]);
  const [recruitmentSources, setRecruitmentSources] = useState<any[]>([]);
  const [recruitmentCategories, setRecruitmentCategories] = useState<any[]>([]);
  const [recruitmentQueueTab, setRecruitmentQueueTab] = useState<'Verified' | 'Pending Review' | 'Published' | 'Rejected' | 'Archived'>('Verified');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [selectedScanSource, setSelectedScanSource] = useState<any>(null);
  const [selectedScanCategory, setSelectedScanCategory] = useState<string>('Graduate Programs');
  
  // Phase 5.2 Recruitment State Variables
  const [recruitmentSubTab, setRecruitmentSubTab] = useState<'opportunities' | 'scheduler' | 'employers' | 'changes' | 'duplicates' | 'notifications'>('opportunities');
  const [schedulerState, setSchedulerState] = useState<any>(null);
  const [employerProfiles, setEmployerProfiles] = useState<any[]>([]);
  const [changeLogs, setChangeLogs] = useState<any[]>([]);
  const [duplicateHistory, setDuplicateHistory] = useState<any[]>([]);
  const [recruitmentNotifications, setRecruitmentNotifications] = useState<any[]>([]);
  const [selectedOppTimeline, setSelectedOppTimeline] = useState<any[]>([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineModalOppId, setTimelineModalOppId] = useState<number | null>(null);
  const [schedulerIntervalInput, setSchedulerIntervalInput] = useState<number>(24);
  const [isUpdatingScheduler, setIsUpdatingScheduler] = useState(false);
  const [isTriggeringExpiry, setIsTriggeringExpiry] = useState(false);
  
  // Custom Discovered Opportunity form
  const [showAddOppModal, setShowAddOppModal] = useState(false);
  const [showEditOppModal, setShowEditOppModal] = useState(false);
  const [oppEditId, setOppEditId] = useState<number | null>(null);
  const [oppFormTitle, setOppFormTitle] = useState('');
  const [oppFormCompany, setOppFormCompany] = useState('');
  const [oppFormDesc, setOppFormDesc] = useState('');
  const [oppFormLoc, setOppFormLoc] = useState('');
  const [oppFormRemote, setOppFormRemote] = useState('Remote');
  const [oppFormSalary, setOppFormSalary] = useState('');
  const [oppFormSkills, setOppFormSkills] = useState('');
  const [oppFormUrl, setOppFormUrl] = useState('');
  const [oppFormDeadline, setOppFormDeadline] = useState('');
  const [oppFormSourceId, setOppFormSourceId] = useState<number>(0);
  const [oppFormCategoryId, setOppFormCategoryId] = useState<number>(0);
  const [oppFormExperience, setOppFormExperience] = useState('Entry-level');

  // Preview panel state
  const [previewOpp, setPreviewOpp] = useState<any | null>(null);

  // Staff Authentication State
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(() => {
    const saved = localStorage.getItem('olatech_staff_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forced Password Change Flow
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [forceChangeError, setForceChangeError] = useState('');

  // Team Management State
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [teamEmail, setTeamEmail] = useState('');
  const [teamFirstName, setTeamFirstName] = useState('');
  const [teamLastName, setTeamLastName] = useState('');
  const [teamPhone, setTeamPhone] = useState('');
  const [teamRole, setTeamRole] = useState<'Super Admin' | 'Admissions Officer' | 'Operations Officer' | 'Career Officer' | 'Finance Officer' | 'Support Officer'>('Admissions Officer');
  const [teamStatus, setTeamStatus] = useState('Active');
  const [teamPassword, setTeamPassword] = useState('');
  const [teamForceChange, setTeamForceChange] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [teamActionError, setTeamActionError] = useState('');

  // Password Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStaffId, setResetStaffId] = useState<number | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetForceChange, setResetForceChange] = useState(false);

  // Search and Filters for Audit Logs & Team Management
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState('All');
  const [auditStatusFilter, setAuditStatusFilter] = useState('All');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [teamRoleFilter, setTeamRoleFilter] = useState('All');
  const [teamStatusFilter, setTeamStatusFilter] = useState('All');

  // Notification center state
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('olatech_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: '15 Pending Applications', description: 'Review queue has outstanding mobilization candidates.', read: false, time: '2 hrs ago' },
      { id: '2', title: 'Orientation Begins Soon', description: 'Orientation matrix scheduled to open in 2 days.', read: false, time: '5 hrs ago' },
      { id: '3', title: 'New Bus Request', description: 'Lagos Mainland pickup has 5 additional seat requests.', read: false, time: '1 day ago' },
      { id: '4', title: 'System Security Log', description: 'Enterprise backup completed and synced with MySQL.', read: true, time: '3 days ago' }
    ];
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // Mobile drawer and profile menu
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Career Management Sub-Tab
  const [careerSubTab, setCareerSubTab] = useState<'opportunities' | 'events' | 'partners' | 'resources' | 'alumni'>('opportunities');

  // Chronos Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Computed filtered lists for Staff & Audits
  const filteredStaff = staffList.filter(s => {
    const query = teamSearchQuery.toLowerCase();
    const nameMatch = `${s.firstName || ''} ${s.lastName || ''} ${s.name || ''}`.toLowerCase().includes(query);
    const emailMatch = (s.email || '').toLowerCase().includes(query);
    const phoneMatch = (s.phone || '').toLowerCase().includes(query);
    const matchesSearch = nameMatch || emailMatch || phoneMatch;

    const matchesRole = teamRoleFilter === 'All' || s.role === teamRoleFilter;
    const matchesStatus = teamStatusFilter === 'All' || s.status === teamStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredAudits = auditLogs.filter(log => {
    const query = auditSearchQuery.toLowerCase();
    const descMatch = (log.description || '').toLowerCase().includes(query);
    const userMatch = (log.user || '').toLowerCase().includes(query);
    const ipMatch = (log.ipAddress || '').toLowerCase().includes(query);
    const matchesSearch = descMatch || userMatch || ipMatch;

    const matchesType = auditTypeFilter === 'All' || log.eventType === auditTypeFilter;
    const matchesStatus = auditStatusFilter === 'All' || log.status === auditStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Persist Notifications
  useEffect(() => {
    localStorage.setItem('olatech_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Unified Audit Log Dispatcher
  const triggerAuditLog = async (action: string, affected: string = 'N/A', status: 'Success' | 'Failed' = 'Success') => {
    const staff = currentStaff;
    const user = staff ? staff.name : 'Unknown/Guest';
    const userRole = staff ? staff.role : 'Guest';
    
    // Distinguish eventType based on action keywords
    let eventType = 'System Action';
    const actLower = action.toLowerCase();
    if (actLower.includes('login') || actLower.includes('authenticated')) {
      eventType = 'Staff Login';
    } else if (actLower.includes('logout')) {
      eventType = 'Staff Logout';
    } else if (actLower.includes('status')) {
      eventType = 'Applicant Updated';
    } else if (actLower.includes('trash') || actLower.includes('archive') || actLower.includes('delete')) {
      eventType = 'Applicant Deleted';
    } else if (actLower.includes('career') || actLower.includes('partner') || actLower.includes('opportunity') || actLower.includes('resource') || actLower.includes('spotlight') || actLower.includes('event')) {
      eventType = 'Career Update';
    } else if (actLower.includes('note')) {
      eventType = 'Applicant Notes';
    } else if (actLower.includes('notification')) {
      eventType = 'Notification Clear';
    } else if (actLower.includes('create') && actLower.includes('staff')) {
      eventType = 'Staff Created';
    } else if (actLower.includes('update') && actLower.includes('staff')) {
      eventType = 'Staff Updated';
    } else if (actLower.includes('reset') && actLower.includes('password')) {
      eventType = 'Password Reset';
    }

    const description = `${action}. Target: ${affected}`;
    
    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, userRole, eventType, description, status })
      });
      if (res.ok) {
        const logged = await res.json();
        setAuditLogs(prev => [logged, ...prev]);
      }
    } catch (error) {
      console.warn('Failed to post audit log to backend, falling back locally:', error);
      const localLog = {
        id: 'audit-' + Date.now(),
        timestamp: new Date().toISOString(),
        user,
        userRole,
        eventType,
        description,
        status
      };
      setAuditLogs(prev => [localLog, ...prev]);
    }
  };

  const fetchStaffList = async () => {
    try {
      setIsStaffLoading(true);
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (err) {
      console.error('Failed to fetch staff list:', err);
    } finally {
      setIsStaffLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    }
  };

  useEffect(() => {
    if (currentStaff) {
      fetchAuditLogs();
      if (currentStaff.role === 'Super Admin') {
        fetchStaffList();
      }
    }
  }, [currentStaff, refreshTrigger]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [commuteFilter, setCommuteFilter] = useState('All');
  const [showTrash, setShowTrash] = useState(false);
  const [sortBy, setSortBy] = useState<'ref' | 'name' | 'course' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selection
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [adminNotesDraft, setAdminNotesDraft] = useState('');
  const [customCommDraft, setCustomCommDraft] = useState('');

  // Local cohorts state
  const [cohorts, setCohorts] = useState<Cohort[]>(() => {
    const saved = localStorage.getItem('olatech_cohorts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'c-1', name: 'Cybersecurity July 2026', course: 'Cybersecurity', startDate: '2026-07-15', orientDate: '2026-07-10', trainer: 'Dr. Joshua Yusuf', status: 'Enrolling' },
      { id: 'c-2', name: 'Data Analytics August 2026', course: 'Data Analysis', startDate: '2026-08-01', orientDate: '2026-07-28', trainer: 'Mrs. Amina Aliyu', status: 'Enrolling' },
      { id: 'c-3', name: 'Web Dev Batch A Stream I', course: 'Web Development', startDate: '2026-07-01', orientDate: '2026-06-25', trainer: 'Engr. Yusuf Ola', status: 'Active' },
      { id: 'c-4', name: 'Virtual Assistant Batch B Stream II', course: 'Virtual Assistant', startDate: '2026-08-10', orientDate: '2026-08-05', trainer: 'Miss Joy Udoh', status: 'Enrolling' }
    ];
  });

  // Local settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('olatech_settings');
    if (saved) return JSON.parse(saved);
    return {
      availableCourses: ['Cybersecurity', 'Data Analysis', 'Web Development', 'Python Programming', 'Graphics Design', 'App Development', 'Microsoft Office', 'Virtual Assistant', 'Video Editing', 'Mobile App Development', 'AI & Automation'],
      pickupLocations: ['Lagos Mainland (Yaba Tech Hub)', 'Lagos Island (Marina Stop)', 'Ikeja (Allen Avenue)', 'Abuja (Central Business District)', 'Abuja (Gwarinpa Estate)', 'Port Harcourt (GRA Phase II)'],
      registrationOpen: true,
      supportPhone: '+2347075958413',
      supportEmail: 'support@olatechschoolofprogramming@gmail.com',
      socialTwitter: '@CorpersTech',
      socialLinkedin: 'CorpersTech-Olatech',
      campusAddress: 'Olatech School of Programming, PortHarcourt, Nigeria',
      busDriverName: 'Yusuf Kolawole',
      busPlateNo: 'LAG-419-OLA',
      busDepartureTime: '07:30 AM'
    };
  });

  // 5 Career states
  const [careerOpps, setCareerOpps] = useState(() => {
    const saved = localStorage.getItem('olatech_career_opps');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        category: "Internships",
        title: "Junior Security Analyst Intern",
        company: "Kuda Bank",
        stipend: "₦150,000 / month",
        location: "Lagos (Hybrid)",
        deadline: "July 15, 2026",
        featured: true,
        description: "A secure corporate placement role reviewing API payload streams and constructing ethical firewalls under expert security operation logs.",
        skills: ["Intrusion Diagnostics", "SQL", "Network Auditing"]
      },
      {
        id: 2,
        category: "Remote Jobs",
        title: "Remote Customer Success & Executive VA",
        company: "Spars Tech UK",
        stipend: "£300 / month (~₦560,000)",
        location: "Remote (Global)",
        deadline: "July 20, 2026",
        featured: true,
        description: "Manage calendar bookings, handle external team coordination, review incoming proposals, and organize Notion team boards.",
        skills: ["Google Workspace", "Notion", "Calendly"]
      },
      {
        id: 3,
        category: "Bootcamps",
        title: "Olatech Advanced AI Engineer Bootcamp",
        stipend: "Fully Sponsored",
        company: "Olatech School & Google",
        location: "Abuja / Hybrid",
        deadline: "August 02, 2026",
        featured: false,
        description: "A highly intensive 6-week advanced machine learning pipeline builder. Highly endorsed to top-tier startups.",
        skills: ["Python 3", "TensorFlow", "API Integration"]
      },
      {
        id: 4,
        category: "Scholarships",
        title: "Microsoft Cybersecurity Certification Grant",
        stipend: "₦120,000 exam voucher fee fully covered",
        company: "Microsoft Africa",
        location: "Online",
        deadline: "July 12, 2026",
        featured: false,
        description: "Fully covered certification vouchers for outstanding Olatech cybersecurity graduates preparing for official examinations.",
        skills: ["CompTIA Security+", "Ethical Hacking"]
      },
      {
        id: 5,
        category: "Tech Competitions",
        title: "CorpersTech Annual Hackathon Challenge",
        stipend: "₦1,500,000 grand prize pool",
        company: "Olatech & Sterling Bank",
        location: "Lagos / Virtual",
        deadline: "July 25, 2026",
        featured: true,
        description: "Build innovative digital products targeting local payment challenges. Open to active NYSC tech stream groups.",
        skills: ["Web Dev", "UI/UX", "Data Analytics"]
      },
      {
        id: 6,
        category: "Graduate Programs",
        title: "Technology Associate Graduate Program",
        stipend: "₦220,000 / month",
        company: "Interswitch Group",
        location: "Lagos (On-site)",
        deadline: "August 10, 2026",
        featured: false,
        description: "Rotational program across billing engineering, database administration, threat diagnostics, and project design teams.",
        skills: ["React.js", "SQL Queries", "Problem Solving"]
      }
    ];
  });

  const [careerEvents, setCareerEvents] = useState(() => {
    const saved = localStorage.getItem('olatech_career_events');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: "Mandatory Stream Technical Briefing",
        type: "Orientation",
        date: "July 08, 2026",
        time: "10:00 AM UTC",
        location: "Main Auditorium / Zoom Live",
        capacity: "500 Seats Available",
        daysLeft: 11,
        description: "Introductory roadmap alignment meeting detailing curriculum models, stream schedules, attendance sheets logging, and corporate commute logistics."
      },
      {
        id: 2,
        title: "Interactive CV Clinic & ATS Optimization",
        type: "CV Clinic",
        date: "July 12, 2026",
        time: "02:00 PM UTC",
        location: "Virtual Workshop",
        capacity: "150 Seats (Interactive)",
        daysLeft: 15,
        description: "Live review panel where professional Olatech CV branding specialists restructure resumes to satisfy automated screening filters."
      },
      {
        id: 3,
        title: "National Tech Hackathon Launch Day",
        type: "Hackathon",
        date: "July 25, 2026",
        time: "09:00 AM UTC",
        location: "Sterling Bank Hub / Virtual",
        capacity: "80 Teams capacity",
        daysLeft: 28,
        description: "Kickoff session of our annual prototype build challenge. Group structures will align to formulate solutions for local payment frameworks."
      },
      {
        id: 4,
        title: "Careers Day & Recruiter Meetups",
        type: "Career Day",
        date: "August 15, 2026",
        time: "11:00 AM UTC",
        location: "Olatech School Campus, Lagos",
        capacity: "300 Seat capacity",
        daysLeft: 49,
        description: "Direct offline speed dating session with over 15 recruitment officers from active fintechs, networks, and agencies."
      }
    ];
  });

  const [careerPartners, setCareerPartners] = useState(() => {
    const saved = localStorage.getItem('olatech_career_partners');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        type: "Recruitment Partner",
        name: "Moniepoint Nigeria",
        logo: "MP",
        desc: "One of Nigeria's leading business banking institutions. Actively onboarding skilled data analysts and web specialists of Olatech Stream cohorts."
      },
      {
        id: 2,
        type: "Sponsorship Partner",
        name: "Sterling Bank PLC",
        logo: "SB",
        desc: "Providing interest-free installment loan setups for corps members looking to acquire high-spec personal laptops."
      },
      {
        id: 3,
        type: "Technology Partner",
        name: "MainOne Communications",
        logo: "MO",
        desc: "Hosting physical network operations training audits, SOC center drills, and hiring certified Olatech cybersecurity specialists."
      },
      {
        id: 4,
        type: "Industry Mentors",
        name: "Andela Talent Network",
        logo: "AD",
        desc: "Provides global senior engineers to conduct our mock technical interview simulations and scorecard reviews."
      },
      {
        id: 5,
        type: "Local Tech Community",
        name: "GDG Lagos (Google Developers)",
        logo: "GD",
        desc: "Host community providing free entries, hackathon sponsorships, and continuous local meetup networks for Olatech graduates."
      }
    ];
  });

  const [careerResources, setCareerResources] = useState(() => {
    const defaultResources = [
      {
        id: 1,
        category: "CV Templates",
        title: "ATS CV Template",
        description: "Download a clean, minimalist, and ATS-optimized Word/Markdown structure designed to pass automated resume screening filters.",
        icon: "FileText",
        tag: "Word Document • FREE",
        link: "#"
      },
      {
        id: 2,
        category: "CV Templates",
        title: "CV Writing Guide",
        description: "Step-by-step master guide on action verbs, quantifiable metrics, formatting traps to avoid, and keyword optimization for Applicant Tracking Systems.",
        icon: "FileText",
        tag: "PDF Handbook • FREE",
        link: "#"
      },
      {
        id: 3,
        category: "LinkedIn Guides",
        title: "LinkedIn Optimization Guide",
        description: "Step-by-step master guide explaining headline positioning, About storytelling frameworks, Featured carousels, and recruiter outreach scripts.",
        icon: "Globe",
        tag: "Interactive PDF • FREE",
        link: "#"
      },
      {
        id: 4,
        category: "Interview Tips",
        title: "Interview Preparation Guide",
        description: "An intensive overview of common technical coding algorithms, behavioral response frameworks (STAR), and live execution checklists.",
        icon: "Users",
        tag: "PDF Handbook • FREE",
        link: "#"
      },
      {
        id: 5,
        category: "Learning Roadmaps",
        title: "Cybersecurity Learning Roadmap",
        description: "Comprehensive 16-week study plan covering Linux networking, SIEM monitoring, Wireshark packet analysis, and CompTIA Security+ prep.",
        icon: "Shield",
        tag: "Roadmap • FREE",
        link: "#"
      },
      {
        id: 6,
        category: "Learning Roadmaps",
        title: "Data Analysis Learning Roadmap",
        description: "Master Excel advanced formulas, relational SQL queries, Python data wrangling (Pandas), and Power BI executive dashboards.",
        icon: "BarChart3",
        tag: "Roadmap • FREE",
        link: "#"
      },
      {
        id: 7,
        category: "Learning Roadmaps",
        title: "Web Development Roadmap",
        description: "Full-stack cloud engineering guide covering HTML5, Tailwind CSS, TypeScript, React 18, Node.js, Express, Prisma ORM, and Google Cloud Run.",
        icon: "Code",
        tag: "Roadmap • FREE",
        link: "#"
      },
      {
        id: 8,
        category: "Learning Roadmaps",
        title: "Python Programming Roadmap",
        description: "From core syntax and OOP data structures to task automation scripts, web scraping, and asynchronous FastAPI backend servers.",
        icon: "Terminal",
        tag: "Roadmap • FREE",
        link: "#"
      },
      {
        id: 9,
        category: "Starter Guides",
        title: "Graphics Design Starter Guide",
        description: "Master color theory 60-30-10, typography hierarchy, Figma vector tools, Adobe Illustrator workflows, and social media export standards.",
        icon: "Palette",
        tag: "Starter Guide • FREE",
        link: "#"
      },
      {
        id: 10,
        category: "Starter Guides",
        title: "UI/UX Starter Guide",
        description: "5-stage Design Thinking research process, Figma Auto-Layout wireframing, Nielsen's heuristics, and WCAG 2.1 accessibility compliance.",
        icon: "Layers",
        tag: "Starter Guide • FREE",
        link: "#"
      },
      {
        id: 11,
        category: "Starter Guides",
        title: "Video Editing Starter Guide",
        description: "Timeline workflow pipeline, rough cutting, audio ducking to -22dB, cinematic color grading, Premiere Pro shortcuts, and 4K social exports.",
        icon: "Video",
        tag: "Starter Guide • FREE",
        link: "#"
      },
      {
        id: 12,
        category: "Starter Guides",
        title: "App Development Starter Guide",
        description: "Comparing React Native and Flutter architectures, offline-first SQLite synchronization, sensor permissions, and App Store signing.",
        icon: "Smartphone",
        tag: "Starter Guide • FREE",
        link: "#"
      },
      {
        id: 13,
        category: "Learning Roadmaps",
        title: "AI & Automation Learning Guide",
        description: "4-Pillar prompt engineering, integrating @google/genai Gemini API in Node/TypeScript, and automating workflow pipelines via Make/Python.",
        icon: "GraduationCap",
        tag: "Playbook • FREE",
        link: "#"
      },
      {
        id: 14,
        category: "Productivity",
        title: "Microsoft Office Productivity Guide",
        description: "Advanced Excel XLOOKUP & Pivot Tables, Word built-in styles and section breaks, and PowerPoint Slide Master 6x6 storytelling rules.",
        icon: "FileSpreadsheet",
        tag: "Handbook • FREE",
        link: "#"
      },
      {
        id: 15,
        category: "Freelancing",
        title: "Freelancing Guide",
        description: "Upwork overview copywriting blueprint, 4-step winning proposal cover letters, hourly tracking protection, and milestone pricing strategies.",
        icon: "DollarSign",
        tag: "PDF Guide • FREE",
        link: "#"
      },
      {
        id: 16,
        category: "Career Planning",
        title: "Career Planning Workbook",
        description: "12-month NYSC transition roadmap, skill gap analysis worksheet, quarterly execution milestones, and weekly applicant tracking ledger.",
        icon: "BookOpen",
        tag: "Workbook • FREE",
        link: "#"
      },
      {
        id: 17,
        category: "Practice Platforms",
        title: "LeetCode & HackerRank Prep Tracks",
        description: "Handpicked list of curated problems and practice sets ideal for junior backend script developers and analysts.",
        icon: "Terminal",
        tag: "External Tracker • FREE",
        link: "#"
      },
      {
        id: 18,
        category: "Remote Platforms",
        title: "Top 20 Remote Platforms For West Africa",
        description: "Direct list of foreign directories welcoming remote software engineers, designers, and assistants based in Nigeria.",
        icon: "Globe",
        tag: "Excel Index • FREE",
        link: "#"
      },
      {
        id: 19,
        category: "GitHub Guides",
        title: "Clean Portfolio GitHub Setup Standard",
        description: "Learn to prepare highly readable markdown README files, construct proper repository branches, and commit code elegantly.",
        icon: "Github",
        tag: "GitHub Repo • FREE",
        link: "#"
      }
    ];

    const saved = localStorage.getItem('olatech_career_resources');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) {
          return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem('olatech_career_resources', JSON.stringify(defaultResources));
    return defaultResources;
  });

  const [careerAlumni, setCareerAlumni] = useState(() => {
    const saved = localStorage.getItem('olatech_career_alumni');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
        name: "Tobi Adebayo",
        role: "Associate Cyber Engineer",
        company: "MainOne Data Systems",
        batch: "2024 Batch A",
        salary: "₦350,000 / month starting",
        before: "Studied Agriculture at UNILORIN. Had absolutely zero server diagnostic or networking experience.",
        training: "Excellent guide-based laboratories! Practiced packet capturing under expert mentor guidance daily.",
        challenges: "Grasping networking logic was initially tricky, but peer tutoring groups helped resolve doubts.",
        project: "Designed an automated threat alert log monitor with built-in email triggers.",
        advice: "Do not waste your service year in the lodge! Sacrifice 3 hours daily to master a high-value skill."
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
        name: "Chinedu Okafor",
        role: "Junior BI Developer",
        company: "Kuda Bank",
        batch: "2024 Batch B",
        salary: "₦380,000 / month starting",
        before: "Studied Economics. Understood basic spreadsheets but couldn't write relational queries.",
        training: "Learned deep SQL scripting, structured warehouse queries, and designed corporate BI boards.",
        challenges: "Balancing training with my PPA service requirements, but Olatech stream schedules were highly supportive.",
        project: "Crafted AgriTrack - an interactive crop analytics pricing board.",
        advice: "Build real portfolios! Employers care infinitely more about active project links than certificates."
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
        name: "Halima Ibrahim",
        role: "Remote VA & Operations Assistant",
        company: "Spars Tech UK",
        batch: "2025 Batch A",
        salary: "$600 / month retainer (~₦900,000)",
        before: "Graduate of History. Wanted to earn in foreign currencies but had no coding foundation.",
        training: "Learned advanced Notion dashboard setups, automated email CRM tools, and calendars workflow.",
        challenges: "Pitching on freelance marketplaces was tough, but mentors rewrote my proposals to lock retainers.",
        project: "Constructed dynamic corporate client CRM trackers with automated feedback logs.",
        advice: "Take VA seriously! It is the fastest path to earn foreign retainer contracts without programming."
      }
    ];
  });

  // Persist local state edits
  useEffect(() => {
    localStorage.setItem('olatech_cohorts', JSON.stringify(cohorts));
  }, [cohorts]);

  useEffect(() => {
    localStorage.setItem('olatech_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist career states
  useEffect(() => {
    localStorage.setItem('olatech_career_opps', JSON.stringify(careerOpps));
    localStorage.setItem('olatech_opportunities', JSON.stringify(careerOpps));
  }, [careerOpps]);

  useEffect(() => {
    localStorage.setItem('olatech_career_events', JSON.stringify(careerEvents));
  }, [careerEvents]);

  useEffect(() => {
    localStorage.setItem('olatech_career_partners', JSON.stringify(careerPartners));
  }, [careerPartners]);

  useEffect(() => {
    localStorage.setItem('olatech_career_resources', JSON.stringify(careerResources));
  }, [careerResources]);

  useEffect(() => {
    localStorage.setItem('olatech_career_alumni', JSON.stringify(careerAlumni));
  }, [careerAlumni]);

  // Opportunities Form States
  const [editingOpp, setEditingOpp] = useState<any>(null);
  const [showOppForm, setShowOppForm] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppCompany, setOppCompany] = useState('');
  const [oppCategory, setOppCategory] = useState('Internships');
  const [oppStipend, setOppStipend] = useState('');
  const [oppLocation, setOppLocation] = useState('');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppDescription, setOppDescription] = useState('');
  const [oppSkills, setOppSkills] = useState('');
  const [oppFeatured, setOppFeatured] = useState(false);

  // Events Form States
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtType, setEvtType] = useState('Orientation');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtCapacity, setEvtCapacity] = useState('');
  const [evtDaysLeft, setEvtDaysLeft] = useState(10);
  const [evtDescription, setEvtDescription] = useState('');

  // Partners Form States
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partName, setPartName] = useState('');
  const [partType, setPartType] = useState('Recruitment Partner');
  const [partLogo, setPartLogo] = useState('');
  const [partDesc, setPartDesc] = useState('');

  // Resources Form States
  const [editingResource, setEditingResource] = useState<any>(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('CV Templates');
  const [resTag, setResTag] = useState('PDF • FREE');
  const [resIcon, setResIcon] = useState('FileText');
  const [resDesc, setResDesc] = useState('');
  const [resLink, setResLink] = useState('#');

  // Success Spotlight Form States
  const [editingAlumni, setEditingAlumni] = useState<any>(null);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [alName, setAlName] = useState('');
  const [alRole, setAlRole] = useState('');
  const [alCompany, setAlCompany] = useState('');
  const [alBatch, setAlBatch] = useState('');
  const [alSalary, setAlSalary] = useState('');
  const [alImage, setAlImage] = useState('');
  const [alBefore, setAlBefore] = useState('');
  const [alTraining, setAlTraining] = useState('');
  const [alChallenges, setAlChallenges] = useState('');
  const [alProject, setAlProject] = useState('');
  const [alAdvice, setAlAdvice] = useState('');

  // Save Career Opportunity Handler
  const handleSaveOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArr = oppSkills.split(',').map(s => s.trim()).filter(Boolean);
    const body = {
      title: oppTitle,
      company: oppCompany,
      location: oppLocation,
      stipend: oppStipend,
      deadline: oppDeadline,
      description: oppDescription,
      skills: oppSkills,
      category: oppCategory,
      featured: oppFeatured,
      type: oppLocation.toLowerCase().includes('remote') ? 'Remote' : (oppLocation.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site'),
      roleType: oppCategory === 'Internships' ? 'Internship' : (oppCategory === 'Graduate Programs' ? 'Graduate Trainee' : 'Entry-level'),
      status: oppFeatured ? 'Featured' : 'Published'
    };

    try {
      if (editingOpp) {
        const res = await fetch(`/api/jobs/${editingOpp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerOpps(prev => prev.map(o => o.id === editingOpp.id ? json.data : o));
          triggerAuditLog(`Updated career opportunity: ${oppTitle}`, 'Career Hub');
          alert('Opportunity updated successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerOpps(prev => [json.data, ...prev]);
          triggerAuditLog(`Created career opportunity: ${oppTitle}`, 'Career Hub');
          alert('Opportunity created successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      }
    } catch (err) {
      console.error('Failed to sync opportunity with DB:', err);
      alert('Network error - fell back to offline storage.');
    }
    setEditingOpp(null);
    setShowOppForm(false);
    setOppTitle('');
    setOppCompany('');
    setOppStipend('');
    setOppLocation('');
    setOppDeadline('');
    setOppDescription('');
    setOppSkills('');
    setOppFeatured(false);
  };

  // Save Event Handler
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title: evtTitle,
      type: evtType,
      date: evtDate,
      time: evtTime,
      location: evtLocation,
      capacity: evtCapacity,
      daysLeft: Number(evtDaysLeft),
      description: evtDescription
    };

    try {
      if (editingEvent) {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerEvents(prev => prev.map(ev => ev.id === editingEvent.id ? json.data : ev));
          triggerAuditLog(`Updated dynamic event: ${evtTitle}`, 'Career Hub');
          alert('Event updated successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerEvents(prev => [json.data, ...prev]);
          triggerAuditLog(`Created dynamic event: ${evtTitle}`, 'Career Hub');
          alert('Event created successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      }
    } catch (err) {
      console.error('Failed to sync event with DB:', err);
      alert('Network error - fell back to offline storage.');
    }
    setEditingEvent(null);
    setShowEventForm(false);
    setEvtTitle('');
    setEvtDate('');
    setEvtTime('');
    setEvtLocation('');
    setEvtCapacity('');
    setEvtDaysLeft(10);
    setEvtDescription('');
  };

  // Save Partner Handler
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: partName,
      type: partType,
      logo: partLogo,
      desc: partDesc
    };

    try {
      if (editingPartner) {
        const res = await fetch(`/api/employer-partners/${editingPartner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerPartners(prev => prev.map(p => p.id === editingPartner.id ? json.data : p));
          triggerAuditLog(`Updated employer partner: ${partName}`, 'Career Hub');
          alert('Partner updated successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      } else {
        const res = await fetch('/api/employer-partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerPartners(prev => [json.data, ...prev]);
          triggerAuditLog(`Created employer partner: ${partName}`, 'Career Hub');
          alert('Partner created successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      }
    } catch (err) {
      console.error('Failed to sync partner with DB:', err);
      alert('Network error - fell back to offline storage.');
    }
    setEditingPartner(null);
    setShowPartnerForm(false);
    setPartName('');
    setPartLogo('');
    setPartDesc('');
  };

  // Save Resource Handler
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title: resTitle,
      category: resCategory,
      tag: resTag,
      icon: resIcon,
      description: resDesc,
      link: resLink
    };

    try {
      if (editingResource) {
        const res = await fetch(`/api/career-resources/${editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerResources(prev => prev.map(r => r.id === editingResource.id ? json.data : r));
          triggerAuditLog(`Updated career resource: ${resTitle}`, 'Career Hub');
          alert('Resource updated successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      } else {
        const res = await fetch('/api/career-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          setCareerResources(prev => [json.data, ...prev]);
          triggerAuditLog(`Created career resource: ${resTitle}`, 'Career Hub');
          alert('Resource created successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      }
    } catch (err) {
      console.error('Failed to sync resource with DB:', err);
      alert('Network error - fell back to offline storage.');
    }
    setEditingResource(null);
    setShowResourceForm(false);
    setResTitle('');
    setResTag('PDF • FREE');
    setResDesc('');
    setResLink('#');
  };

  // Save Alumni Spotlight Handler
  const handleSaveAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: alName,
      avatar: alImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      beforeJourney: alBefore,
      afterJourney: alTraining,
      salary: alSalary,
      company: alCompany,
      technology: alAdvice, // use advice for tech details or map similarly
      graduationYear: alBatch,
      batch: alBatch,
      status: 'Published'
    };

    try {
      if (editingAlumni) {
        const res = await fetch(`/api/success-stories/${editingAlumni.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          const mapped = {
            id: json.data.id,
            name: json.data.name,
            role: alRole || json.data.technology,
            company: json.data.company,
            batch: json.data.batch,
            salary: json.data.salary,
            image: json.data.avatar,
            before: json.data.beforeJourney,
            training: json.data.afterJourney,
            challenges: alChallenges,
            project: alProject,
            advice: alAdvice
          };
          setCareerAlumni(prev => prev.map(al => al.id === editingAlumni.id ? mapped : al));
          triggerAuditLog(`Updated success spotlight: ${alName}`, 'Career Hub');
          alert('Spotlight updated successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      } else {
        const res = await fetch('/api/success-stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (json.success) {
          const mapped = {
            id: json.data.id,
            name: json.data.name,
            role: alRole || json.data.technology,
            company: json.data.company,
            batch: json.data.batch,
            salary: json.data.salary,
            image: json.data.avatar,
            before: json.data.beforeJourney,
            training: json.data.afterJourney,
            challenges: alChallenges,
            project: alProject,
            advice: alAdvice
          };
          setCareerAlumni(prev => [mapped, ...prev]);
          triggerAuditLog(`Published success spotlight: ${alName}`, 'Career Hub');
          alert('Spotlight created successfully in database!');
        } else {
          alert('DB Sync Error: ' + json.error);
        }
      }
    } catch (err) {
      console.error('Failed to sync success story with DB:', err);
      alert('Network error - fell back to offline storage.');
    }
    setEditingAlumni(null);
    setShowAlumniForm(false);
    setAlName('');
    setAlRole('');
    setAlCompany('');
    setAlBatch('');
    setAlSalary('');
    setAlImage('');
    setAlBefore('');
    setAlTraining('');
    setAlChallenges('');
    setAlProject('');
    setAlAdvice('');
  };

  // Sync draft notes when selected applicant changes
  useEffect(() => {
    if (selectedEnrollment) {
      const parsed = parseAdminNotes(selectedEnrollment.adminNotes);
      setAdminNotesDraft(parsed.notes);
    } else {
      setAdminNotesDraft('');
    }
    setCustomCommDraft('');
  }, [selectedEnrollment]);

  // Fetch from DB
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/enrollments')
      .then(res => res.json())
      .then(data => {
        if (data.success) setEnrollments(data.data || []);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch registrations.');
        setIsLoading(false);
      });
  }, [refreshTrigger]);

  // Fetch real content management dynamic values from DB
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(res => { if (res.success && res.data && res.data.length > 0) setCareerOpps(res.data); })
      .catch(err => console.error("Error fetching jobs in AdmissionsView:", err));

    fetch('/api/events')
      .then(res => res.json())
      .then(res => { if (res.success && res.data && res.data.length > 0) setCareerEvents(res.data); })
      .catch(err => console.error("Error fetching events in AdmissionsView:", err));

    fetch('/api/employer-partners')
      .then(res => res.json())
      .then(res => { if (res.success && res.data && res.data.length > 0) setCareerPartners(res.data); })
      .catch(err => console.error("Error fetching partners in AdmissionsView:", err));

    fetch('/api/career-resources')
      .then(res => res.json())
      .then(res => { if (res.success && res.data && res.data.length > 0) setCareerResources(res.data); })
      .catch(err => console.error("Error fetching resources in AdmissionsView:", err));

    fetch('/api/success-stories')
      .then(res => res.json())
      .then(res => { 
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            role: item.technology || 'Developer',
            company: item.company || 'Olatech Alumni',
            batch: item.batch || '2026 Batch A',
            salary: item.salary || '₦350,000 / month',
            image: item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            before: item.beforeJourney || 'Manual Laborer',
            training: item.afterJourney || 'Software Engineering Graduate',
            challenges: 'Adjusting to coding structures',
            project: 'Corporate CRM',
            advice: item.technology || 'Be persistent and construct projects daily.'
          }));
          setCareerAlumni(mapped);
        }
      })
      .catch(err => console.error("Error fetching success-stories in AdmissionsView:", err));
  }, [refreshTrigger]);

  // Fetch Recruitment Intelligence Data
  useEffect(() => {
    if (activeTab === 'recruitment') {
      fetch('/api/recruitment/opportunities')
        .then(res => res.json())
        .then(res => {
          if (res.success) setRecruitmentOpps(res.data || []);
        })
        .catch(err => console.error("Error fetching recruitment opportunities:", err));

      fetch('/api/recruitment/sources')
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setRecruitmentSources(res.data || []);
            if (res.data && res.data.length > 0 && !selectedScanSource) {
              setSelectedScanSource(res.data[0]);
            }
          }
        })
        .catch(err => console.error("Error fetching recruitment sources:", err));

      fetch('/api/recruitment/categories')
        .then(res => res.json())
        .then(res => {
          if (res.success) setRecruitmentCategories(res.data || []);
        })
        .catch(err => console.error("Error fetching recruitment categories:", err));

      // Phase 5.2 metrics fetches
      fetch('/api/recruitment/scheduler')
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setSchedulerState(res.data);
            if (res.data?.intervalHours) {
              setSchedulerIntervalInput(res.data.intervalHours);
            }
          }
        })
        .catch(err => console.error("Error fetching scheduler state:", err));

      fetch('/api/recruitment/employers/profiles')
        .then(res => res.json())
        .then(res => {
          if (res.success) setEmployerProfiles(res.data || []);
        })
        .catch(err => console.error("Error fetching employer profiles:", err));

      fetch('/api/recruitment/changelogs')
        .then(res => res.json())
        .then(res => {
          if (res.success) setChangeLogs(res.data || []);
        })
        .catch(err => console.error("Error fetching change logs:", err));

      fetch('/api/recruitment/duplicates')
        .then(res => res.json())
        .then(res => {
          if (res.success) setDuplicateHistory(res.data || []);
        })
        .catch(err => console.error("Error fetching duplicate history:", err));

      fetch('/api/recruitment/notifications')
        .then(res => res.json())
        .then(res => {
          if (res.success) setRecruitmentNotifications(res.data || []);
        })
        .catch(err => console.error("Error fetching recruitment notifications:", err));
    }
  }, [activeTab, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(p => p + 1);

  // Unified metadata updater
  const updateMeta = async (id: number, updates: Partial<OperationalMeta>, customTimelineAction?: string) => {
    const record = enrollments.find(e => e.id === id);
    if (!record) return;
    const currentMeta = parseAdminNotes(record.adminNotes);
    const newMeta = { ...currentMeta, ...updates };

    if (customTimelineAction) {
      const timeLog = { date: new Date().toISOString(), action: customTimelineAction, by: 'Olatech Admin' };
      newMeta.timeline = [timeLog, ...(newMeta.timeline || [])];
    }

    const payload = JSON.stringify(newMeta);
    try {
      const res = await fetch(`/api/enrollments/${id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: payload })
      });
      if (res.ok) {
        setEnrollments(prev => prev.map(item => item.id === id ? { ...item, adminNotes: payload } : item));
        if (selectedEnrollment && selectedEnrollment.id === id) {
          setSelectedEnrollment(prev => prev ? { ...prev, adminNotes: payload } : null);
        }
        return true;
      }
    } catch (e) {
      alert('Error saving operational metadata');
    }
    return false;
  };

  // Status updates
  const handleStatusChange = async (id: number, newStatus: string) => {
    const record = enrollments.find(e => e.id === id);
    const applicantName = record ? `${record.firstName} ${record.lastName}` : 'Candidate';
    try {
      const res = await fetch(`/api/enrollments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setEnrollments(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        if (selectedEnrollment && selectedEnrollment.id === id) {
          setSelectedEnrollment(prev => prev ? { ...prev, status: newStatus } : null);
        }
        await updateMeta(id, {}, `Application marked as ${newStatus}`);
        triggerAuditLog(`Changed status of application to ${newStatus}`, applicantName);
      }
    } catch (e) {
      alert('Failed to update application status.');
    }
  };

  // Soft delete toggler
  const handleSoftDeleteToggle = async (id: number, deleteState: boolean) => {
    const record = enrollments.find(e => e.id === id);
    const applicantName = record ? `${record.firstName} ${record.lastName}` : 'Candidate';
    const actionText = deleteState ? 'Soft-deleted registration' : 'Restored soft-deleted registration';
    const success = await updateMeta(id, { deleted: deleteState }, actionText);
    if (success) {
      alert(deleteState ? 'Application moved to Trash' : 'Application restored successfully');
      triggerAuditLog(deleteState ? 'Moved application to Trash/Archive' : 'Restored application from Trash', applicantName);
    }
  };

  // Plain notes saver
  const handleSaveNotes = async () => {
    if (!selectedEnrollment) return;
    setIsSavingNotes(true);
    const applicantName = `${selectedEnrollment.firstName} ${selectedEnrollment.lastName}`;
    const success = await updateMeta(selectedEnrollment.id, { notes: adminNotesDraft }, 'Internal Staff Notes updated');
    setIsSavingNotes(false);
    if (success) {
      alert('Internal notes updated successfully.');
      triggerAuditLog('Updated internal operational notes', applicantName);
    }
  };

  // Communication triggers
  const templates = {
    approval: (name: string, course: string, ref: string) => `Dear ${name},\n\nCongratulations! Your tech training scholarship application at Olatech School of Programming has been APPROVED for the ${course} track (Ref: ${ref}).\n\nPlease check your email for student enrollment steps.\n\nBest regards,\nOlatech Admissions Committee`,
    reminder: (name: string, course: string, ref: string) => `Hello ${name},\n\nThis is a friendly reminder from Olatech Admissions regarding your pending registration for the ${course} path (Ref: ${ref}).\n\nPlease let us know if you need assistance configuring your learning computer or verifying your service documents.\n\nBest regards,\nOlatech Admin`,
    orientation: (name: string, course: string, ref: string) => `Hello ${name},\n\nWe are excited to invite you to our Orientation Ceremony for the ${course} cohort on July 10, 2026.\n\nVenue: Olatech Programming Campus, Lagos / Streamed Live.\n\nSee you there!\nOlatech Operations`,
    missing: (name: string, course: string, ref: string) => `Dear ${name},\n\nOur Admissions desk noticed a few missing validation credentials on your profile (Ref: ${ref}).\n\nPlease submit your NYSC Call-up Letter and Laptop readiness report as soon as possible.\n\nAdmissions - Olatech School`,
    congrats: (name: string, course: string, ref: string) => `Congratulations ${name}!\n\nYou are now ENROLLED as an active student at Olatech School of Programming. We look forward to working with you to launch your tech career.\n\nWarm regards,\nEngr. Yusuf Ola & Team`
  };

  const dispatchMessage = async (applicant: Enrollment, type: 'Email' | 'WhatsApp' | 'SMS Placeholder', templateName: keyof typeof templates) => {
    const fullName = `${applicant.firstName} ${applicant.lastName}`;
    const refStr = `CT-2026-${String(applicant.id).padStart(4, '0')}`;
    const messageText = templates[templateName](fullName, applicant.course, refStr);

    // Record Comm Log
    const currentMeta = parseAdminNotes(applicant.adminNotes);
    const newComm = {
      date: new Date().toISOString(),
      type,
      template: templateName.toUpperCase(),
      text: messageText,
      notes: `Template ${templateName} dispatched`
    };
    
    await updateMeta(applicant.id, { comms: [newComm, ...(currentMeta.comms || [])] }, `Dispatched ${templateName} template via ${type}`);

    if (type === 'Email') {
      window.open(`mailto:${applicant.email}?subject=${encodeURIComponent('Olatech Admissions Center')}&body=${encodeURIComponent(messageText)}`);
    } else if (type === 'WhatsApp') {
      let cleanPhone = applicant.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '234' + cleanPhone.substring(1);
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`);
    } else {
      alert(`SMS Dispatch Frame Prepared!\nTo client: ${fullName} (${applicant.phone})\n\nContent:\n${messageText}`);
    }
  };

  const addCustomCommLog = async () => {
    if (!selectedEnrollment || !customCommDraft.trim()) return;
    const currentMeta = parseAdminNotes(selectedEnrollment.adminNotes);
    const newComm = {
      date: new Date().toISOString(),
      type: 'Direct Note / Phone Call',
      template: 'MANUAL',
      text: customCommDraft,
      notes: 'Recorded manually by administrator'
    };
    const success = await updateMeta(selectedEnrollment.id, { comms: [newComm, ...(currentMeta.comms || [])] }, 'Logged manual communication update');
    if (success) {
      setCustomCommDraft('');
      alert('Communication note logged successfully!');
    }
  };

  // Cohorts management
  const [newCohort, setNewCohort] = useState<Partial<Cohort>>({ name: '', course: 'Cybersecurity', startDate: '', orientDate: '', trainer: '', status: 'Enrolling' });
  const [isAddingCohort, setIsAddingCohort] = useState(false);

  const handleAddCohort = (e: FormEvent) => {
    e.preventDefault();
    if (!newCohort.name || !newCohort.startDate) return;
    const added: Cohort = {
      id: `c-${Date.now()}`,
      name: newCohort.name,
      course: newCohort.course || 'Cybersecurity',
      startDate: newCohort.startDate,
      orientDate: newCohort.orientDate || newCohort.startDate,
      trainer: newCohort.trainer || 'Unassigned',
      status: 'Enrolling'
    };
    setCohorts([...cohorts, added]);
    setNewCohort({ name: '', course: 'Cybersecurity', startDate: '', orientDate: '', trainer: '', status: 'Enrolling' });
    setIsAddingCohort(false);
  };

  // CSV Report Generator
  const triggerCSVExport = () => {
    const headers = ['Reference Number', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'State of Service', 'NYSC Batch', 'Course Track', 'Transportation', 'Pickup Station', 'Status', 'Orientation Docs', 'Orientation Laptop', 'Orientation Pay', 'Date Registered'];
    const rows = enrollments.map(e => {
      const meta = parseAdminNotes(e.adminNotes);
      return [
        `CT-2026-${String(e.id).padStart(4, '0')}`,
        e.firstName,
        e.lastName,
        e.email,
        e.phone,
        e.gender,
        e.stateOfService,
        e.nyscBatch,
        e.course,
        e.transportationOption,
        e.pickupLocation || 'Self Commute',
        e.status,
        meta.checklist?.docs ? 'Verified' : 'Pending',
        meta.checklist?.laptop ? 'Confirmed' : 'Pending',
        meta.checklist?.pay ? 'Verified' : 'Pending',
        new Date(e.createdAt).toLocaleDateString()
      ];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Olatech_CRM_Admissions_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Compile full list metrics
  const stats = (() => {
    const activeEnrollments = enrollments.filter(e => !parseAdminNotes(e.adminNotes).deleted);
    const total = activeEnrollments.length;
    const pending = activeEnrollments.filter(e => e.status === 'Pending').length;
    const reviewed = activeEnrollments.filter(e => e.status === 'Reviewed').length;
    const approved = activeEnrollments.filter(e => e.status === 'Approved').length;
    const rejected = activeEnrollments.filter(e => e.status === 'Rejected').length;
    const enrolled = activeEnrollments.filter(e => e.status === 'Enrolled').length;

    const busPassengers = activeEnrollments.filter(e => e.transportationOption === 'Company Bus').length;
    const selfPassengers = total - busPassengers;

    const todayStr = new Date().toDateString();
    const todayRegs = activeEnrollments.filter(e => new Date(e.createdAt).toDateString() === todayStr).length;

    // Course distributions
    const courses: Record<string, number> = {};
    activeEnrollments.forEach(e => { courses[e.course] = (courses[e.course] || 0) + 1; });
    const courseChartData = Object.entries(courses).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

    // State of Service top list
    const states: Record<string, number> = {};
    activeEnrollments.forEach(e => { states[e.stateOfService] = (states[e.stateOfService] || 0) + 1; });
    const stateChartData = Object.entries(states).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 6);

    // Laptop breakdown
    const laptopYes = activeEnrollments.filter(e => e.laptopAvailable === 'Yes').length;
    const laptopNo = total - laptopYes;

    return { total, pending, reviewed, approved, rejected, enrolled, busPassengers, selfPassengers, todayRegs, courseChartData, stateChartData, laptopYes, laptopNo };
  })();

  // Filter & sort applicants
  const processedApplicants = enrollments.filter(e => {
    const meta = parseAdminNotes(e.adminNotes);
    const isDeleted = !!meta.deleted;
    if (showTrash !== isDeleted) return false;

    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    if (courseFilter !== 'All' && e.course !== courseFilter) return false;
    if (stateFilter !== 'All' && e.stateOfService !== stateFilter) return false;
    if (batchFilter !== 'All' && e.nyscBatch !== batchFilter) return false;
    if (genderFilter !== 'All' && e.gender !== genderFilter) return false;
    if (commuteFilter !== 'All' && e.transportationOption !== commuteFilter) return false;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const refCode = `CT-2026-${String(e.id).padStart(4, '0')}`.toLowerCase();
      const matchName = `${e.firstName} ${e.lastName}`.toLowerCase().includes(query);
      const matchEmail = e.email.toLowerCase().includes(query);
      const matchPhone = e.phone.includes(query);
      return matchName || matchEmail || matchPhone || refCode.includes(query);
    }
    return true;
  }).sort((a, b) => {
    let fieldA: any = a.createdAt;
    let fieldB: any = b.createdAt;

    if (sortBy === 'ref') { fieldA = a.id; fieldB = b.id; }
    else if (sortBy === 'name') { fieldA = `${a.firstName} ${a.lastName}`.toLowerCase(); fieldB = `${b.firstName} ${b.lastName}`.toLowerCase(); }
    else if (sortBy === 'course') { fieldA = a.course; fieldB = b.course; }
    else if (sortBy === 'status') { fieldA = a.status; fieldB = b.status; }

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Reviewed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Enrolled': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper calculation for candidate readiness score
  const getReadinessScore = (meta: OperationalMeta) => {
    if (!meta.checklist) return 0;
    const checks = [meta.checklist.docs, meta.checklist.laptop, meta.checklist.pay, meta.checklist.orient, meta.checklist.whatsapp, meta.checklist.ready];
    const score = checks.filter(Boolean).length;
    return Math.round((score / 6) * 100);
  };

  const sidebarTabs = [
    { id: 'operations', label: 'Operations Center', icon: Activity, roles: ['Super Admin', 'Admissions Officer', 'Operations Officer', 'Career Officer', 'Finance Officer', 'Support Officer'] },
    { id: 'dashboard', label: 'Command Center', icon: BarChart3, roles: ['Super Admin', 'Admissions Officer', 'Operations Officer', 'Career Officer', 'Finance Officer', 'Support Officer'] },
    { id: 'applicants', label: 'Applicants CRM', icon: Users, roles: ['Super Admin', 'Admissions Officer'] },
    { id: 'cohorts', label: 'Learning Cohorts', icon: BookOpen, roles: ['Super Admin', 'Admissions Officer', 'Operations Officer'] },
    { id: 'transport', label: 'Commute Manager', icon: Bus, roles: ['Super Admin', 'Operations Officer'] },
    { id: 'orientation', label: 'Orientation Matrix', icon: CheckSquare, roles: ['Super Admin', 'Admissions Officer', 'Operations Officer'] },
    { id: 'recruitment', label: 'Recruitment AI', icon: UsersRound, roles: ['Super Admin', 'Career Officer'] },
    { id: 'career', label: 'Career Launch', icon: Briefcase, roles: ['Super Admin', 'Career Officer'] },
    { id: 'team', label: 'Team Management', icon: Users, roles: ['Super Admin'] },
    { id: 'reports', label: 'Executive Reports', icon: BarChart3, roles: ['Super Admin', 'Admissions Officer', 'Operations Officer', 'Career Officer'] },
    { id: 'settings', label: 'Platform Settings', icon: Settings, roles: ['Super Admin', 'Operations Officer'] },
    { id: 'documents', label: 'Documentation Center', icon: FileText, roles: ['Super Admin', 'Admissions Officer', 'Operations Officer', 'Career Officer', 'Finance Officer', 'Support Officer'] },
    { id: 'audit', label: 'Chronos Audit Logs', icon: Shield, roles: ['Super Admin'] },
    { id: 'backup', label: 'Backup & Recovery', icon: Database, roles: ['Super Admin'] }
  ].filter(tab => tab.roles.includes(currentStaff?.role || ''));

  useEffect(() => {
    if (currentStaff) {
      const hasAccess = sidebarTabs.some(t => t.id === activeTab);
      if (!hasAccess) {
        setActiveTab('operations');
      }
    }
  }, [currentStaff, activeTab, sidebarTabs]);

  const handleLogout = async () => {
    if (currentStaff) {
      try {
        await fetch('/api/staff/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentStaff.email })
        });
      } catch (err) {
        console.error('Failed to notify logout endpoint:', err);
      }
    }
    localStorage.removeItem('olatech_staff_session');
    setCurrentStaff(null);
    setMustChangePassword(false);
  };

  // --- RENDERING ROUTINES ---
  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header Visual */}
          <div className="p-8 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative">
            <div className="absolute right-4 top-4 bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase">
              v1.0 Gold
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/15 rounded-xl border border-white/10">
                <Shield size={24} className="text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight font-sans">CORPERS<span className="text-emerald-100">TECH</span></h1>
                <p className="text-xs text-emerald-100 font-medium">Olatech School of Programming</p>
              </div>
            </div>
            <h2 className="text-lg font-bold mt-6 tracking-tight">Staff Management Portal</h2>
            <p className="text-xs text-emerald-100 mt-1">Authorized operations team and trainers only.</p>
          </div>

          {/* Form */}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoginError('');
            try {
              const res = await fetch('/api/staff/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
              });
              if (res.ok) {
                const staff = await res.json();
                localStorage.setItem('olatech_staff_session', JSON.stringify(staff));
                setCurrentStaff(staff);
                if (staff.forcePasswordChange) {
                  setMustChangePassword(true);
                }
                setRefreshTrigger(prev => prev + 1);
              } else {
                const errData = await res.json();
                setLoginError(errData.error || 'Invalid operational credentials.');
              }
            } catch (err) {
              setLoginError('Operational database connection failed.');
            }
          }} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Operational Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" 
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admineducert@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-semibold text-slate-800 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Security Passcode</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-semibold text-slate-800 outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Remember Me
              </label>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-emerald-650 hover:bg-emerald-700 bg-emerald-600 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer"
            >
              Secure Staff Log In
            </button>

            {/* Olatech Staff Access Only Disclaimer */}
            <div className="text-center pt-2">
              <span className="text-xs font-extrabold text-slate-400 tracking-wider block">Olatech Staff Access Only</span>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (mustChangePassword && currentStaff) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 bg-amber-600 text-white">
            <h2 className="text-lg font-bold tracking-tight">Security Action Required</h2>
            <p className="text-xs text-amber-100 mt-1">The Super Admin has forced a password change for your account on next login. Please choose a new password.</p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setForceChangeError('');
            if (newPasswordVal.length < 6) {
              setForceChangeError('Password must be at least 6 characters.');
              return;
            }
            if (newPasswordVal !== confirmPasswordVal) {
              setForceChangeError('Passwords do not match.');
              return;
            }

            try {
              const res = await fetch(`/api/staff/${currentStaff.id}/reset-password`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'x-admin-user': currentStaff.name,
                  'x-admin-role': currentStaff.role
                },
                body: JSON.stringify({ newPassword: newPasswordVal, forcePasswordChange: false })
              });

              if (res.ok) {
                // Update currentSession state
                const updatedSession = { ...currentStaff, forcePasswordChange: false };
                localStorage.setItem('olatech_staff_session', JSON.stringify(updatedSession));
                setCurrentStaff(updatedSession);
                setMustChangePassword(false);
                alert('Your operational passcode has been updated successfully. Welcome back!');
              } else {
                const errData = await res.json();
                setForceChangeError(errData.error || 'Failed to update passcode.');
              }
            } catch (err) {
              setForceChangeError('Database connection failed. Please try again.');
            }
          }} className="p-8 space-y-4">
            {forceChangeError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                {forceChangeError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <input 
                type="password" 
                required
                value={newPasswordVal}
                onChange={(e) => setNewPasswordVal(e.target.value)}
                placeholder="Enter new secure passcode"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={confirmPasswordVal}
                onChange={(e) => setConfirmPasswordVal(e.target.value)}
                placeholder="Re-type secure passcode"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                type="button"
                onClick={handleLogout}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors"
              >
                Log Out
              </button>
              <button 
                type="submit"
                className="flex-grow py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md"
              >
                Update and Access
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex w-full font-sans" id="admissions-console-root">
      {/* 1. Left Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800">
        <div className="p-6 bg-slate-950 flex items-center gap-3">
          <div className="p-1.5 bg-emerald-600 rounded-lg">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider font-sans block">CORPERS<span className="text-emerald-500">TECH</span></span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Command Center</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Connected</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <div>
              <span className="font-extrabold block text-white">{currentStaff.name}</span>
              <span className="text-[9px] text-slate-400 font-bold block">{currentStaff.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
              title="Logout from operations"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/60 z-40" onClick={() => setMobileSidebarOpen(false)}></div>
          {/* Menu */}
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 text-white z-50">
            <div className="p-6 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                <span className="font-extrabold text-xs tracking-wider">CORPERS<span className="text-emerald-500">TECH</span></span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {sidebarTabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs">
              <span className="font-extrabold block text-white">{currentStaff.name}</span>
              <span className="text-[9px] text-slate-400 block">{currentStaff.role}</span>
              <button 
                onClick={handleLogout}
                className="w-full mt-3 py-2 bg-red-950/20 border border-red-900/30 text-red-400 font-bold text-[10px] rounded-lg text-center cursor-pointer block"
              >
                Log Out Operations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden relative">
        {/* Sticky Header Row */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <Menu size={18} />
            </button>
            <div>
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold font-mono">
                {currentStaff.role} WORKSPACE
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
                Admissions & Operations Command Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync trigger button on header */}
            <button
              onClick={handleRefresh}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
              title="Sync state with SQL Server"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden font-sans"
                    >
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-extrabold text-slate-800">Operational Notices</span>
                        <div className="flex gap-2 text-[10px]">
                          <button 
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                              triggerAuditLog('Acknowledged all notices', 'Notification Center');
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            Mark All Read
                          </button>
                          <span className="text-slate-300">|</span>
                          <button 
                            onClick={() => {
                              setNotifications([]);
                              triggerAuditLog('Cleared notifications panel', 'Notification Center');
                            }}
                            className="text-slate-500 hover:text-slate-700 font-bold"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400 font-semibold">
                            Zero unread operational alerts.
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                              }}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${!n.read ? 'bg-emerald-50/25' : ''}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-xs font-bold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</span>
                                <span className="text-[9px] text-slate-400 whitespace-nowrap">{n.time}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{n.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center font-mono">
                  {currentStaff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-[11px] font-extrabold text-slate-800 leading-none">{currentStaff.name}</span>
                  <span className="block text-[9px] text-slate-500 font-bold leading-none mt-0.5">{currentStaff.role}</span>
                </div>
                <ChevronDown size={12} className="text-slate-500" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden font-sans"
                    >
                      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <span className="block text-xs font-extrabold text-slate-800">{currentStaff.name}</span>
                        <span className="block text-[9px] text-slate-400 font-bold">{currentStaff.email}</span>
                      </div>
                      <div className="p-1.5 space-y-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <LogOut size={13} />
                          <span>Sign Out Console</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Content Pane */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 text-red-800" id="crm-error-banner">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-bold">System Connection Failure:</span> {error}
                <p className="text-xs text-red-600 mt-1">Please ensure your cloud database is online and fully provisioned.</p>
              </div>
            </div>
          )}

      {/* RENDER ACTIVE TAB VIEW */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >

          {/* PHASE 5.8 OPERATIONS CENTER */}
          {activeTab === 'operations' && (
            <OperationsCenterView 
              currentStaff={currentStaff} 
              onNavigate={(tab) => setActiveTab(tab)} 
              enrollments={enrollments} 
            />
          )}

          {/* MODULE 1: COMMAND CENTER */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8" id="crm-tabview-dashboard">
              {/* Stats Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Applicants', value: stats.total, color: 'text-slate-950', border: 'border-slate-100' },
                  { label: 'Pending review', value: stats.pending, color: 'text-amber-600', border: 'border-amber-100/80 bg-amber-50/20' },
                  { label: 'Approved slots', value: stats.approved, color: 'text-emerald-600', border: 'border-emerald-100/80 bg-emerald-50/20' },
                  { label: 'Currently Enrolled', value: stats.enrolled, color: 'text-purple-600', border: 'border-purple-100/80 bg-purple-50/20' }
                ].map((s, idx) => (
                  <div key={idx} className={`p-5 bg-white border rounded-2xl shadow-sm ${s.border}`} id={`dashboard-stat-${idx}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-2xl sm:text-3xl font-extrabold ${s.color} mt-1`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Company Bus Riders', value: stats.busPassengers, color: 'text-emerald-600', sub: 'pickup seat assigned' },
                  { label: 'Self Commuters', value: stats.selfPassengers, color: 'text-slate-600', sub: 'coordinate own arrival' },
                  { label: 'Today\'s Registrations', value: stats.todayRegs, color: 'text-blue-600', sub: 'recently registered today' },
                  { label: 'Declined/Rejected', value: stats.rejected, color: 'text-red-500', sub: 'disqualified profiles' }
                ].map((s, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl shadow-sm" id={`dashboard-stat-sub-${idx}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-xl sm:text-2xl font-black ${s.color} mt-1`}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Central Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Quick Review Queue */}
                <div className="lg:col-span-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Review Queue (Pending Applications)</h3>
                      <p className="text-xs text-slate-400">Instantly evaluate newly received applications before they close.</p>
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-600 font-bold px-2.5 py-1 rounded-lg">
                      {stats.pending} waiting
                    </span>
                  </div>

                  {enrollments.filter(e => e.status === 'Pending' && !parseAdminNotes(e.adminNotes).deleted).length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">All caught up!</p>
                      <p className="text-xs text-slate-400">Zero pending applications are currently awaiting review.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                      {enrollments.filter(e => e.status === 'Pending' && !parseAdminNotes(e.adminNotes).deleted).map(app => (
                        <div key={app.id} className="py-3.5 flex items-center justify-between gap-3 text-xs" id={`review-queue-row-${app.id}`}>
                          <div>
                            <span className="font-mono text-[10px] font-bold text-slate-400">CT-2026-{String(app.id).padStart(4, '0')}</span>
                            <h4 className="font-bold text-slate-800 text-sm mt-0.5">{app.firstName} {app.lastName}</h4>
                            <p className="text-slate-500 font-medium text-[11px] mt-0.5">{app.course} · serving in <span className="font-semibold text-slate-700">{app.stateOfService}</span></p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedEnrollment(app)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-all"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'Approved')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Orientation Readiness & Quick Actions */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Next Orientation Day */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-3">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">Upcoming Orientation</span>
                    <h4 className="text-lg font-bold tracking-tight">Olatech Tech Day Orientation</h4>
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <Calendar size={14} className="mt-0.5 text-emerald-400" />
                      <div>
                        <p className="font-bold text-white">Coming Soon!!!</p>
                        <p className="text-[10px] text-slate-400">Time: 00:00 AM Prompt (GMT+1)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <MapPin size={14} className="mt-0.5 text-emerald-400" />
                      <p className="text-slate-300">{settings.campusAddress}</p>
                    </div>
                  </div>

                  {/* Quick Action Matrix */}
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Operations</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button 
                        onClick={() => setActiveTab('applicants')} 
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 rounded-xl font-semibold flex flex-col items-center gap-1 transition-all"
                      >
                        <Users size={16} className="text-emerald-600" />
                        <span>Manage Applicants</span>
                      </button>
                      <button 
                        onClick={() => { setActiveTab('reports'); setTimeout(() => window.print(), 200); }}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 rounded-xl font-semibold flex flex-col items-center gap-1 transition-all"
                      >
                        <Printer size={16} className="text-slate-600" />
                        <span>Print Reports</span>
                      </button>
                      <button 
                        onClick={triggerCSVExport} 
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 rounded-xl font-semibold flex flex-col items-center gap-1 transition-all"
                      >
                        <Download size={16} className="text-blue-600" />
                        <span>Export CSV</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('settings')} 
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 rounded-xl font-semibold flex flex-col items-center gap-1 transition-all"
                      >
                        <Settings size={16} className="text-purple-600" />
                        <span>System Config</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic activity feed */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Admissions Operational Log</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto text-xs pr-2">
                  {enrollments.slice(0, 10).map((e, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-1 text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div className="flex-grow">
                        <p className="font-semibold text-slate-800">{e.firstName} {e.lastName} registered for {e.course}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Reference: CT-2026-{String(e.id).padStart(4, '0')} · {new Date(e.createdAt).toLocaleString()}</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">{e.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: APPLICANT MANAGEMENT CRM */}
          {activeTab === 'applicants' && (
            <div className="space-y-6" id="crm-tabview-applicants">
              {/* Search & Filters block */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative w-full md:flex-grow">
                    <span className="absolute left-3.5 top-3.5 text-slate-400"><Search size={16} /></span>
                    <input
                      type="text"
                      placeholder="Search by candidate name, email, phone or reference code..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 rounded-xl text-xs sm:text-sm transition-all font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto shrink-0">
                    <button
                      onClick={() => setShowTrash(!showTrash)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2.5 border rounded-xl text-xs font-semibold transition-all ${
                        showTrash 
                          ? 'bg-red-50 border-red-200 text-red-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Trash size={13} />
                      {showTrash ? 'Viewing Deleted (Trash)' : 'View Trash / Archives'}
                    </button>
                    <button
                      onClick={triggerCSVExport}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                    >
                      <Download size={13} /> Export CSV
                    </button>
                  </div>
                </div>

                {/* Multitaxial filter matrix */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Enrolled">Enrolled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Skill Track</label>
                    <select
                      value={courseFilter}
                      onChange={e => setCourseFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">All Courses</option>
                      {settings.availableCourses.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">State of Service</label>
                    <select
                      value={stateFilter}
                      onChange={e => setStateFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">All States</option>
                      {Array.from(new Set(enrollments.map(e => e.stateOfService))).sort().map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">NYSC Batch</label>
                    <select
                      value={batchFilter}
                      onChange={e => setBatchFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">All Batches</option>
                      {Array.from(new Set(enrollments.map(e => e.nyscBatch))).map(bt => (
                        <option key={bt} value={bt}>{bt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Commute Track</label>
                    <select
                      value={commuteFilter}
                      onChange={e => setCommuteFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">All Commutes</option>
                      <option value="Company Bus">Company Bus</option>
                      <option value="Individual Transportation">Individual Commuter</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gender</label>
                    <select
                      value={genderFilter}
                      onChange={e => setGenderFilter(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="All">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Sorter Ribbon */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase">Sort By:</span>
                    {[
                      { id: 'date', label: 'Date Registered' },
                      { id: 'ref', label: 'Reference Code' },
                      { id: 'name', label: 'Alphabetical Name' },
                      { id: 'course', label: 'Skill Path' },
                      { id: 'status', label: 'Admissions Status' }
                    ].map(sortOption => (
                      <button
                        key={sortOption.id}
                        onClick={() => {
                          if (sortBy === sortOption.id) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy(sortOption.id as any);
                            setSortOrder('desc');
                          }
                        }}
                        className={`px-2 py-1 rounded transition-all font-semibold ${
                          sortBy === sortOption.id ? 'bg-slate-100 text-slate-900' : 'hover:text-slate-800'
                        }`}
                      >
                        {sortOption.label} {sortBy === sortOption.id ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </button>
                    ))}
                  </div>
                  <p className="font-semibold text-slate-500">Showing <span className="text-slate-800">{processedApplicants.length}</span> entries</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                {processedApplicants.length === 0 ? (
                  <div className="py-24 text-center">
                    <FileText className="mx-auto text-slate-300 mb-2" size={40} />
                    <p className="font-bold text-slate-700">No applicants found</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Try resetting your search query or toggling filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          <th className="p-4 pl-6">Reference No</th>
                          <th className="p-4">Applicant / Corps Member</th>
                          <th className="p-4">Skill Track</th>
                          <th className="p-4">NYSC Service</th>
                          <th className="p-4">Commute</th>
                          <th className="p-4">Admissions Status</th>
                          <th className="p-4 text-center">Ready%</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {processedApplicants.map(app => {
                          const refCode = `CT-2026-${String(app.id).padStart(4, '0')}`;
                          const meta = parseAdminNotes(app.adminNotes);
                          const readiness = getReadinessScore(meta);
                          
                          return (
                            <tr key={app.id} className="hover:bg-slate-50/40 transition-colors" id={`applicant-tr-${app.id}`}>
                              <td className="p-4 pl-6 font-mono font-bold text-slate-400">{refCode}</td>
                              <td className="p-4">
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{app.firstName} {app.lastName}</p>
                                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{app.email} · {app.phone}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-slate-200/40">{app.course}</span>
                              </td>
                              <td className="p-4 text-[11px]">
                                <p className="font-bold text-slate-800">{app.stateOfService} State</p>
                                <p className="text-slate-400 text-[10px] mt-0.5">{app.nyscBatch}</p>
                              </td>
                              <td className="p-4 text-[11px]">
                                {app.transportationOption === 'Company Bus' ? (
                                  <span className="flex items-center gap-1 text-emerald-700 font-bold"><Bus size={11} /> Bus: {app.pickupLocation || 'Main Hub'}</span>
                                ) : (
                                  <span className="text-slate-400 font-medium">Self-Commute</span>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${getStatusStyle(app.status)}`}>
                                  <span className="w-1 h-1 rounded-full bg-current mr-1" />
                                  {app.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold text-slate-600 mb-0.5">{readiness}%</span>
                                  <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${readiness === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                      style={{ width: `${readiness}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedEnrollment(app)}
                                    id={`view-details-${app.id}`}
                                    className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-lg transition-all"
                                    title="View Profile Drawer"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  {showTrash ? (
                                    <button
                                      onClick={() => handleSoftDeleteToggle(app.id, false)}
                                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-all"
                                      title="Restore candidate"
                                    >
                                      <Undo2 size={15} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleSoftDeleteToggle(app.id, true)}
                                      className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-all"
                                      title="Move to trash"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 5: COHORT MANAGEMENT */}
          {activeTab === 'cohorts' && (
            <div className="space-y-6" id="crm-tabview-cohorts">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Active Learning Cohorts</h3>
                  <p className="text-xs text-slate-400">Manage learning streams, orientation dates, assign core trainers, and review student rosters.</p>
                </div>
                <button
                  onClick={() => setIsAddingCohort(!isAddingCohort)}
                  id="btn-cohort-add"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Plus size={14} />
                  Create Learning Cohort
                </button>
              </div>

              {/* Add Cohort Form Modal */}
              <AnimatePresence>
                {isAddingCohort && (
                  <motion.form
                    onSubmit={handleAddCohort}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4 overflow-hidden"
                  >
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Learning Cohort Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Cohort Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cybersecurity July 2026"
                          value={newCohort.name}
                          onChange={e => setNewCohort({ ...newCohort, name: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Course Track</label>
                        <select
                          value={newCohort.course}
                          onChange={e => setNewCohort({ ...newCohort, course: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-bold"
                        >
                          {settings.availableCourses.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Assign Trainer / Instructor</label>
                        <input
                          type="text"
                          placeholder="e.g. Engr. Ola"
                          value={newCohort.trainer}
                          onChange={e => setNewCohort({ ...newCohort, trainer: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Start Date</label>
                        <input
                          type="date"
                          required
                          value={newCohort.startDate}
                          onChange={e => setNewCohort({ ...newCohort, startDate: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">Orientation Day</label>
                        <input
                          type="date"
                          value={newCohort.orientDate}
                          onChange={e => setNewCohort({ ...newCohort, orientDate: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsAddingCohort(false)}
                        className="px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                      >
                        Deploy Cohort
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Cohort Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cohorts.map(coh => {
                  const assignedStudents = enrollments.filter(e => {
                    const meta = parseAdminNotes(e.adminNotes);
                    return meta.cohortId === coh.id && !meta.deleted;
                  });

                  return (
                    <div key={coh.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4" id={`cohort-card-${coh.id}`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{coh.course}</span>
                          <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 px-2 rounded">{coh.status}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 leading-tight">{coh.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">Trainer: <strong className="text-slate-700 font-bold">{coh.trainer}</strong></p>
                      </div>

                      <div className="border-t border-slate-50 pt-3 space-y-2.5 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span className="font-bold text-slate-800">{new Date(coh.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orientation:</span>
                          <span className="font-bold text-slate-800">{new Date(coh.orientDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                          <span className="font-semibold text-slate-600">Assigned Roster:</span>
                          <span className="font-black text-emerald-700 bg-white shadow-xs px-2.5 py-0.5 rounded-lg border border-slate-100">
                            {assignedStudents.length} students
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODULE 6: TRANSPORTATION MANAGER */}
          {activeTab === 'transport' && (
            <div className="space-y-6" id="crm-tabview-transport">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Transportation Roster & Commutes</h3>
                <p className="text-xs text-slate-400">Track pickups, vehicle assignments, and print official transit rosters for company bus operations.</p>
              </div>

              {/* Transit Details Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1 shadow-sm">
                  <span className="text-slate-400 block uppercase font-bold text-[9px]">Allocated Driver</span>
                  <p className="text-slate-800 font-bold text-sm">{settings.busDriverName}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1 shadow-sm">
                  <span className="text-slate-400 block uppercase font-bold text-[9px]">Vehicle Information</span>
                  <p className="text-slate-800 font-bold text-sm">Toyota Coaster bus (Plate: {settings.busPlateNo})</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1 shadow-sm">
                  <span className="text-slate-400 block uppercase font-bold text-[9px]">Departure Schedule</span>
                  <p className="text-slate-800 font-bold text-sm">{settings.busDepartureTime} prompt from camp axis</p>
                </div>
              </div>

              {/* Pickup stats summaries */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Station summaries */}
                <div className="lg:col-span-4 bg-white p-6 border border-slate-100 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Route summaries & pickups</h4>
                  <div className="space-y-2.5 text-xs">
                    {settings.pickupLocations.map(loc => {
                      const ridersCount = enrollments.filter(e => e.transportationOption === 'Company Bus' && e.pickupLocation === loc && !parseAdminNotes(e.adminNotes).deleted).length;
                      return (
                        <div key={loc} className="flex justify-between items-center p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                          <span className="font-semibold text-slate-700">{loc}</span>
                          <span className="bg-white text-emerald-700 border border-slate-200/50 px-2.5 py-0.5 rounded-lg font-black">{ridersCount} passengers</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live manifests */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Official Passenger Manifest</h4>
                      <p className="text-xs text-slate-400">Live roster of corps members scheduled for company bus commute.</p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                    >
                      <Printer size={13} /> Print Transit Sheet
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-left text-xs divide-y divide-slate-100">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="p-3 pl-5">Seat</th>
                          <th className="p-3">Passenger</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Pickup Location</th>
                          <th className="p-3">Course</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {enrollments.filter(e => e.transportationOption === 'Company Bus' && !parseAdminNotes(e.adminNotes).deleted).map((rider, idx) => {
                          const meta = parseAdminNotes(rider.adminNotes);
                          const seatNo = meta.seatAllocation || `Seat ${String(idx + 1).padStart(2, '0')}`;
                          return (
                            <tr key={rider.id} className="hover:bg-slate-50/50">
                              <td className="p-3 pl-5 font-mono font-bold text-emerald-700">{seatNo}</td>
                              <td className="p-3 font-bold text-slate-900">{rider.firstName} {rider.lastName}</td>
                              <td className="p-3 text-slate-500">{rider.phone}</td>
                              <td className="p-3 text-slate-600 font-semibold">{rider.pickupLocation || 'Main Terminal'}</td>
                              <td className="p-3 text-slate-500 font-mono text-[10px]">{rider.course}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: ORIENTATION MATRIX */}
          {activeTab === 'orientation' && (
            <div className="space-y-6" id="crm-tabview-orientation">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Orientation Readiness & Verification</h3>
                <p className="text-xs text-slate-400">Perform compliance checklists for candidate onboarding. Percentage readiness is computed automatically.</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <th className="p-4 pl-6">Reference No</th>
                        <th className="p-4">Candidate Name</th>
                        <th className="p-4 text-center">Docs Verified</th>
                        <th className="p-4 text-center">Laptop OK</th>
                        <th className="p-4 text-center">Fee Paid</th>
                        <th className="p-4 text-center">Attended Orient.</th>
                        <th className="p-4 text-center">Joined WhatsApp</th>
                        <th className="p-4 text-center">Class Ready</th>
                        <th className="p-4 pr-6 text-right">Readiness %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150/40 font-semibold text-slate-700">
                      {enrollments.filter(e => !parseAdminNotes(e.adminNotes).deleted).map(candidate => {
                        const refCode = `CT-2026-${String(candidate.id).padStart(4, '0')}`;
                        const meta = parseAdminNotes(candidate.adminNotes);
                        const cl = meta.checklist || { docs: false, laptop: false, pay: false, orient: false, whatsapp: false, ready: false };
                        const percent = getReadinessScore(meta);

                        const toggleCheck = async (key: keyof typeof cl) => {
                          const newChecklist = { ...cl, [key]: !cl[key] };
                          await updateMeta(candidate.id, { checklist: newChecklist }, `Checklist element ${key} toggled to ${newChecklist[key]}`);
                        };

                        return (
                          <tr key={candidate.id} className="hover:bg-slate-50/50" id={`orient-tr-${candidate.id}`}>
                            <td className="p-4 pl-6 font-mono text-slate-400 font-bold">{refCode}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-bold text-slate-900">{candidate.firstName} {candidate.lastName}</p>
                                <p className="text-[10px] text-slate-400">{candidate.course}</p>
                              </div>
                            </td>
                            {/* Checkboxes */}
                            {[
                              { k: 'docs', val: cl.docs },
                              { k: 'laptop', val: cl.laptop },
                              { k: 'pay', val: cl.pay },
                              { k: 'orient', val: cl.orient },
                              { k: 'whatsapp', val: cl.whatsapp },
                              { k: 'ready', val: cl.ready }
                            ].map(item => (
                              <td key={item.k} className="p-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleCheck(item.k as any)}
                                  className="mx-auto flex items-center justify-center p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                  {item.val ? (
                                    <CheckSquare size={16} className="text-emerald-600" />
                                  ) : (
                                    <Square size={16} className="text-slate-300" />
                                  )}
                                </button>
                              </td>
                            ))}
                            <td className="p-4 pr-6 text-right">
                              <span className={`px-2.5 py-1 rounded-lg font-black text-[11px] ${percent === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                {percent}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: REPORTS & EXPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-8" id="crm-tabview-reports">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Executive Data Breakdown</h3>
                  <p className="text-xs text-slate-400">Consolidated aggregations for courses, mobilizations, commutes, and gender ratios.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerCSVExport}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Download size={14} /> Export CSV Excel Sheet
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Printer size={14} /> Print Reports
                  </button>
                </div>
              </div>

              {/* Interactive aggregates with recharts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Course popular bar chart */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Enrolled Students per Skill Path</h4>
                  <div className="h-64 text-xs font-mono">
                    {stats.courseChartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400 font-semibold">No data generated yet</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.courseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" />
                          <YAxis fontSize={9} stroke="#94a3b8" />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px' }} />
                          <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]}>
                            {stats.courseChartData.map((e, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Laptop availability or demographics */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Laptop Ownership ratio</h4>
                  <div className="h-44 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Owns Laptop', value: stats.laptopYes },
                            { name: 'No Laptop', value: stats.laptopNo }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={55}
                          dataKey="value"
                        >
                          <Cell fill="#16a34a" />
                          <Cell fill="#cbd5e1" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <p className="text-lg font-black text-slate-800">{stats.total}</p>
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Total</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Owns laptop:</span>
                      <span className="font-bold text-emerald-700">{stats.laptopYes} ({stats.total > 0 ? Math.round((stats.laptopYes/stats.total)*100) : 0}%)</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-600">
                      <span>Awaiting laptop:</span>
                      <span className="font-bold text-slate-500">{stats.laptopNo} ({stats.total > 0 ? Math.round((stats.laptopNo/stats.total)*100) : 0}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* State rankings */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Top Service Mobilization States</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                  {stats.stateChartData.map((st, idx) => (
                    <div key={st.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-center">
                      <span className="text-[9px] font-mono font-bold text-slate-400">Rank #{idx+1}</span>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">{st.name}</p>
                      <p className="font-semibold text-emerald-700">{st.value} applicants</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 9: PLATFORM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6" id="crm-tabview-settings">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platform Settings & Configurations</h3>
                <p className="text-xs text-slate-400">Simple admin controls to toggle registration portals, adjust active pickup spots, and customize contact details.</p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6 text-xs">
                {/* Gate switch */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-150/50">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Public Registrations Gate</h4>
                    <p className="text-slate-400 mt-0.5">Toggle whether the public registration portal is open to new corps members.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, registrationOpen: !settings.registrationOpen })}
                    className={`px-4 py-2 font-bold rounded-xl transition-all ${
                      settings.registrationOpen 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {settings.registrationOpen ? 'PORTAL ACTIVE (OPEN)' : 'PORTAL LOCKED (CLOSED)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Support Contact Telephone</label>
                      <input
                        type="text"
                        value={settings.supportPhone}
                        onChange={e => setSettings({ ...settings, supportPhone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Support Email Address</label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Campus / Training Hub Address</label>
                      <textarea
                        value={settings.campusAddress}
                        onChange={e => setSettings({ ...settings, campusAddress: e.target.value })}
                        className="w-full p-2.5 h-20 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Twitter Handle</label>
                      <input
                        type="text"
                        value={settings.socialTwitter}
                        onChange={e => setSettings({ ...settings, socialTwitter: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">LinkedIn Page</label>
                      <input
                        type="text"
                        value={settings.socialLinkedin}
                        onChange={e => setSettings({ ...settings, socialLinkedin: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Bus Driver Name</label>
                        <input
                          type="text"
                          value={settings.busDriverName}
                          onChange={e => setSettings({ ...settings, busDriverName: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">Bus Plate No</label>
                        <input
                          type="text"
                          value={settings.busPlateNo}
                          onChange={e => setSettings({ ...settings, busPlateNo: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => { alert('Olatech System configurations updated successfully.'); }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
                  >
                    Save Configuration Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 1: TEAM MANAGEMENT */}
          {activeTab === 'team' && (
            <div className="space-y-6" id="crm-tabview-team">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-sans flex items-center gap-2">
                    <Users className="text-emerald-600" size={22} />
                    Olatech School of Programming Staff & Team
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Super Admin workspace to register trainers, change roles, suspend/activate access, reset passwords, and audit account states.</p>
                </div>
                {currentStaff?.role === 'Super Admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStaffId(null);
                      setTeamFirstName('');
                      setTeamLastName('');
                      setTeamEmail('');
                      setTeamPhone('');
                      setTeamRole('Admissions Officer');
                      setTeamStatus('Active');
                      setTeamPassword('');
                      setTeamForceChange(false);
                      setTeamActionError('');
                      setShowAddStaffModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-98 transition-all cursor-pointer self-start md:self-center"
                  >
                    <Plus size={15} />
                    Register New Staff
                  </button>
                )}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-1 text-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Staff Accounts</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800">{staffList.length}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">In Database</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-1 text-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Staff</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600">{staffList.filter(s => s.status === 'Active').length}</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Authorized</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-1 text-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Suspended</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-red-600">{staffList.filter(s => s.status === 'Suspended').length}</span>
                    <span className="text-[10px] text-red-500 font-bold">Restricted</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-1 text-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Archived / Soft-Deleted</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-400">{staffList.filter(s => s.status === 'Archived' || s.deletedAt).length}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Recoverable</span>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center text-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={teamSearchQuery}
                    onChange={e => setTeamSearchQuery(e.target.value)}
                    placeholder="Search staff members by name, email, phone..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <select
                    value={teamRoleFilter}
                    onChange={e => setTeamRoleFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="All">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admissions Officer">Admissions Officer</option>
                    <option value="Operations Officer">Operations Officer</option>
                    <option value="Career Officer">Career Officer</option>
                    <option value="Finance Officer">Finance Officer</option>
                    <option value="Support Officer">Support Officer</option>
                  </select>
                  <select
                    value={teamStatusFilter}
                    onChange={e => setTeamStatusFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                {isStaffLoading ? (
                  <div className="p-12 text-center text-xs font-bold text-slate-400">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    Querying operational database...
                  </div>
                ) : filteredStaff.length === 0 ? (
                  <div className="p-12 text-center text-xs font-bold text-slate-400 space-y-2">
                    <Users className="mx-auto text-slate-300" size={32} />
                    <p>No operational staff members found matching the specified criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                          <th className="p-4">Name</th>
                          <th className="p-4">Operational Email & Phone</th>
                          <th className="p-4">System Role</th>
                          <th className="p-4">Account Status</th>
                          <th className="p-4">Last Authenticated</th>
                          {currentStaff?.role === 'Super Admin' && <th className="p-4 text-right">Administrative Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filteredStaff.map(staff => {
                          const isSoftDeleted = staff.deletedAt || staff.status === 'Archived';
                          return (
                            <tr key={staff.id} className={`hover:bg-slate-50/50 transition-colors ${isSoftDeleted ? 'opacity-60 bg-slate-50/20' : ''}`}>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                                    isSoftDeleted ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {(staff.firstName || staff.name || 'S')[0]}{(staff.lastName || '')[0]}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 text-sm">{staff.firstName || staff.name} {staff.lastName || ''}</p>
                                    {staff.forcePasswordChange && (
                                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-50 border border-amber-200 text-[9px] font-black uppercase text-amber-700 rounded-full animate-pulse">
                                        Forced Reset Pending
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-slate-800">{staff.email}</p>
                                <p className="text-slate-400 font-mono text-[10px]">{staff.phone || 'N/A'}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] tracking-wide uppercase ${
                                  staff.role === 'Super Admin' 
                                    ? 'bg-slate-900 text-white'
                                    : staff.role === 'Admissions Officer'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : staff.role === 'Operations Officer'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : staff.role === 'Career Officer'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {staff.role}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                                  staff.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : staff.status === 'Suspended'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {staff.status}
                                </span>
                              </td>
                              <td className="p-4 font-mono text-[10px] text-slate-400">
                                {staff.lastLogin 
                                  ? new Date(staff.lastLogin).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }) 
                                  : 'Never Logged In'}
                              </td>
                              {currentStaff?.role === 'Super Admin' && (
                                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                  {isSoftDeleted ? (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (confirm(`Are you sure you want to restore the staff account for ${staff.firstName || staff.name}?`)) {
                                          try {
                                            const res = await fetch(`/api/staff/${staff.id}`, {
                                              method: 'PUT',
                                              headers: { 
                                                'Content-Type': 'application/json',
                                                'x-admin-user': currentStaff.name,
                                                'x-admin-role': currentStaff.role
                                              },
                                              body: JSON.stringify({ status: 'Active', deletedAt: null })
                                            });
                                            if (res.ok) {
                                              alert('Staff account restored successfully!');
                                              setRefreshTrigger(prev => prev + 1);
                                            } else {
                                              alert('Failed to restore staff.');
                                            }
                                          } catch (err) {
                                            alert('Database error during restoration.');
                                          }
                                        }
                                      }}
                                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                                    >
                                      Restore Account
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingStaffId(staff.id);
                                          setTeamFirstName(staff.firstName || '');
                                          setTeamLastName(staff.lastName || '');
                                          setTeamEmail(staff.email);
                                          setTeamPhone(staff.phone || '');
                                          setTeamRole(staff.role);
                                          setTeamStatus(staff.status || 'Active');
                                          setTeamPassword('');
                                          setTeamForceChange(staff.forcePasswordChange || false);
                                          setTeamActionError('');
                                          setShowAddStaffModal(true);
                                        }}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setResetStaffId(staff.id);
                                          setResetNewPassword('');
                                          setResetForceChange(true);
                                          setShowResetModal(true);
                                        }}
                                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                                      >
                                        Reset Passcode
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const nextStatus = staff.status === 'Active' ? 'Suspended' : 'Active';
                                          try {
                                            const res = await fetch(`/api/staff/${staff.id}`, {
                                              method: 'PUT',
                                              headers: { 
                                                'Content-Type': 'application/json',
                                                'x-admin-user': currentStaff.name,
                                                'x-admin-role': currentStaff.role
                                              },
                                              body: JSON.stringify({ status: nextStatus })
                                            });
                                            if (res.ok) {
                                              setRefreshTrigger(prev => prev + 1);
                                            } else {
                                              alert('Failed to change status.');
                                            }
                                          } catch (err) {
                                            alert('Database error.');
                                          }
                                        }}
                                        className={`px-2.5 py-1 font-bold text-[10px] rounded-lg transition-colors cursor-pointer border ${
                                          staff.status === 'Active'
                                            ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                        }`}
                                      >
                                        {staff.status === 'Active' ? 'Suspend' : 'Activate'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          if (confirm(`Are you sure you want to soft-delete/archive the staff account for ${staff.firstName || staff.name}? This removes active access but keeps records in audit.`)) {
                                            try {
                                              const res = await fetch(`/api/staff/${staff.id}`, {
                                                method: 'DELETE',
                                                headers: { 
                                                  'Content-Type': 'application/json',
                                                  'x-admin-user': currentStaff.name,
                                                  'x-admin-role': currentStaff.role
                                                }
                                              });
                                              if (res.ok) {
                                                setRefreshTrigger(prev => prev + 1);
                                              } else {
                                                alert('Failed to delete staff.');
                                              }
                                            } catch (err) {
                                              alert('Database error during soft-delete.');
                                            }
                                          }
                                        }}
                                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                                      >
                                        Archive
                                      </button>
                                    </>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 2: CHRONOS AUDIT ENGINE */}
          {activeTab === 'audit' && (
            <div className="space-y-6" id="crm-tabview-audit">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-sans flex items-center gap-2">
                    <Shield className="text-emerald-600" size={22} />
                    Chronos Audit Logs Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time immutable ledger of operational changes, logins, settings modifications, and staff actions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  Refresh Audit Logs
                </button>
              </div>

              {/* Filters Panel */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center text-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={auditSearchQuery}
                    onChange={e => setAuditSearchQuery(e.target.value)}
                    placeholder="Search logs by staff name, action details, IP address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <select
                    value={auditTypeFilter}
                    onChange={e => setAuditTypeFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="All">All Event Types</option>
                    <option value="Staff Login">Staff Login</option>
                    <option value="Staff Logout">Staff Logout</option>
                    <option value="Staff Created">Staff Created</option>
                    <option value="Staff Updated">Staff Updated</option>
                    <option value="Staff Suspended">Staff Suspended</option>
                    <option value="Password Reset">Password Reset</option>
                    <option value="Failed Login">Failed Login</option>
                    <option value="Applicant Created">Applicant Created</option>
                    <option value="Applicant Updated">Applicant Updated</option>
                    <option value="Platform Setting Update">Platform Settings</option>
                  </select>
                  <select
                    value={auditStatusFilter}
                    onChange={e => setAuditStatusFilter(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                {filteredAudits.length === 0 ? (
                  <div className="p-12 text-center text-xs font-bold text-slate-400 space-y-2">
                    <Shield className="mx-auto text-slate-300 animate-pulse" size={32} />
                    <p>No audit logging activities match your filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                          <th className="p-4">Timestamp</th>
                          <th className="p-4">User Identity</th>
                          <th className="p-4">Event Type</th>
                          <th className="p-4">Action Summary</th>
                          <th className="p-4">IP Address</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filteredAudits.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900">{log.user}</span>
                                <span className="px-1.5 py-0.5 bg-slate-100 text-[9px] text-slate-500 rounded-md font-bold uppercase">
                                  {log.userRole}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md font-extrabold uppercase text-[9px] tracking-wide">
                                {log.eventType}
                              </span>
                            </td>
                            <td className="p-4 text-slate-800 font-medium">
                              {log.description}
                            </td>
                            <td className="p-4 font-mono text-[10px] text-slate-400">
                              {log.ipAddress || '197.210.64.' + (log.id % 255)}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                log.status === 'Success'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {log.status === 'Success' ? (
                                  <>
                                    <span className="w-1 h-1 bg-emerald-600 rounded-full animate-ping" />
                                    SUCCESS
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1 h-1 bg-red-600 rounded-full" />
                                    FAILED
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 3: COMMAND CENTER CONTENT MANAGEMENT WORKSPACE */}
          {activeTab === 'career' && (
            <div className="space-y-6" id="crm-tabview-career">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-sans flex items-center gap-2">
                    <Briefcase className="text-emerald-600" size={22} />
                    Olatech Content Management System (CMS)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Publish, edit, and update the live website content including recruitment placements, events, sponsors, CV templates, and success stories.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (careerSubTab === 'opportunities') setShowOppForm(true);
                      else if (careerSubTab === 'events') setShowEventForm(true);
                      else if (careerSubTab === 'partners') setShowPartnerForm(true);
                      else if (careerSubTab === 'resources') setShowResourceForm(true);
                      else if (careerSubTab === 'alumni') setShowAlumniForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={14} />
                    Add New Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* CMS Navigation Tabs */}
              <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
                {[
                  { id: 'opportunities', label: 'Placement Placements', icon: Briefcase },
                  { id: 'events', label: 'Upcoming Events', icon: Calendar },
                  { id: 'partners', label: 'Corporate Partners', icon: Users },
                  { id: 'resources', label: 'Downloadable Resources', icon: FileText },
                  { id: 'alumni', label: 'Success Spotlight', icon: TrendingUp }
                ].map(sub => {
                  const SubIcon = sub.icon;
                  const isActive = careerSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setCareerSubTab(sub.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
                        isActive 
                          ? 'border-emerald-600 text-emerald-600 font-extrabold' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <SubIcon size={14} />
                      {sub.label}
                    </button>
                  );
                })}
              </div>

              {/* CONDITIONAL SUBTAB 1: OPPORTUNITIES */}
              {careerSubTab === 'opportunities' && (
                <div className="space-y-4">
                  {/* List / Table */}
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                          <th className="p-4">Title / Company</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Stipend</th>
                          <th className="p-4">Skills Requested</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {careerOpps.map(opp => (
                          <tr key={opp.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4">
                              <span className="font-extrabold text-slate-900 block text-sm">{opp.title}</span>
                              <span className="text-emerald-600 text-xs font-bold block">{opp.company}</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold uppercase text-[9px]">
                                {opp.category}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-slate-500">{opp.location}</td>
                            <td className="p-4 text-slate-800 font-bold">{opp.stipend}</td>
                            <td className="p-4 max-w-xs truncate text-slate-400">
                              {(Array.isArray(opp.skills) ? opp.skills : String(opp.skills || '').split(',')).map((s: string) => s.trim()).filter(Boolean).join(', ')}
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingOpp(opp);
                                  setOppTitle(opp.title);
                                  setOppCompany(opp.company);
                                  setOppCategory(opp.category);
                                  setOppStipend(opp.stipend);
                                  setOppLocation(opp.location);
                                  setOppDeadline(opp.deadline);
                                  setOppDescription(opp.description);
                                  setOppSkills(Array.isArray(opp.skills) ? opp.skills.join(', ') : opp.skills || '');
                                  setOppFeatured(opp.featured || false);
                                  setShowOppForm(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this placement opportunity?')) {
                                    try {
                                      const res = await fetch(`/api/jobs/${opp.id}`, { method: 'DELETE' });
                                      const json = await res.json();
                                      if (json.success) {
                                        setCareerOpps(prev => prev.filter(o => o.id !== opp.id));
                                        triggerAuditLog('Deleted career opportunity ID: ' + opp.id, 'Career Hub');
                                        alert('Opportunity deleted successfully!');
                                      } else {
                                        alert('Failed to delete: ' + json.error);
                                      }
                                    } catch (err) {
                                      alert('Network error during deletion.');
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Form Modal */}
                  {showOppForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-slate-700">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">{editingOpp ? 'Edit' : 'Add New'} Placement Opportunity</h4>
                          <button onClick={() => { setShowOppForm(false); setEditingOpp(null); }} className="p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSaveOpp} className="space-y-3.5 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Job Title</label>
                              <input type="text" required value={oppTitle} onChange={e => setOppTitle(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Junior Cybersecurity Engineer" />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Company Name</label>
                              <input type="text" required value={oppCompany} onChange={e => setOppCompany(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Sterling Bank" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Category</label>
                              <select value={oppCategory} onChange={e => setOppCategory(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none">
                                <option value="Internships">Internships</option>
                                <option value="Remote Jobs">Remote Jobs</option>
                                <option value="Bootcamps">Bootcamps</option>
                                <option value="Scholarships">Scholarships</option>
                                <option value="Tech Competitions">Tech Competitions</option>
                                <option value="Graduate Programs">Graduate Programs</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Location</label>
                              <input type="text" required value={oppLocation} onChange={e => setOppLocation(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Lagos (Hybrid) or Remote" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Compensation / Stipend</label>
                              <input type="text" value={oppStipend} onChange={e => setOppStipend(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. ₦150,000 / month" />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Deadline Date</label>
                              <input type="text" value={oppDeadline} onChange={e => setOppDeadline(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. July 25, 2026" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">Skills Required (comma separated)</label>
                            <input type="text" value={oppSkills} onChange={e => setOppSkills(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Python, SQL, Git" />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">Job Description</label>
                            <textarea value={oppDescription} onChange={e => setOppDescription(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="Enter roles, requirements, and objectives..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="oppFeatured" checked={oppFeatured} onChange={e => setOppFeatured(e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" />
                            <label htmlFor="oppFeatured" className="font-bold cursor-pointer">Feature on Dashboard Spotlight</label>
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button type="button" onClick={() => { setShowOppForm(false); setEditingOpp(null); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm">Save Placements</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONDITIONAL SUBTAB 2: EVENTS */}
              {careerSubTab === 'events' && (
                <StaffEventsManagementModule 
                  showEventForm={showEventForm} 
                  setShowEventForm={setShowEventForm} 
                  triggerAuditLog={triggerAuditLog} 
                />
              )}

              {/* CONDITIONAL SUBTAB 3: PARTNERS */}
              {careerSubTab === 'partners' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                          <th className="p-4">Partner Name</th>
                          <th className="p-4">Sponsorship Role Type</th>
                          <th className="p-4">Logo Icon Indicator</th>
                          <th className="p-4">Description</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {careerPartners.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 font-extrabold text-slate-900 text-sm">{p.name}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold uppercase text-[9px]">
                                {p.type}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[10px] text-slate-500">{p.logo}</td>
                            <td className="p-4 max-w-xs truncate text-slate-500">{p.desc}</td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingPartner(p);
                                  setPartName(p.name);
                                  setPartType(p.type);
                                  setPartLogo(p.logo);
                                  setPartDesc(p.desc);
                                  setShowPartnerForm(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this partner?')) {
                                    try {
                                      const res = await fetch(`/api/employer-partners/${p.id}`, { method: 'DELETE' });
                                      const json = await res.json();
                                      if (json.success) {
                                        setCareerPartners(prev => prev.filter(x => x.id !== p.id));
                                        triggerAuditLog('Deleted employer partner ID: ' + p.id, 'Career Hub');
                                        alert('Partner deleted successfully!');
                                      } else {
                                        alert('Failed to delete: ' + json.error);
                                      }
                                    } catch (err) {
                                      alert('Network error.');
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {showPartnerForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-slate-700">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">{editingPartner ? 'Edit' : 'Add New'} Employer Partner</h4>
                          <button onClick={() => { setShowPartnerForm(false); setEditingPartner(null); }} className="p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSavePartner} className="space-y-3.5 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold">Partner Name</label>
                            <input type="text" required value={partName} onChange={e => setPartName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Interswitch Group" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Partner Type</label>
                              <select value={partType} onChange={e => setPartType(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none">
                                <option value="Recruitment Partner">Recruitment Partner</option>
                                <option value="Sponsor Partner">Sponsor Partner</option>
                                <option value="Government Partner">Government Partner</option>
                                <option value="Curriculum Endorser">Curriculum Endorser</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Logo Placeholder Label</label>
                              <input type="text" required value={partLogo} onChange={e => setPartLogo(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. interswitch" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">Partner Description</label>
                            <textarea value={partDesc} onChange={e => setPartDesc(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="Brief partnership scope..." />
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button type="button" onClick={() => { setShowPartnerForm(false); setEditingPartner(null); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm">Save Partner</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONDITIONAL SUBTAB 4: RESOURCES */}
              {careerSubTab === 'resources' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                          <th className="p-4">Resource Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Metadata Tag</th>
                          <th className="p-4">Vector Icon</th>
                          <th className="p-4">Download Link</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {careerResources.map(res => (
                          <tr key={res.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 font-extrabold text-slate-900 text-sm">{res.title}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold uppercase text-[9px]">
                                {res.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500">{res.tag}</td>
                            <td className="p-4 font-mono text-[10px] text-slate-400">{res.icon}</td>
                            <td className="p-4 font-mono text-slate-500 truncate max-w-xs">{res.link === '#' || !res.link ? `/api/career-resources/download?id=${res.id}` : res.link}</td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={async () => {
                                  try {
                                    const resCall = await fetch(`/api/career-resources/download?id=${res.id}&title=${encodeURIComponent(res.title)}&type=${encodeURIComponent(res.category)}&format=json`);
                                    const data = await resCall.json();
                                    if (data && data.success && data.content) {
                                      const blob = new Blob([data.content], { type: data.contentType || 'text/markdown;charset=utf-8' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = data.filename || `${res.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                      triggerAuditLog('Downloaded resource: ' + res.title, 'Career Hub');
                                      return;
                                    }
                                    throw new Error('Failed');
                                  } catch (e) {
                                    alert('Failed to download document.');
                                  }
                                }}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => {
                                  setEditingResource(res);
                                  setResTitle(res.title);
                                  setResCategory(res.category);
                                  setResTag(res.tag);
                                  setResIcon(res.icon);
                                  setResDesc(res.description || '');
                                  setResLink(res.link);
                                  setShowResourceForm(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this resource?')) {
                                    try {
                                      const resCall = await fetch(`/api/career-resources/${res.id}`, { method: 'DELETE' });
                                      const json = await resCall.json();
                                      if (json.success) {
                                        setCareerResources(prev => prev.filter(r => r.id !== res.id));
                                        triggerAuditLog('Deleted career resource ID: ' + res.id, 'Career Hub');
                                        alert('Resource deleted successfully!');
                                      } else {
                                        alert('Failed to delete: ' + json.error);
                                      }
                                    } catch (err) {
                                      alert('Network error.');
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {showResourceForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-slate-700">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">{editingResource ? 'Edit' : 'Add New'} Downloadable Resource</h4>
                          <button onClick={() => { setShowResourceForm(false); setEditingResource(null); }} className="p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSaveResource} className="space-y-3.5 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold">Resource Title</label>
                            <input type="text" required value={resTitle} onChange={e => setResTitle(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Olatech ATS Cybersecurity CV Template" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Category</label>
                              <select value={resCategory} onChange={e => setResCategory(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none">
                                <option value="CV Templates">CV Templates</option>
                                <option value="Guides">Guides</option>
                                <option value="Syllabus Sheets">Syllabus Sheets</option>
                                <option value="Manuals">Manuals</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Format Tag</label>
                              <input type="text" required value={resTag} onChange={e => setResTag(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. DOCX • FREE" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Lucide Vector Icon Name</label>
                              <input type="text" required value={resIcon} onChange={e => setResIcon(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. FileText, BookOpen" />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Download Relative Link</label>
                              <input type="text" required value={resLink} onChange={e => setResLink(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="/api/downloads/cv-template" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">Resource Description</label>
                            <textarea value={resDesc} onChange={e => setResDesc(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="What will the student gain from downloading this file?..." />
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button type="button" onClick={() => { setShowResourceForm(false); setEditingResource(null); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm">Save Resource</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONDITIONAL SUBTAB 5: ALUMNI SUCCESS STORY */}
              {careerSubTab === 'alumni' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                          <th className="p-4">Alumni Name / Role</th>
                          <th className="p-4">Hired Company</th>
                          <th className="p-4">Starting Salary</th>
                          <th className="p-4">Service Year Batch</th>
                          <th className="p-4">Self-Description Quote</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {careerAlumni.map(al => (
                          <tr key={al.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4">
                              <span className="font-extrabold text-slate-900 block text-sm">{al.name}</span>
                              <span className="text-slate-500 text-xs block">{al.role}</span>
                            </td>
                            <td className="p-4 font-bold text-emerald-700">{al.company}</td>
                            <td className="p-4 font-extrabold text-slate-800">{al.salary}</td>
                            <td className="p-4">{al.batch}</td>
                            <td className="p-4 max-w-xs truncate text-slate-400">{al.before} → {al.training}</td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingAlumni(al);
                                  setAlName(al.name);
                                  setAlRole(al.role);
                                  setAlCompany(al.company);
                                  setAlBatch(al.batch);
                                  setAlSalary(al.salary);
                                  setAlImage(al.image);
                                  setAlBefore(al.before || '');
                                  setAlTraining(al.training || '');
                                  setAlChallenges(al.challenges || '');
                                  setAlProject(al.project || '');
                                  setAlAdvice(al.advice || '');
                                  setShowAlumniForm(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this success spotlight?')) {
                                    try {
                                      const res = await fetch(`/api/success-stories/${al.id}`, { method: 'DELETE' });
                                      const json = await res.json();
                                      if (json.success) {
                                        setCareerAlumni(prev => prev.filter(x => x.id !== al.id));
                                        triggerAuditLog('Deleted success spotlight ID: ' + al.id, 'Career Hub');
                                        alert('Spotlight deleted successfully!');
                                      } else {
                                        alert('Failed to delete: ' + json.error);
                                      }
                                    } catch (err) {
                                      alert('Network error.');
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {showAlumniForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 text-slate-700 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">{editingAlumni ? 'Edit' : 'Add New'} Success Spotlight</h4>
                          <button onClick={() => { setShowAlumniForm(false); setEditingAlumni(null); }} className="p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSaveAlumni} className="space-y-3.5 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Alumni Full Name</label>
                              <input type="text" required value={alName} onChange={e => setAlName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Chinedu Okafor" />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Assigned Tech Role</label>
                              <input type="text" required value={alRole} onChange={e => setAlRole(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Junior Devops Associate" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">Hiring Employer Partner</label>
                              <input type="text" required value={alCompany} onChange={e => setAlCompany(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Sterling Bank Plc" />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Starting Salary</label>
                              <input type="text" required value={alSalary} onChange={e => setAlSalary(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. ₦350,000 / month" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold">NYSC Batch / Stream</label>
                              <input type="text" required value={alBatch} onChange={e => setAlBatch(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. 2025 Batch B Stream II" />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold">Avatar Image URL (Optional)</label>
                              <input type="text" value={alImage} onChange={e => setAlImage(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="Unsplash image link" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">State of Affairs BEFORE Joining Olatech</label>
                            <input type="text" value={alBefore} onChange={e => setAlBefore(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Had zero programming background and zero laptop familiarity..." />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">The Olatech Training Experience</label>
                            <input type="text" value={alTraining} onChange={e => setAlTraining(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. Rigorous 12-week bootcamps compiling active react logs..." />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold">Graduation Career Advice Quote</label>
                            <textarea value={alAdvice} onChange={e => setAlAdvice(e.target.value)} rows={3} className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="What key advice do you have for active corps members?..." />
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button type="button" onClick={() => { setShowAlumniForm(false); setEditingAlumni(null); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-sm">Save Spotlight</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODULE 5: RECRUITMENT INTELLIGENCE QUEUE WORKSPACE */}
          {activeTab === 'recruitment' && (
            <div className="space-y-6" id="crm-tabview-recruitment">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-sans flex items-center gap-2">
                
                    Olatech AI Recruitment Intelligence Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Discover, audit, and monitor external tech graduate programs, internships, and opportunities.
                    <strong> Olatech remains the final authority for publishing.</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsTriggeringExpiry(true);
                      try {
                        const res = await fetch('/api/recruitment/expiry/trigger', { method: 'POST' });
                        const json = await res.json();
                        setIsTriggeringExpiry(false);
                        if (json.success) {
                          handleRefresh();
                          alert(json.message);
                        }
                      } catch (err) {
                        setIsTriggeringExpiry(false);
                        alert('Error running expiry verification.');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Clock size={14} className={isTriggeringExpiry ? 'animate-spin' : ''} />
                    Verify Expired Roles
                  </button>
                  <button
                    type="button"
                    id="btn-recruitment-refresh"
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    Refresh Intelligence Queue
                  </button>
                </div>
              </div>

              {/* SUB-TAB NAVIGATION BAR */}
              <div className="flex border-b border-slate-100 gap-1 overflow-x-auto pb-px">
                {[
                  { id: 'opportunities', label: 'Opportunities Queue', icon: Briefcase },
                  { id: 'scheduler', label: 'Automated Scheduler', icon: Clock },
                  { id: 'employers', label: 'Employer Intelligence', icon: Users },
                  { id: 'changes', label: 'Audit & Change Logs', icon: Activity },
                  { id: 'duplicates', label: 'Duplicate Intelligence', icon: Shield },
                  { id: 'notifications', label: 'Operational Notifications', icon: Bell }
                ].map((t) => {
                  const active = recruitmentSubTab === t.id;
                  const Icon = t.icon;
                  let count = 0;
                  if (t.id === 'opportunities') count = recruitmentOpps.length;
                  if (t.id === 'changes') count = changeLogs.length;
                  if (t.id === 'duplicates') count = duplicateHistory.length;
                  if (t.id === 'notifications') count = recruitmentNotifications.filter(n => !n.isRead).length;

                  return (
                    <button
                      key={t.id}
                      id={`sub-tab-btn-${t.id}`}
                      onClick={() => setRecruitmentSubTab(t.id as any)}
                      className={`px-5 py-3 border-b-2 text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        active
                          ? 'border-emerald-600 text-emerald-700 font-extrabold'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                      }`}
                    >
                      <Icon size={14} className={active ? 'text-emerald-600' : 'text-slate-400'} />
                      <span>{t.label}</span>
                      {count > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                          active 
                            ? (t.id === 'notifications' ? 'bg-red-500 text-white' : 'bg-emerald-100 text-emerald-800') 
                            : (t.id === 'notifications' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600')
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* RENDER ACTIVE RECRUITMENT SUB-TAB */}
              {recruitmentSubTab === 'opportunities' && (
                <div className="space-y-6">
                  {/* BENTO GRID: AI RECRUITMENT discovery scan panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 1. DISCOVERY SCAN PANEL */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                          
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">AI Placement Discovery Scan</span>
                        </div>
                        
                        <div>
                          <h4 className="text-base font-extrabold tracking-tight">Run Live Recruitment Discovery Scan</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                            Select a trusted opportunity source from the registry. Our AI agent will scan the target platform, capture active developer job openings, audit their application forms, and classify them.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5 text-slate-200">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registry Opportunity Source</label>
                            <select
                              value={selectedScanSource ? selectedScanSource.id : ''}
                              onChange={(e) => {
                                const found = recruitmentSources.find(s => s.id === parseInt(e.target.value, 10));
                                if (found) setSelectedScanSource(found);
                              }}
                              className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              {recruitmentSources.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.url})</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5 text-slate-200">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Category</label>
                            <select
                              value={selectedScanCategory}
                              onChange={(e) => setSelectedScanCategory(e.target.value)}
                              className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              {SUPPORTED_OPPORTUNITY_CATEGORIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-800 mt-6 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Globe size={12} className="text-emerald-500" />
                          <span>Scanner Engine Ready</span>
                        </div>
                        
                        <button
                          type="button"
                          id="btn-trigger-ai-scan"
                          disabled={isDiscovering || !selectedScanSource}
                          onClick={async () => {
                            if (!selectedScanSource) return;
                            setIsDiscovering(true);
                            try {
                              const res = await fetch('/api/recruitment/discover', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  sourceName: selectedScanSource.name,
                                  sourceUrl: selectedScanSource.url
                                })
                              });
                              const json = await res.json();
                              setIsDiscovering(false);
                              if (json.success) {
                                handleRefresh();
                                alert(json.message || 'Discovery scan completed successfully!');
                              } else {
                                alert(json.error || 'Discovery scan failed.');
                              }
                            } catch (err) {
                              setIsDiscovering(false);
                              alert('Database or API error triggering AI Discovery scan.');
                            }
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          {isDiscovering ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>AI Scanning & Auditing...</span>
                            </>
                          ) : (
                            <>
                              
                              <span>Trigger AI Discovery Agent</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 2. REGISTRY STATS & SUMMARY */}
                    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs flex flex-col justify-between text-slate-800">
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Registry Overview</span>
                        <h4 className="text-sm font-black text-slate-900">Recruitment Registry Databases</h4>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold block">Trusted Sources</span>
                            <span className="text-xl font-black text-slate-800 block mt-1">{recruitmentSources.length}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold block">Categories</span>
                            <span className="text-xl font-black text-slate-800 block mt-1">{recruitmentCategories.length}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] rounded-xl flex items-start gap-2 leading-relaxed">
                          <Info size={14} className="mt-0.5 shrink-0" />
                          <div>
                            <strong>Strict Safety Mandate:</strong> Discovered postings undergo automated structural security checking. Suspicious pages are auto-quarantined into "Pending Review" tab.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        id="btn-add-custom-discovery"
                        onClick={() => {
                          setOppFormTitle('');
                          setOppFormCompany('');
                          setOppFormDesc('');
                          setOppFormLoc('');
                          setOppFormRemote('Remote');
                          setOppFormSalary('₦150,000 / month');
                          setOppFormSkills('');
                          setOppFormUrl('https://');
                          setOppFormDeadline('');
                          if (recruitmentSources.length > 0) setOppFormSourceId(recruitmentSources[0].id);
                          if (recruitmentCategories.length > 0) setOppFormCategoryId(recruitmentCategories[0].id);
                          setOppFormExperience('Entry-level');
                          setShowAddOppModal(true);
                        }}
                        className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        Draft Custom Placement
                      </button>
                    </div>

                  </div>

                  {/* QUEUE NAVIGATION & FILTER BAR */}
                  <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-center gap-4 text-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      {(['Verified', 'Pending Review', 'Published', 'Rejected', 'Archived'] as const).map((tab) => {
                        const active = recruitmentQueueTab === tab;
                        const count = recruitmentOpps.filter(o => o.publication?.publicationStatus === tab).length;
                        
                        return (
                          <button
                            key={tab}
                            id={`queue-tab-${tab.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                            onClick={() => setRecruitmentQueueTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              active
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150'
                            }`}
                          >
                            <span>{tab} Queue</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${active ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Ingestion Engine Log Live</span>
                    </div>
                  </div>

                  {/* RECRUITMENT OPPORTUNITIES QUEUE LIST */}
                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs text-slate-800">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        {recruitmentQueueTab} Placements ({recruitmentOpps.filter(o => o.publication?.publicationStatus === recruitmentQueueTab).length})
                      </h4>
                      <span className="text-[11px] text-slate-400 italic">Olatech Staff is final approval authority</span>
                    </div>

                    {recruitmentOpps.filter(o => o.publication?.publicationStatus === recruitmentQueueTab).length === 0 ? (
                      <div className="p-16 text-center text-slate-400 space-y-2">
                        
                        <p className="font-bold text-slate-500 text-sm">No placements in this queue</p>
                        <p className="text-xs max-w-sm mx-auto leading-relaxed">
                          Select a registry source above and trigger the AI agent, or draft a placement manually to populate this queue.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                              <th className="px-6 py-4">Opportunity</th>
                              <th className="px-6 py-4">Verification Audits</th>
                              <th className="px-6 py-4">Classification</th>
                              <th className="px-6 py-4">Confidence</th>
                              <th className="px-6 py-4">Quality Rating</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans font-semibold">
                            {recruitmentOpps
                              .filter(o => o.publication?.publicationStatus === recruitmentQueueTab)
                              .map((opp) => {
                                const ver = opp.verification;
                                const score = ver?.confidenceScore || opp.confidenceScore || 0.0;
                                const ratingColor = score >= 0.85 ? 'text-emerald-600 bg-emerald-50' : score >= 0.70 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
                                
                                // Quality Score badges
                                const qScore = opp.qualityScore ?? 70.0;
                                const qGrade = opp.qualityGrade ?? "Good";
                                const qColor = qScore >= 90 ? 'text-purple-600 bg-purple-50 border-purple-100' : qScore >= 75 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : qScore >= 60 ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-slate-600 bg-slate-50 border-slate-100';

                                return (
                                  <tr key={opp.id} className="hover:bg-slate-50/40 transition-all">
                                    <td className="px-6 py-4 max-w-sm">
                                      <div className="space-y-1">
                                        <span className="font-black text-slate-900 text-sm block leading-snug">{opp.jobTitle}</span>
                                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                                          <span className="text-emerald-700 font-black">{opp.employer.name}</span>
                                          <span>·</span>
                                          <span>{opp.location}</span>
                                          <span>·</span>
                                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-extrabold text-[9px]">{opp.remoteStatus}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                          <span className="flex items-center gap-1 text-[10px]">
                                            {ver?.isActivePage ? (
                                              <CheckCircle2 size={11} className="text-emerald-500" />
                                            ) : (
                                              <XCircle size={11} className="text-red-400" />
                                            )}
                                            <span className="font-bold text-slate-500">Live Web Page</span>
                                          </span>
                                          <span className="flex items-center gap-1 text-[10px]">
                                            {ver?.isValidDeadline ? (
                                              <CheckCircle2 size={11} className="text-emerald-500" />
                                            ) : (
                                              <XCircle size={11} className="text-red-400" />
                                            )}
                                            <span className="font-bold text-slate-500">Valid Deadline</span>
                                          </span>
                                          <span className="flex items-center gap-1 text-[10px]">
                                            {ver?.isTrustedSource ? (
                                              <CheckCircle2 size={11} className="text-emerald-500" />
                                            ) : (
                                              <XCircle size={11} className="text-red-400" />
                                            )}
                                            <span className="font-bold text-slate-500">Trusted Source</span>
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium italic truncate max-w-xs">{ver?.notes || 'No notes compiled.'}</div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1">
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-black inline-block">
                                          {opp.category.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5">
                                          Technology: {ver?.verifiedTechnology || 'General Tech'}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded-xl font-mono text-xs font-extrabold ${ratingColor}`}>
                                        {(score * 100).toFixed(0)}% Match
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="space-y-1">
                                        <span className={`px-2 py-0.5 border rounded-lg text-[10px] font-black inline-block ${qColor}`}>
                                          {qGrade}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-extrabold block mt-0.5">
                                          Score: {qScore}/100
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <div className="flex justify-end gap-1.5 items-center">
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            setTimelineModalOppId(opp.id);
                                            try {
                                              const res = await fetch(`/api/recruitment/opportunities/${opp.id}/timeline`);
                                              const json = await res.json();
                                              if (json.success) {
                                                setSelectedOppTimeline(json.data || []);
                                                setShowTimelineModal(true);
                                              }
                                            } catch (err) {
                                              alert('Error retrieving opportunity timeline.');
                                            }
                                          }}
                                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                          title="Inspect Timeline Logs"
                                        >
                                          <Activity size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          id={`btn-opp-preview-${opp.id}`}
                                          onClick={() => setPreviewOpp(opp)}
                                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                          title="Preview & AI Justification"
                                        >
                                          <Eye size={14} />
                                        </button>
                                        
                                        <button
                                          type="button"
                                          id={`btn-opp-edit-${opp.id}`}
                                          onClick={() => {
                                            setOppEditId(opp.id);
                                            setOppFormTitle(opp.jobTitle);
                                            setOppFormCompany(opp.employer.name);
                                            setOppFormDesc(opp.description);
                                            setOppFormLoc(opp.location);
                                            setOppFormRemote(opp.remoteStatus);
                                            setOppFormSalary(opp.salary || '');
                                            setOppFormSkills(opp.requiredSkills);
                                            setOppFormUrl(opp.officialUrl);
                                            setOppFormDeadline(opp.applicationDeadline || '');
                                            setOppFormSourceId(opp.sourceId);
                                            setOppFormCategoryId(opp.categoryId);
                                            setOppFormExperience(opp.experienceLevel || 'Entry-level');
                                            setShowEditOppModal(true);
                                          }}
                                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                          title="Edit Placement"
                                        >
                                          <Sliders size={14} />
                                        </button>

                                        {opp.publication?.publicationStatus !== 'Published' && (
                                          <button
                                            type="button"
                                            id={`btn-opp-publish-${opp.id}`}
                                            onClick={async () => {
                                              if (!confirm("Are you sure you want to approve and publish this placement? This will mirror it instantly on the public careers board.")) return;
                                              try {
                                                const res = await fetch(`/api/recruitment/opportunities/${opp.id}/publish`, {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ status: 'Published', staffEmail: currentStaff?.email })
                                                });
                                                if (res.ok) {
                                                  handleRefresh();
                                                  alert('Successfully published to public site job board!');
                                                } else {
                                                  alert('Error publishing placement.');
                                                }
                                              } catch (err) {
                                                alert('Database sync failure.');
                                              }
                                            }}
                                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                                          >
                                            <CheckCircle2 size={11} /> Approve & Publish
                                          </button>
                                        )}

                                        {opp.publication?.publicationStatus !== 'Rejected' && opp.publication?.publicationStatus !== 'Published' && (
                                          <button
                                            type="button"
                                            id={`btn-opp-reject-${opp.id}`}
                                            onClick={async () => {
                                              if (!confirm("Reject this placement draft?")) return;
                                              try {
                                                const res = await fetch(`/api/recruitment/opportunities/${opp.id}/publish`, {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ status: 'Rejected', staffEmail: currentStaff?.email })
                                                });
                                                if (res.ok) handleRefresh();
                                              } catch (err) {
                                                console.error(err);
                                              }
                                            }}
                                            className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors cursor-pointer"
                                            title="Reject Placement"
                                          >
                                            <XCircle size={14} />
                                          </button>
                                        )}

                                        {opp.publication?.publicationStatus !== 'Archived' && (
                                          <button
                                            type="button"
                                            id={`btn-opp-archive-${opp.id}`}
                                            onClick={async () => {
                                              if (!confirm("Archive this placement?")) return;
                                              try {
                                                const res = await fetch(`/api/recruitment/opportunities/${opp.id}/publish`, {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ status: 'Archived', staffEmail: currentStaff?.email })
                                                });
                                                if (res.ok) handleRefresh();
                                              } catch (err) {
                                                console.error(err);
                                              }
                                            }}
                                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                                            title="Archive Placement"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 1 — Automated Discovery Scheduler Control Panel */}
              {recruitmentSubTab === 'scheduler' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Interval Setup Card */}
                    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs space-y-4 text-slate-800">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Scheduler Settings</span>
                      <h4 className="text-base font-black text-slate-900">Configurable Discovery Interval</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Configure how frequently the automated background agent runs. It scans all active registry sources, detects updates, merges duplicates, and creates pending reviews.
                      </p>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Scan Frequency</label>
                        <div className="flex gap-2">
                          {[6, 12, 24].map((hours) => (
                            <button
                              key={hours}
                              onClick={() => setSchedulerIntervalInput(hours)}
                              className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                                schedulerIntervalInput === hours
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {hours} Hours
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          setIsUpdatingScheduler(true);
                          try {
                            const res = await fetch('/api/recruitment/scheduler', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ intervalHours: schedulerIntervalInput })
                            });
                            const json = await res.json();
                            setIsUpdatingScheduler(false);
                            if (json.success) {
                              setSchedulerState(json.data);
                              alert('Discovery interval updated successfully!');
                            }
                          } catch (err) {
                            setIsUpdatingScheduler(false);
                            alert('Failed to update interval.');
                          }
                        }}
                        disabled={isUpdatingScheduler}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        {isUpdatingScheduler ? 'Saving...' : 'Save Scheduler Settings'}
                      </button>
                    </div>

                    {/* Operational Metrics Display */}
                    <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">System Live Status</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            ACTIVE
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold">Scheduler Discovery Statistics</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Last Scan</span>
                            <span className="text-xs font-black text-slate-100 block mt-1">
                              {schedulerState?.lastScan ? new Date(schedulerState.lastScan).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Never'}
                            </span>
                          </div>
                          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Next Scan</span>
                            <span className="text-xs font-black text-slate-100 block mt-1 text-emerald-400">
                              {schedulerState?.nextScheduledScan ? new Date(schedulerState.nextScheduledScan).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Pending'}
                            </span>
                          </div>
                          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Duration</span>
                            <span className="text-xs font-black text-slate-100 block mt-1">
                              {schedulerState?.scanDurationMs ? `${(schedulerState.scanDurationMs / 1000).toFixed(1)}s` : '0.0s'}
                            </span>
                          </div>
                          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Sources Checked</span>
                            <span className="text-xs font-black text-slate-100 block mt-1">
                              {schedulerState?.sourcesChecked ?? 0} Checked
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-800/30 border border-slate-700/40 p-4 rounded-2xl text-center space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">New Jobs Found</span>
                            <span className="text-lg font-black text-emerald-400 block">{schedulerState?.newOpportunitiesFound ?? 0} Placements</span>
                          </div>
                          <div className="bg-slate-800/30 border border-slate-700/40 p-4 rounded-2xl text-center space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">Duplicates Ignored</span>
                            <span className="text-lg font-black text-amber-400 block">{schedulerState?.duplicatesIgnored ?? 0} Ignored</span>
                          </div>
                          <div className="bg-slate-800/30 border border-slate-700/40 p-4 rounded-2xl text-center space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">Audit Failures</span>
                            <span className="text-lg font-black text-red-400 block">{schedulerState?.verificationFailures ?? 0} Flagged</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">Trigger manual scheduler discovery cycle immediately</span>
                        <button
                          type="button"
                          onClick={async () => {
                            setIsDiscovering(true);
                            try {
                              const res = await fetch('/api/recruitment/scheduler/trigger', { method: 'POST' });
                              const json = await res.json();
                              setIsDiscovering(false);
                              if (json.success) {
                                handleRefresh();
                                alert('Manual scheduler cycle completed! New opportunities submitted to reviews.');
                              }
                            } catch (err) {
                              setIsDiscovering(false);
                              alert('Error triggering scheduler scan.');
                            }
                          }}
                          disabled={isDiscovering}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <RefreshCw size={12} className={isDiscovering ? 'animate-spin' : ''} />
                          Force Ingestion Sweep Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scheduler logs summary audit */}
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-slate-800 space-y-4">
                    <h4 className="text-sm font-black text-slate-900">Automation & Scheduling Report Summary</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      CorpersTech's career Board scheduler operates as an autonomous worker background thread within Cloud Run environment containers. By running continuous sweeps against trusted tech portals, it ensures high-relevance graduate placements are ingested dynamically into review queues.
                    </p>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>All background systems healthy and active. Connected to local database.</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase">SECURE SHELL AGENT READY</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 5 — Employer Intelligence Profiles */}
              {recruitmentSubTab === 'employers' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-slate-800 space-y-2">
                    <h4 className="text-sm font-black text-slate-900">Employer Intelligence Profiles Registry</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Automatically parsed and constructed from discovered opportunities. Profiles track hiring behavior, stipend ratios, and technical stacks to verify placement security and legitimacy.
                    </p>
                  </div>

                  {employerProfiles.length === 0 ? (
                    <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center text-slate-400">
                      <Users size={36} className="mx-auto text-slate-200 mb-2" />
                      <p className="font-bold text-slate-500">No employer intelligence profile data</p>
                      <p className="text-xs">Run an AI scan or add opportunities to construct company matrices.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {employerProfiles.map((emp) => {
                        return (
                          <div key={emp.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-slate-800 space-y-4 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="font-black text-slate-900 text-base block">{emp.name}</span>
                                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                                  {emp.industry || 'Technology'}
                                </span>
                              </div>
                              <span className="px-2 py-1 bg-slate-50 border border-slate-100 font-mono text-xs font-bold rounded-xl flex items-center gap-1 text-slate-700">
                                ⭐ {emp.confidenceRating || '4.5'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-3.5 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Region / Country</span>
                                <span className="font-extrabold text-slate-800 mt-1 block">{emp.country || 'Nigeria'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Hiring Frequency</span>
                                <span className="font-extrabold text-slate-800 mt-1 block">{emp.averageHiringFrequency || 'Monthly'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Remote Ratio</span>
                                <span className="font-extrabold text-slate-800 mt-1 block text-emerald-600">
                                  {((emp.remoteHiringRatio || 0.0) * 100).toFixed(0)}% Remote
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] font-bold uppercase">Graduate Ratio</span>
                                <span className="font-extrabold text-slate-800 mt-1 block text-purple-600">
                                  {((emp.graduateHiringRatio || 0.0) * 100).toFixed(0)}% Youth Trainee
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Core Technology Areas</span>
                              <div className="flex flex-wrap gap-1">
                                {(emp.technologyAreas || 'Software Engineering').split(',').map((tech: string, i: number) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-600 font-bold text-[9px]">
                                    {tech.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Published Openings</span>
                              <span className="text-sm font-black text-slate-900">{emp.opportunitiesPublished || 0} Roles</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 2 — Audit & Change Logs */}
              {recruitmentSubTab === 'changes' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-slate-800 space-y-2">
                    <h4 className="text-sm font-black text-slate-900">Placement Ingest Change Logs</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Continuous changes are monitored and tracked inside our database registry. This tracks deadline updates, salary stipend adjustments, and location updates for audit.
                    </p>
                  </div>

                  {changeLogs.length === 0 ? (
                    <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center text-slate-400">
                      <Activity size={36} className="mx-auto text-slate-200 mb-2 animate-pulse" />
                      <p className="font-bold text-slate-500">No career placement updates logged</p>
                      <p className="text-xs">Continuous crawler monitoring will output logged changes here.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs text-slate-800">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                              <th className="px-6 py-4">Opportunity</th>
                              <th className="px-6 py-4">Employer Company</th>
                              <th className="px-6 py-4">Field Changed</th>
                              <th className="px-6 py-4">Previous Value</th>
                              <th className="px-6 py-4">Updated Value</th>
                              <th className="px-6 py-4">AI Audit Explanation</th>
                              <th className="px-6 py-4 text-right">Detected At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans font-semibold">
                            {changeLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/40 transition-all">
                                <td className="px-6 py-4 font-black text-slate-900">{log.opportunity?.jobTitle}</td>
                                <td className="px-6 py-4 text-emerald-700 font-bold">{log.opportunity?.employer?.name}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold uppercase text-[9px]">
                                    {log.fieldName}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-red-500 font-mono line-through">{log.previousValue || 'None'}</td>
                                <td className="px-6 py-4 text-emerald-600 font-mono font-bold">{log.updatedValue}</td>
                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={log.aiSummary}>{log.aiSummary}</td>
                                <td className="px-6 py-4 text-slate-400 text-right font-mono">
                                  {new Date(log.detectedAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 4 — Duplicate Intelligence */}
              {recruitmentSubTab === 'duplicates' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-slate-800 space-y-2">
                    <h4 className="text-sm font-black text-slate-900">Duplicate Intelligence Audit Log</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tracks identical placements captured by the crawler across multiple channels. Our AI engine automatically merges useful metadata into the highest confidence version, ignoring lower relevance items.
                    </p>
                  </div>

                  {duplicateHistory.length === 0 ? (
                    <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center text-slate-400">
                      <Shield size={36} className="mx-auto text-slate-200 mb-2" />
                      <p className="font-bold text-slate-500">No duplicate merge events logged</p>
                      <p className="text-xs">Duplicate ingestion attempts will generate auditing history details here.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs text-slate-800">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                              <th className="px-6 py-4">Master Record ID</th>
                              <th className="px-6 py-4">Role Title</th>
                              <th className="px-6 py-4">Company Name</th>
                              <th className="px-6 py-4">Ingested URL Link</th>
                              <th className="px-6 py-4">Resolution Reason</th>
                              <th className="px-6 py-4 text-right">Merged At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans font-semibold text-slate-600">
                            {duplicateHistory.map((dup) => (
                              <tr key={dup.id} className="hover:bg-slate-50/40 transition-all">
                                <td className="px-6 py-4 font-mono font-bold text-slate-400">#CT-OPP-{dup.opportunityId}</td>
                                <td className="px-6 py-4 font-black text-slate-900">{dup.duplicateTitle}</td>
                                <td className="px-6 py-4 text-slate-800 font-extrabold">{dup.duplicateCompany}</td>
                                <td className="px-6 py-4">
                                  <a href={dup.duplicateUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
                                    <span>Official Link</span>
                                    <ExternalLink size={11} />
                                  </a>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-lg text-[10px] font-bold">
                                    {dup.reason}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-right font-mono">
                                  {new Date(dup.mergedAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 9 — Operational Notifications */}
              {recruitmentSubTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-slate-800">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Career Officer Operational Alerts</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        High priority placements, approaching deadlines, automatic expiry actions, and verification alerts.
                      </p>
                    </div>
                    {recruitmentNotifications.filter(n => !n.isRead).length > 0 && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/recruitment/notifications/read', { method: 'POST' });
                            if (res.ok) {
                              handleRefresh();
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Acknowledge All Alerts
                      </button>
                    )}
                  </div>

                  {recruitmentNotifications.length === 0 ? (
                    <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center text-slate-400">
                      <Bell size={36} className="mx-auto text-slate-200 mb-2" />
                      <p className="font-bold text-slate-500">No active alerts</p>
                      <p className="text-xs">Your intelligence alerts inbox is clean.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recruitmentNotifications.map((notif) => {
                        let iconBg = 'bg-slate-100 text-slate-600';
                        if (notif.type === 'high_priority_discovered') iconBg = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                        if (notif.type === 'verification_failed') iconBg = 'bg-red-50 text-red-600 border border-red-100';
                        if (notif.type === 'duplicate_detected') iconBg = 'bg-amber-50 text-amber-600 border border-amber-100';
                        if (notif.type === 'expired') iconBg = 'bg-slate-50 text-slate-600 border border-slate-100';

                        return (
                          <div
                            key={notif.id}
                            className={`p-4 rounded-3xl border flex items-start gap-4 transition-all ${
                              notif.isRead 
                                ? 'bg-white border-slate-50 text-slate-500' 
                                : 'bg-white border-slate-150 shadow-xs text-slate-800 font-medium'
                            }`}
                          >
                            <div className={`p-2.5 rounded-2xl shrink-0 ${iconBg}`}>
                              <Bell size={16} />
                            </div>
                            <div className="space-y-1">
                              <span className="font-extrabold text-slate-900 text-sm block">{notif.title}</span>
                              <p className="text-xs leading-relaxed text-slate-600">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 font-mono block pt-1">
                                Received {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODULE: DOCUMENTATION CENTER */}
          {activeTab === 'documents' && (
            <DocumentationCenterView currentStaff={currentStaff} triggerAuditLog={triggerAuditLog} />
          )}

          {/* MODULE: BACKUP & RECOVERY CENTER */}
          {activeTab === 'backup' && (
            <BackupRecoveryCenterView currentStaff={currentStaff} />
          )}

          {/* TIMELINE LOGS INSPECT MODAL */}
          <AnimatePresence>
            {showTimelineModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 text-slate-800 flex flex-col relative overflow-hidden max-h-[80vh]"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Placement Ingestion Lifecycle</span>
                      <h4 className="text-base font-black text-slate-900">Opportunity Lifecycle Timeline</h4>
                    </div>
                    <button
                      onClick={() => setShowTimelineModal(false)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto pr-1 space-y-6 py-2 font-sans text-xs">
                    {selectedOppTimeline.length === 0 ? (
                      <p className="text-center text-slate-400 py-8">No timeline events logged for this placement yet.</p>
                    ) : (
                      <div className="relative border-l border-slate-150 pl-5 ml-2.5 space-y-6">
                        {selectedOppTimeline.map((evt) => {
                          let dotBg = 'bg-slate-400';
                          if (evt.stage === 'Discovered') dotBg = 'bg-blue-500 ring-4 ring-blue-50';
                          if (evt.stage === 'Verified') dotBg = 'bg-amber-500 ring-4 ring-amber-50';
                          if (evt.stage === 'Published') dotBg = 'bg-emerald-500 ring-4 ring-emerald-50';
                          if (evt.stage === 'Expired') dotBg = 'bg-slate-600 ring-4 ring-slate-100';
                          if (evt.stage === 'Rejected') dotBg = 'bg-red-500 ring-4 ring-red-50';

                          return (
                            <div key={evt.id} className="relative">
                              <span className={`absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full ${dotBg}`} />
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-950 text-sm">{evt.stage}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(evt.createdAt).toLocaleDateString()} {new Date(evt.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-medium">{evt.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end">
                    <button
                      onClick={() => setShowTimelineModal(false)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl"
                    >
                      Close Timeline
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>

      {/* DETAILED APPLICANT DRAWER (MODULE 3 & MODULE 4) */}
      <AnimatePresence>
        {selectedEnrollment && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs" id="applicant-drawer-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setSelectedEnrollment(null)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-100 overflow-hidden text-slate-700"
              id="applicant-drawer-container"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Applicant Reference File</span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    CT-2026-{String(selectedEnrollment.id).padStart(4, '0')}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all"
                    title="Print Profile Sheet"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedEnrollment(null)}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Workspace */}
              <div className="flex-grow p-6 space-y-6 overflow-y-auto font-sans">
                
                {/* Personal Information */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} className="text-emerald-600" /> Candidate Biography
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">First Name</span>
                      <span className="font-extrabold text-slate-900 text-sm">{selectedEnrollment.firstName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Last Name</span>
                      <span className="font-extrabold text-slate-900 text-sm">{selectedEnrollment.lastName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Gender</span>
                      <span className="font-bold text-slate-700">{selectedEnrollment.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Date of Birth</span>
                      <span className="font-bold text-slate-700">{selectedEnrollment.dateOfBirth}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-2 text-xs">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Coordinates</h4>
                  <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl font-mono text-slate-600">
                    <Mail size={13} />
                    <span>{selectedEnrollment.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl font-mono text-slate-600">
                    <Phone size={13} />
                    <span>{selectedEnrollment.phone}</span>
                  </div>
                </div>

                {/* NYSC Deployment Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">NYSC Deployment</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">State of Service</span>
                      <span className="font-bold text-slate-800">{selectedEnrollment.stateOfService} State</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">State of Origin</span>
                      <span className="font-bold text-slate-800">{selectedEnrollment.stateOfOrigin}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Local Gov Area</span>
                      <span className="font-bold text-slate-800">{selectedEnrollment.localGovernment}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">NYSC Batch / Stream</span>
                      <span className="font-bold text-slate-800">{selectedEnrollment.nyscBatch}</span>
                    </div>
                    <div className="col-span-2 p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Place of Primary Assignment (PPA)</span>
                      <span className="font-bold text-slate-800">{selectedEnrollment.ppa}</span>
                    </div>
                  </div>
                </div>

                {/* Training & Cohorts details (Module 5) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Placement</h4>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold">Selected skill path:</span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{selectedEnrollment.course}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold">Assigned Cohort:</span>
                      <select
                        value={parseAdminNotes(selectedEnrollment.adminNotes).cohortId || ''}
                        onChange={async e => {
                          await updateMeta(selectedEnrollment.id, { cohortId: e.target.value }, `Assigned to learning cohort ID: ${e.target.value}`);
                        }}
                        className="px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                      >
                        <option value="">-- Click to assign cohort --</option>
                        {cohorts.filter(c => c.course === selectedEnrollment.course).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1 font-bold">Experience description:</span>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-150 text-slate-600 leading-relaxed font-semibold">{selectedEnrollment.previousTechExperience}</p>
                    </div>
                  </div>
                </div>

                {/* Commute Seat Allocation (Module 6) */}
                {selectedEnrollment.transportationOption === 'Company Bus' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commute & Seat Assignment</h4>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Commute station:</span>
                        <span className="font-extrabold text-slate-800">{selectedEnrollment.pickupLocation || 'Lagos Mainland Terminal'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Allocate Seat Number:</span>
                        <input
                          type="text"
                          placeholder="e.g. Row C - Seat 05"
                          value={parseAdminNotes(selectedEnrollment.adminNotes).seatAllocation || ''}
                          onChange={async e => {
                            await updateMeta(selectedEnrollment.id, { seatAllocation: e.target.value });
                          }}
                          className="px-2.5 py-1.5 w-44 bg-white border border-slate-200 rounded-xl focus:outline-none text-xs text-right font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 4: INTEGRATED COMMUNICATION HUB */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare size={13} className="text-emerald-600" /> Interactive Communications Hub
                  </h4>
                  
                  {/* Action dispatchers */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => dispatchMessage(selectedEnrollment, 'WhatsApp', 'approval')}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex flex-col items-center gap-1 transition-colors"
                    >
                      <PhoneCall size={14} />
                      <span>WhatsApp Appro.</span>
                    </button>
                    <button
                      onClick={() => dispatchMessage(selectedEnrollment, 'Email', 'orientation')}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl flex flex-col items-center gap-1 transition-colors"
                    >
                      <Mail size={14} />
                      <span>Mail Orientation</span>
                    </button>
                    <button
                      onClick={() => dispatchMessage(selectedEnrollment, 'SMS Placeholder', 'reminder')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex flex-col items-center gap-1 transition-colors"
                    >
                      <FileText size={14} />
                      <span>SMS Reminder</span>
                    </button>
                  </div>

                  {/* Messaging dispatch templates dropdown list */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">One-click Quick Dispatch templates</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Admissions Approval', key: 'approval', type: 'WhatsApp' },
                        { name: 'Missing Docs Reminder', key: 'missing', type: 'Email' },
                        { name: 'Orientation Day Details', key: 'orientation', type: 'Email' },
                        { name: 'Pending Followup', key: 'reminder', type: 'WhatsApp' },
                        { name: 'Congratulations Roster', key: 'congrats', type: 'WhatsApp' }
                      ].map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => dispatchMessage(selectedEnrollment, t.type as any, t.key as any)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-150 transition-colors"
                        >
                          {t.name} ({t.type})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct logs form */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold block">Record Manual Communication Notes (Phone log, visit notes)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Spoke with applicant, verified they have a core i5 computer..."
                        value={customCommDraft}
                        onChange={e => setCustomCommDraft(e.target.value)}
                        className="flex-grow p-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs focus:outline-none font-semibold text-slate-700"
                      />
                      <button
                        onClick={addCustomCommLog}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold text-xs shrink-0 transition-colors"
                      >
                        Log Notes
                      </button>
                    </div>
                  </div>

                  {/* Comms History list */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Sent Dispatch & logs History</span>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                      {(parseAdminNotes(selectedEnrollment.adminNotes).comms || []).length === 0 ? (
                        <p className="text-[10px] text-slate-400 font-medium italic">No interactive messages dispatched yet.</p>
                      ) : (
                        (parseAdminNotes(selectedEnrollment.adminNotes).comms || []).map((c, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100/50 space-y-1">
                            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                              <span>{c.type} · {c.template}</span>
                              <span>{new Date(c.date).toLocaleDateString()} {new Date(c.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="font-semibold text-slate-700 leading-tight">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline visual steps */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Audit Timeline</h4>
                  <div className="space-y-3 text-xs">
                    {(parseAdminNotes(selectedEnrollment.adminNotes).timeline || []).length === 0 ? (
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                        <div>
                          <p className="font-bold text-slate-800">Application Submitted</p>
                          <p className="text-[10px] text-slate-400">{new Date(selectedEnrollment.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      (parseAdminNotes(selectedEnrollment.adminNotes).timeline || []).map((tl, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">{tl.action}</p>
                            <p className="text-[10px] text-slate-400">{new Date(tl.date).toLocaleString()} · by {tl.by}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Administrative Notes Form (Module 3) */}
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Internal Confidential staff Notes</h4>
                  <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-xl space-y-3">
                    <textarea
                      value={adminNotesDraft}
                      onChange={e => setAdminNotesDraft(e.target.value)}
                      placeholder="e.g. Has experience with python, verified NYSC Lagos call-up letter. High aptitude candidate."
                      className="w-full h-24 p-2.5 bg-white border border-amber-200/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-300 text-xs text-slate-700 font-semibold leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-75 cursor-pointer"
                      >
                        <Save size={11} />
                        {isSavingNotes ? 'Saving Notes...' : 'Save Administrative Notes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update & Actions footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-extrabold text-slate-600">Change Application Status:</span>
                  <select
                    value={selectedEnrollment.status}
                    onChange={e => handleStatusChange(selectedEnrollment.id, e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSoftDeleteToggle(selectedEnrollment.id, true)}
                    className="flex-grow py-2.5 bg-white text-red-600 hover:bg-red-50 text-xs font-bold border border-red-200 rounded-xl transition-all"
                  >
                    Move to Archive / Trash
                  </button>
                  <button
                    onClick={() => setSelectedEnrollment(null)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Close Profile Drawer
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTER / EDIT STAFF MODAL */}
      <AnimatePresence>
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-700"
            >
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {editingStaffId ? 'Modify Staff Profile' : 'Register New Team Member'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {editingStaffId ? 'Update details, role, and system status.' : 'Setup a new secure staff account.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setTeamActionError('');

                if (!editingStaffId && !teamPassword) {
                  setTeamActionError('Password is required for new accounts.');
                  return;
                }

                const payload = {
                  firstName: teamFirstName,
                  lastName: teamLastName,
                  email: teamEmail,
                  phone: teamPhone,
                  role: teamRole,
                  status: teamStatus,
                  password: teamPassword || undefined,
                  forcePasswordChange: teamForceChange
                };

                try {
                  const url = editingStaffId ? `/api/staff/${editingStaffId}` : '/api/staff';
                  const method = editingStaffId ? 'PUT' : 'POST';
                  const res = await fetch(url, {
                    method,
                    headers: { 
                      'Content-Type': 'application/json',
                      'x-admin-user': currentStaff?.name || 'Super Admin',
                      'x-admin-role': currentStaff?.role || 'Super Admin'
                    },
                    body: JSON.stringify(payload)
                  });

                  if (res.ok) {
                    setShowAddStaffModal(false);
                    setRefreshTrigger(prev => prev + 1);
                    alert(editingStaffId ? 'Staff updated successfully!' : 'Staff created and seeded successfully!');
                  } else {
                    const err = await res.json();
                    setTeamActionError(err.error || 'Operation failed.');
                  }
                } catch (err) {
                  setTeamActionError('Operational database error.');
                }
              }} className="p-6 space-y-4">
                {teamActionError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex gap-1.5 items-center">
                    <AlertCircle size={14} />
                    <span>{teamActionError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text"
                      required
                      value={teamFirstName}
                      onChange={e => setTeamFirstName(e.target.value)}
                      placeholder="e.g. Yusuf"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text"
                      required
                      value={teamLastName}
                      onChange={e => setTeamLastName(e.target.value)}
                      placeholder="e.g. Ola"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Operational Email</label>
                  <input 
                    type="email"
                    required
                    value={teamEmail}
                    onChange={e => setTeamEmail(e.target.value)}
                    placeholder="email@olatech.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Telephone</label>
                  <input 
                    type="text"
                    value={teamPhone}
                    onChange={e => setTeamPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">System Role</label>
                    <select
                      value={teamRole}
                      onChange={e => setTeamRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admissions Officer">Admissions Officer</option>
                      <option value="Operations Officer">Operations Officer</option>
                      <option value="Career Officer">Career Officer</option>
                      <option value="Finance Officer">Finance Officer</option>
                      <option value="Support Officer">Support Officer</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</label>
                    <select
                      value={teamStatus}
                      onChange={e => setTeamStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                </div>

                {!editingStaffId && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Initial Passcode</label>
                    <input 
                      type="password"
                      required
                      value={teamPassword}
                      onChange={e => setTeamPassword(e.target.value)}
                      placeholder="Choose initial password"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 cursor-pointer pt-1">
                  <input 
                    type="checkbox"
                    id="teamForceChange"
                    checked={teamForceChange}
                    onChange={e => setTeamForceChange(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="teamForceChange" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                    Force Password Change on Next Login
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 text-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                  >
                    {editingStaffId ? 'Update Profile' : 'Register Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECRUITMENT AI PREVIEW & AUDIT DRAWER */}
      <AnimatePresence>
        {previewOpp && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs" id="opp-preview-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setPreviewOpp(null)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-100 overflow-hidden text-slate-700 font-sans"
              id="opp-preview-container"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Recruitment Placement Reference</span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    CT-REC-{String(previewOpp.id).padStart(4, '0')}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewOpp(null)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Workspace */}
              <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                
                {/* Title & Organization Header */}
                <div className="space-y-1.5 pb-4 border-b border-slate-100">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-black inline-block">
                    {previewOpp.category.name}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 leading-snug tracking-tight">{previewOpp.jobTitle}</h4>
                  <p className="text-xs text-emerald-700 font-extrabold">{previewOpp.employer.name} · {previewOpp.location} ({previewOpp.remoteStatus})</p>
                </div>

                {/* AI Auditing Intelligence Block */}
                <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3.5 shadow-md">
                  <div className="flex items-center gap-1.5">
                    
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">AI Placement Verification Log</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-800 py-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Confidence Match Score</span>
                      <span className="font-mono text-lg font-extrabold text-emerald-400 mt-1 block">
                        {(((previewOpp.verification?.confidenceScore || previewOpp.confidenceScore || 0)) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Audit Status Outcome</span>
                      <span className="font-mono text-lg font-extrabold text-emerald-400 mt-1 block">
                        {previewOpp.verification?.verificationStatus || 'Passed'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Verification Checklist Checked</span>
                    <div className="grid grid-cols-3 gap-2 pt-1 font-bold text-[10px]">
                      <div className="flex items-center gap-1.5 p-1 bg-slate-800/60 rounded border border-slate-700/20">
                        {previewOpp.verification?.isActivePage ? <Check size={12} className="text-emerald-400" /> : <X size={12} className="text-red-400" />}
                        <span>Active Page</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1 bg-slate-800/60 rounded border border-slate-700/20">
                        {previewOpp.verification?.isValidDeadline ? <Check size={12} className="text-emerald-400" /> : <X size={12} className="text-red-400" />}
                        <span>Valid Deadline</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1 bg-slate-800/60 rounded border border-slate-700/20">
                        {previewOpp.verification?.isTrustedSource ? <Check size={12} className="text-emerald-400" /> : <X size={12} className="text-red-400" />}
                        <span>Trusted Source</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">AI Auditing Reasoning Notes</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 font-medium whitespace-pre-line">
                      {previewOpp.verification?.notes || 'No notes available. Structural check succeeded.'}
                    </p>
                  </div>
                </div>

                {/* Job Info Coordinates */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block">Experience Requirement</span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">{previewOpp.experienceLevel || 'Entry-level'}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block">Stipend / Salary Compensation</span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">{previewOpp.salary || '₦150,000 / month'}</span>
                  </div>
                </div>

                {/* Deadline and URL */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Application Deadline</span>
                    <span className="font-bold text-slate-800">{previewOpp.applicationDeadline || 'No Deadline Listed'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Official Application Link URL</span>
                    <a
                      href={previewOpp.officialUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="text-emerald-600 font-extrabold hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{previewOpp.officialUrl}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Skills Checklist */}
                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Required Core Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewOpp.requiredSkills.split(',').map((skill: string, index: number) => (
                      <span key={index} className="px-2.5 py-1.5 bg-slate-50 border border-slate-150 rounded-xl font-bold text-slate-700">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description Text */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Description & Scope of Role</span>
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-slate-600 font-semibold whitespace-pre-line">
                    {previewOpp.description}
                  </div>
                </div>

              </div>

              {/* Status footer actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-2 shrink-0">
                <button
                  onClick={() => setPreviewOpp(null)}
                  className="flex-grow py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Close Preview File
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECRUITMENT ADD / EDIT PLACEMENT FORM MODAL */}
      <AnimatePresence>
        {(showAddOppModal || showEditOppModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-700 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {showEditOppModal ? 'Override Placement Properties' : 'Draft Custom Technology Placement'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Submit properties to run through AI Auditing & Verification.</p>
                </div>
                <button
                  onClick={() => { setShowAddOppModal(false); setShowEditOppModal(false); }}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (showEditOppModal && oppEditId) {
                    try {
                      const res = await fetch(`/api/recruitment/opportunities/${oppEditId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          jobTitle: oppFormTitle,
                          location: oppFormLoc,
                          remoteStatus: oppFormRemote,
                          salary: oppFormSalary,
                          experienceLevel: oppFormExperience,
                          requiredSkills: oppFormSkills,
                          officialUrl: oppFormUrl,
                          applicationDeadline: oppFormDeadline,
                          description: oppFormDesc
                        })
                      });
                      if (res.ok) {
                        setShowEditOppModal(false);
                        handleRefresh();
                        alert('Placement properties updated successfully!');
                      } else {
                        alert('Failed to update placement.');
                      }
                    } catch (err) {
                      alert('Database transaction failure.');
                    }
                  } else {
                    try {
                      setIsDiscovering(true);
                      setShowAddOppModal(false);
                      
                      const res = await fetch('/api/recruitment/opportunities', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          jobTitle: oppFormTitle,
                          companyName: oppFormCompany,
                          location: oppFormLoc,
                          remoteStatus: oppFormRemote,
                          salary: oppFormSalary,
                          experienceLevel: oppFormExperience,
                          requiredSkills: oppFormSkills,
                          officialUrl: oppFormUrl,
                          applicationDeadline: oppFormDeadline,
                          sourceId: oppFormSourceId,
                          categoryId: oppFormCategoryId,
                          description: oppFormDesc
                        })
                      });
                      setIsDiscovering(false);
                      if (res.ok) {
                        handleRefresh();
                        alert('Manual placement opportunity logged and verified successfully!');
                      } else {
                        alert('Failed to log manual placement opportunity.');
                        handleRefresh();
                      }
                    } catch (err) {
                      setIsDiscovering(false);
                      alert('Connection to Recruitment server failed.');
                    }
                  }
                }}
                className="p-6 space-y-4 overflow-y-auto text-xs font-sans"
              >
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={oppFormTitle}
                      onChange={e => setOppFormTitle(e.target.value)}
                      placeholder="e.g. Graduate Cloud Engineer"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Company Name *</label>
                    <input
                      type="text"
                      required
                      disabled={showEditOppModal}
                      value={oppFormCompany}
                      onChange={e => setOppFormCompany(e.target.value)}
                      placeholder="e.g. Andela Nigeria"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-slate-800 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Location *</label>
                    <input
                      type="text"
                      required
                      value={oppFormLoc}
                      onChange={e => setOppFormLoc(e.target.value)}
                      placeholder="e.g. Lagos, Nigeria"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Remote Status *</label>
                    <select
                      value={oppFormRemote}
                      onChange={e => setOppFormRemote(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-slate-700"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Experience Level</label>
                    <select
                      value={oppFormExperience}
                      onChange={e => setOppFormExperience(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-slate-700"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Entry-level">Entry-level</option>
                      <option value="Graduate Trainee">Graduate Trainee</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Stipend / Salary Compensation</label>
                    <input
                      type="text"
                      value={oppFormSalary}
                      onChange={e => setOppFormSalary(e.target.value)}
                      placeholder="e.g. ₦150,000 / month"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Application Deadline</label>
                    <input
                      type="text"
                      value={oppFormDeadline}
                      onChange={e => setOppFormDeadline(e.target.value)}
                      placeholder="e.g. August 28, 2026"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Official Application Link URL *</label>
                  <input
                    type="url"
                    required
                    value={oppFormUrl}
                    onChange={e => setOppFormUrl(e.target.value)}
                    placeholder="https://company.com/careers/role"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold outline-none"
                  />
                </div>

                {!showEditOppModal && (
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Source Registry Anchor</label>
                      <select
                        value={oppFormSourceId}
                        onChange={e => setOppFormSourceId(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-slate-700"
                      >
                        {recruitmentSources.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Opportunity Category</label>
                      <select
                        value={oppFormCategoryId}
                        onChange={e => setOppFormCategoryId(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-slate-700"
                      >
                        {recruitmentCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Required Core Skills * (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={oppFormSkills}
                    onChange={e => setOppFormSkills(e.target.value)}
                    placeholder="e.g. AWS, Python, Kubernetes, Git"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block font-bold">Placement Description Scope *</label>
                  <textarea
                    required
                    rows={4}
                    value={oppFormDesc}
                    onChange={e => setOppFormDesc(e.target.value)}
                    placeholder="Describe duties, operations, required frameworks, and learning pathways..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none text-slate-700"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 text-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setShowAddOppModal(false); setShowEditOppModal(false); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    {showEditOppModal ? 'Override Properties' : 'Run Audited Ingestion Scan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESET PASSWORD MODAL */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-700"
            >
              <div className="p-6 bg-amber-600 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Force Reset Staff Passcode</h3>
                  <p className="text-[10px] text-amber-100 mt-0.5">Secure override of credentials by Super Admin.</p>
                </div>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (resetNewPassword.length < 6) {
                  alert('Password must be at least 6 characters long.');
                  return;
                }

                try {
                  const res = await fetch(`/api/staff/${resetStaffId}/reset-password`, {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'x-admin-user': currentStaff?.name || 'Super Admin',
                      'x-admin-role': currentStaff?.role || 'Super Admin'
                    },
                    body: JSON.stringify({ 
                      newPassword: resetNewPassword, 
                      forcePasswordChange: resetForceChange 
                    })
                  });

                  if (res.ok) {
                    setShowResetModal(false);
                    setRefreshTrigger(prev => prev + 1);
                    alert('Passcode overridden successfully! The next login will reflect this.');
                  } else {
                    const err = await res.json();
                    alert(err.error || 'Overriding failed.');
                  }
                } catch (err) {
                  alert('Operational database error during override.');
                }
              }} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password"
                    required
                    value={resetNewPassword}
                    onChange={e => setResetNewPassword(e.target.value)}
                    placeholder="Enter new strong passcode"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 cursor-pointer pt-1">
                  <input 
                    type="checkbox"
                    id="resetForceChange"
                    checked={resetForceChange}
                    onChange={e => setResetForceChange(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <label htmlFor="resetForceChange" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                    Force Password Change on Next Login
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 text-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                  >
                    Override Credentials
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINT-ONLY CSS HELPER FOR ROSTERS AND TRANSCRIPTS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #admissions-console-root, #admissions-console-root * {
            visibility: visible;
          }
          #admissions-console-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #btn-refresh-data, #btn-cohort-add, #applicant-drawer-overlay, #btn-cohort-add, button, select, input, .sticky {
            display: none !important;
          }
        }
      `}</style>

    </div></div></div>
  );
}

// ==========================================
// MODULE: COMMAND CENTER STAFF EVENTS ROSTER & CHECK-IN
// ==========================================
function StaffEventsManagementModule({ 
  showEventForm, 
  setShowEventForm, 
  triggerAuditLog 
}: { 
  showEventForm: boolean; 
  setShowEventForm: (val: boolean) => void; 
  triggerAuditLog: (action: string, module?: string) => void; 
}) {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  // Form inputs
  const [evtTitle, setEvtTitle] = useState('');
  const [evtType, setEvtType] = useState('Orientation');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtCapacity, setEvtCapacity] = useState('100');
  const [evtDescription, setEvtDescription] = useState('');

  // Roster check-in modal
  const [selectedEventForRoster, setSelectedEventForRoster] = useState<any | null>(null);
  const [rosterData, setRosterData] = useState<any>({ attendees: [], waitingList: [], stats: {} });
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterFilter, setRosterFilter] = useState<'all' | 'Confirmed' | 'Checked-In' | 'Waiting List'>('all');
  const [checkingInEmail, setCheckingInEmail] = useState<string | null>(null);

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setEventsList(data.data);
          localStorage.setItem('olatech_career_events', JSON.stringify(data.data));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events in admin:", err);
        const saved = localStorage.getItem('olatech_career_events');
        if (saved) setEventsList(JSON.parse(saved));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openRoster = (ev: any) => {
    setSelectedEventForRoster(ev);
    setLoadingRoster(true);
    fetch(`/api/events/${ev.id}/attendees`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setRosterData(data.data);
        }
        setLoadingRoster(false);
      })
      .catch(err => {
        console.error("Error loading roster:", err);
        setLoadingRoster(false);
      });
  };

  const handleMarkAttendance = async (email: string, status: string) => {
    if (!selectedEventForRoster) return;
    setCheckingInEmail(email);
    try {
      const res = await fetch(`/api/events/${selectedEventForRoster.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, attendeeEmail: email, status, staffEmail: 'admin@corpers.tech' })
      });
      const data = await res.json();
      if (data.success) {
        triggerAuditLog(`Marked attendance [${status}] for ${email}`, "Events Roster");
        openRoster(selectedEventForRoster);
        fetchEvents();
      } else {
        alert(data.error || "Failed to mark attendance.");
      }
    } catch (err) {
      alert("Error marking attendance.");
    } finally {
      setCheckingInEmail(null);
    }
  };

  const handleSaveEvent = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      title: evtTitle,
      type: evtType,
      date: evtDate,
      time: evtTime,
      location: evtLocation,
      capacity: parseInt(evtCapacity, 10) || 100,
      description: evtDescription,
      staffEmail: 'admin@corpers.tech'
    };

    try {
      if (editingEvent) {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          triggerAuditLog(`Updated event: ${evtTitle}`, "Career CMS");
          alert("Event updated successfully!");
        } else {
          alert(data.error || "Update failed.");
          return;
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          triggerAuditLog(`Published new event: ${evtTitle}`, "Career CMS");
          alert("New workshop published!");
        } else {
          alert(data.error || "Publishing failed.");
          return;
        }
      }
      setShowEventForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      alert("Error saving event.");
    }
  };

  const handleDeleteEvent = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? All reservations and attendance records will be removed.`)) return;
    try {
      const res = await fetch(`/api/events/${id}?staffEmail=admin@corpers.tech`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        triggerAuditLog(`Deleted event ID ${id}: ${title}`, "Career CMS");
        fetchEvents();
      } else {
        alert(data.error || "Failed to delete event.");
      }
    } catch (err) {
      alert("Error deleting event.");
    }
  };

  const exportRosterCsv = () => {
    if (!rosterData.attendees || rosterData.attendees.length === 0) {
      alert("No attendees to export.");
      return;
    }
    const headers = ["Reservation ID", "Full Name", "Email", "Phone", "Course", "NYSC State", "Attendance Type", "Transportation", "Status"];
    const rows = rosterData.attendees.map((a: any) => [
      a.reservationId || "",
      a.fullName || "",
      a.email || "",
      a.phone || "",
      a.course || "",
      a.nyscState || "",
      a.attendanceType || "",
      a.transportation || "",
      a.status || ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roster_${selectedEventForRoster?.id || 'event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAuditLog(`Exported roster CSV for event ID ${selectedEventForRoster?.id}`, "Events Roster");
  };

  // Filter roster list
  const filteredAttendees = (rosterData.attendees || []).filter((a: any) => {
    const query = rosterSearch.toLowerCase();
    const matchSearch = (a.fullName || '').toLowerCase().includes(query) ||
                        (a.email || '').toLowerCase().includes(query) ||
                        (a.reservationId || '').toLowerCase().includes(query) ||
                        (a.phone || '').toLowerCase().includes(query);
    if (!matchSearch) return false;
    if (rosterFilter === 'all') return true;
    if (rosterFilter === 'Confirmed') return a.status === 'Confirmed' || a.status === 'Registered';
    if (rosterFilter === 'Checked-In') return ['Present', 'Late Arrival', 'Checked-In'].includes(a.status);
    if (rosterFilter === 'Waiting List') return a.status === 'Waiting List';
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="text-emerald-400" size={20} />
            <h3 className="text-lg font-black tracking-tight">Stream Workshop Schedule & Live Roster</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Monitor real-time attendee capacities, manage express QR check-ins, record attendance logs, and download verification rosters.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEvents}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-400" : ""} /> Sync
          </button>
          <button
            onClick={() => {
              setEditingEvent(null);
              setEvtTitle('');
              setEvtType('Orientation');
              setEvtDate('');
              setEvtTime('');
              setEvtLocation('');
              setEvtCapacity('100');
              setEvtDescription('');
              setShowEventForm(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus size={15} /> Publish Workshop
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100">
          <Loader2 size={32} className="animate-spin text-emerald-600" />
          <p className="text-xs font-bold text-slate-500">Loading dynamic event schedules from database...</p>
        </div>
      ) : eventsList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <Calendar size={48} className="mx-auto text-slate-300" />
          <p className="text-sm font-black text-slate-700">No events found in the repository</p>
          <button
            onClick={() => setShowEventForm(true)}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Create First Workshop
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Workshop Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Venue & Access</th>
                  <th className="p-4 text-center">Live Capacity</th>
                  <th className="p-4 text-right">Roster & CMS Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {eventsList.map(evt => {
                  const regCount = evt.reservedCount !== undefined ? evt.reservedCount : (evt.registeredCount || 0);
                  const cap = parseInt(evt.capacity, 10) || 100;
                  const isFull = regCount >= cap;

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-slate-900 text-sm leading-tight">{evt.title}</p>
                        <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{evt.description}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-extrabold uppercase text-[9px] tracking-wide">
                          {evt.type || "Workshop"}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{evt.date}</p>
                        <p className="text-[11px] text-slate-500 font-normal">{evt.time}</p>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{evt.location}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 border border-slate-200/60">
                          <Users size={13} className={isFull ? "text-amber-500" : "text-emerald-600"} />
                          <span>{regCount} / {cap}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openRoster(evt)}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <UserCheck size={14} className="text-emerald-400" /> Check-In Roster
                        </button>

                        <button
                          onClick={() => {
                            setEditingEvent(evt);
                            setEvtTitle(evt.title);
                            setEvtType(evt.type || 'Orientation');
                            setEvtDate(evt.date || '');
                            setEvtTime(evt.time || '');
                            setEvtLocation(evt.location || '');
                            setEvtCapacity(String(evt.capacity || 100));
                            setEvtDescription(evt.description || '');
                            setShowEventForm(true);
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Delete Workshop"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LIVE ROSTER CHECK-IN MODAL */}
      <AnimatePresence>
        {selectedEventForRoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-xs"
            >
              {/* Roster Header */}
              <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded text-[9px] uppercase tracking-wide">
                      {selectedEventForRoster.type || "Workshop"}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">ID: #{selectedEventForRoster.id}</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight">{selectedEventForRoster.title}</h3>
                  <p className="text-xs text-slate-400">
                    📅 {selectedEventForRoster.date} at {selectedEventForRoster.time} • 📍 {selectedEventForRoster.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={exportRosterCsv}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                  <button
                    onClick={() => openRoster(selectedEventForRoster)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
                    title="Refresh Roster"
                  >
                    <RefreshCw size={15} className={loadingRoster ? "animate-spin text-emerald-400" : ""} />
                  </button>
                  <button
                    onClick={() => setSelectedEventForRoster(null)}
                    className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Statistics & Filter Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" />
                    <span>Total Seats: <strong className="text-slate-800">{rosterData.stats?.capacity || selectedEventForRoster.capacity}</strong></span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Confirmed: <strong className="text-emerald-700">{rosterData.stats?.confirmed || (rosterData.attendees || []).length}</strong></span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1.5">
                    <UserCheck size={14} className="text-blue-600" />
                    <span>Checked-In: <strong className="text-blue-700">{rosterData.stats?.checkedIn || (rosterData.attendees || []).filter((a: any) => ['Present', 'Late Arrival', 'Checked-In'].includes(a.status)).length}</strong></span>
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-500" />
                    <span>Waiting List: <strong className="text-amber-700">{rosterData.stats?.waiting || (rosterData.waitingList || []).length}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-grow lg:w-64">
                    <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={rosterSearch}
                      onChange={e => setRosterSearch(e.target.value)}
                      placeholder="Search student name, email, or ref..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <select
                    value={rosterFilter}
                    onChange={e => setRosterFilter(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Attendees</option>
                    <option value="Confirmed">Confirmed Only</option>
                    <option value="Checked-In">Checked-In Only</option>
                    <option value="Waiting List">Waiting List Only</option>
                  </select>
                </div>
              </div>

              {/* Roster Table Content */}
              <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-slate-100/40">
                {loadingRoster ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-3">
                    <Loader2 size={32} className="animate-spin text-emerald-600" />
                    <p className="text-xs font-bold text-slate-500">Syncing live roster check-in sheets...</p>
                  </div>
                ) : filteredAttendees.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                    <Users size={40} className="mx-auto text-slate-300" />
                    <p className="text-sm font-black text-slate-700">No attendees match your filter criteria</p>
                    <p className="text-xs text-slate-500">As students reserve seats in the Career Hub, their QR tokens will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAttendees.map((att: any) => {
                      const isCheckedIn = ['Present', 'Late Arrival', 'Checked-In'].includes(att.status);
                      const isAbsent = att.status === 'Absent' || att.status === 'No Show';
                      const isWaiting = att.status === 'Waiting List';
                      const isBusy = checkingInEmail === att.email;

                      return (
                        <div
                          key={att.reservationId || att.id || att.email}
                          className={`bg-white p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                            isCheckedIn ? 'border-emerald-500/80 bg-emerald-50/20' : isAbsent ? 'border-red-300 bg-red-50/10' : 'border-slate-200'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                {att.reservationId || "CT-RES"}
                              </span>
                              <h4 className="font-black text-slate-900 text-sm">{att.fullName || att.name || "Student Corps Member"}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                isCheckedIn ? 'bg-emerald-600 text-white' : isAbsent ? 'bg-red-500 text-white' : isWaiting ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {att.status || "Confirmed"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px] font-medium">
                              <span>📧 {att.email}</span>
                              {att.phone && <span>📞 {att.phone}</span>}
                              {att.course && <span className="text-slate-700 font-bold">🎓 {att.course}</span>}
                              {att.nyscState && <span>📍 {att.nyscState} State</span>}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] pt-0.5">
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded border border-blue-100">
                                Access: {att.attendanceType || "Physical"}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded border border-slate-200">
                                Transit: {att.transportation || "Personal"}
                              </span>
                              {att.pickupLocation && (
                                <span className="text-emerald-700 font-bold">🚌 Pickup: {att.pickupLocation}</span>
                              )}
                            </div>
                          </div>

                          {/* Quick Staff Check-in Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                            {isBusy ? (
                              <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl font-bold flex items-center gap-1.5">
                                <Loader2 size={14} className="animate-spin text-emerald-600" /> Updating...
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleMarkAttendance(att.email, 'Present')}
                                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                                    att.status === 'Present' || att.status === 'Checked-In'
                                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/40'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                  }`}
                                  title="Mark Present"
                                >
                                  <CheckCircle2 size={14} /> Present
                                </button>

                                <button
                                  onClick={() => handleMarkAttendance(att.email, 'Late Arrival')}
                                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                                    att.status === 'Late Arrival'
                                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/40'
                                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                                  }`}
                                  title="Mark Late Arrival"
                                >
                                  <Clock size={14} /> Late
                                </button>

                                <button
                                  onClick={() => handleMarkAttendance(att.email, 'Absent')}
                                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                                    att.status === 'Absent'
                                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/40'
                                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                  }`}
                                  title="Mark Absent"
                                >
                                  <AlertCircle size={14} /> Absent
                                </button>

                                <button
                                  onClick={() => handleMarkAttendance(att.email, 'No Show')}
                                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                                    att.status === 'No Show'
                                      ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-600/40'
                                      : 'bg-red-50 hover:bg-red-100 text-red-700'
                                  }`}
                                  title="Mark No Show"
                                >
                                  <XCircle size={14} /> No Show
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Roster Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
                <span className="text-slate-500 font-medium">
                  Showing <strong className="text-slate-800">{filteredAttendees.length}</strong> of <strong className="text-slate-800">{(rosterData.attendees || []).length}</strong> total registered attendees
                </span>
                <button
                  onClick={() => setSelectedEventForRoster(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Close Roster Sheet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PUBLISH / EDIT EVENT MODAL */}
      <AnimatePresence>
        {showEventForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="text-emerald-600" size={18} />
                  <h4 className="font-black text-base uppercase tracking-wider text-slate-900">{editingEvent ? 'Edit Workshop' : 'Publish New Workshop'}</h4>
                </div>
                <button onClick={() => { setShowEventForm(false); setEditingEvent(null); }} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Workshop Title <span className="text-red-500">*</span></label>
                  <input type="text" required value={evtTitle} onChange={e => setEvtTitle(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm" placeholder="e.g. Mandatory Stream Technical Briefing & CV Clinic" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">Workshop Type</label>
                    <select value={evtType} onChange={e => setEvtType(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none font-bold text-slate-800">
                      <option value="Orientation">Orientation Briefing</option>
                      <option value="Masterclass">Technical Masterclass</option>
                      <option value="Interview Prep">Mock Interview Prep</option>
                      <option value="CV Clinic">CV Restructuring Clinic</option>
                      <option value="Hackathon">Hackathon Launch Day</option>
                      <option value="Recruiter Meetup">Corporate Recruiter Meetup</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">Max Seats Capacity</label>
                    <input type="number" required min="10" value={evtCapacity} onChange={e => setEvtCapacity(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none font-bold text-slate-800" placeholder="e.g. 500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">Date <span className="text-red-500">*</span></label>
                    <input type="text" required value={evtDate} onChange={e => setEvtDate(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none font-medium" placeholder="e.g. July 12, 2026" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">Time <span className="text-red-500">*</span></label>
                    <input type="text" required value={evtTime} onChange={e => setEvtTime(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none font-medium" placeholder="e.g. 10:00 AM UTC" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Venue & Access Location <span className="text-red-500">*</span></label>
                  <input type="text" required value={evtLocation} onChange={e => setEvtLocation(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none font-medium" placeholder="e.g. Main Auditorium / Zoom Hybrid" />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Detailed Description & Focus</label>
                  <textarea value={evtDescription} onChange={e => setEvtDescription(e.target.value)} rows={3} className="w-full p-3 border border-slate-200 rounded-xl outline-none font-normal" placeholder="Outline agenda, speakers, and prerequisites for Corps Members..." />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => { setShowEventForm(false); setEditingEvent(null); }} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-extrabold transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5">
                    <Save size={15} /> {editingEvent ? 'Save Updates' : 'Publish Workshop'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
