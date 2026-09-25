import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Package,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Smartphone,
  ExternalLink,
  Code2,
  DownloadCloud,
  ChevronRight,
  Eye,
  Zap
} from 'lucide-react';

interface SoftwareMarketplaceProps {
  onSelectProduct: (product: Product, buyType?: 'software' | 'source_code') => void;
  onOpenDetails: (product: Product) => void;
}

export const SoftwareMarketplace: React.FC<SoftwareMarketplaceProps> = ({
  onSelectProduct,
  onOpenDetails
}) => {
  const { products, settings, getProductSalesStats } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const publishedProducts = products.filter(p => p.status === 'published');

  const categories = ['all', ...Array.from(new Set(publishedProducts.map(p => p.category)))];

  const filteredProducts = publishedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="software" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
            <Package className="w-3.5 h-3.5" />
            <span>SOFTWARE & APK MARKETPLACE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Verified Software & Mobile Applications
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Production-ready APKs and desktop applications developed by Aftab. Instant payment verification and cryptographically protected downloads.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software, APKs, POS..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center rounded-2xl bg-[#090d16] border border-white/5 space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-mono">No software available yet.</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">New products will appear here when published by Aftab.</p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left group shadow-lg shadow-black/40"
          >
            <div>
              {/* Product Screenshot / Image */}
              <div
                onClick={() => onOpenDetails(product)}
                className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.demoImages[0] || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-90" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                    {product.category}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  {product.version}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3
                    onClick={() => onOpenDetails(product)}
                    className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Key Features Bullet Points */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {product.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <p className="text-[11px] text-slate-400 font-mono pl-5">
                      +{product.features.length - 3} additional features
                    </p>
                  )}
                </div>

                {/* Real-time Dynamic Sales Indicator */}
                {(() => {
                  const sales = getProductSalesStats(product.id);
                  return (
                    <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-[#06080e] border border-white/5">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Total Sold: <strong className="text-white font-bold">{sales.sold}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Pending: <strong className="text-white font-bold">{sales.pending}</strong></span>
                      </div>
                    </div>
                  );
                })()}

                {/* Source Code Upsell Banner if available */}
                {product.sourceAvailable && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-[11px] font-mono">Source Code Available:</span>
                    </div>
                    <span className="font-bold font-mono text-white text-xs">PKR {(product.sourcePrice || product.price).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions & Price Bar */}
            <div className="p-6 pt-0 space-y-3">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">Software / APK License</p>
                  <p className="text-2xl font-black text-white font-mono">
                    PKR {(product.price || 0).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => onOpenDetails(product)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  title="View Screenshots & Specs"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectProduct(product, 'software')}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-black" />
                  <span>Buy Software</span>
                </button>

                {product.sourceAvailable ? (
                  <button
                    onClick={() => onSelectProduct(product, 'source_code')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Get Source</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenDetails(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 font-medium text-xs transition-colors"
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
