// ==============================================================================
// ShopSphere AI — Price Drop Advisor Feature Dashboard
// Theme: Emerald Green (#059669) + White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Bell,
  Heart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Filter,
  CheckCircle2,
  RefreshCw,
  Search,
  PlusCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAppStore } from '@/store/useAppStore';
import { CURATED_PRODUCTS } from '@/services/productsData';
import { formatCurrency } from '@/lib/utils';
import { Link, useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { TrackedProductCard } from './TrackedProductCard';
import { PriceDropAlertsList } from './PriceDropAlertsList';

export const PriceDropAdvisorPage: React.FC = () => {
  const { currentPath } = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const userId = currentUser?.id;

  // Stores
  const trackedProductsMap = usePriceAdvisorStore((state) => state.trackedProducts);
  const getTrackedList = usePriceAdvisorStore((state) => state.getTrackedList);
  const getAlerts = usePriceAdvisorStore((state) => state.getAlerts);
  const startTracking = usePriceAdvisorStore((state) => state.startTracking);
  const trackAllWishlistItems = usePriceAdvisorStore((state) => state.trackAllWishlistItems);
  const wishlistItems = useWishlistStore((state) => state.items);

  const [activeTab, setActiveTab] = useState<'all' | 'drops' | 'alerts'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [syncedBannerFeedback, setSyncedBannerFeedback] = useState<string | null>(null);

  // Read list for current user
  const trackedList = useMemo(() => {
    return getTrackedList(userId);
  }, [trackedProductsMap, userId, getTrackedList]);

  const alerts = useMemo(() => {
    return getAlerts(userId);
  }, [userId, getAlerts]);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  // Items currently at a genuine price drop compared to their previous or initial price
  const droppedProducts = useMemo(() => {
    return trackedList.filter((item) => {
      if (item.previousPrice !== undefined && item.currentPrice < item.previousPrice) {
        return true;
      }
      return item.currentPrice < item.initialPrice;
    });
  }, [trackedList]);

  // Total potential savings currently available across all dropped products
  const totalPotentialSavings = useMemo(() => {
    return droppedProducts.reduce((acc, item) => {
      const baseline = item.previousPrice !== undefined ? item.previousPrice : item.initialPrice;
      const savings = baseline > item.currentPrice ? baseline - item.currentPrice : 0;
      return acc + savings;
    }, 0);
  }, [droppedProducts]);

  // Best recorded price
  const bestRecordedPrice = useMemo(() => {
    if (trackedList.length === 0) return 0;
    return Math.min(...trackedList.map((t) => t.lowestPrice));
  }, [trackedList]);

  // Wishlist items not yet tracked
  const untrackedWishlistCount = useMemo(() => {
    return wishlistItems.filter((w) => !trackedList.some((t) => t.productId === w.id)).length;
  }, [wishlistItems, trackedList]);

  const handleSyncWishlist = () => {
    const addedCount = trackAllWishlistItems(wishlistItems, userId);
    setSyncedBannerFeedback(
      addedCount > 0
        ? `Successfully enabled tracking for ${addedCount} wishlist item${addedCount === 1 ? '' : 's'}!`
        : 'All wishlist items are already actively monitored.'
    );
    setTimeout(() => setSyncedBannerFeedback(null), 4000);
  };

  const handleTrackStarterCurated = () => {
    const starterItems = CURATED_PRODUCTS.slice(0, 3);
    for (const item of starterItems) {
      startTracking(item, userId);
    }
  };

  // Filtered tracked list
  const filteredTrackedList = useMemo(() => {
    const listToFilter = activeTab === 'drops' ? droppedProducts : trackedList;
    if (!searchFilter.trim()) return listToFilter;
    const q = searchFilter.toLowerCase();
    return listToFilter.filter(
      (item) =>
        item.productTitle.toLowerCase().includes(q) ||
        item.productCategory.toLowerCase().includes(q)
    );
  }, [activeTab, droppedProducts, trackedList, searchFilter]);

  return (
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Top Hero Banner */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Price Drop Advisor & Price History</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
                Smart Price Drop Advisor
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 font-normal max-w-2xl leading-relaxed">
                Track genuine product price changes over time, analyze verified historical snapshots, and receive immediate in-app notifications whenever prices fall.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link to="/wishlist">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-bold text-gray-700 border-gray-300 hover:border-emerald-400 gap-1.5 cursor-pointer rounded-xl h-9"
                >
                  <Heart className="h-4 w-4 text-emerald-600" />
                  <span>My Wishlist ({wishlistItems.length})</span>
                </Button>
              </Link>

              <Link to="/shop">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer rounded-xl h-9"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Wishlist Integration Banner */}
        {untrackedWishlistCount > 0 && (
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs shrink-0">
                <Heart className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-[#1F2937]">
                  Sync Wishlist to Price Tracking
                </h3>
                <p className="text-xs text-gray-600">
                  You have <strong>{untrackedWishlistCount}</strong> saved wishlist {untrackedWishlistCount === 1 ? 'item' : 'items'} not currently being monitored.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSyncWishlist}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 rounded-xl cursor-pointer shrink-0"
            >
              <Zap className="h-4 w-4" />
              <span>Track All Wishlist Items</span>
            </Button>
          </div>
        )}

        {/* Feedback Message */}
        {syncedBannerFeedback && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{syncedBannerFeedback}</span>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Metric 1: Tracked Products */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Tracked Items
              </span>
              <Layers className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-[#1F2937]">
              {trackedList.length}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              Active monitoring enabled
            </p>
          </div>

          {/* Metric 2: Price Drops Detected */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Active Price Drops
              </span>
              <TrendingDown className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700">
              {droppedProducts.length}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">
              Products cheaper than initial
            </p>
          </div>

          {/* Metric 3: Total Potential Savings */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Potential Savings
              </span>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-[#1F2937]">
              {formatCurrency(totalPotentialSavings)}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              On currently discounted items
            </p>
          </div>

          {/* Metric 4: Unread Alerts */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Smart Alerts
              </span>
              <Bell className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-[#1F2937]">
              {alerts.length}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              {unreadAlertsCount > 0 ? `${unreadAlertsCount} unread notification${unreadAlertsCount === 1 ? '' : 's'}` : 'All alerts caught up'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>Tracked Products</span>
              <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                {trackedList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drops')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'drops'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>Price Drops</span>
              <span className="ml-1.5 rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px]">
                {droppedProducts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>Alerts Inbox</span>
              {unreadAlertsCount > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-500 text-white px-1.5 py-0.5 text-[10px] font-black">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Search Input */}
          {activeTab !== 'alerts' && trackedList.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter tracked items..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white py-1.5 pl-8 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'alerts' ? (
          <PriceDropAlertsList alerts={alerts} userId={userId} />
        ) : (
          <div>
            {filteredTrackedList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <TrendingDown className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1F2937]">
                    {activeTab === 'drops'
                      ? 'No Genuine Price Drops Detected Yet'
                      : 'No Monitored Products Yet'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    {activeTab === 'drops'
                      ? 'All tracked items are currently at or above their recorded starting prices. Try simulating a price drop below or check back soon!'
                      : 'Add items from your wishlist or our curated catalog to monitor price changes, view price charts, and receive instant alerts.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={handleTrackStarterCurated}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 rounded-xl cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Track Top 3 Featured Products</span>
                  </Button>

                  <Link to="/shop">
                    <Button
                      variant="outline"
                      className="text-xs font-bold text-gray-700 border-gray-300 hover:border-emerald-400 cursor-pointer rounded-xl"
                    >
                      <span>Explore Catalog</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTrackedList.map((tracked) => (
                  <TrackedProductCard
                    key={tracked.productId}
                    trackedProduct={tracked}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Educational Disclosure & Privacy Note */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-600 flex items-start gap-3 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-[#1F2937]">Authentic Price History Guarantee</p>
            <p className="text-[11px] text-gray-500 leading-relaxed font-normal">
              ShopSphere AI records actual timestamped price points strictly starting from the moment you enable tracking. We never fabricate historical discounts or calculate savings from unverified periods. In-app alerts are delivered directly to your session when an active price decreases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
