import { describe, it, expect, beforeEach } from 'vitest';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useCartStore } from '@/store/useCartStore';

describe('Smart Budget Guardian — Store & Calculations (MOD-AI-BUDGET)', () => {
  beforeEach(() => {
    // Reset Zustand stores
    useBudgetStore.setState({
      monthlyLimit: 1000,
      alertsEnabled: true,
      currency: 'USD',
      updatedAt: Date.now(),
    });

    useOrdersStore.setState({
      orders: [],
    });

    useCartStore.setState({
      items: [],
      savedForLater: [],
    });
  });

  it('updates monthly budget limit accurately', () => {
    const store = useBudgetStore.getState();
    expect(store.monthlyLimit).toBe(1000);

    store.setMonthlyLimit(1500);
    expect(useBudgetStore.getState().monthlyLimit).toBe(1500);
  });

  it('toggles alerts enabled flag', () => {
    const store = useBudgetStore.getState();
    expect(store.alertsEnabled).toBe(true);

    store.toggleAlerts();
    expect(useBudgetStore.getState().alertsEnabled).toBe(false);

    store.toggleAlerts();
    expect(useBudgetStore.getState().alertsEnabled).toBe(true);
  });

  it('calculates spent amount from real orders in the current month', () => {
    const nowIso = new Date().toISOString();
    useOrdersStore.setState({
      orders: [
        {
          id: 'ORD-TEST-1',
          userId: 1,
          date: nowIso,
          currency: 'USD',
          status: 'delivered',
          total: 299,
          items: [
            {
              productId: 1,
              title: 'Aura Studio Wireless ANC',
              price: 299,
              quantity: 1,
              thumbnail: '',
            },
          ],
          shippingAddress: {
            fullName: 'Test User',
            address: '123 Test St',
            city: 'Springfield',
            postalCode: '12345',
            country: 'US',
          },
          paymentMethod: 'card',
        },
        {
          id: 'ORD-TEST-2',
          userId: 1,
          date: nowIso,
          currency: 'USD',
          status: 'delivered',
          total: 349,
          items: [
            {
              productId: 2,
              title: 'Chronos Watch',
              price: 349,
              quantity: 1,
              thumbnail: '',
            },
          ],
          shippingAddress: {
            fullName: 'Test User',
            address: '123 Test St',
            city: 'Springfield',
            postalCode: '12345',
            country: 'US',
          },
          paymentMethod: 'card',
        },
      ],
    });

    const evaluation = useBudgetStore.getState().getEvaluation();
    expect(evaluation.spentFromOrders).toBe(648);
  });

  it('calculates remaining budget taking cart subtotal into account', () => {
    useBudgetStore.getState().setMonthlyLimit(1000);

    const nowIso = new Date().toISOString();
    useOrdersStore.setState({
      orders: [
        {
          id: 'ORD-1',
          userId: 1,
          date: nowIso,
          currency: 'USD',
          status: 'delivered',
          total: 300,
          items: [],
          shippingAddress: {
            fullName: 'Test User',
            address: '123 Test St',
            city: 'Springfield',
            postalCode: '12345',
            country: 'US',
          },
          paymentMethod: 'card',
        },
      ],
    });

    useCartStore.setState({
      items: [
        {
          product: {
            id: 10,
            title: 'Cart item',
            price: 200,
            category: 'acoustics',
            description: 'Test product',
            images: [],
            thumbnail: '',
            rating: 4.8,
            stock: 10,
          },
          quantity: 1,
        },
      ],
      savedForLater: [],
    });

    const evaluation = useBudgetStore.getState().getEvaluation();
    // 1000 limit - 300 spent - 200 cart = 500 remaining
    expect(evaluation.totalCommitted).toBe(500);
    expect(evaluation.remainingBudget).toBe(500);
    expect(evaluation.affordsCart).toBe(true);
  });

  it('evaluates affordability accurately: passes within budget and warns when exceeding', () => {
    useBudgetStore.getState().setMonthlyLimit(500);

    // Check $200 item with $500 remaining budget
    const affordableCheck = useBudgetStore.getState().checkAffordability(200);
    expect(affordableCheck.canAfford).toBe(true);
    expect(affordableCheck.willExceed).toBe(false);
    expect(affordableCheck.remainingAfter).toBe(300);

    // Check $600 item which exceeds $500 budget
    const overBudgetCheck = useBudgetStore.getState().checkAffordability(600);
    expect(overBudgetCheck.canAfford).toBe(false);
    expect(overBudgetCheck.willExceed).toBe(true);
    expect(overBudgetCheck.excessAmount).toBe(100);
  });

  it('evaluates budget health tier correctly (healthy, caution, exceeded)', () => {
    useBudgetStore.getState().setMonthlyLimit(1000);

    // 1. Healthy state (0% used)
    let evaluation = useBudgetStore.getState().getEvaluation();
    expect(evaluation.status).toBe('healthy');
    expect(evaluation.percentageUsed).toBe(0);

    // 2. Caution state (85% used)
    const nowIso = new Date().toISOString();
    useOrdersStore.setState({
      orders: [
        {
          id: 'ORD-CAUTION',
          userId: 1,
          date: nowIso,
          currency: 'USD',
          status: 'delivered',
          total: 850,
          items: [],
          shippingAddress: {
            fullName: 'Test User',
            address: '123 Test St',
            city: 'Springfield',
            postalCode: '12345',
            country: 'US',
          },
          paymentMethod: 'card',
        },
      ],
    });

    evaluation = useBudgetStore.getState().getEvaluation();
    expect(evaluation.status).toBe('caution');
    expect(evaluation.percentageUsed).toBe(85);

    // 3. Exceeded state (>100% used)
    useCartStore.setState({
      items: [
        {
          product: {
            id: 20,
            title: 'Cart extra',
            price: 200,
            category: 'acoustics',
            description: 'Test',
            images: [],
            thumbnail: '',
            rating: 4.5,
            stock: 5,
          },
          quantity: 1,
        },
      ],
      savedForLater: [],
    });

    evaluation = useBudgetStore.getState().getEvaluation();
    expect(evaluation.status).toBe('exceeded');
    expect(evaluation.affordsCart).toBe(false);
  });
});
