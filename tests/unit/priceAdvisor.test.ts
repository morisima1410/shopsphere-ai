// ==============================================================================
// ShopSphere AI — Price Drop Advisor Unit Tests
// Verifies math calculations, validations, alert deduplication & store lifecycle
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  isValidPrice,
  calculateSavings,
  calculatePercentageDecrease,
  calculatePercentageIncrease,
  evaluatePriceChange,
  hasHistoricalData,
  getPriceStatistics,
  isDuplicateAlert,
} from '@/services/priceAdvisorService';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import type { Product } from '@/types';
import type { PriceDropAlert, PriceSnapshot } from '@/types/priceAdvisor';

const mockProduct: Product = {
  id: 991,
  title: 'Precision Acoustic Studio Pro',
  description: 'Audiophile studio reference headphones',
  category: 'audio',
  price: 200,
  discountPercentage: 0,
  rating: 4.9,
  stock: 15,
  images: ['https://example.com/audio.jpg'],
  thumbnail: 'https://example.com/audio.jpg',
};

describe('Price Advisor Math & Evaluation Engine', () => {
  describe('isValidPrice', () => {
    it('accepts strictly positive, finite numbers', () => {
      expect(isValidPrice(10)).toBe(true);
      expect(isValidPrice(0.01)).toBe(true);
      expect(isValidPrice(999.99)).toBe(true);
    });

    it('rejects zero, negative, NaN, and non-number types', () => {
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-15)).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
      expect(isValidPrice('100')).toBe(false);
      expect(isValidPrice(null)).toBe(false);
      expect(isValidPrice(undefined)).toBe(false);
    });
  });

  describe('calculateSavings: Savings = Previous Recorded Price − Current Price', () => {
    it('calculates genuine savings when current price is lower', () => {
      // 200 - 150 = 50
      expect(calculateSavings(200, 150)).toBe(50);
      // 199.99 - 149.99 = 50.00
      expect(calculateSavings(199.99, 149.99)).toBe(50);
      // 89.50 - 70.25 = 19.25
      expect(calculateSavings(89.5, 70.25)).toBe(19.25);
    });

    it('returns 0 if price increased or remained unchanged', () => {
      expect(calculateSavings(100, 100)).toBe(0);
      expect(calculateSavings(100, 120)).toBe(0);
    });

    it('returns 0 for invalid inputs', () => {
      expect(calculateSavings(-50, 40)).toBe(0);
      expect(calculateSavings(100, 0)).toBe(0);
    });
  });

  describe('calculatePercentageDecrease: (Savings ÷ Previous Recorded Price) × 100', () => {
    it('calculates exact percentage decrease for price drops', () => {
      // (200 - 150) / 200 * 100 = 25%
      expect(calculatePercentageDecrease(200, 150)).toBe(25);
      // (100 - 80) / 100 * 100 = 20%
      expect(calculatePercentageDecrease(100, 80)).toBe(20);
      // (50 - 35) / 50 * 100 = 30%
      expect(calculatePercentageDecrease(50, 35)).toBe(30);
    });

    it('returns 0 if price did not drop', () => {
      expect(calculatePercentageDecrease(100, 100)).toBe(0);
      expect(calculatePercentageDecrease(100, 110)).toBe(0);
    });
  });

  describe('calculatePercentageIncrease', () => {
    it('calculates genuine percentage increase when price rose', () => {
      // (120 - 100) / 100 * 100 = 20%
      expect(calculatePercentageIncrease(100, 120)).toBe(20);
      // (150 - 100) / 100 * 100 = 50%
      expect(calculatePercentageIncrease(100, 150)).toBe(50);
    });

    it('returns 0 if price dropped or remained unchanged', () => {
      expect(calculatePercentageIncrease(100, 100)).toBe(0);
      expect(calculatePercentageIncrease(100, 80)).toBe(0);
    });
  });

  describe('evaluatePriceChange', () => {
    it('evaluates genuine price drop correctly', () => {
      const result = evaluatePriceChange(200, 160);
      expect(result.isDrop).toBe(true);
      expect(result.isIncrease).toBe(false);
      expect(result.isUnchanged).toBe(false);
      expect(result.savings).toBe(40);
      expect(result.percentageDecrease).toBe(20);
      expect(result.increaseAmount).toBe(0);
    });

    it('evaluates price increase without reporting false discounts', () => {
      const result = evaluatePriceChange(100, 125);
      expect(result.isDrop).toBe(false);
      expect(result.isIncrease).toBe(true);
      expect(result.isUnchanged).toBe(false);
      expect(result.savings).toBe(0);
      expect(result.percentageDecrease).toBe(0);
      expect(result.increaseAmount).toBe(25);
      expect(result.percentageIncrease).toBe(25);
    });

    it('evaluates unchanged price', () => {
      const result = evaluatePriceChange(150, 150);
      expect(result.isDrop).toBe(false);
      expect(result.isIncrease).toBe(false);
      expect(result.isUnchanged).toBe(true);
      expect(result.savings).toBe(0);
    });

    it('handles undefined previous price gracefully (baseline snapshot)', () => {
      const result = evaluatePriceChange(undefined, 150);
      expect(result.isDrop).toBe(false);
      expect(result.isIncrease).toBe(false);
      expect(result.isUnchanged).toBe(true);
      expect(result.savings).toBe(0);
    });
  });

  describe('hasHistoricalData & getPriceStatistics', () => {
    it('returns false for single snapshot (baseline only)', () => {
      const singleSnapshot: PriceSnapshot[] = [{ timestamp: Date.now(), price: 100 }];
      expect(hasHistoricalData(singleSnapshot)).toBe(false);

      const stats = getPriceStatistics(singleSnapshot);
      expect(stats?.hasHistory).toBe(false);
      expect(stats?.totalSnapshots).toBe(1);
      expect(stats?.lowest).toBe(100);
      expect(stats?.highest).toBe(100);
      expect(stats?.previous).toBeUndefined();
    });

    it('calculates min, max, previous, and current for multiple snapshots', () => {
      const snapshots: PriceSnapshot[] = [
        { timestamp: 1000, price: 200 },
        { timestamp: 2000, price: 180 },
        { timestamp: 3000, price: 160 },
      ];
      expect(hasHistoricalData(snapshots)).toBe(true);

      const stats = getPriceStatistics(snapshots);
      expect(stats?.hasHistory).toBe(true);
      expect(stats?.totalSnapshots).toBe(3);
      expect(stats?.initial).toBe(200);
      expect(stats?.current).toBe(160);
      expect(stats?.previous).toBe(180);
      expect(stats?.lowest).toBe(160);
      expect(stats?.highest).toBe(200);
    });
  });

  describe('isDuplicateAlert', () => {
    const existingAlerts: PriceDropAlert[] = [
      {
        id: 'alert-1',
        productId: 991,
        productTitle: 'Studio Pro',
        productImage: '',
        previousPrice: 200,
        newPrice: 160,
        savings: 40,
        percentageDecrease: 20,
        timestamp: 1000,
        read: false,
        userId: 'user_1',
      },
    ];

    it('detects duplicate alert for matching product, user, and exact drop prices', () => {
      expect(isDuplicateAlert(existingAlerts, 991, 160, 200, 'user_1')).toBe(true);
    });

    it('does not flag duplicate if price drop is different', () => {
      expect(isDuplicateAlert(existingAlerts, 991, 140, 160, 'user_1')).toBe(false);
    });

    it('does not flag duplicate if user is different', () => {
      expect(isDuplicateAlert(existingAlerts, 991, 160, 200, 'user_2')).toBe(false);
    });

    it('does not flag duplicate for different product', () => {
      expect(isDuplicateAlert(existingAlerts, 992, 160, 200, 'user_1')).toBe(false);
    });
  });
});

