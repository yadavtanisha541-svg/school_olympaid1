// Vercel Serverless Function Handler for OlympiadHub API
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  const cleanUrl = url.replace(/^\/api/, '').split('?')[0];

  if (cleanUrl.includes('/auth/login')) {
    const isSuperAdmin = req.body?.login_id?.includes('admin') || req.body?.email?.includes('admin');
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'vercel_token_' + Date.now(),
        user: isSuperAdmin
          ? { id: 1, name: 'Super Administrator', email: 'admin@olympiadhub.com', role: 'superadmin', permissions: ['all'] }
          : { id: 2, name: 'Aarav Sharma', email: 'student@olympiadhub.com', role: 'student', class: 'Class 6', grade: 'Class 6' }
      }
    });
  }

  return res.status(200).json({
    success: true,
    message: 'OlympiadHub Vercel API Live',
    data: []
  });
}
