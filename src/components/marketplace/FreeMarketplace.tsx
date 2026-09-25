import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  Search,
  Check,
  DownloadCloud,
  Eye,
  Code2,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FreeMarketplaceProps {
  onOpenDetails: (product: Product) => void;
  onDirectDownload?: (product: Product) => void;
  onSelectProduct?: (product: Product, buyType?: 'software' | 'source_code') => void;
}

export const FreeMarketplace: React.FC<FreeMarketplaceProps> = ({
  onOpenDetails,
  onDirectDownload,
  onSelectProduct
}) => {
  const { products, recordFreeDownload } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter only published and strictly FREE products from Firestore
  const freeProducts = products.filter(
    (p) => p.status === 'published' && (p.pricingType === 'free' || p.price === 0)
  );

  const categories = ['all', ...Array.from(new Set(freeProducts.map((p) => p.category)))];

  const filteredProducts = freeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (product: Product) => {
    setDownloadingId(product.id);
    try {
      // Increment real download count in Firestore
      await recordFreeDownload(product.id);

      if (onDirectDownload) {
        onDirectDownload(product);
      } else if (product.apkUrl) {
        // Trigger legitimate download
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
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  return (
    <section id="free-apps" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% FREE SOFTWARE & APPS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Free Apps & Open Utility Software
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Community releases and utility applications built by Aftab. Free to download with direct secure access and no payment proof needed.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search free apps & tools..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap capitalize transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center rounded-3xl bg-[#090d16] border border-white/5 space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-mono">No free apps available right now.</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Free software releases will appear here dynamically whenever published by Aftab in the catalog.
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Free Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-3xl bg-[#090d16] border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left group shadow-lg shadow-black/40"
          >
            <div>
              {/* Thumbnail Image */}
              <div
                onClick={() => onOpenDetails(product)}
                className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={
                    product.demoImages[0] ||
                    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-90" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  {product.featured && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-amber-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-black" />
                      ⭐ Featured
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-emerald-500/30 uppercase tracking-wider">
                    FREE
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                    {product.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  {product.version}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3
                    onClick={() => onOpenDetails(product)}
                    className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {product.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <p className="text-[11px] text-slate-400 font-mono pl-5">
                      +{product.features.length - 3} additional features
                    </p>
                  )}
                </div>

                {/* Real Product Statistics */}
                <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-[#06080e] border border-white/5 gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Views: <strong className="text-white font-bold">{product.viewsCount || 0}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Downloads: <strong className="text-white font-bold">{product.downloadsCount || 0}</strong></span>
                  </div>
                </div>

                {/* Source Code Upsell Banner if available */}
                {product.sourceAvailable && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-mono">Source Code License:</span>
                    </div>
                    <span className="font-bold font-mono text-white text-xs">
                      PKR {(product.sourcePrice || 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Price & Download Action */}
            <div className="p-6 pt-0 space-y-3">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Free Full License</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono">
                    PKR 0 <span className="text-xs font-normal text-slate-400 font-sans">/ Free</span>
                  </p>
                </div>

                <button
                  onClick={() => onOpenDetails(product)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="View Details & Specs"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownload(product)}
                  disabled={downloadingId === product.id}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-black" />
                  <span>{downloadingId === product.id ? 'Downloading...' : 'Download Free'}</span>
                </button>

                {product.sourceAvailable && onSelectProduct ? (
                  <button
                    onClick={() => onSelectProduct(product, 'source_code')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Get Source</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenDetails(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
