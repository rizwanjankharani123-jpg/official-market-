import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ShieldCheck,
  Search,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
  Gift,
  Coins,
  CheckCircle2
} from 'lucide-react';

export const CustomerRewardsView: React.FC = () => {
  const { settings, getCustomerRewards, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { totalPoints, eligibleOrders } = getCustomerRewards(submittedQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const pointsRate = settings.rewardPointsPer100PKR || 1;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-left space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>💎 CUSTOMER LOYALTY & REWARDS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Client Rewards Program
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Earn verified rewards on every completed software purchase or custom engineering project. Points are automatically credited to your customer record upon payment confirmation.
        </p>
      </div>

      {/* Rewards Rules Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base font-mono">Real Earning Rate</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Earn <strong>{pointsRate} Reward Point</strong> for every PKR 100 spent on verified commercial software or custom development contracts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base font-mono">100% Genuine Activity</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Points are securely calculated from payment-audited Firestore transactions. No fake starting bonuses or synthetic numbers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Gift className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base font-mono">Direct Redemption</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Redeem points as direct credit vouchers toward future custom development contracts, architecture upgrades, or commercial packages.
          </p>
        </div>
      </div>

      {/* Balance Lookup Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-amber-500/30 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Check Your Reward Balance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter the email address or phone number used during your software purchases.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. client@example.com or +92 300 1234567"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Lookup Rewards
          </button>
        </form>

        {/* Results Area */}
        {submittedQuery && (
          <div className="pt-6 border-t border-white/10 space-y-6 animate-in fade-in">
            {eligibleOrders.length === 0 ? (
              <div className="py-10 text-center rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <Coins className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-bold text-sm text-white font-mono">No confirmed orders found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We could not find any completed purchases associated with "{submittedQuery}". Rewards appear here as soon as payments are audited and confirmed.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Total Balance Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                      Verified Rewards Account
                    </span>
                    <p className="text-sm font-mono text-slate-300 mt-1">{submittedQuery}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono text-slate-400">Total Reward Points</span>
                    <p className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                      {totalPoints.toLocaleString()} <span className="text-sm text-white font-normal">PTS</span>
                    </p>
                    <p className="text-[11px] text-emerald-400 font-mono">
                      ≈ PKR {totalPoints.toLocaleString()} Redemption Value
                    </p>
                  </div>
                </div>

                {/* Eligible Orders Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Reward-Eligible Order History ({eligibleOrders.length})
                  </h3>

                  <div className="space-y-2">
                    {eligibleOrders.map((order) => {
                      const points = Math.floor((order.amount || 0) / 100) * pointsRate;

                      return (
                        <div
                          key={order.id}
                          className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-cyan-300 font-bold">{order.id}</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                                Confirmed
                              </span>
                            </div>
                            <p className="font-bold text-sm text-white mt-1">{order.productName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              Paid: PKR {order.amount.toLocaleString()} • {new Date(order.confirmedAt || order.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">Earned</span>
                            <p className="font-bold text-amber-400 font-mono text-sm">+{points} PTS</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
