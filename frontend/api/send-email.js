// Vercel Serverless Function: Email Dispatcher for OTP & Welcome Emails
// Supports Gmail SMTP (via nodemailer), Brevo API, and Resend

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

  const { type, to, subject, otp, name, password, url, config = {} } = req.body || {};

  if (!to) {
    return res.status(400).json({ success: false, message: 'Recipient email is required' });
  }

  const otpHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background-color: #121212; color: #ffffff; border-radius: 16px;">
      <div style="text-align: left; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 8px;">OTP for email verification on SkillRise Olympiad</h2>
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">SkillRise Olympiad Team &bull; Verification Code</p>
      </div>
      <div style="background-color: #1e1e1e; border: 1px solid #333333; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Code Requested</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #ffffff; font-family: monospace; background: #000000; padding: 12px 20px; border-radius: 8px; border: 1px solid #3f3f46; display: inline-block;">
          ${otp || '123779'}
        </div>
      </div>
      <p style="font-size: 15px; color: #e4e4e7; line-height: 1.6; margin: 0 0 20px;">
        <strong>${otp || '123779'}</strong> is your OTP for email verification on SkillRise Olympiad.
      </p>
      <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
      <p style="font-size: 11px; color: #71717a; margin: 0;">
        This OTP is valid for 10 minutes. If you did not request this verification code, please ignore this email.
      </p>
    </div>
  `;

  const welcomeHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background-color: #0f172a; color: #ffffff; border-radius: 16px;">
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px;">Welcome to SkillRise Olympiad!</h1>
        <h3 style="font-size: 16px; font-weight: 700; color: #38bdf8; margin: 0;">Hi ${name || 'Student'}</h3>
      </div>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px;">
        Welcome aboard and thanks for signing up! We are so glad to have you with us.
      </p>
      <div style="background-color: #1e293b; border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
        <p style="font-size: 13px; font-weight: 700; color: #f1f5f9; margin: 0 0 12px;">Your Login Information:</p>
        <p style="font-size: 13px; color: #e2e8f0; margin: 6px 0;"><strong>URL:</strong> <a href="${url || 'https://school-olympaid1.vercel.app'}" style="color: #60a5fa;">${url || 'https://school-olympaid1.vercel.app'}</a></p>
        <p style="font-size: 13px; color: #e2e8f0; margin: 6px 0;"><strong>User Name:</strong> <span style="color: #facc15; font-weight: 700;">${to}</span></p>
        <p style="font-size: 13px; color: #e2e8f0; margin: 6px 0;"><strong>Password:</strong> <span style="background: #334155; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #34d399; font-weight: 700;">${password || '••••••••'}</span></p>
      </div>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px;">
        You can now purchase and access Chapterwise Practice tests, Mock tests, and Previous Years Papers on your student dashboard.
      </p>
      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #334155;">
        <p style="font-size: 13px; color: #94a3b8; margin: 0;">Best regards,</p>
        <p style="font-size: 14px; font-weight: 700; color: #f8fafc; margin: 4px 0 0;">SkillRise Olympiad Team</p>
      </div>
    </div>
  `;

  const emailSubject = subject || (type === 'otp' ? 'OTP for email verification on SkillRise Olympiad' : 'Welcome to SkillRise Olympiad!');
  const htmlContent = type === 'otp' ? otpHtml : welcomeHtml;

  // 1. Check Gmail SMTP via Nodemailer
  const gmailUser = config.gmailUser || process.env.GMAIL_USER || process.env.VITE_GMAIL_USER || 'taniisha2708@gmail.com';
  const gmailAppPassword = (config.gmailAppPassword || process.env.GMAIL_APP_PASSWORD || process.env.VITE_GMAIL_APP_PASSWORD || 'cygoixjyhisyciaa').replace(/\s+/g, '');

  if (gmailUser && gmailAppPassword) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword
        }
      });
      await transporter.sendMail({
        from: `"SkillRise Olympiad" <${gmailUser}>`,
        to,
        subject: emailSubject,
        html: htmlContent
      });
      return res.status(200).json({ success: true, provider: 'gmail_smtp', message: `Real email dispatched to ${to}` });
    } catch (smtpErr) {
      console.error('Nodemailer SMTP Error:', smtpErr);
      return res.status(500).json({ success: false, provider: 'gmail_smtp', error: smtpErr.message });
    }
  }

  // 2. Check Brevo API
  const brevoApiKey = config.brevoApiKey || process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
  const brevoSenderEmail = config.brevoSenderEmail || process.env.BREVO_SENDER_EMAIL || process.env.VITE_BREVO_SENDER_EMAIL || gmailUser || 'noreply@skillriseolympiad.org';

  if (brevoApiKey) {
    try {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'SkillRise Olympiad', email: brevoSenderEmail },
          to: [{ email: to }],
          subject: emailSubject,
          htmlContent: htmlContent
        })
      });
      const brevoData = await brevoRes.json();
      if (brevoRes.ok) {
        return res.status(200).json({ success: true, provider: 'brevo', data: brevoData });
      } else {
        return res.status(400).json({ success: false, provider: 'brevo', error: brevoData.message || 'Brevo dispatch error' });
      }
    } catch (brevoErr) {
      console.error('Brevo API Error:', brevoErr);
      return res.status(500).json({ success: false, provider: 'brevo', error: brevoErr.message });
    }
  }

  // 3. Check Resend API
  const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
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
          subject: emailSubject,
          html: htmlContent
        })
      });
      const resendData = await resendRes.json();
      if (resendRes.ok) {
        return res.status(200).json({ success: true, provider: 'resend', data: resendData });
      } else {
        return res.status(400).json({ success: false, provider: 'resend', error: resendData.message || 'Resend error' });
      }
    } catch (resendErr) {
      console.error('Resend API Error:', resendErr);
      return res.status(500).json({ success: false, provider: 'resend', error: resendErr.message });
    }
  }

  return res.status(200).json({
    success: false,
    notConfigured: true,
    message: 'No email service credentials configured. Please configure Gmail App Password or Brevo API Key.'
  });
}
