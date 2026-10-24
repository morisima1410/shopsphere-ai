// ==============================================================================
// ShopSphere AI — Checkout Experience & Demonstration Order Flow
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
      <div className="w-full bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors py-16 px-4">
        <div className="mx-auto max-w-xl rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-12 text-center shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Demonstration Order Confirmed
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Order confirmation has been simulated for <strong className="text-slate-800 dark:text-slate-200">{orderCompleteData.email}</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/60 space-y-2 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Order ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCompleteData.orderId}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Amount Simulated:</span>
              <span className="font-black text-blue-600 dark:text-blue-400">{formatCurrency(orderCompleteData.total)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Estimated Delivery:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">3-4 Business Days</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-3.5 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200 text-left">
            <p className="font-bold mb-0.5">Demonstration Notice:</p>
            <p className="text-[11px] leading-relaxed">
              No financial charges were processed. To accept real credit cards, integrate Stripe, PayPal, or your production payment gateway.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to={`/orders/${orderCompleteData.orderId}`} className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl">
                Track Order
              </Button>
            </Link>
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full font-bold h-11 rounded-xl border-stone-300">
                All Orders
              </Button>
            </Link>
            <Link to="/shop" className="flex-1">
              <Button variant="ghost" className="w-full font-bold h-11 rounded-xl">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no order placed
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart Is Empty</h2>
        <p className="text-sm text-stone-500">Add products to your cart before proceeding to checkout.</p>
        <Link to="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors pb-24">
      {/* Top Banner */}
      <section className="border-b border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900/60 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Cart</span>
          </Link>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Secure Checkout
          </h1>
          <p className="text-sm text-stone-500 font-normal">
            Complete your order with encrypted customer details.
          </p>
        </div>
      </section>

      {/* Main 2-Column Checkout Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Transparent Demo Notice Banner */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 flex items-start gap-3 shadow-xs">
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
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">1</span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">2</span>
                <span>Delivery Address</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Street Address</label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 Evergreen Terrace"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.address && <p className="text-[11px] text-rose-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">City</label>
                    <Input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Springfield"
                      className="h-10 text-xs rounded-xl"
                    />
                    {errors.city && <p className="text-[11px] text-rose-600">{errors.city}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Postal Code</label>
                    <Input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="97477"
                      className="h-10 text-xs rounded-xl"
                    />
                    {errors.postalCode && <p className="text-[11px] text-rose-600">{errors.postalCode}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Country</label>
                    <Input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Demo */}
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">3</span>
                <span>Payment Method (Demo)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ring-2 ring-blue-600/20'
                      : 'border-stone-200 hover:border-stone-300 dark:border-stone-800'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mb-1.5 text-blue-600" />
                  <p className="text-xs font-bold">Credit Card</p>
                  <p className="text-[10px] text-stone-500">Instant demo charge</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ring-2 ring-blue-600/20'
                      : 'border-stone-200 hover:border-stone-300 dark:border-stone-800'
                  }`}
                >
                  <Lock className="h-5 w-5 mb-1.5 text-violet-600" />
                  <p className="text-xs font-bold">Apple / Google Pay</p>
                  <p className="text-[10px] text-stone-500">1-Touch demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ring-2 ring-blue-600/20'
                      : 'border-stone-200 hover:border-stone-300 dark:border-stone-800'
                  }`}
                >
                  <Truck className="h-5 w-5 mb-1.5 text-emerald-600" />
                  <p className="text-xs font-bold">Cash On Delivery</p>
                  <p className="text-[10px] text-stone-500">Pay on arrival</p>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Card Number (Demo)</label>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Exp / CVC</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="h-10 text-xs rounded-xl"
                      />
                      <Input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="h-10 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full h-13 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/30 gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
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
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900 space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
                Order Review ({items.length} items)
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1 scrollbar-none divide-y divide-stone-100 dark:divide-stone-800">
                {items.map((item) => {
                  const product = item.product;
                  const unitPrice = calculateDiscountPrice(product.price, product.discountPercentage);
                  return (
                    <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail || product.images?.[0] || ''}
                          alt={product.title}
                          className="h-12 w-12 rounded-xl object-cover bg-stone-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.title}</p>
                          <p className="text-stone-400 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white shrink-0">
                        {formatCurrency(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(estimatedTax)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-xl text-blue-600 dark:text-blue-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-800/60 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>256-Bit Encrypted Data Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
