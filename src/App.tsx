import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, ArrowUp } from 'lucide-react';

// Import Modular Components
import Header from './components/Header';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import ProgramDetailsModal from './components/ProgramDetailsModal';

// Import Views
import HomeView from './components/HomeView';
import LearnTechView from './components/LearnTechView';
import OpportunitiesView from './components/OpportunitiesView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AdmissionsView from './components/AdmissionsView';
import TrackerView from './components/TrackerView';
import CareerHubView from './components/CareerHubView';
import CareerDashboardView from './components/CareerDashboardView';
import SplashScreen from './components/SplashScreen';

import { Program } from './types';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('corperstech_splash_shown');
  });
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [defaultProgramId, setDefaultProgramId] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<{ isEnabled: boolean; message: string; startWindow?: string; endWindow?: string } | null>(null);

  // Check maintenance state
  useEffect(() => {
    fetch('/api/platform/maintenance')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.isEnabled === 'boolean') {
          setMaintenance(data);
        }
      })
      .catch(err => console.error('Failed to query maintenance state:', err));
  }, [activeTab]);

  // Monitor scroll for "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = (programId: string = '') => {
    setDefaultProgramId(programId);
    setIsRegisterOpen(true);
  };

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          sessionStorage.setItem('corperstech_splash_shown', 'true');
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30 text-slate-700">
      
      {/* Dynamic Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onRegisterClick={() => handleRegisterClick()} 
      />

      {/* Main Screen Layout Container */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-grow pt-4 sm:pt-8"
        >
          {maintenance?.isEnabled && activeTab !== 'admissions' ? (
            <div className="max-w-2xl mx-auto px-6 py-20 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 border border-emerald-100 animate-pulse">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-3">System Updates In Progress</h1>
              <div className="bg-emerald-600/10 text-emerald-800 px-4 py-2 rounded-full inline-block text-xs font-semibold tracking-wide uppercase mb-6">
                Maintenance Window Active
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {maintenance.message}
              </p>
              {maintenance.startWindow && maintenance.endWindow && (
                <div className="bg-slate-100 rounded-xl p-4 inline-block text-sm text-slate-500 mb-8 border border-slate-200">
                  <span className="font-semibold text-slate-700">Scheduled:</span> {maintenance.startWindow} – {maintenance.endWindow} (GMT+1)
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-slate-100 pt-8">
                <p className="text-xs text-slate-400">Public services will restore shortly. Operational staff retain direct system access.</p>
                <button 
                  onClick={() => setActiveTab('admissions')} 
                  className="px-4 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-300 rounded-lg transition-colors bg-white shadow-sm cursor-pointer"
                >
                  Authorized Staff Entry &rarr;
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView 
                  setActiveTab={setActiveTab} 
                  onProgramClick={handleProgramClick}
                  onRegisterClick={handleRegisterClick}
                />
              )}

              {activeTab === 'learn-tech' && (
                <LearnTechView 
                  onProgramClick={handleProgramClick}
                  onRegisterClick={handleRegisterClick}
                />
              )}

              {activeTab === 'opportunities' && (
                <OpportunitiesView />
              )}

              {activeTab === 'about' && (
                <AboutView onRegisterClick={() => handleRegisterClick()} />
              )}

              {activeTab === 'contact' && (
                <ContactView />
              )}

              {activeTab === 'admissions' && (
                <AdmissionsView />
              )}

              {activeTab === 'career-hub' && (
                <CareerHubView onRegisterClick={handleRegisterClick} setActiveTab={setActiveTab} />
              )}

              {activeTab === 'career-dashboard' && (
                <CareerDashboardView />
              )}

              {activeTab === 'track' && (
                <TrackerView />
              )}
            </>
          )}
        </motion.main>
      </AnimatePresence>

      {/* Static Footer */}
      <Footer 
        setActiveTab={setActiveTab} 
        onRegisterClick={() => handleRegisterClick()} 
      />

      {/* 8. MODALS & GLOBAL PERSISTENT CONTROLS */}
      
      {/* Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        defaultProgramId={defaultProgramId}
      />

      {/* Course Curriculum Specs Modal */}
      <ProgramDetailsModal
        program={selectedProgram}
        isOpen={selectedProgram !== null}
        onClose={() => setSelectedProgram(null)}
        onRegisterClick={handleRegisterClick}
      />

      {/* Persistent floating triggers: WhatsApp Counselor & Scroll To Top */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3">
        {/* Scroll To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              id="scroll-to-top-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="p-3 bg-white text-slate-600 rounded-full shadow-lg border border-slate-100 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp Action Button */}
        <motion.a
          id="whatsapp-counselor-link"
          href="https://wa.me/2348123456789?text=Hello%20CorpersTech%20I'm%20a%20corps%20member%2520interested%20in%20learning%20tech"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-xl flex items-center justify-center border border-emerald-500/10"
          title="Chat with Olatech Adviser"
        >
          <MessageCircle size={22} fill="currentColor" />
        </motion.a>
      </div>

    </div>
  );
}
