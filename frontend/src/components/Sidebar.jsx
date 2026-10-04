import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OlympiadHubLogo } from './OlympiadHubLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  ShoppingBag,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  FileCheck2,
  Trophy,
  Award,
  Activity,
  Settings,
  BookOpen,
  Clock,
  UserCheck,
  LogOut,
  Globe,
  ChevronDown,
  ChevronUp,
  Laptop,
  Rocket,
  Calculator,
  Brain,
  BarChart3,
  TrendingUp,
  Bookmark,
  User,
  CreditCard,
  Wallet,
  FileText,
  Gamepad2,
  Send,
  Calendar,
  Info,
  Atom,
  Sparkles,
  Palette,
  Video
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab, isOpen, onClose, onGoToPublic }) => {
  const { user, logout, hasPermission } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Student Accordion state
  const [studentAccordions, setStudentAccordions] = useState({
    content: true,
    programs: true,
    performance: false,
    account: false,
    info: false,
    freeZone: false
  });

  const toggleStudentAccordion = (sectionKey) => {
    setStudentAccordions(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const superAdminNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'payment_bank_manager', label: 'Payment, QR & Orders', icon: CreditCard },
    { id: 'online_classes_manager', label: 'Online Classes Studio', icon: Video },
    { id: 'skill_programs_manager', label: 'Skill Programs Studio', icon: Rocket },
    { id: 'superadmin_packages', label: 'Subject Model Tests & Packages', icon: BookOpen },
    { id: 'schools', label: 'School Registrations', icon: Building2 },
    { id: 'coordinators', label: 'Coordinator Applicants', icon: UserCheck },
    { id: 'workbook_orders', label: 'Workbook Orders', icon: ShoppingBag },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'academic', label: 'Disciplines & Subjects', icon: Layers },
    { id: 'subject_content', label: 'Subject & Class Content', icon: BookOpen },
    { id: 'revision_vault', label: 'Revision Vault & Bookmarks', icon: Bookmark },
    { id: 'free_quizzes_manager', label: 'FREE Quizzes Manager', icon: HelpCircle },
    { id: 'faqs_key_info', label: 'FAQs & Key Info Manager', icon: HelpCircle },
    { id: 'test_generator_manager', label: 'Sample & Past Papers', icon: Sparkles },
    { id: 'results', label: 'Exam Results & Reports', icon: FileCheck2 },
    { id: 'leaderboard', label: 'Rankings & Leaderboard', icon: Trophy },
    { id: 'certificates', label: 'Certificates Manager', icon: Award },
    { id: 'activity_logs', label: 'Audit Activity Logs', icon: Activity },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const teacherNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'question_bank', label: 'Question Bank', icon: HelpCircle, perm: 'manage_questions' },
    { id: 'exams', label: 'Exam Management', icon: FileSpreadsheet, perm: 'manage_exams' },
    { id: 'students', label: 'Student Management', icon: Users, perm: 'view_students' },
    { id: 'results', label: 'Exam Results & Reports', icon: FileCheck2, perm: 'view_results' },
    { id: 'leaderboard', label: 'Rankings & Leaderboard', icon: Trophy, perm: 'view_leaderboards' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#321630]/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-md border-r border-[#ebd7eb] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#ebd7eb] shrink-0 bg-[#fff9f2]">
          <OlympiadHubLogo size="sm" showTagline={false} />
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-3 px-3.5 space-y-1.5 overflow-y-auto custom-scrollbar">
          {/* Public Portal Switcher */}
          {onGoToPublic && (
            <button
              type="button"
              onClick={() => {
                onGoToPublic();
                if (onClose) onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#C35B3F] bg-[#faf4e0] hover:bg-[#faebd7] border border-[#e7b84b]/40 mb-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Globe className="w-4.5 h-4.5 text-[#C35B3F] shrink-0" />
              <span>🌐 View Public Website</span>
            </button>
          )}

          {/* Top Dashboard Button */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('overview');
              if (onClose) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
              currentTab === 'overview'
                ? 'bg-[#f4eaf4] text-[#80497D] font-bold shadow-2xs'
                : 'text-slate-700 hover:bg-[#faf6fa] hover:text-[#80497D] font-semibold'
            }`}
          >
            <LayoutDashboard className={`w-4.5 h-4.5 shrink-0 ${currentTab === 'overview' ? 'text-[#80497D]' : 'text-slate-400'}`} />
            <span>Dashboard</span>
          </button>

          {/* ========================================================================= */}
          {/* 1. SUPERADMIN NAV                                                         */}
          {/* ========================================================================= */}
          {user?.role === 'superadmin' && (
            <div className="space-y-1 pt-2.5">
              <div className="px-3 pb-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#80497D]">
                  ADMINISTRATION
                </p>
              </div>

              {superAdminNav.filter(i => i.id !== 'overview').map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] sm:text-sm transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#f4eaf4] text-[#80497D] font-bold shadow-2xs'
                        : 'text-slate-700 font-semibold hover:bg-[#faf6fa] hover:text-[#80497D]'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#80497D]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TEACHER NAV                                                            */}
          {/* ========================================================================= */}
          {user?.role === 'teacher' && (
            <div className="space-y-1 pt-2.5">
              <div className="px-3 pb-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#80497D]">
                  FACULTY PORTAL
                </p>
              </div>

              {teacherNav.filter(item => !item.perm || hasPermission(item.perm)).filter(i => i.id !== 'overview').map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] sm:text-sm transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#f4eaf4] text-[#80497D] font-bold shadow-2xs'
                        : 'text-slate-700 font-semibold hover:bg-[#faf6fa] hover:text-[#80497D]'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#80497D]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. STUDENT PORTAL (CLEAN FLAT ACCORDION WITH NO OUTER BOX BORDERS)        */}
          {/* ========================================================================= */}
          {(!user || user?.role === 'student') && (
            <div className="space-y-3 pt-2">
              {/* SECTION A: OLYMPIADS */}
              <div className="space-y-1">
                <p className="px-3 text-[11px] font-black uppercase tracking-wider text-[#80497D]">
                  OLYMPIADS
                </p>

                {/* My Content Accordion Header */}
                <div>
                  <div className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    currentTab === 'my_content' || currentTab === 'overview'
                      ? 'bg-[#f4eaf4] text-[#80497D]'
                      : 'text-slate-800 hover:bg-[#faf6fa] hover:text-[#80497D]'
                  }`}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('my_content');
                        if (!studentAccordions.content) {
                          toggleStudentAccordion('content');
                        }
                        if (onClose) onClose();
                      }}
                      className="flex-1 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <BookOpen className="w-4.5 h-4.5 text-[#80497D] shrink-0" />
                      <span>My Content</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStudentAccordion('content');
                      }}
                      className="p-1 hover:bg-[#ebd7eb]/50 rounded-lg text-slate-400 hover:text-[#80497D] cursor-pointer transition-colors"
                    >
                      {studentAccordions.content ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Clean Sub-items for all 9 Olympiad subjects */}
                  {studentAccordions.content && (
                    <div className="pl-7 pr-2 py-0.5 space-y-0.5">
                      {[
                        { id: 'content_igko', label: 'IGKO (GK)', icon: Globe },
                        { id: 'content_iso', label: 'ISO / NSO (Science)', icon: Rocket },
                        { id: 'content_imo', label: 'IMO (Maths)', icon: Calculator },
                        { id: 'content_ieo', label: 'IEO (English)', icon: BookOpen },
                        { id: 'content_icso', label: 'ICSO (Cyber)', icon: Laptop },
                        { id: 'content_isso', label: 'ISSO (Reasoning)', icon: Brain },
                        { id: 'content_vc', label: 'VC (Vocabulary)', icon: Sparkles },
                        { id: 'content_ego', label: 'EGO (Environment)', icon: Atom },
                        { id: 'content_cao', label: 'CAO (Creative Arts)', icon: Palette }
                      ].map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              onSelectTab(sub.id);
                              if (onClose) onClose();
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                                : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                            }`}
                          >
                            <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-[#80497D]' : 'text-slate-400'}`} />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* My Classes */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('my_classes');
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                    currentTab === 'my_classes'
                      ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                      : 'text-slate-700 font-semibold hover:bg-[#faf6fa] hover:text-[#80497D]'
                  }`}
                >
                  <Users className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>My Classes</span>
                </button>
              </div>

              {/* SECTION B: MY PERFORMANCE */}
              <div className="space-y-1 pt-1 border-t border-[#ebd7eb]/40">
                {/* My Performance Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('performance')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#faf6fa] hover:text-[#80497D] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4.5 h-4.5 text-[#C35B3F] shrink-0" />
                      <span>My Performance</span>
                    </div>
                    {studentAccordions.performance ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Clean Sub-items */}
                  {studentAccordions.performance && (
                    <div className="pl-7 pr-2 py-0.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('performance');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                          currentTab === 'performance'
                            ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                            : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Statistics &amp; Reports</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('performance');
                          if (onClose) onClose();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium cursor-pointer"
                      >
                        <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Analysis</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* My Revision */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('my_revision');
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                    currentTab === 'my_revision'
                      ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                      : 'text-slate-700 font-semibold hover:bg-[#faf6fa] hover:text-[#80497D]'
                  }`}
                >
                  <Bookmark className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>My Revision</span>
                </button>
              </div>

              {/* SECTION C: MY ACCOUNT */}
              <div className="space-y-1 pt-2 border-t border-[#ebd7eb]/40">
                <p className="px-3 text-[11px] font-black uppercase tracking-wider text-[#80497D]">
                  MY ACCOUNT
                </p>

                {/* Account Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('account')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#faf6fa] hover:text-[#80497D] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4.5 h-4.5 text-[#e7b84b] shrink-0" />
                      <span>My Account</span>
                    </div>
                    {studentAccordions.account ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Clean Sub-items */}
                  {studentAccordions.account && (
                    <div className="pl-7 pr-2 py-0.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('profile');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                          currentTab === 'profile'
                            ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                            : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                        }`}
                      >
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>My Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('my_orders');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                          currentTab === 'my_orders'
                            ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                            : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>My Orders</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('my_wallet');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                          currentTab === 'my_wallet'
                            ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                            : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                        }`}
                      >
                        <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>My Wallet</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION D: OTHERS & INFORMATION */}
              <div className="space-y-1 pt-2 border-t border-[#ebd7eb]/40">
                <p className="px-3 text-[11px] font-black uppercase tracking-wider text-[#80497D]">
                  INFO &amp; EXTRAS
                </p>

                {/* Info Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('info')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#faf6fa] hover:text-[#80497D] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-4.5 h-4.5 text-[#80497D] shrink-0" />
                      <span>Info</span>
                    </div>
                    {studentAccordions.info ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Info Sub-items */}
                  {studentAccordions.info && (
                    <div className="pl-7 pr-2 py-0.5 space-y-0.5">
                      {[
                        { id: 'info_datesheet', label: 'Date Sheet', icon: Calendar },
                        { id: 'info_awards', label: 'Awards', icon: Trophy },
                        { id: 'info_icso', label: 'ICSO', icon: Laptop },
                        { id: 'info_nso', label: 'NSO', icon: Rocket },
                        { id: 'info_imo', label: 'IMO', icon: Calculator },
                        { id: 'info_ieo', label: 'IEO', icon: BookOpen }
                      ].map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              onSelectTab(sub.id);
                              if (onClose) onClose();
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                                : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                            }`}
                          >
                            <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-[#80497D]' : 'text-slate-400'}`} />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Free Zone Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('freeZone')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#faf6fa] hover:text-[#80497D] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Send className="w-4.5 h-4.5 text-[#C35B3F] shrink-0" />
                      <span>Free Zone</span>
                    </div>
                    {studentAccordions.freeZone ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Clean Sub-items */}
                  {studentAccordions.freeZone && (
                    <div className="pl-7 pr-2 py-0.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('free_sample_papers');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                          currentTab === 'free_sample_papers'
                            ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                            : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Sample Papers &amp; OMR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('free_past_papers');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                          currentTab === 'free_past_papers'
                            ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                            : 'text-slate-600 hover:bg-[#faf6fa] hover:text-[#80497D] font-medium'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Previous Year Papers</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* FREE Quizzes */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('free_quizzes');
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                    currentTab === 'free_quizzes'
                      ? 'bg-[#f4eaf4] text-[#80497D] font-bold'
                      : 'text-slate-700 font-semibold hover:bg-[#faf6fa] hover:text-[#80497D]'
                  }`}
                >
                  <HelpCircle className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span>FREE Quizzes</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom User Profile Card & Interactive Menu */}
        <div className="p-3 border-t border-[#ebd7eb] bg-[#fff9f2] shrink-0 relative" ref={userMenuRef}>
          {/* Popover Options Menu */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl border border-[#ebd7eb] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#f4eaf4]">
                <p className="text-sm font-black text-[#4e2a4a] truncate">
                  {user?.name || user?.email || 'Candidate'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || ''}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#faf4e0] text-[#80497D] capitalize">
                    {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'teacher' ? 'Faculty' : 'Candidate'}
                  </span>
                  {user?.class && (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4eaf4] text-[#80497D]">
                      {user.class}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Option */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab('profile');
                  setIsUserMenuOpen(false);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-[#f4eaf4] text-[#80497D]'
                    : 'text-slate-700 hover:bg-[#faf6fa] hover:text-[#80497D]'
                }`}
              >
                <User className="w-4.5 h-4.5 text-[#80497D]" />
                <span>My Profile</span>
              </button>

              {/* Logout Option */}
              <button
                type="button"
                onClick={async () => {
                  setIsUserMenuOpen(false);
                  await logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5 text-red-500" />
                <span>Logout / Sign Out</span>
              </button>
            </div>
          )}

          {/* User Profile Card Button */}
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-white border transition-all cursor-pointer text-left ${
              isUserMenuOpen
                ? 'border-[#80497D] ring-2 ring-[#80497D]/20 shadow-sm'
                : 'border-[#ebd7eb] hover:border-[#80497D]/40 shadow-2xs hover:bg-[#faf6fa]'
            }`}
            title="Click to open Profile & Logout menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#f4eaf4] text-[#80497D] font-black text-sm flex items-center justify-center border border-[#ebd7eb] shrink-0">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#4e2a4a] truncate">
                  {user?.name || user?.email || 'Candidate'}
                </p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#faf4e0] text-[#80497D] capitalize">
                  {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'teacher' ? 'Faculty' : 'Candidate'}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-lg text-slate-400 hover:text-[#80497D] transition-colors shrink-0">
              {isUserMenuOpen ? (
                <ChevronDown className="w-4.5 h-4.5 text-[#80497D]" />
              ) : (
                <ChevronUp className="w-4.5 h-4.5 text-slate-400" />
              )}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
