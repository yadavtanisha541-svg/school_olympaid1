import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Bell, LogOut, Menu, Award, ExternalLink } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100/90 h-20 flex items-center px-4 sm:px-6 lg:px-8 lg:pl-72">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar matching the design */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-400 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Right: Quick actions, notifications, user pill */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Certificate Quick Link */}
          <a
            href="#/verify-certificate"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Verify Certificate</span>
          </a>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="h-6 w-px bg-slate-200/80 hidden sm:block" />

          {/* User Profile Pill Card */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                {user?.role === 'superadmin' ? 'Super Admin' : user?.full_name}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {user?.role === 'superadmin' ? 'Administrator' : user?.role === 'teacher' ? 'Faculty' : 'Student'}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-0.5"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
