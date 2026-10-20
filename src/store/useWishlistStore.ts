// ==============================================================================
// ShopSphere AI — Wishlist Zustand Store (PROJ-SHOP-260918)
// ==============================================================================

import { create } from 'zustand';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  hasItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (product) => {
    if (!get().isInWishlist(product.id)) {
      set((state) => ({ items: [...state.items, product] }));
    }
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((p) => p.id !== productId),
    }));
  },

  toggleItem: (product) => {
    if (get().isInWishlist(product.id)) {
      get().removeItem(product.id);
    } else {
      get().addItem(product);
    }
  },

  hasItem: (productId) => {
    return get().isInWishlist(productId);
  },

  isInWishlist: (productId) => {
    return get().items.some((p) => p.id === productId);
  },

  clearWishlist: () => set({ items: [] }),
}));
