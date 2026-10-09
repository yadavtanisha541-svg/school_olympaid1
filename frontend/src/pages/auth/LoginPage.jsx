import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  X,
  Building2,
  CheckCircle2,
  Check,
  ShieldCheck,
  Smartphone,
  Key,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Copy,
  Send,
  Inbox,
  RotateCw,
  Clock
} from 'lucide-react';
import { OlympiadHubLogo } from '../../components/OlympiadHubLogo';
import { GOOGLE_CLIENT_ID } from '../../config/googleConfig';
import { generateOtp, sendOtpEmail, sendWelcomeEmail } from '../../utils/emailService';

// Helper to decode Google JWT token safely
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Official Multi-color Google 'G' Logo
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.19 0 10.04 0 12s.46 3.81 1.26 5.42l4.02-3.13z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
    />
  </svg>
);

export const LoginPage = ({ onNavigateVerify, onNavigateHome, onBackToPublic }) => {
  const { login, setUser } = useAuth();

  // Mode: 'signup' (matching user image 1) or 'login'
  const [authMode, setAuthMode] = useState('signup');

  // Input States
  const [identifier, setIdentifier] = useState(''); // Mobile or Email or Login ID
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Checkbox States
  const [promoConsent, setPromoConsent] = useState(true);
  const [termsConsent, setTermsConsent] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // reCAPTCHA State
  const [captchaStatus, setCaptchaStatus] = useState('idle'); // 'idle' | 'checking' | 'verified'

  // Google Auth State
  const [googleSigningIn, setGoogleSigningIn] = useState(false);

  // OTP Verification States (Sign Up Flow matching Image 1 & 2)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [pendingSignup, setPendingSignup] = useState(null); // { email, password }
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);

  // Countdown timer for OTP Resend
  useEffect(() => {
    let timer;
    if (showOtpModal && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimer]);

  // Initialize Google One Tap if Client ID is configured
  useEffect(() => {
    const configuredClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('olympiadhub_google_client_id');

    if (configuredClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: configuredClientId,
          callback: async (response) => {
            if (response?.credential) {
              const decoded = decodeJwt(response.credential);
              if (decoded?.email) {
                await handleGoogleSelect({
                  name: decoded.name || decoded.email.split('@')[0],
                  email: decoded.email,
                  avatar: decoded.picture
                });
              }
            }
          }
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        console.warn('Google One Tap init notice:', err);
      }
    }
  }, []);

  const handleGoHome = () => {
    if (onBackToPublic) {
      onBackToPublic();
    } else if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  // Toggle reCAPTCHA verification: click to verify, click again to unclick / uncheck
  const handleCaptchaClick = () => {
    if (captchaStatus === 'checking') return;
    if (captchaStatus === 'verified') {
      setCaptchaStatus('idle');
      return;
    }
    setCaptchaStatus('checking');
    setTimeout(() => {
      setCaptchaStatus('verified');
      if (error && error.includes('robot')) {
        setError('');
      }
    }, 500);
  };

  // OTP 6-Digit input change handler with auto-advance and paste support
  const handleOtpDigitChange = (index, value) => {
    if (value.length > 1) {
      // User pasted full OTP
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      setOtpError('');
      const nextFocus = Math.min(pastedDigits.length, 5);
      const nextInput = document.getElementById(`otp-input-${nextFocus}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const clean = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto advance to next input box
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    setOtpError('');
    const lastInput = document.getElementById('otp-input-5');
    if (lastInput) lastInput.focus();
  };

  // Handle Form Submission (Sign Up triggers OTP, Login performs direct authentication)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim();

    if (!cleanId) {
      setError(
        authMode === 'signup'
          ? 'Please enter your Mobile Number or Email Address.'
          : 'Please enter your Login ID, Email or Mobile Number.'
      );
      return;
    }

    if (!password) {
      setError('Please enter your Password.');
      return;
    }

    if (authMode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password and Confirm Password do not match.');
        return;
      }
      if (!termsConsent) {
        setError('Please agree to the Terms & Conditions to register.');
        return;
      }

      // Require reCAPTCHA verification
      if (captchaStatus !== 'verified') {
        setError("Please check 'I'm not a robot' to verify.");
        return;
      }

      setLoading(true);
      try {
        // Generate secure 6-digit OTP
        const newOtp = generateOtp();
        setGeneratedOtp(newOtp);
        setPendingSignup({ email: cleanId, password });
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        setOtpTimer(30);
        setShowOtpModal(true);

        // Send OTP Verification Email
        await sendOtpEmail(cleanId, newOtp);
      } catch (err) {
        setError('Failed to send verification code. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Direct Login Flow
    if (captchaStatus !== 'verified') {
      setError("Please check 'I'm not a robot' to verify.");
      return;
    }

    setLoading(true);
    try {
      // Authenticate via login service
      await login(cleanId, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration -> Dispatch Welcome Email
  const handleVerifyOtp = async () => {
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setOtpError('Incorrect verification code. Please check your email.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    try {
      // Register & Login user via AuthContext
      const userObj = await login(pendingSignup.email, pendingSignup.password);

      // Dispatch Welcome Email with Credentials
      await sendWelcomeEmail({
        email: pendingSignup.email,
        name: userObj?.name || pendingSignup.email.split('@')[0],
        password: pendingSignup.password,
        siteUrl: window.location.origin
      });

      setShowOtpModal(false);
    } catch (err) {
      setOtpError(err.message || 'Registration failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (otpTimer > 0 || !pendingSignup?.email) return;
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setOtpTimer(30);

    await sendOtpEmail(pendingSignup.email, newOtp);
  };

  // Handle Google Sign In Authentication
  const handleGoogleSelect = async (account) => {
    setGoogleSigningIn(true);
    setError('');
    try {
      const email = account.email || 'student.google@gmail.com';
      const name = account.name || email.split('@')[0];

      // Form student profile from Google credentials
      const googleUser = {
        id: Date.now(),
        name: name,
        full_name: name,
        email: email,
        login_id: email.split('@')[0] || `STU-${Date.now().toString().slice(-4)}`,
        student_id: `STU-G-${Date.now().toString().slice(-4)}`,
        role: 'student',
        status: 'active',
        class: 'Class 6',
        class_name: 'Class 6',
        grade: 'Class 6',
        school: 'Olympiad Foundation School',
        school_name: 'Olympiad Foundation School',
        avatar: account.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        auth_provider: 'google',
        permissions: []
      };

      // Persist in localStorage and sessionStorage
      sessionStorage.setItem('olympiadhub_user', JSON.stringify(googleUser));
      sessionStorage.setItem('olympiadhub_token', `token_google_${Date.now()}`);
      localStorage.setItem('olympiadhub_user', JSON.stringify(googleUser));
      localStorage.setItem('olympiadhub_token', `token_google_${Date.now()}`);

      // Also save to all users list in db
      try {
        const existingUsers = JSON.parse(localStorage.getItem('olympiadhub_db_users') || '[]');
        if (!existingUsers.some(u => u.email === googleUser.email)) {
          localStorage.setItem('olympiadhub_db_users', JSON.stringify([googleUser, ...existingUsers]));
        }
      } catch (e) {}

      // Update AuthContext state
      setUser(googleUser);
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setGoogleSigningIn(false);
    }
  };

  // Trigger Google Official OAuth (Directly opens Google account chooser popup on device)
  const handleContinueWithGoogle = () => {
    setError('');
    const clientId =
      GOOGLE_CLIENT_ID ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('olympiadhub_google_client_id') ||
      '';

    if (!clientId) {
      setError(
        'Google Client ID required! Please configure VITE_GOOGLE_CLIENT_ID in Vercel to open real device accounts popup.'
      );
      return;
    }

    if (window.google?.accounts?.oauth2) {
      try {
        setGoogleSigningIn(true);
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              setGoogleSigningIn(false);
              setError(`Google Sign-In: ${tokenResponse.error_description || tokenResponse.error}`);
              return;
            }
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await res.json();
                if (profile?.email) {
                  await handleGoogleSelect({
                    name: profile.name || profile.given_name || profile.email.split('@')[0],
                    email: profile.email,
                    avatar: profile.picture
                  });
                } else {
                  setError('Could not retrieve profile from Google.');
                }
              } catch (err) {
                setError('Failed to fetch details from Google API.');
              } finally {
                setGoogleSigningIn(false);
              }
            }
          }
        });
        client.requestAccessToken();
      } catch (err) {
        setGoogleSigningIn(false);
        setError('Google OAuth popup failed to initialize. Please check client ID.');
      }
    } else {
      // Auto-load script if not already on window
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        handleContinueWithGoogle();
      };
      document.head.appendChild(script);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center py-3 sm:py-6 px-3 sm:px-6 relative overflow-hidden bg-slate-100/90 font-sans">
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
      <div className="w-full max-w-[370px] sm:max-w-[390px] mx-auto flex items-center justify-start relative z-20 mb-1.5 sm:mb-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer group active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Website</span>
        </button>
      </div>

      {/* Center Auth Card with Rich Pink -> Purple -> Blue Brand Gradient (Compact Proportioned Height) */}
      <div className="w-full max-w-[370px] sm:max-w-[390px] relative z-10 my-auto bg-gradient-to-b from-[#b93787] via-[#6e32a0] to-[#2355c8] rounded-2xl sm:rounded-[26px] p-3.5 sm:p-5 shadow-2xl border-2 border-white/30 text-white">
        {/* Branding Header */}
        <div className="text-center mb-2.5 sm:mb-3 flex flex-col items-center">
          <div
            className="mb-1 transform hover:scale-105 transition-transform duration-200 cursor-pointer p-1 sm:p-1.5 rounded-xl bg-white/95 shadow-md"
            onClick={handleGoHome}
            title="Go to Home"
          >
            <OlympiadHubLogo size="sm" />
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-pink-100 font-bold tracking-tight drop-shadow-xs">
            National Online Examination &amp; Assessment System
          </p>

          {/* Clean Segmented Tabs: Sign Up vs Login */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-black/25 backdrop-blur-md rounded-xl border border-white/20 mt-2 sm:mt-2.5 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
              className={`py-1 sm:py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                authMode === 'signup'
                  ? 'bg-white text-purple-900 shadow-sm scale-100'
                  : 'text-pink-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
              className={`py-1 sm:py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                authMode === 'login'
                  ? 'bg-white text-purple-900 shadow-sm scale-100'
                  : 'text-pink-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Login</span>
            </button>
          </div>
        </div>

        {/* Auth Form Container */}
        <div className="w-full">
          <form className="space-y-2 sm:space-y-2.5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/95 border border-white/30 text-white text-[10px] sm:text-[11px] font-bold flex items-start gap-2 animate-shake shadow-md">
                <AlertCircle className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Field 1: Register with Mobile Number or Email */}
            <div>
              <div className="relative rounded-xl">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    authMode === 'signup'
                      ? 'Register with Mobile Number or Email'
                      : 'Enter Mobile Number, Email or Login ID'
                  }
                  className="block w-full px-3 sm:px-3.5 h-9 sm:h-10 bg-white text-slate-900 placeholder-slate-500 border border-white/60 focus:border-indigo-400 focus:ring-2 focus:ring-white/30 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Field 2: Password* */}
            <div>
              <div className="relative rounded-xl">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password*"
                  className="block w-full px-3 sm:px-3.5 h-9 sm:h-10 bg-white text-slate-900 placeholder-slate-500 border border-white/60 focus:border-indigo-400 focus:ring-2 focus:ring-white/30 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Field 3: Confirm Password* (Sign Up Mode Only) */}
            {authMode === 'signup' && (
              <div>
                <div className="relative rounded-xl">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password*"
                    className="block w-full px-3 sm:px-3.5 h-9 sm:h-10 bg-white text-slate-900 placeholder-slate-500 border border-white/60 focus:border-indigo-400 focus:ring-2 focus:ring-white/30 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
                    required
                  />
                </div>
              </div>
            )}

            {/* Checkbox: Show Password */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] pt-0">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 border-white/50 focus:ring-white accent-indigo-600 cursor-pointer"
                />
                <span className="text-white font-bold drop-shadow-xs">Show Password</span>
              </label>

              {authMode === 'login' && (
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 border-white/50 focus:ring-white accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-white font-bold drop-shadow-xs">Remember me</span>
                </label>
              )}
            </div>

            {/* OFFICIAL GOOGLE RECAPTCHA WIDGET ("I'm not a robot" - Compact & Toggleable) */}
            <div className="bg-[#f9f9f9] border border-[#d3d3d3] rounded-xl py-1 sm:py-1.5 px-2.5 sm:px-3 flex items-center justify-between shadow-2xs select-none">
              <div
                onClick={handleCaptchaClick}
                className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group flex-1 py-0.5"
                title={captchaStatus === 'verified' ? 'Click to uncheck' : 'Click to verify'}
              >
                {/* Checkbox Box */}
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-all flex items-center justify-center shadow-2xs shrink-0 ${
                    captchaStatus === 'verified'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-[#c1c1c1] group-hover:border-[#999] bg-white text-transparent'
                  }`}
                >
                  {captchaStatus === 'checking' && (
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {captchaStatus === 'verified' && (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 stroke-[3.5] animate-in zoom-in-75 duration-150" />
                  )}
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-black transition-colors">
                  I'm not a robot
                </span>
              </div>

              {/* Official reCAPTCHA Badge */}
              <div className="flex flex-col items-center justify-center pl-2 sm:pl-2.5 border-l border-slate-200 shrink-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 relative flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-4 h-4 sm:w-5 sm:h-5" fill="none">
                    <path
                      d="M24 6V2L19 7l5 5V8c8.8 0 16 7.2 16 16 0 3.3-1 6.4-2.8 9l2.9 2.9C42.4 32.4 44 28.4 44 24c0-11-9-20-20-20z"
                      fill="#4A90E2"
                    />
                    <path
                      d="M12 24c0-3.3 1-6.4 2.8-9L11.9 12.1C9.6 15.6 8 19.6 8 24c0 11 9 20 20 20v-4c-8.8 0-16-7.2-16-16z"
                      fill="#757575"
                    />
                    <path
                      d="M28 40l5-5-5-5v4c-6.6 0-12-5.4-12-12 0-2.4.7-4.6 2-6.5L15.1 12.6C13.2 15.8 12 19.7 12 24c0 8.8 7.2 16 16 16v4z"
                      fill="#BDBDBD"
                    />
                  </svg>
                </div>
                <span className="text-[7px] sm:text-[7.5px] font-bold text-slate-600 tracking-tight leading-none mt-0.5">
                  reCAPTCHA
                </span>
                <span className="text-[6px] sm:text-[6.5px] text-slate-400 leading-none mt-0.5">
                  Privacy - Terms
                </span>
              </div>
            </div>

            {/* Checkboxes from Image 1 (Sign Up Mode) */}
            {authMode === 'signup' && (
              <div className="space-y-1 text-[10px] sm:text-[11px] pt-0.5">
                <label className="flex items-start gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={promoConsent}
                    onChange={(e) => setPromoConsent(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 border-white/50 focus:ring-white accent-indigo-600 mt-0.5 shrink-0 cursor-pointer"
                  />
                  <span className="text-white font-medium leading-tight drop-shadow-xs">
                    Send me sms/email for promotional offers.
                  </span>
                </label>

                <label className="flex items-start gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsConsent}
                    onChange={(e) => setTermsConsent(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 border-white/50 focus:ring-white accent-indigo-600 mt-0.5 shrink-0 cursor-pointer"
                  />
                  <span className="text-white font-medium leading-tight drop-shadow-xs">
                    I agree to Terms &amp; Conditions.
                  </span>
                </label>
              </div>
            )}

            {/* Primary Action Button: SIGN UP / SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 sm:h-10 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white font-black text-xs tracking-wider uppercase shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 border border-white/30 mt-1"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'signup' ? 'SIGN UP' : 'SIGN IN'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </>
              )}
            </button>

            {/* CONTINUE WITH GOOGLE BUTTON (Image 1 - Functional Google OAuth) */}
            <button
              type="button"
              onClick={() => handleContinueWithGoogle()}
              className="w-full h-9 sm:h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs tracking-wider uppercase shadow-xs hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
            >
              <GoogleIcon />
              <span className="text-[#3c4043] font-black text-xs">CONTINUE WITH GOOGLE</span>
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-2.5 sm:mt-3.5 text-center">
            {authMode === 'signup' ? (
              <p className="text-xs text-pink-100 font-semibold drop-shadow-xs">
                Already Registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                  className="text-white font-black underline underline-offset-2 hover:text-pink-200 transition-colors cursor-pointer inline-block"
                >
                  Login Now
                </button>
              </p>
            ) : (
              <p className="text-xs text-pink-100 font-semibold drop-shadow-xs">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                  }}
                  className="text-white font-black underline underline-offset-2 hover:text-pink-200 transition-colors cursor-pointer inline-block"
                >
                  Sign Up Now
                </button>
              </p>
            )}

            {authMode === 'login' && (
              <div className="mt-1.5 sm:mt-2">
                <button
                  type="button"
                  onClick={() => setShowCoordinatorModal(true)}
                  className="text-[10px] sm:text-[11px] text-pink-200 hover:text-white font-bold underline transition-colors cursor-pointer"
                >
                  Don't have login credentials? Contact School Coordinator
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-2 sm:mt-3">
        <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold">
          © {new Date().getFullYear()} OlympiadHub Assessment Portal. All Rights Reserved.
        </p>
      </div>



      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#b93787] to-[#2355c8] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Verify Your Email
                  </h3>
                  <p className="text-xs text-white/80">
                    6-digit code sent to your email
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500 font-medium">
                  We sent a 6-digit verification code to
                </p>
                <p className="text-sm font-bold text-slate-800 font-mono bg-slate-100 py-1 px-3 rounded-lg inline-block border border-slate-200">
                  {pendingSignup?.email}
                </p>
              </div>

              {/* 6-Digit OTP Box inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono rounded-xl border-2 border-slate-300 focus:border-[#2355c8] focus:bg-blue-50/40 focus:outline-hidden transition-all shadow-xs"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Error display */}
              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* Submit Verification Button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading || otpDigits.join('').length < 6}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#b93787] to-[#2355c8] hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {otpLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center pt-1 border-t border-slate-100">
                {otpTimer > 0 ? (
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Resend code in <span className="font-bold font-mono text-slate-700">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
                  >
                    Didn't receive code? Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* School Coordinator & Helpdesk Modal */}
      {showCoordinatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 sm:p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    School Coordinator &amp; Support
                  </h3>
                  <p className="text-xs text-indigo-100 font-medium">
                    National Olympiad Examination Helpdesk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCoordinatorModal(false)}
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Info Box 1 */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs mt-0.5">
                  1
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900">
                    How to get your Login Credentials?
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Your unique Login ID (e.g. <span className="font-mono font-bold text-indigo-700">STU1001</span> or <span className="font-mono font-bold text-indigo-700">ADMIN001</span>) and password are issued directly by your registered school teacher or Olympiad in-charge.
                  </p>
                </div>
              </div>

              {/* Info Box 2 */}
              <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs mt-0.5">
                  2
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-900">
                    Forgot Password or Locked Account?
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    If you forgot your password or cannot access your account, your School Administrator can reset it instantly from their School Admin panel.
                  </p>
                </div>
              </div>

              {/* Direct Helpdesk Contacts */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  National Olympiad Support Lines
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:+919876543210"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-3 text-xs group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">Helpline Phone</p>
                      <p className="text-[11px] text-slate-500 font-mono">+91 98765 43210</p>
                    </div>
                  </a>

                  <a
                    href="mailto:support@skillriseolympiad.org"
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-3 text-xs group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">Email Support</p>
                      <p className="text-[11px] text-slate-500 truncate">support@skillrise.org</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowCoordinatorModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
