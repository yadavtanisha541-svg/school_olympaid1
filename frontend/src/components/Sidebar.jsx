import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
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
  BarChart3,
  UserCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { user, hasPermission } = useAuth();

  const superAdminNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teachers', label: 'Teacher Management', icon: GraduationCap },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'academic', label: 'Classes & Subjects', icon: Layers },
    { id: 'question_bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'exams', label: 'Exam Management', icon: FileSpreadsheet },
    { id: 'results', label: 'Exam Results & Reports', icon: FileCheck2 },
    { id: 'leaderboard', label: 'Rankings & Leaderboard', icon: Trophy },
    { id: 'certificates', label: 'Certificates Manager', icon: Award },
    { id: 'activity_logs', label: 'Audit Activity Logs', icon: Activity },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const teacherNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'question_bank', label: 'Question Bank', icon: HelpCircle, perm: 'manage_questions' },
    { id: 'exams', label: 'Exam Management', icon: FileSpreadsheet, perm: 'manage_exams' },
    { id: 'students', label: 'Student Management', icon: Users, perm: 'view_students' },
    { id: 'results', label: 'Exam Results & Reports', icon: FileCheck2, perm: 'view_results' },
    { id: 'leaderboard', label: 'Rankings & Leaderboard', icon: Trophy, perm: 'view_leaderboards' },
  ];

  const studentNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'available_exams', label: 'Available Olympiads', icon: BookOpen },
    { id: 'exam_history', label: 'My Exam History', icon: Clock },
    { id: 'performance', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Rankings & Leaderboard', icon: Trophy },
    { id: 'certificates', label: 'Certificates Manager', icon: Award },
    { id: 'profile', label: 'My Profile & Security', icon: UserCheck },
  ];

  let navItems = [];
  if (user?.role === 'superadmin') {
    navItems = superAdminNav;
  } else if (user?.role === 'teacher') {
    navItems = teacherNav.filter(item => !item.perm || hasPermission(item.perm));
  } else {
    navItems = studentNav;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              Olympiad<span className="text-indigo-600">Hub</span>
            </span>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wide mt-0.5">
              Learn • Compete • Grow
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Top Dashboard Item */}
          {navItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onSelectTab('overview');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 mb-3 ${
                currentTab === 'overview'
                  ? 'bg-indigo-50/90 text-indigo-700 border border-indigo-100 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${currentTab === 'overview' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>
          )}

          <div className="px-3 pt-2 pb-1.5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {user?.role === 'superadmin' ? 'ADMINISTRATION' : user?.role === 'teacher' ? 'FACULTY PORTAL' : 'STUDENT PORTAL'}
            </p>
          </div>

          {navItems.filter(i => i.id !== 'overview').map((item) => {
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
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Bottom Promotional Card */}
          <div className="pt-6 pb-2 px-1">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100/80 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 max-w-[120px]">
                  <p className="text-xs font-black text-slate-800 leading-tight">
                    Build Better Future Through Olympiads
                  </p>
                </div>
                {/* Visual Icon Illustration */}
                <div className="w-12 h-12 rounded-xl bg-white/80 border border-indigo-100 flex items-center justify-center text-amber-500 shadow-xs">
                  <Trophy className="w-6 h-6 text-amber-500 fill-amber-400/20" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectTab(user?.role === 'student' ? 'available_exams' : 'exams')}
                  className="w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm shadow-indigo-500/30 transition-transform active:scale-95"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
