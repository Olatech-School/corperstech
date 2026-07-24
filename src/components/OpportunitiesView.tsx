import { useState, useEffect, DragEvent, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Briefcase, Calendar, DollarSign, Filter, ArrowRight, CheckCircle2, Upload, X, FileText } from 'lucide-react';
import { OPPORTUNITIES } from '../data';
import { Opportunity } from '../types';

export default function OpportunitiesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('all');
  
  // Application Modal state
  const [applyingFor, setApplyingFor] = useState<any | null>(null);
  const [appForm, setAppForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentNyscState: '',
    nyscBatch: '',
    technologySkill: '',
    experienceLevel: 'Beginner',
    portfolioUrl: '',
    linkedInProfile: '',
    githubProfile: '',
    coverLetter: '',
    fileName: ''
  });
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [opportunities, setOpportunities] = useState<any[]>([]);

  // Fetch from our real SQLite / CMS backend
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setOpportunities(res.data);
        } else {
          // Fallback to sample data from data.ts
          setOpportunities(OPPORTUNITIES.map(o => ({
            ...o,
            skills: Array.isArray(o.skills) ? o.skills.join(', ') : o.skills
          })));
        }
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setOpportunities(OPPORTUNITIES.map(o => ({
          ...o,
          skills: Array.isArray(o.skills) ? o.skills.join(', ') : o.skills
        })));
      });
  }, []);

  // Filters opportunities
  const filteredOpps = opportunities.filter(opp => {
    const skillsString = (opp.skills || '').toLowerCase();
    const titleMatch = (opp.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = (opp.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const skillsMatch = skillsString.includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || companyMatch || skillsMatch;
    
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesRole = selectedRoleType === 'all' || opp.roleType === selectedRoleType;

    return matchesSearch && matchesType && matchesRole;
  });

  // Handle Drag/Drop for simulated CV upload
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAppForm(prev => ({ ...prev, fileName: e.dataTransfer.files[0].name }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAppForm(prev => ({ ...prev, fileName: e.target.files[0].name }));
    }
  };

  const handleApplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!appForm.fullName || !appForm.email || !appForm.phone || !appForm.currentNyscState || !appForm.nyscBatch) {
      alert('Please fill out all required fields marked with *');
      return;
    }
    
    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobOpportunityId: applyingFor.id,
          ...appForm
        })
      });

      const res = await response.json();
      if (res.success) {
        setAppSubmitted(true);
      } else {
        alert(res.error || 'Failed to submit application.');
      }
    } catch (err: any) {
      console.error("Error applying:", err);
      alert('Network error occurred. Please try again.');
    }
  };

  const closeAppModal = () => {
    setApplyingFor(null);
    setAppForm({
      fullName: '',
      email: '',
      phone: '',
      currentNyscState: '',
      nyscBatch: '',
      technologySkill: '',
      experienceLevel: 'Beginner',
      portfolioUrl: '',
      linkedInProfile: '',
      githubProfile: '',
      coverLetter: '',
      fileName: ''
    });
    setAppSubmitted(false);
  };

  return (
    <div className="space-y-12 pb-20 text-left">
      
      {/* Title Header */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 rounded-3xl px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100/50">
            NYSC Tech Placement Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-2">
            Latest Jobs & Internships
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Apply for positions handpicked for competent corps members. Provided by Olatech School partner agencies.
          </p>
        </div>
        
        {/* Support Alert badge */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 max-w-sm flex items-start gap-2.5 shadow-sm">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-normal">
            <strong>Olatech Endorsement:</strong> Graduates who complete their projects with over 80% marks are directly endorsed to these corporate HR systems.
          </p>
        </div>
      </section>

      {/* Interactive Board Control Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-4">
          
          {/* Search box */}
          <div className="relative w-full lg:flex-1">
            <span className="absolute left-3.5 top-3.5 text-slate-400">
              <Search size={18} />
            </span>
            <input
              id="job-search-input"
              type="text"
              placeholder="Search by job title, company name, or technology stack..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            {/* Work Type */}
            <div className="relative">
              <select
                id="filter-work-type"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full sm:w-44 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white appearance-none"
              >
                <option value="all">🔍 All Locations</option>
                <option value="Remote">🏠 Remote</option>
                <option value="Hybrid">🤝 Hybrid</option>
                <option value="On-site">🏢 On-site</option>
              </select>
            </div>

            {/* Role Type */}
            <div className="relative">
              <select
                id="filter-role-type"
                value={selectedRoleType}
                onChange={e => setSelectedRoleType(e.target.value)}
                className="w-full sm:w-48 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white appearance-none"
              >
                <option value="all">🎓 All Roles</option>
                <option value="Internship">Internships</option>
                <option value="Graduate Trainee">Graduate Trainee</option>
                <option value="Entry-level">Entry-Level Roles</option>
              </select>
            </div>
          </div>

        </div>

        {/* Jobs List Grid */}
        <div className="space-y-6">
          {filteredOpps.length > 0 ? (
            filteredOpps.map(opp => (
              <div
                key={opp.id}
                id={`opp-list-card-${opp.id}`}
                className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm transition-all hover:shadow-md text-left"
              >
                {/* Details left side */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-4">
                    {/* Simulated Logo placeholder */}
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-700 font-black rounded-xl flex items-center justify-center shrink-0 uppercase text-sm select-none">
                      {opp.company.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-800 rounded-md tracking-wide uppercase">
                          {opp.roleType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          • Posted {opp.datePosted}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight mt-1">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-600 -mt-0.5">{opp.company}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
                    {opp.description}
                  </p>

                  {/* Skills required */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Required Skills:</span>
                    {(typeof opp.skills === 'string' 
                      ? opp.skills.split(',').map((s: string) => s.trim()).filter(Boolean) 
                      : (Array.isArray(opp.skills) ? opp.skills : [])
                    ).map((skill: string) => (
                      <span key={skill} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-slate-600 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply right side details */}
                <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-4 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={14} className="text-slate-400" /> <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <DollarSign size={14} className="text-slate-400" /> 
                      <span className="font-semibold text-emerald-700 font-mono bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/30">
                        {opp.stipend}
                      </span>
                    </div>
                  </div>

                  <button
                    id={`apply-portal-btn-${opp.id}`}
                    onClick={() => setApplyingFor(opp)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02]"
                  >
                    Quick Apply <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 space-y-4">
              <p className="text-slate-400 text-sm">No placement opportunities found matching your search filters.</p>
              <button
                id="reset-search-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedRoleType('all');
                }}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </section>

      {/* Quick Simulated Application Modal */}
      <AnimatePresence>
        {applyingFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            {/* Backdrop close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={closeAppModal}
            />

            {/* Application Modal Window */}
            <motion.div
              id="job-application-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 my-8"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Placements Agency</span>
                  <h3 className="text-lg font-bold text-slate-800">Apply for {applyingFor.title}</h3>
                  <p className="text-xs text-emerald-600 font-medium">{applyingFor.company}</p>
                </div>
                <button
                  id="close-apply-modal-btn"
                  onClick={closeAppModal}
                  className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleApplySubmit} className="p-6">
                <AnimatePresence mode="wait">
                  {!appSubmitted ? (
                    <motion.div
                      key="apply-form-inputs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                    >
                      <p className="text-xs text-slate-500 leading-normal">
                        Fill in your professional parameters. Olatech partner placement offices will review your technical scores.
                      </p>

                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Samuel Adebayo"
                            value={appForm.fullName}
                            onChange={e => setAppForm(prev => ({ ...prev, fullName: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="samuel@gmail.com"
                            value={appForm.email}
                            onChange={e => setAppForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Phone & NYSC State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">WhatsApp / Phone *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+234 812..."
                            value={appForm.phone}
                            onChange={e => setAppForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current NYSC State *</label>
                          <select
                            required
                            value={appForm.currentNyscState}
                            onChange={e => setAppForm(prev => ({ ...prev, currentNyscState: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white"
                          >
                            <option value="">-- Select State --</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja (FCT)">Abuja (FCT)</option>
                            <option value="Ogun">Ogun</option>
                            <option value="Oyo">Oyo</option>
                            <option value="Kano">Kano</option>
                            <option value="Rivers">Rivers</option>
                            <option value="Enugu">Enugu</option>
                            <option value="Kaduna">Kaduna</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* NYSC Batch & Skills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">NYSC Batch *</label>
                          <select
                            required
                            value={appForm.nyscBatch}
                            onChange={e => setAppForm(prev => ({ ...prev, nyscBatch: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white"
                          >
                            <option value="">-- Choose Batch --</option>
                            <option value="2026 Batch A">2026 Batch A</option>
                            <option value="2026 Batch B">2026 Batch B</option>
                            <option value="2025 Batch C">2025 Batch C</option>
                            <option value="Ex-Corper">Ex-Corper / Completed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Technology Skill *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., React, UI/UX Design, Node.js"
                            value={appForm.technologySkill}
                            onChange={e => setAppForm(prev => ({ ...prev, technologySkill: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Experience Level & Portfolio URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Experience Level *</label>
                          <select
                            required
                            value={appForm.experienceLevel}
                            onChange={e => setAppForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 bg-white"
                          >
                            <option value="Beginner">Beginner (under 1 year)</option>
                            <option value="Intermediate">Intermediate (1-3 years)</option>
                            <option value="Advanced">Advanced (3+ years)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Portfolio Link (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://myportfolio.com"
                            value={appForm.portfolioUrl}
                            onChange={e => setAppForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* LinkedIn & GitHub */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn Profile Link</label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={appForm.linkedInProfile}
                            onChange={e => setAppForm(prev => ({ ...prev, linkedInProfile: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GitHub Profile Link</label>
                          <input
                            type="url"
                            placeholder="https://github.com/username"
                            value={appForm.githubProfile}
                            onChange={e => setAppForm(prev => ({ ...prev, githubProfile: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* CV Upload area */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Upload CV / Resume (PDF, DOCX) *</label>
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                            isDragging 
                              ? 'border-emerald-500 bg-emerald-50/50' 
                              : appForm.fileName 
                                ? 'border-emerald-400 bg-slate-50' 
                                : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="file"
                            id="cv-file-picker"
                            required={!appForm.fileName}
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.doc"
                            className="hidden"
                          />
                          <label htmlFor="cv-file-picker" className="cursor-pointer space-y-1.5 block">
                            {appForm.fileName ? (
                              <div className="flex items-center justify-center gap-2 text-emerald-600">
                                <FileText size={20} />
                                <span className="text-xs font-semibold">{appForm.fileName}</span>
                              </div>
                            ) : (
                              <>
                                <Upload size={20} className="text-slate-400 mx-auto" />
                                <p className="text-xs text-slate-600">
                                  <strong>Click to upload</strong> or drag and drop your file here
                                </p>
                                <p className="text-[10px] text-slate-400">PDF or DOCX max 5MB</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Brief Cover Note */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cover Letter / Short Introduction *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Briefly introduce yourself, your current technical stack, and your motivation..."
                          value={appForm.coverLetter}
                          onChange={e => setAppForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={closeAppModal}
                          className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl"
                        >
                          Submit Recruitment Application
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="apply-form-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6 space-y-4"
                    >
                      <div className="mx-auto w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-800">Application Submitted!</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Thank you {appForm.fullName}, your application for <strong>{applyingFor.title}</strong> has been successfully registered.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-[11px] text-slate-500 space-y-2 max-w-md mx-auto">
                        <p className="font-semibold text-slate-600">🛡️ Recruitment Verification Path:</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-500">
                          <li>Your CV and profile are logged in CorpersTech Command Center database.</li>
                          <li>Our Olatech placement coordinators will evaluate your tech skill indicators.</li>
                          <li>Partner recruiters from <strong>{applyingFor.company}</strong> will directly reach out via phone or email.</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={closeAppModal}
                        className="mt-6 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Back to Job Board
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
