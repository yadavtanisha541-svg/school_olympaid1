import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, User, Shield, GraduationCap, BookOpen, AlertCircle, ArrowRight, Award } from 'lucide-react';
import { Button } from '../../components/Button';

export const LoginPage = ({ onNavigateVerify }) => {
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginId.trim()) {
      setError('Please enter your Login ID');
      return;
    }
    if (!password) {
      setError('Please enter your Password');
      return;
    }

    setLoading(true);
    try {
      await login(loginId.trim(), password);
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (id, pass) => {
    setLoginId(id);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-black text-2xl shadow-xl shadow-brand-500/30 mb-4 border border-brand-400/30">
            Ω
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Olympiad<span className="text-brand-400">Hub</span>
          </h2>
          <p className="mt-2 text-xs text-slate-300 font-medium">
            National Online Examination & Olympiad Assessment System
          </p>
        </div>

        <div className="mt-8 bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-white/20">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Login ID
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. ADMIN001, TCH101, STU1001"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm font-medium transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me</span>
              </label>

              <span className="text-xs text-slate-400">
                Managed by Admin
              </span>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-sm font-bold shadow-lg shadow-brand-500/25"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              One-Click Demo Role Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('ADMIN001', 'Admin@123')}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors"
              >
                <Shield className="w-4 h-4 text-purple-600 mb-1" />
                <span className="text-[10px] font-bold">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('TCH101', 'Teacher@123')}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[10px] font-bold">Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('STU1001', 'Student@123')}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold">Student</span>
              </button>
            </div>
          </div>
        </div>

        {/* Public Certificate Verification Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onNavigateVerify}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Verify Candidate Certificate Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
