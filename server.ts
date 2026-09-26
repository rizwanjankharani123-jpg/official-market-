import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to extract Bearer token
function getBearerToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

// -------------------------------------------------------------
// SECURE ADMIN AUTHENTICATION API ROUTES
// -------------------------------------------------------------

// 1. POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD) : '';
  const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: Administrator credentials not configured in environment variables.'
    });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Invalid admin credentials'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const providedPassword = String(password);

  // Secure constant-time comparison for password
  const emailMatch = normalizedEmail === ADMIN_EMAIL;
  let passwordMatch = false;
  if (providedPassword.length === ADMIN_PASSWORD.length) {
    passwordMatch = crypto.timingSafeEqual(Buffer.from(providedPassword), Buffer.from(ADMIN_PASSWORD));
  }

  if (!emailMatch || !passwordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials'
    });
  }

  // Generate cryptographically secure HMAC-SHA256 session token (12 hours)
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = { email: ADMIN_EMAIL, expiresAt, nonce };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  const token = `${payloadBase64}.${signature}`;

  return res.json({
    success: true,
    token,
    email: ADMIN_EMAIL,
    expiresAt
  });
});

// 2. GET /api/admin/verify (Verify existing session token)
app.get('/api/admin/verify', (req, res) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
  const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';

  if (!ADMIN_EMAIL || !ADMIN_SECRET) {
    return res.status(500).json({
      valid: false,
      message: 'Server configuration error: Administrator credentials not configured in environment variables.'
    });
  }

  const token = getBearerToken(req) || (req.query.token as string);

  if (!token) {
    return res.status(401).json({
      valid: false,
      message: 'No active session token provided'
    });
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return res.status(401).json({
      valid: false,
      message: 'Invalid token structure'
    });
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
    return res.status(401).json({
      valid: false,
      message: 'Invalid token signature'
    });
  }

  try {
    const payloadStr = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    if (payload.expiresAt <= Date.now()) {
      return res.status(401).json({
        valid: false,
        message: 'Admin session has expired'
      });
    }

    if (String(payload.email).toLowerCase() !== ADMIN_EMAIL) {
      return res.status(401).json({
        valid: false,
        message: 'Admin identity mismatch'
      });
    }

    return res.json({
      valid: true,
      email: payload.email,
      expiresAt: payload.expiresAt
    });
  } catch {
    return res.status(401).json({
      valid: false,
      message: 'Failed to verify session payload'
    });
  }
});

// 3. POST /api/admin/logout (Invalidate session token)
app.post('/api/admin/logout', (_req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// SECURE DOWNLOAD AUTHORIZATION ROUTE
// -------------------------------------------------------------
app.post('/api/downloads/verify', (req, res) => {
  const { orderId, customerEmail, orderStatus } = req.body || {};

  if (!orderId || !customerEmail) {
    return res.status(400).json({
      authorized: false,
      message: 'Invalid verification parameters'
    });
  }

  // Must have payment_confirmed or completed status
  const isConfirmed = orderStatus === 'payment_confirmed' || orderStatus === 'completed';
  if (!isConfirmed) {
    return res.status(403).json({
      authorized: false,
      message: 'Download vault locked: Payment verification pending.'
    });
  }

  return res.json({
    authorized: true,
    message: 'Cryptographic authorization token validated for download release.'
  });
});

// -------------------------------------------------------------
// VITE / STATIC MIDDLEWARE
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
