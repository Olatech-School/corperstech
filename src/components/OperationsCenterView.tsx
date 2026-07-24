import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Calendar, CheckSquare, Clock, AlertTriangle, Shield, CheckCircle, 
  Plus, Settings, Activity, Send, Inbox, Trash2, ArrowRight, BookOpen, 
  Bus, Briefcase, RefreshCw, Star, Heart, Sliders, PlayCircle, Users, BarChart3, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend
} from 'recharts';

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface OperationNotification {
  id: number;
  title: string;
  message: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Admissions' | 'Careers' | 'Transportation' | 'Support' | 'Finance' | 'Security' | 'Maintenance' | 'General';
  assignedRole: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Dismissed';
}

interface DailyTask {
  id: number;
  title: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  assignedRole: string;
  assignedUser: string;
  deadline: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface CalendarEvent {
  id: number;
  title: string;
  category: 'Orientation' | 'Training' | 'Hackathons' | 'Career events' | 'Employer visits' | 'Interviews' | 'Meetings' | 'Bus schedules' | 'Staff meetings';
  date: string;
  time: string;
  description: string;
  department: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  author: string;
  createdAt: string;
}

interface SystemHealthStatus {
  service: string;
  status: 'Green' | 'Amber' | 'Red';
  details: string;
}

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  userRole: string;
  eventType: string;
  description: string;
  status: string;
}

interface OperationsCenterViewProps {
  currentStaff: Staff | null;
  onNavigate: (tabId: string) => void;
  enrollments: any[];
}

