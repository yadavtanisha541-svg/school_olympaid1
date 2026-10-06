import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Shield,
  Key,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Save,
  Plus,
  FileText,
  Calculator,
  BookOpen,
  Video,
  CreditCard,
  ShoppingBag,
  Award,
  Trophy,
  Activity,
  X,
  HelpCircle,
  UserCheck,
  Layers,
  LayoutDashboard,
  Settings,
  Bookmark,
  FileCheck2,
  Rocket,
  Globe,
  Brain,
  Laptop
} from 'lucide-react';

// Master list of all system permissions strictly aligned with Super Admin and Student Sidebar Modules
const DEFAULT_PERMISSIONS_CATALOG = [
  // =========================================================================
  // 1. SUPER ADMIN SIDEBAR MODULES (Exact Match with Super Admin Sidebar Order)
  // =========================================================================
  {
    key: 'access_superadmin_dashboard',
    module: 'Super Admin: Dashboard',
    name: 'Dashboard',
    description: 'Main executive dashboard, overall stats, revenue summaries, and live platform analytics.',
    studentDefault: false,
    level: 'Critical',
    icon: LayoutDashboard
  },
  {
    key: 'manage_payments_qr',
    module: 'Super Admin: Payment, QR & Orders',
    name: 'Payment, QR & Orders',
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
    module: 'Super Admin: New Applicant Leads',
    name: 'New Applicant Leads',
    description: 'Review and manage prospective candidate registrations and application submissions.',
    studentDefault: false,
    level: 'Critical',
    icon: UserCheck
  },
  {
    key: 'manage_coordinators',
    module: 'Super Admin: Coordinator Applicants',
    name: 'Coordinator Applicants',
    description: 'Approve, assign, and verify school coordinator profiles and credentials.',
    studentDefault: false,
    level: 'Critical',
    icon: UserCheck
  },
  {
    key: 'manage_workbook_orders',
    module: 'Super Admin: Workbook Orders',
    name: 'Workbook Orders',
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
    name: 'Roles & Permissions',
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
    module: 'Super Admin: Revision Vault & Bookmarks',
    name: 'Revision Vault & Bookmarks',
    description: 'Curate high-yield tricky questions, answer hints, and step-by-step explanations.',
    studentDefault: false,
    level: 'Advanced',
    icon: Bookmark
  },
  {
    key: 'manage_free_quizzes',
    module: 'Super Admin: FREE Quizzes Manager',
    name: 'FREE Quizzes Manager',
    description: 'Create 5-minute daily speed quizzes, riddles, and free diagnostic tests.',
    studentDefault: false,
    level: 'Standard',
    icon: HelpCircle
  },
  {
    key: 'manage_faqs_keyinfo',
    module: 'Super Admin: FAQs & Key Info Manager',
    name: 'FAQs & Key Info Manager',
    description: 'Manage Olympiad exam dates, rules, guidelines, eligibility criteria, and FAQs.',
    studentDefault: false,
    level: 'Advanced',
    icon: HelpCircle
  },
  {
    key: 'manage_test_generator',
    module: 'Super Admin: Sample & Past Papers',
    name: 'Sample & Past Papers',
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
    name: 'Free Previous Year Papers (PYQs)',
    description: 'Download standard past question papers with official answer keys.',
    studentDefault: true,
    level: 'Standard',
    icon: BookOpen
  },
  {
    key: 'access_student_revision_vault',
    module: 'Student: Revision Vault',
    name: 'Student Revision Vault & Bookmarked Qs',
    description: 'Review bookmarked tricky questions and formula summaries.',
    studentDefault: true,
    level: 'Standard',
    icon: Bookmark
  },
  {
    key: 'manage_student_profile',
    module: 'Student: Profile',
    name: 'My Student Profile & Class Settings',
    description: 'Update candidate profile, school name, grade, and notification settings.',
    studentDefault: true,
    level: 'Standard',
    icon: Users
  }
];

