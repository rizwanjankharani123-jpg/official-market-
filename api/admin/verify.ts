import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ override: true });

export default function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
  const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';

  if (!ADMIN_EMAIL || !ADMIN_SECRET) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    return res.end(JSON.stringify({
      valid: false,
      message: 'Server configuration error: Administrator credentials are not configured in environment variables.'
    }));
  }

  // Extract Bearer token
  let token: string | null = null;
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }
  if (!token && req.query?.token) {
    token = String(req.query.token);
  }

  if (!token) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    return res.end(JSON.stringify({ valid: false, message: 'No active session token provided' }));
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    return res.end(JSON.stringify({ valid: false, message: 'Invalid token structure' }));
  }

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    return res.end(JSON.stringify({ valid: false, message: 'Invalid token signature' }));
  }

  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    if (payload.expiresAt <= Date.now()) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 401;
      return res.end(JSON.stringify({ valid: false, message: 'Admin session has expired' }));
    }

    if (String(payload.email).toLowerCase() !== ADMIN_EMAIL) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 401;
      return res.end(JSON.stringify({ valid: false, message: 'Admin identity mismatch' }));
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    return res.end(JSON.stringify({
      valid: true,
      email: payload.email,
      expiresAt: payload.expiresAt
    }));
  } catch {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 401;
    return res.end(JSON.stringify({ valid: false, message: 'Failed to verify session payload' }));
  }
}
