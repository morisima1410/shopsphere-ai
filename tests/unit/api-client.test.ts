// ==============================================================================
// ShopSphere AI — Unit Tests: API Client & Formatting Helpers
// ==============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, HttpClientError } from '@/services/api/client';
import { calculateDiscountPrice, formatCurrency, truncateText } from '@/lib/utils';

describe('ApiClient & Utils Unit Test Suite', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('https://test-api.dummyjson.com');
    vi.restoreAllMocks();
  });

  it('correctly configures and retrieves base URL', () => {
    expect(client.getBaseUrl()).toBe('https://test-api.dummyjson.com');
    client.setBaseUrl('https://custom.api.com/');
    expect(client.getBaseUrl()).toBe('https://custom.api.com');
  });

  it('successfully fetches and parses JSON response', async () => {
    const mockData = { id: 1, title: 'Sample Product', price: 29.99 };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await client.get<typeof mockData>('/products/1');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-api.dummyjson.com/products/1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('throws HttpClientError with status and message when response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Product not found' }),
    });

    await expect(client.get('/products/999999')).rejects.toThrow('Product not found');
  });

  it('calculates discounted prices accurately', () => {
    expect(calculateDiscountPrice(100, 20)).toBe(80);
    expect(calculateDiscountPrice(19.99, 10)).toBe(17.99);
    expect(calculateDiscountPrice(50, 0)).toBe(50);
  });

  it('formats currency correctly', () => {
    const formatted = formatCurrency(99.99, 'USD');
    expect(formatted).toContain('99.99');
  });

  it('truncates long strings with ellipsis', () => {
    expect(truncateText('Short text', 20)).toBe('Short text');
    expect(truncateText('This is a much longer description for a product', 15)).toBe('This is a much...');
  });
});
