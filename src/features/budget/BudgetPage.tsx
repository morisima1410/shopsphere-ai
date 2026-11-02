// ==============================================================================
// ShopSphere AI — Smart Budget Guardian Dedicated Page
// Theme: Midnight Teal (#0B1F26), Deep Teal (#12343B), Emerald (#059669), Mint (#A7F3D0)
// ==============================================================================

import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  PieChart,
  Lock,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { SmartBudgetGuardianCard } from './SmartBudgetGuardianCard';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';

export const BudgetPage: React.FC = () => {
  const monthlyLimit = useBudgetStore((state) => state.monthlyLimit);
  const getEvaluation = useBudgetStore((state) => state.getEvaluation);
  const orders = useOrdersStore((state) => state.orders);
  const cartItems = useCartStore((state) => state.items);

  const evaluation = React.useMemo(() => {
    return getEvaluation();
  }, [monthlyLimit, orders, cartItems, getEvaluation]);

  return (
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Hero Banner with Midnight Teal background and Emerald Glow */}
      <section className="teal-hero-gradient border-b border-emerald-950 py-12 sm:py-16 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1 text-xs font-bold text-[#A7F3D0] backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Autonomous Financial Guardrail</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Smart Budget Guardian
              </h1>
              <p className="text-sm sm:text-base text-gray-300 font-normal max-w-2xl leading-relaxed">
                Shop with confidence. Set a monthly spending guardrail, view live commitments calculated from verified orders and active carts, and prevent unintentional overspending before checkout.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="h-10 px-5 text-xs font-bold border-gray-700 bg-gray-900/80 text-white hover:bg-gray-800 hover:border-emerald-400 gap-2 rounded-xl cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 text-emerald-400" />
                  <span>My Cart ({cartItems.length})</span>
                </Button>
              </Link>

              <Link to="/orders">
                <Button
                  className="h-10 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <span>Order History ({orders.length})</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* The Core Interactive Guardian Card */}
        <SmartBudgetGuardianCard variant="full" />

        {/* Feature Explanations & Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-400 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F26] text-emerald-400 mb-4 shadow-sm">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Zero Fabricated Metrics
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Every dollar computed reflects genuine orders placed and items currently residing in your cart. No fake analytics or arbitrary estimations.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-400 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F26] text-emerald-400 mb-4 shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Affordability Pre-Check
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Before browsing high-ticket luxury horology or acoustics, simulate item additions to see remaining buffer without altering active shopping sessions.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-400 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F26] text-emerald-400 mb-4 shadow-sm">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Client-Side Local Storage Privacy
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Your budget parameters are strictly kept in your browser local storage. Your financial boundaries remain entirely private and accessible only on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
