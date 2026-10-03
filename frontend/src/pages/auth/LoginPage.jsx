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
    <div className="min-h-screen w-full flex flex-col justify-between items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#fff9f2]">
      {/* Light Luxury Theme Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-8%] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#edd6ed]/60 via-[#deb8de]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-8%] w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-[#fae8d8]/70 via-[#f9dfce]/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[320px] h-[320px] rounded-full bg-[#fbebc8]/40 blur-3xl pointer-events-none" />

      {/* Decorative Subtle Background Grid / Rings */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#4e2a4a 1.2px, transparent 1.2px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Top Header Navigation: Back to Website */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-start relative z-20 mb-4 sm:mb-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-2xl bg-white/85 hover:bg-white border border-[#deb8de]/80 text-[#4e2a4a] hover:text-[#6d3a68] text-xs font-bold shadow-2xs hover:shadow-xs backdrop-blur-md transition-all cursor-pointer group active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#6d3a68] group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Website</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Branding Header */}
        <div className="text-center mb-7 flex flex-col items-center">
          <div className="mb-3 transform hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={handleGoHome} title="Go to Home">
            <OlympiadHubLogo size="lg" />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-[#6d3a68] font-semibold tracking-wide">
            National Online Examination &amp; Olympiad Assessment System
          </p>
        </div>

        {/* Login Form directly on the background (No outer box container) */}
        <div className="w-full px-2 sm:px-4">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-extrabold text-[#4e2a4a] uppercase tracking-wider mb-2">
                Login ID
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6d3a68]">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. ADMIN001, TCH101, STU1001"
                  className="block w-full pl-11 pr-4 h-12 bg-white/85 hover:bg-white focus:bg-white border border-[#deb8de]/80 focus:border-[#6d3a68] focus:ring-4 focus:ring-[#6d3a68]/15 rounded-2xl text-[#2a1727] placeholder-[#a890a5] text-xs sm:text-sm font-semibold transition-all focus:outline-none shadow-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#4e2a4a] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6d3a68]">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-11 pr-11 h-12 bg-white/85 hover:bg-white focus:bg-white border border-[#deb8de]/80 focus:border-[#6d3a68] focus:ring-4 focus:ring-[#6d3a68]/15 rounded-2xl text-[#2a1727] placeholder-[#a890a5] text-xs sm:text-sm font-semibold transition-all focus:outline-none shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#a890a5] hover:text-[#6d3a68] cursor-pointer transition-colors"
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
                  className="w-4 h-4 rounded text-[#4e2a4a] border-[#deb8de] focus:ring-[#6d3a68] accent-[#4e2a4a]"
                />
                <span className="text-xs text-[#4e2a4a] font-semibold">Remember me</span>
              </label>

              <span className="text-[11px] text-[#8c4e8b] font-medium">
                Managed by Admin
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-12.5 mt-2 rounded-2xl bg-gradient-to-r from-[#4e2a4a] via-[#6d3a68] to-[#d9775b] hover:from-[#3d1f39] hover:via-[#5c2f57] hover:to-[#c85e42] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#4e2a4a]/20 hover:shadow-lg hover:shadow-[#4e2a4a]/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4 text-[#e7b84b]" />}
            </button>
          </form>

          {/* Additional Quick Help */}
          <div className="mt-7 text-center">
            <p className="text-xs text-[#8c4e8b] font-medium">
              Don't have login credentials?{' '}
              <span className="text-[#4e2a4a] font-bold">Contact your School Coordinator</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
