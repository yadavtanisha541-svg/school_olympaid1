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
  UploadCloud,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { user, hasPermission } = useAuth();

  const superAdminNav = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
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
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'question_bank', label: 'Question Bank', icon: HelpCircle, perm: 'manage_questions' },
    { id: 'exams', label: 'Exams Manager', icon: FileSpreadsheet, perm: 'manage_exams' },
    { id: 'students', label: 'View Students', icon: Users, perm: 'view_students' },
    { id: 'results', label: 'Student Results', icon: FileCheck2, perm: 'view_results' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, perm: 'view_leaderboards' },
  ];

  const studentNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'available_exams', label: 'Available Olympiads', icon: BookOpen },
    { id: 'exam_history', label: 'My Exam History', icon: Clock },
    { id: 'performance', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Olympiad Leaderboard', icon: Trophy },
    { id: 'certificates', label: 'My Certificates', icon: Award },
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
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {user?.role === 'superadmin' ? 'Administration' : user?.role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
            </p>
          </div>

          {navItems.map((item) => {
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-semibold text-slate-700">Exam Engine Live</p>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Secure Proctoring & Timers Active
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
