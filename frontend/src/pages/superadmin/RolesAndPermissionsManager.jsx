import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Shield,
  Key,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Save,
  RotateCcw,
  Plus,
  Lock,
  Unlock,
  Eye,
  FileText,
  Calculator,
  BookOpen,
  Video,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  Award,
  Trophy,
  Activity,
  Sliders,
  Check,
  X,
  HelpCircle,
  UserCheck,
  Layers,
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  Bookmark,
  FileCheck2,
  Rocket,
  Globe,
  Brain,
  Laptop
} from 'lucide-react';
import { apiClient } from '../../api/client';

// Master list of all system permissions strictly aligned with Super Admin and Student Sidebar Modules
const DEFAULT_PERMISSIONS_CATALOG = [
  // =========================================================================
  // 1. SUPER ADMIN SIDEBAR MODULES
  // =========================================================================
  {
    key: 'manage_payments_qr',
    module: 'Super Admin: Payment, QR & Orders',
    name: 'Payment, QR & Orders Studio',
    description: 'Manage UPI QR setup, payment gateway, transaction logs, and approve payment slips.',
    studentDefault: false,
    level: 'Critical',
    icon: CreditCard
  },
  {
    key: 'manage_online_classes',
    module: 'Super Admin: Online Classes Studio',
    name: 'Online Classes Studio',
    description: 'Schedule live class batches, manage instructors, stream links and video archives.',
    studentDefault: false,
    level: 'Advanced',
    icon: Video
  },
  {
    key: 'manage_skill_programs',
    module: 'Super Admin: Skill Programs Studio',
    name: 'Skill Programs Studio',
    description: 'Configure Reasoning, GK, Maths, English & Science skill pathways and milestones.',
    studentDefault: false,
    level: 'Advanced',
    icon: Rocket
  },
  {
    key: 'manage_superadmin_packages',
    module: 'Super Admin: Subject Model Tests & Packages',
    name: 'Subject Model Tests & Packages',
    description: 'Create and curate mock test bundles, subject pricing, and package options.',
    studentDefault: false,
    level: 'Advanced',
    icon: BookOpen
  },
  {
    key: 'manage_applicant_leads',
    module: 'Super Admin: Applicant Leads',
    name: 'New Applicant Leads',
    description: 'Review and manage prospective candidate registrations and application submissions.',
    studentDefault: false,
    level: 'Critical',
    icon: UserCheck
  },
  {
    key: 'manage_coordinators',
    module: 'Super Admin: Coordinator Management',
    name: 'Coordinator Applicants',
    description: 'Approve, assign, and verify school coordinator profiles and credentials.',
    studentDefault: false,
    level: 'Critical',
    icon: UserCheck
  },
  {
    key: 'manage_workbook_orders',
    module: 'Super Admin: Workbook Orders',
    name: 'Workbook Orders Management',
    description: 'Track and process physical workbook pack orders, invoices, and shipping details.',
    studentDefault: false,
    level: 'Advanced',
    icon: ShoppingBag
  },
  {
    key: 'manage_students',
    module: 'Super Admin: Student Management',
    name: 'Student Management',
    description: 'Create, update, class assignment, and reset passwords for enrolled students.',
    studentDefault: false,
    level: 'Critical',
    icon: Users
  },
  {
    key: 'manage_roles_permissions',
    module: 'Super Admin: Roles & Permissions',
    name: 'Roles & Permissions Manager',
    description: 'Configure capability matrix, authorization levels, and feature controls for roles.',
    studentDefault: false,
    level: 'Critical',
    icon: ShieldCheck
  },
  {
    key: 'manage_academic_structure',
    module: 'Super Admin: Disciplines & Subjects',
    name: 'Disciplines & Subjects',
    description: 'Define Olympiad disciplines, classes (Nursery to 12), and subject curriculum.',
    studentDefault: false,
    level: 'Advanced',
    icon: Layers
  },
  {
    key: 'manage_subject_content',
    module: 'Super Admin: Subject & Class Content',
    name: 'Subject & Class Content',
    description: 'Author subject covers, chapter summaries, syllabus guides, and sample resources.',
    studentDefault: false,
    level: 'Advanced',
    icon: BookOpen
  },
  {
    key: 'manage_revision_vault',
    module: 'Super Admin: Revision Vault',
    name: 'Revision Vault & Bookmarks',
    description: 'Curate high-yield tricky questions, answer hints, and step-by-step explanations.',
    studentDefault: false,
    level: 'Advanced',
    icon: Bookmark
  },
  {
    key: 'manage_free_quizzes',
    module: 'Super Admin: Free Quizzes',
    name: 'FREE Quizzes Manager',
    description: 'Create 5-minute daily speed quizzes, riddles, and free diagnostic tests.',
    studentDefault: false,
    level: 'Standard',
    icon: HelpCircle
  },
  {
    key: 'manage_faqs_keyinfo',
    module: 'Super Admin: FAQs & Key Info',
    name: 'FAQs & Key Info Manager',
    description: 'Manage Olympiad exam dates, rules, guidelines, eligibility criteria, and FAQs.',
    studentDefault: false,
    level: 'Advanced',
    icon: HelpCircle
  },
  {
    key: 'manage_test_generator',
    module: 'Super Admin: Sample & Past Papers',
    name: 'Sample & Past Papers Generator',
    description: 'Manage and publish official sample papers, previous year question sets (PYQs).',
    studentDefault: false,
    level: 'Advanced',
    icon: Sparkles
  },
  {
    key: 'publish_exam_results',
    module: 'Super Admin: Exam Results & Reports',
    name: 'Exam Results & Reports',
    description: 'Compute percentiles, cutoffs, generate national rank lists and publish scorecards.',
    studentDefault: false,
    level: 'Critical',
    icon: FileCheck2
  },
  {
    key: 'manage_leaderboard',
    module: 'Super Admin: Rankings & Leaderboard',
    name: 'Rankings & Leaderboard',
    description: 'Inspect international, national, and school-level student leaderboard rankings.',
    studentDefault: false,
    level: 'Standard',
    icon: Trophy
  },
  {
    key: 'manage_certificates',
    module: 'Super Admin: Certificates Manager',
    name: 'Certificates Manager',
    description: 'Batch generate digitally verified PDF merit certificates with official QR seals.',
    studentDefault: false,
    level: 'Advanced',
    icon: Award
  },
  {
    key: 'audit_activity_logs',
    module: 'Super Admin: Audit Activity Logs',
    name: 'Audit Activity Logs',
    description: 'Inspect audit trail logs, login timestamps, IP records, and admin actions.',
    studentDefault: false,
    level: 'Critical',
    icon: Activity
  },
  {
    key: 'manage_system_settings',
    module: 'Super Admin: System Settings',
    name: 'System Settings',
    description: 'Configure portal settings, maintenance mode, notification banners, and security.',
    studentDefault: false,
    level: 'Critical',
    icon: Settings
  },

  // =========================================================================
  // 2. STUDENT PORTAL SIDEBAR MODULES
  // =========================================================================
  {
    key: 'access_student_dashboard',
    module: 'Student: Dashboard',
    name: 'Student Dashboard & Overview',
    description: 'View enrolled Olympiad subjects, test greeting, scholar star tier and live metrics.',
    studentDefault: true,
    level: 'Standard',
    icon: LayoutDashboard
  },
  {
    key: 'access_mock_tests',
    module: 'Student: Mock Tests',
    name: 'Mock Test Series & 9 Subject Covers',
    description: 'Attempt official mock test series across IGKO, ISO, IMO, IEO, ICSO, ISSO, etc.',
    studentDefault: true,
    level: 'Standard',
    icon: BookOpen
  },
  {
    key: 'access_online_classes',
    module: 'Student: Online Classes',
    name: 'My Online Classes & Video Library',
    description: 'Attend live lecture batches, interactive mentoring, and watch video recordings.',
    studentDefault: true,
    level: 'Standard',
    icon: Video
  },
  {
    key: 'access_skill_programs',
    module: 'Student: Skill Programs',
    name: 'Skill Development Programs',
    description: 'Progress through Reasoning, GK, Maths, English & Science learning pathways.',
    studentDefault: true,
    level: 'Standard',
    icon: Rocket
  },
  {
    key: 'view_performance_analytics',
    module: 'Student: Performance',
    name: 'My Performance & Analytics',
    description: 'Access 98% accuracy donut charts, subject percentiles, and growth trajectories.',
    studentDefault: true,
    level: 'Standard',
    icon: Activity
  },
  {
    key: 'view_detailed_solutions',
    module: 'Student: Solutions',
    name: 'Detailed Step-by-Step Solutions',
    description: 'Inspect step explanations and correct answer keys after test completion.',
    studentDefault: true,
    level: 'Standard',
    icon: FileText
  },
  {
    key: 'view_exam_history',
    module: 'Student: Exam History',
    name: 'Exam History & Past Scorecards',
    description: 'Review historical test attempts, scores, answer keys, and timing analysis.',
    studentDefault: true,
    level: 'Standard',
    icon: FileCheck2
  },
  {
    key: 'download_merit_certificates',
    module: 'Student: Certificates',
    name: 'My Merit Certificates',
    description: 'Download digitally verified PDF merit certificates with official QR validation.',
    studentDefault: true,
    level: 'Standard',
    icon: Award
  },
  {
    key: 'use_test_generator',
    module: 'Student: Test Generator',
    name: 'Olympiad Test Generator Pro',
    description: 'Generate custom chapter-wise practice tests with targeted question counts.',
    studentDefault: true,
    level: 'Standard',
    icon: Sparkles
  },
  {
    key: 'access_previous_year_papers',
    module: 'Student: Past Papers',
    name: 'Free Previous Year Papers (PYQ)',
    description: 'Practice authentic previous year Olympiad examination papers with live scoring.',
    studentDefault: true,
    level: 'Standard',
    icon: FileSpreadsheet
  },
  {
    key: 'access_sample_papers',
    module: 'Student: Sample Papers',
    name: 'Free Sample Papers',
    description: 'Download and practice official sample question papers matching exam pattern.',
    studentDefault: true,
    level: 'Standard',
    icon: FileText
  },
  {
    key: 'take_daily_quizzes',
    module: 'Student: Daily Quizzes',
    name: 'Daily Speed Quizzes & Free Zone',
    description: 'Attempt 5-minute speed quizzes and Olympiad brain teasers to earn Scholar XP.',
    studentDefault: true,
    level: 'Standard',
    icon: HelpCircle
  },
  {
    key: 'view_student_profile',
    module: 'Student: Account',
    name: 'Student Profile & Settings',
    description: 'View enrolled class grade, school affiliation, and account preferences.',
    studentDefault: true,
    level: 'Standard',
    icon: Users
  }
];

