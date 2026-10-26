// ==============================================================================
// ShopSphere AI — Core Domain & API Types (PROJ-SHOP-260918)
// ==============================================================================

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  grandTotal: number;
}

export interface User {
  id: number | string;
  uid?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  role: 'customer' | 'admin';
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface Order {
  id: string;
  userId: number;
  date: string;
  status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface RecommendationItem {
  id: string;
  category: string;
  reason: string;
  productIds: number[];
  relevanceScore: number;
}

export interface UserPreferences {
  userId: number;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  favoriteCategories: string[];
  pricePreference: 'budget' | 'balanced' | 'premium';
  enablePersonalizedRecommendations: boolean;
  recentlyViewedProductIds: number[];
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedProductIds?: number[];
  quickActions?: string[];
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeUsers: number;
  conversionRate: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export * from './priceAdvisor';
