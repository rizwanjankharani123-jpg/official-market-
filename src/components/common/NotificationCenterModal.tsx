import React from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceAnnouncement, AnnouncementType } from '../../types';
import {
  Bell,
  X,
  CheckCircle2,
  Sparkles,
  Gift,
  Flame,
  Layers,
  ArrowRight,
  ExternalLink,
  Clock
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    announcements,
    readAnnouncementIds,
    markAnnouncementAsRead,
    markAllAnnouncementsAsRead,
    setActiveView
  } = useApp();

  if (!isOpen) return null;

  const activeAnnouncements = announcements.filter((a) => a.active);

  const getIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'new_free_app':
        return <Gift className="w-4 h-4 text-emerald-400" />;
      case 'new_product':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'deal':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'update':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'giveaway':
        return <Gift className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'new_free_app':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'new_product':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'deal':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'update':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'giveaway':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleAnnouncementClick = (ann: MarketplaceAnnouncement) => {
    markAnnouncementAsRead(ann.id);
    if (ann.linkView) {
      setActiveView(ann.linkView);
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#090d16] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5 text-left max-h-[85vh] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base font-mono">Marketplace Notifications</h2>
              <p className="text-xs text-slate-400">Live releases, new free apps, system updates, and deals.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeAnnouncements.length > 0 && (
              <button
                onClick={markAllAnnouncementsAsRead}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {activeAnnouncements.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300 font-mono">No new announcements</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Official releases, promotions, and updates published by Aftab will appear here.
              </p>
            </div>
          ) : (
            activeAnnouncements.map((ann) => {
              const isRead = readAnnouncementIds.includes(ann.id);
              const aType = (ann.type || ann.announcementType || 'general') as AnnouncementType;

              return (
                <div
                  key={ann.id}
                  onClick={() => handleAnnouncementClick(ann)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
                    isRead
                      ? 'bg-slate-950/60 border-white/5 opacity-75 hover:opacity-100 hover:border-white/10'
                      : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400 shadow-md shadow-cyan-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="p-1 rounded-lg bg-black/40 border border-white/5">
                        {getIcon(aType)}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border font-bold ${getTypeBadge(aType)}`}>
                        {String(aType).replace(/_/g, ' ')}
                      </span>
                      {!isRead && (
                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ann.message}
                  </p>

                  {ann.linkView && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveView('announcements');
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>View All Announcements & News 📢</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            AFFY OFFICIAL Verified Bulletins
          </span>
        </div>
      </div>
    </div>
  );
};
