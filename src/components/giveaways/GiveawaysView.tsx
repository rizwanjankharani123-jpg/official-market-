import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GiveawayRecord, Product } from '../../types';
import {
  Gift,
  Trophy,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Award,
  Image as ImageIcon,
  ChevronRight,
  Clock
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../utils/notifications';

interface GiveawaysViewProps {
  onOpenProductDetails?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const GiveawaysView: React.FC<GiveawaysViewProps> = ({
  onOpenProductDetails,
  onSelectProduct
}) => {
  const { giveaways, products, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'winners'>('active');
  const [inspectingWinnerProof, setInspectingWinnerProof] = useState<string | null>(null);

  const activeGiveaways = giveaways.filter(
    (g) => g.status === 'active' || g.status === 'upcoming'
  );

  // Only officially published winner records appear in the public archive
  const winnersArchive = giveaways.filter(
    (g) => g.published && (g.status === 'ended' || g.status === 'archived' || g.winnerName)
  );

  const maskName = (name?: string) => {
    if (!name) return 'Verified Winner';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return `${parts[0].substring(0, 3)}***`;
    }
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a1128] via-[#090d16] to-[#0c1824] border border-purple-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Official Giveaways & Permanent Winners Hall</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Marketplace Giveaways & Winners Archive
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Participate in official developer giveaways for free software licenses and source code packages, and view our transparent, verified archive of previous winners.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Active Giveaways ({activeGiveaways.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('winners')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'winners'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>🏆 Public Winners Archive ({winnersArchive.length})</span>
        </button>
      </div>

      {/* View Content */}
      {activeTab === 'active' ? (
        /* ACTIVE GIVEAWAYS TAB */
        <div className="space-y-6">
          {activeGiveaways.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                <Gift className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-white font-mono">No Active Giveaways Right Now</h3>
                <p className="text-xs text-slate-400">
                  Join our official WhatsApp Channel to get notified the second a new software giveaway goes live!
                </p>
              </div>
              <a
                href={settings.whatsappChannel || `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Join Official WhatsApp Channel</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGiveaways.map((gw) => {
                const isUpcoming = gw.status === 'upcoming';
                const relatedProd = products.find((p) => p.id === gw.relatedProductId);

                return (
                  <div
                    key={gw.id}
                    className="flex flex-col justify-between rounded-3xl bg-[#090d16] border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                            isUpcoming
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          }`}
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>{isUpcoming ? 'UPCOMING EVENT' : 'LIVE ENTRY OPEN'}</span>
                        </span>

                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Ends: {gw.endDate || 'TBA'}</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white font-mono">{gw.title}</h3>
                        <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-0.5">
                          <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">
                            Prize Package
                          </span>
                          <p className="text-sm font-bold text-white font-mono">{gw.prizeDescription}</p>
                        </div>
                        {gw.description && (
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{gw.description}</p>
                        )}
                      </div>

                      {relatedProd && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-slate-500 uppercase">
                              Linked Software
                            </span>
                            <div className="text-xs font-bold text-white font-mono truncate">
                              {relatedProd.name}
                            </div>
                          </div>
                          {onOpenProductDetails && (
                            <button
                              onClick={() => onOpenProductDetails(relatedProd)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-[10px] font-mono cursor-pointer transition-colors"
                            >
                              Inspect
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                      <a
                        href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi Aftab, I would like to enter the giveaway: ${gw.title} (Ref: ${gw.id})`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Enter Giveaway via Official WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* WINNERS ARCHIVE TAB */
        <div className="space-y-6">
          {winnersArchive.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">Archive Updating</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No past winner records have been officially published to the public archive yet. Check back following our active giveaways!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winnersArchive.map((gw) => {
                const maskedName = maskName(gw.winnerName);
                const relatedProd = products.find((p) => p.id === gw.relatedProductId);

                return (
                  <div
                    key={gw.id}
                    className="flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#16120b] to-[#090d16] border border-amber-500/40 p-6 shadow-2xl space-y-5 text-left"
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span>VERIFIED WINNER</span>
                        </span>

                        <span className="text-[11px] font-mono text-slate-500">
                          {gw.winnerAnnouncedAt || gw.endDate || 'Archived'}
                        </span>
                      </div>

                      {/* Giveaway Title & Prize */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-white font-mono leading-snug">
                          {gw.title}
                        </h3>
                        <p className="text-xs text-amber-300/90 font-mono font-semibold">
                          Prize: {gw.prizeDescription}
                        </p>
                      </div>

                      {/* Winner Card */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white font-mono">{maskedName}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                          {gw.winnerCity && <span>📍 {gw.winnerCity}</span>}
                          {gw.winnerEmailMasked && <span>• {gw.winnerEmailMasked}</span>}
                        </div>
                      </div>

                      {/* Proof Thumbnail if available */}
                      {gw.proofImageUrl && (
                        <button
                          onClick={() => setInspectingWinnerProof(gw.proofImageUrl!)}
                          className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Inspect Verified Proof Screenshot</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Ref: {gw.id}</span>
                      <span className="text-emerald-400">Delivered 100%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Proof Inspection Modal */}
      {inspectingWinnerProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white font-mono">Winner Award & Verification Proof</h3>
              <button
                onClick={() => setInspectingWinnerProof(null)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black border border-white/10 max-h-[70vh]">
              <img
                src={inspectingWinnerProof}
                alt="Proof"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
