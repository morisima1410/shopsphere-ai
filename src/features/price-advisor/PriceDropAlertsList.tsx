// ==============================================================================
// ShopSphere AI — Price Drop In-App Alerts List Component
// Smart, user-isolated notifications for genuine price decreases
// Theme: Emerald Green (#059669) + White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React from 'react';
import {
  Bell,
  TrendingDown,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { PriceDropAlert } from '@/types/priceAdvisor';
import { formatCurrency } from '@/lib/utils';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import { useCartStore } from '@/store/useCartStore';
import { getProductById } from '@/services/productsData';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';

interface PriceDropAlertsListProps {
  alerts: PriceDropAlert[];
  userId?: string | number;
  onNavigateProduct?: (productId: number) => void;
}

export const PriceDropAlertsList: React.FC<PriceDropAlertsListProps> = ({
  alerts,
  userId,
  onNavigateProduct,
}) => {
  const markAlertAsRead = usePriceAdvisorStore((state) => state.markAlertAsRead);
  const markAllAlertsAsRead = usePriceAdvisorStore((state) => state.markAllAlertsAsRead);
  const dismissAlert = usePriceAdvisorStore((state) => state.dismissAlert);
  const clearAllAlerts = usePriceAdvisorStore((state) => state.clearAllAlerts);
  const addItemToCart = useCartStore((state) => state.addItem);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleAddToCart = (productId: number) => {
    const product = getProductById(productId);
    if (product) {
      addItemToCart(product, 1);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Bell className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#1F2937]">No Active Price Drops Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You will receive instant in-app alerts right here as soon as any product you are tracking drops in price.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1F2937]">
              Price Drop Notifications ({alerts.length})
            </h3>
            <p className="text-[11px] text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}` : 'All alerts marked as read'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAlertsAsRead(userId)}
              className="text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 cursor-pointer h-8"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              <span>Mark All Read</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearAllAlerts(userId)}
            className="text-xs font-medium text-gray-500 hover:text-rose-600 cursor-pointer h-8"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Alert Items List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const dateStr = new Date(alert.timestamp).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={alert.id}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                alert.read
                  ? 'bg-white border-gray-200 opacity-90'
                  : 'bg-emerald-50/40 border-emerald-300 shadow-xs'
              }`}
            >
              {/* Product Info & Drop Details */}
              <div className="flex items-start gap-3.5">
                <Link to={`/product/${alert.productId}`} className="shrink-0">
                  <img
                    src={alert.productImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'}
                    alt={alert.productTitle}
                    className="h-16 w-16 rounded-xl object-cover border border-gray-200 bg-gray-100"
                  />
                </Link>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                      <TrendingDown className="h-3 w-3" />
                      <span>Price Dropped</span>
                    </span>

                    {!alert.read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
                    )}

                    <span className="text-[11px] text-gray-400">{dateStr}</span>
                  </div>

                  <Link to={`/product/${alert.productId}`}>
                    <h4 className="text-sm font-bold text-[#1F2937] hover:text-emerald-600 transition-colors line-clamp-1">
                      {alert.productTitle}
                    </h4>
                  </Link>

                  <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
                    <span className="text-base font-black text-emerald-800">
                      {formatCurrency(alert.newPrice)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(alert.previousPrice)}
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-200">
                      Save {formatCurrency(alert.savings)} ({alert.percentageDecrease}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Link to={`/product/${alert.productId}`}>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-3 rounded-xl cursor-pointer"
                    >
                      <span>View Deal</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(alert.productId)}
                    className="text-xs font-semibold text-gray-700 border-gray-200 hover:border-emerald-300 h-8 px-2.5 rounded-xl cursor-pointer"
                    title="Add to cart"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.read && (
                    <button
                      type="button"
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-[11px] text-gray-400 hover:text-rose-600 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
