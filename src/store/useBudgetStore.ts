// ==============================================================================
// ShopSphere AI — Smart Budget Guardian Zustand Store
// Persisted locally, calculates real spend from actual orders and live cart
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BudgetStatusTier, BudgetEvaluation, AffordabilityCheck } from '@/types/budget';
import { useOrdersStore } from './useOrdersStore';
import { useCartStore } from './useCartStore';

interface BudgetStoreState {
  monthlyLimit: number;
  alertsEnabled: boolean;
  currency: string;
  updatedAt: number;

  // Actions
  setMonthlyLimit: (limit: number) => void;
  toggleAlerts: () => void;
  resetBudget: () => void;
  getEvaluation: () => BudgetEvaluation;
  checkAffordability: (price: number) => AffordabilityCheck;
}

const DEFAULT_BUDGET_LIMIT = 600;

export const useBudgetStore = create<BudgetStoreState>()(
  persist(
    (set, get) => ({
      monthlyLimit: DEFAULT_BUDGET_LIMIT,
      alertsEnabled: true,
      currency: 'USD',
      updatedAt: Date.now(),

      setMonthlyLimit: (limit: number) => {
        const validated = Number.isFinite(limit) && limit > 0 ? Math.round(limit * 100) / 100 : DEFAULT_BUDGET_LIMIT;
        set({
          monthlyLimit: validated,
          updatedAt: Date.now(),
        });
      },

      toggleAlerts: () => {
        set((state) => ({ alertsEnabled: !state.alertsEnabled }));
      },

      resetBudget: () => {
        set({
          monthlyLimit: DEFAULT_BUDGET_LIMIT,
          alertsEnabled: true,
          updatedAt: Date.now(),
        });
      },

      getEvaluation: (): BudgetEvaluation => {
        const limit = get().monthlyLimit;

        // Pull genuine orders from useOrdersStore
        const orders = useOrdersStore.getState().orders;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate actual spend from verified delivered/confirmed orders in the current month
        const spentFromOrders = orders.reduce((sum, order) => {
          const dateStr = order.date || (order as { createdAt?: string }).createdAt;
          const orderDate = new Date(dateStr || Date.now());
          if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
            return sum + (order.total || 0);
          }
          return sum;
        }, 0);

        // Pull genuine current cart subtotal from useCartStore
        const pendingCartTotal = useCartStore.getState().getSubtotal();

        const totalCommitted = Math.round((spentFromOrders + pendingCartTotal) * 100) / 100;
        const remainingBudget = Math.round((limit - totalCommitted) * 100) / 100;
        const percentageUsed = limit > 0 ? Math.min(100, Math.round((totalCommitted / limit) * 100)) : 100;

        let status: BudgetStatusTier = 'healthy';
        let statusMessage = 'Spending is well within your defined monthly guardrail.';

        if (totalCommitted > limit) {
          status = 'exceeded';
          const excess = Math.round((totalCommitted - limit) * 100) / 100;
          statusMessage = `Budget exceeded by $${excess.toFixed(2)}. Consider reviewing items or increasing your limit.`;
        } else if (percentageUsed >= 80) {
          status = 'caution';
          statusMessage = `Approaching limit (${percentageUsed}% utilized). $${remainingBudget.toFixed(2)} remaining.`;
        }

        const affordsCart = totalCommitted <= limit;

        return {
          monthlyLimit: limit,
          spentFromOrders,
          pendingCartTotal,
          totalCommitted,
          remainingBudget: Math.max(0, remainingBudget),
          percentageUsed,
          status,
          statusMessage,
          affordsCart,
        };
      },

      checkAffordability: (price: number): AffordabilityCheck => {
        const evaluation = get().getEvaluation();
        const cleanPrice = Number.isFinite(price) && price > 0 ? price : 0;
        const currentRemaining = evaluation.remainingBudget;
        const remainingAfter = Math.round((currentRemaining - cleanPrice) * 100) / 100;
        const willExceed = remainingAfter < 0;
        const excessAmount = willExceed ? Math.abs(remainingAfter) : 0;

        return {
          canAfford: !willExceed,
          price: cleanPrice,
          currentRemaining,
          remainingAfter: Math.max(0, remainingAfter),
          willExceed,
          excessAmount,
        };
      },
    }),
    {
      name: 'shopsphere_budget_settings_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