export const RolesAndPermissionsManager = ({ onNavigateTab }) => {
  const [activeRole, setActiveRole] = useState('superadmin'); // Default to 'superadmin' to view super admin sidebar modules
  const [catalog, setCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_permissions_catalog_v2');
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS_CATALOG;
    } catch {
      return DEFAULT_PERMISSIONS_CATALOG;
    }
  });

  // Role permissions map: { superadmin: { [key]: boolean }, student: { [key]: boolean } }
  const [rolePerms, setRolePerms] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_role_permissions_map_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.superadmin && parsed.student) return parsed;
      }
    } catch {}

    const superadminMap = {};
    const studentMap = {};
    DEFAULT_PERMISSIONS_CATALOG.forEach(p => {
      if (p.module.startsWith('Super Admin')) {
        superadminMap[p.key] = true;
      } else {
        studentMap[p.key] = p.studentDefault;
      }
    });
    return { superadmin: superadminMap, student: studentMap };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Permission Form
  const [newPerm, setNewPerm] = useState({
    key: '',
    name: '',
    description: '',
    module: 'Super Admin: Custom Studio',
    level: 'Standard',
    studentDefault: true
  });

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

  // Toggle single permission for active role and broadcast live update immediately
  const handleTogglePermission = (permKey) => {
    setRolePerms(prev => {
      const currentVal = prev[activeRole]?.[permKey] !== false; // default true
      const nextRolePerms = {
        ...prev,
        [activeRole]: {
          ...(prev[activeRole] || {}),
          [permKey]: !currentVal
        }
      };

      try {
        localStorage.setItem('olympiadhub_role_permissions_map_v2', JSON.stringify(nextRolePerms));
        window.dispatchEvent(new CustomEvent('role-permissions-updated', {
          detail: { rolePerms: nextRolePerms, catalog }
        }));
      } catch (e) {}

      return nextRolePerms;
    });
  };

  // Quick Preset Handlers
  const handleApplyPreset = (presetType) => {
    setRolePerms(prev => {
      const updated = { ...(prev[activeRole] || {}) };
      const currentRoleItems = catalog.filter(p =>
        activeRole === 'superadmin' ? p.module.startsWith('Super Admin') : p.module.startsWith('Student')
      );

      currentRoleItems.forEach(p => {
        if (presetType === 'all') {
          updated[p.key] = true;
        } else if (presetType === 'none') {
          updated[p.key] = false;
        } else if (presetType === 'default') {
          updated[p.key] = activeRole === 'superadmin' ? true : p.studentDefault;
        }
      });

      const nextRolePerms = { ...prev, [activeRole]: updated };
      try {
        localStorage.setItem('olympiadhub_role_permissions_map_v2', JSON.stringify(nextRolePerms));
        window.dispatchEvent(new CustomEvent('role-permissions-updated', {
          detail: { rolePerms: nextRolePerms, catalog }
        }));
      } catch (e) {}

      return nextRolePerms;
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
      [activeRole]: { ...prev[activeRole], [cleanKey]: true }
    }));

    setShowAddModal(false);
    setNewPerm({
      key: '',
      name: '',
      description: '',
      module: activeRole === 'superadmin' ? 'Super Admin: Custom Studio' : 'Student: Custom Module',
      level: 'Standard',
      studentDefault: true
    });
  };

  // Filter items by role
  const superAdminCatalog = catalog.filter(p => p.module.startsWith('Super Admin'));
  const studentCatalog = catalog.filter(p => p.module.startsWith('Student'));

  const superAdminActiveCount = superAdminCatalog.filter(p => rolePerms.superadmin?.[p.key] !== false).length;
  const studentActiveCount = studentCatalog.filter(p => rolePerms.student?.[p.key] !== false).length;

  const activeRoleCatalog = activeRole === 'superadmin' ? superAdminCatalog : studentCatalog;

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* 1. Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
            <span>Role-Based Access Control (RBAC) Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Roles &amp; Permissions Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Manage granular access capabilities strictly aligned with Super Admin and Student Panel sidebar modules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-pink-600" />
            <span>Add Capability</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSavePermissions}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white'
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

      {/* 2. Top Role Selection Cards (Slim & Compact) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
        {/* Super Admin Role Card */}
        <div
          onClick={() => setActiveRole('superadmin')}
          className={`px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeRole === 'superadmin'
              ? 'bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#3b0764] border-pink-400 text-white shadow-sm ring-1 ring-pink-400/40'
              : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
              activeRole === 'superadmin' ? 'bg-white/10 text-pink-300 border border-white/20' : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className={`text-xs font-black truncate ${activeRole === 'superadmin' ? 'text-white' : 'text-slate-900'}`}>
                  Super Administrator
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  ROOT
                </span>
              </div>
              <p className={`text-[10px] truncate ${activeRole === 'superadmin' ? 'text-pink-200' : 'text-slate-400'}`}>
                {superAdminActiveCount} / {superAdminCatalog.length} Modules Active
              </p>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shrink-0 ${
            activeRole === 'superadmin' ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
          }`}>
            {activeRole === 'superadmin' ? '● Editing' : 'Select'}
          </span>
        </div>

        {/* Student Role Card */}
        <div
          onClick={() => setActiveRole('student')}
          className={`px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            activeRole === 'student'
              ? 'bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#3b0764] border-pink-400 text-white shadow-sm ring-1 ring-pink-400/40'
              : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
              activeRole === 'student' ? 'bg-white/10 text-pink-300 border border-white/20' : 'bg-pink-50 text-pink-700 border border-pink-200'
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className={`text-xs font-black truncate ${activeRole === 'student' ? 'text-white' : 'text-slate-900'}`}>
                  Student / Candidate
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  LEARNER
                </span>
              </div>
              <p className={`text-[10px] truncate ${activeRole === 'student' ? 'text-pink-200' : 'text-slate-400'}`}>
                {studentActiveCount} / {studentCatalog.length} Modules Active
              </p>
            </div>
          </div>

          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shrink-0 ${
            activeRole === 'student' ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
          }`}>
            {activeRole === 'student' ? '● Editing' : 'Select'}
          </span>
        </div>
      </div>

      {/* 3. Permissions Matrix List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap min-w-0">
            <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0">
              <Key className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 whitespace-nowrap">
              Capabilities Matrix: <span className="text-purple-700">{activeRole === 'superadmin' ? 'Super Administrator' : 'Student / Candidate'}</span>
            </h3>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 whitespace-nowrap shrink-0">
              {activeRole === 'superadmin' ? `${superAdminActiveCount} / ${superAdminCatalog.length} Active` : `${studentActiveCount} / ${studentCatalog.length} Active`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider shrink-0 mr-1">Quick:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('default')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer text-xs whitespace-nowrap shrink-0"
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('all')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors cursor-pointer text-xs whitespace-nowrap shrink-0"
            >
              Enable All
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('none')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors cursor-pointer text-xs whitespace-nowrap shrink-0"
            >
              Revoke All
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {activeRoleCatalog.map((perm) => {
            const isGranted = rolePerms[activeRole]?.[perm.key] !== false;
            const Icon = perm.icon || Shield;

            return (
              <div
                key={perm.key}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-2xl px-3 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                    isGranted ? 'bg-gradient-to-br from-blue-50 to-pink-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`text-xs sm:text-sm font-black ${isGranted ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                      {perm.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {perm.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(perm.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isGranted ? 'bg-gradient-to-r from-[#2563eb] to-[#db2777]' : 'bg-slate-300'
                    }`}
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
                    {isGranted ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Modal: Add Custom Capability */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white font-bold cursor-pointer shadow-md active:scale-95"
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
