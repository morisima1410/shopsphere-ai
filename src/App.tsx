/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import RootLayout from './app/layout';
import HomePage from './app/page';
import { RouterProvider, useRouter } from './lib/router';
import { Login, Register, ForgotPassword } from './features/auth';
import { Dashboard } from './features/dashboard';
import { ShopPage, ProductDetailPage } from './features/products';
import { WishlistPage } from './features/wishlist';
import { CartPage, CheckoutPage } from './features/cart';
import { OrdersPage } from './features/orders';
import { ComparePage } from './features/compare';
import { ReviewsPage } from './features/reviews';
import { AdminDashboard } from './features/admin';
import { AboutPage } from './features/about/AboutPage';
import { PriceDropAdvisorPage } from './features/price-advisor';
import { NotFoundPage } from './features/not-found/NotFoundPage';

function AppContent() {
  const { currentPath } = useRouter();

  // Strip query string and hashes for route matching
  const cleanPath = currentPath.split('?')[0].split('#')[0] || '/';

  // Product detail route match: /product/:id
  const productDetailMatch = cleanPath.match(/^\/product\/(\d+)$/);
  if (productDetailMatch) {
    const productId = parseInt(productDetailMatch[1], 10);
    return <ProductDetailPage productId={productId} />;
  }

  // Order detail route match: /orders/:id
  const orderDetailMatch = cleanPath.match(/^\/orders\/([A-Za-z0-9_-]+)$/);
  if (orderDetailMatch) {
    const orderId = orderDetailMatch[1];
    return <OrdersPage initialOrderId={orderId} />;
  }

  switch (cleanPath) {
    case '/':
      return <HomePage />;
    case '/shop':
    case '/products':
      return <ShopPage />;
    case '/wishlist':
      return <WishlistPage />;
    case '/price-advisor':
    case '/price-drops':
      return <PriceDropAdvisorPage />;
    case '/cart':
      return <CartPage />;
    case '/checkout':
      return <CheckoutPage />;
    case '/orders':
      return <OrdersPage />;
    case '/compare':
    case '/comparison':
      return <ComparePage />;
    case '/reviews':
      return <ReviewsPage />;
    case '/admin':
      return <AdminDashboard />;
    case '/about':
      return <AboutPage />;
    case '/dashboard':
      return <Dashboard />;
    case '/login':
      return <Login />;
    case '/register':
      return <Register />;
    case '/forgot-password':
      return <ForgotPassword />;
    default:
      return <NotFoundPage />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <RootLayout>
        <AppContent />
      </RootLayout>
    </RouterProvider>
  );
}
