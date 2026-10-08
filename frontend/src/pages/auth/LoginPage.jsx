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
  Clock,
  Star,
  Reply,
  Forward,
  MailCheck,
  MailOpen,
  Settings,
  KeyRound,
  SendHorizontal,
  Server,
  Info,
  Save
} from 'lucide-react';
import { OlympiadHubLogo } from '../../components/OlympiadHubLogo';
import { GOOGLE_CLIENT_ID } from '../../config/googleConfig';
import {
  generateOtp,
  sendOtpEmail,
  sendWelcomeEmail,
  getEmailConfig,
  saveEmailConfig,
  isEmailConfigured,
  sendTestEmail
} from '../../utils/emailService';

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

  // Email Notification & Exact Gmail Preview Modal (matching Image 2 & Image 3)
  const [emailToast, setEmailToast] = useState(null); // { title, subtitle, type, otp, email, name, password }
  const [emailPreviewModal, setEmailPreviewModal] = useState(null); // { type: 'otp' | 'welcome', data: {} }

  // Real Email Service Configuration State
  const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);
  const [emailConfig, setEmailConfig] = useState(getEmailConfig());
  const [emailDeliveryNotice, setEmailDeliveryNotice] = useState(null); // { type: 'success' | 'warning' | 'error', message: '' }
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testStatus, setTestStatus] = useState(null); // { success: boolean, message: string }
  const [testingEmail, setTestingEmail] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configActiveTab, setConfigActiveTab] = useState('gmail'); // 'gmail' | 'brevo' | 'emailjs'
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  // Save email configuration to localStorage and environment endpoint
  const handleSaveEmailConfig = async () => {
    setSavingConfig(true);
    saveEmailConfig(emailConfig);
    try {
      await fetch('/api/save-email-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig)
      });
    } catch (e) {}
    setSavingConfig(false);
    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 3000);
  };

  // Test real email delivery to an entered email address
  const handleTestEmailSend = async () => {
    const target = (testEmailAddress || identifier || '').trim();
    if (!target) {
      setTestStatus({ success: false, message: 'Please enter a valid recipient email address to test.' });
      return;
    }
    setTestingEmail(true);
    setTestStatus(null);
    try {
      const res = await sendTestEmail(target, emailConfig);
      if (res.success) {
        setTestStatus({
          success: true,
          message: `Success! Real test email delivered to ${target}. Please check your Gmail inbox or spam folder.`
        });
      } else {
        setTestStatus({
          success: false,
          message: res.error || res.message || 'Delivery failed. Please check your credentials or 16-character App Password.'
        });
      }
    } catch (err) {
      setTestStatus({ success: false, message: err.message || 'Network error while contacting email service.' });
    } finally {
      setTestingEmail(false);
    }
  };

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

  // Auto-dismiss floating email toast after 12s
  useEffect(() => {
    if (emailToast) {
      const timer = setTimeout(() => {
        setEmailToast(null);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [emailToast]);

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
        const sendResult = await sendOtpEmail(cleanId, newOtp);

        if (sendResult?.realSent) {
          setEmailDeliveryNotice({
            type: 'success',
            message: `Real verification OTP delivered to ${cleanId}! Please check your Gmail inbox or spam folder.`
          });
          setEmailToast({
            title: 'OTP sent to your Gmail inbox!',
            subtitle: `Delivered to ${cleanId} via ${sendResult.provider || 'Email Service'}`,
            type: 'otp',
            otp: newOtp,
            email: cleanId
          });
        } else if (sendResult?.notConfigured) {
          setEmailDeliveryNotice({
            type: 'warning',
            message: `Real email delivery is not configured yet. To receive OTP in your actual Gmail inbox, click 'Setup Real Email Delivery' above. For quick testing, your OTP is ${newOtp}.`
          });
          setEmailToast({
            title: 'Real Email Setup Needed',
            subtitle: `Connect Gmail or Brevo in 1 minute to receive email directly`,
            type: 'otp',
            otp: newOtp,
            email: cleanId
          });
        } else {
          setEmailDeliveryNotice({
            type: 'error',
            message: sendResult?.error || 'Failed to dispatch email. Please check your credentials in Email Setup.'
          });
        }
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

  // Verify OTP and complete registration -> Dispatch Welcome Email (matching Image 3)
  const handleVerifyOtp = async () => {
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setOtpError('Incorrect verification code. Please check your email or copy from preview.');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    try {
      // Register & Login user via AuthContext
      const userObj = await login(pendingSignup.email, pendingSignup.password);

      // Dispatch Welcome Email with Credentials (matching Image 3)
      await sendWelcomeEmail({
        email: pendingSignup.email,
        name: userObj?.name || pendingSignup.email.split('@')[0],
        password: pendingSignup.password,
        siteUrl: window.location.origin
      });

      // Show Welcome Toast Notification
      setEmailToast({
        title: 'Welcome to SkillRise Olympiad!',
        subtitle: `Account details sent to ${pendingSignup.email}`,
        type: 'welcome',
        email: pendingSignup.email,
        name: userObj?.name || pendingSignup.email.split('@')[0],
        password: pendingSignup.password
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

    setEmailToast({
      title: 'New OTP Code Sent!',
      subtitle: `New verification code sent to ${pendingSignup.email}`,
      type: 'otp',
      otp: newOtp,
      email: pendingSignup.email
    });
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

      {/* Top Header Navigation: Back to Website & Email Setup */}
      <div className="w-full max-w-[390px] mx-auto flex items-center justify-between relative z-20 mb-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all cursor-pointer group active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>← Back to Website</span>
        </button>

        <button
          type="button"
          onClick={() => setShowEmailConfigModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 ${
            isEmailConfigured()
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
          title="Configure real email delivery service (Gmail App Password or Brevo)"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>{isEmailConfigured() ? 'Email: Active' : 'Setup Real Email'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              isEmailConfigured() ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
            }`}
          />
        </button>
      </div>

      {/* Center Auth Card with Rich Pink -> Purple -> Blue Brand Gradient (Compact Proportioned Height) */}
      <div className="w-full max-w-[390px] relative z-10 my-auto bg-gradient-to-b from-[#b93787] via-[#6e32a0] to-[#2355c8] rounded-[26px] p-4 sm:p-5 shadow-2xl border-2 border-white/30 text-white">
        {/* Branding Header */}
        <div className="text-center mb-3 flex flex-col items-center">
          <div
            className="mb-1 transform hover:scale-105 transition-transform duration-200 cursor-pointer p-1.5 rounded-xl bg-white/95 shadow-md"
            onClick={handleGoHome}
            title="Go to Home"
          >
            <OlympiadHubLogo size="sm" />
          </div>
          <p className="mt-0.5 text-[11px] text-pink-100 font-bold tracking-tight drop-shadow-xs">
            National Online Examination &amp; Assessment System
          </p>

          {/* Clean Segmented Tabs: Sign Up vs Login */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-black/25 backdrop-blur-md rounded-xl border border-white/20 mt-2.5 w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
              className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
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
              className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
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
          <form className="space-y-2.5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/95 border border-white/30 text-white text-[11px] font-bold flex items-start gap-2 animate-shake shadow-md">
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
                  className="block w-full px-3.5 h-10 bg-white text-slate-900 placeholder-slate-500 border border-white/60 focus:border-indigo-400 focus:ring-2 focus:ring-white/30 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
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
                  className="block w-full px-3.5 h-10 bg-white text-slate-900 placeholder-slate-500 border border-white/60 focus:border-indigo-400 focus:ring-2 focus:ring-white/30 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
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
                    className="block w-full px-3.5 h-10 bg-white text-slate-900 placeholder-slate-500 border border-white/60 focus:border-indigo-400 focus:ring-2 focus:ring-white/30 rounded-xl text-xs font-bold transition-all focus:outline-none shadow-xs"
                    required
                  />
                </div>
              </div>
            )}

            {/* Checkbox: Show Password */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
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
            <div className="bg-[#f9f9f9] border border-[#d3d3d3] rounded-xl py-1.5 px-3 flex items-center justify-between shadow-2xs select-none">
              <div
                onClick={handleCaptchaClick}
                className="flex items-center gap-2.5 cursor-pointer group flex-1 py-0.5"
                title={captchaStatus === 'verified' ? 'Click to uncheck' : 'Click to verify'}
              >
                {/* Checkbox Box */}
                <div
                  className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center shadow-2xs shrink-0 ${
                    captchaStatus === 'verified'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-[#c1c1c1] group-hover:border-[#999] bg-white text-transparent'
                  }`}
                >
                  {captchaStatus === 'checking' && (
                    <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {captchaStatus === 'verified' && (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] animate-in zoom-in-75 duration-150" />
                  )}
                </div>

                <span className="text-xs font-bold text-slate-800 group-hover:text-black transition-colors">
                  I'm not a robot
                </span>
              </div>

              {/* Official reCAPTCHA Badge */}
              <div className="flex flex-col items-center justify-center pl-2.5 border-l border-slate-200 shrink-0">
                <div className="w-5 h-5 relative flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
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
                <span className="text-[7.5px] font-bold text-slate-600 tracking-tight leading-none mt-0.5">
                  reCAPTCHA
                </span>
                <span className="text-[6.5px] text-slate-400 leading-none mt-0.5">
                  Privacy - Terms
                </span>
              </div>
            </div>

            {/* Checkboxes from Image 1 (Sign Up Mode) */}
            {authMode === 'signup' && (
              <div className="space-y-1 text-[11px] pt-0.5">
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
              className="w-full h-10 sm:h-10.5 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white font-black text-xs tracking-wider uppercase shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 border border-white/30 mt-1"
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
              className="w-full h-10 sm:h-10.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs tracking-wider uppercase shadow-xs hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-slate-200"
            >
              <GoogleIcon />
              <span className="text-[#3c4043] font-black text-xs">CONTINUE WITH GOOGLE</span>
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-3.5 text-center">
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
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowCoordinatorModal(true)}
                  className="text-[11px] text-pink-200 hover:text-white font-bold underline transition-colors cursor-pointer"
                >
                  Don't have login credentials? Contact School Coordinator
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-3">
        <p className="text-[11px] text-slate-500 font-bold">
          © {new Date().getFullYear()} OlympiadHub Assessment Portal. All Rights Reserved.
        </p>
      </div>



      {/* Floating Gmail Toast Notification */}
      {emailToast && (
        <div className="fixed top-5 right-5 z-[70] max-w-sm w-full bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 animate-slideDown flex items-start gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {emailToast.type === 'otp' ? 'Gmail: New OTP Received' : 'Gmail: Welcome Email'}
              </p>
              <button
                type="button"
                onClick={() => setEmailToast(null)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 font-medium mt-1 truncate">
              {emailToast.title}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {emailToast.subtitle}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmailPreviewModal({
                    type: emailToast.type,
                    data: emailToast
                  });
                  setEmailToast(null);
                }}
                className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <MailOpen className="w-3.5 h-3.5" />
                Open Email
              </button>
              {emailToast.otp && (
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold rounded-lg transition-all border border-white/10 cursor-pointer"
                >
                  Fill {emailToast.otp}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal (matching Image 1 & 2 flow) */}
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

              {/* Delivery notice banner */}
              {emailDeliveryNotice && (
                <div
                  className={`p-3 rounded-2xl text-xs space-y-1.5 border animate-fadeIn ${
                    emailDeliveryNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : emailDeliveryNotice.type === 'warning'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {emailDeliveryNotice.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <p className="leading-relaxed font-medium">{emailDeliveryNotice.message}</p>
                  </div>
                  {emailDeliveryNotice.type === 'warning' && (
                    <button
                      type="button"
                      onClick={() => setShowEmailConfigModal(true)}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Setup Gmail / Brevo for Real Email</span>
                    </button>
                  )}
                </div>
              )}

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

              {/* Quick Auto-fill testing helper */}
              {generatedOtp && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-indigo-900 font-medium">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Demo OTP: <strong className="font-mono tracking-widest text-indigo-700">{generatedOtp}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Auto Fill
                  </button>
                </div>
              )}

              {/* Open Exact Gmail Preview Trigger */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmailPreviewModal({
                      type: 'otp',
                      data: {
                        otp: generatedOtp,
                        email: pendingSignup?.email
                      }
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer transition-colors"
                >
                  <MailOpen className="w-4 h-4 text-blue-600" />
                  View Email in Gmail format (Image 2)
                </button>
              </div>

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

      {/* Interactive Gmail Email Preview Modal (Exactly matching Image 2 & Image 3) */}
      {emailPreviewModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gmail Mobile Topbar */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEmailPreviewModal(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Gmail Inbox
                  </p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                    {emailPreviewModal.type === 'otp'
                      ? 'OTP for email verification on SOF Olympiad Trainer'
                      : 'Welcome to SOF Olympiad Trainer!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Star email"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEmailPreviewModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Email Subject Line & Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {emailPreviewModal.type === 'otp'
                  ? 'OTP for email verification on SOF Olympiad Trainer'
                  : 'Welcome to SOF Olympiad Trainer!'}
              </h2>

              {/* Sender & Recipient row */}
              <div className="flex items-start gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  SOF
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      SOF Olympiad Trainer
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    to {emailPreviewModal.data?.email || pendingSignup?.email || identifier || 'me'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-4 sm:p-6 bg-white max-h-[70vh] overflow-y-auto space-y-4">
              {emailPreviewModal.type === 'otp' ? (
                /* ----------------- IMAGE 2 RECREATION: OTP EMAIL ----------------- */
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 text-center">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                      Code Requested
                    </h3>
                  </div>

                  {/* 6 Big Spaced Digits (matching Image 2) */}
                  <div className="py-2">
                    <div className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-slate-800/80 px-4 sm:px-6 py-3 rounded-2xl border border-slate-700">
                      {(emailPreviewModal.data?.otp || generatedOtp || '123779')
                        .split('')
                        .map((char, i) => (
                          <span
                            key={i}
                            className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white"
                          >
                            {char}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Copy Code Button (matching Image 2) */}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        const code = emailPreviewModal.data?.otp || generatedOtp;
                        if (code) {
                          navigator.clipboard.writeText(code);
                          setCopiedOtp(true);
                          setTimeout(() => setCopiedOtp(false), 2000);
                          // Also auto fill in modal
                          setOtpDigits(code.split(''));
                        }
                      }}
                      className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                    >
                      {copiedOtp ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Code Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Text statement matching user screenshot */}
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    <strong className="text-white font-mono font-bold">
                      {emailPreviewModal.data?.otp || generatedOtp}
                    </strong>{' '}
                    is your OTP for email verification on SOF Olympiad Trainer.
                  </p>

                  <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                    <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                  </div>
                </div>
              ) : (
                /* ----------------- IMAGE 3 RECREATION: WELCOME EMAIL ----------------- */
                <div className="space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-2xl text-white shadow-sm">
                    <h3 className="text-base sm:text-lg font-black tracking-tight">
                      Welcome to SOF Olympiad Trainer!
                    </h3>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Your registered account is ready to use
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    Hi {emailPreviewModal.data?.name || 'Student'},
                  </p>

                  <p className="text-slate-700">
                    Welcome aboard and thanks for signing up! We are so glad to have you with us.
                  </p>

                  {/* Login Credentials Box (matching Image 3) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <p className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Your Login Information
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-1">
                        <span className="text-slate-500 font-medium">Portal URL:</span>
                        <span className="font-mono font-bold text-blue-600 truncate">
                          {window.location.origin}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-1">
                        <span className="text-slate-500 font-medium">User Name / Email:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {emailPreviewModal.data?.email || pendingSignup?.email || identifier}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-500 font-medium">Password:</span>
                        <span className="font-mono font-bold text-indigo-700">
                          {emailPreviewModal.data?.password || password || '••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Study packages note (matching Image 3) */}
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                    <p className="font-bold">Access Activated:</p>
                    <p className="text-slate-700">
                      You can now purchase and access Chapterwise Practice tests, Mock tests, and Previous Years Papers on your student dashboard.
                    </p>
                  </div>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <p>Best regards,</p>
                    <p className="font-bold text-slate-900">The SOF Olympiad Trainer Team</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer with Close & Action */}
            <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              {emailPreviewModal.type === 'otp' && (
                <button
                  type="button"
                  onClick={() => {
                    handleAutoFillOtp();
                    setEmailPreviewModal(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Apply Code to Verification Box
                </button>
              )}
              {emailPreviewModal.type === 'welcome' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmailPreviewModal(null);
                    handleGoHome();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Go to Student Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={() => setEmailPreviewModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer ml-auto"
              >
                Close Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Email Delivery Setup Modal */}
      {showEmailConfigModal && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-auto animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                    Real Email Delivery Setup
                    {isEmailConfigured() ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40">
                        Setup Required
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-blue-100">
                    Send real OTP and Welcome emails directly to student's Gmail
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailConfigModal(false)}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto text-xs sm:text-sm">
              {/* Notice */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-xs text-blue-800">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  Real Gmail par email bhejne ke liye:
                </p>
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  Internet par kisi bhi student ke asli Gmail inbox me email deliver karne ke liye niche diya gaya <strong>Option 1 (Gmail App Password)</strong> sabse aasan aur 100% free hai (500 emails/day).
                </p>
              </div>

              {/* Provider Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setConfigActiveTab('gmail')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    configActiveTab === 'gmail'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gmail (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setConfigActiveTab('brevo')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    configActiveTab === 'brevo'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Brevo API
                </button>
                <button
                  type="button"
                  onClick={() => setConfigActiveTab('emailjs')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    configActiveTab === 'emailjs'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EmailJS
                </button>
              </div>

              {/* TAB 1: GMAIL APP PASSWORD */}
              {configActiveTab === 'gmail' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-slate-800">1-Minute Quick Guide:</p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                      <li>Apne Google Account me 2-Step Verification ON rakhein.</li>
                      <li>
                        Google App Passwords open karein:{' '}
                        <a
                          href="https://myaccount.google.com/apppasswords"
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 underline inline-flex items-center gap-0.5 ml-1"
                        >
                          myaccount.google.com/apppasswords
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </li>
                      <li>App Name me <strong className="text-slate-900">OlympiadHub</strong> likhkar <strong>Create</strong> dabayein.</li>
                      <li>Google ek 16-character ka password dega (jaise: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">abcd efgh ijkl mnop</span>), use yaha paste karein:</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Gmail Address:
                      </label>
                      <input
                        type="email"
                        value={emailConfig.gmailUser || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            gmailUser: e.target.value,
                            provider: 'gmail_smtp'
                          }))
                        }
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Google 16-Digit App Password:
                      </label>
                      <input
                        type="password"
                        value={emailConfig.gmailAppPassword || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            gmailAppPassword: e.target.value,
                            provider: 'gmail_smtp'
                          }))
                        }
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BREVO API */}
              {configActiveTab === 'brevo' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">Brevo (Sendinblue) Setup:</p>
                    <p className="text-[11px] leading-relaxed">
                      Brevo provides 300 free emails per day to ANY recipient. Sign up for free at{' '}
                      <a
                        href="https://www.brevo.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-600 underline inline-flex items-center gap-0.5"
                      >
                        brevo.com
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>{' '}
                      and copy your API Key from SMTP &amp; API tab.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Brevo API Key (starts with xkeysib-):
                      </label>
                      <input
                        type="password"
                        value={emailConfig.brevoApiKey || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            brevoApiKey: e.target.value,
                            provider: 'brevo'
                          }))
                        }
                        placeholder="xkeysib-..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Sender Email:
                      </label>
                      <input
                        type="email"
                        value={emailConfig.brevoSenderEmail || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            brevoSenderEmail: e.target.value,
                            provider: 'brevo'
                          }))
                        }
                        placeholder="sender@yourdomain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EMAILJS */}
              {configActiveTab === 'emailjs' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-600">
                    <p className="font-bold text-slate-800">EmailJS Setup:</p>
                    <p className="text-[11px] leading-relaxed">
                      Sends emails directly from browser using{' '}
                      <a
                        href="https://www.emailjs.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-600 underline inline-flex items-center gap-0.5"
                      >
                        emailjs.com
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>{' '}
                      (200 free emails/month).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Service ID:
                      </label>
                      <input
                        type="text"
                        value={emailConfig.emailjsServiceId || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            emailjsServiceId: e.target.value,
                            provider: 'emailjs'
                          }))
                        }
                        placeholder="service_xxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Template ID:
                      </label>
                      <input
                        type="text"
                        value={emailConfig.emailjsTemplateId || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            emailjsTemplateId: e.target.value,
                            provider: 'emailjs'
                          }))
                        }
                        placeholder="template_xxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Public Key:
                      </label>
                      <input
                        type="text"
                        value={emailConfig.emailjsPublicKey || ''}
                        onChange={(e) =>
                          setEmailConfig((prev) => ({
                            ...prev,
                            emailjsPublicKey: e.target.value,
                            provider: 'emailjs'
                          }))
                        }
                        placeholder="publicKey_xxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* LIVE TEST SECTION */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <SendHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  Live Delivery Test
                </p>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Enter your email to receive a test OTP"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-xs text-slate-800 font-mono shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleTestEmailSend}
                    disabled={testingEmail}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
                  >
                    {testingEmail ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Test</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Status feedback */}
                {testStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2 border animate-fadeIn ${
                      testStatus.success
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-red-50 text-red-900 border-red-200'
                    }`}
                  >
                    {testStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed font-medium">{testStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              {configSavedNotice ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Settings saved &amp; active!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">
                  Settings are saved locally &amp; to server
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailConfigModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveEmailConfig}
                  disabled={savingConfig}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  {savingConfig ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Configuration</span>
                </button>
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
