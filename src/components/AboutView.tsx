import { motion } from 'motion/react';
import { CheckCircle2, Award, Shield, Users, ArrowUpRight, Sparkles, Milestone } from 'lucide-react';

interface AboutViewProps {
  onRegisterClick: () => void;
}

export default function AboutView({ onRegisterClick }: AboutViewProps) {
  return (
    <div className="space-y-20 pb-20 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. HERO HEADER */}
      <section className="py-12 sm:py-16 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100/50">
            About Olatech School
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Mission: Empowering Nigerian Youth
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            CorpersTech is an educational initiative designed and backed by Olatech School of Programming to address post-graduation youth unemployment across Nigeria.
          </p>
        </div>
      </section>

      {/* 2. CORE STATEMENT & FOUNDRY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Why We Started CorpersTech
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Every year, hundreds of thousands of Nigerian graduates are deployed for their mandatory national service. Unfortunately, many spend this critical year waiting around for administrative PPAs without acquiring any practical skills. When they pass out, they face a fiercely competitive job market with paper degrees but zero technical capabilities.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            At <strong>Olatech School of Programming</strong>, we saw a massive opportunity. The NYSC service year is a golden timing window—free from the intense speed of school exams, and packed with months of relative leisure. CorpersTech provides the framework, professional curriculums, and direct mentors to help corps members turn this service year into a technical launching pad.
          </p>
          
          <div className="border-l-4 border-emerald-500 pl-4 py-1 italic text-xs text-slate-600">
            "We don't teach you to pass exams. We teach you to compile code, query databases, configure firewalls, and secure modern remote jobs."
            <span className="block font-semibold text-slate-800 font-sans mt-2 not-italic text-[10px] uppercase tracking-wider">— Olatech Academic Team</span>
          </div>
        </div>

        {/* Right illustrative card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6 bg-gradient-to-br from-white to-slate-50/50">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-emerald-600">Our Core Mandates</h4>
          
          <div className="space-y-4">
            {[
              {
                title: "100% Practical Pedagogy",
                desc: "No slides without live sandboxes. Every lesson centers on real-world files, codes, and configurations."
              },
              {
                title: "Industry Mentorship",
                desc: "Instructors who actively consult for banks, foreign startups, and security firms across Africa."
              },
              {
                title: "Direct Placement Networks",
                desc: "Strong partnerships with local financial institutions and technology hubs to fast-track recruitment."
              }
            ].map((mandate, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-slate-800">{mandate.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-normal">{mandate.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COHORT VALUES & MILESTONES */}
      <section className="bg-slate-50 py-16 rounded-3xl px-6 sm:px-10 border border-slate-100">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Our Academic Ecosystem</h3>
          <p className="text-xs text-slate-400">
            When you join any Olatech cohort, you are stepping into a structured workspace optimized for professional training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Olatech Certifications",
              description: "Graduate with a globally verifiable certificate recognized by technology hubs. Displays your final grades and direct project links.",
              icon: "Award"
            },
            {
              title: "Project-Based Portfolios",
              description: "Every student builds at least 3 custom production-grade projects. Your work is published live on GitHub or web hosts for recruiters to audit.",
              icon: "Milestone"
            },
            {
              title: "Interactive Collaboration",
              description: "Study inside live WhatsApp groups, code together on Slack, and form project cohorts with fellow NYSC members across Nigeria.",
              icon: "Users"
            }
          ].map((eco, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center">
                <span className="font-bold">✓</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 tracking-tight">{eco.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{eco.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION FOR INITIATIVE */}
      <section className="text-center py-8 space-y-6">
        <div className="max-w-xl mx-auto space-y-3">
          <h3 className="text-2xl font-black text-slate-800">Invest in Yourself This Year</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your NYSC allowances (alawee) and free time are your seed capital. Invest them wisely inside Olatech's guided digital tech paths.
          </p>
        </div>
        <button
          id="about-cta-register"
          onClick={onRegisterClick}
          className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/10"
        >
          Secure Your Cohort Seat Now
        </button>
      </section>

    </div>
  );
}
