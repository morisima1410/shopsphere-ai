// ==============================================================================
// ShopSphere AI — Customer Orders & Fulfillment Tracking (PROJ-SHOP-260918)
// ==============================================================================

import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Search,
  RotateCcw,
  ShieldCheck,
  Calendar,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useCartStore } from '@/store/useCartStore';
import { CURATED_PRODUCTS } from '@/services/productsData';
import { formatCurrency } from '@/lib/utils';
import { Link, useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Order } from '@/types';

interface OrdersPageProps {
  initialOrderId?: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ initialOrderId }) => {
  const { navigate } = useRouter();
  const orders = useOrdersStore((state) => state.orders);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrderId || null);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const selectedOrder = orders.find((o) => o.id === (selectedOrderId || initialOrderId));

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const fullProduct = CURATED_PRODUCTS.find((p) => p.id === item.productId) || {
        id: item.productId,
        title: item.title,
        description: 'Previously ordered item from ShopSphere AI catalog',
        category: 'shopping',
        price: item.price,
        rating: 4.8,
        stock: 50,
        images: [item.thumbnail],
        thumbnail: item.thumbnail,
      };
      addItemToCart(fullProduct, item.quantity);
    });

    setReorderedId(order.id);
    setTimeout(() => {
      setReorderedId(null);
      navigate('/cart');
    }, 800);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
            <Truck className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>In Transit</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>Processing</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors pb-24">
      {/* Editorial Header */}
      <section className="border-b border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900/60 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Order Management & Logistics
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Orders & Fulfillment
              </h1>
              <p className="text-sm text-stone-500 font-normal">
                Track shipments, view itemized receipts, and manage repeat orders.
              </p>
            </div>

            <Link to="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl h-11 px-5 shadow-lg shadow-blue-600/20">
                <ShoppingBag className="h-4 w-4 mr-2" />
                <span>Shop New Arrivals</span>
              </Button>
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="text"
                placeholder="Search by Order ID or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl border-stone-200 bg-stone-50 focus:bg-white"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {(['all', 'processing', 'in_transit', 'delivered'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orders List & Tracking View */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center bg-white dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <Package className="h-12 w-12 mx-auto text-stone-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Orders Found</h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'No orders match your filter criteria. Try resetting your search query.'
                : 'You have not placed any orders yet. Explore our catalog to place your first order.'}
            </p>
            <Link to="/shop">
              <Button className="bg-blue-600 text-white font-bold rounded-xl mt-2">
                Browse ShopSphere AI Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders Feed (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrderId === order.id;
                return (
                  <div
                    key={order.id}
                    className={`rounded-3xl border bg-white p-6 transition-all duration-300 dark:bg-stone-900 shadow-xs ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-stone-200/90 hover:border-stone-300 dark:border-stone-800'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                            {order.id}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Placed on {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </span>
                        <p className="text-[10px] text-stone-400">{order.items.length} items</p>
                      </div>
                    </div>

                    {/* Order Item Thumbnails */}
                    <div className="py-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-12 w-12 rounded-xl object-cover bg-stone-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</p>
                              <p className="text-[11px] text-stone-400">Qty: {item.quantity} • {formatCurrency(item.price)} each</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Tracking & Receipt</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReorder(order)}
                        className="h-8 text-xs font-bold rounded-xl border-stone-300 gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>{reorderedId === order.id ? 'Added to Cart!' : 'Reorder Items'}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Order Details & Tracking Timeline Panel (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24">
              {selectedOrder ? (
                <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900 space-y-6">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Active Order Summary
                      </span>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        {selectedOrder.id}
                      </h2>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Fulfillment Progress</span>
                    </h3>

                    <div className="space-y-4 pl-2 border-l-2 border-blue-500/30 text-xs">
                      <div className="relative pl-4">
                        <span className="absolute -left-[13px] top-0.5 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950" />
                        <p className="font-bold text-slate-900 dark:text-white">Order Received & Encrypted</p>
                        <p className="text-[10px] text-stone-400">{new Date(selectedOrder.date).toLocaleString()}</p>
                      </div>

                      <div className="relative pl-4">
                        <span className={`absolute -left-[13px] top-0.5 h-3 w-3 rounded-full ring-4 ${
                          selectedOrder.status === 'processing' || selectedOrder.status === 'in_transit' || selectedOrder.status === 'delivered'
                            ? 'bg-blue-600 ring-blue-100 dark:ring-blue-950'
                            : 'bg-stone-300 ring-stone-100 dark:ring-stone-800'
                        }`} />
                        <p className="font-bold text-slate-900 dark:text-white">Fulfillment Hub Assembly</p>
                        <p className="text-[10px] text-stone-400">Automated quality scan & verification</p>
                      </div>

                      <div className="relative pl-4">
                        <span className={`absolute -left-[13px] top-0.5 h-3 w-3 rounded-full ring-4 ${
                          selectedOrder.status === 'in_transit' || selectedOrder.status === 'delivered'
                            ? 'bg-blue-600 ring-blue-100 dark:ring-blue-950'
                            : 'bg-stone-300 ring-stone-100 dark:ring-stone-800'
                        }`} />
                        <p className="font-bold text-slate-900 dark:text-white">Carrier Priority In Transit</p>
                        <p className="text-[10px] text-stone-400">
                          Tracking: <span className="font-mono text-blue-600">TRK-{(selectedOrder.id.replace(/\D/g, '') || '9841283')}</span>
                        </p>
                      </div>

                      <div className="relative pl-4">
                        <span className={`absolute -left-[13px] top-0.5 h-3 w-3 rounded-full ring-4 ${
                          selectedOrder.status === 'delivered'
                            ? 'bg-emerald-600 ring-emerald-100 dark:ring-emerald-950'
                            : 'bg-stone-300 ring-stone-100 dark:ring-stone-800'
                        }`} />
                        <p className="font-bold text-slate-900 dark:text-white">Delivered & Verified</p>
                        <p className="text-[10px] text-stone-400">
                          {selectedOrder.status === 'delivered' ? 'Signed at delivery location' : 'Estimated 3-4 business days'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address & Payment Method */}
                  <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-800/60 space-y-3 text-xs">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-rose-500" />
                        <span>Shipping Destination</span>
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.shippingAddress?.fullName || 'Alex Mercer'}</p>
                      <p className="text-stone-500 text-[11px]">
                        {selectedOrder.shippingAddress?.address || '742 Evergreen Terrace'},{' '}
                        {selectedOrder.shippingAddress?.city || 'Springfield'}, {selectedOrder.shippingAddress?.postalCode || '97477'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80 dark:border-stone-700/60 space-y-1">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="h-3 w-3 text-blue-500" />
                        <span>Payment Method</span>
                      </p>
                      <p className="text-stone-700 dark:text-stone-300 font-medium">{selectedOrder.paymentMethod || 'Credit Card'}</p>
                    </div>
                  </div>

                  {/* Itemized Total */}
                  <div className="space-y-2 text-xs pt-2">
                    <div className="flex justify-between text-stone-500">
                      <span>Items Subtotal:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Express Shipping:</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                      <span>Grand Total:</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-400">
                  Select an order on the left to inspect real-time tracking and delivery logs.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
