import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Briefcase, Cpu, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { Program } from '../types';
import LucideIcon from './LucideIcon';

interface ProgramDetailsModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: (programId: string) => void;
}

export default function ProgramDetailsModal({ program, isOpen, onClose, onRegisterClick }: ProgramDetailsModalProps) {
  if (!isOpen || !program) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        {/* Backdrop Trigger */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          id="program-details-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 my-8"
        >
          {/* Header section with icon and title */}
          <div className="relative px-6 py-8 border-b border-slate-100 bg-slate-50/50">
            {/* Close button */}
            <button
              id="close-details-modal-btn"
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <LucideIcon name={program.icon} size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-800">{program.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                    program.demand === 'Critical' 
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : program.demand === 'Very High'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    <TrendingUp size={11} /> {program.demand} Demand
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> Duration: <span className="text-slate-700 font-semibold">{program.duration}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Overview</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {program.description}
              </p>
            </div>

            {/* Core Tools & Software */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Tools & Technologies Taught</h4>
              <div className="flex flex-wrap gap-2">
                {program.tools.map(tool => (
                  <span key={tool} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/30 text-slate-700 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5">
                    <Cpu size={12} className="text-emerald-500" /> {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Opportunities */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={14} className="text-emerald-500" /> Potential Career Path Roles
              </h4>
              <p className="text-xs text-slate-600">
                Graduates from Olatech with this specialization routinely qualify to transition into these corporate positions:
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {program.careerPath}
              </p>
            </div>

            {/* Program Benefits */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">What You Will Gain</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {program.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-1">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <button
              id="close-details-footer-btn"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="details-register-btn"
              onClick={() => {
                onRegisterClick(program.id);
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Award size={16} /> Enroll In Course
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
