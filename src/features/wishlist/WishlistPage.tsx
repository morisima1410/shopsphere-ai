// ==============================================================================
// ShopSphere AI — Wishlist Feature Component
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, ShieldAlert, TrendingDown, Bell, Check, Clock } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';

export const WishlistPage: React.FC = () => {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItemToCart = useCartStore((state) => state.addItem);

  const currentUser = useAppStore((state) => state.currentUser);
  const userId = currentUser?.id;
  const trackedProducts = usePriceAdvisorStore((state) => state.trackedProducts);
  const isTracked = usePriceAdvisorStore((state) => state.isTracked);
  const toggleTracking = usePriceAdvisorStore((state) => state.toggleTracking);
  const trackAllWishlistItems = usePriceAdvisorStore((state) => state.trackAllWishlistItems);
  const getTrackedList = usePriceAdvisorStore((state) => state.getTrackedList);

  const trackedList = React.useMemo(() => {
    return getTrackedList(userId);
  }, [trackedProducts, userId, getTrackedList]);

  const handleMoveToCart = (product: any) => {
    addItemToCart(product, 1);
    removeItem(product.id);
  };

  const untrackedWishlistCount = items.filter((p) => !isTracked(p.id, userId)).length;

  return (
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Top Banner */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <Heart className="h-3.5 w-3.5 fill-current text-emerald-600" />
            <span>Saved Inspiration</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
                My Saved Wishlist
              </h1>
              <p className="mt-1 text-sm text-gray-500 font-normal">
                {items.length === 0
                  ? 'Your saved wishlist is currently empty.'
                  : `You have ${items.length} curated ${items.length === 1 ? 'item' : 'items'} saved.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link to="/price-advisor">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50 cursor-pointer h-9 gap-1.5"
                >
                  <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Price Drop Advisor</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-bold">
                    {trackedList.length}
                  </span>
                </Button>
              </Link>

              {items.length > 0 && untrackedWishlistCount > 0 && (
                <Button
                  size="sm"
                  onClick={() => trackAllWishlistItems(items, userId)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer h-9 gap-1.5"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>Track All ({untrackedWishlistCount})</span>
                </Button>
              )}

              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 cursor-pointer h-9"
                >
                  Clear Entire Wishlist
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Wishlist Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Demonstration Storage Notice */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-600 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-[#1F2937]">Local Demonstration Storage</p>
            <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
              Wishlist items are persisted locally on this device via browser localStorage for demo purposes. In production, this syncs securely with your authenticated Firebase Firestore profile.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Heart className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1F2937]">Your Wishlist Is Empty</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Discover pieces from our precision acoustics, horology, and architectural living collections to save your favorites.
              </p>
            </div>
            <Link to="/shop">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 cursor-pointer">
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => {
              const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
              const imageSrc = product.thumbnail || product.images?.[0] || '';

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-400 hover:shadow-xl"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
                      <Link to={`/product/${product.id}`} className="block h-full w-full">
                        <img
                          src={imageSrc}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-rose-600 hover:bg-white shadow-md transition-all cursor-pointer border border-gray-100"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-bold text-[#1F2937] text-base hover:text-emerald-600 transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-1 font-normal">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#1F2937]">
                        {formatCurrency(discountedPrice)}
                      </span>

                      {/* Track Price / Stop Tracking Toggle */}
                      {isTracked(product.id, userId) ? (
                        <button
                          type="button"
                          onClick={() => toggleTracking(product, userId)}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer"
                          title="Click to stop tracking price"
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Tracking Active</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleTracking(product, userId)}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-emerald-600 hover:text-white border border-gray-200 hover:border-emerald-600 transition-colors cursor-pointer"
                          title="Start tracking price drops for this product"
                        >
                          <TrendingDown className="h-3.5 w-3.5" />
                          <span>Track Price</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Link to="/price-advisor" className="text-[11px] font-semibold text-emerald-700 hover:underline">
                        View Price Advisor →
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(product)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 rounded-xl cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Move to Cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