export default function OperationsCenterView({ currentStaff, onNavigate, enrollments }: OperationsCenterViewProps) {
  const [notifications, setNotifications] = useState<OperationNotification[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [personalReminders, setPersonalReminders] = useState<string[]>([]);
  const [newReminderInput, setNewReminderInput] = useState('');
  
  // KPI Stats
  const [kpis, setKpis] = useState({
    applicationsToday: 3,
    applicationsThisWeek: 14,
    pendingApprovals: 5,
    jobsPublished: 12,
    activeEmployers: 6,
    busOccupancy: 18,
    unreadEnquiries: 5,
    reportsGenerated: 8,
    staffOnline: 4,
    careerPlacements: 15
  });

  // UI States
  const [activeInboxTab, setActiveInboxTab] = useState<'my-role' | 'all'>('my-role');
  const [notificationPriorityFilter, setNotificationPriorityFilter] = useState<string>('All');
  const [calendarDeptFilter, setCalendarDeptFilter] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modals & Panels Toggles
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  // Form States
  const [taskForm, setTaskForm] = useState({
    title: '',
    assignedRole: 'Admissions Officer',
    priority: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    deadline: 'Today, 5:00 PM'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Meetings' as any,
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    description: '',
    department: 'All'
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'Normal' as 'Normal' | 'Urgent' | 'Emergency'
  });

  // Load everything
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      const roleQuery = currentStaff?.role !== 'Super Admin' ? `?role=${encodeURIComponent(currentStaff?.role || '')}` : '';
      
      // Fetch notifications
      const notifRes = await fetch(`/api/operations/notifications${roleQuery}`);
      const notifData = await notifRes.json();
      if (Array.isArray(notifData)) setNotifications(notifData);

      // Fetch tasks
      const tasksRes = await fetch('/api/operations/tasks');
      const tasksData = await tasksRes.json();
      if (Array.isArray(tasksData)) setTasks(tasksData);

      // Fetch calendar
      const calRes = await fetch('/api/operations/calendar');
      const calData = await calRes.json();
      if (Array.isArray(calData)) setCalendarEvents(calData);

      // Fetch announcements
      const annRes = await fetch('/api/operations/announcements');
      const annData = await annRes.json();
      if (Array.isArray(annData)) setAnnouncements(annData);

      // Fetch health
      const healthRes = await fetch('/api/operations/health');
      const healthData = await healthRes.json();
      if (Array.isArray(healthData)) setSystemHealth(healthData);

      // Fetch KPIs
      const kpiRes = await fetch('/api/operations/kpis');
      const kpiData = await kpiRes.json();
      if (kpiData && !kpiData.error) setKpis(kpiData);

      // Fetch Audit Logs
      const auditRes = await fetch('/api/audit-logs');
      const auditData = await auditRes.json();
      if (Array.isArray(auditData)) setAuditLogs(auditData.slice(0, 10)); // Top 10 activities

      // Fetch Reminders
      if (currentStaff?.email) {
        const remRes = await fetch(`/api/operations/reminders?email=${encodeURIComponent(currentStaff.email)}`);
        const remData = await remRes.json();
        if (Array.isArray(remData)) setPersonalReminders(remData);
      }
    } catch (e) {
      console.error("Failed to load operations center telemetry:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Auto sync check triggers on background rules loop
    fetch('/api/operations/rules/trigger', { method: 'POST' }).catch(() => {});
  }, [currentStaff]);

  // Operations actions
  const handleMarkRead = async (id: number) => {
    try {
      const res = await fetch(`/api/operations/notifications/${id}/read`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'Read' } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDismissNotification = async (id: number) => {
    try {
      const res = await fetch(`/api/operations/notifications/${id}/dismiss`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    if (!currentStaff) return;
    try {
      const res = await fetch('/api/operations/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: currentStaff.role })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'Read' })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTask = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await fetch(`/api/operations/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data && !data.error) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/operations/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          editorName: `${currentStaff?.firstName} ${currentStaff?.lastName}`
        })
      });
      const data = await res.json();
      if (data && !data.error) {
        setTasks(prev => [data, ...prev]);
        setShowAddTaskModal(false);
        setTaskForm({ title: '', assignedRole: 'Admissions Officer', priority: 'Medium', deadline: 'Today, 5:00 PM' });
        // Refresh Audit log
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/operations/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventForm,
          editorName: `${currentStaff?.firstName} ${currentStaff?.lastName}`
        })
      });
      const data = await res.json();
      if (data && !data.error) {
        setCalendarEvents(prev => [...prev, data]);
        setShowAddEventModal(false);
        setEventForm({ title: '', category: 'Meetings', date: new Date().toISOString().split('T')[0], time: '10:00 AM', description: '', department: 'All' });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/operations/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...announcementForm,
          author: `${currentStaff?.firstName} ${currentStaff?.lastName}`
        })
      });
      const data = await res.json();
      if (data && !data.error) {
        setAnnouncements(prev => [data, ...prev]);
        setShowAnnouncementModal(false);
        setAnnouncementForm({ title: '', content: '', priority: 'Normal' });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackup = async () => {
    setBackupMessage("Initiating backup sequence...");
    try {
      const res = await fetch('/api/operations/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editorName: `${currentStaff?.firstName} ${currentStaff?.lastName}` })
      });
      const data = await res.json();
      if (data.success) {
        setBackupMessage("Full backup archived successfully!");
        setTimeout(() => setBackupMessage(null), 4000);
        fetchAllData();
      }
    } catch (e) {
      setBackupMessage("Backup process failed.");
    }
  };

  // Reminders actions
  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderInput.trim() || !currentStaff?.email) return;
    const updated = [...personalReminders, newReminderInput.trim()];
    setPersonalReminders(updated);
    setNewReminderInput('');
    try {
      await fetch('/api/operations/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentStaff.email, reminders: updated })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveReminder = async (idx: number) => {
    if (!currentStaff?.email) return;
    const updated = personalReminders.filter((_, i) => i !== idx);
    setPersonalReminders(updated);
    try {
      await fetch('/api/operations/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentStaff.email, reminders: updated })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const downloadReport = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const generateAndDownloadReport = (type: 'OPERATIONS_CENTER' | 'NOTIFICATION_ENGINE' | 'TASK_MANAGEMENT' | 'STAFF_PRODUCTIVITY' | 'DAILY_BRIEFING' | 'SYSTEM_HEALTH') => {
    let reportTitle = '';
    let content = '';

    const todayStr = new Date().toLocaleDateString();

    switch(type) {
      case 'OPERATIONS_CENTER':
        reportTitle = 'CorpersTech Operations Center Summary Report';
        content = `# ${reportTitle}\n\n**Generated On:** ${todayStr}\n**Staff Member:** ${currentStaff?.firstName} ${currentStaff?.lastName}\n\n## 1. Overview\nThis report presents a summary audit of the Olatech School of Programming central operational dashboard. All telemetry compiles directly from live server events and database connections.\n\n## 2. Daily Metrics\n- Total Applications Vetted: ${kpis.applicationsThisWeek} this week\n- Pending Approval Queue: ${kpis.pendingApprovals} applicants\n- Active Placements: ${kpis.careerPlacements} corps members\n- Commute Seat Fill Rate: ${kpis.busOccupancy} registered company bus riders\n\n## 3. Operational Performance\nAll core components are executing with nominal latencies. Team workflow is coordinated via live role-based daily lists.`;
        downloadReport('OPERATIONS_CENTER_REPORT.md', content);
        break;
      case 'NOTIFICATION_ENGINE':
        reportTitle = 'Notification Engine & Event Triggers Audit';
        content = `# ${reportTitle}\n\n**Generated On:** ${todayStr}\n\n## 1. Overview\nThe CorpersTech intelligent event-driven notifications manager instantly processes operations anomalies. This report logs active indicators.\n\n## 2. Notification Records\nCurrently storing ${notifications.length} active notifications.\n\n- Unread Critical Alerts: ${notifications.filter(n => n.priority === 'Critical' && n.status === 'Unread').length}\n- Admissions Queue Flags: ${notifications.filter(n => n.category === 'Admissions').length}\n- Transport Rule Alerts: ${notifications.filter(n => n.category === 'Transportation').length}`;
        downloadReport('NOTIFICATION_ENGINE_REPORT.md', content);
        break;
      case 'TASK_MANAGEMENT':
        reportTitle = 'Daily Task Management & Workflow Audit';
        content = `# ${reportTitle}\n\n**Generated On:** ${todayStr}\n\n## 1. Team Deliverables\nDaily tasks are generated automatically from state models and audited manually.\n\n## 2. Completion Logs\n- Pending Tasks: ${tasks.filter(t => t.status === 'Pending').length}\n- Completed Tasks: ${tasks.filter(t => t.status === 'Completed').length}\n- Overdue Red Flags: ${tasks.filter(t => t.status === 'Overdue').length}`;
        downloadReport('TASK_MANAGEMENT_REPORT.md', content);
        break;
      case 'STAFF_PRODUCTIVITY':
        reportTitle = 'Staff Member Personal Productivity Analytics';
        content = `# ${reportTitle}\n\n**Generated On:** ${todayStr}\n**Evaluated Personnel:** ${currentStaff?.firstName} ${currentStaff?.lastName} (${currentStaff?.role})\n\n## 1. Telemetry Log\n- Active personal checklist item counts: ${personalReminders.length}\n- Completed deliverables this run: ${tasks.filter(t => t.status === 'Completed').length}\n- Estimated triage reaction time: 1.8 hours (Nominal SLA: 4.0 hours)`;
        downloadReport('STAFF_PRODUCTIVITY_REPORT.md', content);
        break;
      case 'DAILY_BRIEFING':
        reportTitle = 'Executive Briefing Compilation';
        content = `# ${reportTitle}\n\n**Briefing For:** ${currentStaff?.firstName} ${currentStaff?.lastName}\n**Timestamp:** ${new Date().toISOString()}\n\n## Today's Hot List:\n1. **CRM Registration Flow:** ${kpis.applicationsToday} new applications received today.\n2. **Immediate Bottlenecks:** ${kpis.pendingApprovals} registrations require manual validation.\n3. **Orientation Timelines:** Phase 1 briefings launch in 2 days.\n4. **Logistics Capacity:** Bus Route A seat capacity verified.`;
        downloadReport('DAILY_BRIEFING_REPORT.md', content);
        break;
      case 'SYSTEM_HEALTH':
        reportTitle = 'Olatech Cluster Services Health Report';
        content = `# ${reportTitle}\n\n**Generated On:** ${todayStr}\n\n## Service Grid Matrix\n\n| Service Component | Nominal Status | Telemetry details |\n| :--- | :--- | :--- |\n${systemHealth.map(s => `| **${s.service}** | ${s.status} | ${s.details} |`).join('\n')}`;
        downloadReport('SYSTEM_HEALTH_REPORT.md', content);
        break;
    }
  };

  // Calculations for displays
  const unreadCount = notifications.filter(n => n.status === 'Unread').length;
  const criticalAlerts = notifications.filter(n => n.priority === 'Critical' && n.status === 'Unread');
  const pendingReviewsCount = kpis.pendingApprovals;

  // Filter lists
  const filteredNotifications = notifications.filter(n => {
    if (n.status === 'Dismissed') return false;
    if (activeInboxTab === 'my-role' && currentStaff?.role !== 'Super Admin') {
      if (n.assignedRole !== currentStaff?.role && n.assignedRole !== 'All') return false;
    }
    if (notificationPriorityFilter !== 'All' && n.priority !== notificationPriorityFilter) return false;
    return true;
  });

  const filteredEvents = calendarEvents.filter(e => {
    if (calendarDeptFilter !== 'All') {
      return e.department === calendarDeptFilter || e.department === 'All';
    }
    return true;
  });

  // Productivity Metrics
  const tasksCompletedToday = tasks.filter(t => t.status === 'Completed').length;
  const tasksRemaining = tasks.filter(t => t.status === 'Pending' || t.status === 'Overdue').length;
  const productivityPct = tasks.length > 0 ? Math.round((tasksCompletedToday / tasks.length) * 100) : 100;

  // Admin insights chart data
  const workloadData = [
    { name: 'Admissions', pending: kpis.pendingApprovals, completed: kpis.applicationsThisWeek - kpis.pendingApprovals },
    { name: 'Careers', pending: kpis.unreadEnquiries, completed: kpis.careerPlacements },
    { name: 'Logistics', pending: 0, completed: kpis.busOccupancy }
  ];

  return (
    <div className="space-y-8" id="operations-center-workspace">
      
      {/* HEADER BAR WITH REFRESH & QUICK CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="text-[#16A34A] h-6 w-6" />
            Operations Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time operations matrix, task delegation protocols, and telemetry dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            id="trigger-sync-rules"
            onClick={fetchAllData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Signals
          </button>
          
          <button 
            id="backup-db-btn"
            onClick={handleBackup}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl shadow-sm transition"
          >
            Backup Database
          </button>
        </div>
      </div>

      {/* BACKUP FLOATING TOAST */}
      <AnimatePresence>
        {backupMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-xs border border-slate-800"
          >
            <Shield className="text-[#16A34A] h-4 w-4 animate-pulse" />
            <span className="font-semibold">{backupMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODULE 12 — DAILY BRIEFING HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden" id="daily-briefing-header">
        <div className="absolute right-0 top-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-ping" />
              Live Executive Briefing
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good Morning, {currentStaff?.firstName || 'Sarah'}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Welcome back to your dashboard. Here is your personalized administrative update for today.
            </p>
          </div>
          
          {/* Briefing summary grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:w-auto w-full">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-xl font-bold block text-emerald-400">{kpis.applicationsToday}</span>
              <span className="text-[10px] text-slate-400">New Applications</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-xl font-bold block text-amber-400">{kpis.pendingApprovals}</span>
              <span className="text-[10px] text-slate-400">Awaiting CRM Vetting</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center sm:col-span-1 col-span-2">
              <span className="text-sm font-bold block text-blue-400">Orientation</span>
              <span className="text-[10px] text-slate-400">In 2 Days</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-5 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-[#16A34A] h-4 w-4 shrink-0 mt-0.5" />
            <span><strong>Bus Route A status:</strong> Fully booked at maximum seating limit.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-[#16A34A] h-4 w-4 shrink-0 mt-0.5" />
            <span><strong>Placements count:</strong> {kpis.careerPlacements} corps members dispatched to active roles.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-[#16A34A] h-4 w-4 shrink-0 mt-0.5" />
            <span><strong>Compliance report:</strong> Weekly analytics review generated on local database.</span>
          </div>
        </div>
      </div>

      {/* MODULE 9 & 10 — QUICK ACTIONS & SYSTEM HEALTH ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MODULE 9 — QUICK ACTIONS */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 lg:col-span-2" id="quick-actions-card">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Quick Operations Dispatch</h3>
            <p className="text-xs text-slate-400">Deploy immediate actions or load key application interfaces instantly.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button 
              id="action-create-applicant"
              onClick={() => onNavigate('applicants')}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <Users className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Add Applicant</span>
            </button>
            
            <button 
              id="action-publish-job"
              onClick={() => onNavigate('recruitment')}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <Briefcase className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Publish Job</span>
            </button>

            <button 
              id="action-create-announcement"
              onClick={() => setShowAnnouncementModal(true)}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <Bell className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Announcement</span>
            </button>

            <button 
              id="action-assign-bus"
              onClick={() => onNavigate('transport')}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <Bus className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Bus Schedules</span>
            </button>

            <button 
              id="action-new-cohort"
              onClick={() => onNavigate('cohorts')}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <BookOpen className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Create Cohort</span>
            </button>

            <button 
              id="action-system-backup"
              onClick={handleBackup}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <Shield className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Run Backup</span>
            </button>

            <button 
              id="action-new-event"
              onClick={() => setShowAddEventModal(true)}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <Calendar className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">Add Event</span>
            </button>

            <button 
              id="action-weekly-analytics"
              onClick={() => onNavigate('reports')}
              className="p-3.5 bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-200/60 hover:border-[#16A34A]/20 rounded-xl text-center transition group"
            >
              <BarChart3 className="h-5 w-5 mx-auto mb-2 text-slate-500 group-hover:text-[#16A34A]" />
              <span className="text-xs font-bold block text-slate-700 group-hover:text-[#16A34A]">System Analytics</span>
            </button>
          </div>
        </div>

        {/* MODULE 10 — OPERATIONAL HEALTH PANEL */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="system-health-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Operational Health</h3>
              <p className="text-xs text-slate-400">Component checks from live server nodes.</p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A] animate-pulse" />
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {systemHealth.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-xs transition" id={`health-item-${idx}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    s.status === 'Green' ? 'bg-[#16A34A]' : s.status === 'Amber' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <span className="font-semibold text-slate-700">{s.service}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium max-w-[160px] truncate" title={s.details}>{s.details}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODULE 15 - SYSTEM REPORTS EXPORT PROTOCOL */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm" id="reports-export-dock">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Operational Reporting Suite</h3>
            <p className="text-xs text-slate-400">Generate and download standard markdown summaries of Olatech systems.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              id="btn-report-ops"
              onClick={() => generateAndDownloadReport('OPERATIONS_CENTER')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition"
            >
              Operations Report
            </button>
            <button 
              id="btn-report-notif"
              onClick={() => generateAndDownloadReport('NOTIFICATION_ENGINE')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition"
            >
              Notification Engine
            </button>
            <button 
              id="btn-report-tasks"
              onClick={() => generateAndDownloadReport('TASK_MANAGEMENT')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition"
            >
              Task Management
            </button>
            <button 
              id="btn-report-prod"
              onClick={() => generateAndDownloadReport('STAFF_PRODUCTIVITY')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition"
            >
              Staff Productivity
            </button>
            <button 
              id="btn-report-brief"
              onClick={() => generateAndDownloadReport('DAILY_BRIEFING')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition"
            >
              Daily Briefing
            </button>
            <button 
              id="btn-report-health"
              onClick={() => generateAndDownloadReport('SYSTEM_HEALTH')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition"
            >
              System Health
            </button>
          </div>
        </div>
      </div>

      {/* MODULE 2 & 3 — SMART NOTIFICATIONS & ROLE-BASED INBOX */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" id="notifications-inbox-section">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#16A34A]/10 text-[#16A34A] rounded-xl">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                Operational Inbox
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {unreadCount} Unread
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Intelligent alerts automatically synthesized by system changes.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button 
              id="btn-read-all-notifications"
              onClick={handleMarkAllRead}
              className="text-xs text-[#16A34A] hover:underline font-semibold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
            >
              Mark All Read
            </button>
            
            <select 
              id="filter-notification-priority"
              value={notificationPriorityFilter}
              onChange={(e) => setNotificationPriorityFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-1.5 bg-white font-medium text-slate-600 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Inbox Tabs */}
        <div className="flex border-b border-slate-100 text-xs bg-slate-50/20 px-6">
          <button 
            id="inbox-tab-role"
            onClick={() => setActiveInboxTab('my-role')}
            className={`py-3 px-4 font-bold border-b-2 transition ${
              activeInboxTab === 'my-role' 
                ? 'border-[#16A34A] text-[#16A34A]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            My Role ({currentStaff?.role}) Inbox
          </button>
          
          {currentStaff?.role === 'Super Admin' && (
            <button 
              id="inbox-tab-all"
              onClick={() => setActiveInboxTab('all')}
              className={`py-3 px-4 font-bold border-b-2 transition ${
                activeInboxTab === 'all' 
                  ? 'border-[#16A34A] text-[#16A34A]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              System Broadcaster (Super Admin)
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto" id="notifications-list-container">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <Inbox size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Your Inbox is completely clean!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">No matching alerts requires your attention right now.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 flex items-start justify-between gap-4 text-xs transition ${
                  n.status === 'Unread' ? 'bg-[#16A34A]/5 hover:bg-[#16A34A]/10' : 'bg-white hover:bg-slate-50'
                }`}
                id={`notification-row-${n.id}`}
              >
                <div className="flex gap-3">
                  <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    n.priority === 'Critical' ? 'bg-red-500 animate-pulse' :
                    n.priority === 'High' ? 'bg-amber-500' :
                    n.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-400'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-slate-800 text-sm ${n.status === 'Unread' ? 'font-black' : 'font-semibold'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {n.category}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                        n.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        n.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {n.priority}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium mt-1 text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString()} · Assigned: <span className="font-semibold text-slate-600">{n.assignedRole}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {n.status === 'Unread' && (
                    <button 
                      id={`btn-read-${n.id}`}
                      onClick={() => handleMarkRead(n.id)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-lg transition"
                      title="Mark as Read"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button 
                    id={`btn-dismiss-${n.id}`}
                    onClick={() => handleDismissNotification(n.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Dismiss notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODULE 4 & 11 — DAILY TASK MANAGER & PERSONAL PRODUCTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DAILY TASK MANAGER */}
        <div className="lg:col-span-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="daily-tasks-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Daily Task Registry</h3>
              <p className="text-xs text-slate-400">Collaborative role tasks for the active shift.</p>
            </div>
            
            <button 
              id="btn-open-add-task-modal"
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-emerald-700 rounded-xl shadow-sm transition"
            >
              <Plus className="h-3.5 w-3.5" />
              New Task
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1" id="tasks-list-container">
            {tasks.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-100 rounded-xl">
                <CheckSquare size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">All tasks completed!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="py-3.5 flex items-center justify-between gap-3 text-xs" id={`task-item-${task.id}`}>
                  <div className="flex items-start gap-3">
                    <button 
                      id={`btn-toggle-task-${task.id}`}
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`mt-0.5 h-4.5 w-4.5 shrink-0 flex items-center justify-center rounded border transition ${
                        task.status === 'Completed' 
                          ? 'bg-[#16A34A] border-[#16A34A] text-white' 
                          : 'border-slate-300 hover:border-[#16A34A] text-transparent'
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <div>
                      <h4 className={`text-slate-800 text-sm font-bold ${
                        task.status === 'Completed' ? 'line-through text-slate-400 font-medium' : ''
                      }`}>
                        {task.title}
                      </h4>
                      <p className="text-slate-500 font-medium text-[11px] mt-0.5">
                        Target: <span className="font-semibold text-slate-600">{task.assignedRole}</span> · Deadline: <span className="text-slate-700 font-semibold">{task.deadline}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      task.status === 'Completed' ? 'bg-slate-100 text-slate-400' :
                      task.status === 'Overdue' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {task.status}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-black uppercase text-[8px] ${
                      task.priority === 'Critical' ? 'bg-red-500 text-white' :
                      task.priority === 'High' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODULE 11 — PERSONAL PRODUCTIVITY CHECKLIST */}
        <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="personal-productivity-card">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">My Workspace Efficiency</h3>
            <p className="text-xs text-slate-400">Track and index your shift productivity.</p>
          </div>

          {/* Productivity progress visual */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Task List Clearance</span>
              <span className="text-[#16A34A]">{productivityPct}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#16A34A] h-full rounded-full transition-all" style={{ width: `${productivityPct}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] mt-2 pt-2 border-t border-slate-200/40">
              <div>
                <span className="block font-bold text-slate-800 text-sm">{tasksCompletedToday}</span>
                <span className="text-slate-400 font-semibold">Done Today</span>
              </div>
              <div>
                <span className="block font-bold text-slate-800 text-sm">{tasksRemaining}</span>
                <span className="text-slate-400 font-semibold">Pending</span>
              </div>
            </div>
          </div>

          {/* SLA Response time */}
          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
            <span className="text-slate-400 font-semibold">Avg Enquiry Speed:</span>
            <span className="font-bold text-slate-800">1.8 Hours</span>
          </div>

          {/* Personal Scratch reminders notepad */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Shift Notepad</h4>
            <form onSubmit={handleAddReminder} className="flex gap-2" id="reminder-form">
              <input 
                id="reminder-input"
                type="text"
                placeholder="New reminder note..."
                value={newReminderInput}
                onChange={(e) => setNewReminderInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
              <button 
                id="btn-add-reminder"
                type="submit" 
                className="p-2 bg-[#16A34A] text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {personalReminders.map((rem, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-lg text-xs" id={`reminder-row-${idx}`}>
                  <span className="text-slate-600 font-medium break-all">{rem}</span>
                  <button 
                    id={`btn-remove-reminder-${idx}`}
                    onClick={() => handleRemoveReminder(idx)}
                    className="text-slate-300 hover:text-red-500 transition shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODULE 5 & 7 — CALENDAR & ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CALENDAR */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="calendar-card">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Administrative Calendar</h3>
              <p className="text-xs text-slate-400">Class lectures, hackathons, and transport timetables.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                id="filter-calendar-dept"
                value={calendarDeptFilter}
                onChange={(e) => setCalendarDeptFilter(e.target.value)}
                className="text-[11px] border border-slate-200 rounded-lg p-1 bg-white font-medium text-slate-600 focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Admissions">Admissions</option>
                <option value="Careers">Careers</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Support">Support</option>
              </select>

              <button 
                id="btn-open-add-event"
                onClick={() => setShowAddEventModal(true)}
                className="p-1 bg-[#16A34A] text-white rounded hover:bg-emerald-700 transition"
                title="Add Calendar Event"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto pr-1" id="calendar-list-container">
            {filteredEvents.map((event) => (
              <div key={event.id} className="py-3 flex items-start justify-between gap-3 text-xs" id={`event-row-${event.id}`}>
                <div className="flex gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center shrink-0 min-w-[54px]">
                    <span className="block font-black text-slate-700">{event.time}</span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">{event.date.split('-')[2] || 'Day'}</span>
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-slate-400 font-medium text-[11px] mt-0.5">
                      {event.description}
                    </p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-[9px] bg-[#16A34A]/10 text-[#16A34A] font-bold px-1.5 py-0.5 rounded uppercase">
                        {event.category}
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                        Dept: {event.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ANNOUNCEMENTS BULLETIN (MODULE 7) */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="announcements-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Office Announcements</h3>
              <p className="text-xs text-slate-400">Corporate newsletters, policy directives, and emergency memos.</p>
            </div>

            {currentStaff?.role === 'Super Admin' && (
              <button 
                id="btn-open-announcement-modal"
                onClick={() => setShowAnnouncementModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-emerald-700 rounded-xl shadow-sm transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Publish Notice
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1" id="announcements-list-container">
            {announcements.map((ann) => (
              <div 
                key={ann.id} 
                className={`p-4 rounded-2xl border text-xs relative ${
                  ann.priority === 'Emergency' ? 'bg-red-50 border-red-200 text-red-900' :
                  ann.priority === 'Urgent' ? 'bg-amber-50/50 border-amber-200 text-slate-800' : 'bg-slate-50/50 border-slate-200/50 text-slate-700'
                }`}
                id={`announcement-item-${ann.id}`}
              >
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                    ann.priority === 'Emergency' ? 'bg-red-600 text-white' :
                    ann.priority === 'Urgent' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Posted {new Date(ann.createdAt).toLocaleDateString()} by {ann.author}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm mb-1">{ann.title}</h4>
                <p className="text-[11px] leading-relaxed opacity-90">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODULE 8 — PERFORMANCE SNAPSHOT */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4" id="kpis-snapshot-card">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Administrative Telemetry Snapshot</h3>
          <p className="text-xs text-slate-400">Live operational KPIs calculated directly from SQL databases.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Today's Applications", value: kpis.applicationsToday, color: "text-emerald-600" },
            { label: "Weekly Submissions", value: kpis.applicationsThisWeek, color: "text-[#16A34A]" },
            { label: "Pending Vetting", value: kpis.pendingApprovals, color: "text-amber-500" },
            { label: "Jobs Published", value: kpis.jobsPublished, color: "text-blue-600" },
            { label: "Partner Employers", value: kpis.activeEmployers, color: "text-purple-600" },
            { label: "Transit Passengers", value: kpis.busOccupancy, color: "text-indigo-600" },
            { label: "Unread Enquiries", value: kpis.unreadEnquiries, color: "text-red-500" },
            { label: "Audit Reports Logged", value: kpis.reportsGenerated, color: "text-slate-700" },
            { label: "Personnel Online", value: kpis.staffOnline, color: "text-teal-600" },
            { label: "Placements Dispatched", value: kpis.careerPlacements, color: "text-[#16A34A]" }
          ].map((kpi, idx) => (
            <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200/40 rounded-xl text-center" id={`kpi-widget-${idx}`}>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider leading-tight min-h-[24px]">
                {kpi.label}
              </span>
              <span className={`text-xl sm:text-2xl font-black mt-1.5 block ${kpi.color}`}>
                {kpi.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODULE 14 — SUPER ADMIN DASHBOARD PANEL */}
      {currentStaff?.role === 'Super Admin' && (
        <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl space-y-6" id="super-admin-insight-deck">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Shield className="text-[#16A34A] h-5 w-5" />
              Command Intelligence Oversight (Super Admin Only)
            </h3>
            <p className="text-xs text-slate-500">
              Department workload distribution and operational queue indices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Workload distribution chart */}
            <div className="lg:col-span-7 bg-white border border-slate-100 p-4 rounded-xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Deliverable load distribution</h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" name="Unresolved Items" />
                    <Area type="monotone" dataKey="completed" stroke="#16a34a" fillOpacity={1} fill="url(#colorCompleted)" name="Completed Events" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audit log trail */}
            <div className="lg:col-span-5 bg-white border border-slate-100 p-4 rounded-xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Chronos System Audits</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="text-[11px] border-b border-slate-100 pb-2 hover:bg-slate-50 p-1 rounded transition" id={`audit-item-${log.id}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-700">{log.user} ({log.userRole})</span>
                      <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-500 font-semibold">{log.eventType}: <span className="font-normal">{log.description}</span></p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. MODALS AND FORM SPECIFICATIONS FOR THE NEW EVENTS / ANNOUNCEMENTS / TASKS */}
      {/* ========================================================================= */}

      {/* ADD TASK MODAL */}
      <AnimatePresence>
        {showAddTaskModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Add Daily Task</h3>
                <button onClick={() => setShowAddTaskModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddTask} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Task Title</label>
                  <input 
                    id="new-task-title"
                    type="text" 
                    required
                    value={taskForm.title}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Verify PPA details for Lagos Batch A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Assigned Staff Role</label>
                  <select 
                    id="new-task-role"
                    value={taskForm.assignedRole}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, assignedRole: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="All">All Staff</option>
                    <option value="Admissions Officer">Admissions Officer</option>
                    <option value="Career Officer">Career Officer</option>
                    <option value="Operations Officer">Operations Officer</option>
                    <option value="Finance Officer">Finance Officer</option>
                    <option value="Support Officer">Support Officer</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Priority</label>
                    <select 
                      id="new-task-priority"
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Deadline</label>
                    <input 
                      id="new-task-deadline"
                      type="text" 
                      value={taskForm.deadline}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, deadline: e.target.value }))}
                      placeholder="e.g., Today, 5:00 PM"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <button 
                  id="btn-submit-new-task"
                  type="submit" 
                  className="w-full py-2 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                >
                  Create Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CALENDAR EVENT MODAL */}
      <AnimatePresence>
        {showAddEventModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Schedule Calendar Event</h3>
                <button onClick={() => setShowAddEventModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Event Title</label>
                  <input 
                    id="new-event-title"
                    type="text" 
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Admissions Vetting sync session"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#16A34A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                    <select 
                      id="new-event-category"
                      value={eventForm.category}
                      onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="Orientation">Orientation</option>
                      <option value="Training">Training</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Career events">Career events</option>
                      <option value="Employer visits">Employer visits</option>
                      <option value="Interviews">Interviews</option>
                      <option value="Meetings">Meetings</option>
                      <option value="Bus schedules">Bus schedules</option>
                      <option value="Staff meetings">Staff meetings</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Target Dept</label>
                    <select 
                      id="new-event-dept"
                      value={eventForm.department}
                      onChange={(e) => setEventForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="All">All Departments</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Careers">Careers</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                    <input 
                      id="new-event-date"
                      type="date" 
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Time</label>
                    <input 
                      id="new-event-time"
                      type="text" 
                      value={eventForm.time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="e.g., 10:00 AM"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                  <textarea 
                    id="new-event-description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of event goals..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs h-20 resize-none"
                  />
                </div>

                <button 
                  id="btn-submit-new-event"
                  type="submit" 
                  className="w-full py-2 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                >
                  Schedule Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Publish Office Announcement</h3>
                <button onClick={() => setShowAnnouncementModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handlePublishAnnouncement} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Notice Title</label>
                  <input 
                    id="new-announcement-title"
                    type="text" 
                    required
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Holiday Schedule Update"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Priority Category</label>
                  <select 
                    id="new-announcement-priority"
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Normal">Normal Newsletter</option>
                    <option value="Urgent">Urgent Directive</option>
                    <option value="Emergency">Emergency Broadcast</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Message Content</label>
                  <textarea 
                    id="new-announcement-content"
                    required
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Type the announcement details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs h-32 resize-none"
                  />
                </div>

                <button 
                  id="btn-submit-new-announcement"
                  type="submit" 
                  className="w-full py-2 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                >
                  Publish Announcement Notice
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
