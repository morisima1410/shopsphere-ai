// ==============================================================================
// ShopSphere AI — Price Drop Advisor Zustand Store
// Persisted in Local Storage; user-isolated & duplicate-protected
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';
import type { TrackedProduct, PriceDropAlert, PriceSnapshot } from '@/types/priceAdvisor';
import { calculateDiscountPrice } from '@/lib/utils';
import {
  isValidPrice,
  calculateSavings,
  calculatePercentageDecrease,
  isDuplicateAlert,
} from '@/services/priceAdvisorService';

interface PriceAdvisorState {
  trackedProducts: Record<string, TrackedProduct>;
  alerts: PriceDropAlert[];

  // Actions
  startTracking: (product: Product, userId?: string | number) => boolean;
  stopTracking: (productId: number, userId?: string | number) => void;
  toggleTracking: (product: Product, userId?: string | number) => boolean;
  isTracked: (productId: number, userId?: string | number) => boolean;
  getTrackedProduct: (productId: number, userId?: string | number) => TrackedProduct | undefined;
  getTrackedList: (userId?: string | number) => TrackedProduct[];
  
  recordPriceSnapshot: (
    productId: number,
    newPrice: number,
    userId?: string | number,
    reason?: string
  ) => boolean;

  simulatePriceUpdate: (
    productId: number,
    newPrice: number,
    userId?: string | number,
    reason?: string
  ) => boolean;

  trackAllWishlistItems: (products: Product[], userId?: string | number) => number;

  // Alerts
  getAlerts: (userId?: string | number) => PriceDropAlert[];
  getUnreadAlertsCount: (userId?: string | number) => number;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: (userId?: string | number) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: (userId?: string | number) => void;
}

function makeStorageKey(productId: number, userId?: string | number): string {
  const normUser = userId !== undefined && userId !== null ? String(userId) : 'guest';
  return `${normUser}_${productId}`;
}

