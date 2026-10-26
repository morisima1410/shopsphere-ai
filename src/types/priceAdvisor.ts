// ==============================================================================
// ShopSphere AI — Price Drop Advisor Domain Types
// ==============================================================================

export interface PriceSnapshot {
  timestamp: number; // Unix epoch in milliseconds
  price: number; // Genuine recorded active price
  reason?: string; // Optional context note (e.g. "Initial Track", "Simulated Check", "Flash Promo")
}

export interface TrackedProduct {
  productId: number;
  productTitle: string;
  productCategory: string;
  productImage: string;
  initialPrice: number; // Genuine price at tracking start
  currentPrice: number; // Latest recorded price
  previousPrice?: number; // Preceding recorded price (if at least 2 checks occurred)
  lowestPrice: number; // Minimum price recorded since tracking started
  highestPrice: number; // Maximum price recorded since tracking started
  trackedAt: number; // Epoch ms when tracking was activated
  lastCheckedAt: number; // Epoch ms of most recent price check
  priceSnapshots: PriceSnapshot[]; // Snapshots strictly recorded from tracking start
  userId?: string | number; // Authenticated user ID or guest identifier
}

export interface PriceDropAlert {
  id: string; // Unique notification identifier
  productId: number;
  productTitle: string;
  productImage: string;
  previousPrice: number; // Price before the drop
  newPrice: number; // Lower price after the drop
  savings: number; // previousPrice - newPrice
  percentageDecrease: number; // ((previousPrice - newPrice) / previousPrice) * 100
  timestamp: number; // Epoch ms when drop was detected
  read: boolean;
  userId?: string | number;
}

export interface PriceChangeEvaluation {
  isDrop: boolean;
  isIncrease: boolean;
  isUnchanged: boolean;
  savings: number; // Only > 0 when isDrop is true
  percentageDecrease: number; // Only > 0 when isDrop is true
  increaseAmount: number; // Only > 0 when isIncrease is true
  percentageIncrease: number; // Only > 0 when isIncrease is true
}
