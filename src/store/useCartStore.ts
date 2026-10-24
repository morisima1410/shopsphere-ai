// ==============================================================================
// ShopSphere AI — Shopping Cart Zustand Store with Local Storage Persistence
// Includes Save-For-Later, Stock Clamping, and Shipping Calculations (PRD MOD-05)
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { APP_CONFIG } from '@/config/constants';
import { calculateDiscountPrice } from '@/lib/utils';

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => number;
  saveForLater: (productId: number) => void;
  moveToCartFromSaved: (productId: number) => void;
  removeSavedItem: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedForLater: [],

      addItem: (product, quantity = 1, selectedVariant) => {
        set((state) => {
          const maxStock = product.stock ?? 99;
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            const desiredQty = updated[existingIndex].quantity + quantity;
            updated[existingIndex].quantity = maxStock > 0 ? Math.min(desiredQty, maxStock) : desiredQty;
            return { items: updated };
          }

          const safeQty = maxStock > 0 ? Math.min(quantity, maxStock) : quantity;
          return {
            items: [...state.items, { product, quantity: safeQty, selectedVariant }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return 0;
        }

        let clampedQty = quantity;
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stock ?? 99;
              clampedQty = maxStock > 0 ? Math.min(quantity, maxStock) : quantity;
              return { ...item, quantity: clampedQty };
            }
            return item;
          }),
        }));

        return clampedQty;
      },

      saveForLater: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return;

        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
          savedForLater: [item, ...state.savedForLater.filter((i) => i.product.id !== productId)],
        }));
      },

      moveToCartFromSaved: (productId) => {
        const item = get().savedForLater.find((i) => i.product.id === productId);
        if (!item) return;

        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.product.id !== productId),
          items: [...state.items, item],
        }));
      },

      removeSavedItem: (productId) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.product.id !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const unitPrice = calculateDiscountPrice(item.product.price, item.product.discountPercentage);
          return acc + unitPrice * item.quantity;
        }, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= APP_CONFIG.freeShippingThreshold) {
          return 0;
        }
        return APP_CONFIG.flatShippingRate;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingFee();
        return Math.round((subtotal + shipping) * 100) / 100;
      },
    }),
    {
      name: 'shopsphere_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
