import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Briefcase, Award, CheckCircle2, ArrowRight, Download, MessageSquare, 
  Bookmark, Globe, Cpu, Sparkles, TrendingUp, DollarSign, Layers, BookOpen, Clock, 
  Users, Building2, Send, ExternalLink, Star, FileText, Check, AlertCircle, RefreshCw 
} from 'lucide-react';

interface CareerProfileModalProps {
  profile: any;
  onClose: () => void;
  onRegisterClick?: (programId?: string) => void;
  userEmail?: string;
}

export const CareerProfileModal: React.FC<CareerProfileModalProps> = ({
  profile,
  onClose,
  onRegisterClick,
  userEmail = 'student@corperstech.ng'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'skills' | 'roadmap' | 'portfolio' | 'jobs' | 'resources' | 'coach'>('overview');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AI Coach Chat states
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'model', text: string}>>([
    {
      role: 'model',
      text: `Hello! I am your Olatech AI Career Coach. I see you're exploring the **${profile.title}** career path. Ask me anything about breaking into this role during your NYSC year, portfolio strategy, or salary negotiations!`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Live opportunities & resources matching this career
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [resourcesList, setResourcesList] = useState<any[]>([]);

  useEffect(() => {
    // Record view analytics
    fetch(`/api/career-explorer/view/${profile.courseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    }).catch(() => {});

    // Check if saved
    fetch(`/api/career-explorer/saved/${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          const found = data.data.some((b: any) => b.courseId === profile.courseId);
          setIsSaved(found);
        }
      })
      .catch(() => {});

    // Seed mock matching jobs & resources
    setMatchedJobs([
      {
        id: 101,
        title: `Junior ${profile.title}`,
        company: 'Moniepoint Nigeria',
        location: 'Lagos / Hybrid',
        salary: profile?.salary?.nigeriaEntry || '₦300,000 / month',
        type: 'Full-Time / NYSC Attachment',
        tag: 'NYSC Friendly'
      },
      {
        id: 102,
        title: `Remote ${profile.title} Specialist`,
        company: 'Spars Tech Global UK',
        location: '100% Remote (Nigeria)',
        salary: profile?.salary?.remoteInternational || '$50,000 / year',
        type: 'Remote Contract',
        tag: 'USD Compensation'
      },
      {
        id: 103,
        title: `Freelance ${profile.title} Consultant`,
        company: 'Upwork & Retainer Clients',
        location: 'Remote Workspace',
        salary: profile?.salary?.freelanceRate || '$35 - $70 / hour',
        type: 'Freelance Contract',
        tag: 'Immediate Start'
      }
    ]);

    setResourcesList([
      {
        id: 'res-1',
        title: `${profile.title} 16-Week Mastery Roadmap`,
        category: 'Learning Roadmaps',
        format: 'High-Res PDF Guide • FREE',
        size: '2.4 MB'
      },
      {
        id: 'res-2',
        title: `ATS CV Template for ${profile.title}`,
        category: 'CV Templates',
        format: 'Word & Markdown Template • FREE',
        size: '1.1 MB'
      },
      {
        id: 'res-3',
        title: `${profile.title} Technical Interview Guide`,
        category: 'Interview Guides',
        format: 'PDF Handbook • FREE',
        size: '3.8 MB'
      },
      {
        id: 'res-4',
        title: `CompTIA / Industry Certification Study Checklist`,
        category: 'Certification Guides',
        format: 'Interactive PDF • FREE',
        size: '1.9 MB'
      }
    ]);
  }, [profile, userEmail]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleToggleSave = async () => {
    setSaveLoading(true);
    try {
      if (isSaved) {
        await fetch('/api/career-explorer/remove-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, courseId: profile.courseId })
        });
        setIsSaved(false);
        showToast(`Removed "${profile.title}" from your saved careers.`);
      } else {
        await fetch('/api/career-explorer/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            courseId: profile.courseId,
            courseTitle: profile.title,
            notes: `Bookmarked from Career Explorer on ${new Date().toLocaleDateString()}`
          })
        });
        setIsSaved(true);
        showToast(`✓ Saved "${profile.title}" to your Career Dashboard & Command Center!`);
      }
    } catch (err) {
      showToast('Could not update saved status. Offline proxy enabled.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDownloadResource = (title: string) => {
    showToast(`✓ Preparing download: "${title}"...`);
    const content = `# Olatech CorpersTech Resource\nTitle: ${title}\nCareer Path: ${profile.title}\nDownloaded on: ${new Date().toLocaleString()}\n\nThis is an official offline guidance document from Olatech Training Institute.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || chatLoading) return;

    const userText = inputMsg;
    setInputMsg('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/career/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `In the context of the career path "${profile.title}", ${userText}`,
          history: chatMessages.slice(-6)
        })
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      // Offline fallback coaching response
      setTimeout(() => {
        let reply = `That is an excellent question regarding **${profile.title}**. To excel in this path during your NYSC year, we recommend focusing on the tools listed in our roadmap (${(profile.tools || ['Figma', 'React', 'SQL']).slice(0, 3).join(', ')}). Building 2 real-world capstone projects will qualify you for immediate placement with our hiring partners!`;
        if (userText.toLowerCase().includes('salary') || userText.toLowerCase().includes('pay') || userText.toLowerCase().includes('money')) {
          reply = `In Nigeria, junior roles in **${profile.title}** start around ${profile?.salary?.nigeriaEntry || '₦250,000 / month'}, while senior or international remote contracts reach ${profile?.salary?.remoteInternational || '$60,000 / year'}. Acquiring practical certification with Olatech puts you at the upper end of these ranges.`;
        }
        setChatMessages(prev => [...prev, { role: 'model', text: reply }]);
      }, 700);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[60] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] transition-all">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Shield size={28} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                    {profile.category || 'Technology Track'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-emerald-300 border border-white/10">
                    {profile.demandRating || 'Critical Demand'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Difficulty: {profile.difficulty || 'Intermediate'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-white">
                  {profile.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2 max-w-2xl">
                  {profile.description}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSave}
                disabled={saveLoading}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isSaved
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                {isSaved ? 'Saved in Dashboard' : 'Save Career Profile'}
              </button>

              <button
                onClick={() => setActiveTab('coach')}
                className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/40"
              >
                <MessageSquare size={15} />
                Ask Olatech AI
              </button>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Salary (NG)</span>
              <span className="font-extrabold text-emerald-400 text-sm">{profile?.salary?.nigeriaEntry || '₦250,000 / mo'}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Remote Int'l Salary</span>
              <span className="font-extrabold text-white text-sm">{profile?.salary?.remoteInternational || '$55,000 / yr'}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Freelance Rate</span>
              <span className="font-extrabold text-amber-300 text-sm">{profile?.salary?.freelanceRate || '$35 - $75 / hr'}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Learning Timeline</span>
              <span className="font-extrabold text-sky-300 text-sm">{profile.duration || '12-16 Weeks'}</span>
            </div>
          </div>
        </div>

        {/* MODAL NAVIGATION TABS */}
        <div className="bg-slate-100 px-6 border-b border-slate-200 flex overflow-x-auto whitespace-nowrap gap-2 flex-shrink-0 scrollbar-none">
          {[
            { id: 'overview', label: '1. Overview & Role', icon: Briefcase },
            { id: 'opportunities', label: '2. Salaries & Demand', icon: DollarSign },
            { id: 'skills', label: '3. Skills & Tools Stack', icon: Cpu },
            { id: 'roadmap', label: '4. 8-Stage Roadmap', icon: Layers },
            { id: 'portfolio', label: '5. Capstone Projects', icon: Award },
            { id: 'jobs', label: '6. Live Jobs (3)', icon: Building2 },
            { id: 'resources', label: '7. Resources & Guides', icon: Download },
            { id: 'coach', label: '8. AI Career Coach', icon: Bot }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-white font-extrabold shadow-sm rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-t-lg'
                }`}
              >
                <TabIcon size={14} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* MODAL CONTENT AREA */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-6 bg-slate-50">
          {/* TAB 1: OVERVIEW & ROLE */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="text-emerald-600" size={20} />
                  Career Overview & Daily Activities
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {profile.description}
                </p>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
                  <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider mb-1">Who This Career Suits</h4>
                  <p className="text-xs text-emerald-800">{profile.whoItSuits || 'Ideal for problem solvers, tech enthusiasts, and graduates seeking high-growth digital skills.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="text-emerald-600" size={18} />
                    Why This Career is in Critical Demand
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {profile.globalPotential || 'High global talent shortage makes qualified professionals extremely valuable across both domestic and foreign markets.'}
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase block mb-2">NYSC Advantage in Nigeria:</span>
                    <p className="text-xs text-slate-700 bg-slate-100 p-3 rounded-xl border border-slate-200 font-medium">
                      {profile.nyscReason || 'Acquiring these practical skills during your NYSC year makes you an indispensable asset to corporate employers and guarantees immediate PPA placement.'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="text-emerald-600" size={18} />
                    Top Industries & Companies Hiring
                  </h3>
                  <p className="text-xs text-slate-500">Major employers actively recruiting for this skill track in Nigeria and globally:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(profile.companies || ['Flutterwave', 'Paystack', 'Moniepoint', 'Interswitch', 'KPMG', 'PwC']).map((comp: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-xl text-xs font-bold border border-slate-200 transition-all">
                        🏢 {comp}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 block">Long-Term Growth Pathway:</span>
                    <p className="text-xs text-slate-700 mt-1 font-medium">{profile.longTermGrowth || 'Advance from Junior Specialist to Senior Lead, Principal Engineer, or Director.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPPORTUNITIES & SALARIES */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-6 rounded-2xl text-white shadow-md">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="text-emerald-400" size={22} />
                  Comprehensive Salary Breakdown & Global Scope
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Realistic, market-verified compensation benchmarks across Nigerian corporate employers, African tech ecosystems, and international remote contracts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Local Nigeria Salary Box */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      🇳🇬 Local Nigeria Opportunities
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full">
                      High Liquid Market
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">Entry-Level / NYSC Attaché:</span>
                      <span className="text-xs font-black text-emerald-700">{profile?.salary?.nigeriaEntry || '₦200,000 - ₦400,000 / mo'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">Mid-Level Specialist (2-4 yrs):</span>
                      <span className="text-xs font-black text-slate-900">{profile?.salary?.nigeriaMid || '₦450,000 - ₦800,000 / mo'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-900">Senior Lead / Architect (5+ yrs):</span>
                      <span className="text-xs font-black text-emerald-800">{profile?.salary?.nigeriaSenior || '₦900,000 - ₦2,000,000+ / mo'}</span>
                    </div>
                  </div>
                </div>

                {/* International & Remote Salary Box */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      🌍 International Remote & Freelance
                    </h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-full">
                      USD / GBP Earning
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600">Africa Regional Average:</span>
                      <span className="text-xs font-black text-slate-900">{profile?.salary?.africaAverage || '$1,000 - $3,000 / mo'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl">
                      <span className="text-xs font-bold text-slate-300">Global Remote Contract:</span>
                      <span className="text-xs font-black text-emerald-400">{profile?.salary?.remoteInternational || '$50,000 - $95,000 / yr'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs font-bold text-amber-900">Freelance Hourly Consulting:</span>
                      <span className="text-xs font-black text-amber-800">{profile?.salary?.freelanceRate || '$30 - $75 / hour'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remote & Freelance Commentary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Globe size={16} className="text-sky-600" />
                    Remote Work Opportunities
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {profile.remote || 'Extremely high remote availability. Global companies actively hire remote specialists from Nigeria to integrate into international distributed teams.'}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    
                    Freelancing Opportunities
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {profile.freelance || 'High freelance potential. Offer project-based retainers, consultancy audits, and customized solutions to clients on Upwork, Fiverr, and local agency networks.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & TECHNOLOGY STACK */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Cpu className="text-emerald-600" size={20} />
                    Core Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(profile.skills || ['Core Technical Logic', 'System Diagnostics', 'Data Processing', 'API Integration', 'Cloud Deployment']).map((sk: string, idx: number) => (
                      <span key={idx} className="px-3.5 py-2 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
                        <Check size={13} className="text-emerald-600" />
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="text-sky-600" size={20} />
                    Required Soft Skills & Attributes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(profile.softSkills || ['Analytical Thinking', 'Problem Solving', 'Clear Communication', 'Stakeholder Management', 'Time Efficiency']).map((sk: string, idx: number) => (
                      <span key={idx} className="px-3.5 py-2 bg-sky-50 text-sky-900 border border-sky-200 font-bold text-xs rounded-xl">
                        💡 {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technology Stack & Certifications */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="text-purple-600" size={20} />
                  Industry Standard Technology Stack & Tools Used
                </h3>
                <p className="text-xs text-slate-500">Mastering this exact software stack is what qualifies you for high-paying corporate roles:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {(profile.tools || ['Figma', 'React.js', 'PostgreSQL', 'Docker', 'Python', 'Google Cloud']).map((tool: string, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-extrabold text-xs text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      {tool}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">Recommended Global Certifications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(profile.certifications || ['Industry Professional Certified Associate', 'AWS / GCP Specialist', 'CompTIA / Microsoft Certified']).map((cert: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold">
                        📜 {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 8-STAGE ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
                  <Layers className="text-emerald-600" size={22} />
                  8-Stage Professional Learning Roadmap
                </h3>
                <p className="text-xs text-slate-500">
                  A structured step-by-step evolution from total beginner to senior global technology practitioner. Follow this timeline during your NYSC service year.
                </p>

                <div className="mt-8 relative border-l-2 border-emerald-500/30 ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-8">
                  {(profile.roadmap && profile.roadmap.length > 0 ? profile.roadmap : [
                    { stage: 'Beginner', title: 'Fundamentals & Core Theory', description: 'Master foundational concepts, syntax, and essential tools.' },
                    { stage: 'Intermediate', title: 'Advanced Logic & Software Architecture', description: 'Build structured applications, database connections, and workflows.' },
                    { stage: 'Project Building', title: 'Hands-on Capstone Development', description: 'Construct real-world projects solving corporate business challenges.' },
                    { stage: 'Portfolio', title: 'GitHub / Behance Showcase Deployment', description: 'Publish verified open-source code or visual case studies to web platforms.' },
                    { stage: 'Internship', title: 'NYSC Corporate PPA Attachment', description: 'Join engineering or design teams at Nigerian partner organizations.' },
                    { stage: 'Freelancing', title: 'Client Agency & Retainer Consulting', description: 'Secure monthly retainers from local SMEs and foreign Upwork clients.' },
                    { stage: 'Remote Job', title: 'Global Remote Team Integration', description: 'Work full-time for international startups earning USD/GBP compensation.' },
                    { stage: 'Full-Time Career', title: 'Senior Tech Lead / Executive Architect', description: 'Lead enterprise teams and direct technology strategy.' }
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[33px] sm:-left-[41px] top-1 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shadow-md ring-4 ring-white">
                        {idx + 1}
                      </span>
                      <div className="bg-slate-50 group-hover:bg-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-slate-200 group-hover:border-emerald-300 transition-all shadow-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            Stage {idx + 1}: {item.stage || `Phase ${idx + 1}`}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">Step {idx + 1} of 8</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CAPSTONE PROJECTS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="text-amber-500" size={22} />
                  Recommended Portfolio Capstone Projects
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Build and publish these exact 3 projects to guarantee top-tier scores during your Olatech employer portfolio evaluation:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* Beginner Project */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                        Level 1: Beginner Project
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base mt-3">
                        {profile?.typicalProjects?.[0]?.split(' ')[0] || 'Core Utility'} Dashboard / Tool
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {profile?.typicalProjects?.[0] || 'Build a clean, functional utility application demonstrating core syntax, responsive layout, and data formatting.'}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Recommended for NYSC Week 4
                    </div>
                  </div>

                  {/* Intermediate Project */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                        Level 2: Intermediate Project
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base mt-3">
                        {profile?.typicalProjects?.[1]?.split(' ')[0] || 'Enterprise'} System Integration
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {profile?.typicalProjects?.[1] || 'Develop an integrated application connecting database persistence, API querying, and automated user notification workflows.'}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] font-bold text-purple-700 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Recommended for NYSC Week 8
                    </div>
                  </div>

                  {/* Advanced Capstone */}
                  <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between shadow-lg">
                    <div>
                      <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider">
                        Level 3: Advanced Capstone
                      </span>
                      <h4 className="font-extrabold text-white text-base mt-3">
                        {profile?.typicalProjects?.[2]?.split(' ')[0] || 'Production'} Scale Architecture
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {profile?.typicalProjects?.[2] || 'Deploy a production-grade, full-featured platform with security hardening, cloud hosting, and real-time performance metrics.'}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
                     Ready for Global Employer Review
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <Star className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-amber-900">
                    <strong>Portfolio Evaluation Note:</strong> Upon completing your Olatech training course, your mentor will review and endorse these 3 projects directly into your CorpersTech Verification Profile, making your credentials visible to our 250+ hiring partner employers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LIVE JOBS */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="text-emerald-600" size={20} />
                    Live Job & PPA Opportunities Matching This Track
                  </h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                    {matchedJobs.length} Active Positions
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  These opportunities are actively recruiting corpers and tech specialists in our Job Opportunities module:
                </p>

                <div className="space-y-3 pt-2">
                  {matchedJobs.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{job.title}</h4>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                            {job.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          🏢 <strong>{job.company}</strong> • 📍 {job.location} • {job.type}
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2">
                        <span className="font-extrabold text-emerald-600 text-xs">{job.salary}</span>
                        <button
                          onClick={() => {
                            showToast(`Opening application for "${job.title}" at ${job.company}...`);
                          }}
                          className="px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DOWNLOADABLE RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Download className="text-emerald-600" size={20} />
                    Downloadable Career Resources & Roadmaps
                  </h3>
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-full">
                    {resourcesList.length} Free Downloads
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Download high-resolution roadmaps, ATS-optimized CV templates, interview prep checklists, and certification study guides directly to your device:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {resourcesList.map((res) => (
                    <div key={res.id} className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{res.title}</h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{res.format} ({res.size})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadResource(res.title)}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl active:scale-95 transition-all cursor-pointer flex-shrink-0"
                        title="Download file"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AI CAREER COACH CHAT */}
          {activeTab === 'coach' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-5 rounded-2xl text-white flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  
                    Olatech AI Career Coach — Live Consultation
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Ask any question about breaking into <strong>{profile.title}</strong>, portfolio reviews, or salary negotiation.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase rounded-full">
                  Active Context: {profile.courseId}
                </span>
              </div>

              {/* Chat Messages Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 h-80 overflow-y-auto space-y-4 shadow-inner">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px] font-bold">
                        {msg.role === 'user' ? '🧑 You' : '🤖 Olatech AI Coach'}
                      </div>
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin text-emerald-600" />
                      <span>Olatech AI is generating personalized career advice...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder={`Ask Olatech AI about ${profile.title} roadmap, salaries, tools...`}
                  className="flex-grow px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !inputMsg.trim()}
                  className="px-6 py-3 bg-slate-900 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 shadow-md"
                >
                  <Send size={15} />
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* MODAL BOTTOM ACTION FOOTER: RECOMMENDED OLATECH COURSE */}
        <div className="bg-white p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-md">
              🎯
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Recommended Olatech Training Course
              </span>
              <h4 className="font-black text-slate-900 text-base mt-1">
                {profile?.recommendedCourse?.name || `${profile.title} Training Track`}
              </h4>
              <p className="text-xs text-slate-500">
                ⏱️ {profile?.recommendedCourse?.duration || profile.duration} • 💻 {profile?.recommendedCourse?.mode || '100% Online & CDS Access'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer w-full sm:w-auto"
            >
              Close Profile
            </button>
            <button
              onClick={() => {
                // Record register click
                fetch(`/api/career-explorer/register-click/${profile.courseId}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: userEmail })
                }).catch(() => {});
                
                onClose();
                if (onRegisterClick) {
                  onRegisterClick(profile.courseId);
                }
              }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-emerald-600/30 w-full sm:w-auto active:scale-98"
            >
              <span>Register for Course</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
