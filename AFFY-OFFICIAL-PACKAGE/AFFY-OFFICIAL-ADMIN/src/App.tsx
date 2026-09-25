import React, { useState } from 'react';
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
