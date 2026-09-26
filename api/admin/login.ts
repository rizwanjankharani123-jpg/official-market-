import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ override: true });

export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 405;
    return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD) : '';
  const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    return res.end(JSON.stringify({
      success: false,
      message: 'Server configuration error: Administrator credentials are not configured in environment variables.'
    }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  if (!body && req.on) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (c: any) => { data += c; });
      req.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
      req.on('error', () => resolve({}));
    });
  }

  const { email, password } = body || {};
  if (!email || !password) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    return res.end(JSON.stringify({ success: false, message: 'Invalid admin credentials' }));
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const providedPassword = String(password);

  // Secure comparison
  const emailMatch = normalizedEmail === ADMIN_EMAIL;
  let passwordMatch = false;
  if (providedPassword.length === ADMIN_PASSWORD.length) {
    passwordMatch = crypto.timingSafeEqual(Buffer.from(providedPassword), Buffer.from(ADMIN_PASSWORD));
  }

  if (!emailMatch || !passwordMatch) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    return res.end(JSON.stringify({ success: false, message: 'Invalid admin credentials' }));
  }

  // Generate cryptographically secure HMAC-SHA256 session token (12h validity)
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = { email: ADMIN_EMAIL, expiresAt, nonce };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  const token = `${payloadBase64}.${signature}`;

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  return res.end(JSON.stringify({
    success: true,
    token,
    email: ADMIN_EMAIL,
    expiresAt
  }));
}
