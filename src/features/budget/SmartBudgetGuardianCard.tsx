// ==============================================================================
// ShopSphere AI — Smart Budget Guardian Card Component
// Palette: Midnight Teal (#0B1F26), Deep Teal (#12343B), Emerald (#059669), Mint (#A7F3D0)
// Calculates real-time spending from verified orders and live cart
// ==============================================================================

import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ShoppingBag,
  Sliders,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useCartStore } from '@/store/useCartStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/lib/router';

interface SmartBudgetGuardianCardProps {
  variant?: 'full' | 'compact' | 'hero';
}

export const SmartBudgetGuardianCard: React.FC<SmartBudgetGuardianCardProps> = ({
  variant = 'full',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [calculatorPrice, setCalculatorPrice] = useState('');
  const [affordabilityResult, setAffordabilityResult] = useState<ReturnType<
    typeof useBudgetStore.getState.prototype.checkAffordability
  > | null>(null);

  const monthlyLimit = useBudgetStore((state) => state.monthlyLimit);
  const setMonthlyLimit = useBudgetStore((state) => state.setMonthlyLimit);
  const resetBudget = useBudgetStore((state) => state.resetBudget);
  const getEvaluation = useBudgetStore((state) => state.getEvaluation);
  const checkAffordability = useBudgetStore((state) => state.checkAffordability);

  // Subscribe to store updates to keep evaluation live
  const orders = useOrdersStore((state) => state.orders);
  const cartItems = useCartStore((state) => state.items);

  const evaluation = React.useMemo(() => {
    return getEvaluation();
  }, [monthlyLimit, orders, cartItems, getEvaluation]);

  const {
    spentFromOrders,
    pendingCartTotal,
    totalCommitted,
    remainingBudget,
    percentageUsed,
    status,
    statusMessage,
    affordsCart,
  } = evaluation;

  const handleSetPreset = (amount: number) => {
    setMonthlyLimit(amount);
    setIsEditing(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customInput);
    if (!isNaN(val) && val > 0) {
      setMonthlyLimit(val);
      setCustomInput('');
      setIsEditing(false);
    }
  };

  const handleTestAffordability = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(calculatorPrice);
    if (!isNaN(price) && price > 0) {
      setAffordabilityResult(checkAffordability(price));
    }
  };

  const statusConfig = {
    healthy: {
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      barColor: 'bg-gradient-to-r from-emerald-500 to-[#A7F3D0]',
      label: 'Safe Guardrail',
      icon: CheckCircle2,
    },
    caution: {
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      barColor: 'bg-gradient-to-r from-amber-500 to-amber-300',
      label: 'Approaching Limit',
      icon: AlertTriangle,
    },
    exceeded: {
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      barColor: 'bg-gradient-to-r from-rose-500 to-rose-400',
      label: 'Exceeded Guardrail',
      icon: AlertTriangle,
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  if (variant === 'compact') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B1F26] text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Smart Budget Guardian</p>
              <p className="text-[11px] text-gray-500">
                {formatCurrency(remainingBudget)} remaining
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusConfig.badgeBg}`}
          >
            <StatusIcon className="h-3 w-3" />
            <span>{statusConfig.label}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full transition-all duration-500 ${statusConfig.barColor}`}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Committed: {formatCurrency(totalCommitted)}</span>
            <span>Limit: {formatCurrency(monthlyLimit)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-900/40 bg-[#0B1F26] text-white shadow-2xl">
      {/* Decorative emerald glow orb */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#12343B]/80 blur-3xl" />

      {/* Top Header Bar */}
      <div className="relative z-10 border-b border-gray-800/80 bg-[#12343B]/40 px-6 py-5 backdrop-blur-md sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Smart Budget Guardian
                </h3>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-[#A7F3D0]">
                  Real-Time Spending Intelligence
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Automatically syncs with verified orders and live cart to keep your shopping calibrated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border backdrop-blur-md ${statusConfig.badgeBg}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{statusConfig.label}</span>
            </span>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex h-8 items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/70 px-3 text-xs font-semibold text-gray-300 hover:border-emerald-400 hover:text-white transition-all cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isEditing ? 'Done' : 'Adjust Limit'}</span>
            </button>
          </div>
        </div>

        {/* Budget Editor Panel */}
        {isEditing && (
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-[#0B1F26]/90 p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#A7F3D0]">Select Quick Budget Limit:</span>
              <span className="text-gray-400">Current: {formatCurrency(monthlyLimit)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[300, 500, 750, 1000, 1500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSetPreset(preset)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                    monthlyLimit === preset
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : 'bg-gray-800/80 text-gray-300 border-gray-700 hover:border-emerald-400 hover:text-white'
                  }`}
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1 max-w-sm">
              <Input
                type="number"
                min="50"
                step="10"
                placeholder="Custom limit (e.g., $650)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="h-8 text-xs bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500 rounded-xl"
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer shrink-0"
              >
                Save
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Main Budget Metrics Grid */}
      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Tile 1: Monthly Limit */}
          <div className="rounded-2xl border border-gray-800 bg-[#12343B]/30 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Guardrail Limit
            </span>
            <p className="mt-1 text-2xl font-black text-white tabular-nums">
              {formatCurrency(monthlyLimit)}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">Monthly Target</p>
          </div>

          {/* Tile 2: Spent from Real Orders */}
          <div className="rounded-2xl border border-gray-800 bg-[#12343B]/30 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Purchased Spend
            </span>
            <p className="mt-1 text-2xl font-black text-emerald-300 tabular-nums">
              {formatCurrency(spentFromOrders)}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {orders.length} verified {orders.length === 1 ? 'order' : 'orders'}
            </p>
          </div>

          {/* Tile 3: Pending Cart */}
          <div className="rounded-2xl border border-gray-800 bg-[#12343B]/30 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0]">
              Pending in Cart
            </span>
            <p className="mt-1 text-2xl font-black text-white tabular-nums">
              {formatCurrency(pendingCartTotal)}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {cartItems.length} active {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Tile 4: Safe Remaining */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Safe Remaining
            </span>
            <p className="mt-1 text-2xl font-black text-[#A7F3D0] tabular-nums">
              {formatCurrency(remainingBudget)}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-200/80">Available balance</p>
          </div>
        </div>

        {/* Visual Progress Bar with Glow */}
        <div className="space-y-2 rounded-2xl border border-gray-800 bg-[#12343B]/20 p-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">
              Monthly Budget Utilization ({percentageUsed}%)
            </span>
            <span className="font-mono text-xs font-bold text-gray-400">
              {formatCurrency(totalCommitted)} / {formatCurrency(monthlyLimit)}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-900 border border-gray-800">
            <div
              className={`h-full transition-all duration-700 rounded-full ${statusConfig.barColor}`}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
            <Info className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>

        {/* Live Affordability Calculator */}
        <div className="rounded-2xl border border-gray-800/80 bg-[#12343B]/30 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#A7F3D0]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Affordability Pre-Check
              </h4>
            </div>
            <span className="text-[11px] text-gray-400">
              Test whether a prospective purchase stays inside your guardrail
            </span>
          </div>

          <form onSubmit={handleTestAffordability} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="number"
              step="0.01"
              min="1"
              placeholder="Enter item price (e.g., $149.00)"
              value={calculatorPrice}
              onChange={(e) => setCalculatorPrice(e.target.value)}
              className="h-10 text-xs bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500 rounded-xl"
            />
            <Button
              type="submit"
              className="h-10 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer shrink-0"
            >
              Verify Guardrail
            </Button>
          </form>

          {affordabilityResult && (
            <div
              className={`mt-2 rounded-xl p-3 text-xs border flex items-start gap-2.5 ${
                affordabilityResult.canAfford
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              }`}
            >
              {affordabilityResult.canAfford ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      Guaranteed Affordable: Fits comfortably in your budget.
                    </p>
                    <p className="text-[11px] text-emerald-300 mt-0.5">
                      Purchasing {formatCurrency(affordabilityResult.price)} leaves you with{' '}
                      <strong>{formatCurrency(affordabilityResult.remainingAfter)}</strong> safe
                      remaining buffer.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">
                      Exceeds Guardrail by {formatCurrency(affordabilityResult.excessAmount)}
                    </p>
                    <p className="text-[11px] text-rose-300 mt-0.5">
                      Current safe balance is {formatCurrency(affordabilityResult.currentRemaining)}
                      . Adjust cart or update your monthly limit to accommodate.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
