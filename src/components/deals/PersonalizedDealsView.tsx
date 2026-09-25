import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PersonalizedDeal, Product } from '../../types';
import {
  Tag,
  Sparkles,
  Percent,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  Calendar,
  Gift,
  Copy,
  Check,
  ShoppingBag
} from 'lucide-react';

interface PersonalizedDealsViewProps {
  onSelectProduct?: (product: Product) => void;
  onOpenProductDetails?: (product: Product) => void;
}

export const PersonalizedDealsView: React.FC<PersonalizedDealsViewProps> = ({
  onSelectProduct,
  onOpenProductDetails
}) => {
  const { orders, products, setActiveView, deals } = useApp();
  const [customerLookup, setCustomerLookup] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Derive active deals
  const now = new Date();
  const activeDeals = deals.filter((d) => {
    if (!d.active) return false;
    if (d.startDate && new Date(d.startDate) > now) return false;
    if (d.endDate && new Date(d.endDate + 'T23:59:59') < now) return false;
    return true;
  });

  // Calculate customer order history
  const cleanInput = customerLookup.trim().toLowerCase();
  const customerOrders = cleanInput
    ? orders.filter((o) => {
        const isMatch =
          (o.customerEmail && o.customerEmail.toLowerCase() === cleanInput) ||
          (o.customerPhone && o.customerPhone.trim() === customerLookup.trim()) ||
          o.id.toLowerCase() === cleanInput;
        const isConfirmed = o.status === 'payment_confirmed' || o.status === 'completed';
        return isMatch && isConfirmed;
      })
    : [];

  const purchasedCategories = new Set<string>();
  customerOrders.forEach((o) => {
    const prod = products.find((p) => p.id === o.productId);
    if (prod?.category) purchasedCategories.add(prod.category);
  });

  // Check eligibility for a specific deal
  const isEligible = (deal: PersonalizedDeal): { eligible: boolean; reason: string } => {
    if (deal.eligibilityCondition === 'all_customers') {
      return { eligible: true, reason: 'Unlocked for all marketplace visitors' };
    }

    if (!cleanInput) {
      return {
        eligible: false,
        reason: 'Enter your verified purchase email or phone to check eligibility'
      };
    }

    if (deal.eligibilityCondition === 'previous_buyers') {
      if (customerOrders.length >= 1) {
        return { eligible: true, reason: `Unlocked: Verified buyer with ${customerOrders.length} order(s)` };
      }
      return { eligible: false, reason: 'Requires at least 1 verified purchase' };
    }

    if (deal.eligibilityCondition === 'min_purchases_2') {
      if (customerOrders.length >= 2) {
        return { eligible: true, reason: `Unlocked: VIP customer with ${customerOrders.length} completed orders` };
      }
      return { eligible: false, reason: 'Requires 2 or more verified orders' };
    }

    if (deal.eligibilityCondition === 'category_buyers') {
      if (deal.targetCategory && purchasedCategories.has(deal.targetCategory)) {
        return { eligible: true, reason: `Unlocked: Prior purchase in ${deal.targetCategory}` };
      }
      if (!deal.targetCategory && customerOrders.length > 0) {
        return { eligible: true, reason: 'Unlocked: Verified buyer' };
      }
      return {
        eligible: false,
        reason: `Requires prior purchase in ${deal.targetCategory || 'target category'}`
      };
    }

    if (deal.eligibilityCondition === 'vip_customers') {
      const totalSpend = customerOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
      if (totalSpend >= 50000 || customerOrders.length >= 3) {
        return { eligible: true, reason: `Unlocked: VIP client with PKR ${totalSpend.toLocaleString()} spend` };
      }
      return { eligible: false, reason: 'Requires PKR 50,000+ spend or 3+ orders' };
    }

    return { eligible: false, reason: 'Condition not met' };
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1b2b] via-[#090d16] to-[#0d1624] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Targeted Customer Loyalty</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Personalized Deals & Perks
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Special discounts and exclusive pricing unlocked exclusively for returning buyers, active clients, and loyal developers based on verified marketplace history.
          </p>
        </div>
      </div>

      {/* Customer Verification Bar */}
      <div className="p-6 rounded-3xl bg-[#090d16] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left w-full sm:w-auto">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Verify Your Customer Account for Tailored Offers</span>
            </h3>
            <p className="text-xs text-slate-400">
              Enter your purchase email, WhatsApp, or Order ID to unlock discounts tied to your real order history.
            </p>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              value={customerLookup}
              onChange={(e) => setCustomerLookup(e.target.value)}
              placeholder="e.g. name@gmail.com or 03XXXXXXXXX"
              className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
            {customerLookup && (
              <button
                onClick={() => setCustomerLookup('')}
                className="px-3 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {cleanInput && (
          <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono">
            {customerOrders.length > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Found {customerOrders.length} confirmed purchase(s). Exclusive perks unlocked!</span>
              </span>
            ) : (
              <span className="text-slate-400">
                No prior confirmed orders found for this contact. General visitor deals are shown below.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Deals Grid */}
      {activeDeals.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-mono">No Active Deals Right Now</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Check back soon or submit a custom software request to receive special project pricing directly from Aftab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeals.map((deal) => {
            const status = isEligible(deal);
            const isPercent = deal.discountType === 'percentage';

            return (
              <div
                key={deal.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 border shadow-2xl transition-all duration-200 text-left ${
                  status.eligible
                    ? 'bg-gradient-to-b from-[#0c1524] to-[#090d16] border-cyan-500/40 shadow-cyan-950/30'
                    : 'bg-[#090d16]/80 border-white/10 opacity-75'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                        status.eligible
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isPercent ? `${deal.discountValue}% DISCOUNT` : `PKR ${deal.discountValue.toLocaleString()} OFF`}
                      </span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      <span>Valid until {deal.endDate || 'Ongoing'}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white font-mono">{deal.offerName}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{deal.description}</p>
                  </div>

                  {/* Promo Code Box */}
                  {deal.promoCode && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Promo Code</span>
                        <div className="text-xs font-bold font-mono text-cyan-300 tracking-wider">
                          {deal.promoCode}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(deal.promoCode!)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedCode === deal.promoCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCode === deal.promoCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {/* Eligibility Status */}
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2 ${
                      status.eligible
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900/60 border-white/5 text-slate-400'
                    }`}
                  >
                    {status.eligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{status.reason}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveView('software');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs font-mono flex items-center justify-center gap-2 cursor-pointer font-semibold transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Browse Products to Redeem</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
