import JSZip from 'jszip';
import { SiteSettings } from '../types';

export async function generateFullProjectPackageZip(
  target: 'package' | 'user' | 'admin',
  settings: SiteSettings
): Promise<Blob> {
  const rootZip = new JSZip();

  // Helper to add project files
  const addProjectFiles = (
    zipFolder: JSZip,
    isUser: boolean
  ) => {
    // 1. package.json
    if (isUser) {
      zipFolder.file(
        'package.json',
        JSON.stringify(
          {
            name: 'affy-official-user',
            private: true,
            version: '1.0.0',
            type: 'module',
            scripts: {
              dev: 'vite --port=3000 --host=0.0.0.0',
              build: 'vite build',
              preview: 'vite preview',
              lint: 'tsc --noEmit'
            },
            dependencies: {
              '@tailwindcss/vite': '^4.3.3',
              'canvas-confetti': '^1.9.4',
              firebase: '^12.19.0',
              html2canvas: '^1.4.1',
              jspdf: '^4.2.1',
              'lucide-react': '^0.546.0',
              motion: '^12.23.24',
              react: '^19.0.1',
              'react-dom': '^19.0.1',
              tailwindcss: '^4.3.3',
              vite: '^8.3.0'
            },
            devDependencies: {
              '@types/canvas-confetti': '^1.9.0',
              '@types/node': '^22.14.0',
              '@types/react': '^19.3.0',
              '@types/react-dom': '^19.3.0',
              '@vitejs/plugin-react': '^6.1.1',
              typescript: '^7.0.2'
            }
          },
          null,
          2
        )
      );
    } else {
      zipFolder.file(
        'package.json',
        JSON.stringify(
          {
            name: 'affy-official-admin',
            private: true,
            version: '1.0.0',
            type: 'module',
            scripts: {
              dev: 'tsx server.ts',
              build: 'vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs',
              start: 'node dist/server.cjs',
              preview: 'vite preview',
              lint: 'tsc --noEmit'
            },
            dependencies: {
              '@tailwindcss/vite': '^4.3.3',
              'canvas-confetti': '^1.9.4',
              dotenv: '^17.2.3',
              express: '^4.21.2',
              firebase: '^12.19.0',
              html2canvas: '^1.4.1',
              jspdf: '^4.2.1',
              jszip: '^3.10.2',
              'lucide-react': '^0.546.0',
              motion: '^12.23.24',
              react: '^19.0.1',
              'react-dom': '^19.0.1',
              tailwindcss: '^4.3.3',
              vite: '^8.3.0'
            },
            devDependencies: {
              '@types/canvas-confetti': '^1.9.0',
              '@types/express': '^4.17.21',
              '@types/node': '^22.14.0',
              '@types/react': '^19.3.0',
              '@types/react-dom': '^19.3.0',
              '@vitejs/plugin-react': '^6.1.1',
              esbuild: '^0.25.0',
              tsx: '^4.21.0',
              typescript: '^7.0.2'
            }
          },
          null,
          2
        )
      );
    }

    // 2. vite.config.ts
    zipFolder.file(
      'vite.config.ts',
      `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
`
    );

    // 3. tsconfig.json
    zipFolder.file(
      'tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            useDefineForClassFields: true,
            lib: ['ES2022', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            isolatedModules: true,
            moduleDetection: 'force',
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true
          },
          include: ['src']
        },
        null,
        2
      )
    );

    // 4. index.html
    const title = isUser
      ? `${settings.brandName} — Software Developer & Engineer Marketplace`
      : `${settings.brandName} — Master Admin CMS & Verification Control Center`;
    zipFolder.file(
      'index.html',
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#030712] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
    );

    // 5. .env.example
    if (isUser) {
      zipFolder.file(
        '.env.example',
        `# Firebase Client Configuration (affy-official)
VITE_FIREBASE_PROJECT_ID="affy-official"
VITE_FIREBASE_AUTH_DOMAIN="affy-official.firebaseapp.com"
VITE_FIREBASE_STORAGE_BUCKET="affy-official.firebasestorage.app"
`
      );
    } else {
      zipFolder.file(
        '.env.example',
        `# Server-Side Master Admin Credentials
ADMIN_EMAIL="affyofficial.dev@gmail.com"
ADMIN_PASSWORD="AftabxR4ees1122"

# Firebase Client Configuration (affy-official)
VITE_FIREBASE_PROJECT_ID="affy-official"
VITE_FIREBASE_AUTH_DOMAIN="affy-official.firebaseapp.com"
VITE_FIREBASE_STORAGE_BUCKET="affy-official.firebasestorage.app"
`
      );
    }

    // 6. README.md
    if (isUser) {
      zipFolder.file(
        'README.md',
        `# AFFY-OFFICIAL-USER

Complete public customer website & marketplace for **${settings.brandName} (${settings.developerName})**.

## Features Included
- Homepage & About Developer (Aftab profile, verified badge, skills)
- Software Marketplace (Android APK, desktop apps, direct purchase)
- Source Code Marketplace (Full commercial IP license rights)
- Live Order Tracking & Invoices (Search by Order ID)
- Certificate of Authenticity generator & PDF export
- Custom Engineering Project Request & quotation engine
- Real-time communication with official WhatsApp & Gmail channels
- **Zero Admin UI** — 100% focused on public customer experience

## Backend Connection
Connects to the shared Firebase Firestore database (**affy-official**).

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
`
      );
    } else {
      zipFolder.file(
        'README.md',
        `# AFFY-OFFICIAL-ADMIN

Private Master Admin Panel & Verification Console for **${settings.brandName}**.

## Features Included
- Master Admin Login (Secure server-side single admin authentication)
- Products Inventory CMS (Add, edit, delete software & source code)
- Payment Audit Console (Approve/Reject manual bank/wallet payment proofs)
- Automatic Invoice & Authenticity Certificate dispatch
- Custom Project Requests quotation engine & status manager
- Payment Gateways & Developer Settings configuration
- Standalone Project ZIP Generator

## Administrator Credentials
- **Email:** \`affyofficial.dev@gmail.com\`
- **Password:** \`AftabxR4ees1122\`

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
`
      );
    }

    // 7. server.ts (For Admin only)
    if (!isUser) {
      zipFolder.file(
        'server.ts',
        `import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'affyofficial.dev@gmail.com').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AftabxR4ees1122';

interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, AdminSession>();
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token);
    }
  }
}, 15 * 60 * 1000);

function getBearerToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

// 1. POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const providedPassword = String(password);

  if (normalizedEmail !== ADMIN_EMAIL || providedPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: AdminSession = {
    token,
    email: ADMIN_EMAIL,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS
  };

  activeSessions.set(token, session);
  return res.json({ success: true, token, email: ADMIN_EMAIL, expiresAt: session.expiresAt });
});

// 2. GET /api/admin/verify
app.get('/api/admin/verify', (req, res) => {
  const token = getBearerToken(req) || (req.query.token as string);
  if (!token) {
    return res.status(401).json({ valid: false, message: 'No active session token provided' });
  }

  const session = activeSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ valid: false, message: 'Admin session has expired or is invalid' });
  }

  return res.json({ valid: true, email: session.email, expiresAt: session.expiresAt });
});

// 3. POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  const token = getBearerToken(req) || req.body?.token;
  if (token) activeSessions.delete(token);
  return res.json({ success: true, message: 'Logged out successfully' });
});

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
    console.log(\`Admin Server running on http://0.0.0.0:\${PORT}\`);
  });
}

startServer();
`
      );
    }

    // 8. src/index.css
    zipFolder.file(
      'src/index.css',
      `@import "tailwindcss";

@layer base {
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  code, pre, .font-mono {
    font-family: 'Fira Code', monospace;
  }
}
`
    );

    // 9. src/main.tsx
    zipFolder.file(
      'src/main.tsx',
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
    );

    // 10. src/lib/firebase.ts
    zipFolder.file(
      'src/lib/firebase.ts',
      `import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAffyOfficialProductionKeyPlaceholder2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "affy-official.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "affy-official",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "affy-official.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "679193230496",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:679193230496:web:affyofficialproduction"
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization fallback:", error);
  app = initializeApp(firebaseConfig, 'affy-official-fallback');
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, db, storage };
`
    );
  };

  if (target === 'package') {
    const parentFolder = rootZip.folder('AFFY-OFFICIAL-PACKAGE');
    if (parentFolder) {
      const userFolder = parentFolder.folder('AFFY-OFFICIAL-USER');
      const adminFolder = parentFolder.folder('AFFY-OFFICIAL-ADMIN');
      if (userFolder) addProjectFiles(userFolder, true);
      if (adminFolder) addProjectFiles(adminFolder, false);
      parentFolder.file(
        'README.md',
        `# AFFY-OFFICIAL-PACKAGE

This master package contains the decoupled standalone projects for **AFFY OFFICIAL**:

1. **\`AFFY-OFFICIAL-USER/\`**: Complete public user website (Zero admin UI, 100% customer-facing).
2. **\`AFFY-OFFICIAL-ADMIN/\`**: Complete private Admin Panel (Secure single-admin server auth, CMS, Payment Audit).

Both projects share the same Firebase project (**affy-official**) for Firestore and Storage.
`
      );
    }
  } else if (target === 'user') {
    addProjectFiles(rootZip, true);
  } else if (target === 'admin') {
    addProjectFiles(rootZip, false);
  }

  return await rootZip.generateAsync({ type: 'blob' });
}
