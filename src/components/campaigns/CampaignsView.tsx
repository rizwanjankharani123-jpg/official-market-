import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampaignEvent, Product } from '../../types';
import {
  Calendar,
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  Gift,
  CheckCircle2,
  Tag,
  Package,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface CampaignsViewProps {
  onSelectProduct?: (product: Product) => void;
  onOpenProductDetails?: (product: Product) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  onSelectProduct,
  onOpenProductDetails
}) => {
  const { campaigns, products, setActiveView } = useApp();
  const [selectedTab, setSelectedTab] = useState<'live' | 'scheduled' | 'all'>('live');

  const now = new Date();

  // Filter campaigns
  const evaluatedCampaigns = campaigns.map((c) => {
    const start = c.startDate ? new Date(c.startDate) : new Date(0);
    const end = c.endDate ? new Date(c.endDate + 'T23:59:59') : new Date(8640000000000000);

    let calculatedStatus = c.status;
    if (c.status !== 'draft') {
      if (now < start) {
        calculatedStatus = 'scheduled';
      } else if (now > end) {
        calculatedStatus = 'ended';
      } else {
        calculatedStatus = 'live';
      }
    }
    return { ...c, runtimeStatus: calculatedStatus };
  });

  const liveCampaigns = evaluatedCampaigns.filter((c) => c.runtimeStatus === 'live');
  const scheduledCampaigns = evaluatedCampaigns.filter((c) => c.runtimeStatus === 'scheduled');
  const allPublicCampaigns = evaluatedCampaigns.filter((c) => c.runtimeStatus !== 'draft');

  const displayedList =
    selectedTab === 'live'
      ? liveCampaigns
      : selectedTab === 'scheduled'
      ? scheduledCampaigns
      : allPublicCampaigns;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/50 via-[#090d16] to-indigo-950/40 border border-cyan-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>Seasonal Events & Festival Specials</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Campaigns & Marketplace Events
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Explore active promotional seasons, software release festivals, bundle flash discounts, and scheduled developer campaigns organized by Aftab.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setSelectedTab('live')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTab === 'live'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Now ({liveCampaigns.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('scheduled')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTab === 'scheduled'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Upcoming Events ({scheduledCampaigns.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
            selectedTab === 'all'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <span>All Events ({allPublicCampaigns.length})</span>
        </button>
      </div>

      {/* Campaigns List */}
      {displayedList.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">
            {selectedTab === 'live'
              ? 'No Live Campaigns Active Today'
              : selectedTab === 'scheduled'
              ? 'No Scheduled Upcoming Events'
              : 'No Event Records Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Stay tuned! Flash sales and seasonal promotions are announced here and in the notification center.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedList.map((campaign) => {
            const isLive = campaign.runtimeStatus === 'live';
            const isUpcoming = campaign.runtimeStatus === 'scheduled';
            const linkedProducts = products.filter((p) =>
              (campaign.featuredProductIds || []).includes(p.id)
            );

            return (
              <div
                key={campaign.id}
                className={`relative rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-6 text-left ${
                  isLive
                    ? 'bg-gradient-to-r from-[#090d16] via-[#0d1627] to-[#090d16] border-cyan-500/40'
                    : 'bg-[#090d16] border-white/10'
                }`}
              >
                {/* Top Status & Date Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase border ${
                        isLive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : isUpcoming
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isLive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                      <span>{isLive ? 'LIVE NOW' : isUpcoming ? 'UPCOMING' : 'CONCLUDED'}</span>
                    </span>

                    {campaign.discountPercentage ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 uppercase">
                        {campaign.discountPercentage}% Discount Active
                      </span>
                    ) : null}
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {campaign.startDate} to {campaign.endDate}
                    </span>
                  </div>
                </div>

                {/* Banner & Description Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-mono leading-tight">
                      {campaign.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {campaign.description}
                    </p>
                    {campaign.offerDescription && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                        <Tag className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Perk: {campaign.offerDescription}</span>
                      </div>
                    )}
                  </div>

                  {campaign.bannerImage && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                      <img
                        src={campaign.bannerImage}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Linked Products Grid */}
                {linkedProducts.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Featured Event Software ({linkedProducts.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {linkedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-cyan-500/30 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-bold text-white font-mono truncate">{prod.name}</h4>
                            <p className="text-[11px] text-cyan-400 font-mono">
                              {prod.pricingType === 'free' ? '100% Free' : `PKR ${prod.price.toLocaleString()}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            {onOpenProductDetails && (
                              <button
                                onClick={() => onOpenProductDetails(prod)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-[10px] font-mono cursor-pointer transition-colors"
                              >
                                View
                              </button>
                            )}
                            {onSelectProduct && (
                              <button
                                onClick={() => onSelectProduct(prod)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] font-mono cursor-pointer transition-colors"
                              >
                                Buy
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
