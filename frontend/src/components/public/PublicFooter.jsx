import React from 'react';
import { OlympiadHubLogo } from '../OlympiadHubLogo';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Globe,
  Heart,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';

export const PublicFooter = ({ onNavigatePublic, onOpenLogin, onOpenRegister }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (page, sub = null) => {
    onNavigatePublic(page, sub);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2e1065] text-slate-200 border-t border-[#1e295d] relative overflow-hidden">
      {/* Background Decorative Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5b3da8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#16327a]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <OlympiadHubLogo size="lg" showTagline={true} light={true} onClick={() => handleNav('home')} />
            <p className="text-xs text-[#deb8de] leading-relaxed max-w-sm pt-2">
              SkillRise Olympiad is an advanced, production-grade international examination platform empowering elementary to high school students with rigorous conceptual assessments, proctored testing, and merit recognition.
            </p>
            
            <div className="space-y-2 text-[#deb8de] pt-2">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e7b84b] shrink-0" />
                <span>support@skillrise.org • admissions@skillrise.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d9775b] shrink-0" />
                <span>+91 11 4988 2000 • Mon-Sat (9:00 AM - 6:00 PM IST)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#deb8de] shrink-0" />
                <span>Academic Examination Bureau, Global Knowledge Corridor, New Delhi</span>
              </div>
            </div>
          </div>

          {/* Column 2: Olympiads */}
          <div>
            <h4 className="text-sm font-black text-[#e7b84b] uppercase tracking-wider mb-4">
              Olympiad Disciplines
            </h4>
            <ul className="space-y-2.5 text-[#deb8de]">
              {OLYMPIAD_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleNav('olympiad-detail', cat.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.shortName} Olympiad
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('olympiads')}
                  className="text-[#e7b84b] font-bold hover:underline cursor-pointer"
                >
                  View All Disciplines →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Preparation & Practice */}
          <div>
            <h4 className="text-sm font-black text-[#e7b84b] uppercase tracking-wider mb-4">
              Prep &amp; Resources
            </h4>
            <ul className="space-y-2.5 text-[#deb8de]">
              <li>
                <button type="button" onClick={() => handleNav('practice-hub')} className="hover:text-white transition-colors cursor-pointer">
                  Online Practice Hub
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('syllabus')} className="hover:text-white transition-colors cursor-pointer">
                  Class-wise Syllabus
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('pattern')} className="hover:text-white transition-colors cursor-pointer">
                  Exam Pattern &amp; Blueprint
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('sample-papers')} className="hover:text-white transition-colors cursor-pointer">
                  Sample Papers 2026
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('sample-papers')} className="hover:text-white transition-colors cursor-pointer">
                  Previous Year Papers (2022-25)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('workbooks')} className="hover:text-white transition-colors cursor-pointer">
                  Olympiad Workbooks
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links & Institutional */}
          <div>
            <h4 className="text-sm font-black text-[#e7b84b] uppercase tracking-wider mb-4">
              Platform &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-[#deb8de]">
              <li>
                <button type="button" onClick={() => handleNav('schedule')} className="hover:text-white transition-colors cursor-pointer">
                  Exam Schedule &amp; Dates
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('rankings')} className="hover:text-white transition-colors cursor-pointer">
                  National Leaderboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('results-finder')} className="hover:text-white transition-colors cursor-pointer">
                  Scorecard &amp; Result Finder
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('certificates-info')} className="hover:text-white transition-colors cursor-pointer">
                  Verify Certificates
                </button>
              </li>

              <li>
                <button type="button" onClick={() => handleNav('coordinator')} className="hover:text-white transition-colors cursor-pointer">
                  Become a Coordinator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Fees &amp; Scholarships
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('faqs')} className="hover:text-white transition-colors cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Trust Bar */}
      <div className="border-t border-[#4e2a4a] bg-[#240d23] py-6 text-xs text-[#deb8de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>© {currentYear} <strong>SkillRise Olympiad</strong>. All rights reserved.</span>
            <span className="text-[#8c4e8b]">•</span>
            <span className="text-[#e7b84b]">“Learn. Practice. Compete. Achieve.”</span>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Proctoring Ethics</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
