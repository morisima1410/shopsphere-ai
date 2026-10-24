// ==============================================================================
// ShopSphere AI — Comprehensive 9-Strategy Recommendation Engine
// Fully compliant with ShopSphere AI PRD specifications
// ==============================================================================

import type { Product } from '@/types';
import { CURATED_PRODUCTS } from '@/services/productsData';

export type RecommendationStrategy =
  | 'personalized_for_you'
  | 'trending_popular'
  | 'frequently_bought_together'
  | 'similar_products'
  | 'price_drops'
  | 'new_arrivals'
  | 'recently_viewed_related'
  | 'category_top_picks'
  | 'cart_upsell';

export type AestheticPersona = 'minimalist' | 'audiophile' | 'urban' | 'architectural';
export type BudgetTier = 'any' | 'budget' | 'balanced' | 'premium';

export interface StrategyOptions {
  persona?: AestheticPersona;
  budget?: BudgetTier;
  categoryPreference?: string;
  targetProductId?: number;
  recentProductIds?: number[];
  cartProductIds?: number[];
  limit?: number;
}

export interface RecommendationResult {
  product: Product;
  matchScore: number;
  matchReason: string;
  strategy: RecommendationStrategy;
}

export const STRATEGY_METADATA: Record<
  RecommendationStrategy,
  { label: string; description: string; badge: string }
> = {
  personalized_for_you: {
    label: 'Personalized For You',
    description: 'Algorithmic taste-fitting based on your aesthetic profile and interest categories.',
    badge: 'Neural Match',
  },
  trending_popular: {
    label: 'Trending & Popular',
    description: 'High customer satisfaction ratings and community velocity metrics.',
    badge: 'Community Loved',
  },
  frequently_bought_together: {
    label: 'Frequently Bought Together',
    description: 'Harmonious item pairings selected for complementary lifestyle utility.',
    badge: 'Perfect Pairing',
  },
  similar_products: {
    label: 'Similar Materiality & Design',
    description: 'Items sharing acoustic profiles, metal alloys, or textile specifications.',
    badge: 'Style Alternative',
  },
  price_drops: {
    label: 'Price Drop Intelligence',
    description: 'Verified promotional markdowns and member seasonal privileges.',
    badge: 'Active Deal',
  },
  new_arrivals: {
    label: 'New & Capsule Drops',
    description: 'Fresh seasonal drops from the Autumn Neural Capsule and atelier workshops.',
    badge: 'New Release',
  },
  recently_viewed_related: {
    label: 'Inspired by Your Browsing',
    description: 'Curated products aligned with items you recently inspected.',
    badge: 'Recent Affinity',
  },
  category_top_picks: {
    label: 'Category Leaders',
    description: 'The highest-rated flagship masterpiece in each department.',
    badge: 'Department Best',
  },
  cart_upsell: {
    label: 'Smart Basket Additions',
    description: 'Accessories and complementary utilities to complete your order setup.',
    badge: 'Cart Synergy',
  },
};

/**
 * Strategy 1: Personalized "For You" (User Taste & Affinity Profile)
 */
function getPersonalizedForYou(
  options: StrategyOptions,
  products: Product[]
): RecommendationResult[] {
  const persona = options.persona || 'minimalist';
  const budget = options.budget || 'balanced';

  return products.map((product) => {
    let score = 75;
    let reason = 'Curated for balanced aesthetic proportions';

    if (persona === 'audiophile') {
      if (product.category === 'acoustics') {
        score = 99;
        reason = 'Acoustic titanium drivers calibrated for studio transparency';
      } else if (product.category === 'optical') {
        score = 94;
        reason = 'High-precision optical titanium craftsmanship';
      }
    } else if (persona === 'minimalist') {
      if (product.category === 'timepieces' || product.category === 'carry') {
        score = 98;
        reason = 'Pure understated proportions and full-grain leathercraft';
      } else if (product.category === 'living') {
        score = 93;
        reason = 'Sculptural tranquility for clean workspaces';
      }
    } else if (persona === 'urban') {
      if (product.category === 'apparel' || product.category === 'carry') {
        score = 97;
        reason = 'Engineered for weatherproof urban mobility';
      }
    } else if (persona === 'architectural') {
      if (product.category === 'living' || product.category === 'timepieces') {
        score = 98;
        reason = 'Textured stoneware ceramics and geometric harmony';
      }
    }

    if (budget === 'budget' && product.price <= 200) score = Math.min(99, score + 2);
    if (budget === 'premium' && product.price >= 250) score = Math.min(99, score + 2);

    return {
      product,
      matchScore: score,
      matchReason: reason,
      strategy: 'personalized_for_you',
    };
  });
}

/**
 * Strategy 2: Trending & Popular
 */
