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
  LogOut
} from 'lucide-react';
import { Badge } from './Badge';

export const Sidebar = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { user, logout, hasPermission } = useAuth();

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

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'superadmin': return 'purple';
      case 'teacher': return 'primary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

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

        {/* User Profile placed seamlessly at the very bottom */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-slate-900 flex items-center justify-center font-bold text-base shadow-xs">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 leading-none truncate">
                    {user?.full_name || 'User'}
                  </span>
                  <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                    {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'teacher' ? 'Teacher' : (user?.class_name || 'Student')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                  {user?.login_id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
