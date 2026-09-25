import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const PACKAGE_ROOT = path.join(ROOT_DIR, 'AFFY-OFFICIAL-PACKAGE');
const USER_DIR = path.join(PACKAGE_ROOT, 'AFFY-OFFICIAL-USER');
const ADMIN_DIR = path.join(PACKAGE_ROOT, 'AFFY-OFFICIAL-ADMIN');

console.log('--- Initializing AFFY-OFFICIAL Production Packaging ---');

// Clean existing package directories
if (fs.existsSync(PACKAGE_ROOT)) {
  fs.rmSync(PACKAGE_ROOT, { recursive: true, force: true });
}

fs.mkdirSync(PACKAGE_ROOT, { recursive: true });
fs.mkdirSync(USER_DIR, { recursive: true });
fs.mkdirSync(ADMIN_DIR, { recursive: true });

// Copy helper
function copyRecursive(src: string, dest: string, exclude: string[] = []) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      if (exclude.includes(file)) continue;
      copyRecursive(path.join(src, file), path.join(dest, file), exclude);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// -------------------------------------------------------------
// 1. BUILD AFFY-OFFICIAL-USER STANDALONE PROJECT
// -------------------------------------------------------------
console.log('Packaging AFFY-OFFICIAL-USER...');

// User package.json
const userPackageJson = {
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
};
fs.writeFileSync(path.join(USER_DIR, 'package.json'), JSON.stringify(userPackageJson, null, 2));

// User vite.config.ts
const userViteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
`;
fs.writeFileSync(path.join(USER_DIR, 'vite.config.ts'), userViteConfig);

// User tsconfig.json
const userTsConfig = {
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
    types: ['vite/client', 'node'],
    strict: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noFallthroughCasesInSwitch: true
  },
  include: ['src', 'vite-env.d.ts']
};
fs.writeFileSync(path.join(USER_DIR, 'tsconfig.json'), JSON.stringify(userTsConfig, null, 2));

// User vite-env.d.ts
fs.writeFileSync(path.join(USER_DIR, 'vite-env.d.ts'), '/// <reference types="vite/client" />\n');

// User .env.example
const userEnvExample = `# ========================================================
# AFFY OFFICIAL - USER PUBLIC PORTAL ENVIRONMENT VARIABLES
# ========================================================
# Public Firebase client configuration for Firestore & Storage
VITE_FIREBASE_API_KEY=AIzaSyAffyOfficialProductionKey
VITE_FIREBASE_AUTH_DOMAIN=affy-official.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=affy-official
VITE_FIREBASE_STORAGE_BUCKET=affy-official.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=679193230496
VITE_FIREBASE_APP_ID=1:679193230496:web:affyofficialproduction
`;
fs.writeFileSync(path.join(USER_DIR, '.env.example'), userEnvExample);

// User index.html
const userIndexHtml = `<!doctype html>
<html lang="en" class="dark scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    
    <!-- Primary SEO Meta Tags -->
    <title>AFFY OFFICIAL — Premium Software, Android APKs & Source Code by Aftab</title>
    <meta name="title" content="AFFY OFFICIAL — Premium Software, Android APKs & Source Code by Aftab" />
    <meta name="description" content="Official platform by Aftab (Web & Software Developer). Buy verified Android APKs, commercial source-code licenses, or commission custom software solutions in PKR." />
    <meta name="keywords" content="Aftab developer, AFFY OFFICIAL, buy APK, buy source code, web developer Pakistan, software developer, custom software commission, EasyPaisa, JazzCash" />
    <meta name="author" content="Aftab (AFFY OFFICIAL)" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://affyofficial.dev/" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 2 7 12 12 22 7 12 2'/%3E%3Cpolyline points='2 17 12 22 22 17'/%3E%3Cpolyline points='2 12 12 17 22 12'/%3E%3C/svg%3E" />

    <!-- Open Graph / WhatsApp / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://affyofficial.dev/" />
    <meta property="og:title" content="AFFY OFFICIAL — Premium Software, Android APKs & Source Code by Aftab" />
    <meta property="og:description" content="Explore verified Android APKs, purchase commercial-grade source code licenses, or commission custom software built by Aftab." />
    <meta property="og:image" content="https://i.ibb.co/rR2WdxJ0/1772950442657-1.jpg" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://affyofficial.dev/" />
    <meta name="twitter:title" content="AFFY OFFICIAL — Premium Software & Android APKs" />
    <meta name="twitter:description" content="Verified software solutions and commercial source code by Aftab." />
    <meta name="twitter:image" content="https://i.ibb.co/rR2WdxJ0/1772950442657-1.jpg" />

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Aftab",
      "jobTitle": "Web Developer & Software Developer",
      "brand": {
        "@type": "Brand",
        "name": "AFFY OFFICIAL"
      },
      "url": "https://affyofficial.dev/",
      "image": "https://i.ibb.co/rR2WdxJ0/1772950442657-1.jpg",
      "sameAs": [
        "https://whatsapp.com/channel/0029VbDt8ZT6GcGMx87JuS2d"
      ]
    }
    </script>
  </head>
  <body class="bg-[#050811] text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-black antialiased font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
