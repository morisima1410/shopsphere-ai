// ==============================================================================
// ShopSphere AI — Customer Reviews Zustand Store
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProductReview } from '@/types';
import reviewsFixture from '../../fixtures/reviews.json';

export interface ExtendedReview extends ProductReview {
  id?: number | string;
  productId: number;
}

interface ReviewsState {
  reviews: ExtendedReview[];
  addReview: (review: ExtendedReview) => void;
  getReviewsForProduct: (productId: number) => ExtendedReview[];
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: reviewsFixture as unknown as ExtendedReview[],

      addReview: (review) => {
        set((state) => ({
          reviews: [review, ...state.reviews],
        }));
      },

      getReviewsForProduct: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },
    }),
    {
      name: 'shopsphere_reviews',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