export const usePriceAdvisorStore = create<PriceAdvisorState>()(
  persist(
    (set, get) => ({
      trackedProducts: {},
      alerts: [],

      isTracked: (productId: number, userId?: string | number) => {
        const key = makeStorageKey(productId, userId);
        return Boolean(get().trackedProducts[key]);
      },

      getTrackedProduct: (productId: number, userId?: string | number) => {
        const key = makeStorageKey(productId, userId);
        return get().trackedProducts[key];
      },

      getTrackedList: (userId?: string | number) => {
        const normUser = userId !== undefined && userId !== null ? String(userId) : 'guest';
        const all = Object.values(get().trackedProducts);
        return all
          .filter((item) => {
            const itemUser = item.userId !== undefined && item.userId !== null ? String(item.userId) : 'guest';
            return itemUser === normUser;
          })
          .sort((a, b) => b.trackedAt - a.trackedAt);
      },

      startTracking: (product: Product, userId?: string | number) => {
        if (!product || !isValidPrice(product.price)) {
          return false;
        }

        const effectivePrice = calculateDiscountPrice(product.price, product.discountPercentage);
        if (!isValidPrice(effectivePrice)) {
          return false;
        }

        const key = makeStorageKey(product.id, userId);
        const existing = get().trackedProducts[key];
        if (existing) {
          return true; // Already tracked
        }

        const now = Date.now();
        const initialSnapshot: PriceSnapshot = {
          timestamp: now,
          price: effectivePrice,
          reason: 'Price tracking started',
        };

        const newTracked: TrackedProduct = {
          productId: product.id,
          productTitle: product.title,
          productCategory: product.category,
          productImage: product.thumbnail || product.images?.[0] || '',
          initialPrice: effectivePrice,
          currentPrice: effectivePrice,
          previousPrice: undefined, // Strictly no previous history before tracking started!
          lowestPrice: effectivePrice,
          highestPrice: effectivePrice,
          trackedAt: now,
          lastCheckedAt: now,
          priceSnapshots: [initialSnapshot],
          userId: userId !== undefined && userId !== null ? String(userId) : 'guest',
        };

        set((state) => ({
          trackedProducts: {
            ...state.trackedProducts,
            [key]: newTracked,
          },
        }));

        return true;
      },

      stopTracking: (productId: number, userId?: string | number) => {
        const key = makeStorageKey(productId, userId);
        set((state) => {
          const next = { ...state.trackedProducts };
          delete next[key];
          return { trackedProducts: next };
        });
      },

      toggleTracking: (product: Product, userId?: string | number) => {
        if (get().isTracked(product.id, userId)) {
          get().stopTracking(product.id, userId);
          return false;
        } else {
          return get().startTracking(product, userId);
        }
      },

      recordPriceSnapshot: (
        productId: number,
        newPrice: number,
        userId?: string | number,
        reason?: string
      ) => {
        if (!isValidPrice(newPrice)) {
          return false;
        }

        const key = makeStorageKey(productId, userId);
        const tracked = get().trackedProducts[key];
        if (!tracked) {
          return false;
        }

        const now = Date.now();
        const oldPrice = tracked.currentPrice;
        const newSnapshot: PriceSnapshot = {
          timestamp: now,
          price: newPrice,
          reason: reason || 'Verified price check',
        };

        const updatedSnapshots = [...tracked.priceSnapshots, newSnapshot];
        const allPrices = updatedSnapshots.map((s) => s.price);
        const lowestPrice = Math.min(...allPrices);
        const highestPrice = Math.max(...allPrices);

        const updatedTracked: TrackedProduct = {
          ...tracked,
          previousPrice: oldPrice,
          currentPrice: newPrice,
          lowestPrice,
          highestPrice,
          lastCheckedAt: now,
          priceSnapshots: updatedSnapshots,
        };

        // Check if price dropped
        const currentAlerts = get().alerts;
        let newAlerts = [...currentAlerts];

        if (newPrice < oldPrice) {
          const isDup = isDuplicateAlert(currentAlerts, productId, newPrice, oldPrice, userId);
          if (!isDup) {
            const savings = calculateSavings(oldPrice, newPrice);
            const percentageDecrease = calculatePercentageDecrease(oldPrice, newPrice);

            const alert: PriceDropAlert = {
              id: `alert_${now}_${Math.random().toString(36).slice(2, 7)}`,
              productId,
              productTitle: tracked.productTitle,
              productImage: tracked.productImage,
              previousPrice: oldPrice,
              newPrice,
              savings,
              percentageDecrease,
              timestamp: now,
              read: false,
              userId: userId !== undefined && userId !== null ? String(userId) : 'guest',
            };

            newAlerts = [alert, ...newAlerts];
          }
        }

        set((state) => ({
          trackedProducts: {
            ...state.trackedProducts,
            [key]: updatedTracked,
          },
          alerts: newAlerts,
        }));

        return true;
      },

      simulatePriceUpdate: (
        productId: number,
        newPrice: number,
        userId?: string | number,
        reason?: string
      ) => {
        return get().recordPriceSnapshot(productId, newPrice, userId, reason || 'Simulated market change');
      },

      trackAllWishlistItems: (products: Product[], userId?: string | number) => {
        let count = 0;
        for (const product of products) {
          if (!get().isTracked(product.id, userId)) {
            if (get().startTracking(product, userId)) {
              count++;
            }
          }
        }
        return count;
      },

      getAlerts: (userId?: string | number) => {
        const normUser = userId !== undefined && userId !== null ? String(userId) : 'guest';
        return get().alerts
          .filter((a) => {
            const aUser = a.userId !== undefined && a.userId !== null ? String(a.userId) : 'guest';
            return aUser === normUser;
          })
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      getUnreadAlertsCount: (userId?: string | number) => {
        return get().getAlerts(userId).filter((a) => !a.read).length;
      },

      markAlertAsRead: (alertId: string) => {
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)),
        }));
      },

      markAllAlertsAsRead: (userId?: string | number) => {
        const normUser = userId !== undefined && userId !== null ? String(userId) : 'guest';
        set((state) => ({
          alerts: state.alerts.map((a) => {
            const aUser = a.userId !== undefined && a.userId !== null ? String(a.userId) : 'guest';
            return aUser === normUser ? { ...a, read: true } : a;
          }),
        }));
      },

      dismissAlert: (alertId: string) => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== alertId),
        }));
      },

      clearAllAlerts: (userId?: string | number) => {
        const normUser = userId !== undefined && userId !== null ? String(userId) : 'guest';
        set((state) => ({
          alerts: state.alerts.filter((a) => {
            const aUser = a.userId !== undefined && a.userId !== null ? String(a.userId) : 'guest';
            return aUser !== normUser;
          }),
        }));
      },
    }),
    {
      name: 'shopsphere_price_advisor_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
