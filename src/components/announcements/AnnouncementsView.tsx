import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceAnnouncement, Product } from '../../types';
import {
  Bell,
  Sparkles,
  Gift,
  Flame,
  RotateCw,
  Tag,
  ArrowRight,
  ExternalLink,
  Calendar,
  X,
  Share2,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';

interface AnnouncementsViewProps {
  onOpenProductDetails?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  onOpenProductDetails,
  onSelectProduct
}) => {
  const { announcements, products, setActiveView } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAnnouncementModal, setActiveAnnouncementModal] = useState<MarketplaceAnnouncement | null>(null);

  // Filter only published announcements
  const publishedAnnouncements = announcements.filter(
    (a) => a.status !== 'draft' && a.active !== false
  );

  const filteredAnnouncements = publishedAnnouncements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.shortDescription && a.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.fullContent && a.fullContent.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.message && a.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const typeNormalized = a.announcementType || a.type || 'General';
    const matchesType =
      selectedType === 'all' ||
      typeNormalized.toLowerCase().replace(/\s+/g, '_') === selectedType.toLowerCase().replace(/\s+/g, '_') ||
      (selectedType === 'new_product' && (typeNormalized === 'New Product' || typeNormalized === 'new_product')) ||
      (selectedType === 'new_version' && (typeNormalized === 'New Version' || typeNormalized === 'update')) ||
      (selectedType === 'free_software' && (typeNormalized === 'Free Software' || typeNormalized === 'new_free_app')) ||
      (selectedType === 'deal' && (typeNormalized === 'Deal' || typeNormalized === 'deal')) ||
      (selectedType === 'giveaway' && (typeNormalized === 'Giveaway' || typeNormalized === 'giveaway'));

    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type?: string) => {
    const t = type || 'General';
    if (t === 'New Product' || t === 'new_product') {
      return { label: 'New Product', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: Sparkles };
    }
    if (t === 'New Version' || t === 'update') {
      return { label: 'Version Update', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: RotateCw };
    }
    if (t === 'Free Software' || t === 'new_free_app') {
      return { label: 'Free Software', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: Gift };
    }
    if (t === 'Deal' || t === 'deal') {
      return { label: 'Special Deal', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Flame };
    }
    if (t === 'Giveaway' || t === 'giveaway') {
      return { label: 'Giveaway', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Gift };
    }
    return { label: 'Marketplace Update', color: 'bg-slate-700/50 text-slate-300 border-slate-600', icon: Bell };
  };

  const handleOpenRelatedProduct = (productId?: string) => {
    if (!productId) return;
    const targetProd = products.find((p) => p.id === productId);
    if (targetProd && onOpenProductDetails) {
      setActiveAnnouncementModal(null);
      onOpenProductDetails(targetProd);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a101d] to-slate-900 border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Developer Bulletins</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Product & Developer Announcements
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Stay informed with verified updates directly from Aftab. Discover new software launches, latest APK versions, changelogs, promotional deals, and community giveaways.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'new_product', label: '🚀 New Products' },
            { id: 'new_version', label: '🔄 Updates & Versions' },
            { id: 'free_software', label: '🆓 Free Releases' },
            { id: 'deal', label: '🔥 Deals & Discounts' },
            { id: 'giveaway', label: '🎁 Giveaways' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulletins & news..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">No Announcements Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            There are currently no active public announcements under this category. Check back soon for new software releases and updates!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAnnouncements.map((ann) => {
            const badge = getTypeBadge(ann.announcementType || ann.type);
            const BadgeIcon = badge.icon;
            const relatedProduct = products.find((p) => p.id === (ann.relatedProductId || ann.productId));
            const dateFormatted = ann.publishedAt || ann.createdAt
              ? new Date(ann.publishedAt || ann.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recent';

            return (
              <div
                key={ann.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#090d16] border border-white/10 hover:border-cyan-500/40 p-5 shadow-xl transition-all duration-200"
              >
                <div className="space-y-3.5">
                  {/* Card Header & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${badge.color}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      {dateFormatted}
                    </span>
                  </div>

                  {/* Banner Image if available */}
                  {ann.image && (
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-white/5">
                      <img
                        src={ann.image}
                        alt={ann.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-base font-bold text-white font-mono group-hover:text-cyan-300 transition-colors leading-snug">
                    {ann.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {ann.shortDescription || ann.message || ann.fullContent}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveAnnouncementModal(ann)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <span>Read Full Note</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {relatedProduct && (
                    <button
                      onClick={() => handleOpenRelatedProduct(relatedProduct.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      title="View linked product"
                    >
                      <span>View Product</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Announcement Detail Modal */}
      {activeAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {(() => {
                    const b = getTypeBadge(activeAnnouncementModal.announcementType || activeAnnouncementModal.type);
                    const Icon = b.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${b.color}`}>
                        <Icon className="w-3 h-3" />
                        <span>{b.label}</span>
                      </span>
                    );
                  })()}
                  <span className="text-xs font-mono text-slate-500">
                    {new Date(activeAnnouncementModal.publishedAt || activeAnnouncementModal.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {activeAnnouncementModal.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveAnnouncementModal(null)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media */}
            {activeAnnouncementModal.image && (
              <div className="w-full max-h-72 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                <img
                  src={activeAnnouncementModal.image}
                  alt={activeAnnouncementModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Full Content */}
            <div className="space-y-4 text-slate-200 text-sm font-sans leading-relaxed">
              <p className="font-medium text-slate-100 bg-white/5 p-4 rounded-xl border border-white/5">
                {activeAnnouncementModal.shortDescription || activeAnnouncementModal.message}
              </p>

              {activeAnnouncementModal.fullContent && (
                <div className="whitespace-pre-line text-slate-300">
                  {activeAnnouncementModal.fullContent}
                </div>
              )}
            </div>

            {/* Related Product Action Button */}
            {activeAnnouncementModal.relatedProductId && (() => {
              const rel = products.find(p => p.id === activeAnnouncementModal.relatedProductId);
              if (!rel) return null;
              return (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Featured Marketplace Item
                    </span>
                    <h4 className="text-sm font-bold text-white font-mono">{rel.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {rel.pricingType === 'free' ? '100% Free' : `PKR ${rel.price.toLocaleString()}`} • v{rel.version}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenRelatedProduct(rel.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20 transition-colors"
                  >
                    <span>Inspect Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={() => setActiveAnnouncementModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 text-xs font-mono cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
