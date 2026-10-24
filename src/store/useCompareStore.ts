// ==============================================================================
// ShopSphere AI — Product Comparison Zustand Store
// Supports side-by-side comparison matrix for up to 4 products
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';

interface CompareState {
  products: Product[];
  addProduct: (product: Product) => boolean;
  removeProduct: (productId: number) => void;
  toggleProduct: (product: Product) => void;
  isInCompare: (productId: number) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const { products } = get();
        if (products.some((p) => p.id === product.id)) return true;
        if (products.length >= 4) return false; // Max 4 products for comparison
        set({ products: [...products, product] });
        return true;
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      toggleProduct: (product) => {
        if (get().isInCompare(product.id)) {
          get().removeProduct(product.id);
        } else {
          get().addProduct(product);
        }
      },

      isInCompare: (productId) => {
        return get().products.some((p) => p.id === productId);
      },

      clearCompare: () => set({ products: [] }),
    }),
    {
      name: 'shopsphere_compare',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
