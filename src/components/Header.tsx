import { useState } from 'react';
import { Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRegisterClick: () => void;
}

export default function Header({ activeTab, setActiveTab, onRegisterClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'learn-tech', label: 'Learn Tech' },
    { id: 'career-hub', label: 'Career Launch' },
    { id: 'career-dashboard', label: 'My Dashboard' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'track', label: 'Track App' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm group-hover:bg-emerald-700 transition-colors">
              CT
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight flex items-center gap-1.5">
                Corpers<span className="text-emerald-600 font-semibold">Tech</span>
              </span>
              <p className="text-[9px] font-mono font-medium tracking-widest text-slate-400 uppercase -mt-1">
                by Olatech School
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg hover:bg-slate-50 ${
                    isActive ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Call To Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="header-register-btn"
              onClick={onRegisterClick}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:scale-[1.02]"
            >
              Register Now <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Panel Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navigationItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-500 pl-3' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  id="mobile-header-register-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onRegisterClick();
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <GraduationCap size={16} /> Register Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
