import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SmartBudgetGuardianCard, BudgetPage } from '@/features/budget';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useCartStore } from '@/store/useCartStore';
import { RouterProvider } from '@/lib/router';

describe('Smart Budget Guardian — Component Rendering & Interactions', () => {
  beforeEach(() => {
    useBudgetStore.setState({
      monthlyLimit: 1200,
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

  it('renders compact Budget Guardian card without crashing', () => {
    render(
      <RouterProvider>
        <SmartBudgetGuardianCard variant="compact" />
      </RouterProvider>
    );

    expect(screen.getByText(/Smart Budget Guardian/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$1,200\.00/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders full Budget Guardian card with limit adjustment controls', () => {
    render(
      <RouterProvider>
        <SmartBudgetGuardianCard variant="full" />
      </RouterProvider>
    );

    expect(screen.getByText(/Smart Budget Guardian/i)).toBeInTheDocument();
    expect(screen.getByText(/Guardrail Limit/i)).toBeInTheDocument();

    // Click "Adjust Limit" button to reveal presets
    const adjustBtn = screen.getByRole('button', { name: /Adjust Limit/i });
    fireEvent.click(adjustBtn);

    // Click quick preset "$1,500" or "$1500"
    const preset1500 = screen.getByRole('button', { name: /\$1,?500/i });
    fireEvent.click(preset1500);

    expect(useBudgetStore.getState().monthlyLimit).toBe(1500);
  });

  it('renders full BudgetPage without errors', () => {
    render(
      <RouterProvider>
        <BudgetPage />
      </RouterProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Smart Budget Guardian/i })).toBeInTheDocument();
    expect(screen.getByText(/Autonomous Financial Guardrail/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero Fabricated Metrics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Affordability Pre-Check/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Client-Side Local Storage Privacy/i)).toBeInTheDocument();
  });
});
