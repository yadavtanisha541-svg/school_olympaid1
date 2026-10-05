import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Search,
  Bell,
  ShoppingCart,
  LogOut,
  Menu,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Layers,
  FileQuestion,
  FileText,
  BarChart3,
  Trophy,
  Shield,
  Settings,
  User,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar, onNavigateTab, onOpenNotifications }) => {
  const { user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { isDark, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Search Items definition tailored to user role
  const searchableItems = useMemo(() => {
    const role = user?.role || 'student';

    const commonItems = [
      {
        id: 'notifications',
        title: 'Notification Center',
        description: 'View all announcements, test alerts & system updates',
        category: 'Pages',
        tab: 'notifications',
        icon: Bell,
        keywords: 'alerts notifications updates notices unread'
      },
      {
        id: 'verify_cert',
        title: 'Verify Certificate',
        description: 'Public certificate verification portal and authenticity check',
        category: 'Quick Actions',
        href: '#/verify-certificate',
        icon: Award,
        keywords: 'verify certificate credentials merit authentication download'
      }
    ];

    if (role === 'superadmin') {
      return [
        {
          id: 'admin_overview',
          title: 'Dashboard Overview',
          description: 'Platform metrics, candidate growth & quick stats',
          category: 'Modules',
          tab: 'overview',
          icon: BarChart3,
          keywords: 'superadmin home dashboard overview stats numbers'
        },
        {
          id: 'admin_students',
          title: 'Student Management',
          description: 'Search, add candidates, manage profiles, enrollments and results',
          category: 'Modules',
          tab: 'students',
          icon: GraduationCap,
          keywords: 'students candidates pupils enroll admissions profile muskan class 1'
        },
        {
          id: 'admin_add_student',
          title: 'Add New Student',
          description: 'Register a new candidate in OlympiadHub',
          category: 'Quick Actions',
          tab: 'students',
          icon: PlusCircle,
          keywords: 'create student new student registration enroll candidate'
        },
        {
          id: 'admin_teachers',
          title: 'Teacher & Faculty Management',
          description: 'Manage teachers, staff permissions and subject coordinators',
          category: 'Modules',
          tab: 'teachers',
          icon: Users,
          keywords: 'teachers faculty staff coordinators mentors permissions'
        },
        {
          id: 'admin_questions',
          title: 'Question Bank & MCQs',
          description: 'Create, edit and manage Olympiad question repository',
          category: 'Modules',
          tab: 'question_bank',
          icon: FileQuestion,
          keywords: 'questions mcq bank test series options mathematics science computers'
        },
        {
          id: 'admin_add_mcq',
          title: 'Create New Question / MCQ',
          description: 'Author a new question with 4 options and explanation',
          category: 'Quick Actions',
          tab: 'question_bank',
          icon: PlusCircle,
          keywords: 'add mcq new question question bank add question author'
        },
        {
          id: 'admin_exams',
          title: 'Exam Management & Schedules',
          description: 'Configure Olympiads, schedule live windows and timer rules',
          category: 'Modules',
          tab: 'exams',
          icon: BookOpen,
          keywords: 'exams tests olympiads schedule publish timing live window'
        },
        {
          id: 'admin_exam_cs_live',
          title: 'Class 1 Computer Science Live Olympiad 2026',
          description: 'Live test paper with 10 questions for Class 1',
          category: 'Olympiads',
          tab: 'exams',
          icon: BookOpen,
          keywords: 'computer science live olympiad 2026 class 1 test paper exam'
        },
        {
          id: 'admin_exam_math',
          title: 'Mathematics Olympiad 2026',
          description: 'National level math competition',
          category: 'Olympiads',
          tab: 'exams',
          icon: BookOpen,
          keywords: 'mathematics olympiad 2026 math exam test'
        },
        {
          id: 'admin_results',
          title: 'Exam Results & Scorecards',
          description: 'Review submissions, student scorecards and analytics',
          category: 'Modules',
          tab: 'results',
          icon: FileText,
          keywords: 'results scores evaluate marks report percentage attempts'
        },
        {
          id: 'admin_academic',
          title: 'Academic Structure (Classes & Subjects)',
          description: 'Manage Class 1 to 12, subjects, chapters and topics',
          category: 'Modules',
          tab: 'academic',
          icon: Layers,
          keywords: 'academic structure classes subjects syllabus class 1 class 2 class 6 class 10'
        },
        {
          id: 'admin_leaderboard',
          title: 'Overall Leaderboard',
          description: 'Rankings, top percentiles and state-wise toppers',
          category: 'Modules',
          tab: 'leaderboard',
          icon: Trophy,
          keywords: 'leaderboard ranks toppers top score winners merit'
        },
        {
          id: 'admin_certificates',
          title: 'Certificate Management',
          description: 'Generate, issue and sign merit & participation certificates',
          category: 'Modules',
          tab: 'certificates',
          icon: Award,
          keywords: 'certificates merit awards badges generate download issue'
        },
        {
          id: 'admin_logs',
          title: 'Activity Logs & Audit Trail',
          description: 'Track security events, admin actions and user logins',
          category: 'Modules',
          tab: 'activity_logs',
          icon: Shield,
          keywords: 'activity logs audit security trail history admin actions'
        },
        {
          id: 'admin_faqs_key_info',
          title: 'FAQs & Key Info Content Manager',
          description: 'Edit FAQs, Exam Dates, Syllabus, Sample Papers & Marking Scheme',
          category: 'Modules',
          tab: 'faqs_key_info',
          icon: HelpCircle,
          keywords: 'faqs key info exam dates syllabus sample papers marking scheme dropdown edit'
        },
        {
          id: 'admin_settings',
          title: 'System Settings & Branding',
          description: 'Configure portal settings, maintenance and branding',
          category: 'Modules',
          tab: 'settings',
          icon: Settings,
          keywords: 'settings system maintenance configuration appearance logo'
        },
        ...commonItems
      ];
    }

    if (role === 'teacher') {
      return [
        {
          id: 'teacher_overview',
          title: 'Faculty Dashboard',
          description: 'Class performance metrics and question bank summary',
          category: 'Modules',
          tab: 'overview',
          icon: BarChart3,
          keywords: 'faculty teacher dashboard overview stats'
        },
        {
          id: 'teacher_questions',
          title: 'Question Bank',
          description: 'Draft, curate and submit questions for Olympiads',
          category: 'Modules',
          tab: 'question_bank',
          icon: FileQuestion,
          keywords: 'questions mcq add question question bank mcqs'
        },
        {
          id: 'teacher_exams',
          title: 'Exam Management',
          description: 'View scheduled Olympiads and question assignments',
          category: 'Modules',
          tab: 'exams',
          icon: BookOpen,
          keywords: 'exams tests schedules papers'
        },
        {
          id: 'teacher_students',
          title: 'Student Directory',
          description: 'View students enrolled in your subjects and classes',
          category: 'Modules',
          tab: 'students',
          icon: GraduationCap,
          keywords: 'students candidates pupils classes'
        },
        {
          id: 'teacher_results',
          title: 'Exam Results',
          description: 'Evaluate student performance and view score distributions',
          category: 'Modules',
          tab: 'results',
          icon: FileText,
          keywords: 'results scores marks evaluations'
        },
        ...commonItems
      ];
    }

    // Default: Student Role
    return [
      {
        id: 'student_overview',
        title: 'Student Dashboard',
        description: 'My active exams, upcoming schedules and growth stats',
        category: 'Modules',
        tab: 'overview',
        icon: BarChart3,
        keywords: 'student home dashboard metrics overview'
      },
      {
        id: 'student_available_exams',
        title: 'Available Live Olympiads',
        description: 'Browse active tests, view instructions and start examination',
        category: 'Olympiads',
        tab: 'available_exams',
        icon: BookOpen,
        keywords: 'take exam available tests live olympiad start test attempt exam question paper'
      },
      {
        id: 'student_exam_cs_live',
        title: 'Class 1 Computer Science Live Olympiad 2026',
        description: 'Live test paper with 10 questions for Class 1',
        category: 'Olympiads',
        tab: 'available_exams',
        icon: BookOpen,
        keywords: 'computer science live olympiad 2026 class 1 start test live test'
      },
      {
        id: 'student_exam_math',
        title: 'Mathematics Olympiad 2026',
        description: 'National Mathematics Talent Olympiad',
        category: 'Olympiads',
        tab: 'available_exams',
        icon: BookOpen,
        keywords: 'mathematics olympiad math test paper exam'
      },
      {
        id: 'student_history',
        title: 'Exam History & Solutions',
        description: 'Review previous attempts, detailed solutions and scorecards',
        category: 'Modules',
        tab: 'exam_history',
        icon: FileText,
        keywords: 'exam history past attempts scorecards view solutions answers result'
      },
      {
        id: 'student_performance',
        title: 'Performance & Growth Analytics',
        description: 'Subject-wise proficiency, accuracy rate and improvement chart',
        category: 'Modules',
        tab: 'performance',
        icon: BarChart3,
        keywords: 'performance analytics growth accuracy graph progress'
      },
      {
        id: 'student_leaderboard',
        title: 'National Olympiad Leaderboard',
        description: 'Check your rank, top scorers and overall leaderboard',
        category: 'Modules',
        tab: 'leaderboard',
        icon: Trophy,
        keywords: 'leaderboard ranks rank top scores standing winners'
      },
      {
        id: 'student_certificates',
        title: 'My Merit Certificates',
        description: 'Download signed examination certificates and achievement badges',
        category: 'Modules',
        tab: 'certificates',
        icon: Award,
        keywords: 'certificates merit awards download certificate pdf badge'
      },
      {
        id: 'student_profile',
        title: 'Profile & Account Settings',
        description: 'Upload profile photo, update details and change password',
        category: 'Account',
        tab: 'profile',
        icon: User,
        keywords: 'profile account picture upload image avatar change password details muskan'
      },
      ...commonItems
    ];
  }, [user?.role]);

  // Filter items according to search query
  const filteredResults = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];

    return searchableItems.filter((item) => {
      if (!item) return false;
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchKeywords = (item.keywords || '').toLowerCase().includes(q);
      const matchCategory = (item.category || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchKeywords || matchCategory;
    }).slice(0, 8); // Top 8 relevant results
  }, [query, searchableItems]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global Ctrl+K / '/' hotkey listener to focus search bar
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key || '').toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement !== inputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Execute selection
  const handleSelectItem = (item) => {
    if (!item) return;

    if (item.href) {
      window.location.hash = item.href;
    } else if (item.tab && onNavigateTab) {
      if (item.tab === 'notifications' && onOpenNotifications) {
        onOpenNotifications();
      } else {
        onNavigateTab(item.tab);
      }
    }

    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  // Keyboard navigation inside input (Arrow Up, Down, Enter, Escape)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        const itemToOpen = filteredResults[selectedIndex] || filteredResults[0];
        handleSelectItem(itemToOpen);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#faf6fa]/95 backdrop-blur-md border-b border-[#ebd7eb] h-20 flex items-center px-4 sm:px-6 lg:px-8 lg:pl-72 w-full">
      <div className="w-full flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Global Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar Container */}
          <div className="relative w-full max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  if (query.trim()) setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search anything... (e.g. math, exams, student, results)"
                className="w-full pl-10 pr-16 py-2 bg-white hover:bg-white focus:bg-white border border-[#ebd7eb] focus:border-[#80497D] focus:ring-4 focus:ring-[#80497D]/10 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
              />

              {/* Right indicators in input */}
              <div className="absolute right-2.5 flex items-center gap-1">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setIsOpen(false);
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded">
                    Ctrl K
                  </kbd>
                )}
              </div>
            </div>

            {/* Live Search Results Dropdown */}
            {isOpen && query.trim().length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header */}
                <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Search Results ({filteredResults.length})</span>
                  <span className="font-normal text-[9px]">Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↓</kbd> to navigate, <kbd className="font-mono bg-white px-1 py-0.5 rounded border">Enter</kbd> to open</span>
                </div>

                {/* Results List */}
                {filteredResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-slate-50">
                    {filteredResults.map((item, idx) => {
                      const Icon = item.icon || BookOpen;
                      const isSelected = idx === selectedIndex;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#f4eaf4] text-[#80497D] border border-[#ebd7eb] shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#80497D] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold truncate">
                                  {item.title}
                                </p>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                    isSelected
                                      ? 'bg-[#ebd7eb] text-[#80497D]'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center">
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#80497D] bg-white px-2 py-1 rounded-lg border border-[#ebd7eb] shadow-2xs">
                                <span>Open</span>
                                <CornerDownLeft className="w-3 h-3" />
                              </span>
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">No results found for "{query}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try searching for keywords like <span className="font-semibold text-[#80497D]">exams</span>, <span className="font-semibold text-[#C35B3F]">math</span>, <span className="font-semibold text-[#80497D]">student</span>, or <span className="font-semibold text-[#059669]">results</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick actions, notifications, user pill, logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#80497D] hover:text-[#422240] hover:bg-[#f4eaf4] transition-all cursor-pointer flex items-center justify-center"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 rounded-xl text-[#80497D] hover:text-[#422240] hover:bg-[#f4eaf4] transition-all cursor-pointer flex items-center justify-center group"
            title={`Shopping Cart (${totalItems} items)`}
          >
            <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
            {totalItems > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#f5b82e] text-slate-950 font-black text-[10px] flex items-center justify-center ring-2 ring-white animate-in zoom-in shadow-xs">
                {totalItems}
              </span>
            ) : (
              <span className="sr-only">Cart</span>
            )}
          </button>

          {/* Notification Bell (Available for Super Admin, Teacher, and Student) */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#80497D] hover:text-[#422240] hover:bg-[#f4eaf4] transition-all cursor-pointer"
            title="Open Notification Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C35B3F] ring-2 ring-white animate-pulse" />
          </button>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={async () => {
              await logout();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#80497D] hover:text-rose-600 hover:bg-rose-50 border border-[#ebd7eb] hover:border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Sign Out / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

