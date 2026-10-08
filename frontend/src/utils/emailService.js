// SkillRise Olympiad - Email Notification Service
// Sends verification OTP and Welcome emails with live serverless dispatch & interactive simulation

// Generate random 6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Dispatch OTP Verification Email
export const sendOtpEmail = async (email, otp) => {
  const cleanEmail = (email || '').trim();
  const payload = {
    type: 'otp',
    to: cleanEmail,
    subject: 'OTP for email verification on SkillRise Olympiad',
    otp: otp,
    appName: 'SkillRise Olympiad',
    timestamp: new Date().toISOString()
  };

  // Save to localStorage for email activity log
  try {
    const emailHistory = JSON.parse(localStorage.getItem('olympiadhub_email_history') || '[]');
    localStorage.setItem(
      'olympiadhub_email_history',
      JSON.stringify([payload, ...emailHistory.slice(0, 19)])
    );
  } catch (e) {}

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    return { success: true, otp, data };
  } catch (err) {
    console.info('Client email fallback active:', err);
    return { success: true, otp, simulated: true };
  }
};

// Dispatch Welcome Email with Credentials (matches Image 3)
export const sendWelcomeEmail = async ({ email, name, password, siteUrl }) => {
  const cleanEmail = (email || '').trim();
  const cleanName = (name || cleanEmail.split('@')[0] || 'Student').trim();
  const url = siteUrl || window.location.origin;

  const payload = {
    type: 'welcome',
    to: cleanEmail,
    name: cleanName,
    subject: 'Welcome to SkillRise Olympiad!',
    password: password,
    url: url,
    appName: 'SkillRise Olympiad',
    timestamp: new Date().toISOString()
  };

  // Save to localStorage for email activity log
  try {
    const emailHistory = JSON.parse(localStorage.getItem('olympiadhub_email_history') || '[]');
    localStorage.setItem(
      'olympiadhub_email_history',
      JSON.stringify([payload, ...emailHistory.slice(0, 19)])
    );
  } catch (e) {}

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    return { success: true, data };
  } catch (err) {
    console.info('Client welcome email fallback active:', err);
    return { success: true, simulated: true };
  }
};
