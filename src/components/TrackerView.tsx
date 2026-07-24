import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, BookOpen, Laptop, Bus, AlertCircle, FileText, CheckCircle2, ArrowRight, Clock, ShieldCheck, Mail, Phone, RefreshCw } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

interface TimelineStage {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future' | 'failed';
}

export default function TrackerView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter your Reference Number or Email Address.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnrollment(null);

    try {
      const response = await fetch(`/api/enrollments/track/search?query=${encodeURIComponent(searchQuery.trim())}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No application found for this reference or email.');
      }

      setEnrollment(result.data);
    } catch (err: any) {
      console.error('Tracker search error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Map database status to professional timeline stages
  const getTimelineStages = (status: string): TimelineStage[] => {
    const isPending = status === 'Pending';
    const isReviewed = status === 'Reviewed';
    const isApproved = status === 'Approved';
    const isRejected = status === 'Rejected';
    const isEnrolled = status === 'Enrolled';

    if (isRejected) {
      return [
        {
          title: 'Application Submitted',
          description: 'Your registration has been received successfully.',
          status: 'completed',
        },
        {
          title: 'Under Review',
          description: 'Our admissions board reviewed your academic details.',
          status: 'completed',
        },
        {
          title: 'Admission Status',
          description: 'Your application has been declined. You can contact support for details.',
          status: 'failed',
        },
      ];
    }

    return [
      {
        title: 'Application Submitted',
        description: 'Your registration has been logged in our databases.',
        status: 'completed', // always completed if found
      },
      {
        title: 'Under Review',
        description: 'Admissions team is reviewing your NYSC posting details.',
        status: isPending ? 'current' : 'completed',
      },
      {
        title: 'Phone Verification',
        description: 'Short phone interview to verify your availability and tech requirements.',
        status: isPending ? 'future' : isReviewed ? 'current' : 'completed',
      },
      {
        title: 'Admission Approved',
        description: 'Congratulations! Your slot in the cohort has been secured.',
        status: (isPending || isReviewed) ? 'future' : isApproved ? 'current' : 'completed',
      },
      {
        title: 'Welcome Pack Sent',
        description: 'Virtual and physical onboarding handbook & links delivered.',
        status: (isPending || isReviewed || isApproved) ? 'future' : isEnrolled ? 'current' : 'completed',
      },
      {
        title: 'Class Begins',
        description: 'Physical & virtual programming lectures kick off at centers.',
        status: isEnrolled ? 'current' : 'future',
      },
    ];
  };

  const stages = enrollment ? getTimelineStages(enrollment.status) : [];
  const refNum = enrollment ? `CT-2026-${String(enrollment.id).padStart(4, '0')}` : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
      {/* Intro Header */}
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track My Application
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Monitor your tech learning application process in real-time. Enter your CorpersTech reference code or email below to check your current status.
        </p>
      </div>

      {/* Search Input Box Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-10 max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Registration Reference or Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <Search size={18} />
              </span>
              <input
                id="tracker-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. CT-2026-0005 or samuel@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-50/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm rounded-xl transition-all"
              />
            </div>
          </div>

          <button
            id="tracker-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/10 disabled:opacity-75 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Searching Database...
              </>
            ) : (
              <>
                Track Status <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2 text-xs leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Result Panel */}
      <AnimatePresence mode="wait">
        {enrollment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Header summary of current status */}
            <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider font-mono">Current Position</span>
                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  Reference: <span className="font-mono text-emerald-800">{refNum}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Applied on {new Date(enrollment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <div className="self-start md:self-auto flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-500">Current Phase:</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border ${
                  enrollment.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  enrollment.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  enrollment.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  enrollment.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  enrollment.status === 'Enrolled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {enrollment.status}
                </span>
              </div>
            </div>

            {/* Grid Layout: Timeline Left, Details Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Timeline (Left 7 Columns) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock size={18} className="text-emerald-600" /> Professional Status Timeline
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {stages.map((stage, idx) => {
                    const isCompleted = stage.status === 'completed';
                    const isCurrent = stage.status === 'current';
                    const isFailed = stage.status === 'failed';

                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Dot indicator */}
                        <span className={`absolute -left-[21px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                          isCurrent ? 'bg-white border-emerald-500 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-pulse' :
                          isFailed ? 'bg-red-500 border-red-500 text-white' :
                          'bg-white border-slate-200 text-slate-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 size={14} className="stroke-[3]" />
                          ) : isFailed ? (
                            <AlertCircle size={14} className="stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 bg-current rounded-full" />
                          )}
                        </span>

                        {/* Content Card */}
                        <div className={`p-4 rounded-xl border flex-grow transition-all ${
                          isCurrent ? 'bg-emerald-50/30 border-emerald-500/60' :
                          isCompleted ? 'bg-white border-slate-100' :
                          'bg-white border-slate-100 opacity-60'
                        }`}>
                          <h4 className={`text-sm font-bold ${
                            isCurrent ? 'text-emerald-800' :
                            isCompleted ? 'text-slate-800' :
                            isFailed ? 'text-red-800' :
                            'text-slate-500'
                          }`}>
                            {stage.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{stage.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details (Right 5 Columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Premium Details Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText size={18} className="text-emerald-600" /> Applicant Information
                  </h3>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Full Name</span>
                      <span className="font-bold text-slate-800">{enrollment.firstName} {enrollment.lastName}</span>
                    </div>

                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Tech Path</span>
                      <span className="font-semibold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">{enrollment.course}</span>
                    </div>

                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">State of Service</span>
                      <span className="font-bold text-slate-800">{enrollment.stateOfService} State</span>
                    </div>

                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Place of Assignment</span>
                      <span className="font-semibold text-slate-600 text-right max-w-[200px] truncate" title={enrollment.ppa}>{enrollment.ppa}</span>
                    </div>

                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">NYSC Batch</span>
                      <span className="font-semibold text-slate-700">{enrollment.nyscBatch}</span>
                    </div>

                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Commute Choice</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        {enrollment.transportationOption === 'Company Bus' ? (
                          <>
                            <Bus size={12} className="text-emerald-600" /> Company Bus
                          </>
                        ) : (
                          'Self Commute'
                        )}
                      </span>
                    </div>

                    {enrollment.pickupLocation && (
                      <div className="py-3 flex justify-between gap-4">
                        <span className="text-slate-400 font-medium">Pickup Point</span>
                        <span className="font-semibold text-emerald-700">{enrollment.pickupLocation}</span>
                      </div>
                    )}

                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Owns Laptop</span>
                      <span className="font-bold text-slate-800">{enrollment.laptopAvailable}</span>
                    </div>
                  </div>
                </div>

                {/* Secure Disclaimer Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-400 leading-relaxed flex gap-2.5">
                  <ShieldCheck size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider mb-0.5">Applicant Verification</p>
                    Your privacy is protected. This screen displays information matching the submitted credentials securely. For support, reach out to Olatech School of Programming.
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
