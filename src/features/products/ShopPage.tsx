// ==============================================================================
// ShopSphere AI — Product Catalog & Shop Experience (PRD Section 5.2 MOD-02)
// Complete with Quick View Modal, Advanced Filters, Rating, In-Stock, and Pagination
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
import { Link } from '@/lib/router';

const ITEMS_PER_PAGE = 6;

export const ShopPage: React.FC = () => {
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

  // Sync with URL query parameter on mount if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const cat = params.get('category');
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, []);

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

        // Search Query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          const matchBrand = p.brand?.toLowerCase().includes(query);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(query));
          return matchTitle || matchDesc || matchCategory || matchBrand || matchTags;
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
    <div className="w-full bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors pb-24">
      {/* Header Banner */}
      <section className="border-b border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span>Curated Architectural Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore All Collections
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
            Discover hyper-personalized lifestyle essentials. Calibrated for material authenticity, precision acoustic drivers, and timeless everyday carry.
          </p>
        </div>
      </section>

      {/* Main Catalog Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Search, Filter & Sort Controls Panel */}
        <div className="flex flex-col gap-4 rounded-3xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search products by title, material, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-xs border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white dark:border-stone-700 dark:bg-stone-800/80 rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-stone-400" />
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 rounded-xl border border-stone-200 bg-stone-50/50 px-3 text-xs font-semibold text-slate-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 cursor-pointer"
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-stone-100 dark:border-stone-800 scrollbar-none">
            <span className="text-xs font-bold text-stone-400 shrink-0 mr-1 flex items-center gap-1">
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
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Price Slider, Rating, In-Stock & On-Sale */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
            <div className="flex flex-wrap items-center gap-5">
              {/* Price Max Slider */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-600 dark:text-stone-400">Max Price:</span>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-28 accent-blue-600 cursor-pointer"
                />
                <span className="font-black text-blue-600 dark:text-blue-400">${priceMax}</span>
              </div>

              {/* Min Rating Filter */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-600 dark:text-stone-400">Rating:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="h-8 px-2 text-xs rounded-lg border border-stone-200 bg-stone-50 font-medium"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5★ & Above</option>
                  <option value={4.0}>4.0★ & Above</option>
                </select>
              </div>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>In Stock Only</span>
              </label>

              {/* On-Sale Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-stone-700 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>On Sale</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-stone-500 font-medium">
                Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> items
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer flex items-center gap-1"
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
              <div key={n} className="h-80 rounded-3xl bg-stone-200/70 dark:bg-stone-800 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matching Products Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No items match your active search, price, and category filters. Try adjusting your parameters.
              </p>
            </div>
            <Button onClick={clearFilters} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
              Clear All Filters
            </Button>
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
                    className="absolute top-7 right-14 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-700 hover:text-blue-600 hover:bg-white shadow-md backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-all cursor-pointer"
                    title="Quick View"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls (PRD Section 5.2) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200/80 dark:border-stone-800">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-3 rounded-xl border-stone-300 gap-1 cursor-pointer"
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
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200'
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
                  className="h-9 px-3 rounded-xl border-stone-300 gap-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wider">
                {quickViewProduct.category}
              </span>
              <button
                type="button"
                onClick={() => setQuickViewProduct(null)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                <img
                  src={quickViewProduct.thumbnail || quickViewProduct.images?.[0] || ''}
                  alt={quickViewProduct.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {quickViewProduct.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold mt-1">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{quickViewProduct.rating || '4.8'}</span>
                    <span className="text-stone-400 font-normal">({quickViewProduct.stock} in stock)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(calculateDiscountPrice(quickViewProduct.price, quickViewProduct.discountPercentage))}
                  </span>
                  {quickViewProduct.discountPercentage && quickViewProduct.discountPercentage > 0 && (
                    <span className="text-stone-400 line-through">
                      {formatCurrency(quickViewProduct.price)}
                    </span>
                  )}
                </div>

                <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleQuickViewAdd}
                      className={`flex-1 h-11 text-xs font-bold rounded-xl cursor-pointer ${
                        quickViewAdded ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
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
                        isInCompare ? 'border-blue-600 text-blue-600' : 'border-stone-300'
                      }`}
                      title={isInCompare ? 'In Comparison' : 'Add to Compare'}
                    >
                      <Sliders className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link
                    to={`/product/${quickViewProduct.id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-center text-[11px] font-bold text-blue-600 hover:underline pt-1"
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
