// ==============================================================================
// ShopSphere AI — Local Mock Data Provider & Fallback Services
// ==============================================================================

import ordersFixture from '../../../fixtures/orders.json';
import reviewsFixture from '../../../fixtures/reviews.json';
import recommendationsFixture from '../../../fixtures/recommendations.json';
import userPreferencesFixture from '../../../fixtures/user-preferences.json';
import analyticsFixture from '../../../fixtures/analytics.json';

import type {
  Order,
  ProductReview,
  RecommendationItem,
  UserPreferences,
  AnalyticsSummary,
} from '@/types';

export const mockService = {
  getOrders(): Order[] {
    return ordersFixture as unknown as Order[];
  },

  getReviews(productId?: number): ProductReview[] {
    const all = reviewsFixture as unknown as (ProductReview & { productId: number })[];
    if (productId) {
      return all.filter((r) => r.productId === productId);
    }
    return all;
  },

  getRecommendations(): RecommendationItem[] {
    return recommendationsFixture as unknown as RecommendationItem[];
  },

  getUserPreferences(): UserPreferences {
    return userPreferencesFixture as unknown as UserPreferences;
  },

  getAnalytics(): AnalyticsSummary {
    return (analyticsFixture as { summary: AnalyticsSummary }).summary;
  },
};
