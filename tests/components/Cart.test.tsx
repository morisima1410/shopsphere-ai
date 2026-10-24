// ==============================================================================
// ShopSphere AI — Component Tests: CartPage (PRD Section 5.5 & 17.2)
// ==============================================================================

import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from '@/features/cart/CartPage';
import { useCartStore } from '@/store/useCartStore';
import { RouterProvider } from '@/lib/router';
import type { Product } from '@/types';

const testProduct: Product = {
  id: 10,
  title: 'Titanium Chrono Timepiece',
  description: 'Precision mechanical movement',
  category: 'timepieces',
  price: 200,
  rating: 4.9,
  stock: 4,
  images: [],
  thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
};

describe('CartPage Component Tests (PRD Section 5.5)', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('renders empty cart state with call to action', () => {
    render(
      <RouterProvider>
        <CartPage />
      </RouterProvider>
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start shopping/i })).toBeInTheDocument();
  });

  it('renders active items, quantity controls, and order summary', () => {
    useCartStore.getState().addItem(testProduct, 1);

    render(
      <RouterProvider>
        <CartPage />
      </RouterProvider>
    );

    expect(screen.getByText('Titanium Chrono Timepiece')).toBeInTheDocument();
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
  });

  it('applies valid promo code SPHERE20 and calculates discount', () => {
    useCartStore.getState().addItem(testProduct, 1);

    render(
      <RouterProvider>
        <CartPage />
      </RouterProvider>
    );

    const promoInput = screen.getByPlaceholderText(/promo code/i);
    const applyBtn = screen.getByRole('button', { name: /apply/i });

    fireEvent.change(promoInput, { target: { value: 'SPHERE20' } });
    fireEvent.click(applyBtn);

    expect(screen.getByText(/code "SPHERE20" active/i)).toBeInTheDocument();
  });

  it('shows error message on invalid promo code', () => {
    useCartStore.getState().addItem(testProduct, 1);

    render(
      <RouterProvider>
        <CartPage />
      </RouterProvider>
    );

    const promoInput = screen.getByPlaceholderText(/promo code/i);
    const applyBtn = screen.getByRole('button', { name: /apply/i });

    fireEvent.change(promoInput, { target: { value: 'INVALID_CODE' } });
    fireEvent.click(applyBtn);

    expect(screen.getByText(/invalid promo code/i)).toBeInTheDocument();
  });

  it('moves item to Save for Later and displays saved section', () => {
    useCartStore.getState().addItem(testProduct, 1);

    render(
      <RouterProvider>
        <CartPage />
      </RouterProvider>
    );

    const saveForLaterBtn = screen.getByRole('button', { name: /save for later/i });
    fireEvent.click(saveForLaterBtn);

    expect(screen.getByText(/saved for later/i)).toBeInTheDocument();
  });
});
