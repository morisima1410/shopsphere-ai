// ==============================================================================
// ShopSphere AI — Unit Tests: 9-Strategy Recommendation Engine (PRD Section 6 & 17)
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  getRecommendationsByStrategy,
  generateRecommendations,
  STRATEGY_METADATA,
  RecommendationStrategy,
} from '@/features/recommendations/recommendationEngine';
import { CURATED_PRODUCTS } from '@/services/productsData';

describe('AI Recommendation Engine Test Suite (PRD Section 6)', () => {
  it('defines metadata for all nine distinct strategies', () => {
    const expectedStrategies: RecommendationStrategy[] = [
      'personalized_for_you',
      'trending_popular',
      'frequently_bought_together',
      'similar_products',
      'price_drops',
      'new_arrivals',
      'recently_viewed_related',
      'category_top_picks',
      'cart_upsell',
    ];

    expectedStrategies.forEach((strategy) => {
      expect(STRATEGY_METADATA[strategy]).toBeDefined();
      expect(STRATEGY_METADATA[strategy].label).toBeTruthy();
      expect(STRATEGY_METADATA[strategy].description).toBeTruthy();
      expect(STRATEGY_METADATA[strategy].badge).toBeTruthy();
    });
  });

  it('strategy 1: generates personalized recommendations based on persona and budget', () => {
    const results = getRecommendationsByStrategy('personalized_for_you', {
      persona: 'audiophile',
      budget: 'premium',
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('personalized_for_you');
    expect(results[0].matchScore).toBeGreaterThanOrEqual(70);
    expect(results[0].matchReason).toBeTruthy();
  });

  it('strategy 2: sorts products by rating for trending_popular', () => {
    const results = getRecommendationsByStrategy('trending_popular');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('trending_popular');
    // Verify sorted descending by rating
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].product.rating).toBeGreaterThanOrEqual(results[i + 1].product.rating);
    }
  });

  it('strategy 3: identifies complementary categories for frequently_bought_together', () => {
    const target = CURATED_PRODUCTS[0]; // acoustics
    const results = getRecommendationsByStrategy('frequently_bought_together', {
      targetProductId: target.id,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('frequently_bought_together');
    expect(results.every((r) => r.product.id !== target.id)).toBe(true);
  });

  it('strategy 4: finds similar products matching category and aesthetic lineage', () => {
    const target = CURATED_PRODUCTS[0];
    const results = getRecommendationsByStrategy('similar_products', {
      targetProductId: target.id,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('similar_products');
    expect(results.every((r) => r.product.id !== target.id)).toBe(true);
  });

  it('strategy 5: filters and scores price drops and promotional markdowns', () => {
    const results = getRecommendationsByStrategy('price_drops');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('price_drops');
    expect(results.every((r) => (r.product.discountPercentage || 0) > 0)).toBe(true);
  });

  it('strategy 6: returns latest drops for new_arrivals', () => {
    const results = getRecommendationsByStrategy('new_arrivals');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('new_arrivals');
  });

  it('strategy 7: generates recommendations inspired by recently viewed items', () => {
    const results = getRecommendationsByStrategy('recently_viewed_related', {
      recentProductIds: [1, 2],
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('recently_viewed_related');
    expect(results.every((r) => ![1, 2].includes(r.product.id))).toBe(true);
  });

  it('strategy 8: selects category top picks flagships across departments', () => {
    const results = getRecommendationsByStrategy('category_top_picks');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('category_top_picks');
    // Categories should be unique
    const categories = results.map((r) => r.product.category);
    const uniqueCategories = new Set(categories);
    expect(uniqueCategories.size).toBe(categories.length);
  });

  it('strategy 9: suggests accessible add-on items for cart_upsell', () => {
    const cartIds = [1];
    const results = getRecommendationsByStrategy('cart_upsell', {
      cartProductIds: cartIds,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy).toBe('cart_upsell');
    expect(results.every((r) => !cartIds.includes(r.product.id))).toBe(true);
  });
});