describe('usePriceAdvisorStore Lifecycle & Alert Generation', () => {
  beforeEach(() => {
    usePriceAdvisorStore.setState({
      trackedProducts: {},
      alerts: [],
    });
  });

  it('starts tracking product with authentic initial baseline and no fabricated history', () => {
    const store = usePriceAdvisorStore.getState();
    const success = store.startTracking(mockProduct, 'user_test');
    expect(success).toBe(true);

    const tracked = store.getTrackedProduct(mockProduct.id, 'user_test');
    expect(tracked).toBeDefined();
    expect(tracked?.initialPrice).toBe(200);
    expect(tracked?.currentPrice).toBe(200);
    expect(tracked?.previousPrice).toBeUndefined(); // Strictly no manufactured previous price!
    expect(tracked?.priceSnapshots.length).toBe(1);
    expect(tracked?.priceSnapshots[0].price).toBe(200);
    expect(tracked?.lowestPrice).toBe(200);
    expect(tracked?.highestPrice).toBe(200);
  });

  it('records price drop, updates snapshots, and generates in-app alert', () => {
    const store = usePriceAdvisorStore.getState();
    store.startTracking(mockProduct, 'user_test');

    // Simulate price drop from 200 -> 160
    const dropSuccess = store.recordPriceSnapshot(
      mockProduct.id,
      160,
      'user_test',
      'Flash Promo'
    );
    expect(dropSuccess).toBe(true);

    const updated = store.getTrackedProduct(mockProduct.id, 'user_test');
    expect(updated?.currentPrice).toBe(160);
    expect(updated?.previousPrice).toBe(200);
    expect(updated?.lowestPrice).toBe(160);
    expect(updated?.highestPrice).toBe(200);
    expect(updated?.priceSnapshots.length).toBe(2);

    // Verify alert generated
    const alerts = store.getAlerts('user_test');
    expect(alerts.length).toBe(1);
    expect(alerts[0].productId).toBe(mockProduct.id);
    expect(alerts[0].previousPrice).toBe(200);
    expect(alerts[0].newPrice).toBe(160);
    expect(alerts[0].savings).toBe(40);
    expect(alerts[0].percentageDecrease).toBe(20);
    expect(alerts[0].read).toBe(false);
  });

  it('prevents duplicate alert if identical price drop snapshot is recorded again', () => {
    const store = usePriceAdvisorStore.getState();
    store.startTracking(mockProduct, 'user_test');

    // First drop
    store.recordPriceSnapshot(mockProduct.id, 160, 'user_test');
    expect(store.getAlerts('user_test').length).toBe(1);

    // Same price repeated
    store.recordPriceSnapshot(mockProduct.id, 160, 'user_test');
    expect(store.getAlerts('user_test').length).toBe(1); // No duplicate alert!
  });

  it('does NOT generate price drop alert when price increases', () => {
    const store = usePriceAdvisorStore.getState();
    store.startTracking(mockProduct, 'user_test');

    // Price increase from 200 -> 240
    store.recordPriceSnapshot(mockProduct.id, 240, 'user_test', 'Inflation update');

    const updated = store.getTrackedProduct(mockProduct.id, 'user_test');
    expect(updated?.currentPrice).toBe(240);
    expect(updated?.previousPrice).toBe(200);
    expect(updated?.highestPrice).toBe(240);
    expect(updated?.lowestPrice).toBe(200);

    // No alert should be generated for price increase!
    const alerts = store.getAlerts('user_test');
    expect(alerts.length).toBe(0);
  });

  it('marks alert as read and dismisses alert', () => {
    const store = usePriceAdvisorStore.getState();
    store.startTracking(mockProduct, 'user_test');
    store.recordPriceSnapshot(mockProduct.id, 150, 'user_test');

    const alert = store.getAlerts('user_test')[0];
    expect(alert.read).toBe(false);

    // Mark as read
    store.markAlertAsRead(alert.id);
    expect(store.getAlerts('user_test')[0].read).toBe(true);

    // Dismiss
    store.dismissAlert(alert.id);
    expect(store.getAlerts('user_test').length).toBe(0);
  });

  it('isolates tracked products and alerts by user ID', () => {
    const store = usePriceAdvisorStore.getState();
    store.startTracking(mockProduct, 'user_alpha');
    store.startTracking(mockProduct, 'user_beta');

    // Trigger drop for user_alpha only
    store.recordPriceSnapshot(mockProduct.id, 170, 'user_alpha');

    expect(store.getAlerts('user_alpha').length).toBe(1);
    expect(store.getAlerts('user_beta').length).toBe(0);

    // Stop tracking for user_alpha does not affect user_beta
    store.stopTracking(mockProduct.id, 'user_alpha');
    expect(store.isTracked(mockProduct.id, 'user_alpha')).toBe(false);
    expect(store.isTracked(mockProduct.id, 'user_beta')).toBe(true);
  });
});
