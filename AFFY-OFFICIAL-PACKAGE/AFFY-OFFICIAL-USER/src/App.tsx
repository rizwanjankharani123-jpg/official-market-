import React, { useState, useEffect } from 'react';
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
