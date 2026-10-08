// SkillRise Olympiad - Real Multi-Provider Email Service
// Supports: Gmail SMTP (via Nodemailer), Brevo API, EmailJS, and Resend

import emailjs from '@emailjs/browser';

const STORAGE_KEY = 'olympiadhub_email_config';

// Retrieve saved email configuration
export const getEmailConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}

  return {
    provider: import.meta.env.VITE_EMAIL_PROVIDER || 'gmail_smtp', // 'gmail_smtp' | 'brevo' | 'emailjs' | 'resend'
    gmailUser: import.meta.env.VITE_GMAIL_USER || 'taniisha2708@gmail.com',
    gmailAppPassword: import.meta.env.VITE_GMAIL_APP_PASSWORD || 'cygoixjyhisyciaa',
    brevoApiKey: import.meta.env.VITE_BREVO_API_KEY || '',
    brevoSenderEmail: import.meta.env.VITE_BREVO_SENDER_EMAIL || '',
    emailjsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    emailjsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    emailjsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
    resendApiKey: import.meta.env.VITE_RESEND_API_KEY || ''
  };
};

// Persist email configuration to localStorage
export const saveEmailConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    return false;
  }
};

// Check if any real email delivery method is configured
export const isEmailConfigured = () => {
  const config = getEmailConfig();
  if (config.gmailUser && config.gmailAppPassword) return true;
  if (config.brevoApiKey) return true;
  if (config.emailjsServiceId && config.emailjsTemplateId && config.emailjsPublicKey) return true;
  if (config.resendApiKey) return true;
  return false;
};

// Generate random 6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Verification Email
export const sendOtpEmail = async (email, otp) => {
  const cleanEmail = (email || '').trim();
  const config = getEmailConfig();

  // Try direct EmailJS browser dispatch if configured
  if (config.provider === 'emailjs' && config.emailjsServiceId && config.emailjsPublicKey) {
    try {
      await emailjs.send(
        config.emailjsServiceId,
        config.emailjsTemplateId,
        {
          to_email: cleanEmail,
          email: cleanEmail,
          otp: otp,
          passcode: otp,
          subject: 'OTP for email verification on SkillRise Olympiad',
          message: `${otp} is your OTP for email verification on SkillRise Olympiad.`
        },
        config.emailjsPublicKey
      );
      return { success: true, realSent: true, provider: 'emailjs', otp };
    } catch (ejsErr) {
      console.warn('EmailJS browser dispatch error:', ejsErr);
    }
  }

  const payload = {
    type: 'otp',
    to: cleanEmail,
    subject: 'OTP for email verification on SkillRise Olympiad',
    otp: otp,
    config: config,
    appName: 'SkillRise Olympiad',
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);

    if (data?.success) {
      return { success: true, realSent: true, provider: data.provider, otp, data };
    }

    if (data?.notConfigured) {
      return { success: false, notConfigured: true, message: data.message, otp };
    }

    return {
      success: false,
      error: data?.error || data?.message || 'Failed to dispatch email',
      otp
    };
  } catch (err) {
    console.error('Email API dispatch error:', err);
    return {
      success: false,
      error: err.message || 'Network error while contacting email service',
      otp
    };
  }
};

// Send Welcome Email with Credentials
export const sendWelcomeEmail = async ({ email, name, password, siteUrl }) => {
  const cleanEmail = (email || '').trim();
  const cleanName = (name || cleanEmail.split('@')[0] || 'Student').trim();
  const url = siteUrl || window.location.origin;
  const config = getEmailConfig();

  // Try direct EmailJS browser dispatch
  if (config.provider === 'emailjs' && config.emailjsServiceId && config.emailjsPublicKey) {
    try {
      await emailjs.send(
        config.emailjsServiceId,
        config.emailjsTemplateId,
        {
          to_email: cleanEmail,
          name: cleanName,
          password: password,
          url: url,
          subject: 'Welcome to SkillRise Olympiad!',
          message: `Welcome aboard! Your login credentials: URL: ${url}, User: ${cleanEmail}, Password: ${password}`
        },
        config.emailjsPublicKey
      );
      return { success: true, realSent: true, provider: 'emailjs' };
    } catch (e) {}
  }

  const payload = {
    type: 'welcome',
    to: cleanEmail,
    name: cleanName,
    subject: 'Welcome to SkillRise Olympiad!',
    password: password,
    url: url,
    config: config,
    appName: 'SkillRise Olympiad',
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    return data || { success: false };
  } catch (err) {
    console.error('Welcome email dispatch error:', err);
    return { success: false, error: err.message };
  }
};

// Send a test email to verify credentials
export const sendTestEmail = async (targetEmail, customConfig = null) => {
  const testOtp = generateOtp();
  const config = customConfig || getEmailConfig();

  const payload = {
    type: 'otp',
    to: (targetEmail || '').trim(),
    subject: 'Test Email - SkillRise Olympiad Delivery Check',
    otp: testOtp,
    config: config
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
};
