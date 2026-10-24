// ==============================================================================
// ShopSphere AI — Recently Viewed Products Store
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RecentlyViewedState {
  productIds: number[];
  addProductView: (productId: number) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [1, 2, 5, 8], // Initial recent views from fixtures

      addProductView: (productId) => {
        set((state) => {
          const filtered = state.productIds.filter((id) => id !== productId);
          return {
            productIds: [productId, ...filtered].slice(0, 10), // keep latest 10
          };
        });
      },

      clearHistory: () => set({ productIds: [] }),
    }),
    {
      name: 'shopsphere_recent_views',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
