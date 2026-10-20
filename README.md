# ShopSphere AI — Personalized Shopping, Powered by Intelligence

**Project ID:** PROJ-SHOP-260918  
**Internship Platform:** Internmo  
**Role:** Frontend Developer Intern  
**Step:** 1 — Project Initialization & Architecture Foundation

---

## 1. Project Overview

**ShopSphere AI** is an enterprise-grade ecommerce web application engineered with Next.js, React, TypeScript, and Tailwind CSS. The platform leverages DummyJSON as its configurable commerce backend, Zustand for client-side state synchronization, TanStack Query for data caching and fetching, and shadcn/ui for accessible, accessible design primitives.

---

## 2. Technology Stack

- **Framework:** Next.js (App Router) / React 19 SPA
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS with CSS Variables & semantic tokens
- **Design Primitives:** shadcn/ui standards (Button, Card, Badge, Input)
- **State Management:** Zustand (Micro-stores for Cart, Wishlist, User App State)
- **Server Cache & Async State:** TanStack Query v5
- **Icons:** Lucide React
- **Commerce API:** DummyJSON API (`https://dummyjson.com`)
- **Testing:**
  - **Unit Testing:** Vitest
  - **Component Testing:** React Testing Library (`@testing-library/react`)
  - **End-to-End Testing:** Playwright (`@playwright/test`)
- **Version Control:** Git & GitHub

---

## 3. Directory Structure

```text
shopsphere-ai/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── providers.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── wishlist/
│   │   ├── login/
│   │   ├── register/
│   │   ├── account/
│   │   ├── orders/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── common/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── wishlist/
│   │   ├── orders/
│   │   ├── recommendations/
│   │   ├── shopping-assistant/
│   │   └── admin/
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── products.ts
│   │   └── mock/
│   ├── store/
│   │   ├── useAppStore.ts
│   │   ├── useCartStore.ts
│   │   └── useWishlistStore.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   └── config/
│       ├── constants.ts
│       └── env.ts
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── api-client.test.ts
│   │   └── store.test.ts
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Navbar.test.tsx
│   └── e2e/
│       └── homepage.spec.ts
├── fixtures/
│   ├── orders.json
│   ├── reviews.json
│   ├── recommendations.json
│   ├── user-preferences.json
│   └── analytics.json
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vitest.config.ts
├── README.md
└── postcss.config.mjs
```

---

## 4. Setup & Running the Application

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Git >= 2.x

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

# 5. Run Playwright E2E Tests
npx playwright install --with-deps
npm run test:e2e

# 6. Production Build
npm run build
```

---

## 5. Verification Checklist

- [x] Tech stack: React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Vitest, RTL, Playwright
- [x] Clean feature-based directory structure with all required folders
- [x] Configurable DummyJSON API Client with typed models and error handling
- [x] Global Zustand stores for Cart, Wishlist, and App State
- [x] Vitest unit test suite configured and passing
- [x] React Testing Library component tests configured and passing
- [x] Playwright E2E configuration and specs created
- [x] Mock data fixtures (orders, reviews, recommendations, user preferences, analytics)
- [x] Brand starter homepage displaying ShopSphere AI metadata and architecture readiness
- [x] Ready for Step 2: Product Discovery, Search, and Filtering
