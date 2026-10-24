# ShopSphere AI — Personalized Shopping, Powered by Intelligence

**Project ID:** PROJ-SHOP-260918  
**Platform:** Google AI Studio / Web Runtime  
**Stack:** Vite + React 19 + TypeScript + Tailwind CSS + Firebase Auth  
**Version:** Production Release (PRD Complete)

---

## 1. Project Overview

**ShopSphere AI** is a premium, AI-powered ecommerce web application engineered with Vite, React 19, TypeScript, and Tailwind CSS. The platform combines high-performance client rendering with:
- **9-Strategy Recommendation Engine:** Personalized picks, trending/popular, frequently bought together, similar items, price drops, new arrivals, recently viewed, top category picks, and cart upsells.
- **Firebase Authentication:** Secure email/password and Google OAuth sign-in, session persistence, and self-service password recovery.
- **End-to-End Order Lifecycle:** Cart management, demonstration checkout flow, persistent order tracking, itemized receipts, and reordering.
- **Customer Dashboard:** Overview KPIs, live order tracking, multi-address management, review history, recently viewed carousel, and security controls.
- **Product Comparison Matrix:** Side-by-side spec, warranty, and pricing evaluation for up to 4 items simultaneously.
- **Verified Customer Reviews:** Community reviews hub, star ratings breakdown, product filtering, and review posting form.
- **Administrative Governance Console:** Real-time revenue & order telemetry, category performance analytics, order fulfillment status transitions, and catalog inventory stock controls.

---

## 2. Technology Stack & Architecture

- **Runtime & Build System:** Vite 6.x (Fast HMR, optimized production rollup bundle)
- **UI Framework:** React 19 (Modern hooks, concurrent rendering, error boundaries)
- **Type Safety:** TypeScript 5.x (Strict type checking, zero untyped fixtures)
- **Styling:** Tailwind CSS with CSS Variables & semantic tokens (Clean Ivory `#FAF9F5`, Obsidian, Cobalt Blue `#2563EB`, Vibrant Violet, and Coral Accents)
- **State Management:** Zustand with `persist` middleware:
  - `useAppStore`: Auth state, user profile, theme, search filters
  - `useCartStore`: Cart items, quantities, promo code engine, shipping threshold
  - `useWishlistStore`: Saved products with toggle actions
  - `useOrdersStore`: Placed orders, tracking statuses, fulfillment updates
  - `useCompareStore`: 4-slot comparison matrix
  - `useReviewsStore`: Customer reviews & ratings
  - `useRecentlyViewedStore`: Session-based browsing history
- **Data Layer:** TanStack Query v5 + DummyJSON commerce API with offline-first curated product dataset fallback
- **Icons:** Lucide React
- **Testing:** Vitest, React Testing Library, and Playwright

---

## 3. Supported Routes

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | Editorial hero, category navigation, 9 recommendation carousels, VIP drop newsletter |
| `/shop`, `/products` | `ShopPage` | Full catalog, category filters, price sorting, search, grid/list view |
| `/product/:id` | `ProductDetailPage` | Image gallery, pricing, stock status, reviews, compare toggle, related products |
| `/cart` | `CartPage` | Quantity adjustment, promo codes, free shipping tracker, checkout link |
| `/checkout` | `CheckoutPage` | Encrypted customer form, address input, demo payment, order creation |
| `/orders` | `OrdersPage` | Customer order history, fulfillment milestones, shipment tracking, reordering |
| `/orders/:id` | `OrdersPage` | Direct link to specific order tracking & itemized receipt |
| `/compare` | `ComparePage` | Side-by-side spec comparison table for up to 4 items |
| `/reviews` | `ReviewsPage` | Community reviews showcase, star distribution, verified submissions |
| `/admin` | `AdminDashboard` | Telemetry KPIs, order status governance, product inventory controls |
| `/dashboard` | `Dashboard` | Authenticated user hub with Profile, Orders, Addresses, Reviews, Recently Viewed |
| `/login` | `Login` | Email/password & Google OAuth authentication |
| `/register` | `Register` | New customer onboarding with validation |
| `/forgot-password` | `ForgotPassword` | Firebase self-service password reset |
| `/about` | `AboutPage` | Brand mission, design philosophy, and technical architecture |

---

## 4. Setup & Running the Application

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Commands

```bash
# 1. Install Dependencies
npm install

# 2. Run Development Server (Port 3000)
npm run dev

# 3. Type Checking & Linter
npm run lint

# 4. Run Vitest Unit & Component Tests
npm test

# 5. Production Build
npm run build
```

---

## 5. PRD Acceptance Checklist

- [x] **Visual Design:** Editorial ivory background, cobalt blue, vibrant violet, and coral accents.
- [x] **Firebase Auth:** Email/password login, Google sign-in, session recovery, password reset.
- [x] **Recommendations:** All 9 distinct strategies implemented and tested.
- [x] **Orders & Tracking:** End-to-end checkout to persistent orders store with delivery timeline.
- [x] **Customer Dashboard:** Profile, orders, addresses, reviews, recently viewed, and security tabs.
- [x] **Product Comparison:** Matrix table comparing specs, warranties, prices, and stock for up to 4 items.
- [x] **Customer Reviews:** Verified reviews feed, rating distribution, and submission form.
- [x] **Admin Governance:** Analytics KPIs, order status controls, and product inventory manager.
- [x] **Testing & Verification:** 100% test pass rate across Vitest suites.