function getTrendingPopular(products: Product[]): RecommendationResult[] {
  return [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .map((product) => ({
      product,
      matchScore: Math.round((product.rating / 5) * 100),
      matchReason: `High community satisfaction score (${product.rating}★ over 100+ reviews)`,
      strategy: 'trending_popular',
    }));
}

/**
 * Strategy 3: Frequently Bought Together
 */
function getFrequentlyBoughtTogether(
  targetId: number | undefined,
  products: Product[]
): RecommendationResult[] {
  const target = products.find((p) => p.id === targetId) || products[0];

  // Complementary category mapping
  const pairs: Record<string, string[]> = {
    acoustics: ['carry', 'optical'],
    timepieces: ['carry', 'apparel'],
    carry: ['timepieces', 'apparel'],
    living: ['acoustics', 'timepieces'],
    optical: ['carry', 'apparel'],
    apparel: ['carry', 'optical'],
  };

  const preferredCategories = pairs[target.category] || ['acoustics', 'timepieces'];

  return products
    .filter((p) => p.id !== target.id)
    .sort((a, b) => {
      const aMatch = preferredCategories.includes(a.category) ? 1 : 0;
      const bMatch = preferredCategories.includes(b.category) ? 1 : 0;
      return bMatch - aMatch;
    })
    .map((product) => ({
      product,
      matchScore: preferredCategories.includes(product.category) ? 96 : 89,
      matchReason: `Designed to complement your ${target.title}`,
      strategy: 'frequently_bought_together',
    }));
}

/**
 * Strategy 4: Similar Products (Content-Based)
 */
function getSimilarProducts(
  targetId: number | undefined,
  products: Product[]
): RecommendationResult[] {
  const target = products.find((p) => p.id === targetId) || products[0];

  return products
    .filter((p) => p.id !== target.id)
    .map((product): RecommendationResult => {
      let score = 70;
      if (product.category === target.category) score += 20;
      if (product.brand === target.brand) score += 5;
      const priceDiff = Math.abs(product.price - target.price);
      if (priceDiff < 100) score += 4;

      return {
        product,
        matchScore: Math.min(98, score),
        matchReason: `Shared ${target.category} specifications and aesthetic lineage`,
        strategy: 'similar_products',
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Strategy 5: Price Drops & Promotional Markdowns
 */
function getPriceDrops(products: Product[]): RecommendationResult[] {
  return [...products]
    .filter((p) => Boolean(p.discountPercentage && p.discountPercentage > 0))
    .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
    .map((product) => ({
      product,
      matchScore: Math.min(99, 85 + Math.round(product.discountPercentage || 0)),
      matchReason: `Promotional markdown: Save ${Math.round(product.discountPercentage!)}% today`,
      strategy: 'price_drops',
    }));
}

/**
 * Strategy 6: New & Capsule Arrivals
 */
function getNewArrivals(products: Product[]): RecommendationResult[] {
  // Return items from newest IDs or latest capsule
  return [...products]
    .slice()
    .reverse()
    .map((product, idx) => ({
      product,
      matchScore: 97 - idx,
      matchReason: 'Seasonal drop from our latest design studio batch',
      strategy: 'new_arrivals',
    }));
}

/**
 * Strategy 7: Inspired by Recently Viewed Products
 */
function getRecentlyViewedRelated(
  recentIds: number[] = [],
  products: Product[]
): RecommendationResult[] {
  const effectiveIds = recentIds.length > 0 ? recentIds : [1, 2];
  const viewedCategories = new Set(
    products.filter((p) => effectiveIds.includes(p.id)).map((p) => p.category)
  );

  return products
    .filter((p) => !effectiveIds.includes(p.id))
    .map((product): RecommendationResult => {
      const match = viewedCategories.has(product.category);
      return {
        product,
        matchScore: match ? 95 : 88,
        matchReason: match
          ? `Matches recent browsing activity in ${product.category}`
          : 'Trending recommendation across curated catalog',
        strategy: 'recently_viewed_related',
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Strategy 8: Category Leaders (Top Flagship per Department)
 */
function getCategoryTopPicks(products: Product[]): RecommendationResult[] {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const leaders: RecommendationResult[] = [];

  for (const cat of categories) {
    const catProducts = products
      .filter((p) => p.category === cat)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (catProducts[0]) {
      leaders.push({
        product: catProducts[0],
        matchScore: 99,
        matchReason: `Top-rated flagship product in ${cat}`,
        strategy: 'category_top_picks',
      });
    }
  }

  return leaders;
}

/**
 * Strategy 9: Cart-Based Upsell (Cross-Sell Basket Additions)
 */
function getCartUpsell(
  cartIds: number[] = [],
  products: Product[]
): RecommendationResult[] {
  return products
    .filter((p) => !cartIds.includes(p.id))
    .sort((a, b) => a.price - b.price) // Accessible complementary add-ons
    .map((product) => ({
      product,
      matchScore: 94,
      matchReason: 'Compact essential that completes your bag for free delivery',
      strategy: 'cart_upsell',
    }));
}

/**
 * Master Recommendation Dispatcher:
 * Executes any of the 9 PRD-specified strategies
 */
export function getRecommendationsByStrategy(
  strategy: RecommendationStrategy,
  options: StrategyOptions = {},
  products: Product[] = CURATED_PRODUCTS
): RecommendationResult[] {
  let results: RecommendationResult[];

  switch (strategy) {
    case 'personalized_for_you':
      results = getPersonalizedForYou(options, products);
      break;
    case 'trending_popular':
      results = getTrendingPopular(products);
      break;
    case 'frequently_bought_together':
      results = getFrequentlyBoughtTogether(options.targetProductId, products);
      break;
    case 'similar_products':
      results = getSimilarProducts(options.targetProductId, products);
      break;
    case 'price_drops':
      results = getPriceDrops(products);
      break;
    case 'new_arrivals':
      results = getNewArrivals(products);
      break;
    case 'recently_viewed_related':
      results = getRecentlyViewedRelated(options.recentProductIds, products);
      break;
    case 'category_top_picks':
      results = getCategoryTopPicks(products);
      break;
    case 'cart_upsell':
      results = getCartUpsell(options.cartProductIds, products);
      break;
    default:
      results = getPersonalizedForYou(options, products);
  }

  const limit = options.limit || 6;
  return results.slice(0, limit);
}

/**
 * Backward-compatible helper for existing UI components
 */
export function generateRecommendations(
  criteria: { persona: AestheticPersona; budget: BudgetTier; categoryPreference?: string },
  products: Product[] = CURATED_PRODUCTS
): RecommendationResult[] {
  return getRecommendationsByStrategy(
    'personalized_for_you',
    {
      persona: criteria.persona,
      budget: criteria.budget,
      categoryPreference: criteria.categoryPreference,
    },
    products
  );
}