export const RolesAndPermissionsManager = ({ onNavigateTab }) => {
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'superadmin'
  const [catalog, setCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_permissions_catalog_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS_CATALOG;
    } catch {
      return DEFAULT_PERMISSIONS_CATALOG;
    }
  });

  // Role permissions map: { student: { [key]: boolean } }
  const [rolePerms, setRolePerms] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_role_permissions_map_v2');
      if (saved) return JSON.parse(saved);
    } catch {}

    const studentMap = {};
    DEFAULT_PERMISSIONS_CATALOG.forEach(p => {
      studentMap[p.key] = p.studentDefault;
    });
    return { student: studentMap };
  });

  const [selectedModule, setSelectedModule] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Permission Form
  const [newPerm, setNewPerm] = useState({
    key: '',
    name: '',
    description: '',
    module: 'Student: Custom Module',
    level: 'Standard',
    studentDefault: true
  });

  // Unique Modules
  const modulesList = ['All', ...Array.from(new Set(catalog.map(p => p.module)))];

  // Save to DB / LocalStorage
  const handleSavePermissions = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('olympiadhub_role_permissions_map_v2', JSON.stringify(rolePerms));
      localStorage.setItem('olympiadhub_permissions_catalog_v2', JSON.stringify(catalog));
      
      // Dispatch sync event
      window.dispatchEvent(new CustomEvent('role-permissions-updated', {
        detail: { rolePerms, catalog }
      }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving role permissions:', e);
      alert('Failed to save permissions. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle single permission for active role
  const handleTogglePermission = (permKey) => {
    if (activeRole === 'superadmin') return; // Superadmin always has full root access
    setRolePerms(prev => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [permKey]: !prev[activeRole]?.[permKey]
      }
    }));
  };

  // Quick Preset Handlers
  const handleApplyPreset = (presetType) => {
    if (activeRole === 'superadmin') return;

    setRolePerms(prev => {
      const updated = { ...prev[activeRole] };
      catalog.forEach(p => {
        if (presetType === 'all') {
          updated[p.key] = true;
        } else if (presetType === 'none') {
          updated[p.key] = false;
        } else if (presetType === 'standard_only') {
          updated[p.key] = p.level === 'Standard';
        } else if (presetType === 'default') {
          updated[p.key] = p.studentDefault;
        }
      });
      return { ...prev, [activeRole]: updated };
    });
  };

  // Handle Add Custom Permission
  const handleCreateCustomPerm = (e) => {
    e.preventDefault();
    if (!newPerm.name.trim() || !newPerm.key.trim()) {
      alert('Please provide Permission Name and Key');
      return;
    }
    const cleanKey = newPerm.key.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const item = {
      ...newPerm,
      key: cleanKey
    };

    setCatalog(prev => [...prev, item]);
    setRolePerms(prev => ({
      ...prev,
      student: { ...prev.student, [cleanKey]: newPerm.studentDefault }
    }));

    setShowAddModal(false);
    setNewPerm({
      key: '',
      name: '',
      description: '',
      module: 'Student: Custom Module',
      level: 'Standard',
      studentDefault: true
    });
  };

  // Filter Catalog
  const filteredCatalog = catalog.filter((p) => {
    const matchesModule = selectedModule === 'All' || p.module === selectedModule;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // Calculate active counts
  const studentActiveCount = catalog.filter(p => !!rolePerms.student?.[p.key]).length;

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* 1. Top Header Banner */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pink-200 text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-pink-300" />
            <span>Role-Based Access Control (RBAC) Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Roles &amp; Permissions Matrix
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Manage granular access capabilities strictly aligned with Super Admin and Student Panel sidebar modules.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
          >
            <Plus className="w-4 h-4 text-pink-300" />
            <span>Add Capability</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSavePermissions}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-white/20 ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Live!</span>
              </>
            ) : isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Permissions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Role Selection Cards (ONLY Super Admin and Student Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Super Admin Master Overview */}
        <div
          onClick={() => setActiveRole('superadmin')}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            activeRole === 'superadmin'
              ? 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] border-pink-400 text-white shadow-xl ring-2 ring-pink-400/40'
              : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs opacity-90 hover:opacity-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                activeRole === 'superadmin' ? 'bg-white/10 text-pink-300 border border-white/20' : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}>
                <Sparkles className="w-6 h-6" />
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono">
                ROOT SYSTEM
              </span>
            </div>
            <h3 className={`text-lg font-black ${activeRole === 'superadmin' ? 'text-white' : 'text-slate-900'}`}>
              Super Administrator
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${activeRole === 'superadmin' ? 'text-blue-100' : 'text-slate-500'}`}>
              Full master control across all 20 Super Admin management modules and student panels. (Unrestricted root access).
            </p>
          </div>

          <div className={`pt-4 mt-5 border-t flex items-center justify-between text-xs ${
            activeRole === 'superadmin' ? 'border-white/20' : 'border-slate-100'
          }`}>
            <span className={`font-black ${activeRole === 'superadmin' ? 'text-pink-300' : 'text-purple-700'}`}>
              {catalog.length} / {catalog.length} Permissions (Unrestricted)
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              activeRole === 'superadmin' ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-md' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeRole === 'superadmin' ? '● Active View' : 'Select'}
            </span>
          </div>
        </div>

        {/* Student Role Card */}
        <div
          onClick={() => setActiveRole('student')}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            activeRole === 'student'
              ? 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] border-pink-400 text-white shadow-xl ring-2 ring-pink-400/40'
              : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs opacity-90 hover:opacity-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                activeRole === 'student' ? 'bg-white/10 text-pink-300 border border-white/20' : 'bg-pink-50 text-pink-700 border border-pink-200'
              }`}>
                <GraduationCap className="w-6 h-6" />
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/40 font-mono">
                CANDIDATE / LEARNER
              </span>
            </div>
            <h3 className={`text-lg font-black ${activeRole === 'student' ? 'text-white' : 'text-slate-900'}`}>
              Student / Candidate
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${activeRole === 'student' ? 'text-blue-100' : 'text-slate-500'}`}>
              Enrolled students (Classes 1-12) accessing mock tests, online classes, skill programs, scorecards, and certificates.
            </p>
          </div>

          <div className={`pt-4 mt-5 border-t flex items-center justify-between text-xs ${
            activeRole === 'student' ? 'border-white/20' : 'border-slate-100'
          }`}>
            <span className={`font-black ${activeRole === 'student' ? 'text-pink-300' : 'text-pink-700'}`}>
              {studentActiveCount} / {catalog.length} Permissions Enabled
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              activeRole === 'student' ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-md' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeRole === 'student' ? '● Editing Now' : 'Select'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Toolbar & Module Filters */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Module Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
            {modulesList.map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModule(mod)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedModule === mod
                    ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search capability or sidebar module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Quick Preset Action Bar */}
        {activeRole === 'student' && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-600">Quick Presets for Student Role:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('default')}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Standard Student Default
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('all')}
                className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors cursor-pointer"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('none')}
                className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors cursor-pointer"
              >
                Revoke All
              </button>
            </div>

            <span className="text-slate-400 text-[11px] font-semibold">
              Showing {filteredCatalog.length} capabilities
            </span>
          </div>
        )}
      </div>

      {/* 4. Permissions Matrix List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-pink-500" />
            <span>
              Capabilities Matrix: {activeRole === 'superadmin' ? 'Super Administrator (Root Access)' : 'Student / Candidate'}
            </span>
          </h3>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {activeRole === 'superadmin' ? 'All Unrestricted' : `${studentActiveCount} Enabled`}
          </span>
        </div>

        {activeRole === 'superadmin' ? (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Root Super Administrator Access (Immutable)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              The Super Administrator holds full root capabilities across all Super Admin management modules, payment configurations, student rosters, question banks, and system settings.
            </p>
          </div>
        ) : null}

        <div className="divide-y divide-slate-100">
          {filteredCatalog.map((perm) => {
            const isGranted = activeRole === 'superadmin' ? true : !!rolePerms.student?.[perm.key];
            const Icon = perm.icon || Shield;

            return (
              <div
                key={perm.key}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-2xl px-3 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {perm.name}
                      </h4>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {perm.key}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {perm.module}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        perm.level === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        perm.level === 'Advanced' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {perm.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {perm.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    disabled={activeRole === 'superadmin'}
                    onClick={() => handleTogglePermission(perm.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isGranted ? 'bg-gradient-to-r from-[#2563eb] to-[#db2777]' : 'bg-slate-300'
                    } ${activeRole === 'superadmin' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isGranted ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <span className={`text-xs font-bold w-20 text-center py-1 rounded-lg ${
                    isGranted ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-400 bg-slate-100'
                  }`}>
                    {isGranted ? 'Granted' : 'Disabled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Modal: Add Custom Capability */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Sidebar Capability</h3>
                  <p className="text-xs text-slate-500">Define a new permission key and access rule</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPerm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Capability Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Access Premium Video Masterclasses"
                  value={newPerm.name}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    const autoKey = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 32);
                    setNewPerm(prev => ({ ...prev, name: nameVal, key: prev.key || autoKey }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Permission Key (Unique Identifier) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. access_premium_videos"
                  value={newPerm.key}
                  onChange={(e) => setNewPerm(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sidebar Module Category *
                </label>
                <select
                  value={newPerm.module}
                  onChange={(e) => setNewPerm(prev => ({ ...prev, module: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-900 bg-white"
                >
                  <option value="Super Admin: Custom Studio">Super Admin: Custom Studio</option>
                  <option value="Student: Custom Module">Student: Custom Module</option>
                  {modulesList.filter(m => m !== 'All').map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain what this sidebar capability enables..."
                  value={newPerm.description}
                  onChange={(e) => setNewPerm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white font-bold cursor-pointer shadow-md active:scale-95"
                >
                  Save Capability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
