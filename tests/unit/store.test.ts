// ==============================================================================
// ShopSphere AI — Unit Tests: Zustand Stores (Cart & Wishlist)
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { Product } from '@/types';

const mockProductA: Product = {
  id: 1,
  title: 'Mechanical Keyboard',
  description: 'Custom mechanical keyboard with hot-swappable switches',
  category: 'electronics',
  price: 100,
  discountPercentage: 10, // 90 after discount
  rating: 4.8,
  stock: 25,
  images: [],
  thumbnail: '',
};

const mockProductB: Product = {
  id: 2,
  title: 'Wireless Gaming Mouse',
  description: 'Ultra-lightweight gaming mouse',
  category: 'electronics',
  price: 50,
  rating: 4.6,
  stock: 40,
  images: [],
  thumbnail: '',
};

describe('Zustand State Stores Test Suite', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist();
  });

  describe('useCartStore', () => {
    it('starts with an empty cart', () => {
      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().getTotalItems()).toBe(0);
      expect(useCartStore.getState().getSubtotal()).toBe(0);
    });

    it('adds an item to the cart and calculates subtotal with discount', () => {
      useCartStore.getState().addItem(mockProductA, 2);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
      expect(useCartStore.getState().getTotalItems()).toBe(2);
      // Unit price with 10% discount is 90 * 2 = 180
      expect(useCartStore.getState().getSubtotal()).toBe(180);
    });

    it('increments quantity when adding the same product', () => {
      useCartStore.getState().addItem(mockProductB, 1);
      useCartStore.getState().addItem(mockProductB, 2);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it('removes an item from cart', () => {
      useCartStore.getState().addItem(mockProductA, 1);
      useCartStore.getState().removeItem(1);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('applies free shipping when exceeding the threshold ($50)', () => {
      useCartStore.getState().addItem(mockProductA, 1); // 90 > 50
      expect(useCartStore.getState().getShippingFee()).toBe(0);
      expect(useCartStore.getState().getGrandTotal()).toBe(90);
    });
  });

  describe('useWishlistStore', () => {
    it('toggles items in wishlist', () => {
      expect(useWishlistStore.getState().isInWishlist(mockProductA.id)).toBe(false);

      useWishlistStore.getState().toggleItem(mockProductA);
      expect(useWishlistStore.getState().isInWishlist(mockProductA.id)).toBe(true);
      expect(useWishlistStore.getState().items).toHaveLength(1);

      // Toggle off
      useWishlistStore.getState().toggleItem(mockProductA);
      expect(useWishlistStore.getState().isInWishlist(mockProductA.id)).toBe(false);
      expect(useWishlistStore.getState().items).toHaveLength(0);
    });
  });
});
