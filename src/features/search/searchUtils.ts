// ==============================================================================
// ShopSphere AI — Smart Search Utilities & Intelligence Layer
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import type { Product } from '@/types';

export const RECENT_SEARCHES_STORAGE_KEY = 'shopsphere_recent_searches';
export const MAX_RECENT_SEARCHES = 6;

export const POPULAR_SEARCHES: string[] = [
  'Wireless ANC',
  'Titanium',
  'Modern Horology',
  'Minimalist Carry',
  'Merino Wool',
  'Ceramic Lamp',
  'Living',
  'Architectural',
];

/**
 * Normalizes query string: trims leading/trailing spaces, collapses multiple spaces, and converts to lowercase.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Intelligent Token-based Search across:
 * - Product Title
 * - Brand
 * - Category
 * - Description
 * - Tags
 *
 * Ranks results based on relevance (title exact/prefix match > title token match > brand/category match > description/tag match).
 */
export function searchProducts(
  products: Product[],
  rawQuery: string,
  options?: { limit?: number; selectedCategory?: string }
): {
  results: Product[];
  matchedCategories: string[];
} {
  const query = normalizeText(rawQuery);
  if (!query) {
    return { results: [], matchedCategories: [] };
  }

  const queryTokens = query.split(' ').filter(Boolean);
  const matchedCategoriesSet = new Set<string>();

  // Calculate match scores
  const scoredProducts: { product: Product; score: number }[] = [];

  for (const product of products) {
    // Optional category constraint
    if (
      options?.selectedCategory &&
      options.selectedCategory !== 'all' &&
      normalizeText(product.category) !== normalizeText(options.selectedCategory)
    ) {
      continue;
    }

    const titleNorm = normalizeText(product.title);
    const brandNorm = normalizeText(product.brand || '');
    const categoryNorm = normalizeText(product.category);
    const descNorm = normalizeText(product.description || '');
    const tagsNorm = (product.tags || []).map((t) => normalizeText(t)).join(' ');

    let score = 0;

    // 1. Exact phrase matches
    if (titleNorm === query) {
      score += 100;
    } else if (titleNorm.startsWith(query)) {
      score += 60;
    } else if (titleNorm.includes(query)) {
      score += 40;
    }

    if (brandNorm.includes(query)) {
      score += 30;
    }

    if (categoryNorm.includes(query)) {
      score += 25;
      matchedCategoriesSet.add(product.category);
    }

    if (tagsNorm.includes(query)) {
      score += 20;
    }

    if (descNorm.includes(query)) {
      score += 10;
    }

    // 2. Token matches (if multi-word query)
    if (queryTokens.length > 1) {
      let tokensMatched = 0;
      for (const token of queryTokens) {
        if (
          titleNorm.includes(token) ||
          brandNorm.includes(token) ||
          categoryNorm.includes(token) ||
          tagsNorm.includes(token) ||
          descNorm.includes(token)
        ) {
          tokensMatched++;
        }
      }
      if (tokensMatched === queryTokens.length) {
        score += 25; // All tokens matched across fields
      } else if (tokensMatched > 0) {
        score += tokensMatched * 5;
      }
    }

    // Collect matched categories if tokens match
    for (const token of queryTokens) {
      if (categoryNorm.includes(token)) {
        matchedCategoriesSet.add(product.category);
      }
    }

    if (score > 0) {
      scoredProducts.push({ product, score });
    }
  }

  // Sort by score descending, then by rating, then by id
  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((b.product.rating || 0) !== (a.product.rating || 0)) {
      return (b.product.rating || 0) - (a.product.rating || 0);
    }
    return a.product.id - b.product.id;
  });

  const uniqueResults: Product[] = [];
  const seenIds = new Set<number>();

  for (const item of scoredProducts) {
    if (!seenIds.has(item.product.id)) {
      seenIds.add(item.product.id);
      uniqueResults.push(item.product);
    }
  }

  const finalResults = options?.limit ? uniqueResults.slice(0, options.limit) : uniqueResults;

  return {
    results: finalResults,
    matchedCategories: Array.from(matchedCategoriesSet),
  };
}

/**
 * Retrieve recent search queries safely from localStorage.
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, MAX_RECENT_SEARCHES);
    }
  } catch {
    // Graceful fallback on storage access denial
  }
  return [];
}

/**
 * Add a query to recent searches safely in localStorage.
 */
export function saveRecentSearch(rawQuery: string): string[] {
  const query = rawQuery.trim();
  if (!query || typeof window === 'undefined') return getRecentSearches();

  try {
    const existing = getRecentSearches();
    const filtered = existing.filter((item) => item.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [query];
  }
}

/**
 * Remove an individual search query from localStorage.
 */
export function removeRecentSearch(queryToRemove: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getRecentSearches();
    const updated = existing.filter((item) => item.toLowerCase() !== queryToRemove.toLowerCase());
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Clear all recent searches from localStorage.
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
  } catch {
    // Ignore error
  }
}

/**
 * Return smart recommended alternative products when no direct search results match.
 */
export function getSmartRecommendations(products: Product[], count: number = 3): Product[] {
  if (!products || products.length === 0) return [];

  // Pick top-rated, diverse products
  const sorted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const picked: Product[] = [];
  const seenCategories = new Set<string>();

  for (const p of sorted) {
    if (!seenCategories.has(p.category)) {
      seenCategories.add(p.category);
      picked.push(p);
      if (picked.length >= count) break;
    }
  }

  // If not enough diverse categories, pad with remaining top-rated items
  if (picked.length < count) {
    for (const p of sorted) {
      if (!picked.some((item) => item.id === p.id)) {
        picked.push(p);
        if (picked.length >= count) break;
      }
    }
  }

  return picked;
}
