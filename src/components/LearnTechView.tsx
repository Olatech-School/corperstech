import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Cpu, ShieldCheck, ChevronRight, HelpCircle, Check, Award, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { PROGRAMS } from '../data';
import { Program } from '../types';
import LucideIcon from './LucideIcon';

interface LearnTechViewProps {
  onProgramClick: (program: Program) => void;
  onRegisterClick: (programId?: string) => void;
}

export default function LearnTechView({ onProgramClick, onRegisterClick }: LearnTechViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Programs' },
    { id: 'dev', label: 'Software & Web' },
    { id: 'data', label: 'Data & Cloud' },
    { id: 'creative', label: 'Design & Creative' },
    { id: 'admin', label: 'Workplace & Support' }
  ];

  const filteredPrograms = PROGRAMS.filter(program => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'dev') {
      return ['web-dev', 'python', 'app-dev'].includes(program.id);
    }
    if (selectedCategory === 'data') {
      return ['data-analysis', 'cybersecurity'].includes(program.id);
    }
    if (selectedCategory === 'creative') {
      return ['graphics-design'].includes(program.id);
    }
    if (selectedCategory === 'admin') {
      return ['ms-office', 'virtual-assistant'].includes(program.id);
    }
    return true;
  });

  const faqs = [
    {
      q: "What if I get deployed to a remote village (PPA) with low internet access?",
      a: "No problem. Olatech provides offline-downloadable video lectures, curriculum handouts, and code exercises. You can download lessons during your weekly Community Development Service (CDS) in town, study offline at your Place of Primary Assignment (PPA), and upload your assignments when you have connectivity."
    },
    {
      q: "Do I need a high-spec computer or laptop to start?",
      a: "Most of our paths (like Data Analysis, Microsoft Office, Virtual Assistant, and Web Development) run perfectly fine on standard entry-level dual-core laptops with 4GB or 8GB of RAM. Cybersecurity or App Development might benefit from higher specs, but we teach you how to use free cloud sandboxes (such as Google Colab and Replit) so your computer hardware won't hold you back."
    },
    {
      q: "Can I join class if I am serving outside Lagos or Abuja?",
      a: "Yes! CorpersTech operates fully structured hybrid schedules. We have robust interactive online cohorts with live evening classes, recorded playbacks, and weekend review clinics designed specifically to accommodate different states of service across Nigeria."
    },
    {
      q: "Are Olatech certifications recognized by international employers?",
      a: "Absolutely. Olatech School of Programming is a registered educational institution. Our certificates are backed by direct project portfolios which we help you host on GitHub or public websites, allowing recruiters in any country to verify your functional programming competence."
    },
    {
      q: "Is there support for the final NYSC POP (Passing Out Parade) transition?",
      a: "Yes! During your 9th to 11th months of service, we enroll you into our 'Job Readiness Accelerator' which guides you in building an attractive technical resume, optimizing your LinkedIn profile, practicing technical interview answers, and pitching for roles."
    }
  ];

  return (
    <div className="space-y-20 pb-20 text-left">
      
      {/* Header Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-800/40">
            OLATECH PROGRAM DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Choose Your High-Income Tech Specialty
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our expert-designed programs take you from absolute novice to certified practitioner during your 12-month national service year.
          </p>
        </div>
      </section>

      {/* Program Explorer with Filter Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Explore Skill Paths</h3>
            <p className="text-xs text-slate-400 mt-1">Select a category to filter our specialized professional programs.</p>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPrograms.map(program => (
            <div
              key={program.id}
              id={`learn-tech-card-${program.id}`}
              className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow hover:border-slate-200/50"
            >
              {/* Left Side: Icon */}
              <div className="shrink-0">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
                  <LucideIcon name={program.icon} size={24} />
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-lg font-bold text-slate-800">{program.title}</h4>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-lg uppercase">
                      {program.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Micro syllabus overview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Main Tools Taught</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {program.tools.map(tool => (
                      <span key={tool} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-600 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <button
                    id={`view-syllabus-btn-${program.id}`}
                    onClick={() => onProgramClick(program)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    View Class Syllabus <ChevronRight size={14} />
                  </button>
                  <button
                    id={`direct-enroll-btn-${program.id}`}
                    onClick={() => onRegisterClick(program.id)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Quick Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NYSC 12-Month Journey Timeline Section */}
      <section className="bg-slate-50/50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Your 12-Month Service Year Timeline</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              How Olatech School structures your training milestones alongside your official NYSC scheme obligations.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-100 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 relative z-10">
              {[
                {
                  period: "Months 1 - 2: Foundation & Groundwork",
                  title: "Camp Passing-Out & Core Onboarding",
                  desc: "As you settle into your Place of Primary Assignment (PPA), we start with digital foundations, software setups, design thinking, and algorithmic syntax basics to get your computer ready."
                },
                {
                  period: "Months 3 - 6: Intensive Core Specialization",
                  title: "Coding, Designing, and Analyzing",
                  desc: "Diving deep into your chosen technology course. You write actual source structures, query live databases, build visual assets, and undergo code review checks twice every week."
                },
                {
                  period: "Months 7 - 8: Live Team Projects",
                  title: "Real Client Briefing & Deployment",
                  desc: "Form squads with other corps members to solve real business challenges provided by local enterprises. Learn project management pipelines, git branches, and cloud deployment."
                },
                {
                  period: "Months 9 - 12: Job Readiness Accelerator",
                  title: "Resume Reviews & POP Prep",
                  desc: "While preparing for your Passing Out Parade (POP), we help audit your technical resume, optimize your LinkedIn profile, compile portfolios, and match you with internships."
                }
              ].map((milestone, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} className="flex flex-col md:flex-row items-stretch">
                    {/* Date/Period Column */}
                    <div className={`w-full md:w-1/2 flex items-center ${isEven ? 'md:justify-end md:pr-10' : 'md:order-2 md:justify-start md:pl-10'}`}>
                      <div className="text-left md:text-right bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-xl text-xs font-bold font-mono inline-block">
                        {milestone.period}
                      </div>
                    </div>

                    {/* Timeline circle spacer on md and up */}
                    <div className="hidden md:flex items-center justify-center relative w-10">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm z-20" />
                    </div>

                    {/* Description Text Column */}
                    <div className={`w-full md:w-1/2 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm ${isEven ? 'md:order-2 md:pl-10' : 'md:pr-10 text-left'}`}>
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-1">{milestone.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{milestone.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2">
            <HelpCircle className="text-emerald-500" /> Frequently Answered Questions
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Everything you need to know about combining Olatech classes with your local NYSC duties.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 p-5 transition-all text-left"
            >
              <button
                id={`faq-toggle-btn-${idx}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between font-bold text-slate-800 text-sm sm:text-base text-left focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-emerald-500 shrink-0 ml-4 font-mono">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              
              {activeFaq === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Alert Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3.5">
          <AlertCircle size={22} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-800">Note to Prospective and Serving Corps Members:</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Olatech coordinates with NYSC local coordinators regarding CDS schedules in various local government areas. We understand your service obligations and ensure classes do not conflict with weekly clearance check-ins.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
