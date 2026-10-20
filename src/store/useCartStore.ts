// ==============================================================================
// ShopSphere AI — Shopping Cart Zustand Store (PROJ-SHOP-260918)
// ==============================================================================

import { create } from 'zustand';
import type { CartItem, Product } from '@/types';
import { APP_CONFIG } from '@/config/constants';
import { calculateDiscountPrice } from '@/lib/utils';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1, selectedVariant) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += quantity;
        return { items: updated };
      }

      return {
        items: [...state.items, { product, quantity, selectedVariant }],
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
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
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
    return subtotal + shipping;
  },
}));