fs.writeFileSync(path.join(USER_DIR, 'index.html'), userIndexHtml);

// User public files
fs.mkdirSync(path.join(USER_DIR, 'public'), { recursive: true });
fs.writeFileSync(path.join(USER_DIR, 'public', 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://affyofficial.dev/sitemap.xml\n`);
fs.writeFileSync(path.join(USER_DIR, 'public', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://affyofficial.dev/</loc>
    <lastmod>2026-09-24</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);

// Copy src to user (excluding admin directory)
copyRecursive(path.join(ROOT_DIR, 'src'), path.join(USER_DIR, 'src'), ['admin']);

// User App.tsx with ZERO Admin UI
const userAppTsx = `import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSection } from './components/portfolio/AboutSection';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { ServicesSection } from './components/portfolio/ServicesSection';
import { ContactSection } from './components/portfolio/ContactSection';
import { SoftwareMarketplace } from './components/marketplace/SoftwareMarketplace';
import { SourceCodeMarketplace } from './components/marketplace/SourceCodeMarketplace';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { PurchaseModal } from './components/marketplace/PurchaseModal';
import { TrackOrderView } from './components/tracking/TrackOrderView';
import { CustomProjectView } from './components/custom/CustomProjectView';
import { TermsView } from './components/legal/TermsView';
import { InvoiceModal } from './components/documents/InvoiceModal';
import { CertificateModal } from './components/documents/CertificateModal';
import { OpeningAnimation } from './components/common/OpeningAnimation';
import { Product, PurchaseType } from './types';
import { updatePageSEO } from './utils/seo';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();
  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('affy_intro_shown');
    } catch {
      return false;
    }
  });

  const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('software');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedInvoiceOrderId, setSelectedInvoiceOrderId] = useState<string | null>(null);
  const [selectedCertOrderId, setSelectedCertOrderId] = useState<string | null>(null);

  useEffect(() => {
    updatePageSEO(activeView);
  }, [activeView]);

  const handleInitiatePurchase = (product: Product, type: PurchaseType = 'software') => {
    setDetailedProduct(null);
    setSelectedProductForPurchase(product);
    setPurchaseType(type);
    setIsPurchaseModalOpen(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setActiveView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans relative">
      {showOpeningAnimation && (
        <OpeningAnimation
          onComplete={() => {
            setShowOpeningAnimation(false);
            try {
              sessionStorage.setItem('affy_intro_shown', 'true');
            } catch {}
          }}
        />
      )}

      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-12">
            <HeroSection />
            <SoftwareMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
            <SourceCodeMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
            <ProjectsSection />
            <ServicesSection />
            <AboutSection />
            <ContactSection />
          </div>
        )}

        {activeView === 'marketplace' && (
          <div className="pt-8">
            <SoftwareMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {activeView === 'software' && (
          <div className="pt-8">
            <SoftwareMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {activeView === 'source-code' && (
          <div className="pt-8">
            <SourceCodeMarketplace
              onSelectProduct={handleInitiatePurchase}
              onOpenDetails={(p) => setDetailedProduct(p)}
            />
          </div>
        )}

        {activeView === 'projects' && (
          <div className="pt-8">
            <ProjectsSection />
          </div>
        )}

        {activeView === 'about' && (
          <div className="pt-8">
            <AboutSection />
          </div>
        )}

        {activeView === 'custom-project' && (
          <div className="pt-8">
            <CustomProjectView />
          </div>
        )}

        {activeView === 'track-order' && (
          <div className="pt-8">
            <TrackOrderView
              onOpenInvoice={(orderId) => setSelectedInvoiceOrderId(orderId)}
              onOpenCertificate={(orderId) => setSelectedCertOrderId(orderId)}
            />
          </div>
        )}

        {activeView === 'terms' && (
          <div className="pt-8">
            <TermsView />
          </div>
        )}
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailedProduct}
        onClose={() => setDetailedProduct(null)}
        onSelectProduct={handleInitiatePurchase}
      />

      {/* Purchase & Payment Proof Modal */}
      <PurchaseModal
        product={selectedProductForPurchase}
        initialType={purchaseType}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Commercial Invoice Modal */}
      {selectedInvoiceOrderId && (
        <InvoiceModal
          orderId={selectedInvoiceOrderId}
          onClose={() => setSelectedInvoiceOrderId(null)}
        />
      )}

      {/* Digital Certificate of Authenticity Modal */}
      {selectedCertOrderId && (
        <CertificateModal
          orderId={selectedCertOrderId}
          onClose={() => setSelectedCertOrderId(null)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
`;
fs.writeFileSync(path.join(USER_DIR, 'src', 'App.tsx'), userAppTsx);

// -------------------------------------------------------------
// 2. BUILD AFFY-OFFICIAL-ADMIN STANDALONE PROJECT
// -------------------------------------------------------------
console.log('Packaging AFFY-OFFICIAL-ADMIN...');

// Admin package.json
const adminPackageJson = {
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
};
fs.writeFileSync(path.join(ADMIN_DIR, 'package.json'), JSON.stringify(adminPackageJson, null, 2));

// Admin vite.config.ts
const adminViteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
`;
fs.writeFileSync(path.join(ADMIN_DIR, 'vite.config.ts'), adminViteConfig);

// Admin tsconfig.json
const adminTsConfig = {
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
    types: ['vite/client', 'node'],
    strict: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noFallthroughCasesInSwitch: true
  },
  include: ['src', 'server.ts', 'vite-env.d.ts']
};
fs.writeFileSync(path.join(ADMIN_DIR, 'tsconfig.json'), JSON.stringify(adminTsConfig, null, 2));

// Admin vite-env.d.ts
fs.writeFileSync(path.join(ADMIN_DIR, 'vite-env.d.ts'), '/// <reference types="vite/client" />\n');

// Admin .env.example
const adminEnvExample = `# ========================================================
# AFFY OFFICIAL - ADMIN CMS ENVIRONMENT VARIABLES
# ========================================================
PORT=3000

# Server-Side Master Admin Credentials (NEVER exposed to frontend bundle)
ADMIN_SECRET_KEY=affy_master_official_session_key_2026
ADMIN_EMAIL=affyofficial.dev@gmail.com
ADMIN_PASSWORD=change_this_to_your_secure_master_password

# Public Firebase client configuration for Firestore & Storage
VITE_FIREBASE_API_KEY=AIzaSyAffyOfficialProductionKey
VITE_FIREBASE_AUTH_DOMAIN=affy-official.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=affy-official
VITE_FIREBASE_STORAGE_BUCKET=affy-official.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=679193230496
VITE_FIREBASE_APP_ID=1:679193230496:web:affyofficialproduction
`;
fs.writeFileSync(path.join(ADMIN_DIR, '.env.example'), adminEnvExample);

// Admin index.html
const adminIndexHtml = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AFFY OFFICIAL — Master Administrative & CMS Portal</title>
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E" />
  </head>
  <body class="bg-[#050811] text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-black antialiased font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
fs.writeFileSync(path.join(ADMIN_DIR, 'index.html'), adminIndexHtml);

// Admin public files
fs.mkdirSync(path.join(ADMIN_DIR, 'public'), { recursive: true });
fs.writeFileSync(path.join(ADMIN_DIR, 'public', 'robots.txt'), `User-agent: *\nDisallow: /\n`);

// Admin server.ts
fs.copyFileSync(path.join(ROOT_DIR, 'server.ts'), path.join(ADMIN_DIR, 'server.ts'));

// Admin src files
copyRecursive(path.join(ROOT_DIR, 'src'), path.join(ADMIN_DIR, 'src'));

// Admin App.tsx (Dedicated Master Portal)
const adminAppTsx = `import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { InvoiceModal } from './components/documents/InvoiceModal';
import { CertificateModal } from './components/documents/CertificateModal';
import { ZipExportModal } from './components/common/ZipExportModal';
import { ShieldAlert, ShieldCheck, Terminal, LogOut } from 'lucide-react';

const MainAdminContent: React.FC = () => {
  const { isAdminAuthenticated, adminSession, adminLogout } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!isAdminAuthenticated);
  const [selectedInvoiceOrderId, setSelectedInvoiceOrderId] = useState<string | null>(null);
  const [selectedCertOrderId, setSelectedCertOrderId] = useState<string | null>(null);
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#090d16]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white font-mono tracking-wider">AFFY OFFICIAL — CMS</h1>
            <p className="text-[10px] font-mono text-cyan-400">Master Administrative Gateway</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdminAuthenticated ? (
            <>
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {adminSession?.email}
              </span>
              <button
                onClick={() => adminLogout()}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Terminal className="w-3.5 h-3.5 text-black" />
              <span>Login to CMS</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {isAdminAuthenticated ? (
          <AdminDashboard
            onOpenInvoice={(id) => setSelectedInvoiceOrderId(id)}
            onOpenCertificate={(id) => setSelectedCertOrderId(id)}
            onOpenZipModal={() => setIsZipModalOpen(true)}
          />
        ) : (
          <div className="py-24 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-950/60">
              <Terminal className="w-10 h-10 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-mono">Master Portal Locked</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your authorized developer credentials to access the shared Firestore catalog, payment proofs, and order vault.
              </p>
            </div>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-extrabold inline-flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-black" />
              <span>Unlock Admin Panel</span>
            </button>
          </div>
        )}
      </main>

      <AdminLoginModal
        isOpen={isLoginModalOpen && !isAdminAuthenticated}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />

      {/* Official Invoice Modal */}
      {selectedInvoiceOrderId && (
        <InvoiceModal
          orderId={selectedInvoiceOrderId}
          onClose={() => setSelectedInvoiceOrderId(null)}
        />
      )}

      {/* Official Certificate Modal */}
      {selectedCertOrderId && (
        <CertificateModal
          orderId={selectedCertOrderId}
          onClose={() => setSelectedCertOrderId(null)}
        />
      )}

      {/* Package Exporter Modal */}
      <ZipExportModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAdminContent />
    </AppProvider>
  );
}

export default App;
`;
fs.writeFileSync(path.join(ADMIN_DIR, 'src', 'App.tsx'), adminAppTsx);

console.log('--- Production packaging complete in AFFY-OFFICIAL-PACKAGE ---');
