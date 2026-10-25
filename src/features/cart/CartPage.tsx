// ==============================================================================
// ShopSphere AI — Shopping Cart Feature Component
// Supports Save-For-Later, Cart-Based Recommendations, Stock Clamping & Promo Codes
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Check,
  Tag,
  Plus,
  Minus,
  Bookmark,
  RotateCcw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link, useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_CONFIG } from '@/config/constants';
import { getRecommendationsByStrategy } from '@/features/recommendations/recommendationEngine';
import type { Product } from '@/types';

export const CartPage: React.FC = () => {
  const { navigate } = useRouter();
  const items = useCartStore((state) => state.items);
  const savedForLater = useCartStore((state) => state.savedForLater);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const saveForLater = useCartStore((state) => state.saveForLater);
  const moveToCartFromSaved = useCartStore((state) => state.moveToCartFromSaved);
  const removeSavedItem = useCartStore((state) => state.removeSavedItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const addItem = useCartStore((state) => state.addItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percent' | 'shipping'; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [stockNotice, setStockNotice] = useState<string | null>(null);

  const subtotal = getSubtotal();
  let baseShipping = getShippingFee();
  if (appliedPromo?.type === 'shipping') {
    baseShipping = 0;
  }

  const promoDiscount =
    appliedPromo?.type === 'percent' ? subtotal * (appliedPromo.discount / 100) : 0;
  const estimatedTax = Math.max(0, (subtotal - promoDiscount) * APP_CONFIG.taxRate);
  const grandTotal = Math.max(0, subtotal - promoDiscount + baseShipping + estimatedTax);

  const freeShippingThreshold = APP_CONFIG.freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Cart-based recommended add-ons (Strategy 9 / 6 from PRD)
  const cartIds = items.map((i) => i.product.id);
  const recommendedAddOns = getRecommendationsByStrategy('cart_upsell', { cartProductIds: cartIds })
    .slice(0, 3)
    .map((r) => r.product);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'SPHERE20' || code === 'VIP20') {
      setAppliedPromo({ code, type: 'percent', discount: 20 });
      setPromoInput('');
    } else if (code === 'SAVE10') {
      setAppliedPromo({ code, type: 'percent', discount: 10 });
      setPromoInput('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code, type: 'shipping', discount: 100 });
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Valid test codes: SPHERE20, SAVE10, FREESHIP.');
    }
  };

  const handleQuantityChange = (product: Product, desiredQty: number) => {
    const maxStock = product.stock ?? 99;
    if (desiredQty > maxStock) {
      setStockNotice(`Limited stock: Only ${maxStock} units of "${product.title}" are available.`);
      setTimeout(() => setStockNotice(null), 3000);
    }
    updateQuantity(product.id, desiredQty);
  };

  return (
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Top Banner */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
            <span>Order Bag Overview</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
                Your Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500 font-normal">
                {items.length === 0
                  ? 'Your active cart is currently empty.'
                  : `You have ${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'} in your cart.`}
              </p>
            </div>

            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
              >
                Clear Cart
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Cart Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {stockNotice && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{stockNotice}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="space-y-8">
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center space-y-5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#1F2937]">Your Cart Is Empty</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Explore our curated collections of precision acoustics, horology, and modern apparel.
                </p>
              </div>
              <Link to="/shop">
                <Button className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 cursor-pointer shadow-md">
                  <span>Start Shopping</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Saved For Later Section when active cart is empty */}
            {savedForLater.length > 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-[#1F2937] flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-emerald-600" />
                    <span>Saved For Later ({savedForLater.length} items)</span>
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {savedForLater.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.thumbnail || item.product.images?.[0] || ''}
                          alt={item.product.title}
                          className="h-12 w-12 rounded-xl object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-[#1F2937] text-xs">{item.product.title}</p>
                          <p className="text-[11px] text-gray-500">{formatCurrency(item.product.price)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => moveToCartFromSaved(item.product.id)}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                        >
                          Move to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSavedItem(item.product.id)}
                          className="h-8 text-xs text-rose-600 cursor-pointer"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Items List & Save For Later */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Indicator */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-950">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    {amountToFreeShipping > 0
                      ? `Add ${formatCurrency(amountToFreeShipping)} more for complimentary express delivery`
                      : 'You have unlocked complimentary express delivery!'}
                  </span>
                  <span className="text-emerald-700 font-mono">{freeShippingPercentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingPercentage}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="divide-y divide-gray-100 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                {items.map((item) => {
                  const product = item.product;
                  const unitPrice = calculateDiscountPrice(product.price, product.discountPercentage);
                  const linePrice = unitPrice * item.quantity;
                  const imageSrc = product.thumbnail || product.images?.[0] || '';
                  const maxStock = product.stock ?? 99;

                  return (
                    <div key={product.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-4">
                        <Link to={`/product/${product.id}`} className="shrink-0">
                          <img
                            src={imageSrc}
                            alt={product.title}
                            className="h-20 w-20 rounded-2xl object-cover bg-gray-100 border border-gray-200"
                          />
                        </Link>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            {product.category}
                          </span>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-bold text-[#1F2937] text-sm sm:text-base hover:text-emerald-600 transition-colors line-clamp-1">
                              {product.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-500">
                            Unit: {formatCurrency(unitPrice)} • In Stock: {maxStock}
                          </p>
                        </div>
                      </div>

                      {/* Right: Quantity Controls & Line Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center text-gray-600 hover:text-[#1F2937] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="h-8 w-8 flex items-center justify-center text-xs font-bold text-[#1F2937]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className="h-8 w-8 flex items-center justify-center text-gray-600 hover:text-[#1F2937] disabled:opacity-30 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price & Actions */}
                        <div className="text-right space-y-1">
                          <span className="text-base font-black text-[#1F2937] block">
                            {formatCurrency(linePrice)}
                          </span>
                          <div className="flex items-center gap-3 text-[11px] justify-end">
                            <button
                              type="button"
                              onClick={() => saveForLater(product.id)}
                              className="font-medium text-gray-500 hover:text-emerald-600 cursor-pointer flex items-center gap-1"
                            >
                              <Bookmark className="h-3 w-3" />
                              <span>Save for Later</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              className="font-medium text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Cart Add-Ons (PRD Section 6.3 - Cart Based Upsell) */}
              {recommendedAddOns.length > 0 && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-sm font-black text-[#1F2937] flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>Complete Your Collection (Recommended Add-Ons)</span>
                    </h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Cart Strategy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedAddOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50/70 p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={addon.thumbnail || addon.images?.[0] || ''}
                            alt={addon.title}
                            className="h-10 w-10 rounded-xl object-cover bg-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-[#1F2937] text-xs truncate">
                              {addon.title}
                            </p>
                            <p className="text-[11px] font-black text-emerald-600">
                              {formatCurrency(calculateDiscountPrice(addon.price, addon.discountPercentage))}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addItem(addon, 1)}
                          className="w-full h-8 text-xs font-bold rounded-xl border-gray-200 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                        >
                          + Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved For Later Section (PRD Section 5.5) */}
              {savedForLater.length > 0 && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-sm font-black text-[#1F2937] flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-emerald-600" />
                      <span>Saved For Later ({savedForLater.length} items)</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {savedForLater.map((item) => (
                      <div
                        key={item.product.id}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.thumbnail || item.product.images?.[0] || ''}
                            alt={item.product.title}
                            className="h-12 w-12 rounded-xl object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-bold text-[#1F2937] text-xs">{item.product.title}</p>
                            <p className="text-[11px] text-gray-500">{formatCurrency(item.product.price)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => moveToCartFromSaved(item.product.id)}
                            className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                          >
                            Move to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSavedItem(item.product.id)}
                            className="h-8 text-xs text-rose-600 cursor-pointer"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Columns: Order Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
                <h2 className="text-lg font-black text-[#1F2937] border-b border-gray-100 pb-3">
                  Order Summary
                </h2>

                {/* Subtotals Breakdown */}
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1F2937]">{formatCurrency(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex items-center justify-between text-emerald-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Promo Code ({appliedPromo.code})</span>
                      </span>
                      <span>
                        {appliedPromo.type === 'percent'
                          ? `-${formatCurrency(promoDiscount)}`
                          : 'FREE SHIPPING'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-[#1F2937]">
                      {baseShipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(baseShipping)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-bold text-[#1F2937]">{formatCurrency(estimatedTax)}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-base font-black text-[#1F2937]">
                    <span>Grand Total</span>
                    <span className="text-xl text-emerald-600 font-black">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-gray-100">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                      <span className="font-bold flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" />
                        Code &quot;{appliedPromo.code}&quot; Active
                      </span>
                      <button
                        onClick={() => setAppliedPromo(null)}
                        className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="space-y-1.5">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Promo code (SPHERE20, SAVE10, FREESHIP)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="h-9 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                        />
                        <Button type="submit" size="sm" variant="outline" className="h-9 text-xs font-bold px-3 rounded-xl border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 cursor-pointer">
                          Apply
                        </Button>
                      </div>
                      {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
                    </form>
                  )}
                </div>

                {/* Checkout CTA */}
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/25 gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {/* Trust Guarantees */}
                <div className="space-y-2 pt-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>256-Bit Encrypted Data Safety</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Free global express over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
