import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Shield, ChevronRight, ChevronLeft, ChevronDown, CheckCircle2, Award, Users, Star, GraduationCap, Briefcase, Zap, Compass, Sparkles, MapPin } from 'lucide-react';
import { PROGRAMS, VALUES, STATS, OPPORTUNITIES, TESTIMONIALS } from '../data';
import { Program, Opportunity } from '../types';
import LucideIcon from './LucideIcon';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onProgramClick: (program: Program) => void;
  onRegisterClick: (programId?: string) => void;
}

export default function HomeView({ setActiveTab, onProgramClick, onRegisterClick }: HomeViewProps) {
  // Live stats state (Module 6)
  const [liveStats, setLiveStats] = useState<{
    students: number;
    courses: number;
    mentors: number;
    jobs: number;
  }>({
    students: 1247,
    courses: 12,
    mentors: 24,
    jobs: 320
  });

  useEffect(() => {
    let active = true;
    fetch('/api/stats')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && active) {
          const registeredCount = res.data.total;
          setLiveStats({
            students: Math.max(1247, 1247 + registeredCount),
            courses: 12,
            mentors: 24,
            jobs: Math.max(300, 300 + Math.round(registeredCount * 0.4))
          });
        }
      })
      .catch(err => console.warn('Live stats fetch error:', err));
    return () => {
      active = false;
    };
  }, []);

  // Testimonial slider state (Module 7)
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // FAQ state (Module 8)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Do I need a laptop?",
      answer: "Yes, you need a personal laptop to participate in classes, complete assignments, and build your project portfolios. It doesn't need to be high-end, but must be in healthy working condition."
    },
    {
      question: "Can beginners apply?",
      answer: "Absolutely! Our courses are designed from scratch by expert Olatech mentors specifically to guide absolute beginners up to entry-level software engineer, cyber analyst, and designer standards."
    },
    {
      question: "Will transportation be provided?",
      answer: "Yes, Olatech provides standard Company Bus commute services to registered students from our strategic local pickup locations."
    },
    {
      question: "Can I learn after NYSC?",
      answer: "We strongly advise utilizing your NYSC service year because of the unique abundance of free time. However, our tech classes are also open to post-NYSC graduates and professionals."
    },
    {
      question: "Will certificates be issued?",
      answer: "Yes, verified professional certificates of completion from Olatech School of Programming are awarded to graduates who successfully satisfy our capstone project standards."
    },
    {
      question: "Can I pay in installments?",
      answer: "Yes! Olatech offers friendly interest-free installment payment schedules specifically structured for corps members to ease their financial journey."
    }
  ];
  
  // Staggered container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:py-20 lg:py-24">
        {/* Subtle top decoration grid */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none select-none">
          <svg className="w-full h-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/60"
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-emerald-800 font-mono uppercase tracking-wider">
                  NYSC Class Cohort 2026 Now Enrolling
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
              >
                Learn Tech <span className="text-emerald-600">During NYSC</span> & Become Job Ready
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed font-normal animate-fade-in"
              >
                Channel your service year's free time and NYSC allowance into high-yielding digital skills. Build real projects, gain expert Olatech mentorship, and step directly into a tech career.
              </motion.p>

              {/* Core Pillars Grid (Module 10) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2"
              >
                {[
                  { text: 'Learn Tech During NYSC', desc: 'Transform free time into elite skills.' },
                  { text: 'Build Real Projects', desc: 'Deploy live portfolios to GitHub.' },
                  { text: 'Get Career Support', desc: 'ATS CV rewrite & mock panels.' },
                  { text: 'Become Job Ready', desc: 'Guaranteed placement references.' }
                ].map((pillar, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-left bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-all duration-300 hover:scale-[1.01] hover:bg-slate-100/30">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100/50 font-bold text-[10px]">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{pillar.text}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <button
                  id="hero-learn-tech-btn"
                  onClick={() => setActiveTab('learn-tech')}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-center shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  Learn Tech <ArrowRight size={18} />
                </button>
                <button
                  id="hero-explore-opps-btn"
                  onClick={() => setActiveTab('opportunities')}
                  className="px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-center shadow-sm hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  Explore Opportunities
                </button>
              </motion.div>

              {/* Quick Trust Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100 text-slate-400"
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>100% Practical Courses</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Award size={16} className="text-emerald-500" />
                  <span>Verified Olatech Certifications</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Users size={16} className="text-emerald-500" />
                  <span>Direct Mentorship Groups</span>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive SVG Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center p-6 bg-gradient-to-br from-white to-slate-50/50">
                
                {/* Embedded SVG Illustration */}
                <svg className="w-full h-full text-emerald-600" fill="none" viewBox="0 0 320 320">
                  {/* Outer Orbiting Rings */}
                  <circle cx="160" cy="160" r="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="160" cy="160" r="100" stroke="#e2e8f0" strokeWidth="1.5" />
                  
                  {/* Laptop Base */}
                  <rect x="50" y="180" width="220" height="12" rx="6" fill="#1e293b" />
                  <rect x="70" y="90" width="180" height="100" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                  
                  {/* Screen Content Lines */}
                  <rect x="85" y="105" width="60" height="6" rx="3" fill="#16a34a" />
                  <rect x="85" y="117" width="110" height="4" rx="2" fill="#475569" />
                  <rect x="85" y="127" width="80" height="4" rx="2" fill="#475569" />
                  <rect x="85" y="137" width="130" height="4" rx="2" fill="#334155" />
                  
                  {/* Code cursor */}
                  <rect x="85" y="147" width="30" height="5" rx="2.5" fill="#e2e8f0" />
                  
                  {/* Floaters representing core modules */}
                  {/* Badge 1: Web Dev */}
                  <g transform="translate(45, 70)">
                    <rect width="65" height="26" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="15" cy="13" r="5" fill="#3b82f6" />
                    <text x="26" y="17" fill="#1e293b" fontSize="8" fontWeight="bold">Web Dev</text>
                  </g>
                  
                  {/* Badge 2: Cybersecurity */}
                  <g transform="translate(205, 130)">
                    <rect width="75" height="26" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="15" cy="13" r="5" fill="#ef4444" />
                    <text x="26" y="17" fill="#1e293b" fontSize="8" fontWeight="bold">Cyber Sec</text>
                  </g>

                  {/* Badge 3: Data Analytics */}
                  <g transform="translate(195, 60)">
                    <rect width="80" height="26" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="15" cy="13" r="5" fill="#f59e0b" />
                    <text x="26" y="17" fill="#1e293b" fontSize="8" fontWeight="bold">Data Science</text>
                  </g>
                  
                  {/* Center Star or Shield Icon inside Screen */}
                  <path d="M160,115 L168,131 L186,134 L173,147 L176,165 L160,156 L144,165 L147,147 L134,134 L152,131 Z" fill="#16a34a" />
                  
                  {/* Floating Cap or NYSC symbol */}
                  <g transform="translate(130, 20)">
                    <rect width="60" height="26" rx="8" fill="#10b981" />
                    <text x="12" y="16" fill="#ffffff" fontSize="9" fontWeight="extrabold">NYSC 🟢</text>
                  </g>
                </svg>

                {/* Absolutes floating details */}
                <div className="absolute -bottom-4 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 shadow-lg border border-slate-800">
                  <span className="text-emerald-400">⚡</span>
                  <span>Employability: Very High</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. WHY CORPERS TECH SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">The Ultimate Opportunity</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Why Should a Corps Member Learn Tech During NYSC?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Many graduates make the mistake of waiting until they pass out to start thinking about jobs. The service year gives you a rare 12-month luxury of relative time, local allowances, and legal clearance. Don't waste it on social media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "The Perfect Timing Window",
              description: "NYSC places you in a unique state. You have moderate local obligations, giving you 3-5 hours daily of uninterrupted focus. This is the optimal window to study without corporate stress.",
              icon: "Zap",
              color: "text-amber-500 bg-amber-50 border-amber-100"
            },
            {
              title: "Escape Passing-Out Anxiety",
              description: "The fear of unemployment after POP is real. Acquiring high-income digital tech skills ensures you pass out with a portfolio ready to pitch directly to global tech employers.",
              icon: "Shield",
              color: "text-emerald-500 bg-emerald-50 border-emerald-100"
            },
            {
              title: "Build Real-World Portfolio",
              description: "Olatech School emphasizes practical execution. You won't just compile certificate papers; you will compile functional code databases and public-facing design directories.",
              icon: "Briefcase",
              color: "text-blue-500 bg-blue-50 border-blue-100"
            },
            {
              title: "Earn in Currencies That Matter",
              description: "Skill paths like Virtual Assistance, App Dev, and Frontend Programming allow you to perform remote freelance tasks for European and American clients, earning foreign currencies.",
              icon: "Compass",
              color: "text-purple-500 bg-purple-50 border-purple-100"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              id={`why-corpers-card-${idx}`}
              className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left space-y-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                <LucideIcon name={item.icon} size={20} />
              </div>
              <h4 className="text-base font-bold text-slate-800 tracking-tight">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED TECH PROGRAMS SECTION */}
      <section className="bg-slate-50/50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4 text-left">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Specialized Curriculums</h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
                Featured High-Income Tech Programs
              </h3>
              <p className="text-sm text-slate-500">
                Each course has been carefully formatted by Olatech expert mentors to accommodate absolute beginners. Learn at your own pace with practical support sessions.
              </p>
            </div>
            <button
              id="view-all-programs-btn"
              onClick={() => setActiveTab('learn-tech')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              Explore Course Specs <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map(program => (
              <div
                key={program.id}
                id={`program-card-${program.id}`}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-emerald-500/30 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-emerald-500/[0.02] transition-all duration-300 text-left"
              >
                <div className="space-y-4">
                  {/* Icon & Demand Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <LucideIcon name={program.icon} size={20} />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {program.duration}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {program.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    id={`learn-more-btn-${program.id}`}
                    onClick={() => onProgramClick(program)}
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                    View Curriculum <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    id={`card-quick-enroll-${program.id}`}
                    onClick={() => onRegisterClick(program.id)}
                    className="text-slate-500 hover:text-emerald-600 transition-colors font-medium"
                  >
                    Quick Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WHY LEARN WITH OLATECH SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Grid Advantage */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left order-2 lg:order-1">
            {VALUES.map(value => (
              <div 
                key={value.id}
                id={`value-card-${value.id}`}
                className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/40 flex items-center justify-center">
                  <LucideIcon name={value.icon} size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 tracking-tight">{value.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Right Text Header & Interactive Stats */}
          <div className="lg:col-span-5 space-y-6 text-left order-1 lg:order-2">
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">The Olatech Pedagogy</h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
                What Makes Olatech School Unique?
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                With a proven history of coaching students into professional roles across West Africa, Olatech brings structured class syllabi, verified learning resources, and real mentorship to Nigerian Corpers.
              </p>
            </div>

            {/* Statistics Display */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {[
                { id: 'students', label: 'Corpers Registered', value: liveStats.students, suffix: '+', icon: 'GraduationCap' },
                { id: 'courses', label: 'Tech Programs', value: liveStats.courses, suffix: '', icon: 'BookOpen' },
                { id: 'mentors', label: 'Expert Mentors', value: liveStats.mentors, suffix: '+', icon: 'Award' },
                { id: 'jobs', label: 'Opportunities Shared', value: liveStats.jobs, suffix: '+', icon: 'Briefcase' }
              ].map(stat => (
                <div key={stat.id} className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100/60 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-100/30">
                  <motion.div 
                    key={stat.value}
                    initial={{ scale: 0.9, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl sm:text-2xl font-black text-emerald-600 font-mono"
                  >
                    {stat.value.toLocaleString()}{stat.suffix}
                  </motion.div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                id="olatech-about-btn"
                onClick={() => setActiveTab('about')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Read our full founding story <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. LATEST TECH OPPORTUNITIES */}
      <section className="bg-slate-50/50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4 text-left">
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Exclusive Placements</h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
                Latest Tech Opportunities for Corpers
              </h3>
              <p className="text-sm text-slate-500">
                A preview of available entry-level roles, remote contracts, and graduate internships reserved for competent corps members.
              </p>
            </div>
            <button
              id="view-all-opps-btn"
              onClick={() => setActiveTab('opportunities')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              Search Opportunities <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPPORTUNITIES.map(opp => (
              <div
                key={opp.id}
                id={`opp-card-${opp.id}`}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Job Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-md tracking-wide uppercase">
                        {opp.roleType}
                      </span>
                      <h4 className="text-base font-bold text-slate-800 tracking-tight mt-1.5">{opp.title}</h4>
                      <p className="text-xs font-semibold text-emerald-600">{opp.company}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{opp.datePosted}</span>
                  </div>

                  {/* Job Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {opp.description}
                  </p>

                  {/* Tech Stack Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {opp.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-mono text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Job Footer */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={12} /> <span className="font-medium text-slate-600">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-800 font-mono bg-emerald-50/50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100/30">
                      {opp.stipend}
                    </span>
                    <button
                      id={`apply-btn-${opp.id}`}
                      onClick={() => setActiveTab('opportunities')}
                      className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION - Auto-rotating Spotlight Carousel */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Alumni Spotlights</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            What Fellow Corps Members Are Saying
          </h3>
          <p className="text-sm text-slate-500">
            Real success stories from graduates who converted their NYSC service year into global tech roles.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden min-h-[300px] flex flex-col justify-between">
          {/* Subtle quote icon background decoration */}
          <div className="absolute top-6 left-6 text-slate-100 font-serif text-8xl select-none leading-none pointer-events-none">“</div>
          
          <div className="relative z-10 space-y-6">
            {/* Five Star rating */}
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium text-left">
              "{TESTIMONIALS[activeTestimonial].text}"
            </blockquote>
          </div>

          {/* Author info & controls */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-3.5 text-left">
              <img
                referrerPolicy="no-referrer"
                src={TESTIMONIALS[activeTestimonial].avatar}
                alt={TESTIMONIALS[activeTestimonial].name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-sm shrink-0"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{TESTIMONIALS[activeTestimonial].name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {TESTIMONIALS[activeTestimonial].stateOfService} • <span className="font-mono">{TESTIMONIALS[activeTestimonial].batch}</span>
                </p>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50 mt-1">
                  Cohort Path: {TESTIMONIALS[activeTestimonial].program}
                </span>
              </div>
            </div>

            {/* Manual Slide Toggles */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={14} />
              </button>
              
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5 px-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'w-4 bg-emerald-600' : 'w-1.5 bg-slate-200'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Got Questions?</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500">
            Everything you need to know about Olatech School of Programming and CorpersTech classes.
          </p>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm md:text-base">{faq.question}</span>
                  <span className={`w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={14} />
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4 bg-slate-50/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. POWERFUL CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 text-center space-y-6">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 border border-emerald-800/40 text-emerald-400 rounded-full text-xs font-semibold">
               Prepare Your Post-NYSC Transition Today
            </div>
            
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
              Don't Complete NYSC Without a High-Income Digital Skill
            </h3>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              Join thousands of Nigerian corp members already studying in our cohorts. Learn at your own pace from certified experts at Olatech School. Your future self will thank you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="cta-register-now-btn"
                onClick={() => onRegisterClick()}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                Register For This Cohort
              </button>
              <button
                id="cta-contact-adviser-btn"
                onClick={() => setActiveTab('contact')}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition-all"
              >
                Talk to a Program Adviser
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-mono">
              ✓ NO PRIOR PROGRAMMING EXPERIENCE OR COMPUTER SCIENCE DEGREE REQUIRED ✓
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
