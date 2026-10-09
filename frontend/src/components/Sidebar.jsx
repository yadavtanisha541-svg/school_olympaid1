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
  Video,
  ShieldCheck,
  Languages,
  Lock
} from 'lucide-react';
import { isSubjectPurchased, getPurchasedTests, getTestPricing } from '../utils/purchaseUtils';

export const Sidebar = ({ currentTab, onSelectTab, isOpen, onClose, onGoToPublic }) => {
  const { user, logout, hasPermission } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [purchasedTests, setPurchasedTests] = useState(() => getPurchasedTests());
  const [testPricing, setTestPricing] = useState(() => getTestPricing());
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleSyncPurchases = () => setPurchasedTests(getPurchasedTests());
    const handleSyncPricing = (e) => {
      if (e?.detail) {
        setTestPricing(e.detail);
      } else {
        setTestPricing(getTestPricing());
      }
    };
    window.addEventListener('olympiadhub-package-purchased', handleSyncPurchases);
    window.addEventListener('olympiadhub-pricing-updated', handleSyncPricing);
    window.addEventListener('storage', handleSyncPurchases);
    window.addEventListener('storage', handleSyncPricing);
    return () => {
      window.removeEventListener('olympiadhub-package-purchased', handleSyncPurchases);
      window.removeEventListener('olympiadhub-pricing-updated', handleSyncPricing);
      window.removeEventListener('storage', handleSyncPurchases);
      window.removeEventListener('storage', handleSyncPricing);
    };
  }, []);

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
    info: false
  });

  const toggleStudentAccordion = (sectionKey) => {
    setStudentAccordions(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Listen for live role permissions update to refresh sidebar in real-time
  const [, setPermTick] = useState(0);
  useEffect(() => {
    const handlePermUpdate = () => setPermTick(t => t + 1);
    window.addEventListener('role-permissions-updated', handlePermUpdate);
    window.addEventListener('storage', handlePermUpdate);
    return () => {
      window.removeEventListener('role-permissions-updated', handlePermUpdate);
      window.removeEventListener('storage', handlePermUpdate);
    };
  }, []);

  const superAdminNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, perm: 'access_superadmin_dashboard' },
    { id: 'payment_bank_manager', label: 'Payment, QR & Orders', icon: CreditCard, perm: 'manage_payments_qr' },
    { id: 'skill_programs_manager', label: 'Skill Programs Studio', icon: Rocket, perm: 'manage_skill_programs' },
    { id: 'superadmin_packages', label: 'Subject Model Tests & Packages', icon: BookOpen, perm: 'manage_superadmin_packages' },
    { id: 'applicant_leads', label: 'New Applicant Leads', icon: UserCheck, perm: 'manage_applicant_leads' },
    { id: 'coordinators', label: 'Coordinator Applicants', icon: UserCheck, perm: 'manage_coordinators' },
    { id: 'students', label: 'Student Management', icon: Users, perm: 'manage_students' },
    { id: 'roles_permissions', label: 'Roles & Permissions', icon: ShieldCheck, perm: 'manage_roles_permissions' },
    { id: 'academic', label: 'Disciplines & Subjects', icon: Layers, perm: 'manage_academic_structure' },
    { id: 'subject_content', label: 'Subject & Class Content', icon: BookOpen, perm: 'manage_subject_content' },
    { id: 'revision_vault', label: 'Revision Vault & Bookmarks', icon: Bookmark, perm: 'manage_revision_vault' },
    { id: 'practice_tests_manager', label: 'Practice Tests & Papers', icon: Sparkles, perm: 'manage_test_generator' },
    { id: 'faqs_key_info', label: 'FAQs & Key Info Manager', icon: HelpCircle, perm: 'manage_faqs_keyinfo' },
    { id: 'results', label: 'Exam Results & Reports', icon: FileCheck2, perm: 'publish_exam_results' },
    { id: 'leaderboard', label: 'Rankings & Leaderboard', icon: Trophy, perm: 'manage_leaderboard' },
    { id: 'activity_logs', label: 'Audit Activity Logs', icon: Activity, perm: 'audit_activity_logs' },
    { id: 'settings', label: 'System Settings', icon: Settings, perm: 'manage_system_settings' }
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
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2e1065] border-r border-[#312e81]/60 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 text-slate-100 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#312e81]/60 shrink-0 bg-[#0f172a]/95">
          <OlympiadHubLogo size="sm" showTagline={false} light={true} />
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-3.5 px-3.5 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Public Portal Switcher */}
          {onGoToPublic && (
            <button
              type="button"
              onClick={() => {
                onGoToPublic();
                if (onClose) onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 mb-2 cursor-pointer shadow-xs transition-all"
            >
              <Globe className="w-4.5 h-4.5 text-slate-300 shrink-0" />
              <span>🌐 View Public Website</span>
            </button>
          )}

          {/* Top Dashboard Button */}
          {(!user || user?.role !== 'superadmin' || hasPermission('access_superadmin_dashboard')) && (
            <button
              type="button"
              onClick={() => {
                onSelectTab('overview');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition-all duration-150 cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:bg-[#1a264e] hover:text-white font-semibold'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 shrink-0 ${currentTab === 'overview' ? 'text-white' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>
          )}

          {/* ========================================================================= */}
          {/* 1. SUPERADMIN NAV                                                         */}
          {/* ========================================================================= */}
          {user?.role === 'superadmin' && (
            <div className="space-y-1 pt-2.5">
              <div className="px-3 pb-1">
                <p className="text-xs font-black uppercase tracking-wider text-red-500">
                  ADMINISTRATION
                </p>
              </div>

              {superAdminNav
                .filter(i => i.id !== 'overview')
                .filter(item => !item.perm || hasPermission(item.perm))
                .map((item) => {
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
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                          : 'text-slate-300 font-semibold hover:bg-[#1a264e] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
                <p className="text-xs font-black uppercase tracking-wider text-red-500">
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
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                        : 'text-slate-300 font-semibold hover:bg-[#1a264e] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. STUDENT PORTAL (CLEAN MODERN ACCORDION STYLING)                        */}
          {/* ========================================================================= */}
          {(!user || user?.role === 'student') && (
            <div className="space-y-3.5 pt-2">
              {/* SECTION A: OLYMPIADS */}
              <div className="space-y-1.5">
                <p className="px-3 text-xs font-black uppercase tracking-wider text-red-500">
                  OLYMPIADS
                </p>

                {/* Mock Test Accordion Header */}
                <div>
                  <div className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-bold transition-colors ${
                    currentTab === 'my_content' || currentTab.startsWith('content_')
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-200 hover:bg-[#1a264e] hover:text-white'
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
                      <BookOpen className="w-5 h-5 text-slate-300 shrink-0" />
                      <span>Mock Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStudentAccordion('content');
                      }}
                      className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                      {studentAccordions.content ? (
                        <ChevronUp className="w-4.5 h-4.5" />
                      ) : (
                        <ChevronDown className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>

                  {/* Clean Sub-items for all 6 core Olympiad subjects */}
                  {studentAccordions.content && (
                    <div className="pl-3.5 pr-1 py-1 space-y-1">
                      {[
                        { id: 'content_imo', key: 'imo', label: 'IEOM (Mathematics)', icon: Calculator },
                        { id: 'content_iso', key: 'iso', label: 'IEOS (Science)', icon: Rocket },
                        { id: 'content_ieo', key: 'ieo', label: 'IEOE (English)', icon: BookOpen },
                        { id: 'content_igko', key: 'igko', label: 'IEOG (General Knowledge)', icon: Globe },
                        { id: 'content_idlo', key: 'idlo', label: 'IEOD (Digital Literacy)', icon: Laptop },
                        { id: 'content_iho', key: 'iho', label: 'IEOH (Hindi)', icon: Languages }
                      ].map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = currentTab === sub.id;
                        const isUnlocked = isSubjectPurchased(sub.key, user?.class || user?.grade || 'Class 6', purchasedTests);

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              onSelectTab(sub.id);
                              if (onClose) onClose();
                            }}
                            className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                              isSubActive
                                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                                : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                              <span className="truncate">{sub.label}</span>
                            </div>

                            {isUnlocked && (
                              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Practice Tests */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('practice_tests');
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition-all cursor-pointer ${
                    currentTab === 'practice_tests' || currentTab === 'test_generator'
                      ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                      : 'text-slate-200 font-semibold hover:bg-[#1a264e] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Practice Tests</span>
                </button>
              </div>

              {/* SECTION B: MY PERFORMANCE */}
              <div className="space-y-1.5 pt-2 border-t border-[#312e81]/60">
                {/* My Performance Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('performance')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-bold text-slate-200 hover:bg-[#1a264e] hover:text-white cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>My Performance</span>
                    </div>
                    {studentAccordions.performance ? (
                      <ChevronUp className="w-4.5 h-4.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
                    )}
                  </button>

                  {/* Clean Sub-items */}
                  {studentAccordions.performance && (
                    <div className="pl-3.5 pr-1 py-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('performance');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                          currentTab === 'performance'
                            ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                            : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">Statistics &amp; Reports</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('analysis');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                          currentTab === 'analysis' || currentTab === 'exam_solutions'
                            ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                            : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">Analysis</span>
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition-all cursor-pointer ${
                    currentTab === 'my_revision'
                      ? 'bg-slate-800 text-white font-bold shadow-sm border border-slate-700'
                      : 'text-slate-200 font-semibold hover:bg-[#1a264e] hover:text-white'
                  }`}
                >
                  <Bookmark className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>My Revision</span>
                </button>
              </div>

              {/* SECTION C: MY ACCOUNT */}
              <div className="space-y-1.5 pt-2 border-t border-[#312e81]/60">
                <p className="px-3 text-xs font-black uppercase tracking-wider text-red-500">
                  MY ACCOUNT
                </p>

                {/* Account Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('account')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-bold text-slate-200 hover:bg-[#1a264e] hover:text-white cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>My Account</span>
                    </div>
                    {studentAccordions.account ? (
                      <ChevronUp className="w-4.5 h-4.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
                    )}
                  </button>

                  {/* Clean Sub-items */}
                  {studentAccordions.account && (
                    <div className="pl-3.5 pr-1 py-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('profile');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                          currentTab === 'profile'
                            ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                            : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                        }`}
                      >
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">My Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('my_orders');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                          currentTab === 'my_orders'
                            ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                            : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">My Orders</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('my_wallet');
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                          currentTab === 'my_wallet'
                            ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                            : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                        }`}
                      >
                        <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">My Wallet</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION D: OTHERS & INFORMATION */}
              <div className="space-y-1.5 pt-2 border-t border-[#312e81]/60">
                <p className="px-3 text-xs font-black uppercase tracking-wider text-red-500">
                  INFO &amp; EXTRAS
                </p>

                {/* Info Accordion Header */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleStudentAccordion('info')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-bold text-slate-200 hover:bg-[#1a264e] hover:text-white cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Info className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>Info</span>
                    </div>
                    {studentAccordions.info ? (
                      <ChevronUp className="w-4.5 h-4.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
                    )}
                  </button>

                  {/* Info Sub-items */}
                  {studentAccordions.info && (
                    <div className="pl-3.5 pr-1 py-1 space-y-1">
                      {[
                        { id: 'info_datesheet', label: 'Date Sheet', icon: Calendar },
                        { id: 'info_awards', label: 'Awards', icon: Trophy }
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
                            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-left transition-all cursor-pointer whitespace-nowrap ${
                              isSubActive
                                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-2xs'
                                : 'text-slate-300 hover:bg-[#19244a] hover:text-white font-medium'
                            }`}
                          >
                            <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>




              </div>
            </div>
          )}
        </div>

        {/* Bottom User Profile Card & Interactive Menu */}
        <div className="p-3 border-t border-[#263560] bg-[#0c1326] shrink-0 relative" ref={userMenuRef}>
          {/* Popover Options Menu */}
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#131d3d] rounded-2xl border border-[#2a3a68] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
              <div className="px-3 py-2 border-b border-[#263560]">
                <p className="text-[15px] font-black text-white truncate">
                  {user?.full_name || user?.name || user?.login_id || 'Candidate'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.login_id || user?.email || ''}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#1e1c45] text-purple-200 border border-purple-700/50 capitalize">
                    {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'teacher' ? 'Faculty' : 'Candidate'}
                  </span>
                  {(user?.class_name || user?.class || user?.grade) && (
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#182650] text-blue-200 border border-blue-700/50">
                      {user?.class_name || user?.class || user?.grade}
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
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-bold transition-all cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-200 hover:bg-[#1a264e] hover:text-white'
                }`}
              >
                <User className="w-4.5 h-4.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              {/* Logout Option */}
              <button
                type="button"
                onClick={async () => {
                  setIsUserMenuOpen(false);
                  await logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] font-bold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-all cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-400" />
                <span>Logout / Sign Out</span>
              </button>
            </div>
          )}

          {/* User Profile Card Button */}
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className={`w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#131d3d] border transition-all cursor-pointer text-left ${
              isUserMenuOpen
                ? 'border-slate-500 ring-2 ring-slate-500/30 shadow-md bg-[#18254c]'
                : 'border-[#263560] hover:border-slate-500/60 shadow-md hover:bg-[#18254c]'
            }`}
            title="Click to open Profile & Logout menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-black text-sm flex items-center justify-center border border-slate-700 shrink-0 shadow-xs">
                {(user?.full_name || user?.name || user?.login_id || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate">
                  {user?.full_name || user?.name || user?.login_id || 'Candidate'}
                </p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#1e1c45] text-slate-300 border border-slate-700 capitalize">
                  {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'teacher' ? 'Faculty' : 'Candidate'}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0">
              {isUserMenuOpen ? (
                <ChevronDown className="w-4.5 h-4.5 text-white" />
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
