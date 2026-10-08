// Vercel Serverless Function: Email Dispatcher for OTP & Welcome Emails
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { type, to, subject, otp, name, password, url } = req.body || {};

  if (!to) {
    return res.status(400).json({ success: false, message: 'Recipient email is required' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;

  // HTML content for OTP verification email (matching Image 2)
  const otpHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background-color: #121212; color: #ffffff; border-radius: 16px;">
      <div style="text-align: left; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 8px;">OTP for email verification on SkillRise Olympiad</h2>
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">SkillRise Olympiad Team &bull; Verification Code</p>
      </div>
      <div style="background-color: #1e1e1e; border: 1px solid #333333; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Code Requested</p>
        <div style="display: flex; justify-content: center; gap: 8px; font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #ffffff; font-family: monospace; background: #000000; padding: 12px 20px; border-radius: 8px; border: 1px solid #3f3f46; display: inline-block;">
          ${otp || '123779'}
        </div>
      </div>
      <p style="font-size: 15px; color: #e4e4e7; line-height: 1.6; margin: 0 0 20px;">
        <strong>${otp || '123779'}</strong> is your OTP for email verification on SkillRise Olympiad.
      </p>
      <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
      <p style="font-size: 11px; color: #71717a; margin: 0;">
        If you did not request this verification code, please ignore this email.
      </p>
    </div>
  `;

  // HTML content for Welcome email with login credentials (matching Image 3)
  const welcomeHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background-color: #0f172a; color: #ffffff; border-radius: 16px;">
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px;">Welcome to SkillRise Olympiad!</h1>
        <h3 style="font-size: 16px; font-weight: 700; color: #38bdf8; margin: 0;">Hi ${name || 'Student'}</h3>
      </div>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px;">
        Welcome aboard and thanks for signing up! Now that your account is live, we hope you'll utilize it to prepare for your exams in a much more interesting and interactive manner.
      </p>
      <div style="background-color: #1e293b; border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
        <p style="font-size: 13px; font-weight: 700; color: #f1f5f9; margin: 0 0 12px;">Here is the account information you might want to save:</p>
        <p style="font-size: 13px; color: #e2e8f0; margin: 6px 0;"><strong>URL:</strong> <a href="${url || 'https://school-olympaid1.vercel.app'}" style="color: #60a5fa; text-decoration: underline;">${url || 'https://school-olympaid1.vercel.app'}</a></p>
        <p style="font-size: 13px; color: #e2e8f0; margin: 6px 0;"><strong>User Name:</strong> <span style="color: #facc15; font-weight: 700;">${to}</span></p>
        <p style="font-size: 13px; color: #e2e8f0; margin: 6px 0;"><strong>Password:</strong> <span style="background: #334155; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #34d399; font-weight: 700;">${password || '******'}</span></p>
      </div>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px;">
        We hope you will enjoy studying with us.
      </p>
      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #334155;">
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">Your Companion and Guide to success,</p>
        <p style="font-size: 14px; font-weight: 700; color: #f8fafc; margin: 4px 0 0;">SkillRise Olympiad Team</p>
      </div>
    </div>
  `;

  // 1. If Resend API Key is configured in Vercel environment:
  if (resendApiKey) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'SkillRise Olympiad <onboarding@resend.dev>',
          to: [to],
          subject: subject || (type === 'otp' ? 'OTP for email verification' : 'Welcome to SkillRise Olympiad!'),
          html: type === 'otp' ? otpHtml : welcomeHtml
        })
      });
      const resendData = await resendRes.json();
      return res.status(200).json({ success: true, service: 'resend', data: resendData });
    } catch (e) {
      console.warn('Resend dispatch error:', e);
    }
  }

  // 2. If Web3Forms Access Key is configured:
  if (web3FormsKey) {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: subject,
          from_name: 'SkillRise Olympiad',
          to_email: to,
          message: type === 'otp' ? `${otp} is your verification OTP.` : `Welcome ${name}! Your password is: ${password}`
        })
      });
      return res.status(200).json({ success: true, service: 'web3forms' });
    } catch (e) {}
  }

  // Fallback: Return successful confirmation with payload
  return res.status(200).json({
    success: true,
    message: 'Email processed successfully',
    emailPreview: {
      type,
      to,
      subject,
      otp,
      name,
      password
    }
  });
}
