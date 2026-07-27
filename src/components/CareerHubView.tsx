import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { 
  Compass, MapPin, Calendar, Clock, BookOpen, Laptop, Briefcase, Award, 
  FileText, CheckCircle2, ArrowRight, Sparkles, Download, Users, Star, 
  ChevronRight, ExternalLink, Github, Search, Filter, Shield, Terminal, 
  Palette, UserCheck, TrendingUp, Smartphone, Heart, Share2, Eye, Building,
  Bell, FileSpreadsheet, Lock, CheckSquare, Zap, Globe, MessageSquare, DollarSign,
  Video, Cpu, Loader2, Code, BarChart3, Layers
} from 'lucide-react';
import { CareerProfileModal } from './CareerProfileModal.tsx';
import { CareerExplorerModule } from './CareerExplorerModule.tsx';
import { getStudentSessionEmail, setStudentSessionEmail, clearStudentSessionEmail } from '../utils/session.ts';

interface CareerHubViewProps {
  onRegisterClick: (programId?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export default function CareerHubView({ onRegisterClick, setActiveTab }: CareerHubViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>('journey');

  // Sub-navigation tabs
  const subTabs = [
    { id: 'journey', label: 'My Journey', icon: Compass, badge: 'Active' },
    { id: 'profiles', label: 'Career Profiles', icon: Shield },
    { id: 'showcase', label: 'Project Showcase', icon: Eye, count: 6 },
    { id: 'opportunities', label: 'Tech Opportunities', icon: Briefcase, badge: 'New' },
    { id: 'resources', label: 'Career Resources', icon: FileText },
    { id: 'alumni', label: 'Success Stories', icon: Star },
    { id: 'events', label: 'Upcoming Events', icon: Calendar, count: 4 },
    { id: 'partners', label: 'Partner Network', icon: Users },
    { id: 'downloads', label: 'Download Center', icon: Download }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      {/* Title Hero Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/25 uppercase tracking-wider inline-flex items-center gap-1.5">
             Phase 3: Career Launch Platform
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            The Ultimate Tech <span className="text-emerald-400">Career Launch</span> Ecosystem
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            CorpersTech isn't just a tech school — it's the launchpad for your professional career. Gain globally high-yielding skills, build concrete projects, showcase your portfolios, and unlock remote placement contracts during your NYSC service year.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onRegisterClick()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-600/10 flex items-center gap-2 hover:scale-[1.02]"
            >
              Get Endorsed Today <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('profiles');
                const el = document.getElementById('career-hub-view-stage');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Sub-Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm overflow-x-auto scrollbar-none flex items-center gap-1.5 sticky top-[72px] sm:top-[88px] z-30">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                const el = document.getElementById('career-hub-view-stage');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-950/10' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-150/40'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.count && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Render Stage Container */}
      <div id="career-hub-view-stage" className="min-h-[400px] pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {activeSubTab === 'journey' && <JourneyRoadmapModule onRegisterClick={onRegisterClick} />}
            {activeSubTab === 'profiles' && <CareerExplorerModule onRegisterClick={onRegisterClick} />}
            {activeSubTab === 'showcase' && <StudentPortfolioModule />}
            {activeSubTab === 'opportunities' && <WeeklyOpportunitiesModule onRegisterClick={onRegisterClick} setActiveTab={setActiveTab} />}
            {activeSubTab === 'resources' && <CareerResourcesModule />}
            {activeSubTab === 'alumni' && <SuccessStoriesModule />}
            {activeSubTab === 'events' && <UpcomingEventsModule onRegisterClick={onRegisterClick} setActiveTab={setActiveTab} />}
            {activeSubTab === 'partners' && <EmployerPartnerModule />}
            {activeSubTab === 'downloads' && <DownloadCenterModule />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ==========================================
   MODULE 1: MY TECH JOURNEY ROADMAP
   ========================================== */
function JourneyRoadmapModule({ onRegisterClick }: { onRegisterClick: (programId?: string) => void }) {
  const currentStageIdx = 2; // "Begin Training" is highlighted

  const roadmapStages = [
    {
      title: "Register Admission",
      description: "Submit your online corps member registration, lock in your Olatech School path, and select commute arrangements.",
      details: "Get assigned an official candidate Ref ID & verify laptop requirements.",
      icon: UserCheck,
      time: "Day 1",
      status: "completed"
    },
    {
      title: "Attend Orientation",
      description: "Join the mandatory Olatech technical briefing, meet stream mentors, and sync schedules with your PPA service plans.",
      details: "Obtain credentials, download the student handbook, and locate service buses.",
      icon: Compass,
      time: "Week 1",
      status: "completed"
    },
    {
      title: "Begin Technical Training",
      description: "Dive into daily live hands-on coding, threat modeling, visual mockup design, or data sheets reporting exercises.",
      details: "Write real code, utilize professional tools, and maintain over 85% attendance.",
      icon: Terminal,
      time: "Weeks 2 - 12",
      status: "current"
    },
    {
      title: "Complete Capstone Projects",
      description: "Architect and build end-to-end applications, real security reviews, and live interactive BI dashboards.",
      details: "Code reviews provided by senior global mentors with detailed scorecards.",
      icon: CheckSquare,
      time: "Weeks 12 - 16",
      status: "future"
    },
    {
      title: "Build Professional Portfolio",
      description: "Deploy live applications, host source files on GitHub, and organize your designs into interactive slide boards.",
      details: "Prepare a stunning personal portfolio website that commands respect from HR.",
      icon: Eye,
      time: "Week 17",
      status: "future"
    },
    {
      title: "Prepare Tech CV & LinkedIn",
      description: "Format your resume to pass international applicant tracking systems (ATS) and brand your LinkedIn.",
      details: "Olatech branding specialists rewrite your summary to highlight actual projects completed.",
      icon: FileText,
      time: "Week 18",
      status: "future"
    },
    {
      title: "Mock Interview Drills",
      description: "Undergo simulated technical live coding, design challenges, and core behavioral reviews with industry professionals.",
      details: "Obtain direct feedback reports and build confidence for official corporate rounds.",
      icon: Users,
      time: "Week 19",
      status: "future"
    },
    {
      title: "Guaranteed Internship",
      description: "Begin a highly supportive 3-month corporate internship arranged through Olatech partner placement offices.",
      details: "Gain critical office workplace experience and network with active engineers.",
      icon: Briefcase,
      time: "Month 6",
      status: "future"
    },
    {
      title: "Full-Time Job Placement",
      description: "Transition into high-yielding full-time tech roles in fintech, cybersecurity firms, or agency operations.",
      details: "Average starting packages from ₦180,000 to over ₦400,000 monthly for entry level.",
      icon: Award,
      time: "Month 9",
      status: "future"
    },
    {
      title: "Continuous Career Growth",
      description: "Join our active alumni network, unlock senior peer masterclasses, and explore high-paying foreign freelance gigs.",
      details: "Continuous career counseling to climb from junior up to team lead standards.",
      icon: Zap,
      time: "Ongoing",
      status: "future"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-emerald-500 pl-4 py-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">My Tech Journey Roadmap</h2>
        <p className="text-xs sm:text-sm text-slate-500">Track the exact milestone steps designed to turn you into a job-ready professional by passing out parade (POP).</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Vertical Timeline Path */}
          <div className="md:col-span-8 relative border-l-2 border-slate-100 ml-4 pl-8 space-y-10 py-2">
            {roadmapStages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isCompleted = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              const isFuture = idx > currentStageIdx;

              return (
                <div key={idx} className="relative group text-left">
                  {/* Timeline Node Icon Pin */}
                  <span className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : isCurrent 
                        ? 'bg-slate-900 border-slate-900 text-emerald-400 scale-110 ring-4 ring-emerald-50' 
                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={14} /> : <StageIcon size={14} />}
                  </span>

                  {/* Timeline Content card */}
                  <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-slate-50 border-slate-200 shadow-md ring-1 ring-slate-150/40' 
                      : 'bg-white border-slate-100/80 hover:border-slate-200 hover:shadow-sm'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${
                          isCompleted 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : isCurrent 
                              ? 'bg-slate-900 text-emerald-400' 
                              : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isCompleted ? 'Completed' : isCurrent ? 'Active Stage' : 'Lock State'}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-800">{stage.title}</h3>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-400">{stage.time}</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{stage.description}</p>
                    <p className="text-[11px] font-semibold text-slate-400 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50 leading-relaxed">
                      💡 {stage.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Guide Cards Panel */}
          <div className="md:col-span-4 space-y-6 md:sticky md:top-48">
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 space-y-4 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Student Progress Status</span>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Your Current Milestones</p>
                <p className="text-xl font-bold text-white">Stage 3: Begin Training</p>
                <div className="h-2 w-full bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                  <span>30% Completed</span>
                  <span>7 Stages left</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3 text-xs leading-relaxed text-slate-300">
                <p>Welcome, corps member! You are currently registered for the technical training phase.</p>
                <p>Ensure to complete weekly coding labs, attend stream mentoring slots, and log your attendance sheets regularly to unlock subsequent milestones!</p>
              </div>

              <button 
                onClick={() => onRegisterClick()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
              >
                Log Attendance
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award size={15} className="text-emerald-500" /> Professional Endorsement
              </h4>
              <p className="text-slate-500 leading-relaxed">
                By satisfying Olatech's rigor parameters, you automatically receive high-yielding CV formatting and direct placement introductions with over 45 partner companies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MODULE 2: TECHNOLOGY CAREER EXPLORER (Imported from ./CareerExplorerModule.tsx)
   ========================================== */

/* ==========================================
   MODULE 3: STUDENT PORTFOLIO SHOWCASE
   ========================================== */
function StudentPortfolioModule() {
  const [filterCourse, setFilterCourse] = useState<string>('All');

  const studentProjects = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80",
      name: "Fortis Bank API Protection Suite",
      student: "Adebayo Chukwuma",
      course: "Cybersecurity",
      description: "Conducted simulated automated network penetration, threat audits, and constructed secure API protection algorithms preventing SQL injections.",
      tech: ["Kali Linux", "Wireshark", "Relational SQL", "Nmap", "Metasploit"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80",
      name: "AgriTrack Nigerian Crop Analytics Dashboard",
      student: "Amina Ibrahim",
      course: "Data Analysis",
      description: "Formulated complete interactive BI dashboards showcasing Nigerian agrarian yield distribution, annual pricing analytics, and delivery routes.",
      tech: ["Advanced Excel", "Power BI", "SQL", "Tableau", "Python"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80",
      name: "E-Corp Marketplace Web Platform",
      student: "Tunde Williams",
      course: "Web Development",
      description: "Designed a clean responsive electronic shopping storefront complete with dynamic category sliders, shopping carts, and Stripe processing.",
      tech: ["React.js", "TailwindCSS", "Node.js", "Express", "MongoDB"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
      name: "PayFlow Digital Corporate Branding Hub",
      student: "Obinna Okafor",
      course: "Graphics Design",
      description: "Compiled a professional corporate visual identity handbook including vector logomark variants, corporate palettes, and typography grids.",
      tech: ["Adobe Illustrator", "Photoshop", "Figma", "Creative Suite"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&auto=format&fit=crop&q=80",
      name: "SwiftFit Virtual Workout Prototyping",
      student: "Halima Yusuf",
      course: "UI/UX",
      description: "Completed UX psychological interviews, persona mappings, low-fidelity wireframes, and compiled professional interactive Figma mobile application prototypes.",
      tech: ["Figma Wireframes", "Interactive Prototype", "FigJam", "Miro"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
      name: "Remote Team Operation Scheduling Automations",
      student: "Blessing George",
      course: "Virtual Assistant",
      description: "Created comprehensive Notion client tracking portals, integrated automated email sequences, and organized complete Calendly meeting schedules.",
      tech: ["Notion Databases", "Google Automation", "Calendly API", "Slack CRM"],
      demoUrl: "https://github.com",
      githubUrl: "https://github.com"
    }
  ];

  const coursesList = ["All", "Cybersecurity", "Data Analysis", "Web Development", "Graphics Design", "UI/UX", "Virtual Assistant", "Video Editing", "Mobile App Development", "AI & Automation"];

  const filteredProjects = filterCourse === 'All' 
    ? studentProjects 
    : studentProjects.filter(p => p.course === filterCourse);

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-emerald-500 pl-4 py-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">Student Portfolio Showcase</h2>
          <p className="text-xs sm:text-sm text-slate-500">Inspect stunning real-world applications and designs built entirely by active CorpersTech students during classes.</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto">
        {coursesList.map(c => (
          <button
            key={c}
            onClick={() => setFilterCourse(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filterCourse === c 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-left">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image box */}
              <div className="h-44 relative bg-slate-100 overflow-hidden">
                <img 
                  referrerPolicy="no-referrer"
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-slate-900 rounded-lg shadow-sm">
                  {project.course}
                </span>
              </div>

              {/* Description box */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 line-clamp-1">{project.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Author: {project.student}</p>
                </div>

                <p className="text-slate-500 leading-relaxed text-xs line-clamp-3">{project.description}</p>

                {/* Tech badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {project.tech.slice(0, 4).map(t => (
                    <span key={t} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md font-mono text-[9px] text-slate-500">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-[9px] text-slate-400 font-semibold">+{project.tech.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between gap-3">
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl border border-slate-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Github size={12} /> Source Code
              </a>
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ExternalLink size={12} /> Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const executeDocumentDownload = async (
  item: { id?: string | number; title: string; category?: string; badge?: string; desc?: string; description?: string },
  setLoadingId: (id: any) => void,
  setToast: (msg: string | null) => void
) => {
  const itemId = item.id || 'doc';
  setLoadingId(itemId);
  const title = item.title || 'Document';
  const category = item.category || item.badge || 'Resource';
  
  try {
    const res = await fetch(`/api/career-resources/download?id=${itemId}&title=${encodeURIComponent(title)}&type=${encodeURIComponent(category)}&format=json`);
    if (!res.ok) throw new Error('Server returned ' + res.status);
    const data = await res.json();
    if (data && data.success && data.content) {
      const blob = new Blob([data.content], { type: data.contentType || 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setToast(`✓ Downloaded "${title}" successfully!`);
      setTimeout(() => setToast(null), 4000);
      return;
    }
    throw new Error('Invalid download format');
  } catch (err: any) {
    // Client-side offline fallback
    try {
      const desc = item.description || item.desc || 'Official training and resource guide.';
      const fallback = `# ${title.toUpperCase()}\n*CorpersTech Professional Resource Guide*\n*Category: ${category}*\n\n---\n\n## Overview\n${desc}\n\n## 1. Core Objectives\n* Adhere strictly to institutional standards.\n* Follow step-by-step technical checklists.\n* Ensure full completion of practical deliverables.\n\n---\n*Generated by CorpersTech Career Hub.*`;
      const blob = new Blob([fallback], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setToast(`✓ Downloaded offline copy of "${title}".`);
      setTimeout(() => setToast(null), 4000);
    } catch (fallbackErr) {
      alert(`Could not download "${title}". Please try again.`);
    }
  } finally {
    setLoadingId(null);
  }
};

/* ==========================================
   MODULE 4: CAREER RESOURCES
   ========================================== */
function CareerResourcesModule() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadingId, setDownloadingId] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const resourceCategories = [
    "All", "CV Templates", "Interview Tips", "LinkedIn Guides", "Learning Roadmaps", "Starter Guides", "Productivity", "Freelancing", "Career Planning", "Practice Platforms", "Remote Platforms", "GitHub Guides"
  ];

  const [resourceCards, setResourceCards] = useState(() => {
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
        icon: "TrendingUp",
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

  const filteredResources = selectedCategory === 'All'
    ? resourceCards
    : resourceCards.filter((r: any) => r.category === selectedCategory);

  return (
    <div className="space-y-8 relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="border-l-4 border-emerald-500 pl-4 py-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">Professional Career Resources</h2>
        <p className="text-xs sm:text-sm text-slate-500">Access templates, resume outlines, study guides, and tools to prepare your application packages for top-tier agencies.</p>
      </div>

      {/* Categories filters */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto">
        {resourceCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-left">
        {filteredResources.map((resource: any) => {
          const ResIcon = typeof resource.icon === 'string'
            ? (Icons as any)[resource.icon] || Icons.FileText
            : resource.icon;
          return (
            <div 
              key={resource.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded text-[9px] uppercase tracking-wide">
                  {resource.category}
                </span>
                
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <ResIcon size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">{resource.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 font-sans">{resource.tag}</p>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed text-xs">{resource.description}</p>
              </div>

              <button 
                onClick={() => executeDocumentDownload(resource, setDownloadingId, setToastMsg)}
                disabled={downloadingId === resource.id}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-75 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {downloadingId === resource.id ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Preparing...
                  </>
                ) : (
                  <>
                    <Download size={12} /> Access Document
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   MODULE 5: WEEKLY TECH OPPORTUNITIES
   ========================================== */
function WeeklyOpportunitiesModule({ onRegisterClick, setActiveTab }: { onRegisterClick: (programId?: string) => void, setActiveTab?: (tab: string) => void }) {
  const [filterType, setFilterType] = useState<string>('All');

  const [opportunitiesList, setOpportunitiesList] = useState(() => {
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

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((item: any) => ({
            id: item.id,
            category: item.category || 'Internships',
            title: item.title,
            company: item.company,
            stipend: item.stipend,
            location: item.location,
            deadline: item.deadline || 'August 30, 2026',
            featured: item.featured || false,
            description: item.description,
            skills: Array.isArray(item.skills) ? item.skills : (item.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean)
          }));
          setOpportunitiesList(mapped);
        }
      })
      .catch(err => console.error("Error loading live DB jobs inside WeeklyOpportunitiesModule:", err));
  }, []);

  const types = ["All", "Internships", "Remote Jobs", "Bootcamps", "Scholarships", "Tech Competitions", "Graduate Programs"];

  const filteredOpps = filterType === 'All'
    ? opportunitiesList
    : opportunitiesList.filter(o => o.category === filterType);

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-emerald-500 pl-4 py-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">Weekly Tech Opportunities</h2>
        <p className="text-xs sm:text-sm text-slate-500">Curated high-value programs, internships, fully-sponsored bootcamps, and high-paying global gigs updated weekly.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filterType === t 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
        {filteredOpps.map(opp => (
          <div 
            key={opp.id}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
              opp.featured 
                ? 'bg-white border-emerald-250 ring-1 ring-emerald-100 shadow-md' 
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
            }`}
          >
            {opp.featured && (
              <span className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 font-extrabold text-[8px] uppercase px-2 py-0.5 rounded-md border border-emerald-100/40">
                ★ Featured
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 font-extrabold uppercase text-slate-500 text-xs">
                  {opp.company.slice(0,2)}
                </span>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">{opp.category}</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-tight">{opp.title}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{opp.company} • <span className="text-slate-400 font-normal">{opp.location}</span></p>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed text-xs">{opp.description}</p>

              {/* Skills required */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {opp.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-semibold text-slate-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with deadline details */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-3 text-[10px]">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px]">Value / Stipend</span>
                <span className="font-extrabold text-emerald-700 font-mono">{opp.stipend}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[8px]">Deadline</span>
                <span className="font-semibold text-slate-600 flex items-center gap-1 justify-end">
                  <Clock size={11} className="text-red-400" /> {opp.deadline}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab ? setActiveTab('opportunities') : onRegisterClick()}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm cursor-pointer"
            >
              Apply via Recruitment Portal <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   MODULE 6: SUCCESS STORIES (ALUMNI SPOTLIGHTS)
   ========================================== */
function SuccessStoriesModule() {
  const [alumniStories, setAlumniStories] = useState(() => {
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

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-emerald-500 pl-4 py-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">Alumni Success Stories</h2>
        <p className="text-xs sm:text-sm text-slate-500">Discover premium magazine-style stories of graduates who transitioned from unrelated fields into thriving global tech roles during NYSC.</p>
      </div>

      {/* Stories list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs text-left">
        {alumniStories.map(story => (
          <div 
            key={story.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Header Profile layout */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                <img 
                  referrerPolicy="no-referrer"
                  src={story.image} 
                  alt={story.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-100 shrink-0"
                />
                <div>
                  <span className="text-[9px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-sans">
                    {story.batch}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight mt-1">{story.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{story.role} @ <span className="text-slate-800 font-bold">{story.company}</span></p>
                </div>
              </div>

              {/* Journey details body */}
              <div className="p-6 space-y-4">
                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-150/40 text-[11px]">
                  <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Verified Salary Package</span>
                  <p className="font-extrabold text-emerald-800 mt-0.5">{story.salary}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <strong className="text-slate-800 text-xs block">Before CorpersTech:</strong>
                    <p className="text-slate-500 leading-relaxed mt-0.5">{story.before}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 text-xs block">Training Experience:</strong>
                    <p className="text-slate-500 leading-relaxed mt-0.5">{story.training}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 text-xs block">Vetted Capstone Project:</strong>
                    <p className="text-slate-500 leading-relaxed mt-0.5">🚀 {story.project}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-700 text-[10px] uppercase font-bold tracking-wider block">Advice to New Corpers</strong>
                    <p className="text-slate-600 leading-relaxed italic mt-1 font-medium">"{story.advice}"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-2 border-t border-slate-50">
              <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 text-xs">
                View Detailed Spotlight Case <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   MODULE 7: UPCOMING EVENTS & WORKSHOPS (FULL SYSTEM)
   ========================================== */
function UpcomingEventsModule({ onRegisterClick, setActiveTab }: { onRegisterClick?: (id?: string) => void; setActiveTab?: (tab: string) => void }) {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return getStudentSessionEmail();
  });

  // Modal States
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [showReserveModal, setShowReserveModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [currentReservation, setCurrentReservation] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Reservation Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "General Tech",
    nyscState: "Lagos",
    nyscBatch: "2026 Batch A Stream 1",
    referenceNumber: "",
    attendanceType: "Physical",
    transportation: "Personal Transportation",
    pickupLocation: ""
  });

  const fetchEvents = () => {
    setLoading(true);
    const emailQuery = userEmail ? `?email=${encodeURIComponent(userEmail)}` : "";
    fetch(`/api/events${emailQuery}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Calculate countdown days dynamically
          const processed = data.data.map(ev => {
            const eventDate = new Date(ev.date);
            const today = new Date();
            const diffTime = eventDate.getTime() - today.getTime();
            const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            return { ...ev, daysLeft };
          });
          setEventsList(processed);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [userEmail]);

  // Attempt to load student profile if email session exists
  const loadStudentProfile = async (emailToLoad: string) => {
    try {
      const res = await fetch(`/api/career/dashboard?email=${encodeURIComponent(emailToLoad)}`);
      const data = await res.json();
      if (data && data.profile) {
        setFormData(prev => ({
          ...prev,
          fullName: data.profile.fullName || data.profile.name || prev.fullName,
          email: emailToLoad,
          phone: data.profile.phone || "07075958413",
          course: data.profile.course || "Software Engineering",
          nyscState: data.profile.nyscState || "Lagos",
          nyscBatch: data.profile.nyscBatch || "2026 Batch A Stream 1",
          referenceNumber: data.profile.referenceNumber || `CT-NYSC-${Math.floor(1000 + Math.random() * 9000)}`
        }));
      } else {
        setFormData(prev => ({ ...prev, email: emailToLoad }));
      }
    } catch (err) {
      setFormData(prev => ({ ...prev, email: emailToLoad }));
    }
  };

  const handleReserveClick = (ev: any) => {
    setSelectedEvent(ev);
    setErrorMsg("");

    // Check if user already reserved
    if (ev.userHasReserved || ev.isOnWaitingList) {
      setCurrentReservation(ev.userReservation);
      setShowDuplicateModal(true);
      return;
    }

    // Check login state
    const currentSession = getStudentSessionEmail();
    if (!currentSession && !userEmail) {
      setShowSignInModal(true);
      return;
    }

    const targetEmail = currentSession || userEmail;
    if (targetEmail) {
      setUserEmail(targetEmail);
      loadStudentProfile(targetEmail);
    }
    setShowReserveModal(true);
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/events/${selectedEvent.id}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setSubmitting(false);

      if (!res.ok || !data.success) {
        if (data.alreadyReserved) {
          setCurrentReservation(data.reservation);
          setShowReserveModal(false);
          setShowDuplicateModal(true);
        } else {
          setErrorMsg(data.error || "Failed to reserve seat. Please check your inputs.");
        }
        return;
      }

      // Save email session if not saved
      if (!userEmail) {
        setStudentSessionEmail(formData.email);
        setUserEmail(formData.email);
      }

      setCurrentReservation(data.reservation);
      setShowReserveModal(false);
      setShowConfirmationModal(true);
      fetchEvents(); // reload counts and badges
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg("Network error while submitting reservation.");
    }
  };

  const handleCancelReservation = async () => {
    if (!currentReservation) return;
    if (!confirm("Are you sure you want to cancel your seat reservation? This action cannot be undone.")) return;

    try {
      const targetId = currentReservation.reservationId || currentReservation.id;
      const res = await fetch(`/api/events/reservations/${targetId}?email=${encodeURIComponent(userEmail || currentReservation.email)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert("Reservation cancelled successfully.");
        setShowDuplicateModal(false);
        setShowConfirmationModal(false);
        setCurrentReservation(null);
        fetchEvents();
      } else {
        alert(data.error || "Failed to cancel reservation.");
      }
    } catch (err) {
      alert("Error cancelling reservation.");
    }
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-emerald-600 pl-4 py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">Upcoming Events & Workshops</h2>
          <p className="text-xs sm:text-sm text-slate-500">Live Event Registration, Seat Reservation System, and Workshop Schedule.</p>
        </div>
        {userEmail ? (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs">
            <UserCheck size={14} className="text-emerald-600" />
            <span className="font-bold text-slate-700">Student: {userEmail}</span>
            <button 
              onClick={() => { clearStudentSessionEmail(); setUserEmail(""); }}
              className="text-slate-400 hover:text-red-500 ml-2 font-bold text-[10px] underline"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSignInModal(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 self-start"
          >
            <Lock size={13} /> Sign In to Reserve
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100">
          <Loader2 size={32} className="animate-spin text-emerald-600" />
          <p className="text-xs font-bold text-slate-500">Syncing live seat availability and workshop schedules...</p>
        </div>
      ) : eventsList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <Calendar size={40} className="mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-600">No upcoming events published currently.</p>
          <p className="text-xs text-slate-400">Check back soon or check Command Center to publish workshops.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
          {eventsList.map(ev => {
            const isFull = ev.remainingSeats <= 0;
            const isReserved = ev.userHasReserved;
            const isWaiting = ev.isOnWaitingList;

            return (
              <div 
                key={ev.id}
                className={`bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 ${
                  isReserved ? 'border-emerald-500/80 ring-2 ring-emerald-500/10 bg-emerald-50/10' : 
                  isWaiting ? 'border-amber-400/80 bg-amber-50/10' : 'border-slate-200/80'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold rounded-lg text-[10px] uppercase tracking-wider border border-emerald-200/50">
                      {ev.type}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {isReserved && (
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px] flex items-center gap-1 shadow-sm">
                          <CheckCircle2 size={12} /> Seat Confirmed
                        </span>
                      )}
                      {isWaiting && (
                        <span className="px-2.5 py-1 bg-amber-500 text-white font-extrabold rounded-lg text-[10px] flex items-center gap-1 shadow-sm">
                          <Clock size={12} /> Waiting List #{ev.waitingListPosition}
                        </span>
                      )}
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 font-extrabold rounded-lg text-[10px] border border-red-100">
                        <Clock size={11} className="animate-spin-slow" /> {ev.daysLeft === 0 ? 'Live Today' : ev.daysLeft === 1 ? 'Tomorrow' : `in ${ev.daysLeft} Days`}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-800 leading-tight">{ev.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-xs line-clamp-3">{ev.description}</p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 pt-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed text-slate-600">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400">📅 Date & Time</span>
                      <p className="font-bold text-slate-800">{ev.date}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{ev.time}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400">📍 Venue Location</span>
                      <p className="font-bold text-slate-800">{ev.location}</p>
                    </div>
                  </div>
                </div>

                {/* Live Seat Availability & Action */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400">🔥 Live Seat Availability</span>
                    <div className="flex items-center gap-2 font-bold text-[11px]">
                      <span className="text-slate-800">{ev.totalSeats} Total</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700">{ev.reservedSeats} Reserved</span>
                      <span className="text-slate-300">|</span>
                      <span className={ev.remainingSeats > 0 ? "text-blue-600 font-black" : "text-amber-600 font-black"}>
                        {ev.remainingSeats > 0 ? `${ev.remainingSeats} Left` : `Full (Waitlist)`}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleReserveClick(ev)}
                    className={`px-5 py-2.5 font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm cursor-pointer ${
                      isReserved 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
                        : isWaiting
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                        : isFull
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isReserved ? (
                      <>Manage Ticket <CheckCircle2 size={13} /></>
                    ) : isWaiting ? (
                      <>Waitlist Status <Clock size={13} /></>
                    ) : isFull ? (
                      <>Join Waiting List <ArrowRight size={13} /></>
                    ) : (
                      <>Reserve Seat <ArrowRight size={13} /></>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. SIGN IN REQUIRED MODAL (Requirement 2) */}
      <AnimatePresence>
        {showSignInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Lock size={24} />
                </div>
                <button onClick={() => setShowSignInModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <Icons.X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800">Sign In Required</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Please sign in with your registered Corps Member account to reserve your seat for Upcoming Events and workshops.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Quick Sign In (Email Address)</label>
                  <input 
                    type="email"
                    placeholder="e.g. samuel.okon@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserEmail(val);
                      if (val.includes('@')) {
                        setStudentSessionEmail(val);
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    onClick={() => {
                      if (!userEmail || !userEmail.includes('@')) {
                        alert("Please enter a valid student email address.");
                        return;
                      }
                      setStudentSessionEmail(userEmail);
                      setShowSignInModal(false);
                      if (selectedEvent) handleReserveClick(selectedEvent);
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 text-center cursor-pointer"
                  >
                    Continue & Reserve
                  </button>

                  <button
                    onClick={() => {
                      setShowSignInModal(false);
                      if (onRegisterClick) onRegisterClick();
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl text-xs transition-all text-center cursor-pointer"
                  >
                    Register Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SEAT RESERVATION FORM MODAL (Requirement 3) */}
      <AnimatePresence>
        {showReserveModal && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 text-left my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Seat Reservation System</span>
                  <h3 className="text-lg font-black text-slate-800 leading-tight">{selectedEvent.title}</h3>
                </div>
                <button onClick={() => setShowReserveModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <Icons.X size={20} />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Icons.AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitReservation} className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Schedule</span>
                    <p className="font-bold text-slate-700">{selectedEvent.date} ({selectedEvent.time})</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Available Seats</span>
                    <p className="font-bold text-emerald-600">{selectedEvent.remainingSeats} Left</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Samuel Okon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="student@corpers.tech"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="07075958413"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">Tech Stream Course</label>
                    <select
                      value={formData.course}
                      onChange={e => setFormData({...formData, course: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                      <option value="Cyber Security & SOC">Cyber Security & SOC</option>
                      <option value="UI/UX Product Design">UI/UX Product Design</option>
                      <option value="Video Editing & Animation">Video Editing & Animation</option>
                      <option value="General Tech">General Tech</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">NYSC State of Service</label>
                    <input
                      type="text"
                      value={formData.nyscState}
                      onChange={e => setFormData({...formData, nyscState: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">NYSC Batch / Stream</label>
                    <input
                      type="text"
                      value={formData.nyscBatch}
                      onChange={e => setFormData({...formData, nyscBatch: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Requirement 3: Attendance Type & Transportation */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">Attendance Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Physical", "Virtual"].map(type => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData({...formData, attendanceType: type})}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            formData.attendanceType === type 
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-black' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {type === "Physical" ? <MapPin size={14} /> : <Video size={14} />}
                          {type} Attendance
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500">Transportation Logistics *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Company Bus", "Personal Transportation"].map(trans => (
                        <button
                          type="button"
                          key={trans}
                          onClick={() => setFormData({...formData, transportation: trans})}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            formData.transportation === trans 
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-black' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {trans === "Company Bus" ? <Users size={14} /> : <Compass size={14} />}
                          {trans}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.transportation === "Company Bus" && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-extrabold uppercase text-emerald-700">Select Bus Pickup Terminal *</label>
                      <select
                        required
                        value={formData.pickupLocation}
                        onChange={e => setFormData({...formData, pickupLocation: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-bold bg-emerald-50/30 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">-- Select Transit Pickup Terminal --</option>
                        <option value="Lagos Campus Gate - Ikeja">Lagos Campus Gate - Ikeja</option>
                        <option value="Surulere Stadium Hub">Surulere Stadium Hub</option>
                        <option value="Victoria Island Terminal">Victoria Island Terminal</option>
                        <option value="Abuja Central Secretariat">Abuja Central Secretariat</option>
                        <option value="Port Harcourt GRA Hub">Port Harcourt GRA Hub</option>
                        <option value="Ibadan Secretariat Hub">Ibadan Secretariat Hub</option>
                        <option value="Other / Custom Arrangement">Other / Custom Arrangement</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Reserving Seat...</>
                    ) : selectedEvent.remainingSeats <= 0 ? (
                      <><Clock size={16} /> Confirm Waiting List Entry</>
                    ) : (
                      <><CheckCircle2 size={16} /> Confirm Seat Reservation</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. DUPLICATE RESERVATION / EXISTING STATUS MODAL (Requirement 5) */}
      <AnimatePresence>
        {showDuplicateModal && currentReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <button onClick={() => setShowDuplicateModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <Icons.X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-full text-[10px]">
                  {currentReservation.status || "Confirmed"}
                </span>
                <h3 className="text-xl font-black text-slate-800">You have already reserved a seat!</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We found an existing seat reservation registered under <span className="font-bold text-slate-800">{currentReservation.email}</span> for this event.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Reservation ID</span>
                  <span className="font-mono font-black text-slate-800">{currentReservation.reservationId || "RES-CONFIRMED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Attendee Name</span>
                  <span className="font-bold text-slate-800">{currentReservation.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Attendance Type</span>
                  <span className="font-bold text-emerald-700">{currentReservation.attendanceType || "Physical"}</span>
                </div>
                {currentReservation.transportation && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Transportation</span>
                    <span className="font-bold text-slate-800">{currentReservation.transportation}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    setShowDuplicateModal(false);
                    setShowConfirmationModal(true);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye size={14} /> View Confirmation Receipt & QR
                </button>

                <button
                  onClick={handleCancelReservation}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold rounded-xl text-xs transition-all text-center cursor-pointer"
                >
                  Cancel My Reservation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. RESERVATION CONFIRMATION / QR RECEIPT MODAL (Requirement 7) */}
      <AnimatePresence>
        {showConfirmationModal && currentReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 text-left my-8 print:shadow-none print:border-none print:w-full print:max-w-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">Official Entry Pass</span>
                    <h3 className="text-lg font-black text-slate-800">Reservation Receipt</h3>
                  </div>
                </div>
                <button onClick={() => setShowConfirmationModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <Icons.X size={20} />
                </button>
              </div>

              {/* Printable Ticket Area */}
              <div className="space-y-6 border-2 border-dashed border-slate-200 rounded-3xl p-6 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded-md text-[10px] uppercase tracking-wide">
                      {currentReservation.status || "Confirmed Seat"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-2">{selectedEvent?.title || "Career Launch Workshop"}</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">CorpersTech Career Launch Program</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Reservation Reference</span>
                    <p className="font-mono font-black text-lg text-emerald-700">{currentReservation.reservationId || "RES-CONFIRMED"}</p>
                  </div>
                </div>

                {/* QR Code Express Gate Token */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
                  <div className="p-3 bg-slate-900 rounded-xl text-white flex flex-col items-center justify-center shrink-0 w-24 h-24 shadow-inner">
                    <Icons.QrCode size={48} className="text-emerald-400" />
                    <span className="text-[8px] font-mono mt-1 text-slate-300">EXPRESS PASS</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Express Check-in Token</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Present this QR pass or reference number <span className="font-mono font-bold text-slate-800">{currentReservation.reservationId}</span> at the venue registration desk for instant electronic attendance check-in.
                    </p>
                    <div className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mt-1">
                      Attendance: {currentReservation.attendanceType || "Physical"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-200/80">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">📅 Date & Time</span>
                    <p className="font-bold text-slate-800">{selectedEvent?.date || "July 08, 2026"}</p>
                    <p className="text-slate-500 font-semibold">{selectedEvent?.time || "10:00 AM UTC"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">📍 Venue / Access</span>
                    <p className="font-bold text-slate-800">{selectedEvent?.location || "Main Auditorium"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">👤 Attendee Name</span>
                    <p className="font-bold text-slate-800">{currentReservation.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{currentReservation.referenceNumber}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-slate-400">🚌 Transit Logistics</span>
                    <p className="font-bold text-slate-800">{currentReservation.transportation || "Personal"}</p>
                    {currentReservation.pickupLocation && (
                      <p className="text-[10px] text-emerald-700 font-bold">{currentReservation.pickupLocation}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="space-y-3 print:hidden">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`/api/events/${selectedEvent?.id || 1}/calendar?email=${encodeURIComponent(currentReservation.email)}`}
                    download
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Calendar size={14} className="text-emerald-400" /> Add to Calendar (.ics)
                  </a>
                  <button
                    onClick={handlePrintConfirmation}
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <Icons.Printer size={14} /> Download / Print Receipt
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={handleCancelReservation}
                    className="text-red-600 hover:text-red-700 font-bold text-[11px] underline cursor-pointer"
                  >
                    Cancel This Reservation
                  </button>
                  <button
                    onClick={() => setShowConfirmationModal(false)}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Done & Close
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

/* ==========================================
   MODULE 8: EMPLOYER & PARTNER SHOWCASE
   ========================================= */
function EmployerPartnerModule() {
  const [partners, setPartners] = useState(() => {
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

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-emerald-500 pl-4 py-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">Employer & Partner Showcase</h2>
        <p className="text-xs sm:text-sm text-slate-500">Collaborating with Nigeria's most robust banking brands, security firms, and tech communities to guarantee placements.</p>
      </div>

      {/* Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-left">
        {partners.map(p => (
          <div 
            key={p.id}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-extrabold rounded-md text-[9px] uppercase tracking-wide">
                {p.type}
              </span>
              
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-slate-900 text-emerald-400 font-black flex items-center justify-center shrink-0 border border-slate-800 shadow-sm text-sm">
                  {p.logo}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">{p.name}</h3>
              </div>

              <p className="text-slate-500 leading-relaxed text-xs">{p.desc}</p>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                ✓ Verified Placement Network
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   MODULE 9: PROFESSIONAL DOWNLOAD CENTER
   ========================================== */
function DownloadCenterModule() {
  const [downloadingId, setDownloadingId] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const downloadsList = [
    {
      id: 1,
      title: "Training Operations Calendar 2026",
      desc: "Contains exact weekly class timetables, review weeks, project presentation days, and holiday blocks.",
      size: "PDF • 1.4 MB",
      badge: "Timetable"
    },
    {
      id: 2,
      title: "Comprehensive Tech Programs Brochure",
      desc: "In-depth syllabus guidelines for all 9 career tracks, detailed tool lists, certification codes, and fees.",
      size: "PDF • 3.2 MB",
      badge: "Syllabus"
    },
    {
      id: 3,
      title: "Mandatory Stream Orientation Guide",
      desc: "Aligns code protocols, laptop specs checklists, and strategic local pickup points maps.",
      size: "PDF • 2.1 MB",
      badge: "Orientation"
    },
    {
      id: 4,
      title: "Strategic School Campus Map",
      desc: "Locate lecture blocks, physical networking SOC labs, visual rooms, and adviser desks.",
      size: "JPG • 1.1 MB",
      badge: "Campus Map"
    },
    {
      id: 5,
      title: "Olatech School Student Handbook",
      desc: "Rules of conduct, attendance sheet guidelines, grading standards, and placement options.",
      size: "PDF • 4.5 MB",
      badge: "Handbook"
    },
    {
      id: 6,
      title: "Company Bus Pickups Schedule",
      desc: "Detailed pickup times, designated local street junctions, and driver helpline logs.",
      size: "PDF • 1.8 MB",
      badge: "Commute Plan"
    }
  ];

  return (
    <div className="space-y-8 relative">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="border-l-4 border-emerald-500 pl-4 py-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">Professional Download Center</h2>
        <p className="text-xs sm:text-sm text-slate-500">Download operational resources, timetable calendars, route guidelines, and guides directly to your mobile device.</p>
      </div>

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-left">
        {downloadsList.map(dl => (
          <div 
            key={dl.id}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded text-[9px] uppercase tracking-wide">
                {dl.badge}
              </span>
              
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">{dl.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-sans">{dl.size}</p>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed text-xs">{dl.desc}</p>
            </div>

            <button 
              onClick={() => executeDocumentDownload(dl, setDownloadingId, setToastMsg)}
              disabled={downloadingId === dl.id}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 disabled:opacity-75 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm cursor-pointer"
            >
              {downloadingId === dl.id ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Preparing...
                </>
              ) : (
                <>
                  <Download size={12} /> Download Document
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
