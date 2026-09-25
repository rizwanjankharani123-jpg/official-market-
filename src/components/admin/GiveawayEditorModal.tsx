import React, { useState } from 'react';
import { GiveawayRecord, GiveawayStatus, Product } from '../../types';
import {
  X,
  Gift,
  Trophy,
  UserCheck,
  Calendar,
  Image,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GiveawayEditorModalProps {
  giveaway: Partial<GiveawayRecord> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<GiveawayRecord>) => Promise<void>;
}

export const GiveawayEditorModal: React.FC<GiveawayEditorModalProps> = ({
  giveaway,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const { products } = useApp();

  const [formData, setFormData] = useState<Partial<GiveawayRecord>>({
    title: giveaway?.title || '',
    description: giveaway?.description || '',
    prizeDescription: giveaway?.prizeDescription || 'Full Source Code + Lifetime License',
    relatedProductId: giveaway?.relatedProductId || '',
    startDate: giveaway?.startDate || new Date().toISOString().split('T')[0],
    endDate: giveaway?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: giveaway?.status || 'active',
    winnerName: giveaway?.winnerName || '',
    winnerEmailMasked: giveaway?.winnerEmailMasked || '',
    winnerCity: giveaway?.winnerCity || '',
    winnerAnnouncedAt: giveaway?.winnerAnnouncedAt || '',
    proofImageUrl: giveaway?.proofImageUrl || '',
    adminNotes: giveaway?.adminNotes || '',
    published: giveaway?.published ?? false,
    ...giveaway
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setErrorMessage('Giveaway title is required.');
      return;
    }
    if (!formData.prizeDescription?.trim()) {
      setErrorMessage('Prize description is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save giveaway.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 text-left my-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white text-base font-mono">
              {giveaway?.id ? 'Edit Giveaway / Winner Record' : 'Create Marketplace Giveaway'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Section 1: Basic Giveaway Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider pb-1 border-b border-white/5">
              1. Giveaway Event Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Giveaway Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ultimate POS System Free License Giveaway"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Event Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as GiveawayStatus })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="upcoming">⏱️ Upcoming / Pre-Registration</option>
                  <option value="active">🟢 Active & Running</option>
                  <option value="ended">🏆 Ended / Winners Drawn</option>
                  <option value="archived">📦 Archived Record</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Prize Description *</label>
              <input
                type="text"
                value={formData.prizeDescription}
                onChange={(e) => setFormData({ ...formData, prizeDescription: e.target.value })}
                placeholder="e.g. 1x Commercial Android Source Code + Lifetime License"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Event Rules & Summary</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Explain entry requirements (e.g. WhatsApp channel member, previous buyer)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Related Product (Optional Link)</label>
              <select
                value={formData.relatedProductId || ''}
                onChange={(e) => setFormData({ ...formData, relatedProductId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="">-- None (Standalone Prize) --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.pricingType === 'free' ? 'FREE' : `PKR ${p.price}`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Winner Announcement & Proof */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider pb-1 border-b border-white/5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Official Winner Information & Archive</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Winner Full Name</label>
                <input
                  type="text"
                  value={formData.winnerName || ''}
                  onChange={(e) => setFormData({ ...formData, winnerName: e.target.value })}
                  placeholder="e.g. Muhammad Rizwan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Masked Email</label>
                <input
                  type="text"
                  value={formData.winnerEmailMasked || ''}
                  onChange={(e) => setFormData({ ...formData, winnerEmailMasked: e.target.value })}
                  placeholder="e.g. riz***@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">City / Location</label>
                <input
                  type="text"
                  value={formData.winnerCity || ''}
                  onChange={(e) => setFormData({ ...formData, winnerCity: e.target.value })}
                  placeholder="e.g. Karachi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Winner Announced Date</label>
                <input
                  type="date"
                  value={formData.winnerAnnouncedAt || ''}
                  onChange={(e) => setFormData({ ...formData, winnerAnnouncedAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Proof Screenshot URL (Optional)</label>
                <input
                  type="url"
                  value={formData.proofImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, proofImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Admin Private Notes</label>
              <input
                type="text"
                value={formData.adminNotes || ''}
                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                placeholder="Internal verification notes, transaction or contact details..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="gw_published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded bg-slate-950 border-white/10 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="gw_published" className="text-xs font-mono text-slate-300 cursor-pointer">
                Publish to Official Public Winners Archive
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono cursor-pointer hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-black" />
              <span>{isSubmitting ? 'Saving...' : 'Save Giveaway Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
