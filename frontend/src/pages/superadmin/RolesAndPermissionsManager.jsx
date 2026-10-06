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
  UserCheck
} from 'lucide-react';
import { apiClient } from '../../api/client';

// Master list of all system permissions grouped by module
const DEFAULT_PERMISSIONS_CATALOG = [
  // 1. Examination & Test Engine
  {
    key: 'take_live_exams',
    module: 'Exam & Test Engine',
    name: 'Attempt Live Official Exams',
    description: 'Allows candidates to launch and submit scheduled Level 1 & Level 2 live Olympiad exams.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_exams',
    module: 'Exam & Test Engine',
    name: 'Create & Schedule Exams',
    description: 'Create, schedule, edit time windows, publish and delete online examinations.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },
  {
    key: 'manage_question_bank',
    module: 'Exam & Test Engine',
    name: 'Manage Olympiad Question Bank',
    description: 'Add, update, bulk import MCQs, HOTS questions, diagrams and step-by-step solutions.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },
  {
    key: 'create_custom_tests',
    module: 'Exam & Test Engine',
    name: 'Generate Custom Mock Tests',
    description: 'Use the AI Test Generator to create customized chapter-wise diagnostic tests.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'take_daily_quizzes',
    module: 'Exam & Test Engine',
    name: 'Attempt Daily Speed Quizzes',
    description: 'Participate in 5-minute daily speed quizzes and Olympiad riddles to earn Scholar XP.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'download_paper_pdfs',
    module: 'Exam & Test Engine',
    name: 'Download Question Paper PDFs',
    description: 'Download offline question paper PDFs and syllabus sheets with watermarked candidate details.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'grade_subjective_papers',
    module: 'Exam & Test Engine',
    name: 'Evaluate & Grade Submissions',
    description: 'Grade subjective questions, award bonus marks, and record evaluator remarks.',
    adminDefault: true,
    studentDefault: false,
    level: 'Critical'
  },

  // 2. Curriculum, Notes & Revision Studio
  {
    key: 'access_enrolled_curriculum',
    module: 'Curriculum & Notes',
    name: 'View Class Subject Curriculum',
    description: 'Access chapter-wise notes, conceptual summaries, and achievers question bank.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'access_revision_vault',
    module: 'Curriculum & Notes',
    name: 'Access My Revision Vault & Bookmarks',
    description: 'Review bookmarked tricky questions, hints, and step-by-step explanations for own grade.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_revision_vault',
    module: 'Curriculum & Notes',
    name: 'Curate Super Admin Revision Vault',
    description: 'Curate, add new revision questions with verified 4 options, and publish to student vaults.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },
  {
    key: 'attend_online_classes',
    module: 'Curriculum & Notes',
    name: 'Attend Live Classes & Watch Recordings',
    description: 'Join live interactive lecture sessions and access digital library video recordings.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_online_classes',
    module: 'Curriculum & Notes',
    name: 'Manage Online Classes Studio',
    description: 'Schedule batches, assign instructors, manage stream links and video assets.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },
  {
    key: 'access_skill_programs',
    module: 'Curriculum & Notes',
    name: 'Enroll in Skill Programs (MSDP/SSDP)',
    description: 'Progress through 4-stage structured skill development pathways and earn badges.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_skill_programs',
    module: 'Curriculum & Notes',
    name: 'Configure Skill Curriculum & Milestones',
    description: 'Design skill development stages, XP rewards, milestone assessments and certifications.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },

  // 3. Performance, Scorecards & Results
  {
    key: 'view_detailed_solutions',
    module: 'Performance & Results',
    name: 'View Step-by-Step Solutions',
    description: 'Inspect comprehensive solution walkthroughs and correct answer keys after exam submission.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'view_scorecard_analysis',
    module: 'Performance & Results',
    name: 'View Performance Growth & Analytics',
    description: 'Access 98% accuracy donut charts, subject growth trajectories, and percentile insights.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'publish_exam_results',
    module: 'Performance & Results',
    name: 'Publish Official Exam Results & Ranks',
    description: 'Compute cutoffs, generate national/zonal ranks and publish scorecards to candidate portals.',
    adminDefault: true,
    studentDefault: false,
    level: 'Critical'
  },
  {
    key: 'view_leaderboards',
    module: 'Performance & Results',
    name: 'View Rankings & Leaderboards',
    description: 'Inspect school, state, and international leaderboards and top rankers.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'download_merit_certificates',
    module: 'Performance & Results',
    name: 'Download Merit Certificates',
    description: 'Download digitally verified PDF merit certificates with official seal and QR code.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_certificates',
    module: 'Performance & Results',
    name: 'Generate & Sign Certificates',
    description: 'Template designer, batch certificate generation, and authorized signature control.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },

  // 4. Store, Workbook Orders & Wallet
  {
    key: 'order_workbooks',
    module: 'Orders & Payments',
    name: 'Purchase Workbooks & Digital Kits',
    description: 'Order physical Olympiad preparation workbook packs and register for mock sets.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_workbook_orders',
    module: 'Orders & Payments',
    name: 'Manage Orders & Dispatch Tracking',
    description: 'Process workbook shipments, update courier tracking numbers, and manage invoices.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },
  {
    key: 'access_student_wallet',
    module: 'Orders & Payments',
    name: 'Redeem Coins & Wallet Credits',
    description: 'Redeem reward scholar coins, view wallet balance, and use test tokens.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_payments_qr',
    module: 'Orders & Payments',
    name: 'Manage Payment Gateways & QR Codes',
    description: 'Configure UPI payment QR codes, bank accounts, and approve pending payment slips.',
    adminDefault: true,
    studentDefault: false,
    level: 'Critical'
  },

  // 5. Community, Forum & Helpdesk
  {
    key: 'post_doubts_in_forum',
    module: 'Community & Forum',
    name: 'Post Doubts in Student Forum',
    description: 'Create new doubt discussion threads and ask questions to verified mentors.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_forum_moderation',
    module: 'Community & Forum',
    name: 'Moderate Forum & Provide Official Answers',
    description: 'Pin helpful answers, moderate inappropriate discussions, and answer candidate queries.',
    adminDefault: true,
    studentDefault: false,
    level: 'Standard'
  },
  {
    key: 'view_datesheet_faqs',
    module: 'Community & Forum',
    name: 'View Official Date Sheet & FAQs',
    description: 'Inspect synchronized exam calendar, timing slots, webcam rules, and guidelines.',
    adminDefault: true,
    studentDefault: true,
    level: 'Standard'
  },
  {
    key: 'manage_faqs_keyinfo',
    module: 'Community & Forum',
    name: 'Manage FAQs & Discipline Metadata',
    description: 'Edit examination dates, guidelines, syllabus chapters, and eligibility criteria.',
    adminDefault: true,
    studentDefault: false,
    level: 'Advanced'
  },

  // 6. User Management & Security
  {
    key: 'manage_student_accounts',
    module: 'User & Security Management',
    name: 'Manage Student Profiles & Credentials',
    description: 'Create student accounts, assign classes, reset passwords, and toggle active status.',
    adminDefault: true,
    studentDefault: false,
    level: 'Critical'
  },
  {
    key: 'manage_school_affiliations',
    module: 'User & Security Management',
    name: 'Manage School & Coordinator Applications',
    description: 'Review institutional registrations, approve coordinator roles, and bulk enrollments.',
    adminDefault: true,
    studentDefault: false,
    level: 'Critical'
  },
  {
    key: 'audit_activity_logs',
    module: 'User & Security Management',
    name: 'View Audit Logs & System Trails',
    description: 'Inspect login timestamps, IP addresses, exam attempts, and administrative modifications.',
    adminDefault: true,
    studentDefault: false,
    level: 'Critical'
  }
];

export const RolesAndPermissionsManager = ({ onNavigateTab }) => {
  const [activeRole, setActiveRole] = useState('admin'); // 'admin' | 'student' | 'superadmin'
  const [catalog, setCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_permissions_catalog');
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS_CATALOG;
    } catch {
      return DEFAULT_PERMISSIONS_CATALOG;
    }
  });

  // Role permissions map: { admin: { [key]: boolean }, student: { [key]: boolean } }
  const [rolePerms, setRolePerms] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_role_permissions_map');
      if (saved) return JSON.parse(saved);
    } catch {}

    const adminMap = {};
    const studentMap = {};
    DEFAULT_PERMISSIONS_CATALOG.forEach(p => {
      adminMap[p.key] = p.adminDefault;
      studentMap[p.key] = p.studentDefault;
    });
    return { admin: adminMap, student: studentMap };
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
    module: 'Exam & Test Engine',
    level: 'Standard',
    adminDefault: true,
    studentDefault: false
  });

  // Unique Modules
  const modulesList = ['All', ...Array.from(new Set(catalog.map(p => p.module)))];

  // Save to DB / LocalStorage
  const handleSavePermissions = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('olympiadhub_role_permissions_map', JSON.stringify(rolePerms));
      localStorage.setItem('olympiadhub_permissions_catalog', JSON.stringify(catalog));
      
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
    if (activeRole === 'superadmin') return; // Superadmin always has full access
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
          updated[p.key] = activeRole === 'admin' ? p.adminDefault : p.studentDefault;
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
      admin: { ...prev.admin, [cleanKey]: newPerm.adminDefault },
      student: { ...prev.student, [cleanKey]: newPerm.studentDefault }
    }));

    setShowAddModal(false);
    setNewPerm({
      key: '',
      name: '',
      description: '',
      module: 'Exam & Test Engine',
      level: 'Standard',
      adminDefault: true,
      studentDefault: false
    });
  };

  // Filtered Permissions
  const filteredCatalog = catalog.filter(p => {
    const matchesModule = selectedModule === 'All' || p.module === selectedModule;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  // Calculate active counts
  const adminActiveCount = catalog.filter(p => rolePerms.admin?.[p.key]).length;
  const studentActiveCount = catalog.filter(p => rolePerms.student?.[p.key]).length;

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-150 pb-16">
      {/* 1. Header on Page Background (No dark box) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6d3a68]" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a] tracking-tight">
            Role &amp; Permission Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Configure system capabilities, module permissions, and operational access for Admin &amp; Student roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl border border-[#edd6ed] bg-white hover:bg-[#faf5fa] text-[#6d3a68] font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#6d3a68]" />
            <span>Add Capability</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSavePermissions}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
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

      {/* 2. Top Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Role Card */}
        <div
          onClick={() => setActiveRole('admin')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            activeRole === 'admin'
              ? 'bg-white border-[#6d3a68] shadow-md ring-2 ring-[#6d3a68]/20'
              : 'bg-white border-[#edd6ed] hover:border-[#6d3a68]/50 shadow-2xs opacity-80 hover:opacity-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-10 h-10 rounded-2xl bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center font-bold border border-[#edd6ed] shadow-2xs">
                <Shield className="w-5 h-5" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                Admin
              </span>
            </div>
            <h3 className="text-base font-black text-[#4e2a4a]">Administrator</h3>
            <p className="text-xs text-slate-500 mt-1">
              Examination managers, question evaluators, and content authors.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f4ebf4] flex items-center justify-between text-xs">
            <span className="font-black text-[#6d3a68]">
              {adminActiveCount} / {catalog.length} Permissions
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              activeRole === 'admin' ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeRole === 'admin' ? '● Editing Now' : 'Select'}
            </span>
          </div>
        </div>

        {/* Student Role Card */}
        <div
          onClick={() => setActiveRole('student')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            activeRole === 'student'
              ? 'bg-white border-[#d9775b] shadow-md ring-2 ring-[#d9775b]/20'
              : 'bg-white border-[#edd6ed] hover:border-[#d9775b]/50 shadow-2xs opacity-80 hover:opacity-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-10 h-10 rounded-2xl bg-[#fff9f2] text-[#d9775b] flex items-center justify-center font-bold border border-[#f5e3d7] shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                Candidate / Learner
              </span>
            </div>
            <h3 className="text-base font-black text-[#4e2a4a]">Student / Candidate</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enrolled students (Classes 1-12) taking tests, viewing solutions and practicing.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f4ebf4] flex items-center justify-between text-xs">
            <span className="font-black text-[#d9775b]">
              {studentActiveCount} / {catalog.length} Permissions
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              activeRole === 'student' ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeRole === 'student' ? '● Editing Now' : 'Select'}
            </span>
          </div>
        </div>

        {/* Super Admin Master Overview */}
        <div
          onClick={() => setActiveRole('superadmin')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            activeRole === 'superadmin'
              ? 'bg-white border-[#e7b84b] shadow-md ring-2 ring-[#e7b84b]/20'
              : 'bg-white border-[#edd6ed] hover:border-[#e7b84b]/50 shadow-2xs opacity-80 hover:opacity-100'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-10 h-10 rounded-2xl bg-[#faf4e0] text-[#e7b84b] flex items-center justify-center font-bold border border-[#f5e7bf] shadow-2xs">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 font-mono">
                Root System
              </span>
            </div>
            <h3 className="text-base font-black text-[#4e2a4a]">Super Administrator</h3>
            <p className="text-xs text-slate-500 mt-1">
              Master control with immutable global root bypass (All capabilities unlocked).
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-[#f4ebf4] flex items-center justify-between text-xs">
            <span className="font-black text-amber-700">
              {catalog.length} / {catalog.length} (Unrestricted)
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              activeRole === 'superadmin' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeRole === 'superadmin' ? '● Root View' : 'Select'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Toolbar & Preset Actions */}
      <div className="bg-white rounded-3xl p-5 border border-[#edd6ed] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Module Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
            {modulesList.map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModule(mod)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedModule === mod
                    ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs'
                    : 'bg-[#faf5fa] text-[#6d3a68] hover:bg-[#f4eaf4] border border-[#edd6ed]'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#6d3a68] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search capability or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#edd6ed] text-xs font-medium text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68] bg-[#faf5fa] placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Quick Preset Action Bar */}
        {activeRole !== 'superadmin' && (
          <div className="pt-3 border-t border-[#f4ebf4] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Quick Presets for {activeRole === 'admin' ? 'Admin' : 'Student'}:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('default')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Standard Default
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('all')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors cursor-pointer"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('standard_only')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition-colors cursor-pointer"
              >
                Standard Only
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('none')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors cursor-pointer"
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
          <h3 className="text-sm font-black text-[#4e2a4a] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#d9775b]" />
            <span>
              Capabilities Matrix: {activeRole === 'admin' ? 'Administrator' : activeRole === 'student' ? 'Student / Candidate' : 'Super Administrator'}
            </span>
          </h3>
          <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-3 py-1 rounded-full border border-[#edd6ed]">
            {activeRole === 'admin' ? `${adminActiveCount} Enabled` : activeRole === 'student' ? `${studentActiveCount} Enabled` : 'All Active'}
          </span>
        </div>

        {activeRole === 'superadmin' ? (
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Root Administrator Permissions (Immutable)</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              The Super Administrator holds global root capabilities across all database modules, system settings, payment gateways, and security configurations. These permissions cannot be restricted to prevent platform lockouts.
            </p>
          </div>
        ) : null}

        <div className="divide-y divide-[#f4ebf4]">
          {filteredCatalog.map((perm) => {
            const isGranted = activeRole === 'superadmin' ? true : !!rolePerms[activeRole]?.[perm.key];

            return (
              <div
                key={perm.key}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fffdfa] rounded-2xl px-2 transition-colors"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-black text-[#4e2a4a]">
                      {perm.name}
                    </h4>
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {perm.key}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]">
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

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    disabled={activeRole === 'superadmin'}
                    onClick={() => handleTogglePermission(perm.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isGranted ? 'bg-[#00b074]' : 'bg-slate-300'
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
                    {isGranted ? 'Granted ✓' : 'Denied ✕'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Add Custom Permission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#edd6ed] shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center font-black">
                  <Plus className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-[#4e2a4a]">Add New Custom Capability</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomPerm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">Capability Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Access Live Olympiad Webinars"
                  value={newPerm.name}
                  onChange={(e) => setNewPerm({ ...newPerm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-semibold text-[#4e2a4a] focus:ring-2 focus:ring-[#6d3a68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">Unique Permission Key (code identifier)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. access_live_webinars"
                  value={newPerm.key}
                  onChange={(e) => setNewPerm({ ...newPerm, key: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-mono font-bold text-[#6d3a68] focus:ring-2 focus:ring-[#6d3a68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">Module Category</label>
                <select
                  value={newPerm.module}
                  onChange={(e) => setNewPerm({ ...newPerm, module: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-semibold text-[#4e2a4a] focus:ring-2 focus:ring-[#6d3a68] focus:outline-none"
                >
                  <option value="Exam & Test Engine">Exam &amp; Test Engine</option>
                  <option value="Curriculum & Notes">Curriculum &amp; Notes</option>
                  <option value="Performance & Results">Performance &amp; Results</option>
                  <option value="Orders & Payments">Orders &amp; Payments</option>
                  <option value="Community & Forum">Community &amp; Forum</option>
                  <option value="User & Security Management">User &amp; Security Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe what this permission enables or restricts..."
                  value={newPerm.description}
                  onChange={(e) => setNewPerm({ ...newPerm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs text-[#4e2a4a] focus:ring-2 focus:ring-[#6d3a68] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5fa] border border-[#edd6ed] text-xs font-bold text-[#4e2a4a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPerm.adminDefault}
                    onChange={(e) => setNewPerm({ ...newPerm, adminDefault: e.target.checked })}
                    className="accent-[#6d3a68] w-4 h-4 rounded"
                  />
                  <span>Enable for Admin</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#faf5fa] border border-[#edd6ed] text-xs font-bold text-[#4e2a4a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPerm.studentDefault}
                    onChange={(e) => setNewPerm({ ...newPerm, studentDefault: e.target.checked })}
                    className="accent-[#d9775b] w-4 h-4 rounded"
                  />
                  <span>Enable for Student</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f4ebf4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] transition-colors cursor-pointer shadow-sm"
                >
                  Save Capability 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
