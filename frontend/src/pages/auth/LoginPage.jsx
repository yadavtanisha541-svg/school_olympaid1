import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { OlympiadHubLogo } from '../../components/OlympiadHubLogo';

export const LoginPage = ({ onNavigateVerify, onNavigateHome, onBackToPublic }) => {
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoHome = () => {
    if (onBackToPublic) {
      onBackToPublic();
    } else if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

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

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-100/90 font-sans">
      {/* Ambient Lighting Accents in background */}
      <div className="absolute top-[-10%] left-[-8%] w-[480px] h-[480px] rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-8%] w-[520px] h-[520px] rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />

      {/* Decorative Subtle Background Dots */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Navigation: Back to Website */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-start relative z-20 mb-3 sm:mb-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer group active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Website</span>
        </button>
      </div>

      {/* Center Square Login Box Card with Pink -> Purple -> Blue Gradient */}
      <div className="w-full max-w-md relative z-10 my-auto bg-gradient-to-b from-[#b93787] via-[#6e32a0] to-[#2355c8] rounded-[32px] p-6 sm:p-8 shadow-2xl border-2 border-white/30 text-white">
        {/* Branding Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-3 transform hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded-2xl bg-white/95 shadow-md" onClick={handleGoHome} title="Go to Home">
            <OlympiadHubLogo size="lg" />
          </div>
          <p className="mt-1 text-xs sm:text-sm text-pink-100 font-bold tracking-wide drop-shadow-xs">
            National Online Examination &amp; Olympiad Assessment System
          </p>
        </div>

        {/* Login Form Container */}
        <div className="w-full">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/90 border border-white/30 text-white text-xs font-bold flex items-start gap-2.5 animate-shake shadow-lg backdrop-blur-md">
                <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-extrabold text-white uppercase tracking-wider mb-2 drop-shadow-xs">
                Login ID
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. ADMIN001, TCH101, STU1001"
                  className="block w-full pl-11 pr-4 h-12 bg-white text-slate-900 placeholder-slate-400 border border-white/40 focus:border-indigo-400 focus:ring-4 focus:ring-white/30 rounded-2xl text-xs sm:text-sm font-bold transition-all focus:outline-none shadow-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-white uppercase tracking-wider mb-2 drop-shadow-xs">
                Password
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-11 pr-11 h-12 bg-white text-slate-900 placeholder-slate-400 border border-white/40 focus:border-indigo-400 focus:ring-4 focus:ring-white/30 rounded-2xl text-xs sm:text-sm font-bold transition-all focus:outline-none shadow-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-white/40 focus:ring-white accent-indigo-600"
                />
                <span className="text-xs text-white font-bold drop-shadow-xs">Remember me</span>
              </label>

              <span className="text-[11px] text-pink-200 font-semibold drop-shadow-xs">
                Managed by Admin
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-12.5 mt-2 rounded-2xl bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 border border-white/30"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4 text-white" />}
            </button>
          </form>

          {/* Additional Quick Help */}
          <div className="mt-6 text-center">
            <p className="text-xs text-pink-100 font-semibold drop-shadow-xs">
              Don't have login credentials?{' '}
              <span className="text-white font-black underline underline-offset-2 cursor-pointer">Contact your School Coordinator</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-3">
        <p className="text-[11px] text-slate-500 font-bold">
          © {new Date().getFullYear()} OlympiadHub Assessment Portal. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
