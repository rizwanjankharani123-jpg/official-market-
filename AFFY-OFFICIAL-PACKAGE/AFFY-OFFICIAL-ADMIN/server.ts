import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-Side Master Administrator Credentials
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'affyofficial.dev@gmail.com').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AftabxR4ees1122';

// In-Memory Secure Session Store
interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, AdminSession>();

// Session timeout: 12 hours
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

// Helper: Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token);
    }
  }
}, 15 * 60 * 1000);

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
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Invalid admin credentials'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const providedPassword = String(password);

  // Strict verification: only exact email and exact password
  if (normalizedEmail !== ADMIN_EMAIL || providedPassword !== ADMIN_PASSWORD) {
    // Return standard generic error - do NOT reveal which credential was incorrect
    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials'
    });
  }

  // Generate a cryptographically secure 256-bit session token
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: AdminSession = {
    token,
    email: ADMIN_EMAIL,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS
  };

  activeSessions.set(token, session);

  return res.json({
    success: true,
    token,
    email: ADMIN_EMAIL,
    expiresAt: session.expiresAt
  });
});

// 2. GET /api/admin/verify (Verify existing session token)
app.get('/api/admin/verify', (req, res) => {
  const token = getBearerToken(req) || (req.query.token as string);

  if (!token) {
    return res.status(401).json({
      valid: false,
      message: 'No active session token provided'
    });
  }

  const session = activeSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({
      valid: false,
      message: 'Admin session has expired or is invalid'
    });
  }

  return res.json({
    valid: true,
    email: session.email,
    expiresAt: session.expiresAt
  });
});

// 3. POST /api/admin/logout (Invalidate session token)
app.post('/api/admin/logout', (req, res) => {
  const token = getBearerToken(req) || req.body?.token;
  if (token) {
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
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
