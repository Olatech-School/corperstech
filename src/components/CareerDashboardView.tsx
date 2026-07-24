import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Compass, MapPin, Calendar, Clock, BookOpen, Laptop, Briefcase, Award,
  FileText, CheckCircle2, ArrowRight, Download, Users, Star, ChevronRight,
  ExternalLink, Github, Search, Filter, Shield, Terminal, Palette, UserCheck,
  TrendingUp, Heart, Share2, Eye, Bell, CheckSquare, Zap, MessageSquare,
  DollarSign, RefreshCw, Send, AlertCircle, ChevronDown, Check, X, Info, Globe,
  QrCode, Printer, Video, Loader2, Trash2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getStudentSessionEmail, setStudentSessionEmail, clearStudentSessionEmail } from '../utils/session.ts';

export default function CareerDashboardView() {
  const [email, setEmail] = useState<string>(() => {
    return getStudentSessionEmail();
  });
  const [searchEmail, setSearchEmail] = useState<string>(() => {
    return getStudentSessionEmail();
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student Login Portal State
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Profile Edit fields
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editSkills, setEditSkills] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // CV Evaluation field
  const [cvText, setCvText] = useState('');
  const [isEvaluatingCv, setIsEvaluatingCv] = useState(false);
  const [cvFeedback, setCvFeedback] = useState<any>(null);

  // Chat Coach state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { role: 'model', text: 'Hello! I am your Olatech AI Career Coach. Ask me any questions about active opportunities, optimizing your CV, or designing your portfolio.' }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Active sub-tab inside the Dashboard
  // options: 'overview', 'analytics', 'matching', 'cv', 'tracker', 'coach'
  const [activeTab, setActiveTab] = useState('overview');

  // Load everything for the specified email
  const fetchAllData = async (targetEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Dashboard
      const dashRes = await fetch(`/api/career/dashboard?email=${encodeURIComponent(targetEmail)}`);
      const dashResult = await dashRes.json();
      if (!dashRes.ok || !dashResult.success) {
        throw new Error(dashResult.error || 'Failed to retrieve dashboard data.');
      }
      setDashboardData(dashResult.data);

      // Pre-populate edit form fields
      setEditSkills(dashResult.data.profile.skills || '');
      setEditLinkedin(dashResult.data.profile.linkedinUrl || '');
      setEditGithub(dashResult.data.profile.githubUrl || '');
      setEditPortfolio(dashResult.data.profile.portfolioUrl || '');
      setCvText(dashResult.data.profile.cvText || '');
      if (dashResult.data.profile.cvFeedback) {
        setCvFeedback({
          score: dashResult.data.profile.cvReadinessScore,
          feedback: dashResult.data.profile.cvFeedback
        });
      }

      // 2. Analytics
      const analRes = await fetch(`/api/career/analytics?email=${encodeURIComponent(targetEmail)}`);
      const analResult = await analRes.json();
      if (analRes.ok && analResult.success) {
        setAnalyticsData(analResult.data);
      }

      // 3. Roadmap
      const roadRes = await fetch(`/api/career/roadmap?email=${encodeURIComponent(targetEmail)}`);
      const roadResult = await roadRes.json();
      if (roadRes.ok && roadResult.success) {
        setRoadmapData(roadResult.data);
      }

      // 4. Notifications
      const notifRes = await fetch(`/api/career/notifications?email=${encodeURIComponent(targetEmail)}`);
      const notifResult = await notifRes.json();
      if (notifRes.ok && notifResult.success) {
        setNotifications(notifResult.data);
      }

      setEmail(targetEmail);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchAllData(email);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setLoginError("Please enter your registered email address.");
      return;
    }
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await fetch(`/api/career/dashboard?email=${encodeURIComponent(loginInput.trim())}`);
      const result = await res.json();
      if (!res.ok || !result.success) {
        setLoginError(result.error || "No registered enrollment found for this email address.");
      } else {
        setStudentSessionEmail(loginInput.trim());
        setEmail(loginInput.trim());
        setSearchEmail(loginInput.trim());
        setDashboardData(result.data);
        fetchAllData(loginInput.trim());
      }
    } catch (err: any) {
      setLoginError("Failed to authenticate with database. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearStudentSessionEmail();
    setEmail('');
    setSearchEmail('');
    setDashboardData(null);
    setAnalyticsData(null);
    setRoadmapData(null);
    setNotifications([]);
    setError(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      fetchAllData(searchEmail.trim());
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (oppId: number) => {
    try {
      const res = await fetch('/api/career/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, opportunityId: oppId })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Reload dashboard and notifications
        const dashRes = await fetch(`/api/career/dashboard?email=${encodeURIComponent(email)}`);
        const dashResult = await dashRes.json();
        if (dashRes.ok && dashResult.success) {
          setDashboardData(dashResult.data);
        }
        const notifRes = await fetch(`/api/career/notifications?email=${encodeURIComponent(email)}`);
        const notifResult = await notifRes.json();
        if (notifRes.ok && notifResult.success) {
          setNotifications(notifResult.data);
        }
      }
    } catch (err) {
      console.error('Error bookmarking:', err);
    }
  };

  // Apply for Job
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const handleApply = async (oppId: number) => {
    setApplyingId(oppId);
    try {
      const res = await fetch('/api/career/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, opportunityId: oppId })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.error || 'Failed to submit application.');
      } else {
        // Reload dashboard, notifications & analytics
        fetchAllData(email);
        alert('Application submitted successfully! Your tracking record has been logged.');
      }
    } catch (err) {
      console.error('Apply error:', err);
    } finally {
      setApplyingId(null);
    }
  };

  // Update Application Status in Tracker
  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/career/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchAllData(email);
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  // Update Profile Skills & Links
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/career/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          skills: editSkills,
          linkedinUrl: editLinkedin,
          githubUrl: editGithub,
          portfolioUrl: editPortfolio
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setIsEditProfileOpen(false);
        fetchAllData(email);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Evaluate CV
  const handleEvaluateCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) return;
    setIsEvaluatingCv(true);
    try {
      const res = await fetch('/api/career/cv-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cvText })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setCvFeedback(result.data);
        fetchAllData(email);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluatingCv(false);
    }
  };

  // Chat with Coach
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isSendingChat) return;

    const userMsgText = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsgText }]);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/career/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message: userMsgText,
          history: chatHistory
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setChatHistory(prev => [...prev, { role: 'model', text: result.reply }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an issue while generating a professional answer. Please verify your connection.' }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', text: 'Error: Connection reset. Please make sure the backend server is active.' }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Mark all notifications read
  const handleMarkNotificationsRead = async () => {
    try {
      const res = await fetch('/api/career/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Color keys for Pie chart
  const COLORS = ['#F59E0B', '#3B82F6', '#6366F1', '#10B981', '#16A34A'];

  if (!email) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6 text-left"
        >
          <div className="space-y-2 text-center">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200 uppercase tracking-wider inline-block">
              Corps Member Portal
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Career Dashboard</h2>
            <p className="text-xs text-slate-500">
              Sign in with your registered email address to check your placement status, view roadmap milestones, and consult the AI coach.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Registered Email Address</label>
              <input 
                type="email" 
                required
                placeholder="e.g. chinedu@gmail.com" 
                value={loginInput}
                onChange={e => {
                  setLoginInput(e.target.value);
                  setLoginError(null);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>

            {loginError && (
              <p className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center gap-1.5">
                <AlertCircle size={12} /> {loginError}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <RefreshCw size={14} className="animate-spin" /> : "Open Dashboard"}
              {!isLoggingIn && <ArrowRight size={14} />}
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-400 font-medium">
            Not registered yet? Use the <strong>Admissions / Registration</strong> tab to apply first.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      
      {/* 1. Profile Search & Welcome Panel */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/25 uppercase tracking-wider inline-flex items-center gap-1.5">
               Phase 5.3: Automated Career Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
              My <span className="text-emerald-400">Career Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Compare matched opportunities, track submitted contracts, evaluate your resume, and consult your Olatech AI Career Coach in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick email switcher */}
            <form onSubmit={handleSearchSubmit} className="bg-white/5 p-2 rounded-2xl border border-white/10 flex items-center gap-2 max-w-md w-full sm:w-auto">
              <Search size={14} className="text-slate-400 ml-2" />
              <input 
                type="text" 
                placeholder="Load profile email..." 
                value={searchEmail} 
                onChange={e => setSearchEmail(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none placeholder-slate-500 w-full sm:w-48"
              />
              <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition-all">
                Load
              </button>
            </form>

            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 text-[10px] font-black rounded-2xl transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="animate-spin text-emerald-600" size={36} />
          <p className="text-xs font-bold text-slate-500">Retrieving personalized matching registers...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-3xl flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm">Database Sync Error</h3>
            <p className="text-xs leading-relaxed">{error}</p>
            <button onClick={() => fetchAllData(email)} className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black rounded-xl transition-all">
              Retry Sync
            </button>
          </div>
        </div>
      )}

      {/* Main Board Content */}
      {dashboardData && !isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Metrics & Nav (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Overview Card */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-5 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center border border-emerald-100 text-lg">
                    {dashboardData.enrollment.firstName[0]}{dashboardData.enrollment.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 tracking-tight leading-tight">
                      {dashboardData.enrollment.firstName} {dashboardData.enrollment.lastName}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mt-0.5">
                      {dashboardData.enrollment.nyscBatch}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black transition-all"
                >
                  Edit Links
                </button>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div className="space-y-0.5 text-xs text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400">📍 NYSC State</span>
                  <p className="font-bold text-slate-700">{dashboardData.enrollment.stateOfService}</p>
                </div>
                <div className="space-y-0.5 text-xs text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400">🎓 Stream</span>
                  <p className="font-bold text-slate-700 truncate">{dashboardData.enrollment.course}</p>
                </div>
              </div>

              {/* Core metrics circular bars */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Readiness Score</span>
                  <p className="text-2xl font-black text-emerald-600 font-sans">{dashboardData.profile.readinessScore}<span className="text-xs text-emerald-400">/100</span></p>
                  <span className="text-[9px] text-slate-400 font-semibold block">ATS-integrated</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Profile Built</span>
                  <p className="text-2xl font-black text-indigo-600 font-sans">{dashboardData.profile.completionPercentage}<span className="text-xs text-indigo-400">%</span></p>
                  <span className="text-[9px] text-slate-400 font-semibold block">Completion progress</span>
                </div>
              </div>

              {/* Verified links list */}
              <div className="space-y-2 text-xs pt-1">
                {dashboardData.profile.linkedinUrl && (
                  <a href={dashboardData.profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border border-slate-100 text-slate-500 hover:text-slate-800 transition-all">
                    <span className="flex items-center gap-1.5"><Globe size={13} className="text-blue-500" /> LinkedIn Profile</span>
                    <ExternalLink size={11} />
                  </a>
                )}
                {dashboardData.profile.githubUrl && (
                  <a href={dashboardData.profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border border-slate-100 text-slate-500 hover:text-slate-800 transition-all">
                    <span className="flex items-center gap-1.5"><Github size={13} className="text-slate-800" /> GitHub Repo</span>
                    <ExternalLink size={11} />
                  </a>
                )}
                {dashboardData.profile.portfolioUrl && (
                  <a href={dashboardData.profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border border-slate-100 text-slate-500 hover:text-slate-800 transition-all">
                    <span className="flex items-center gap-1.5"><Award size={13} className="text-emerald-500" /> Live Portfolio</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Side Navigation list */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-2.5 shadow-sm space-y-1">
              {[
                { id: 'overview', label: 'Overview Board', icon: Compass },
                { id: 'analytics', label: 'Career Analytics', icon: TrendingUp },
                { id: 'matching', label: 'My Placements Match', icon: Briefcase, badge: `${dashboardData.recommendedJobs.length + dashboardData.recommendedInternships.length} opportunities` },
                { id: 'cv', label: 'AI CV Auditor', icon: FileText, badge: `${dashboardData.profile.cvReadinessScore}% score` },
                { id: 'tracker', label: 'Application Tracker', icon: CheckSquare, count: dashboardData.submittedApplications.length },
                { id: 'coach', label: 'Consult AI Coach', icon: MessageSquare, badge: 'Active' },
                { id: 'events', label: 'My Upcoming Events', icon: Calendar, badge: 'Tickets & QR' }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TabIcon size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                    {tab.count !== undefined && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-emerald-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic AI Advice Snippet Box */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-5 shadow-md border border-slate-850 space-y-3 relative overflow-hidden">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block font-mono">Olatech AI Coach Briefing</span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                "{dashboardData.aiAdvice}"
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[9px] text-slate-400 font-bold">Updated: Just Now</span>
                <button 
                  onClick={() => setActiveTab('coach')}
                  className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                >
                  Ask advice <ArrowRight size={10} />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Stage Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Notification Board Trigger Header */}
            {notifications.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5 shrink-0">
                    <Bell size={18} className={notifications.some(n => !n.isRead) ? 'animate-bounce' : ''} />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">Personal Career Notifications</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">You have {notifications.filter(n => !n.isRead).length} unread updates.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleMarkNotificationsRead}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-black transition-all"
                  >
                    Mark read
                  </button>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6 text-xs"
              >
                
                {/* SUB-VIEW 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Welcome Header */}
                    <div className="border-l-4 border-emerald-500 pl-4 py-1 text-left">
                      <h2 className="text-xl font-black text-slate-800">My Placement Home</h2>
                      <p className="text-xs text-slate-500">Track and synchronize all your career actions, matched roles, and upcoming milestones.</p>
                    </div>

                    {/* Quick bento cards matching list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Top Match Job Card */}
                      <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm space-y-4 flex flex-col justify-between text-left">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-emerald-600">Highest Compatible Job</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-extrabold rounded-md text-[9px]">95% Match</span>
                          </div>
                          {dashboardData.recommendedJobs[0] ? (
                            <>
                              <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                                {dashboardData.recommendedJobs[0].jobTitle}
                              </h3>
                              <p className="text-slate-500 text-[11px] leading-relaxed truncate-2-lines">
                                {dashboardData.recommendedJobs[0].description}
                              </p>
                              <p className="font-bold text-slate-700">{dashboardData.recommendedJobs[0].employer.name} • {dashboardData.recommendedJobs[0].salary || 'Unspecified'}</p>
                            </>
                          ) : (
                            <p className="text-slate-400">No recommended entry level jobs matched yet.</p>
                          )}
                        </div>
                        <button 
                          onClick={() => setActiveTab('matching')}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 text-[10px]"
                        >
                          View Matching Centre <ArrowRight size={11} />
                        </button>
                      </div>

                      {/* Top Scholarship / Fellowship Card */}
                      <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm space-y-4 flex flex-col justify-between text-left">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-indigo-600">Featured Scholarship</span>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 font-extrabold rounded-md text-[9px]">Olatech Fund</span>
                          </div>
                          {dashboardData.recommendedScholarships[0] ? (
                            <>
                              <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                                {dashboardData.recommendedScholarships[0].jobTitle}
                              </h3>
                              <p className="text-slate-500 text-[11px] leading-relaxed truncate-2-lines">
                                {dashboardData.recommendedScholarships[0].description}
                              </p>
                              <p className="font-bold text-indigo-600">{dashboardData.recommendedScholarships[0].salary || 'Tuition Coverage'}</p>
                            </>
                          ) : (
                            <p className="text-slate-400">No matched scholarships in queue.</p>
                          )}
                        </div>
                        <button 
                          onClick={() => setActiveTab('matching')}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 text-[10px]"
                        >
                          Explore Opportunities <ArrowRight size={11} />
                        </button>
                      </div>

                    </div>

                    {/* Deadline Watchlist reminders */}
                    <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm space-y-4 text-left">
                      <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Clock size={16} className="text-amber-500" /> Watchlist & Deadline Reminders
                      </h3>
                      {dashboardData.savedOpportunities.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                          <p>Your watchlist is empty. Bookmark roles from the Placements Match tab to monitor expiry deadlines.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dashboardData.savedOpportunities.map((op: any) => {
                            const dlDays = Math.max(1, Math.round((new Date(op.applicationDeadline || '').getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
                            const isExpiring = dlDays <= 10;
                            return (
                              <div key={op.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <h4 className="font-bold text-slate-800 leading-tight truncate max-w-[200px]">{op.jobTitle}</h4>
                                  <p className="text-slate-400 text-[10px] font-semibold">{op.employer.name}</p>
                                  {op.applicationDeadline && (
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase inline-block mt-1 ${
                                      isExpiring ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      ⌛ {isExpiring ? `Expires in ${dlDays} Days!` : `Deadline: ${op.applicationDeadline}`}
                                    </span>
                                  )}
                                </div>
                                <button 
                                  onClick={() => handleToggleBookmark(op.id)}
                                  className="text-slate-400 hover:text-red-500 p-1 bg-white hover:bg-red-50 rounded-lg border border-slate-100 transition-colors"
                                  title="Remove Bookmark"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Personalized Roadmap */}
                    {roadmapData && (
                      <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                            <Compass size={16} className="text-emerald-600" /> Personal Career Roadmap
                          </h3>
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            Course: {roadmapData.program}
                          </span>
                        </div>
                        <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6 py-1">
                          {roadmapData.steps.map((step: any, idx: number) => (
                            <div key={idx} className="relative group text-left">
                              <span className={`absolute -left-[32px] top-0 w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-black shadow-sm ${
                                step.status === 'completed' 
                                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                                  : step.status === 'current'
                                    ? 'bg-slate-900 border-slate-900 text-emerald-400 scale-110'
                                    : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                {step.status === 'completed' ? '✓' : idx + 1}
                              </span>
                              <div className="space-y-0.5">
                                <h4 className="font-extrabold text-slate-800">{step.title} <span className="font-mono text-[9px] text-slate-400 ml-1.5">{step.time}</span></h4>
                                <p className="text-slate-500 text-[11px] leading-relaxed">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* SUB-VIEW 2: CAREER ANALYTICS */}
                {activeTab === 'analytics' && analyticsData && (
                  <div className="space-y-6 text-left">
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                      <h2 className="text-xl font-black text-slate-800">Placement Analytics</h2>
                      <p className="text-xs text-slate-500">Monitor response funnels, application load trend, and your progressive Career Readiness Score.</p>
                    </div>

                    {/* Metric Bento Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Applications</span>
                        <p className="text-2xl font-black text-slate-800 font-sans">{analyticsData.metrics.applicationsSubmitted}</p>
                        <span className="text-[9px] text-emerald-600 font-semibold block">✓ Logged in db</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Interviews</span>
                        <p className="text-2xl font-black text-slate-800 font-sans">{analyticsData.metrics.interviewsObtained}</p>
                        <span className="text-[9px] text-amber-500 font-semibold block">⌛ Waiting reply</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Offers Received</span>
                        <p className="text-2xl font-black text-emerald-600 font-sans">{analyticsData.metrics.offersReceived}</p>
                        <span className="text-[9px] text-slate-400 block">Pending verification</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Response Rate</span>
                        <p className="text-2xl font-black text-indigo-600 font-sans">{analyticsData.metrics.responseRate}%</p>
                        <span className="text-[9px] text-indigo-500 font-semibold block">Outstanding ratio</span>
                      </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Application trend */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">Application Load Volume</h3>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.charts.applicationVolume} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                              <Tooltip cursor={{ fill: '#f8fafc' }} />
                              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Career Readiness Progress */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">Readiness Score Trend</h3>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.charts.readinessProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                              <Tooltip />
                              <Area type="monotone" dataKey="score" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorReadiness)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Funnel distribution stages */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 md:col-span-2">
                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">Application Stages Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          <div className="h-44 md:col-span-5">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <Pie
                                  data={analyticsData.charts.stagesDistribution}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {analyticsData.charts.stagesDistribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          {/* Legend markers */}
                          <div className="md:col-span-7 grid grid-cols-2 gap-3">
                            {analyticsData.charts.stagesDistribution.map((entry: any, index: number) => (
                              <div key={entry.name} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <div className="text-[10px] leading-tight">
                                  <span className="text-slate-400 block">{entry.name}</span>
                                  <span className="font-bold text-slate-700">{entry.value} Records</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUB-VIEW 3: PLACEMENTS MATCH */}
                {activeTab === 'matching' && (
                  <div className="space-y-6 text-left">
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                      <h2 className="text-xl font-black text-slate-800">Recruitment Matching Center</h2>
                      <p className="text-xs text-slate-500">Olatech AI correlates verified opportunity skills, stipend estimates, and location plans against your profile.</p>
                    </div>

                    {/* Jobs & Internships tabs */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm">Verified Jobs & Placements</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          ...dashboardData.recommendedJobs,
                          ...dashboardData.recommendedInternships,
                          ...dashboardData.recommendedScholarships
                        ].map((op: any) => {
                          const isBookmarked = dashboardData.savedOpportunities.some((s: any) => s.id === op.id);
                          const hasApplied = dashboardData.submittedApplications.some((a: any) => a.opportunityId === op.id);
                          return (
                            <OpportunityAccordionCard 
                              key={op.id} 
                              opp={op} 
                              isBookmarked={isBookmarked}
                              hasApplied={hasApplied}
                              onToggleBookmark={() => handleToggleBookmark(op.id)}
                              onApply={() => handleApply(op.id)}
                              isApplying={applyingId === op.id}
                            />
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* SUB-VIEW 4: AI CV AUDITOR */}
                {activeTab === 'cv' && (
                  <div className="space-y-6 text-left">
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                      <h2 className="text-xl font-black text-slate-800">AI CV Auditor</h2>
                      <p className="text-xs text-slate-500">Paste your technical resume details below. Olatech AI scans keywords, structure, and calculates an ATS score.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Paste Box */}
                      <div className="md:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                        <form onSubmit={handleEvaluateCv} className="space-y-3">
                          <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">My CV text (Plain English)</label>
                          <textarea
                            value={cvText}
                            onChange={e => setCvText(e.target.value)}
                            placeholder="SAMUEL OKON... Skills: React, Tailwind... B.Sc Computer Science..."
                            rows={12}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all leading-relaxed"
                          />
                          <button
                            type="submit"
                            disabled={isEvaluatingCv || !cvText.trim()}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isEvaluatingCv ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" /> Analyzing CV Structure...
                              </>
                            ) : (
                              <>
                                 Audit with Olatech AI
                              </>
                            )}
                          </button>
                        </form>
                      </div>

                      {/* Result audit board */}
                      <div className="md:col-span-5 space-y-4">
                        {cvFeedback ? (
                          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-5">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">ATS Audit Result</span>
                              <h3 className="text-xl font-black">CV Readiness</h3>
                            </div>

                            <div className="flex items-baseline gap-1.5">
                              <span className="text-5xl font-black tracking-tight text-emerald-400">{cvFeedback.score}</span>
                              <span className="text-slate-400 font-bold">/100 readiness</span>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-white/5 text-xs">
                              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                                <Info size={14} className="text-emerald-400" /> Coaching Recommendations:
                              </h4>
                              <p className="text-slate-400 leading-relaxed text-[11px]">
                                {cvFeedback.feedback}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-6 text-center text-slate-400 h-full flex flex-col items-center justify-center space-y-2">
                            <FileText size={32} className="text-slate-300" />
                            <p className="font-bold text-xs">Awaiting evaluation</p>
                            <p className="text-[11px] text-slate-400 leading-normal max-w-xs">Paste your technical resume to obtain interactive score charts and personalized feedback.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* SUB-VIEW 5: APPLICATION TRACKER */}
                {activeTab === 'tracker' && (
                  <div className="space-y-6 text-left">
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                      <h2 className="text-xl font-black text-slate-800">Placement Application Tracker</h2>
                      <p className="text-xs text-slate-500">Track and manage recruitment stages for submitted opportunities. Simulate state transitions dynamically.</p>
                    </div>

                    {dashboardData.submittedApplications.length === 0 ? (
                      <div className="bg-white p-12 text-center text-slate-400 rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center space-y-3">
                        <CheckSquare size={36} className="text-slate-300" />
                        <h4 className="font-bold text-slate-700 text-xs sm:text-sm">No Active Applications Tracker</h4>
                        <p className="text-xs text-slate-400 max-w-sm">You haven't submitted any contracts yet. Head over to the matched list, choose an opportunity, and submit to populate the timeline trackers.</p>
                        <button 
                          onClick={() => setActiveTab('matching')}
                          className="px-4 py-2 bg-slate-900 text-white font-extrabold rounded-xl text-[10px] hover:bg-slate-850"
                        >
                          Explore Opportunities
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {dashboardData.submittedApplications.map((app: any) => (
                          <div key={app.id} className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-sm font-extrabold text-slate-800">{app.opportunity.jobTitle}</h3>
                                <p className="text-slate-400 text-[10px] font-semibold">{app.opportunity.employer.name} • {app.opportunity.salary}</p>
                              </div>

                              {/* Dropdown status switcher */}
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Simulate Status:</span>
                                <div className="relative">
                                  <select 
                                    value={app.status} 
                                    onChange={e => handleStatusChange(app.id, e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 pr-8 py-1.5 text-[11px] font-black focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 cursor-pointer"
                                  >
                                    <option value="Interested">Interested</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Assessment">Assessment</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Accepted">Accepted</option>
                                  </select>
                                  <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                                </div>
                              </div>
                            </div>

                            {/* Timeline path display */}
                            <div className="pt-2 border-t border-slate-50 grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                              {[
                                { status: 'Interested', label: '1. Interested' },
                                { status: 'Applied', label: '2. Applied' },
                                { status: 'Assessment', label: '3. Assessment' },
                                { status: 'Interview', label: '4. Interview' },
                                { status: 'Offer', label: '5. Offer / Decision' },
                                { status: 'Accepted', label: '6. Accepted' }
                              ].map((stage, sIdx) => {
                                const statusesOrder = ['Interested', 'Applied', 'Assessment', 'Interview', 'Offer', 'Accepted'];
                                const currentIdx = statusesOrder.indexOf(app.status);
                                const stageIdx = statusesOrder.indexOf(stage.status);
                                
                                const isCompleted = currentIdx >= stageIdx && app.status !== 'Rejected';
                                const isRejected = app.status === 'Rejected' && stage.status === 'Offer';
                                
                                return (
                                  <div 
                                    key={stage.status}
                                    className={`p-2 rounded-xl text-[10px] font-bold border transition-all ${
                                      isCompleted 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                        : isRejected
                                          ? 'bg-red-50 border-red-200 text-red-700'
                                          : 'bg-slate-50/50 border-slate-100 text-slate-400'
                                    }`}
                                  >
                                    <p className="truncate">{stage.label}</p>
                                    <span className="text-[8px] font-semibold block mt-0.5">
                                      {isCompleted ? 'Completed' : isRejected ? 'Rejected' : 'Awaiting'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-VIEW 6: LIVE CONVERSATIONAL COACH CHAT */}
                {activeTab === 'coach' && (
                  <div className="space-y-6 text-left">
                    <div className="border-l-4 border-emerald-500 pl-4 py-1">
                      <h2 className="text-xl font-black text-slate-800">Olatech AI Career Coach</h2>
                      <p className="text-xs text-slate-500">Ask strategic questions on CV formatting, portfolio construction, and lock-in placement advice.</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col h-[500px]">
                      
                      {/* Chat scrolling log */}
                      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                        {chatHistory.map((ch, idx) => {
                          const isUser = ch.role === 'user';
                          return (
                            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed shadow-sm text-left ${
                                isUser 
                                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                                  : 'bg-white text-slate-700 border border-slate-150 rounded-tl-none'
                              }`}>
                                <p className="font-bold text-[9px] uppercase tracking-wider mb-1 opacity-70">
                                  {isUser ? 'Samuel Okon (You)' : 'Olatech AI Advisor'}
                                </p>
                                <p className="whitespace-pre-line leading-relaxed">{ch.text}</p>
                              </div>
                            </div>
                          );
                        })}
                        {isSendingChat && (
                          <div className="flex justify-start">
                            <div className="p-4 rounded-2xl bg-white border border-slate-150 text-slate-400 text-xs flex items-center gap-2">
                              <RefreshCw size={12} className="animate-spin text-emerald-600" /> Let me review matching registers...
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input container */}
                      <form onSubmit={handleSendChat} className="p-3 sm:p-4 border-t border-slate-150 bg-white flex items-center gap-2">
                        <input 
                          type="text" 
                          value={chatMessage}
                          onChange={e => setChatMessage(e.target.value)}
                          placeholder="Type your career query (e.g. 'How do I optimize my React portfolio?')..."
                          className="flex-grow p-3 bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs transition-all"
                          disabled={isSendingChat}
                        />
                        <button 
                          type="submit"
                          disabled={!chatMessage.trim() || isSendingChat}
                          className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-xl transition-all shadow-md shrink-0"
                        >
                          <Send size={15} />
                        </button>
                      </form>

                    </div>
                  </div>
                )}

                {/* SUB-VIEW 7: MY UPCOMING EVENTS & TICKETS */}
                {activeTab === 'events' && (
                  <MyStudentEventsModule userEmail={email || searchEmail} />
                )}

              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      )}

      {/* 2. PROFILE EDIT MODAL */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 text-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800 tracking-tight">Modify Portfolio Connections</h3>
                <button onClick={() => setIsEditProfileOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Verified Skills (comma-separated)</label>
                  <input 
                    type="text" 
                    value={editSkills}
                    onChange={e => setEditSkills(e.target.value)}
                    placeholder="React, JavaScript, Tailwind, Node.js"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">LinkedIn Profile URL</label>
                  <input 
                    type="text" 
                    value={editLinkedin}
                    onChange={e => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">GitHub Profile URL</label>
                  <input 
                    type="text" 
                    value={editGithub}
                    onChange={e => setEditGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Live Portfolio URL</label>
                  <input 
                    type="text" 
                    value={editPortfolio}
                    onChange={e => setEditPortfolio(e.target.value)}
                    placeholder="https://username.vercel.app"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Syncing with DB...
                    </>
                  ) : (
                    'Save Connections & Sync'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// EXPANDABLE OPPORTUNITY ACCORDION CARD
// ==========================================
interface OpportunityAccordionCardProps {
  key?: any;
  opp: any;
  isBookmarked: boolean;
  hasApplied: boolean;
  onToggleBookmark: () => void;
  onApply: () => void;
  isApplying: boolean;
}

function OpportunityAccordionCard({ 
  opp, isBookmarked, hasApplied, onToggleBookmark, onApply, isApplying 
}: OpportunityAccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Visual top row summary header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/40 select-none text-left"
      >
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 font-extrabold flex items-center justify-center shrink-0 border border-slate-800 text-xs">
            {opp.employer.name.split(' ')[0][0]}{opp.employer.name.split(' ')[1]?.[0] || ''}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-md text-[8px] uppercase tracking-wide font-bold">
                {opp.category.name}
              </span>
              {opp.applicationDeadline && (
                <span className="text-[9px] font-mono font-medium text-slate-400">
                  📅 Closes: {opp.applicationDeadline}
                </span>
              )}
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight mt-1">{opp.jobTitle}</h3>
            <p className="text-slate-400 text-[10px] font-bold mt-0.5">{opp.employer.name} • {opp.location} ({opp.remoteStatus})</p>
          </div>
        </div>

        {/* Match rating badge & toggler */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">AI Correlation</span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {opp.matchScore}% Match
            </span>
          </div>
          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Accordion Details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="border-t border-slate-100 bg-slate-50/30 text-left"
          >
            <div className="p-5 space-y-4 text-xs leading-relaxed text-slate-500">
              
              {/* Job Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800">Job Description:</h4>
                <p>{opp.description}</p>
              </div>

              {/* Stipend range */}
              <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Estimated Compensation</span>
                  <p className="font-bold text-emerald-600">{opp.salary || 'Unspecified Stipend'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Official Portal</span>
                  <a href={opp.officialUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-600 flex items-center gap-0.5 hover:text-emerald-600 transition-colors">
                    Official URL <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* AI matching explanation details (matched and missing skills) */}
              <div className="bg-emerald-50/20 border border-emerald-100/30 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-emerald-800 flex items-center gap-1">
                  Olatech Match Diagnostics
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-emerald-700 font-mono block">✓ Met Skills ({opp.matchedSkills.length})</span>
                    {opp.matchedSkills.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {opp.matchedSkills.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-100 font-semibold">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">No matching technical skills overlapping with your profile list.</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-amber-700 font-mono block">⚠ Missing Skills Gap ({opp.missingSkills.length})</span>
                    {opp.missingSkills.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {opp.missingSkills.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-100 font-semibold">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-emerald-600 font-bold">✓ Complete skill overlap!</p>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic border-t border-emerald-100/20 pt-2.5">
                  💡 <strong>Coaching advice:</strong> {opp.missingSkills.length > 0 
                    ? `Study guidelines and add "${opp.missingSkills.join(', ')}" to your custom projects in your curriculum dashboard to optimize matching coefficients.`
                    : 'You have flawless technical prerequisites! We highly recommend applying immediately.'
                  }
                </div>
              </div>

              {/* Action buttons bar */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-4">
                <button
                  onClick={onToggleBookmark}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all flex items-center gap-1 shrink-0 ${
                    isBookmarked 
                      ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isBookmarked ? 'Remove Watchlist' : 'Add to Watchlist'}
                </button>

                <button
                  onClick={onApply}
                  disabled={hasApplied || isApplying}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5 text-[10px] disabled:bg-slate-100 disabled:text-slate-400 shadow-sm"
                >
                  {isApplying ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" /> Applying...
                    </>
                  ) : hasApplied ? (
                    <>
                      <Check size={11} /> Application Submitted
                    </>
                  ) : (
                    <>
                      Lodge Application <ArrowRight size={11} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SUB-VIEW 7: MY STUDENT EVENTS & WORKSHOP PASSES
// ==========================================
function MyStudentEventsModule({ userEmail }: { userEmail: string }) {
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const fetchMyEvents = () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/student/events?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setMyEvents(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching my events:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMyEvents();
  }, [userEmail]);

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel your seat reservation for this event? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/events/reservations/${reservationId}?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert("Reservation cancelled successfully.");
        if (selectedTicket && (selectedTicket.reservationId === reservationId || selectedTicket.id === reservationId)) {
          setSelectedTicket(null);
        }
        fetchMyEvents();
      } else {
        alert(data.error || "Failed to cancel reservation.");
      }
    } catch (err) {
      alert("Error cancelling reservation.");
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-l-4 border-emerald-600 pl-4 py-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800">My Upcoming Events & Passes</h2>
          <p className="text-xs text-slate-500">Manage your confirmed workshop seats, waiting list numbers, transit logistics, and QR entry tokens.</p>
        </div>
        <button 
          onClick={fetchMyEvents} 
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold flex items-center gap-1"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100">
          <Loader2 size={32} className="animate-spin text-emerald-600" />
          <p className="text-xs font-bold text-slate-500">Syncing your event reservations...</p>
        </div>
      ) : myEvents.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <Calendar size={48} className="mx-auto text-slate-300" />
          <div className="space-y-1">
            <p className="text-sm font-black text-slate-700">You haven't reserved any upcoming events yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Browse stream technical briefings, interactive CV clinics, hackathon launch days, and recruiter meetups in the Career Hub to secure your seat.
            </p>
          </div>
          <a
            href="/career"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 transition-all shadow-sm"
          >
            Explore Workshop Schedule <ArrowRight size={14} />
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {myEvents.map((item: any) => {
            const ev = item.event || {};
            const isWaiting = item.status === 'Waiting List';
            const isConfirmed = item.status === 'Confirmed' || !isWaiting;

            return (
              <div
                key={item.reservationId || item.id}
                className={`bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  isConfirmed ? 'border-emerald-500/60 bg-emerald-50/10' : 'border-amber-400/60 bg-amber-50/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-extrabold rounded-md text-[9px] uppercase tracking-wide">
                      {ev.type || "Workshop"}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 ${
                      isConfirmed ? 'bg-emerald-600 text-white shadow-sm' : 'bg-amber-500 text-white shadow-sm'
                    }`}>
                      {isConfirmed ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {isConfirmed ? 'Confirmed Seat' : `Waiting List #${item.waitingListPosition || 1}`}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800 leading-tight">{ev.title || "Mandatory Stream Technical Briefing"}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2">{ev.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400">📅 Schedule</span>
                      <p className="font-bold text-slate-800">{ev.date || "July 08, 2026"}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{ev.time || "10:00 AM UTC"}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400">📍 Access</span>
                      <p className="font-bold text-slate-800">{ev.location || "Main Auditorium"}</p>
                      <p className="text-[10px] text-emerald-700 font-bold">{item.attendanceType || "Physical"} Attendance</p>
                    </div>
                  </div>

                  {/* Transit & Ref */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-100/60 px-3 py-2 rounded-xl font-medium">
                    <span className="text-slate-500">Transit: <strong className="text-slate-800">{item.transportation || "Personal"}</strong></span>
                    <span className="font-mono text-emerald-700 font-black">REF: {item.reservationId || item.id}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTicket(item)}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <QrCode size={14} className="text-emerald-400" /> View QR Pass
                  </button>

                  <a
                    href={`/api/events/${ev.id || 1}/calendar?email=${encodeURIComponent(userEmail)}`}
                    download
                    title="Add to Calendar (.ics)"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Calendar size={15} />
                  </a>

                  <button
                    onClick={() => handleCancelReservation(item.reservationId || item.id)}
                    title="Cancel Reservation"
                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Ticket Pass Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 text-left my-8 print:shadow-none print:border-none print:w-full print:max-w-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">✓</div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">Official Entry Pass</span>
                    <h3 className="text-lg font-black text-slate-800">Student Workshop Pass</h3>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Printable Pass Area */}
              <div className="space-y-6 border-2 border-dashed border-slate-200 rounded-3xl p-6 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded-md text-[10px] uppercase tracking-wide">
                      {selectedTicket.status || "Confirmed Seat"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-2">{selectedTicket.event?.title || "Career Launch Workshop"}</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">CorpersTech Career Launch Program</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Reservation Ref</span>
                    <p className="font-mono font-black text-lg text-emerald-700">{selectedTicket.reservationId || selectedTicket.id}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                  <div className="p-3 bg-slate-900 rounded-xl text-white flex flex-col items-center justify-center shrink-0 w-24 h-24 shadow-inner">
                    <QrCode size={48} className="text-emerald-400" />
                    <span className="text-[8px] font-mono mt-1 text-slate-300">EXPRESS PASS</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Electronic Entry Pass</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Present this QR pass or reference number <span className="font-mono font-bold text-slate-800">{selectedTicket.reservationId}</span> at the venue check-in desk for instant attendance verification.
                    </p>
                    <div className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mt-1">
                      Attendance: {selectedTicket.attendanceType || "Physical"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-200/80">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">📅 Date & Time</span>
                    <p className="font-bold text-slate-800">{selectedTicket.event?.date || "July 08, 2026"}</p>
                    <p className="text-slate-500 font-semibold">{selectedTicket.event?.time || "10:00 AM UTC"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">📍 Venue / Access</span>
                    <p className="font-bold text-slate-800">{selectedTicket.event?.location || "Main Auditorium"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">👤 Student Name</span>
                    <p className="font-bold text-slate-800">{selectedTicket.fullName || userEmail}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{selectedTicket.referenceNumber || "CT-NYSC"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">🚌 Transit Logistics</span>
                    <p className="font-bold text-slate-800">{selectedTicket.transportation || "Personal"}</p>
                    {selectedTicket.pickupLocation && (
                      <p className="text-[10px] text-emerald-700 font-bold">{selectedTicket.pickupLocation}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 print:hidden">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`/api/events/${selectedTicket.event?.id || 1}/calendar?email=${encodeURIComponent(userEmail)}`}
                    download
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Calendar size={14} className="text-emerald-400" /> Add to Calendar (.ics)
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <Printer size={14} /> Print Pass / Receipt
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => handleCancelReservation(selectedTicket.reservationId || selectedTicket.id)}
                    className="text-red-600 hover:text-red-700 font-bold text-[11px] underline cursor-pointer"
                  >
                    Cancel This Reservation
                  </button>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Close Pass
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
