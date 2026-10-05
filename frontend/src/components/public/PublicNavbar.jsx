import React, { useState, useEffect } from 'react';
import { OlympiadHubLogo } from '../OlympiadHubLogo';
import {
  ChevronDown,
  Menu,
  X,
  User,
  Sparkles,
  BookOpen,
  Calendar,
  Award,
  BarChart3,
  Building,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  HelpCircle,
  LogIn
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import { getKeyInfoDropdownItems } from '../../data/keyInfoMasterData';

export const PublicNavbar = ({
  user,
  activePublicPage,
  onNavigatePublic,
  onOpenLogin,
  onGoToDashboard,
  onOpenRegister
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFaqsOpen, setMobileFaqsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredOlympiadId, setHoveredOlympiadId] = useState(null);
  const [hoveredPrepId, setHoveredPrepId] = useState(null);
  const [hoveredScheduleId, setHoveredScheduleId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dynamicDisciplines, setDynamicDisciplines] = useState([]);
  const [dynamicClasses, setDynamicClasses] = useState([]);
  const [faqDropdownItems, setFaqDropdownItems] = useState(() => getKeyInfoDropdownItems());

  useEffect(() => {
    const fetchMegaMenuData = async () => {
      try {
        const [resDisc, resCls] = await Promise.all([
          apiClient.get('/public/disciplines'),
          apiClient.get('/public/classes')
        ]);
        if (resDisc.success && Array.isArray(resDisc.data) && resDisc.data.length > 0) {
          setDynamicDisciplines(resDisc.data);
        }
        if (resCls.success && Array.isArray(resCls.data) && resCls.data.length > 0) {
          setDynamicClasses(resCls.data);
        }
      } catch (e) {
        // Fallback to static data
      }
    };
    fetchMegaMenuData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayedDisciplines = dynamicDisciplines.length > 0
    ? dynamicDisciplines.map((d) => ({
        id: d.slug || (d.code ? String(d.code).toLowerCase() : '') || 'math',
        name: d.full_name || d.name || 'Olympiad',
        shortName: d.name ? d.name.replace(' Olympiad', '') : 'Olympiad',
        code: d.code || 'SRO',
        color: d.color || '#4e2a4a',
        eligibleClasses: d.tagline || 'Classes 1 to 12',
        totalQuestions: d.questions_count || 50
      }))
    : OLYMPIAD_CATEGORIES;

  const displayedClassesList = dynamicClasses.length > 0
    ? dynamicClasses.map((c) => c.name)
    : [
        'Nursery',
        'LKG',
        'UKG',
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7',
        'Class 8',
        'Class 9',
        'Class 10',
        'Class 11',
        'Class 12'
      ];

  const handleLinkClick = (pageId, subId = null, classLevel = null) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setHoveredOlympiadId(null);
    setHoveredPrepId(null);
    setHoveredScheduleId(null);
    onNavigatePublic(pageId, subId, classLevel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeHoveredCat = displayedDisciplines.find(c => c.id === hoveredOlympiadId);
  const activeScheduleCat = displayedDisciplines.find(c => c.id === hoveredScheduleId);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#fff9f2]/95 backdrop-blur-md shadow-sm border-b border-[#edd6ed]'
          : 'bg-[#fff9f2] border-b border-[#f4ebf4]'
      }`}
    >
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#122459] via-[#241e6e] to-[#5b3da8] text-white text-[11px] font-semibold py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-[#fbbf24] text-[#122459] font-black px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider">
            ★ Registrations Open 2026-27
          </span>
          <span>National &amp; International Online Olympiads for Classes 1 to 12.</span>
          <button
            type="button"
            onClick={onOpenRegister}
            className="underline font-bold text-[#faf4e0] hover:text-white cursor-pointer ml-1"
          >
            Enroll Student Today →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <OlympiadHubLogo
              size="md"
              showTagline={false}
              onClick={() => handleLinkClick('home')}
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Home */}
              <button
                type="button"
                onClick={() => handleLinkClick('home')}
                className={`px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  activePublicPage === 'home'
                    ? 'text-[#6d3a68] bg-[#f4ebf4]'
                    : 'text-[#5c3158] hover:text-[#6d3a68] hover:bg-[#faf5fa]'
                }`}
              >
                Home
              </button>

              {/* 1. Olympiads Multi-Level Flyout Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('olympiads')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handleLinkClick('olympiads')}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    activePublicPage === 'olympiads' || activePublicPage === 'olympiad-detail'
                      ? 'text-[#6d3a68] bg-[#f4ebf4]'
                      : 'text-[#5c3158] hover:text-[#6d3a68] hover:bg-[#faf5fa]'
                  }`}
                >
                  <span>Olympiads</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {openDropdown === 'olympiads' && (
                  <div
                    onMouseLeave={() => setHoveredOlympiadId(null)}
                    className={`absolute left-0 top-full pt-1.5 transition-all duration-200 z-50 ${
                      hoveredOlympiadId ? 'w-[560px]' : 'w-[280px]'
                    } animate-in fade-in slide-in-from-top-2`}
                  >
                    <div className="bg-white rounded-md border-2 border-[#edd6ed] shadow-2xl overflow-hidden flex divide-x divide-[#edd6ed]">
                      
                      {/* Left Column: Categories List */}
                      <div className="w-[280px] bg-[#fffdfa] flex flex-col justify-between shrink-0">
                        <div>
                          <div className="px-3.5 py-2 text-[10px] uppercase font-black text-[#8c4e8b] tracking-wider border-b border-[#f4ebf4] bg-[#faf5fa]/70 flex items-center justify-between">
                            <span>Available Disciplines</span>
                            <span className="text-[9px] font-normal text-slate-400">Hover to expand</span>
                          </div>
                          
                          <div className="divide-y divide-[#f4ebf4] max-h-[380px] overflow-y-auto">
                            {displayedDisciplines.map((cat) => {
                              const isHovered = hoveredOlympiadId === cat.id;
                              const codePrefix = cat.code ? cat.code.split('-')[0] : 'OHO';
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onMouseEnter={() => setHoveredOlympiadId(cat.id)}
                                  onClick={() => handleLinkClick('olympiad-detail', cat.id)}
                                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                                    isHovered
                                      ? 'bg-[#4e2a4a] text-white shadow-xs'
                                      : 'text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                                  }`}
                                >
                                  <span className="truncate pr-1">
                                    {cat.shortName} Olympiad ({codePrefix})
                                  </span>
                                  <span className={`text-[10px] font-black shrink-0 ${isHovered ? 'text-[#e7b84b]' : 'text-[#d9775b]'}`}>
                                    ▶
                                  </span>
                                </button>
                              );
                            })}

                            {/* Class-wise Direct Explorer */}
                            <button
                              type="button"
                              onMouseEnter={() => setHoveredOlympiadId('class-wise')}
                              onClick={() => handleLinkClick('syllabus')}
                              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                                hoveredOlympiadId === 'class-wise'
                                  ? 'bg-[#4e2a4a] text-white shadow-xs'
                                  : 'text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                              }`}
                            >
                              <span>Class wise Directory</span>
                              <span className={`text-[10px] font-black shrink-0 ${hoveredOlympiadId === 'class-wise' ? 'text-[#e7b84b]' : 'text-[#d9775b]'}`}>
                                ▶
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Bottom Explore All Footer */}
                        <div className="p-2.5 border-t border-[#edd6ed] bg-[#faf5fa]">
                          <button
                            type="button"
                            onClick={() => handleLinkClick('olympiads')}
                            className="w-full text-center py-1.5 text-xs font-black text-[#6d3a68] hover:bg-white rounded-sm border border-[#edd6ed] transition-colors cursor-pointer"
                          >
                            Explore All {displayedDisciplines.length} Categories →
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Flyout Submenu for Classes & Details (Only shown when hoveredOlympiadId is set) */}
                      {hoveredOlympiadId && (
                        <div className="w-[280px] bg-white flex flex-col justify-between shrink-0 animate-in fade-in duration-150">
                          <div>
                            {/* Submenu Top Title Header */}
                            <div className="px-4 py-2.5 bg-[#faf4f9] border-b border-[#edd6ed]">
                              <p className="text-xs font-black text-[#4e2a4a] truncate">
                                {hoveredOlympiadId === 'class-wise'
                                  ? 'All Classes (Nursery - Grade 12)'
                                  : (activeHoveredCat ? activeHoveredCat.name : 'Olympiad Details')}
                              </p>
                              <p className="text-[10px] font-semibold text-[#8c4e8b] truncate">
                                {hoveredOlympiadId === 'class-wise'
                                  ? 'Curriculum & Model Question Papers'
                                  : (activeHoveredCat ? `${activeHoveredCat.eligibleClasses} • ${activeHoveredCat.totalQuestions || 50} Questions` : 'Select Student Grade')}
                              </p>
                            </div>

                            {/* Sub-Items / Classes List (All Grades Nursery to Class 12) */}
                            <div className="divide-y divide-[#fdf2f8] max-h-[320px] overflow-y-auto">
                              {displayedClassesList.map((cls, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    if (hoveredOlympiadId === 'class-wise') {
                                      handleLinkClick('syllabus', null, cls);
                                    } else if (activeHoveredCat) {
                                      handleLinkClick('olympiad-detail', activeHoveredCat.id, cls);
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] flex items-center justify-between transition-colors cursor-pointer group"
                                >
                                  <span>{cls}</span>
                                  <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Syllabus →
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Bottom Submenu Action CTA */}
                          <div className="p-3 border-t border-[#edd6ed] bg-[#fffdfa]">
                            <button
                              type="button"
                              onClick={() => {
                                if (hoveredOlympiadId === 'class-wise') {
                                  handleLinkClick('syllabus');
                                } else if (activeHoveredCat) {
                                  handleLinkClick('olympiad-detail', activeHoveredCat.id, 'Nursery');
                                }
                              }}
                              className="w-full py-2 px-3 bg-gradient-to-r from-[#d9775b] to-[#c85e42] hover:from-[#c85e42] hover:to-[#a74a32] text-white rounded-sm text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <span>
                                {hoveredOlympiadId === 'class-wise'
                                  ? 'View Full Syllabus'
                                  : `Explore ${activeHoveredCat ? activeHoveredCat.shortName : 'Olympiad'}`}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#e7b84b]" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>

              {/* 2. Preparation Multi-Level Flyout Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('preparation')}
                onMouseLeave={() => {
                  setOpenDropdown(null);
                  setHoveredPrepId(null);
                }}
              >
                <button
                  type="button"
                  onClick={() => handleLinkClick('practice-hub')}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    ['syllabus', 'pattern', 'sample-papers', 'practice-hub', 'workbooks', 'faqs'].includes(activePublicPage)
                      ? 'text-[#6d3a68] bg-[#f4ebf4]'
                      : 'text-[#5c3158] hover:text-[#6d3a68] hover:bg-[#faf5fa]'
                  }`}
                >
                  <span>Preparation</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {openDropdown === 'preparation' && (
                  <div
                    onMouseLeave={() => setHoveredPrepId(null)}
                    className={`absolute left-0 top-full pt-1.5 transition-all duration-200 z-50 ${
                      hoveredPrepId ? 'w-[540px]' : 'w-[260px]'
                    } animate-in fade-in slide-in-from-top-2`}
                  >
                    <div className="bg-white rounded-md border-2 border-[#edd6ed] shadow-2xl overflow-hidden flex divide-x divide-[#edd6ed]">
                      
                      {/* Left Column: Main Preparation Menu */}
                      <div className="w-[260px] bg-[#fffdfa] flex flex-col justify-between shrink-0">
                        <div className="divide-y divide-[#f4ebf4]">
                          {/* 1. Olympiad Books */}
                          <button
                            type="button"
                            onMouseEnter={() => setHoveredPrepId(null)}
                            onClick={() => handleLinkClick('workbooks')}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] transition-colors cursor-pointer flex items-center justify-between"
                          >
                            <span>Olympiad Books</span>
                          </button>

                          {/* 2. Live Classes */}
                          <button
                            type="button"
                            onMouseEnter={() => setHoveredPrepId(null)}
                            onClick={() => handleLinkClick('practice-hub')}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] transition-colors cursor-pointer flex items-center justify-between"
                          >
                            <span>Live Classes</span>
                          </button>

                          {/* 3. Ask & Answer */}
                          <button
                            type="button"
                            onMouseEnter={() => setHoveredPrepId('ask')}
                            onClick={() => handleLinkClick('faqs')}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              hoveredPrepId === 'ask'
                                ? 'bg-[#4e2a4a] text-white shadow-xs'
                                : 'text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                            }`}
                          >
                            <span>Ask &amp; Answer</span>
                            <span className={`text-[10px] font-black ${hoveredPrepId === 'ask' ? 'text-[#e7b84b]' : 'text-[#d9775b]'}`}>
                              ▶
                            </span>
                          </button>

                          {/* 4. Free Prep Guides */}
                          <button
                            type="button"
                            onMouseEnter={() => setHoveredPrepId('guides')}
                            onClick={() => handleLinkClick('syllabus')}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              hoveredPrepId === 'guides'
                                ? 'bg-[#4e2a4a] text-white shadow-xs'
                                : 'text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                            }`}
                          >
                            <span>Free Prep Guides</span>
                            <span className={`text-[10px] font-black ${hoveredPrepId === 'guides' ? 'text-[#e7b84b]' : 'text-[#d9775b]'}`}>
                              ▶
                            </span>
                          </button>

                          {/* 5. Free Downloadable Worksheets */}
                          <button
                            type="button"
                            onMouseEnter={() => setHoveredPrepId('worksheets')}
                            onClick={() => handleLinkClick('sample-papers')}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              hoveredPrepId === 'worksheets'
                                ? 'bg-[#4e2a4a] text-white shadow-xs'
                                : 'text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                            }`}
                          >
                            <span>Free Downloadable Worksheets</span>
                            <span className={`text-[10px] font-black ${hoveredPrepId === 'worksheets' ? 'text-[#e7b84b]' : 'text-[#d9775b]'}`}>
                              ▶
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Dynamic Flyout Submenu */}
                      {hoveredPrepId && (
                        <div className="w-[280px] bg-white flex flex-col justify-between shrink-0 animate-in fade-in duration-150">
                          {/* Submenu for Ask & Answer */}
                          {hoveredPrepId === 'ask' && (
                            <div className="divide-y divide-[#fdf2f8]">
                              <button
                                type="button"
                                onClick={() => handleLinkClick('rankings')}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] flex items-center justify-between transition-colors cursor-pointer group"
                              >
                                <span>Leaderboard</span>
                                <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                                  View →
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLinkClick('faqs')}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] flex items-center justify-between transition-colors cursor-pointer group"
                              >
                                <span>Ask Questions</span>
                                <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                                  Post →
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLinkClick('faqs')}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] flex items-center justify-between transition-colors cursor-pointer group"
                              >
                                <span>Answer Questions</span>
                                <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                                  Explore →
                                </span>
                              </button>
                            </div>
                          )}

                          {/* Submenu for Free Prep Guides */}
                          {hoveredPrepId === 'guides' && (
                            <div className="divide-y divide-[#fdf2f8] max-h-[340px] overflow-y-auto">
                              {[
                                { id: 'math', name: 'Mathematics Olympiad (IMO)' },
                                { id: 'science', name: 'Science Olympiad (NSO)' },
                                { id: 'english', name: 'English Olympiad (IEO)' },
                                { id: 'spell-bee', name: 'Vocabulary Championship (VC)' },
                                { id: 'reasoning', name: 'Reasoning Olympiad (IRO)' },
                                { id: 'cyber', name: 'Cyber & AI Olympiad (ICO)' },
                                { id: 'mental-maths', name: 'Mental Mathematics (IMMO)' },
                                { id: 'gk', name: 'General Knowledge (IGKO)' }
                              ].map((guide) => (
                                <button
                                  key={guide.id}
                                  type="button"
                                  onClick={() => handleLinkClick('olympiad-detail', guide.id)}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] flex items-center justify-between transition-colors cursor-pointer group"
                                >
                                  <span>{guide.name}</span>
                                  <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                                    Guide →
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Submenu for Free Downloadable Worksheets */}
                          {hoveredPrepId === 'worksheets' && (
                            <div className="divide-y divide-[#fdf2f8] max-h-[340px] overflow-y-auto">
                              {[
                                { id: 'math', name: 'Mathematics Olympiad (IMO)' },
                                { id: 'science', name: 'Science Olympiad (NSO)' },
                                { id: 'english', name: 'English Olympiad (IEO)' },
                                { id: 'reasoning', name: 'Reasoning Olympiad (IRO)' },
                                { id: 'mental-maths', name: 'Mental Mathematics (IMMO)' }
                              ].map((ws) => (
                                <button
                                  key={ws.id}
                                  type="button"
                                  onClick={() => handleLinkClick('sample-papers')}
                                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] flex items-center justify-between transition-colors cursor-pointer group"
                                >
                                  <span>{ws.name}</span>
                                  <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                                    PDF →
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>

              {/* 3. Results & Rankings */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('results')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    ['rankings', 'results-finder', 'cut-off'].includes(activePublicPage)
                      ? 'text-[#6d3a68] bg-[#f4ebf4]'
                      : 'text-[#5c3158] hover:text-[#6d3a68] hover:bg-[#faf5fa]'
                  }`}
                >
                  <span>Results &amp; Rankings</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {openDropdown === 'results' && (
                  <div className="absolute left-0 top-full pt-2 w-64 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-md border border-[#edd6ed] shadow-xl p-2.5 space-y-1">
                      {[
                        { id: 'results-finder', label: 'Check Scorecard & Result', desc: 'Instant roll number lookup', icon: BarChart3 },
                        { id: 'rankings', label: 'National Leaderboard', desc: 'Global & Zonal rank lists', icon: Award },
                        { id: 'cut-off', label: 'Qualifying Cut-Offs', desc: 'Level 1 & Level 2 criteria', icon: CheckCircle2 }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleLinkClick(item.id)}
                          className="w-full text-left p-2 rounded-sm hover:bg-[#f4ebf4] flex items-start gap-2.5 transition-colors cursor-pointer"
                        >
                          <item.icon className="w-4 h-4 text-[#e7b84b] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#4e2a4a]">{item.label}</p>
                            <p className="text-[10px] text-slate-400">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. FAQs Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown('faqs')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => handleLinkClick('faqs')}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    openDropdown === 'faqs' || activePublicPage === 'faqs'
                      ? 'text-[#6d3a68] bg-[#f4ebf4]'
                      : 'text-[#5c3158] hover:text-[#6d3a68] hover:bg-[#faf5fa]'
                  }`}
                >
                  <span>FAQs</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {openDropdown === 'faqs' && (
                  <div className="absolute right-0 sm:left-0 top-full pt-1.5 w-60 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-md border border-[#edd6ed] shadow-2xl overflow-hidden py-1 divide-y divide-[#fdf2f8]">
                      {faqDropdownItems.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLinkClick(item.page)}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#4e2a4a] hover:bg-[#faf5fa] hover:text-[#6d3a68] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <span>{item.label}</span>
                          <span className="text-[10px] font-bold text-[#d9775b] opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6d3a68] to-[#8c4e8b] text-white rounded-md text-xs font-bold shadow-md shadow-[#6d3a68]/20 hover:shadow-lg hover:from-[#5c3158] hover:to-[#783559] transition-all cursor-pointer active:scale-95"
                >
                  <BarChart3 className="w-4 h-4 text-[#e7b84b]" />
                  <span>Go to My Dashboard ({user.role})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Login Button */}
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#f4ebf4] hover:bg-[#edd6ed] text-[#6d3a68] border border-[#edd6ed] rounded-md text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#6d3a68]" />
                  <span>Login</span>
                </button>

                {/* Register Now CTA Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setOpenDropdown('register')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'register' ? null : 'register')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#16327a] via-[#322378] to-[#5b3da8] hover:from-[#122459] hover:to-[#4d3291] text-white rounded-md text-xs font-extrabold transition-all shadow-md shadow-[#16327a]/30 cursor-pointer active:scale-95"
                  >
                    <span>Register Now</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        openDropdown === 'register' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Register Dropdown Menu */}
                  {openDropdown === 'register' && (
                    <div className="absolute right-0 top-full pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="bg-white rounded-md shadow-xl border border-[#edd6ed] py-1 divide-y divide-[#f4ebf4]">
                        <button
                          type="button"
                          onClick={() => handleLinkClick('free-trial')}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span>Free Trial</span>
                          <span className="text-[10px] font-black text-[#d9775b] bg-[#faf4e0] px-1.5 py-0.5 rounded-sm">
                            Free
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLinkClick('register-student')}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span>Student Registration</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6d3a68] group-hover:translate-x-0.5 transition-all" />
                        </button>



                        <button
                          type="button"
                          onClick={() => handleLinkClick('coordinator')}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] hover:text-[#6d3a68] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span>Become a Coordinator</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6d3a68] group-hover:translate-x-0.5 transition-all" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="px-3 py-1.5 bg-[#6d3a68] text-white rounded-md text-xs font-bold"
              >
                Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-[#f4ebf4] text-[#6d3a68] font-bold rounded-md text-xs border border-[#edd6ed]"
              >
                Login
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#6d3a68] hover:bg-[#f4ebf4] rounded-md"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#edd6ed] px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('olympiads')}
              className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
            >
              Olympiads (All 9 Disciplines)
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('practice-hub')}
              className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
            >
              Online Practice Hub
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('syllabus')}
              className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
            >
              Syllabus &amp; Exam Pattern
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('sample-papers')}
              className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
            >
              Sample &amp; Past Papers
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('rankings')}
              className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
            >
              National Leaderboard &amp; Cut-Offs
            </button>

            {/* Mobile FAQs Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileFaqsOpen(!mobileFaqsOpen)}
                className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] flex items-center justify-between"
              >
                <span>FAQs &amp; Key Info</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${mobileFaqsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileFaqsOpen && (
                <div className="pl-3 pr-2 py-1 space-y-0.5 bg-[#faf5fa]/70 rounded-md mt-1 mb-1 border border-[#edd6ed]/60">
                  {faqDropdownItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLinkClick(item.page)}
                      className="w-full text-left py-1.5 px-2 text-[11px] font-semibold text-[#5c3158] hover:text-[#6d3a68] hover:bg-white rounded-sm flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <span className="text-[9px] text-[#d9775b]">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="block px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Registrations
              </span>
              <button
                type="button"
                onClick={() => handleLinkClick('free-trial')}
                className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4] flex items-center justify-between"
              >
                <span>Free Trial</span>
                <span className="text-[9px] font-bold text-[#d9775b] bg-[#faf4e0] px-1.5 py-0.5 rounded-sm">Free</span>
              </button>
              <button
                type="button"
                onClick={() => handleLinkClick('register-student')}
                className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
              >
                Student Registration
              </button>

              <button
                type="button"
                onClick={() => handleLinkClick('coordinator')}
                className="w-full text-left px-3 py-2 rounded-sm text-xs font-bold text-[#4e2a4a] hover:bg-[#f4ebf4]"
              >
                Become a Coordinator
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-2.5 text-center bg-[#f4ebf4] text-[#6d3a68] font-extrabold rounded-md text-xs border border-[#edd6ed]"
                >
                  Student / Teacher / Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full py-2.5 text-center bg-gradient-to-r from-[#d9775b] to-[#c85e42] text-white font-extrabold rounded-md text-xs shadow-md"
                >
                  Register Now (Student Enrollment)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToDashboard();
                }}
                className="w-full py-2.5 text-center bg-[#6d3a68] text-white font-extrabold rounded-md text-xs shadow-md"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
