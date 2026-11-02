// ==============================================================================
// ShopSphere AI — Smart Budget Guardian Domain Types
// ==============================================================================

export type BudgetStatusTier = 'healthy' | 'caution' | 'exceeded';

export interface BudgetSettings {
  monthlyLimit: number;
  period: 'monthly' | 'custom';
  alertsEnabled: boolean;
  currency: string;
  updatedAt: number;
}

export interface BudgetEvaluation {
  monthlyLimit: number;
  spentFromOrders: number;
  pendingCartTotal: number;
  totalCommitted: number;
  remainingBudget: number;
  percentageUsed: number;
  status: BudgetStatusTier;
  statusMessage: string;
  affordsCart: boolean;
}

export interface AffordabilityCheck {
  canAfford: boolean;
  price: number;
  currentRemaining: number;
  remainingAfter: number;
  willExceed: boolean;
  excessAmount: number;
}
