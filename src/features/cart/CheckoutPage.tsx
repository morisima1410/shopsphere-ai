// ==============================================================================
// ShopSphere AI — Checkout Experience & Demonstration Order Flow
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAppStore } from '@/store/useAppStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link, useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_CONFIG } from '@/config/constants';

export const CheckoutPage: React.FC = () => {
  const { navigate } = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const clearCart = useCartStore((state) => state.clearCart);

  // Form Fields
  const [fullName, setFullName] = useState(
    currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : ''
  );
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');

  // Credit Card Demo Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState<{
    orderId: string;
    total: number;
    email: string;
  } | null>(null);

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const estimatedTax = subtotal * APP_CONFIG.taxRate;
  const grandTotal = subtotal + shippingFee + estimatedTax;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!address.trim()) errs.address = 'Street address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!postalCode.trim()) errs.postalCode = 'Postal code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      const newOrder = {
        id: generatedOrderId,
        userId: currentUser?.id ? Number(currentUser.id) || 1 : 1,
        date: new Date().toISOString(),
        status: 'processing' as const,
        total: grandTotal,
        currency: 'USD',
        items: items.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: calculateDiscountPrice(item.product.price, item.product.discountPercentage),
          quantity: item.quantity,
          thumbnail: item.product.thumbnail || item.product.images?.[0] || '',
        })),
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod:
          paymentMethod === 'card'
            ? `Credit Card (ending in ${cardNumber.slice(-4) || '4242'})`
            : paymentMethod === 'apple_pay'
            ? 'Apple / Google Pay'
            : 'Cash On Delivery',
      };

      useOrdersStore.getState().addOrder(newOrder);

      setOrderCompleteData({
        orderId: generatedOrderId,
        total: grandTotal,
        email: email.trim(),
      });
      clearCart();
      setIsProcessing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // If order was just placed, show confirmation screen
  if (orderCompleteData) {
    return (
      <div className="w-full bg-[#F9FAFB] text-[#1F2937] py-16 px-4">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              Demonstration Order Confirmed
            </span>
            <h1 className="text-3xl font-black text-[#1F2937]">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Order confirmation has been simulated for <strong className="text-[#1F2937]">{orderCompleteData.email}</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Order ID:</span>
              <span className="font-mono font-bold text-[#1F2937]">{orderCompleteData.orderId}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Amount Simulated:</span>
              <span className="font-black text-emerald-600">{formatCurrency(orderCompleteData.total)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Estimated Delivery:</span>
              <span className="font-bold text-[#1F2937]">3-4 Business Days</span>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/shop">
              <Button className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer">
                Return to Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Top Banner */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Cart</span>
          </Link>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
            Secure Checkout
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            Complete your order with encrypted customer details.
          </p>
        </div>
      </section>

      {/* Main 2-Column Checkout Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Transparent Demo Notice Banner */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Checkout Demonstration Mode: </span>
            This form simulates shipping calculation and order validation. No actual payment will be debited or goods dispatched.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Checkout Form */}
          <form onSubmit={handlePlaceOrder} noValidate className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">1</span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F2937]">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F2937]">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                  />
                  {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">2</span>
                <span>Delivery Address</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1F2937]">Street Address</label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 Evergreen Terrace"
                    className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                  />
                  {errors.address && <p className="text-[11px] text-rose-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1F2937]">City</label>
                    <Input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Springfield"
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                    {errors.city && <p className="text-[11px] text-rose-600">{errors.city}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1F2937]">Postal Code</label>
                    <Input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="97477"
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                    {errors.postalCode && <p className="text-[11px] text-rose-600">{errors.postalCode}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1F2937]">Country</label>
                    <Input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Demo */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">3</span>
                <span>Payment Method (Demo)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mb-1.5 text-emerald-600" />
                  <p className="text-xs font-bold">Credit Card</p>
                  <p className="text-[10px] text-gray-500">Instant demo charge</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mb-1.5 text-emerald-600" />
                  <p className="text-xs font-bold">Apple / Google Pay</p>
                  <p className="text-[10px] text-gray-500">Express one-tap demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Truck className="h-5 w-5 mb-1.5 text-emerald-600" />
                  <p className="text-xs font-bold">Cash on Delivery</p>
                  <p className="text-[10px] text-gray-500">Demo pay on receipt</p>
                </button>
              </div>

              {/* Fake card info */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1F2937]">Demo Card Number</label>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                    <Input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full h-13 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-600/30 gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Demonstration Order...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Place Demonstration Order ({formatCurrency(grandTotal)})</span>
                </>
              )}
            </Button>
          </form>

          {/* Right 5 Columns: Sticky Order Review */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
              <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3">
                Order Review ({items.length} items)
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1 scrollbar-none divide-y divide-gray-100">
                {items.map((item) => {
                  const product = item.product;
                  const unitPrice = calculateDiscountPrice(product.price, product.discountPercentage);
                  return (
                    <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail || product.images?.[0] || ''}
                          alt={product.title}
                          className="h-12 w-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-[#1F2937] line-clamp-1">{product.title}</p>
                          <p className="text-gray-400 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-black text-[#1F2937] shrink-0">
                        {formatCurrency(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1F2937]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#1F2937]">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-[#1F2937]">{formatCurrency(estimatedTax)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-[#1F2937]">
                  <span>Total Amount</span>
                  <span className="text-xl text-emerald-600 font-black">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>256-Bit Encrypted Data Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Carbon-neutral express priority fulfillment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
