import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { StructuredContentRenderer } from '../common/StructuredContentRenderer';
import {
  X,
  ShieldCheck,
  Check,
  DownloadCloud,
  Code2,
  Package,
  Layers,
  FileCode,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lock,
  Smartphone,
  FolderGit2,
  Eye,
  TrendingUp,
  Clock,
  ShoppingCart,
  Heart
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product, buyType: 'software' | 'source_code') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct
}) => {
  const { getProductSalesStats, recordFreeDownload, recordProductView, toggleWishlist, isInWishlist } = useApp();
  const [downloadingFree, setDownloadingFree] = useState(false);

  // Record product view on open (with built-in deduplication per session)
  useEffect(() => {
    if (product?.id) {
      recordProductView(product.id);
    }
  }, [product?.id, recordProductView]);

  if (!product) return null;

  const isFree = product.pricingType === 'free' || product.price === 0;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const totalSales = getProductSalesStats(product.id);
  const softwareSales = getProductSalesStats(product.id, 'software');
  const sourceSales = getProductSalesStats(product.id, 'source_code');

  const handleFreeDownload = async () => {
    setDownloadingFree(true);
    try {
      await recordFreeDownload(product.id);
      if (product.apkUrl) {
        const a = document.createElement('a');
        a.href = product.apkUrl;
        a.download = `${product.name.replace(/\s+/g, '_')}_v${product.version || '1.0'}.apk`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error('Free download error:', e);
    } finally {
      setTimeout(() => setDownloadingFree(false), 1200);
    }
  };

  const nextImage = () => {
    if (product.demoImages.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % product.demoImages.length);
    }
  };

  const prevImage = () => {
    if (product.demoImages.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + product.demoImages.length) % product.demoImages.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 text-slate-200 my-8 max-h-[90vh] overflow-y-auto">
        {/* Action Controls */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isInWishlist(product.id)
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
            }`}
            title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Badges & Title */}
        <div className="space-y-3 mb-6 text-left">
          <div className="flex flex-wrap items-center gap-2">
            {product.featured && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-xs font-mono shadow-md shadow-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                ⭐ FEATURED
              </span>
            )}
            {isFree ? (
              <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-extrabold text-xs font-mono shadow-md shadow-emerald-500/30 uppercase tracking-wider">
                100% FREE APP
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
                PAID RELEASE
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold">
              {product.category}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10 text-xs font-mono">
              Version {product.version}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Clean Build
            </span>
            {/* Real Product Statistics Bar */}
            <div className="w-full flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/10 text-xs font-mono flex items-center gap-1.5 text-cyan-300">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Views:</span>
                <strong className="text-white font-bold">{product.viewsCount || 0}</strong>
              </span>

              <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/10 text-xs font-mono flex items-center gap-1.5 text-emerald-300">
                <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Downloads:</span>
                <strong className="text-white font-bold">{product.downloadsCount || 0}</strong>
              </span>

              {!isFree && (
                <>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/10 text-xs font-mono flex items-center gap-1.5 text-emerald-300">
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-400">Sold:</span>
                    <strong className="text-white font-bold">{totalSales.sold}</strong>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/10 text-xs font-mono flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-400">Pending:</span>
                    <strong className="text-white font-bold">{totalSales.pending}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{product.name}</h2>
          <p className="text-sm text-slate-300">{product.shortDescription}</p>
        </div>

        {/* Screenshot Gallery Carousel */}
        {product.demoImages.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] mb-8 border border-white/10 group">
            <img
              src={product.demoImages[activeImageIndex]}
              alt={`${product.name} screenshot ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {product.demoImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md">
                  {product.demoImages.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImageIndex === i ? 'bg-cyan-400 w-5' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Detailed Sections Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Left Column: Full Description & Specs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="font-bold text-white text-base font-mono mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Product Overview</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Structured Content: About This Software */}
            {product.aboutSoftware && product.aboutSoftware.trim().length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0f19] border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base font-mono flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="tracking-wide">ABOUT THIS SOFTWARE</span>
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Application Release
                  </span>
                </div>
                <StructuredContentRenderer content={product.aboutSoftware} accentColor="cyan" />
              </div>
            )}

            {/* Structured Content: About This Source Code */}
            {product.sourceAvailable && product.aboutSource && product.aboutSource.trim().length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0f19] border border-indigo-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base font-mono flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-400" />
                    <span className="tracking-wide text-indigo-200">ABOUT THIS SOURCE CODE</span>
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Repository & Architecture
                  </span>
                </div>
                <StructuredContentRenderer content={product.aboutSource} accentColor="indigo" />
              </div>
            )}

            {/* Key Features */}
            <div>
              <h3 className="font-bold text-white text-base font-mono mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Engineered Capabilities</span>
              </h3>
              <div className="space-y-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2 rounded-lg bg-slate-900/60 border border-white/5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included Files */}
            <div>
              <h3 className="font-bold text-white text-base font-mono mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                <span>Included Package Assets</span>
              </h3>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {product.includedFiles.map((file, idx) => (
                  <li key={idx} className="font-mono text-cyan-300/90">{file}</li>
                ))}
              </ul>
            </div>

            {/* System Requirements */}
            <div>
              <h3 className="font-bold text-white text-base font-mono mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>System Requirements</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.requirements.map((req, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono border border-white/5">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Purchase Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {/* Option A: Buy Software / Download Free APK */}
            <div className={`p-5 rounded-2xl space-y-4 ${
              isFree
                ? 'bg-emerald-950/25 border border-emerald-500/40'
                : 'bg-slate-900/90 border border-cyan-500/30'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    isFree ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {isFree ? 'FREE SOFTWARE RELEASE' : 'OPTION 1 • APPLICATION'}
                  </span>
                  <h4 className="font-bold text-white text-base mt-1">
                    {isFree ? 'Direct Free Installation' : 'Software / APK Release'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isFree ? 'Compiled Android APK / Executable ready to use.' : 'Ready-to-install binaries & manual.'}
                  </p>
                  {isFree ? (
                    <p className="text-[10px] font-mono text-emerald-400 mt-1">
                      Total Downloads: <strong>{product.downloadsCount || 0}</strong> • No payment needed
                    </p>
                  ) : (
                    <p className="text-[10px] font-mono text-cyan-300/80 mt-1">
                      Sold: {softwareSales.sold} • Pending: {softwareSales.pending}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {isFree ? (
                    <p className="text-2xl font-black text-emerald-400 font-mono">
                      PKR 0 <span className="text-xs font-normal text-slate-400 font-sans">/ Free</span>
                    </p>
                  ) : (
                    <p className="text-2xl font-black text-white font-mono">
                      PKR {(product.price || 0).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {isFree ? (
                <button
                  onClick={handleFreeDownload}
                  disabled={downloadingFree}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                >
                  <DownloadCloud className="w-4 h-4 text-black" />
                  <span>{downloadingFree ? 'Initiating Download...' : 'Download Free APK / Software'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onSelectProduct(product, 'software');
                  }}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4 text-black" />
                  <span>Buy Software (PKR {(product.price || 0).toLocaleString()})</span>
                </button>
              )}
            </div>

            {/* Option B: Buy Source Code License */}
            {product.sourceAvailable && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
                      OPTION 2 • DEVELOPER
                    </span>
                    <h4 className="font-bold text-white text-base mt-1">Full Source Code License</h4>
                    <p className="text-[11px] text-slate-400">Complete repo, database schema, and docs.</p>
                    <p className="text-[10px] font-mono text-indigo-300/80 mt-1">Sold: {sourceSales.sold} • Pending: {sourceSales.pending}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white font-mono">PKR {(product.sourcePrice || product.price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <p className="font-mono text-cyan-300">Tech: {product.techStack?.join(', ')}</p>
                  <p className="text-slate-400">{product.licenseTerms}</p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectProduct(product, 'source_code');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-white" />
                  <span>Buy Source Code (PKR {(product.sourcePrice || product.price).toLocaleString()})</span>
                </button>
              </div>
            )}

            {/* Support Guarantee */}
            <div className="p-4 rounded-xl bg-[#06080e] border border-white/5 text-xs text-slate-400 space-y-1">
              <p className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Support Terms</span>
              </p>
              <p className="text-[11px] leading-relaxed">{product.supportTerms}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
