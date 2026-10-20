// ==============================================================================
// ShopSphere AI — Utility Helpers (shadcn standard + formatters)
// ==============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateDiscountPrice(price: number, discountPercentage?: number): number {
  if (!discountPercentage || discountPercentage <= 0) return price;
  const discounted = price - (price * discountPercentage) / 100;
  return Math.round(discounted * 100) / 100;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
