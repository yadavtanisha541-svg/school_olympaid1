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
  Moon,
  RefreshCw
} from 'lucide-react';
import { syncManager } from '../utils/syncManager';

export const Navbar = ({ onToggleSidebar, onNavigateTab, onOpenNotifications }) => {
  const { user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [pasteJsonInput, setPasteJsonInput] = useState('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  useEffect(() => {
    const unsub = syncManager.subscribe((state) => {
      if (state.status === 'synced') {
        setSyncToast(`✓ Synced ${state.count || 0} items from Vercel!`);
        setSyncSuccessMsg(`✓ Synced ${state.count || 0} items from Vercel!`);
        setTimeout(() => setSyncToast(''), 4000);
      }
    });
    return unsub;
  }, []);

  const handleSyncClick = () => {
    setShowSyncModal(true);
  };

  const handleQuickPullFromVercel = () => {
    setIsSyncing(true);
    syncManager.pullFromVercelPopup();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const handleApplyPastedData = () => {
    if (!pasteJsonInput.trim()) return;
    const res = syncManager.importAllData(pasteJsonInput);
    if (res.success) {
      setSyncSuccessMsg(`✓ Successfully applied ${res.count} items!`);
      setTimeout(() => {
        setSyncSuccessMsg('');
        setShowSyncModal(false);
        setPasteJsonInput('');
      }, 1500);
    } else {
      alert('Invalid JSON data: ' + res.error);
    }
  };

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
        title: 'Class 1 Digital Literacy Live Olympiad 2026',
        description: 'Live test paper with 10 questions for Class 1',
        category: 'Olympiads',
        tab: 'available_exams',
        icon: BookOpen,
        keywords: 'digital literacy live olympiad 2026 class 1 start test live test'
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
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b h-16 sm:h-20 flex items-center lg:pl-72 w-full transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-[#0f172a]/95 border-slate-800 text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-4 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Left: Mobile Toggle & Global Search Bar */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 shrink-0 lg:hidden cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar Container (Enlarged & Clean) */}
          <div className="relative w-full max-w-lg min-w-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                placeholder="Search anything..."
                className={`w-full pl-8 sm:pl-11 pr-7 sm:pr-20 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none transition-all shadow-xs border ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400 focus:ring-4 focus:ring-slate-100'
                }`}
              />

              {/* Right indicators in input */}
              <div className="absolute right-2 sm:right-3 flex items-center gap-1">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setIsOpen(false);
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-lg shadow-2xs">
                    Ctrl K
                  </kbd>
                )}
              </div>
            </div>

            {/* Live Search Results Dropdown */}
            {isOpen && query.trim().length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header */}
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                              ? 'bg-slate-100 text-slate-900 border border-slate-200 shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                    ? 'bg-slate-900 text-white shadow-xs'
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
                                      ? 'bg-slate-200 text-slate-800'
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
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
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
                      Try searching for keywords like <span className="font-semibold text-slate-700">exams</span>, <span className="font-semibold text-slate-700">math</span>, <span className="font-semibold text-slate-700">student</span>, or <span className="font-semibold text-slate-700">results</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick actions, Light/Dark toggle, notifications, cart, logout */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">

          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 min-[360px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-center shadow-2xs group active:scale-95 shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300 hover:text-amber-200 shadow-md shadow-indigo-950/40'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-45 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-rotate-12 text-slate-700" />
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className={`relative p-1.5 min-[360px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-center shadow-2xs group active:scale-95 shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title={`Shopping Cart (${totalItems} items)`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            {totalItems > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center ring-2 ring-white animate-in zoom-in shadow-xs">
                {totalItems}
              </span>
            ) : (
              <span className="sr-only">Cart</span>
            )}
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className={`relative p-1.5 min-[360px]:p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-2xs group active:scale-95 flex items-center justify-center shrink-0 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Open Notification Center"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={async () => {
              await logout();
            }}
            className={`inline-flex items-center gap-1.5 p-1.5 min-[360px]:p-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 ${
              theme === 'dark'
                ? 'text-slate-200 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-rose-500/40'
                : 'text-slate-700 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200'
            }`}
            title="Sign Out / Logout"
          >
            <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Vercel ⇄ Localhost Sync Center Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Vercel ⇄ Localhost Sync Center</h3>
                  <p className="text-xs text-slate-400">Transfer all papers, questions, prices and student data</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {syncSuccessMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs font-bold text-emerald-300 text-center animate-in zoom-in">
                {syncSuccessMsg}
              </div>
            )}

            {/* Real-Time Central Cloud DB Auto-Sync Status */}
            <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm font-black text-emerald-200">
                    🟢 Real-Time Cloud Auto-Sync Active
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                  Zero-Click Live
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aap jo bhi <strong>Vercel</strong> ya <strong>Localhost</strong> par create ya change karenge, wo automatically Cloud Database ke zariye bina kisi click ke real-time me dono jagah sync rehta hai!
              </p>
              <button
                type="button"
                onClick={async () => {
                  setIsSyncing(true);
                  await syncManager.pullFromCloud();
                  await syncManager.pushToCloud();
                  setIsSyncing(false);
                  setSyncSuccessMsg('✓ Live Cloud database synchronized successfully!');
                  setTimeout(() => setSyncSuccessMsg(''), 3000);
                }}
                disabled={isSyncing}
                className="w-full mt-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing Live Cloud...' : '⚡ Force Immediate Cloud Sync Now'}</span>
              </button>
            </div>

            {/* Method 1: Instant 1-Click Popup Pull */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>⚡ 1-Click Pull from Vercel</span>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">Fastest</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Opens a 1-second transfer window to grab everything you changed on Vercel.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickPullFromVercel}
                disabled={isSyncing}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Pulling from Vercel...' : 'Pull All Vercel Changes Now'}</span>
              </button>
            </div>

            {/* Method 2: Paste Clipboard / JSON */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-2.5">
              <h4 className="text-sm font-bold text-white">📋 Paste Data JSON Directly</h4>
              <p className="text-xs text-slate-400">
                Agar aapne Vercel se "Copy Data" kiya hai, toh niche paste karke apply karein:
              </p>
              <textarea
                rows={3}
                value={pasteJsonInput}
                onChange={(e) => setPasteJsonInput(e.target.value)}
                placeholder='{"olympiadhub_db_...": "..."}'
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setPasteJsonInput(text);
                    } catch (e) {
                      alert('Please paste directly using Ctrl+V');
                    }
                  }}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-all"
                >
                  📋 Paste from Clipboard
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedData}
                  disabled={!pasteJsonInput.trim()}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
                >
                  ✓ Apply &amp; Sync Localhost
                </button>
              </div>
            </div>

            {/* Method 3: Push Localhost to Vercel & Backup */}
            <div className="flex gap-2 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  syncManager.syncAll();
                  alert('✓ Sync triggered to Vercel bridge!');
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
              >
                📤 Push Localhost to Vercel
              </button>
              <button
                type="button"
                onClick={() => {
                  const dataStr = syncManager.exportAllData();
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `localhost-data-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
              >
                💾 Download Backup JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

