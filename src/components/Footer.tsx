import { Mail, Phone, MapPin, ExternalLink, Globe, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onRegisterClick: () => void;
}

export default function Footer({ setActiveTab, onRegisterClick }: FooterProps) {
  const handleLinkClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* About CorpersTech */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">
                CT
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Corpers<span className="text-emerald-500">Tech</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An educational initiative of Olatech School of Programming. Empowering Nigerian NYSC corps members with high-income tech skills during their national service year.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button id="footer-link-home" onClick={() => handleLinkClick('home')} className="hover:text-emerald-500 transition-colors text-left">
                  Home Page
                </button>
              </li>
              <li>
                <button id="footer-link-learn" onClick={() => handleLinkClick('learn-tech')} className="hover:text-emerald-500 transition-colors text-left">
                  Featured Tech Programs
                </button>
              </li>
              <li>
                <button id="footer-link-career" onClick={() => handleLinkClick('career-hub')} className="hover:text-emerald-500 transition-colors text-left font-semibold text-emerald-400">
                  Career Launch Hub 🚀
                </button>
              </li>
              <li>
                <button id="footer-link-opps" onClick={() => handleLinkClick('opportunities')} className="hover:text-emerald-500 transition-colors text-left">
                  Tech Jobs & Internships
                </button>
              </li>
              <li>
                <button id="footer-link-about" onClick={() => handleLinkClick('about')} className="hover:text-emerald-500 transition-colors text-left">
                  About Olatech School
                </button>
              </li>
              <li>
                <button id="footer-link-contact" onClick={() => handleLinkClick('contact')} className="hover:text-emerald-500 transition-colors text-left">
                  Contact Support
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-staff" 
                  onClick={() => handleLinkClick('admissions')} 
                  className="hover:text-emerald-500 transition-colors text-left text-slate-500 font-medium text-[10px] mt-2 block"
                >
                  Staff Login
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Contact Info</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>+234 707 595 8413</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>support@corperstech.com.ng</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">Olatech Tech Hub, Lagos, Nigeria</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <a href="https://www.olatechschool.com.ng" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 flex items-center gap-1 transition-colors">
                  olatechschool.com.ng <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Motivation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Enrollment Advisory</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Make the transition from service year directly to employable professional. Enroll into our active classes before your passing-out-parade (POP).
            </p>
            <button
              id="footer-register-cta-btn"
              onClick={onRegisterClick}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
            >
              Get Started Now
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CorpersTech. All Rights Reserved. Powered by <a href="https://www.olatechschool.com.ng" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 font-medium">Olatech School of Programming</a>.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <button 
              id="footer-link-admissions"
              onClick={() => handleLinkClick('admissions')} 
              className="text-slate-400 hover:text-emerald-500 font-semibold cursor-pointer transition-colors"
            >
              Admissions Console 🔒
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
