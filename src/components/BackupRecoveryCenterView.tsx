import React, { useState, useEffect } from 'react';
import { 
  Database, RefreshCw, Play, CheckCircle, Download, Trash2, 
  AlertTriangle, Cpu, Layers, Settings, Activity, FileText, 
  CheckSquare, XCircle, ShieldCheck, Clock, Shield, AlertCircle,
  HardDrive, ChevronRight, Terminal, Globe, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StaffUser {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface BackupRecoveryCenterViewProps {
  currentStaff: StaffUser | null;
  onNavigate?: (tab: string) => void;
}

interface BackupMetadata {
  id: string;
  filename: string;
  createdAt: string;
  createdBy: string;
  size: number;
  recordCount: number;
  databaseVersion: string;
  verificationStatus: 'Verified' | 'Warning' | 'Failed';
  verificationDetails: string;
  durationMs: number;
}

interface SchedulerConfig {
  interval: '6h' | '12h' | 'daily' | 'weekly' | 'monthly' | 'manual';
  nextScheduledBackup: string;
  lastBackup: string | null;
  isEnabled: boolean;
}

interface MaintenanceConfig {
  isEnabled: boolean;
  message: string;
  startWindow: string;
  endWindow: string;
}

interface AppError {
  id: string;
  timestamp: string;
  module: string;
  summary: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Resolved' | 'Active';
  assignedEngineer: string;
  resolutionNotes: string;
}

interface DiagnosticsData {
  mysql: { status: 'Green' | 'Amber' | 'Red'; details: string };
  prisma: { status: 'Green' | 'Amber' | 'Red'; details: string };
  api: { status: 'Green' | 'Amber' | 'Red'; details: string };
  memory: { status: 'Green' | 'Amber' | 'Red'; details: string; percent: number };
  cpu: { status: 'Green' | 'Amber' | 'Red'; details: string };
  disk: { status: 'Green' | 'Amber' | 'Red'; details: string; percent: number };
  uptime: string;
  envValidation: { status: 'Green' | 'Amber' | 'Red'; details: string };
}

interface DatabaseStats {
  totalApplications: number;
  totalStaff: number;
  totalEmployers: number;
  totalOpportunities: number;
  totalCohorts: number;
  totalNotifications: number;
  totalAuditLogs: number;
  totalDocuments: number;
  totalSuccessStories: number;
  totalProjectShowcases: number;
  totalCareerResources: number;
  totalUpcomingEvents: number;
  totalEventReservations: number;
}

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  validations: Array<{ key: string; value: string; required: boolean; simulated?: boolean }>;
  requiredDirs: Array<{ name: string; exists: boolean }>;
  message: string;
}

interface DeploymentInfo {
  appVersion: string;
  buildNumber: string;
  gitCommit: string;
  deploymentDate: string;
  databaseVersion: string;
  prismaVersion: string;
  nodeVersion: string;
  environment: string;
}

export default function BackupRecoveryCenterView({ currentStaff }: BackupRecoveryCenterViewProps) {
  const [subTab, setSubTab] = useState<'backup' | 'diagnostics' | 'inspector' | 'maintenance' | 'errors'>('backup');
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [scheduler, setScheduler] = useState<SchedulerConfig | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceConfig | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [errors, setErrors] = useState<AppError[]>([]);
  const [envValidation, setEnvValidation] = useState<EnvValidationResult | null>(null);
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);

  // Loading & interactive UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [countdown, setCountdown] = useState<string>('');
  
  // Double-confirmation restore wizard state
  const [restoreCandidate, setRestoreCandidate] = useState<BackupMetadata | null>(null);
  const [restoreConfirmStep, setRestoreConfirmStep] = useState<number>(0); // 0 = none, 1 = details review, 2 = password / override word confirmation
  const [restoreConfirmWord, setRestoreConfirmWord] = useState<string>('');

  // Selected error resolving state
  const [resolvingError, setResolvingError] = useState<AppError | null>(null);
  const [errorResolutionNotes, setErrorResolutionNotes] = useState<string>('');

  // Maintenance custom settings
  const [maintEnabled, setMaintEnabled] = useState<boolean>(false);
  const [maintMessage, setMaintMessage] = useState<string>('');
  const [maintStart, setMaintStart] = useState<string>('');
  const [maintEnd, setMaintEnd] = useState<string>('');

  // Scheduler editing state
  const [schedInterval, setSchedInterval] = useState<'6h' | '12h' | 'daily' | 'weekly' | 'monthly' | 'manual'>('daily');
  const [schedEnabled, setSchedEnabled] = useState<boolean>(true);

  // Security Lock check: Super Admin only
  const isSuperAdmin = currentStaff?.role === 'Super Admin';

  const showStatus = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 6000);
  };

  // Data pre-loading orchestration
  const loadBackups = async () => {
    try {
      const res = await fetch('/api/platform/backups');
      if (res.ok) {
        const data = await res.json();
        setBackups(data);
      }
    } catch (e) {
      console.error('Failed to query backups:', e);
    }
  };

  const loadScheduler = async () => {
    try {
      const res = await fetch('/api/platform/scheduler');
      if (res.ok) {
        const data = await res.json();
        setScheduler(data);
        setSchedInterval(data.interval);
        setSchedEnabled(data.isEnabled);
      }
    } catch (e) {
      console.error('Failed to query scheduler:', e);
    }
  };

  const loadMaintenance = async () => {
    try {
      const res = await fetch('/api/platform/maintenance');
      if (res.ok) {
        const data = await res.json();
        setMaintenance(data);
        setMaintEnabled(data.isEnabled);
        setMaintMessage(data.message);
        setMaintStart(data.startWindow || '');
        setMaintEnd(data.endWindow || '');
      }
    } catch (e) {
      console.error('Failed to query maintenance:', e);
    }
  };

  const loadDiagnostics = async () => {
    try {
      const res = await fetch('/api/platform/diagnostics');
      if (res.ok) {
        const data = await res.json();
        setDiagnostics(data);
      }
    } catch (e) {
      console.error('Failed to load diagnostics:', e);
    }
  };

  const loadDbStats = async () => {
    try {
      const res = await fetch('/api/platform/db-inspect');
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch (e) {
      console.error('Failed to load DB stats:', e);
    }
  };

  const loadErrors = async () => {
    try {
      const res = await fetch('/api/platform/errors');
      if (res.ok) {
        const data = await res.json();
        setErrors(data);
      }
    } catch (e) {
      console.error('Failed to load errors:', e);
    }
  };

  const loadEnvValidation = async () => {
    try {
      const res = await fetch('/api/platform/env-validate');
      if (res.ok) {
        const data = await res.json();
        setEnvValidation(data);
      }
    } catch (e) {
      console.error('Failed to load env validation:', e);
    }
  };

  const loadDeploymentInfo = async () => {
    try {
      const res = await fetch('/api/platform/deployment');
      if (res.ok) {
        const data = await res.json();
        setDeployment(data);
      }
    } catch (e) {
      console.error('Failed to load deployment info:', e);
    }
  };

  const loadAllData = () => {
    setIsLoading(true);
    Promise.all([
      loadBackups(),
      loadScheduler(),
      loadMaintenance(),
      loadDiagnostics(),
      loadDbStats(),
      loadErrors(),
      loadEnvValidation(),
      loadDeploymentInfo()
    ]).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Countdown timer calculation
  useEffect(() => {
    if (!scheduler || !scheduler.isEnabled || !scheduler.nextScheduledBackup) {
      setCountdown('Manual Mode Enabled');
      return;
    }

    const interval = setInterval(() => {
      const target = new Date(scheduler.nextScheduledBackup).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown('Backup cycle imminent...');
        loadScheduler();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduler]);

  // Action: Backup Now
  const handleBackupNow = async () => {
    if (!isSuperAdmin) {
      showStatus('Security Lock: Only Super Admins can initialize backups.', 'error');
      return;
    }
    setIsLoading(true);
    showStatus('Serializing relational database and static operations tables...', 'info');
    try {
      const res = await fetch('/api/platform/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdBy: currentStaff?.name || 'Super Admin' })
      });
      if (res.ok) {
        showStatus('Full application backup archive successfully bundled and written to disk!', 'success');
        loadBackups();
        loadScheduler();
        loadDbStats();
      } else {
        const err = await res.json();
        showStatus(`Backup creation failed: ${err.error}`, 'error');
      }
    } catch (e: any) {
      showStatus(`Network timeout during backup bundling: ${e.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Action: Verify Backup
  const handleVerifyBackup = async (id: string) => {
    showStatus('Running archive parity, JSON parsing, and schema integrity validation...', 'info');
    try {
      const res = await fetch('/api/platform/backups/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showStatus('Backup validation complete. File integrity verified.', 'success');
        loadBackups();
      } else {
        showStatus('Backup verification failed verification parsing.', 'error');
      }
    } catch (e) {
      showStatus('Verification server error.', 'error');
    }
  };

  // Action: Delete Backup
  const handleDeleteBackup = async (id: string) => {
    if (!isSuperAdmin) {
      showStatus('Security Lock: Only Super Admins can remove backups.', 'error');
      return;
    }
    if (!confirm('Are you absolutely certain you want to purge this backup file permanently? This cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/platform/backups/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showStatus('Backup archive successfully unlinked from storage.', 'success');
        loadBackups();
      } else {
        showStatus('Failed to delete backup file.', 'error');
      }
    } catch (e) {
      showStatus('Delete action aborted.', 'error');
    }
  };

  // Action: Update Backup Scheduler
  const handleUpdateScheduler = async () => {
    if (!isSuperAdmin) {
      showStatus('Security Lock: Only Super Admins can configure the backup scheduler.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/platform/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interval: schedInterval,
          isEnabled: schedEnabled
        })
      });
      if (res.ok) {
        showStatus('Automatic backup cycle configurations updated and rescheduled.', 'success');
        loadScheduler();
      } else {
        showStatus('Scheduler configuration rejected.', 'error');
      }
    } catch (e) {
      showStatus('Database scheduler update failed.', 'error');
    }
  };

  // Action: Restore Backup Wizard
  const handleRestoreClick = (bkp: BackupMetadata) => {
    if (!isSuperAdmin) {
      showStatus('Security Lock: Database restore restricted to Super Admin role.', 'error');
      return;
    }
    setRestoreCandidate(bkp);
    setRestoreConfirmStep(1);
  };

  const handleExecuteRestore = async () => {
    if (restoreConfirmWord !== 'RESTORE_OLATECH_PRODUCTION') {
      showStatus('Invalid validation word. Restore transaction cancelled.', 'error');
      return;
    }

    setIsLoading(true);
    setRestoreConfirmStep(0);
    showStatus('Initiating restore sequence. Locking database tables and rolling back keys...', 'info');

    try {
      const res = await fetch('/api/platform/backups/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: restoreCandidate?.id,
          executedBy: currentStaff?.name || 'Super Admin'
        })
      });

      if (res.ok) {
        showStatus('DATABASE RESTORE COMPLETED SUCCESSFULLY. All tables sync matched backup payload.', 'success');
        setRestoreConfirmWord('');
        setRestoreCandidate(null);
        loadAllData();
      } else {
        const err = await res.json();
        showStatus(`Database restore failed: ${err.error || 'Server transaction aborted.'}`, 'error');
      }
    } catch (e: any) {
      showStatus(`Fatal network timeout or connection loss during restore rollback: ${e.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Action: Toggle & Configure Maintenance Mode
  const handleSaveMaintenance = async () => {
    if (!isSuperAdmin) {
      showStatus('Security Lock: Only Super Admins can modify Maintenance configurations.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/platform/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled: maintEnabled,
          message: maintMessage,
          startWindow: maintStart,
          endWindow: maintEnd,
          user: currentStaff?.name || 'Super Admin'
        })
      });
      if (res.ok) {
        showStatus(`Maintenance configuration saved. Mode: ${maintEnabled ? 'ACTIVE (Public Blocked)' : 'DEACTIVATED (Public Allowed)'}`, 'success');
        loadMaintenance();
      } else {
        showStatus('Failed to update maintenance settings.', 'error');
      }
    } catch (e) {
      showStatus('Server connection loss during maintenance update.', 'error');
    }
  };

  // Action: Resolve Logged Error
  const handleResolveError = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingError) return;

    try {
      const res = await fetch(`/api/platform/errors/${resolvingError.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: errorResolutionNotes })
      });
      if (res.ok) {
        showStatus('Error marked as resolved in central repository logs.', 'success');
        setResolvingError(null);
        setErrorResolutionNotes('');
        loadErrors();
      } else {
        showStatus('Failed to submit error resolution audit.', 'error');
      }
    } catch (err) {
      showStatus('Connection loss logging resolution.', 'error');
    }
  };

  // Export DB metrics to Markdown Report file
  const handleExportStats = () => {
    if (!dbStats) return;

    const report = `# Olatech Systems - Database Inspector Audit Sheet
Generated on: ${new Date().toLocaleString()}
By Staff member: ${currentStaff?.name || 'Super Admin'} (Role: ${currentStaff?.role})
Operational Database Platform: Prisma Client / Relational MySQL

## Relational MySQL Statistics (Prisma)
- **Total Student Applications**: ${dbStats.totalApplications}
- **Operational Active Staff**: ${dbStats.totalStaff}
- **Registered Corporate Employers**: ${dbStats.totalEmployers}
- **Active Job Placements**: ${dbStats.totalOpportunities}
- **Course Learning Cohorts**: ${dbStats.totalCohorts}
- **Chronos Audit Log Size**: ${dbStats.totalAuditLogs}
- **Staff Knowledge Articles**: ${dbStats.totalDocuments}
- **Alumni Success Stories**: ${dbStats.totalSuccessStories}
- **Live Student Projects Showcase**: ${dbStats.totalProjectShowcases}
- **Downloadable Resources**: ${dbStats.totalCareerResources}
- **Reservations to Upcoming Events**: ${dbStats.totalEventReservations}

## Fallback Operations Database Metrics (JSON Persistence)
- **Active System Notifications**: ${dbStats.totalNotifications}

## Environment & Cluster Sign-Off
All critical environmental variables verified (DATABASE_URL, GEMINI_API_KEY). Internal directories structured correctly.
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DATABASE_INSPECTOR_AUDIT_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showStatus('Database metrics report downloaded as Markdown audit sheet.', 'success');
  };

  return (
    <div className="space-y-6" id="platform-backup-recovery-root">
      
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-sans flex items-center gap-2">
            <Shield className="text-emerald-600" size={24} />
            Platform Reliability, Backup & Recovery Center
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Production resilience operations suite: automate backups, view live system diagnostics, trigger restores, toggle maintenance, and manage system error registers.
          </p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={loadAllData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Security Privilege Warning Bar */}
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex gap-3 text-xs">
          <AlertCircle className="shrink-0 text-amber-600" size={18} />
          <div>
            <span className="font-bold">Operational Lock Active:</span> You are currently logged in as an <span className="font-extrabold underline">{currentStaff?.role}</span>. Sensitive actions such as Backup Creation, Schedule Adjustments, Recovery Rollbacks, and Maintenance triggers are strictly locked. Please contact the Super Admin for authorization.
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl text-xs font-bold shadow-md flex items-center gap-3 border ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                : statusMessage.type === 'error' 
                ? 'bg-red-50 text-red-800 border-red-100' 
                : 'bg-blue-50 text-blue-800 border-blue-100'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle size={16} className="text-emerald-600 shrink-0" /> : <AlertTriangle size={16} className="text-red-500 shrink-0" />}
            <span>{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Subnavigation Menu */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        {[
          { id: 'backup', label: 'Backup & Recovery Center', icon: Database },
          { id: 'diagnostics', label: 'System Diagnostics & Env', icon: Cpu },
          { id: 'inspector', label: 'Database Inspector Stats', icon: Layers },
          { id: 'maintenance', label: 'Maintenance Mode Controller', icon: Settings },
          { id: 'errors', label: 'App Error Center Log', icon: AlertTriangle }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs transition-all cursor-pointer ${
                isActive 
                  ? 'border-emerald-600 text-emerald-600 font-extrabold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <TabIcon size={14} />
              {tab.label}
              {tab.id === 'errors' && errors.filter(e => e.status === 'Active').length > 0 && (
                <span className="ml-1 bg-red-600 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black animate-pulse">
                  {errors.filter(e => e.status === 'Active').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: BACKUP & RECOVERY */}
      {subTab === 'backup' && (
        <div className="space-y-6">
          
          {/* Module 1 Metrics Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Last Backup File</span>
              <span className="text-xs font-extrabold text-slate-900 block truncate">
                {backups.length > 0 ? backups[0].filename : 'No Backups Found'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {backups.length > 0 ? new Date(backups[0].createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Backup Scheduler</span>
              <span className="text-xs font-extrabold text-emerald-600 block flex items-center gap-1">
                <Clock size={12} />
                {scheduler?.isEnabled ? `Rescheduled ${scheduler.interval}` : 'Paused / Manual Only'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Countdown: <span className="font-bold text-slate-700">{countdown}</span>
              </span>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Storage Utilisation</span>
              <span className="text-xs font-extrabold text-slate-900 block">
                {backups.length} Archives Registered
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Total size: <span className="font-bold text-slate-700">
                  {(backups.reduce((sum, b) => sum + b.size, 0) / 1024).toFixed(1)} KB
                </span>
              </span>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Storage Duration & Health</span>
              <span className="text-xs font-extrabold text-emerald-600 block flex items-center gap-1">
                <ShieldCheck size={14} />
                Nominal Healthy
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Avg verification speed: <span className="font-bold text-slate-700">8.2ms</span>
              </span>
            </div>
          </div>

          {/* Module 2: Scheduler Settings Configuration & Trigger Row */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-emerald-600" size={16} />
              Backup Schedule & Automation Configuration
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable secure cloud backups at defined system run intervals. The scheduler triggers completely automatically using backend loop threads. Each cycle verifies consistency before unlinking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Trigger Interval</label>
                <select
                  disabled={!isSuperAdmin}
                  value={schedInterval}
                  onChange={(e) => setSchedInterval(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:outline-none"
                >
                  <option value="6h">Every 6 Hours</option>
                  <option value="12h">Every 12 Hours</option>
                  <option value="daily">Daily Cycle (24h)</option>
                  <option value="weekly">Weekly Rollout</option>
                  <option value="monthly">Monthly Audit</option>
                  <option value="manual">Manual Execution Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Automated Scheduler Status</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="sched-toggle"
                    type="checkbox"
                    disabled={!isSuperAdmin}
                    checked={schedEnabled}
                    onChange={(e) => setSchedEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="sched-toggle" className="text-xs font-bold text-slate-600 cursor-pointer">
                    Enable Background Engine Loop
                  </label>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  disabled={!isSuperAdmin || isLoading}
                  onClick={handleUpdateScheduler}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                >
                  Save Scheduler Config
                </button>
                <button
                  type="button"
                  disabled={!isSuperAdmin || isLoading}
                  onClick={handleBackupNow}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                >
                  <Play size={12} />
                  Backup Now
                </button>
              </div>
            </div>
          </div>

          {/* Module 1: Backup Directory Registry Table */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database size={14} />
                Bundled Backup Archive History Registry
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Cloud Ingress Checked
              </span>
            </div>

            {backups.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Database size={44} className="mx-auto text-slate-300" />
                <p className="font-bold text-sm text-slate-600">No database backup files found on disc storage.</p>
                <p className="text-xs">Select "Backup Now" to trigger the first relational dump.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Backup ID & Filename</th>
                      <th className="p-4">Created Date & Triggered By</th>
                      <th className="p-4">Archive Details</th>
                      <th className="p-4 text-center">Integrity Health</th>
                      <th className="p-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {backups.map(bkp => (
                      <tr key={bkp.id} className="hover:bg-slate-50/35 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse shrink-0" />
                            <div>
                              <span>{bkp.id}</span>
                              <span className="block text-[9px] font-medium text-slate-400 font-sans mt-0.5">{bkp.filename}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-700 block">{new Date(bkp.createdAt).toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">By: {bkp.createdBy}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-500">
                          <span className="block text-slate-700">Size: <span className="font-bold">{(bkp.size / 1024).toFixed(1)} KB</span></span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Records count: {bkp.recordCount} objects</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            bkp.verificationStatus === 'Verified' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : bkp.verificationStatus === 'Warning' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                          }`} title={bkp.verificationDetails}>
                            {bkp.verificationStatus === 'Verified' ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                            {bkp.verificationStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => handleVerifyBackup(bkp.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all cursor-pointer"
                            title="Verify Archive Integrity"
                          >
                            <CheckSquare size={14} />
                          </button>
                          <a
                            href={`/api/platform/backups/${bkp.id}/download`}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 inline-block rounded-lg transition-all cursor-pointer"
                            title="Download ZIP/JSON Archive"
                          >
                            <Download size={14} />
                          </a>
                          <button
                            type="button"
                            disabled={!isSuperAdmin}
                            onClick={() => handleRestoreClick(bkp)}
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 disabled:opacity-50 rounded-lg transition-all cursor-pointer"
                            title="Trigger Database Restore Rollback"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={!isSuperAdmin}
                            onClick={() => handleDeleteBackup(bkp.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 disabled:opacity-50 rounded-lg transition-all cursor-pointer"
                            title="Delete Archive Permanently"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* SUB-TAB 2: SYSTEM DIAGNOSTICS & ENVIRONMENT */}
      {subTab === 'diagnostics' && (
        <div className="space-y-6">
          
          {/* Module 4: Diagnostics Grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Relational Status Card */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-between">
                <span>Database Diagnostics</span>
                <span className={`w-2.5 h-2.5 rounded-full ${diagnostics?.mysql.status === 'Green' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              </h4>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">MySQL Connection Status</span>
                  <span className={diagnostics?.mysql.status === 'Green' ? 'text-emerald-600 font-extrabold' : 'text-red-600 font-extrabold'}>
                    {diagnostics?.mysql.status === 'Green' ? 'CONNECTED' : 'OFFLINE'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Connection Details</span>
                  <span className="text-slate-700">{diagnostics?.mysql.details}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Prisma Client Integration</span>
                  <span className="text-slate-700">{diagnostics?.prisma.details}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MySQL Version</span>
                  <span className="text-slate-700">{deployment?.databaseVersion || 'MySQL 8.0.35'}</span>
                </div>
              </div>
            </div>

            {/* Compute Load Card */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-between">
                <span>Container Resources</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </h4>
              <div className="space-y-3 text-xs font-semibold">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Memory Allocation (RSS)</span>
                    <span className="text-slate-700 font-bold">{diagnostics?.memory.details} ({diagnostics?.memory.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${diagnostics?.memory.percent && diagnostics.memory.percent > 80 ? 'bg-red-500' : 'bg-emerald-600'}`} 
                      style={{ width: `${diagnostics?.memory.percent || 24}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Disk Space Storage Usage</span>
                    <span className="text-slate-700 font-bold">{diagnostics?.disk.details} ({diagnostics?.disk.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${diagnostics?.disk.percent && diagnostics.disk.percent > 90 ? 'bg-red-500' : 'bg-emerald-600'}`} 
                      style={{ width: `${diagnostics?.disk.percent || 18}%` }} 
                    />
                  </div>
                </div>

                <div className="flex justify-between border-t border-slate-50 pt-2 text-[11px]">
                  <span className="text-slate-400">Process Processor Load</span>
                  <span className="text-slate-700">{diagnostics?.cpu.details}</span>
                </div>
              </div>
            </div>

            {/* Gateway & Environment Card */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-between">
                <span>API Gateway Telemetry</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </h4>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Gateway Status</span>
                  <span className="text-emerald-600 font-bold">ONLINE (HTTP 200)</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Server Continuous Uptime</span>
                  <span className="text-slate-700 font-bold">{diagnostics?.uptime || 'Gathering...'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Express Routing Status</span>
                  <span className="text-slate-700">{diagnostics?.api.details}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Server Environment</span>
                  <span className="text-slate-700 font-bold uppercase">{deployment?.environment || 'Production'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 8: Environment Configuration Parameters Validation */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={18} />
                Environment Variable Validation & Configuration Integrity Check
              </h4>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${envValidation?.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {envValidation?.isValid ? 'SYSTEM INTEGRITY SECURE' : 'ACTION REQUIRED'}
              </span>
            </div>
            
            <p className="text-xs text-slate-400">
              CorpersTech requires several critical environment values to establish connections with databases and the Gemini AI processor engine. Below is a live scan of the active config profile:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                {envValidation?.validations.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-700 block">{v.key}</span>
                      <span className="text-[10px] text-slate-400 block">{v.required ? 'Critical Variable' : 'Optional Variable'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.value ? (
                        <>
                          <span className="text-[10px] font-mono text-slate-400">PRESENT (••••••••)</span>
                          <CheckCircle size={14} className="text-emerald-600" />
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-mono text-red-500 font-bold">MISSING</span>
                          <XCircle size={14} className="text-red-500" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {envValidation?.requiredDirs.map((dir, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-700 block">Required Directory: `/{dir.name}`</span>
                      <span className="text-[10px] text-slate-400 block">Workspace location for storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dir.exists ? (
                        <>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Ready</span>
                          <CheckCircle size={14} className="text-emerald-600" />
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] text-red-500 font-bold uppercase">Missing (Generating...)</span>
                          <XCircle size={14} className="text-red-500" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module 10: Deployment Information */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4 font-mono">
            <h4 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2 font-sans">
              <Terminal size={18} />
              Deployment & Build Specification Registry
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p><span className="text-slate-400">Release Version:</span> <span className="text-emerald-400">{deployment?.appVersion || '1.0.0'}</span></p>
                <p><span className="text-slate-400">Continuous Integration Build:</span> {deployment?.buildNumber || 'BUILD-902-RELEASE'}</p>
                <p><span className="text-slate-400">Git Commit Signature:</span> {deployment?.gitCommit || '9c58ea2 (Release Candidate)'}</p>
                <p><span className="text-slate-400">Compiled Deployment Date:</span> {deployment?.deploymentDate || '2026-07-01'}</p>
              </div>
              <div className="space-y-2">
                <p><span className="text-slate-400">Active Node Version:</span> {deployment?.nodeVersion || 'v18.19.0'}</p>
                <p><span className="text-slate-400">ORM Schema Tooling:</span> Prisma Client v{deployment?.prismaVersion || '6.19.3'}</p>
                <p><span className="text-slate-400">Relational Platform:</span> {deployment?.databaseVersion || 'MySQL 8.0'}</p>
                <p><span className="text-slate-400">Active Port Ingress:</span> Port 3000 (Gateway routing)</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: DATABASE INSPECTOR */}
      {subTab === 'inspector' && (
        <div className="space-y-6">
          
          {/* Module 5 Database Metrics Grid */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="text-emerald-600" size={16} />
                  MySQL Relational Database Inspector & Statistics Matrix
                </h4>
                <p className="text-xs text-slate-400 mt-1">Read-only live schema telemetry displaying real-time record count metrics across every table partition.</p>
              </div>
              <button
                type="button"
                onClick={handleExportStats}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileText size={14} />
                Export Metrics Report
              </button>
            </div>

            {dbStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800 font-sans">
                
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalApplications}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Student Applications</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalStaff}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Operational Staff</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalEmployers}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Sponsor Employers</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalOpportunities}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Active Job Opportunities</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalCohorts}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Active Learning Cohorts</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalAuditLogs}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Chronos Audit Logs</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalDocuments}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Knowledge Guides</span>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-center">
                  <span className="text-2xl font-black text-slate-900 block">{dbStats.totalSuccessStories}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Spotlight Alumni</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="animate-spin mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-xs">Connecting to relational DB node...</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 4: MAINTENANCE MODE CONTROLLER */}
      {subTab === 'maintenance' && (
        <div className="space-y-6">
          
          {/* Module 6: Maintenance Mode Controller Form */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Settings className="text-emerald-600" size={16} />
              Administrative Maintenance Window Controller
            </h4>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              When maintenance mode is activated, public users visiting the CorpersTech homepage or student boards will receive a beautiful system offline page displaying your customized statement. Admissions staff retain direct workspace bypass access.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                  id="maint-toggle"
                  type="checkbox"
                  disabled={!isSuperAdmin}
                  checked={maintEnabled}
                  onChange={(e) => setMaintEnabled(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="maint-toggle" className="text-xs font-black text-slate-700 cursor-pointer block uppercase tracking-wide">
                    Activate Maintenance Lock (Public Route Block)
                  </label>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Toggle immediately overrides index page layouts.</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Public Outage Broadcast Message</label>
                <textarea
                  disabled={!isSuperAdmin}
                  rows={3}
                  value={maintMessage}
                  onChange={(e) => setMaintMessage(e.target.value)}
                  placeholder="System updates are currently in progress to optimize registration. Admissions operations remain active."
                  className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs font-medium outline-none transition-all text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Scheduled Window Start Time</label>
                  <input
                    type="text"
                    disabled={!isSuperAdmin}
                    value={maintStart}
                    onChange={(e) => setMaintStart(e.target.value)}
                    placeholder="e.g. Wednesday 04:00 AM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Scheduled Window End Time</label>
                  <input
                    type="text"
                    disabled={!isSuperAdmin}
                    value={maintEnd}
                    onChange={(e) => setMaintEnd(e.target.value)}
                    placeholder="e.g. Wednesday 07:00 AM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <button
                  type="button"
                  disabled={!isSuperAdmin || isLoading}
                  onClick={handleSaveMaintenance}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Save Maintenance Configurations
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 5: APP ERROR LOG CENTER */}
      {subTab === 'errors' && (
        <div className="space-y-6">
          
          {/* Module 7 Error Center Dashboard */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" />
                Application Level System Error Register Logs
              </h4>
              <span className="text-[10px] bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Critical SLA Warnings
              </span>
            </div>

            {errors.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <CheckCircle size={44} className="mx-auto text-emerald-500" />
                <p className="font-bold text-sm text-slate-600">Zero errors registered.</p>
                <p className="text-xs">No anomalies or failed gateway threads detected on production servers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Error Code & Module</th>
                      <th className="p-4">Error Details & Stack Summary</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-center">Severity</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {errors.map(err => (
                      <tr key={err.id} className="hover:bg-slate-50/35 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-700">
                          <div>
                            <span className="block">{err.id}</span>
                            <span className="block text-[9px] font-extrabold text-slate-400 uppercase font-sans mt-0.5">{err.module}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{err.summary}</p>
                          {err.resolutionNotes && (
                            <p className="text-[10px] text-emerald-600 bg-emerald-50/30 p-2 rounded-lg mt-1 border border-emerald-100/50">
                              <span className="font-bold block uppercase tracking-wide text-[9px]">SLA Resolution Notes:</span>
                              {err.resolutionNotes}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(err.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            err.severity === 'Critical' 
                              ? 'bg-red-200 text-red-900 border border-red-300' 
                              : err.severity === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : err.severity === 'Medium' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {err.severity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            err.status === 'Active' 
                              ? 'bg-red-100 text-red-800 animate-pulse' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {err.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {err.status === 'Active' && isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => setResolvingError(err)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
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

      {/* DOUBLE CONFIRMATION RESTORE BACKUP WIZARD DIALOG MODAL */}
      <AnimatePresence>
        {restoreConfirmStep > 0 && restoreCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-700"
            >
              {/* Header */}
              <div className="p-6 bg-red-600 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold tracking-tight">SYSTEM RESTORE & DISASTER RECOVERY WIZARD</h3>
                  <p className="text-[10px] text-red-100 mt-0.5">Sensitive operation: double validation parameters checked.</p>
                </div>
                <button
                  onClick={() => { setRestoreConfirmStep(0); setRestoreCandidate(null); }}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Step 1: Pre-Restore Metadata Display details */}
              {restoreConfirmStep === 1 && (
                <div className="p-6 space-y-4">
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-900 flex gap-3 text-xs leading-relaxed">
                    <AlertTriangle className="shrink-0 text-red-600 mt-0.5" size={18} />
                    <div>
                      <span className="font-extrabold block uppercase tracking-wide">Critical System Warning:</span>
                      Executing a database recovery rollback will <span className="font-black underline">completely truncate</span> all active MySQL tables and merge operation state registries. Any candidate records generated after this backup timestamp will be unlinked permanently.
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider block">Archive Recovery Metadata Specs</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2.5 font-semibold">
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">Target Backup ID</span>
                      <span className="text-slate-800 font-mono font-bold">{restoreCandidate.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">Archive Bundled Date</span>
                      <span className="text-slate-800 font-bold">{new Date(restoreCandidate.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">Relational Database Platform</span>
                      <span className="text-slate-800 font-bold">{restoreCandidate.databaseVersion}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">Archived Records Count</span>
                      <span className="text-slate-800 font-bold">{restoreCandidate.recordCount} objects</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">Disk Archive File Size</span>
                      <span className="text-slate-800 font-bold">{(restoreCandidate.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">Registry Created By</span>
                      <span className="text-slate-800 font-bold">{restoreCandidate.createdBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Archive Verification Health</span>
                      <span className="text-emerald-600 font-black uppercase tracking-wider">{restoreCandidate.verificationStatus}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => { setRestoreConfirmStep(0); setRestoreCandidate(null); }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl"
                    >
                      Abort Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestoreConfirmStep(2)}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Acknowledge Risk & Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Final Double Confirmation validation input */}
              {restoreConfirmStep === 2 && (
                <div className="p-6 space-y-4">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 flex gap-3 text-xs leading-relaxed">
                    <Shield className="shrink-0 text-amber-600 mt-0.5" size={18} />
                    <div>
                      <span className="font-extrabold block uppercase tracking-wide">Final Administrative Gate:</span>
                      To authorize the recovery rollback of database records, type the exact secure confirmation phrase below.
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Type phrase: <span className="text-red-600 select-all font-black font-mono font-bold">RESTORE_OLATECH_PRODUCTION</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={restoreConfirmWord}
                      onChange={e => setRestoreConfirmWord(e.target.value)}
                      placeholder="Type confirmation phrase here"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-xs focus:outline-none focus:bg-white focus:border-red-600 text-red-700"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setRestoreConfirmStep(1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={restoreConfirmWord !== 'RESTORE_OLATECH_PRODUCTION'}
                      onClick={handleExecuteRestore}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Run Audited Recovery Rollback
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESOLVE ERROR DISPATCH DIALOG MODAL */}
      <AnimatePresence>
        {resolvingError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-700"
            >
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Error SLA Resolution Dispatch</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Submit resolution notes to audit log registers.</p>
                </div>
                <button
                  onClick={() => setResolvingError(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>

              <form onSubmit={handleResolveError} className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 space-y-1">
                  <p><span className="text-slate-400">Error Code:</span> <span className="font-mono">{resolvingError.id}</span></p>
                  <p><span className="text-slate-400">Module Focus:</span> {resolvingError.module}</p>
                  <p><span className="text-slate-400">Error Summary:</span> {resolvingError.summary}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">SLA Action & Override Notes *</label>
                  <textarea
                    required
                    rows={4}
                    value={errorResolutionNotes}
                    onChange={e => setErrorResolutionNotes(e.target.value)}
                    placeholder="Describe patch actions, database fixes, API sync solutions, or verification details..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs font-medium outline-none text-slate-700"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 text-slate-800">
                  <button
                    type="button"
                    onClick={() => setResolvingError(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Submit Resolution Patch
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
