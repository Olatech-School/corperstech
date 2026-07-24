import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Send, MessageSquare } from 'lucide-react';

export default function ContactView() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-20 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* HEADER HERO */}
      <section className="py-12 border-b border-slate-100">
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100/50">
          Get In Touch
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-2">
          Contact Our Advisory Team
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Have questions about our curriculums, cohort schedules, or flexible payment plans? Contact us directly.
        </p>
      </section>

      {/* CORE CONTACT FORM & CHANNELS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form-inputs"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Adebayo"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. samuel@gmail.com"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. +234..."
                      value={form.phone}
                      onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inquiring about Cybersecurity"
                      value={form.subject}
                      onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Your Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your inquiry in detail. Feel free to list your tech goals or NYSC batch details..."
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                  />
                </div>

                <button
                  id="contact-form-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {loading ? 'Sending Message...' : 'Send Message'} <Send size={12} />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="mx-auto w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800">Message Delivered!</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Thank you. Your message has been sent to the Olatech School admissions department. We will reply via email within 12 hours.
                  </p>
                </div>
                <button
                  id="reset-contact-btn"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Send another inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Info Panels */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/60 space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-emerald-600">Olatech Channels</h3>

            <div className="space-y-4">
              
              <div className="flex gap-3">
                <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Physical Campus</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Olatech Tech Hub, Lagos, Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Direct Email Helpdesk</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    support@corperstech.com.ng<br />
                    admissions@olatechschool.com.ng
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Telephone Lines</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    +234 707 595 8413 (WhatsApp & Support Lines)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Academic Advising Hours</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Monday to Friday: 9:00 AM — 6:00 PM<br />
                    Saturdays: 10:00 AM — 4:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Info Advisory Box */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/40 text-[11px] text-emerald-800 leading-relaxed">
            🎓 <strong>Need a Live Consultation?</strong> Send a quick message via our WhatsApp channel for immediate consultation regarding installment payments or technical syllabus requirements.
          </div>

        </div>

      </section>

    </div>
  );
}
