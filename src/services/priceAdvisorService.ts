// ==============================================================================
// ShopSphere AI — Price Drop Advisor Service & Math Engine
// Strictly calculates savings, percentages, and evaluates price trends
// ==============================================================================

import type { PriceSnapshot, PriceDropAlert, PriceChangeEvaluation } from '@/types/priceAdvisor';

/**
 * Validates that a price value is a strictly positive, finite number.
 */
export function isValidPrice(price: unknown): price is number {
  return typeof price === 'number' && !Number.isNaN(price) && Number.isFinite(price) && price > 0;
}

/**
 * Calculates genuine monetary savings between previous recorded price and current price.
 * Savings = Previous Recorded Price − Current Price
 * Returns 0 if current price is equal to or greater than previous price, or if invalid.
 */
export function calculateSavings(previousPrice: number, currentPrice: number): number {
  if (!isValidPrice(previousPrice) || !isValidPrice(currentPrice)) {
    return 0;
  }
  if (currentPrice >= previousPrice) {
    return 0;
  }
  const rawSavings = previousPrice - currentPrice;
  return Math.round(rawSavings * 100) / 100;
}

/**
 * Calculates genuine percentage decrease:
 * Percentage Decrease = (Savings ÷ Previous Recorded Price) × 100
 * Returns 0 if no savings or if previous price is invalid.
 */
export function calculatePercentageDecrease(previousPrice: number, currentPrice: number): number {
  if (!isValidPrice(previousPrice) || !isValidPrice(currentPrice)) {
    return 0;
  }
  if (currentPrice >= previousPrice) {
    return 0;
  }
  const savings = previousPrice - currentPrice;
  const rawPercentage = (savings / previousPrice) * 100;
  return Math.round(rawPercentage * 100) / 100;
}

/**
 * Calculates genuine percentage increase when price has risen:
 * Percentage Increase = ((Current Price - Previous Price) ÷ Previous Price) × 100
 */
export function calculatePercentageIncrease(previousPrice: number, currentPrice: number): number {
  if (!isValidPrice(previousPrice) || !isValidPrice(currentPrice)) {
    return 0;
  }
  if (currentPrice <= previousPrice) {
    return 0;
  }
  const diff = currentPrice - previousPrice;
  const rawPercentage = (diff / previousPrice) * 100;
  return Math.round(rawPercentage * 100) / 100;
}

/**
 * Evaluates price change between previous recorded price and current price.
 * Accurately determines if price dropped, increased, or stayed unchanged.
 */
export function evaluatePriceChange(
  previousPrice: number | undefined | null,
  currentPrice: number
): PriceChangeEvaluation {
  if (previousPrice === undefined || previousPrice === null || !isValidPrice(previousPrice) || !isValidPrice(currentPrice)) {
    return {
      isDrop: false,
      isIncrease: false,
      isUnchanged: true,
      savings: 0,
      percentageDecrease: 0,
      increaseAmount: 0,
      percentageIncrease: 0,
    };
  }

  // Use fixed precision to avoid floating point anomalies (e.g. 0.0000000000001)
  const prevFixed = Math.round(previousPrice * 100);
  const currFixed = Math.round(currentPrice * 100);

  if (currFixed < prevFixed) {
    const savings = calculateSavings(previousPrice, currentPrice);
    const percentageDecrease = calculatePercentageDecrease(previousPrice, currentPrice);
    return {
      isDrop: true,
      isIncrease: false,
      isUnchanged: false,
      savings,
      percentageDecrease,
      increaseAmount: 0,
      percentageIncrease: 0,
    };
  }

  if (currFixed > prevFixed) {
    const increaseAmount = Math.round((currentPrice - previousPrice) * 100) / 100;
    const percentageIncrease = calculatePercentageIncrease(previousPrice, currentPrice);
    return {
      isDrop: false,
      isIncrease: true,
      isUnchanged: false,
      savings: 0,
      percentageDecrease: 0,
      increaseAmount,
      percentageIncrease,
    };
  }

  return {
    isDrop: false,
    isIncrease: false,
    isUnchanged: true,
    savings: 0,
    percentageDecrease: 0,
    increaseAmount: 0,
    percentageIncrease: 0,
  };
}

/**
 * Checks if sufficient historical data exists (at least 2 recorded snapshots).
 */
export function hasHistoricalData(snapshots: PriceSnapshot[] | undefined): boolean {
  return Boolean(snapshots && snapshots.length >= 2);
}

/**
 * Computes statistics strictly from recorded snapshots.
 * Returns null if no snapshots exist.
 */
export function getPriceStatistics(snapshots: PriceSnapshot[] = []) {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }

  const validPrices = snapshots.filter((s) => isValidPrice(s.price)).map((s) => s.price);
  if (validPrices.length === 0) return null;

  const lowest = Math.min(...validPrices);
  const highest = Math.max(...validPrices);
  const initial = validPrices[0];
  const current = validPrices[validPrices.length - 1];
  const previous = validPrices.length >= 2 ? validPrices[validPrices.length - 2] : undefined;

  return {
    lowest,
    highest,
    initial,
    current,
    previous,
    totalSnapshots: validPrices.length,
    hasHistory: validPrices.length >= 2,
  };
}

/**
 * Determines whether an alert is a duplicate of an existing recent alert for the same product and prices.
 */
export function isDuplicateAlert(
  existingAlerts: PriceDropAlert[],
  productId: number,
  newPrice: number,
  previousPrice: number,
  userId?: string | number
): boolean {
  const normUser = userId ? String(userId) : 'guest';
  const newFixed = Math.round(newPrice * 100);
  const prevFixed = Math.round(previousPrice * 100);

  return existingAlerts.some((alert) => {
    const alertUser = alert.userId ? String(alert.userId) : 'guest';
    if (alertUser !== normUser) return false;
    if (alert.productId !== productId) return false;

    const alertNewFixed = Math.round(alert.newPrice * 100);
    const alertPrevFixed = Math.round(alert.previousPrice * 100);

    return alertNewFixed === newFixed && alertPrevFixed === prevFixed;
  });
}
