// ==============================================================================
// ShopSphere AI — Products API Service Layer
// ==============================================================================

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/constants';
import type { Product, ProductsResponse, CategoryItem } from '@/types';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const productsApi = {
  /**
   * Health check to verify DummyJSON endpoint connectivity
   */
  async checkHealth(): Promise<{ status: 'healthy' | 'unreachable'; latencyMs: number }> {
    const start = performance.now();
    try {
      await apiClient.get<{ status: string }>('/test');
      const latencyMs = Math.round(performance.now() - start);
      return { status: 'healthy', latencyMs };
    } catch {
      // Fallback: ping limit 1 product
      try {
        await apiClient.get<ProductsResponse>(API_ENDPOINTS.products, { limit: 1 });
        const latencyMs = Math.round(performance.now() - start);
        return { status: 'healthy', latencyMs };
      } catch {
        return { status: 'unreachable', latencyMs: -1 };
      }
    }
  },

  /**
   * Fetch paginated list of products
   */
  async getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>(API_ENDPOINTS.products, {
      limit: params.limit ?? 12,
      skip: params.skip ?? 0,
      select: params.select,
      sortBy: params.sortBy,
      order: params.order,
    });
  },

  /**
   * Fetch single product by numeric ID
   */
  async getProductById(id: number): Promise<Product> {
    return apiClient.get<Product>(`${API_ENDPOINTS.products}/${id}`);
  },

  /**
   * Fetch categories list
   */
  async getCategories(): Promise<CategoryItem[]> {
    return apiClient.get<CategoryItem[]>(API_ENDPOINTS.categories);
  },
};
