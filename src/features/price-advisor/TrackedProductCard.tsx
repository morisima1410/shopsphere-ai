// ==============================================================================
// ShopSphere AI — Tracked Product Card Component
// Theme: Emerald Green (#059669) + White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Trash2,
  LineChart,
  ShoppingBag,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import type { TrackedProduct } from '@/types/priceAdvisor';
import { formatCurrency } from '@/lib/utils';
import { evaluatePriceChange } from '@/services/priceAdvisorService';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import { useCartStore } from '@/store/useCartStore';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { PriceHistoryChart } from './PriceHistoryChart';

interface TrackedProductCardProps {
  trackedProduct: TrackedProduct;
  userId?: string | number;
}

export const TrackedProductCard: React.FC<TrackedProductCardProps> = ({
  trackedProduct,
  userId,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState('');

  const stopTracking = usePriceAdvisorStore((state) => state.stopTracking);
  const simulatePriceUpdate = usePriceAdvisorStore((state) => state.simulatePriceUpdate);
  const addItemToCart = useCartStore((state) => state.addItem);

  const {
    productId,
    productTitle,
    productCategory,
    productImage,
    initialPrice,
    currentPrice,
    previousPrice,
    lowestPrice,
    highestPrice,
    trackedAt,
    priceSnapshots,
  } = trackedProduct;

  const evaluation = evaluatePriceChange(previousPrice, currentPrice);

  const handleStopTracking = () => {
    stopTracking(productId, userId);
  };

  const handleSimulateDrop = (percent: number) => {
    const targetPrice = Math.round(currentPrice * (1 - percent / 100) * 100) / 100;
    if (targetPrice > 0) {
      simulatePriceUpdate(
        productId,
        targetPrice,
        userId,
        `Simulated ${percent}% Price Drop`
      );
    }
  };

  const handleSimulateIncrease = (percent: number) => {
    const targetPrice = Math.round(currentPrice * (1 + percent / 100) * 100) / 100;
    simulatePriceUpdate(
      productId,
      targetPrice,
      userId,
      `Simulated ${percent}% Price Increase`
    );
  };

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customPriceInput);
    if (!isNaN(parsed) && parsed > 0) {
      simulatePriceUpdate(
        productId,
        Math.round(parsed * 100) / 100,
        userId,
        'Manual price check update'
      );
      setCustomPriceInput('');
    }
  };

  const hasHistory = priceSnapshots.length >= 2;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-lg">
      <div>
        {/* Top Header: Image & Badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
          <Link to={`/product/${productId}`} className="block h-full w-full">
            <img
              src={productImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'}
              alt={productTitle}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Status Badge in Top-Left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold shadow-xs backdrop-blur-md border border-gray-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-800">Tracking Active</span>
          </div>

          {/* Stop Tracking Button in Top-Right */}
          <button
            type="button"
            onClick={handleStopTracking}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 hover:text-rose-600 hover:bg-white shadow-xs transition-colors cursor-pointer"
            title="Stop tracking this product"
            aria-label="Stop tracking"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Product Meta */}
        <div className="mt-4 space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            {productCategory}
          </span>
          <Link to={`/product/${productId}`} className="block">
            <h3 className="font-bold text-[#1F2937] text-base hover:text-emerald-600 transition-colors line-clamp-1">
              {productTitle}
            </h3>
          </Link>
        </div>

        {/* Price Metrics Container */}
        <div className="mt-4 rounded-2xl bg-gray-50/80 p-3.5 border border-gray-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Current Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#1F2937]">
                  {formatCurrency(currentPrice)}
                </span>
                {previousPrice !== undefined && previousPrice !== currentPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(previousPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Price Evaluation Status */}
            {hasHistory ? (
              <div>
                {evaluation.isDrop && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span>-{formatCurrency(evaluation.savings)} (-{evaluation.percentageDecrease}%)</span>
                  </span>
                )}
                {evaluation.isIncrease && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+{formatCurrency(evaluation.increaseAmount)} (+{evaluation.percentageIncrease}%)</span>
                  </span>
                )}
                {evaluation.isUnchanged && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-200/70 px-2.5 py-1 text-xs font-medium text-gray-700">
                    <Minus className="h-3 w-3" />
                    <span>Price Unchanged</span>
                  </span>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                <Clock className="h-3 w-3" />
                <span>Baseline Set</span>
              </span>
            )}
          </div>

          {/* Lowest & Highest Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Lowest Recorded:</span>
              <p className="font-bold text-emerald-700 mt-0.5">{formatCurrency(lowestPrice)}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Highest Recorded:</span>
              <p className="font-semibold text-gray-700 mt-0.5">{formatCurrency(highestPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistoryModal((prev) => !prev)}
          className="text-xs font-bold text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer rounded-xl"
        >
          <LineChart className="h-3.5 w-3.5 text-emerald-600" />
          <span>{showHistoryModal ? 'Hide History' : 'Price History'}</span>
        </Button>

        <button
          type="button"
          onClick={() => setShowSimulator((prev) => !prev)}
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-emerald-50"
        >
          <Sparkles className="h-3 w-3" />
          <span>Test Drop</span>
          {showSimulator ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Simulator Quick Testing Drawer */}
      {showSimulator && (
        <div className="mt-3 rounded-2xl bg-emerald-50/70 p-3 border border-emerald-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900">Simulate Price Event:</span>
            <span className="text-[10px] text-emerald-700">Verifies drop detection & alerts</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSimulateDrop(10)}
              className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors cursor-pointer"
            >
              -10% Drop
            </button>
            <button
              type="button"
              onClick={() => handleSimulateDrop(25)}
              className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors cursor-pointer"
            >
              -25% Drop
            </button>
            <button
              type="button"
              onClick={() => handleSimulateIncrease(15)}
              className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-600 hover:text-white border border-amber-200 transition-colors cursor-pointer"
            >
              +15% Rise
            </button>
          </div>

          <form onSubmit={handleCustomPriceSubmit} className="flex gap-2 pt-1">
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={customPriceInput}
              onChange={(e) => setCustomPriceInput(e.target.value)}
              placeholder="Set exact price..."
              className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-hidden"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 font-bold h-7 cursor-pointer"
            >
              Update
            </Button>
          </form>
        </div>
      )}

      {/* Expanded Price History Chart Drawer */}
      {showHistoryModal && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <PriceHistoryChart
            productTitle={productTitle}
            snapshots={priceSnapshots}
            trackedAt={trackedAt}
          />
        </div>
      )}
    </div>
  );
};
