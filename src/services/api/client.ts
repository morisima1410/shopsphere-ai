// ==============================================================================
// ShopSphere AI — Base HTTP API Client (DummyJSON / Local Mock Adapter)
// ==============================================================================

import { ENV } from '@/config/env';
import type { ApiError } from '@/types';

export class HttpClientError extends Error {
  public status: number;
  public statusText: string;
  public data?: unknown;

  constructor(message: string, status: number, statusText: string, data?: unknown) {
    super(message);
    this.name = 'HttpClientError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = ENV.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl.replace(/\/$/, '');
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeoutMs = 15000, headers, ...restOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...restOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        const errorMessage =
          typeof errorData === 'object' && errorData !== null && 'message' in errorData
            ? (errorData as ApiError).message
            : `API request failed with HTTP ${response.status}: ${response.statusText}`;

        throw new HttpClientError(errorMessage, response.status, response.statusText, errorData);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof HttpClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpClientError('Request timed out after ' + timeoutMs + 'ms', 408, 'Request Timeout');
      }

      const message = error instanceof Error ? error.message : 'Unknown network error';
      throw new HttpClientError(message, 0, 'Network Error');
    }
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Singleton Default API Instance
export const apiClient = new ApiClient();
