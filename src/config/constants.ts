// ==============================================================================
// ShopSphere AI — Configuration Constants (PROJ-SHOP-260918)
// ==============================================================================

export const APP_CONFIG = {
  name: 'ShopSphere AI',
  tagline: 'Personalized Shopping, Powered by Intelligence',
  projectId: 'PROJ-SHOP-260918',
  platform: 'Internmo',
  internshipRole: 'Frontend Developer Intern',
  version: '1.0.0',
  defaultCurrency: 'USD',
  freeShippingThreshold: 50.0,
  flatShippingRate: 4.99,
  taxRate: 0.08,
  defaultPageLimit: 12,
} as const;

export const API_ENDPOINTS = {
  products: '/products',
  categories: '/products/categories',
  categoryList: '/products/category-list',
  search: '/products/search',
  users: '/users',
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
} as const;

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/products?category=all' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Cart', href: '/cart' },
  { label: 'Admin', href: '/admin' },
] as const;

export const FEATURE_FLAGS = {
  enableShoppingAssistant: true,
  enablePersonalizedRecommendations: true,
  enableAdminDashboard: true,
  enableOfflineMockFallback: true,
} as const;
