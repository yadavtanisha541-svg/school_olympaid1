import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Shield, BookOpen, GraduationCap, Award, ExternalLink, Menu } from 'lucide-react';
import { Badge } from './Badge';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'superadmin': return 'purple';
      case 'teacher': return 'primary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin': return Shield;
      case 'teacher': return GraduationCap;
      case 'student': return BookOpen;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(user?.role);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-brand-500/30">
                Ω
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Olympiad<span className="text-brand-600">Hub</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Links & Actions */}
          <div className="flex items-center gap-3">
            {/* Verify Certificate Quick Link */}
            <a
              href="#/verify-certificate"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Verify Certificate</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={logout}
              title="Log Out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/60 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
