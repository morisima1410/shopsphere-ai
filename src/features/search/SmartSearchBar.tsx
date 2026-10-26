// ==============================================================================
// ShopSphere AI — Smart Search Bar Component
// Complete with Live Autocomplete, Intelligent Matching, Recent & Popular Searches,
// Keyboard Navigation (Arrow Keys, Enter, Escape), and Smart No-Results Handling.
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
  Tag,
  Star,
  CornerDownLeft,
} from 'lucide-react';
import type { Product } from '@/types';
import { CURATED_PRODUCTS, getCatalogProducts } from '@/services/productsData';
import {
  searchProducts,
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  POPULAR_SEARCHES,
  getSmartRecommendations,
  normalizeText,
} from './searchUtils';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { useRouter } from '@/lib/router';

export interface SmartSearchBarProps {
  placeholder?: string;
  initialValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSearchSubmit?: (query: string) => void;
  onProductSelect?: (product: Product) => void;
  autoFocus?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCategoryPills?: boolean;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  placeholder = 'Search products by title, category, brand, or material...',
  initialValue = '',
  value: controlledValue,
  onChange,
  onSearchSubmit,
  onProductSelect,
  autoFocus = false,
  className = '',
  size = 'md',
  showCategoryPills = false,
}) => {
  const { navigate } = useRouter();
  const [internalQuery, setInternalQuery] = useState(initialValue);
  const query = controlledValue !== undefined ? controlledValue : internalQuery;

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(CURATED_PRODUCTS);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load products & recent searches on mount
  useEffect(() => {
    let isMounted = true;
    setRecentSearches(getRecentSearches());

    getCatalogProducts()
      .then((data) => {
        if (isMounted && data?.length) {
          setProducts(data);
        }
      })
      .catch(() => {
        if (isMounted) setProducts(CURATED_PRODUCTS);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Debounce query typing (250ms)
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Sync internal state if initialValue changes
  useEffect(() => {
    if (controlledValue === undefined && initialValue) {
      setInternalQuery(initialValue);
    }
  }, [initialValue, controlledValue]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete matching results
  const { results: searchResults, matchedCategories } = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return { results: [], matchedCategories: [] };
    }
    return searchProducts(products, debouncedQuery, { limit: 5 });
  }, [products, debouncedQuery]);

  // Smart recommended products when query returns 0 matches
  const fallbackRecommendations = useMemo(() => {
    if (debouncedQuery.trim() && searchResults.length === 0) {
      return getSmartRecommendations(products, 2);
    }
    return [];
  }, [products, debouncedQuery, searchResults.length]);

  // Build flattened selectable items list for keyboard navigation
  const selectableItems = useMemo(() => {
    const items: Array<{
      type: 'recent' | 'popular' | 'category' | 'product' | 'viewAll';
      label: string;
      product?: Product;
      category?: string;
    }> = [];

    const isQueryEmpty = !debouncedQuery.trim();

    if (isQueryEmpty) {
      // Recent searches
      recentSearches.forEach((rs) => {
        items.push({ type: 'recent', label: rs });
      });
      // Popular searches
      POPULAR_SEARCHES.forEach((ps) => {
        items.push({ type: 'popular', label: ps });
      });
    } else {
      if (searchResults.length > 0) {
        // Matched categories first
        matchedCategories.slice(0, 2).forEach((cat) => {
          items.push({ type: 'category', label: `In category: ${cat}`, category: cat });
        });
        // Product suggestions
        searchResults.forEach((p) => {
          items.push({ type: 'product', label: p.title, product: p });
        });
        // "View all results" option
        items.push({ type: 'viewAll', label: `View all matching products for "${debouncedQuery}"` });
      } else {
        // Fallback recommendations if zero exact results
        fallbackRecommendations.forEach((p) => {
          items.push({ type: 'product', label: p.title, product: p });
        });
      }
    }

    return items;
  }, [debouncedQuery, recentSearches, searchResults, matchedCategories, fallbackRecommendations]);

  // Reset keyboard highlight whenever suggestions list changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  const updateQuery = (newVal: string) => {
    if (onChange) onChange(newVal);
    if (controlledValue === undefined) setInternalQuery(newVal);
  };

  const handleExecuteSearch = useCallback(
    (searchQueryText: string) => {
      const trimmed = searchQueryText.trim();
      if (!trimmed) return;

      const updatedRecent = saveRecentSearch(trimmed);
      setRecentSearches(updatedRecent);
      setIsOpen(false);
      setActiveIndex(-1);

      if (onSearchSubmit) {
        onSearchSubmit(trimmed);
      } else {
        navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [onSearchSubmit, navigate]
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      saveRecentSearch(product.title);
      setRecentSearches(getRecentSearches());
      setIsOpen(false);
      setActiveIndex(-1);

      if (onProductSelect) {
        onProductSelect(product);
      } else {
        navigate(`/product/${product.id}`);
      }
    },
    [onProductSelect, navigate]
  );

  const handleSelectCategory = useCallback(
    (category: string) => {
      saveRecentSearch(category);
      setRecentSearches(getRecentSearches());
      setIsOpen(false);
      setActiveIndex(-1);
      navigate(`/shop?category=${encodeURIComponent(category.toLowerCase())}`);
    },
    [navigate]
  );

  const handleRemoveRecent = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = removeRecentSearch(item);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
        return;
      }
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectableItems.length === 0) return;
      setActiveIndex((prev) => (prev < selectableItems.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectableItems.length === 0) return;
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : selectableItems.length - 1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < selectableItems.length) {
        const item = selectableItems[activeIndex];
        if (item.type === 'product' && item.product) {
          handleSelectProduct(item.product);
        } else if (item.type === 'category' && item.category) {
          handleSelectCategory(item.category);
        } else if (item.type === 'viewAll') {
          handleExecuteSearch(debouncedQuery);
        } else {
          updateQuery(item.label);
          handleExecuteSearch(item.label);
        }
      } else {
        handleExecuteSearch(query);
      }
    }
  };

  // Helper to highlight matching text query in product titles
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const normHighlight = normalizeText(highlight);
    const lowerText = text.toLowerCase();
    const startIdx = lowerText.indexOf(normHighlight);

    if (startIdx === -1) {
      return text;
    }

    const before = text.slice(0, startIdx);
    const matched = text.slice(startIdx, startIdx + normHighlight.length);
    const after = text.slice(startIdx + normHighlight.length);

    return (
      <>
        {before}
        <span className="font-black text-emerald-700 bg-emerald-100/80 px-0.5 rounded">
          {matched}
        </span>
        {after}
      </>
    );
  };

  const heightClass = size === 'sm' ? 'h-9 text-xs' : size === 'lg' ? 'h-12 text-sm' : 'h-11 text-xs';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors ${
            isOpen ? 'text-emerald-600' : ''
          } ${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
        />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="smart-search-dropdown"
          placeholder={placeholder}
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            updateQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-full ${heightClass} pl-10 pr-20 rounded-2xl border border-gray-200 bg-gray-50/70 text-[#1F2937] placeholder:text-gray-400 hover:bg-white hover:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-600 shadow-xs transition-all`}
        />

        {/* Right side controls: Spinner, Clear, and Submit Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && query.trim().length > 0 && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 mr-1" />
          )}

          {query && (
            <button
              type="button"
              onClick={() => {
                updateQuery('');
                setDebouncedQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleExecuteSearch(query)}
            className="flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 shadow-xs transition-all cursor-pointer"
            aria-label="Submit Search"
          >
            <span>Search</span>
            <CornerDownLeft className="h-3 w-3 opacity-80" />
          </button>
        </div>
      </div>

      {/* Autocomplete & Suggestions Dropdown */}
      {isOpen && (
        <div
          id="smart-search-dropdown"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* STATE 1: Empty Query -> Recent Searches & Popular Suggestions */}
          {!debouncedQuery.trim() && (
            <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAllRecent}
                      className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer text-[10px] font-semibold"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item, idx) => {
                      const isItemActive = activeIndex === idx;
                      return (
                        <div
                          key={item}
                          role="option"
                          aria-selected={isItemActive}
                          onClick={() => {
                            updateQuery(item);
                            handleExecuteSearch(item);
                          }}
                          className={`group flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium cursor-pointer transition-all ${
                            isItemActive
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                              : 'border-gray-200 bg-gray-50/70 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700'
                          }`}
                        >
                          <Clock className="h-3 w-3 text-gray-400 group-hover:text-emerald-600" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveRecent(e, item)}
                            className="p-0.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200/60 cursor-pointer ml-1"
                            title="Remove"
                            aria-label={`Remove recent search ${item}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Popular Searches</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((item, pIdx) => {
                    const itemGlobalIndex = recentSearches.length + pIdx;
                    const isItemActive = activeIndex === itemGlobalIndex;
                    return (
                      <button
                        key={item}
                        type="button"
                        role="option"
                        aria-selected={isItemActive}
                        onClick={() => {
                          updateQuery(item);
                          handleExecuteSearch(item);
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          isItemActive
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Link to Browse All */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono">↓</kbd> to navigate</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/shop');
                  }}
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Browse full catalog</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: Query Typed -> Live Results Found */}
          {debouncedQuery.trim() && searchResults.length > 0 && (
            <div className="max-h-[75vh] overflow-y-auto divide-y divide-gray-100">
              {/* Matched Categories Header if any */}
              {matchedCategories.length > 0 && (
                <div className="p-3 bg-emerald-50/50 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Matching Collections
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedCategories.slice(0, 3).map((cat, catIdx) => {
                      const isCatActive = activeIndex === catIdx;
                      return (
                        <button
                          key={cat}
                          type="button"
                          role="option"
                          aria-selected={isCatActive}
                          onClick={() => handleSelectCategory(cat)}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all ${
                            isCatActive
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                          }`}
                        >
                          <Tag className="h-3 w-3 text-emerald-600" />
                          <span className="capitalize">{cat}</span>
                          <ArrowRight className="h-3 w-3 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Suggestion Rows */}
              <div className="p-2 space-y-1">
                <span className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Product Suggestions ({searchResults.length})
                </span>

                {searchResults.map((product, pIndex) => {
                  const globalIdx = matchedCategories.slice(0, 2).length + pIndex;
                  const isItemActive = activeIndex === globalIdx;

                  const finalPrice = calculateDiscountPrice(
                    product.price,
                    product.discountPercentage
                  );

                  return (
                    <div
                      key={product.id}
                      role="option"
                      aria-selected={isItemActive}
                      onClick={() => handleSelectProduct(product)}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                        isItemActive
                          ? 'bg-emerald-50 text-emerald-950 border-l-4 border-emerald-600 shadow-xs'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail */}
                        <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={product.thumbnail || product.images?.[0]}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Title & Category Info */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-xs font-bold text-[#1F2937] truncate">
                            {renderHighlighted(product.title, debouncedQuery)}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500">
                            <span className="capitalize font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                              {product.category}
                            </span>
                            {product.brand && (
                              <span className="truncate">• {product.brand}</span>
                            )}
                            {product.rating && (
                              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                <Star className="h-3 w-3 fill-amber-400" />
                                <span>{product.rating}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-[#1F2937]">
                          {formatCurrency(finalPrice)}
                        </div>
                        {product.discountPercentage && product.discountPercentage > 0 && (
                          <div className="text-[10px] text-gray-400 line-through">
                            {formatCurrency(product.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* "View all results" Footer action */}
              <div className="p-2 bg-gray-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleExecuteSearch(debouncedQuery)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${
                    activeIndex === selectableItems.length - 1
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>View all results for &ldquo;{debouncedQuery}&rdquo;</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: Query Typed -> Zero Results (Smart No-Results Fallback) */}
          {debouncedQuery.trim() && searchResults.length === 0 && (
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="text-center space-y-1.5 py-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Search className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-[#1F2937]">
                  No exact matches for &ldquo;{debouncedQuery}&rdquo;
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try checking for typos, searching by category, or choose from our popular collections below.
                </p>
              </div>

              {/* Try Searching For Pills */}
              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Try searching for:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.slice(0, 5).map((pop) => (
                    <button
                      key={pop}
                      type="button"
                      onClick={() => {
                        updateQuery(pop);
                        handleExecuteSearch(pop);
                      }}
                      className="rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-all cursor-pointer"
                    >
                      {pop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smart Alternative Recommendations */}
              {fallbackRecommendations.length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                    Popular Alternatives You Might Desire:
                  </span>
                  <div className="space-y-1.5">
                    {fallbackRecommendations.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50/60 hover:border-emerald-200 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={product.thumbnail || product.images?.[0]}
                            alt={product.title}
                            className="h-9 w-9 rounded-lg object-cover shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#1F2937] block truncate">
                              {product.title}
                            </span>
                            <span className="text-[10px] text-emerald-700 capitalize font-medium">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-[#1F2937] shrink-0">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
