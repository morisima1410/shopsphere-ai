// ==============================================================================
// ShopSphere AI — Smart Search Unit Tests
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeText,
  searchProducts,
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  getSmartRecommendations,
  POPULAR_SEARCHES,
  RECENT_SEARCHES_STORAGE_KEY,
} from '@/features/search/searchUtils';
import { CURATED_PRODUCTS } from '@/services/productsData';

describe('Smart Search Utility & Intelligence Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('normalizeText', () => {
    it('lowercases, trims, and collapses multiple whitespace characters', () => {
      expect(normalizeText('  Wireless   ANC   Headphones  ')).toBe('wireless anc headphones');
      expect(normalizeText('TITANIUM')).toBe('titanium');
      expect(normalizeText('')).toBe('');
    });
  });

  describe('searchProducts intelligent matching', () => {
    it('returns empty results for empty or whitespace-only query', () => {
      expect(searchProducts(CURATED_PRODUCTS, '').results).toEqual([]);
      expect(searchProducts(CURATED_PRODUCTS, '   ').results).toEqual([]);
    });

    it('matches product by exact or partial title case-insensitively', () => {
      const { results } = searchProducts(CURATED_PRODUCTS, 'aura studio');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe('Aura Studio Wireless ANC');
    });

    it('matches across brand, category, tags, and description', () => {
      // Category match
      const catResults = searchProducts(CURATED_PRODUCTS, 'acoustics');
      expect(catResults.results.some((p) => p.category === 'acoustics')).toBe(true);
      expect(catResults.matchedCategories).toContain('acoustics');

      // Brand match
      const brandResults = searchProducts(CURATED_PRODUCTS, 'Chronos Atelier');
      expect(brandResults.results.some((p) => p.brand === 'Chronos Atelier')).toBe(true);

      // Tag match
      const tagResults = searchProducts(CURATED_PRODUCTS, 'Horology');
      expect(tagResults.results.some((p) => p.tags?.includes('Horology'))).toBe(true);

      // Material in description
      const descResults = searchProducts(CURATED_PRODUCTS, 'titanium');
      expect(descResults.results.length).toBeGreaterThan(0);
    });

    it('performs multi-token matching across fields ignoring extra spaces', () => {
      const { results } = searchProducts(CURATED_PRODUCTS, '   wireless    titanium   ');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Aura Studio');
    });

    it('ranks exact and prefix title matches higher than tag or description matches', () => {
      const { results } = searchProducts(CURATED_PRODUCTS, 'Aura');
      expect(results[0].title.startsWith('Aura')).toBe(true);
    });

    it('deduplicates results so no product appears twice', () => {
      const { results } = searchProducts(CURATED_PRODUCTS, 'audio');
      const ids = results.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('respects optional limit parameter', () => {
      const { results } = searchProducts(CURATED_PRODUCTS, 'a', { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Recent Searches Management', () => {
    it('returns empty array when no recent searches are saved', () => {
      expect(getRecentSearches()).toEqual([]);
    });

    it('saves search queries and deduplicates them', () => {
      saveRecentSearch('wireless headphones');
      saveRecentSearch('smart watch');
      saveRecentSearch('wireless headphones'); // duplicate

      const recents = getRecentSearches();
      expect(recents[0]).toBe('wireless headphones');
      expect(recents[1]).toBe('smart watch');
      expect(recents.length).toBe(2);
    });

    it('removes an individual query', () => {
      saveRecentSearch('sunglasses');
      saveRecentSearch('desk lamp');
      removeRecentSearch('sunglasses');

      const recents = getRecentSearches();
      expect(recents).toEqual(['desk lamp']);
    });

    it('clears all recent searches', () => {
      saveRecentSearch('item 1');
      saveRecentSearch('item 2');
      clearRecentSearches();

      expect(getRecentSearches()).toEqual([]);
    });
  });

  describe('Popular Searches & Smart Recommendations', () => {
    it('provides curated popular search queries based on the catalog', () => {
      expect(POPULAR_SEARCHES.length).toBeGreaterThan(0);
      expect(POPULAR_SEARCHES).toContain('Wireless ANC');
      expect(POPULAR_SEARCHES).toContain('Titanium');
    });

    it('generates diverse, top-rated fallback recommendations when no matches exist', () => {
      const recs = getSmartRecommendations(CURATED_PRODUCTS, 3);
      expect(recs.length).toBe(3);
      // Ensures high rating
      recs.forEach((item) => {
        expect(item.rating).toBeGreaterThanOrEqual(4.5);
      });
      // Ensures unique IDs
      const uniqueIds = new Set(recs.map((r) => r.id));
      expect(uniqueIds.size).toBe(3);
    });
  });
});
