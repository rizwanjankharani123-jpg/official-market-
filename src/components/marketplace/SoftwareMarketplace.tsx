import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PurchaseType } from '../../types';
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
  Zap,
  Sparkles,
  Flame,
  ArrowUpDown,
  Clock,
  TrendingUp,
  Tag,
  X,
  SlidersHorizontal,
  RotateCcw,
  Heart
} from 'lucide-react';

interface SoftwareMarketplaceProps {
  onSelectProduct: (product: Product, buyType?: PurchaseType) => void;
  onOpenDetails: (product: Product) => void;
}

type PricingFilterType = 'all' | 'free' | 'paid';
type FeatureFilterType = 'all' | 'featured' | 'new_releases' | 'trending' | 'source_available';
type SortOptionType = 'newest' | 'trending' | 'price_low' | 'price_high' | 'name_asc';

export const SoftwareMarketplace: React.FC<SoftwareMarketplaceProps> = ({
  onSelectProduct,
  onOpenDetails
}) => {
  const { products, settings, getProductSalesStats, recordFreeDownload, toggleWishlist, isInWishlist } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<PricingFilterType>('all');
  const [featureFilter, setFeatureFilter] = useState<FeatureFilterType>('all');
  const [sortBy, setSortBy] = useState<SortOptionType>('newest');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter ONLY published products from real Firestore collection
  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'published');
  }, [products]);

  // Derive unique categories dynamically from real product catalog
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [publishedProducts]);

  // Compute filtered & sorted product list
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = publishedProducts.filter((product) => {
      const isFree = product.pricingType === 'free' || product.price === 0;

      // 1. Pricing filter
      if (pricingFilter === 'free' && !isFree) return false;
      if (pricingFilter === 'paid' && isFree) return false;

      // 2. Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;

      // 3. Feature / Sub-filter
      if (featureFilter === 'featured' && !product.featured) return false;
      if (featureFilter === 'source_available' && !product.sourceAvailable) return false;
      if (featureFilter === 'trending') {
        const stats = getProductSalesStats(product.id);
        const activity = stats.sold + (product.downloadsCount || 0);
        if (activity <= 0) return false;
      }
      if (featureFilter === 'new_releases') {
        // Must have publishedAt or createdAt
        if (!product.publishedAt && !product.createdAt) return false;
      }

      // 4. Search query (search name, shortDescription, fullDescription, category, features, techStack)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = product.name.toLowerCase().includes(query);
        const shortDescMatch = product.shortDescription.toLowerCase().includes(query);
        const fullDescMatch = product.fullDescription?.toLowerCase().includes(query);
        const catMatch = product.category?.toLowerCase().includes(query);
        const featureMatch = product.features?.some((f) => f.toLowerCase().includes(query));
        const techMatch = product.techStack?.some((t) => t.toLowerCase().includes(query));

        if (!nameMatch && !shortDescMatch && !fullDescMatch && !catMatch && !featureMatch && !techMatch) {
          return false;
        }
      }

      return true;
    });

    // 5. Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'trending') {
        const statsA = getProductSalesStats(a.id);
        const statsB = getProductSalesStats(b.id);
        const actA = statsA.sold + (a.downloadsCount || 0);
        const actB = statsB.sold + (b.downloadsCount || 0);
        if (actB !== actA) return actB - actA;
        const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'price_low') {
        const priceA = a.pricingType === 'free' ? 0 : a.price || 0;
        const priceB = b.pricingType === 'free' ? 0 : b.price || 0;
        return priceA - priceB;
      }
      if (sortBy === 'price_high') {
        const priceA = a.pricingType === 'free' ? 0 : a.price || 0;
        const priceB = b.pricingType === 'free' ? 0 : b.price || 0;
        return priceB - priceA;
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [publishedProducts, searchQuery, selectedCategory, pricingFilter, featureFilter, sortBy, getProductSalesStats]);

  const handleFreeDownload = async (product: Product) => {
    setDownloadingId(product.id);
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
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPricingFilter('all');
    setFeatureFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    pricingFilter !== 'all' ||
    featureFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <section id="software" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
            <Package className="w-3.5 h-3.5" />
            <span>SOFTWARE & APK MARKETPLACE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Verified Software & Mobile Applications
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Production-ready APKs, desktop applications, and source code developed by Aftab. Instant payment verification and cryptographically protected downloads.
          </p>
        </div>

        {/* Live Catalog Counter */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Catalog: <strong className="text-white">{filteredAndSortedProducts.length}</strong> of {publishedProducts.length} Active</span>
        </div>
      </div>

      {/* Discovery Control Center: Search + Pricing + Sort */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-white/10 mb-8 space-y-4 shadow-xl">
        {/* Top Control Bar: Search Input, Pricing Toggle, Sort Dropdown */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software, APKs, tech stack, features..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 items-center">
            {/* Pricing Model Filter */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setPricingFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  pricingFilter === 'all'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Pricing
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter('free')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  pricingFilter === 'free'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <span>Free</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter('paid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  pricingFilter === 'paid'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-cyan-400'
                }`}
              >
                <span>Paid</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-white/10 shrink-0 gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOptionType)}
                className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest" className="bg-slate-900 text-white">🆕 Newest Published</option>
                <option value="trending" className="bg-slate-900 text-white">🔥 Popular / Trending</option>
                <option value="price_low" className="bg-slate-900 text-white">💲 Price: Low to High</option>
                <option value="price_high" className="bg-slate-900 text-white">💎 Price: High to Low</option>
                <option value="name_asc" className="bg-slate-900 text-white">🔤 Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Second Row: Category discovery pills & Feature filters */}
        <div className="pt-3 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-cyan-400" />
              Categories:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'all'
                ? publishedProducts.length
                : publishedProducts.filter(p => p.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span className="capitalize">{cat === 'all' ? 'All Categories' : cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Attributes (Featured, Trending, Source Available) */}
          <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
            <button
              onClick={() => setFeatureFilter(featureFilter === 'featured' ? 'all' : 'featured')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                featureFilter === 'featured'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-amber-300 border border-white/5'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setFeatureFilter(featureFilter === 'trending' ? 'all' : 'trending')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                featureFilter === 'trending'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-rose-300 border border-white/5'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Popular</span>
            </button>

            <button
              onClick={() => setFeatureFilter(featureFilter === 'source_available' ? 'all' : 'source_available')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                featureFilter === 'source_available'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-indigo-300 border border-white/5'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Source Available</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
                title="Reset all search & filter parameters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="py-20 text-center rounded-2xl bg-[#090d16] border border-white/5 space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-mono">No products match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No software matched "${searchQuery}". Try searching for other terms or adjusting your filters.`
              : 'New software releases will appear here dynamically when published in Firestore by Aftab.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProducts.map((product) => {
          const isFree = product.pricingType === 'free' || product.price === 0;
          return (
            <div
              key={product.id}
              className={`rounded-2xl bg-[#090d16] border transition-all duration-300 flex flex-col justify-between overflow-hidden text-left group shadow-lg shadow-black/40 ${
                isFree ? 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-emerald-950/30' : 'border-white/10 hover:border-cyan-500/40 hover:shadow-cyan-950/30'
              }`}
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
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {product.featured && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-amber-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-black" />
                        ⭐ Featured
                      </span>
                    )}
                    {isFree ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-extrabold text-[10px] font-mono shadow-md shadow-emerald-500/30 uppercase tracking-wider">
                        FREE
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md bg-cyan-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                        PAID
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
                      {product.category}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`p-1.5 rounded-md backdrop-blur-md border transition-colors cursor-pointer ${
                        isInWishlist(product.id)
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : 'bg-black/70 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      title={isInWishlist(product.id) ? 'Saved in Wishlist' : 'Save to Wishlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <span className="px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                      {product.version}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3
                      onClick={() => onOpenDetails(product)}
                      className={`font-bold text-white text-lg transition-colors cursor-pointer ${
                        isFree ? 'group-hover:text-emerald-300' : 'group-hover:text-cyan-300'
                      }`}
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
                        <Check className={`w-3.5 h-3.5 shrink-0 ${isFree ? 'text-emerald-400' : 'text-cyan-400'}`} />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                    {product.features.length > 3 && (
                      <p className="text-[11px] text-slate-400 font-mono pl-5">
                        +{product.features.length - 3} additional features
                      </p>
                    )}
                  </div>

                  {/* Dynamic Real Product Stats Indicator */}
                  {(() => {
                    const sales = getProductSalesStats(product.id);
                    const views = product.viewsCount || 0;
                    const downloads = product.downloadsCount || 0;
                    return (
                      <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-[#06080e] border border-white/5 gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-cyan-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Views: <strong className="text-white font-bold">{views}</strong></span>
                        </div>
                        {isFree ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span>Downloads: <strong className="text-white font-bold">{downloads}</strong></span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Sold: <strong className="text-white font-bold">{sales.sold}</strong></span>
                            </div>
                            {sales.pending > 0 && (
                              <div className="flex items-center gap-1 text-amber-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                <span>Pending: <strong className="text-white font-bold">{sales.pending}</strong></span>
                              </div>
                            )}
                          </div>
                        )}
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
                      <span className="font-bold font-mono text-white text-xs">PKR {(product.sourcePrice || product.price || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Price Bar */}
              <div className="p-6 pt-0 space-y-3">
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] uppercase font-mono ${isFree ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                      {isFree ? 'Free Full License' : 'Software / APK License'}
                    </p>
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

                  <button
                    onClick={() => onOpenDetails(product)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="View Screenshots & Specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {isFree ? (
                    <button
                      onClick={() => handleFreeDownload(product)}
                      disabled={downloadingId === product.id}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-black" />
                      <span>{downloadingId === product.id ? 'Downloading...' : 'Download Free'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectProduct(product, 'software')}
                      className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-black" />
                      <span>Buy Software</span>
                    </button>
                  )}

                  {product.sourceAvailable ? (
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
          );
        })}
      </div>
    </section>
  );
};
