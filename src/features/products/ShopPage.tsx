// ==============================================================================
// ShopSphere AI — Product Catalog & Shop Experience (PRD Section 5.2 MOD-02)
// Complete with Quick View Modal, Advanced Filters, Rating, In-Stock, and Pagination
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
  Eye,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import type { Product } from '@/types';
import { CURATED_CATEGORIES, CURATED_PRODUCTS, getCatalogProducts } from '@/services/productsData';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/useCartStore';
import { useCompareStore } from '@/store/useCompareStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link, useRouter } from '@/lib/router';
import { SmartSearchBar, normalizeText, POPULAR_SEARCHES, getSmartRecommendations } from '@/features/search';

const ITEMS_PER_PAGE = 6;

export const ShopPage: React.FC = () => {
  const { currentPath } = useRouter();
  const [products, setProducts] = useState<Product[]>(CURATED_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState<number>(1);
  const [quickViewAdded, setQuickViewAdded] = useState<boolean>(false);

  const addItemToCart = useCartStore((state) => state.addItem);
  const compareProducts = useCompareStore((state) => state.products);
  const toggleCompare = useCompareStore((state) => state.toggleProduct);
  const isInCompare = quickViewProduct ? compareProducts.some((p) => p.id === quickViewProduct.id) : false;

  // Load products (curated + DummyJSON async if available)
  useEffect(() => {
    let isMounted = true;
    getCatalogProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(CURATED_PRODUCTS);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync with URL query parameter on navigation & mount if present
  useEffect(() => {
    const searchString = window.location.search || (currentPath.includes('?') ? currentPath.slice(currentPath.indexOf('?')) : '');
    const params = new URLSearchParams(searchString);
    const q = params.get('q');
    const cat = params.get('category');
    if (q !== null) setSearchQuery(q);
    if (cat !== null) setSelectedCategory(cat);
  }, [currentPath]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Price filter
        if (p.price > priceMax) {
          return false;
        }

        // Min rating filter
        if (minRating > 0 && (p.rating || 0) < minRating) {
          return false;
        }

        // In Stock filter
        if (inStockOnly && (p.stock ?? 0) <= 0) {
          return false;
        }

        // On Sale filter
        if (onSaleOnly && (!p.discountPercentage || p.discountPercentage <= 0)) {
          return false;
        }

        // Intelligent Token & Multi-Field Search Query filter
        if (searchQuery.trim()) {
          const query = normalizeText(searchQuery);
          const titleNorm = normalizeText(p.title);
          const descNorm = normalizeText(p.description || '');
          const categoryNorm = normalizeText(p.category);
          const brandNorm = normalizeText(p.brand || '');
          const tagsNorm = (p.tags || []).map((t) => normalizeText(t)).join(' ');

          const fullCombined = `${titleNorm} ${brandNorm} ${categoryNorm} ${tagsNorm} ${descNorm}`;
          if (fullCombined.includes(query)) return true;

          // Multi-token match: all tokens in query must match
          const queryTokens = query.split(' ').filter(Boolean);
          const allTokensMatch = queryTokens.every((token) => fullCombined.includes(token));
          return allTokensMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return b.id - a.id;
        return 0; // 'featured' order
      });
  }, [products, selectedCategory, priceMax, minRating, inStockOnly, onSaleOnly, searchQuery, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceMax, minRating, inStockOnly, onSaleOnly, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceMax(500);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    priceMax < 500 ||
    minRating > 0 ||
    inStockOnly ||
    onSaleOnly ||
    sortBy !== 'featured';

  const handleQuickViewAdd = () => {
    if (!quickViewProduct) return;
    addItemToCart(quickViewProduct, quickViewQuantity);
    setQuickViewAdded(true);
    setTimeout(() => setQuickViewAdded(false), 1500);
  };

  return (
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Header Banner */}
      <section className="border-b border-gray-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Curated Architectural Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
            Explore All Collections
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            Discover hyper-personalized lifestyle essentials. Calibrated for material authenticity, precision acoustic drivers, and timeless everyday carry.
          </p>
        </div>
      </section>

      {/* Main Catalog Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Search, Filter & Sort Controls Panel */}
        <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Smart Search Bar */}
            <div className="flex-1">
              <SmartSearchBar
                placeholder="Search products by title, category, brand, or material..."
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                onSearchSubmit={(val) => setSearchQuery(val)}
                onProductSelect={(product) => {
                  setQuickViewProduct(product);
                  setQuickViewQuantity(1);
                }}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-xs font-semibold text-[#1F2937] hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="featured">Featured (Neural Fit)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-100 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Category:</span>
            </span>

            {CURATED_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Price Slider, Rating, In-Stock & On-Sale */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs">
            <div className="flex flex-wrap items-center gap-5">
              {/* Price Max Slider */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-600">Max Price:</span>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-28 accent-emerald-600 cursor-pointer"
                />
                <span className="font-black text-emerald-600">${priceMax}</span>
              </div>

              {/* Min Rating Filter */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-600">Rating:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="h-8 px-2 text-xs rounded-lg border border-gray-200 bg-gray-50 font-medium text-[#1F2937]"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5★ & Above</option>
                  <option value={4.0}>4.0★ & Above</option>
                </select>
              </div>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-emerald-600"
                />
                <span>In Stock Only</span>
              </label>

              {/* On-Sale Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded accent-emerald-600"
                />
                <span>On Sale</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium">
                Showing <strong className="text-[#1F2937]">{filteredProducts.length}</strong> items
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid / Loading / Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-gray-200/70 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 sm:p-12 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Search className="h-6 w-6" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-[#1F2937]">No Matching Products Found</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {searchQuery
                  ? `No catalog items match your search for "${searchQuery}" with the active filters.`
                  : 'No items match your active price, rating, and category filters. Try adjusting your parameters.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={clearFilters}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 rounded-xl cursor-pointer shadow-xs"
              >
                Clear All Filters
              </Button>
            </div>

            {/* Popular Search Suggestions */}
            <div className="pt-4 border-t border-gray-100 max-w-xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Try searching for these popular items:</span>
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {POPULAR_SEARCHES.slice(0, 6).map((pop) => (
                  <button
                    key={pop}
                    type="button"
                    onClick={() => {
                      setSearchQuery(pop);
                      setSelectedCategory('all');
                    }}
                    className="rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800 transition-all cursor-pointer"
                  >
                    {pop}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Fallback Recommendations Section */}
            <div className="pt-6 border-t border-gray-100 text-left space-y-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Recommended For You
                </span>
                <h4 className="text-lg font-black text-[#1F2937]">
                  Curated Catalog Highlights
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {getSmartRecommendations(products, 3).map((recProduct) => (
                  <div key={recProduct.id} className="relative group/rec">
                    <ProductCard product={recProduct} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="relative group/card">
                  <ProductCard product={product} />
                  {/* Quick View Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setQuickViewProduct(product);
                      setQuickViewQuantity(1);
                    }}
                    className="absolute top-7 right-14 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 hover:text-emerald-600 hover:bg-white shadow-md backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-all cursor-pointer border border-gray-100"
                    title="Quick View"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls (PRD Section 5.2) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-3 rounded-xl border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3 rounded-xl border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick View Modal (PRD Section 5.2) */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {quickViewProduct.category}
              </span>
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={quickViewProduct.thumbnail || quickViewProduct.images?.[0] || ''}
                  alt={quickViewProduct.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-lg font-black text-[#1F2937]">
                    {quickViewProduct.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold mt-1">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{quickViewProduct.rating || '4.8'}</span>
                    <span className="text-gray-400 font-normal">({quickViewProduct.stock} in stock)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#1F2937]">
                    {formatCurrency(calculateDiscountPrice(quickViewProduct.price, quickViewProduct.discountPercentage))}
                  </span>
                  {quickViewProduct.discountPercentage && quickViewProduct.discountPercentage > 0 && (
                    <span className="text-gray-400 line-through">
                      {formatCurrency(quickViewProduct.price)}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed font-normal">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleQuickViewAdd}
                      className={`flex-1 h-11 text-xs font-bold rounded-xl cursor-pointer ${
                        quickViewAdded ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {quickViewAdded ? (
                        <>
                          <Check className="h-4 w-4 mr-1.5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4 mr-1.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => toggleCompare(quickViewProduct)}
                      className={`h-11 px-3 text-xs font-bold rounded-xl border ${
                        isInCompare ? 'border-emerald-600 text-emerald-700 bg-emerald-50' : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                      }`}
                      title={isInCompare ? 'In Comparison' : 'Add to Compare'}
                    >
                      <Sliders className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link
                    to={`/product/${quickViewProduct.id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-center text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline pt-1"
                  >
                    View Full Product Details Page →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
