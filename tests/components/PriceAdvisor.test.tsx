// ==============================================================================
// ShopSphere AI — Component Tests: Price Drop Advisor
// Tests Dashboard, History Chart, Tracked Product Card, and In-App Alerts
// ==============================================================================

import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterProvider } from '@/lib/router';
import { PriceDropAdvisorPage } from '@/features/price-advisor/PriceDropAdvisorPage';
import { PriceHistoryChart } from '@/features/price-advisor/PriceHistoryChart';
import { PriceDropAlertsList } from '@/features/price-advisor/PriceDropAlertsList';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAppStore } from '@/store/useAppStore';
import type { PriceDropAlert, PriceSnapshot } from '@/types/priceAdvisor';

describe('PriceDropAdvisorPage Component', () => {
  beforeEach(() => {
    usePriceAdvisorStore.setState({
      trackedProducts: {},
      alerts: [],
    });
    useWishlistStore.setState({
      items: [],
    });
    useAppStore.setState({
      currentUser: {
        id: 'user_test_99',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer',
      },
    });
  });

  it('renders Price Drop Advisor header, metrics, and empty state initially', () => {
    render(
      <RouterProvider>
        <PriceDropAdvisorPage />
      </RouterProvider>
    );

    expect(screen.getByRole('heading', { name: /smart price drop advisor/i })).toBeInTheDocument();
    expect(screen.getByText(/tracked items/i)).toBeInTheDocument();
    expect(screen.getByText(/active price drops/i)).toBeInTheDocument();
    expect(screen.getByText(/potential savings/i)).toBeInTheDocument();
    expect(screen.getByText(/no monitored products yet/i)).toBeInTheDocument();
  });

  it('allows 1-click tracking of curated starter items and updates metrics', () => {
    render(
      <RouterProvider>
        <PriceDropAdvisorPage />
      </RouterProvider>
    );

    const trackStarterBtn = screen.getByRole('button', { name: /track top 3 featured products/i });
    fireEvent.click(trackStarterBtn);

    // Tracked items should now appear
    const trackedList = usePriceAdvisorStore.getState().getTrackedList('user_test_99');
    expect(trackedList.length).toBe(3);
  });

  it('displays wishlist integration sync banner when untracked wishlist items exist', () => {
    useWishlistStore.setState({
      items: [
        {
          id: 501,
          title: 'Chronograph Minimalist Watch',
          description: 'Sapphire crystal timepiece',
          category: 'horology',
          price: 350,
          rating: 4.8,
          stock: 5,
          images: [],
          thumbnail: '',
        },
      ],
    });

    render(
      <RouterProvider>
        <PriceDropAdvisorPage />
      </RouterProvider>
    );

    expect(screen.getByText(/sync wishlist to price tracking/i)).toBeInTheDocument();
    const trackAllBtn = screen.getByRole('button', { name: /track all wishlist items/i });
    fireEvent.click(trackAllBtn);

    const tracked = usePriceAdvisorStore.getState().isTracked(501, 'user_test_99');
    expect(tracked).toBe(true);
  });
});

describe('PriceHistoryChart Component', () => {
  it('renders informative message when only 1 snapshot exists (no manufactured history)', () => {
    const singleSnapshot: PriceSnapshot[] = [
      {
        timestamp: new Date('2026-03-01T12:00:00Z').getTime(),
        price: 199.99,
        reason: 'Price tracking started',
      },
    ];

    render(
      <PriceHistoryChart
        productTitle="Precision Acoustic Studio Pro"
        snapshots={singleSnapshot}
        trackedAt={new Date('2026-03-01T12:00:00Z').getTime()}
      />
    );

    expect(screen.getByText(/historical data not yet available/i)).toBeInTheDocument();
    expect(screen.getByText(/\$199\.99/)).toBeInTheDocument();
    expect(screen.getByText(/1 snapshot recorded/i)).toBeInTheDocument();
  });

  it('renders SVG chart and min/max/current statistics when >= 2 snapshots exist', () => {
    const multiSnapshots: PriceSnapshot[] = [
      {
        timestamp: new Date('2026-03-01T10:00:00Z').getTime(),
        price: 250,
        reason: 'Initial Track',
      },
      {
        timestamp: new Date('2026-03-02T10:00:00Z').getTime(),
        price: 220,
        reason: 'Weekend Discount',
      },
      {
        timestamp: new Date('2026-03-03T10:00:00Z').getTime(),
        price: 190,
        reason: 'Clearance Drop',
      },
    ];

    const { container } = render(
      <PriceHistoryChart
        productTitle="Precision Acoustic Studio Pro"
        snapshots={multiSnapshots}
        trackedAt={new Date('2026-03-01T10:00:00Z').getTime()}
      />
    );

    expect(screen.getByText(/recorded price snapshots/i)).toBeInTheDocument();
    expect(screen.getByText(/lowest:/i)).toBeInTheDocument();
    expect(screen.getByText(/highest:/i)).toBeInTheDocument();
    expect(screen.getByText(/current:/i)).toBeInTheDocument();

    // Verify SVG element rendered
    const svgEl = container.querySelector('svg');
    expect(svgEl).toBeInTheDocument();
    expect(screen.getByText(/snapshot timeline/i)).toBeInTheDocument();
  });
});

describe('PriceDropAlertsList Component', () => {
  it('renders in-app alerts with savings calculation, percentage decrease, and dismiss', () => {
    const mockAlerts: PriceDropAlert[] = [
      {
        id: 'alert_abc_1',
        productId: 777,
        productTitle: 'Modular Mechanical Keyboard',
        productImage: 'https://example.com/kbd.jpg',
        previousPrice: 160,
        newPrice: 120,
        savings: 40,
        percentageDecrease: 25,
        timestamp: Date.now(),
        read: false,
        userId: 'user_test_99',
      },
    ];

    render(
      <RouterProvider>
        <PriceDropAlertsList alerts={mockAlerts} userId="user_test_99" />
      </RouterProvider>
    );

    expect(screen.getByText(/price drop notifications \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/modular mechanical keyboard/i)).toBeInTheDocument();
    expect(screen.getByText(/save \$40\.00 \(25%\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\$120\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$160\.00/)).toBeInTheDocument();

    // Verify dismiss button exists
    expect(screen.getByText(/dismiss/i)).toBeInTheDocument();
  });

  it('renders empty state when no alerts exist', () => {
    render(
      <RouterProvider>
        <PriceDropAlertsList alerts={[]} userId="user_test_99" />
      </RouterProvider>
    );

    expect(screen.getByText(/no active price drops yet/i)).toBeInTheDocument();
  });
});
