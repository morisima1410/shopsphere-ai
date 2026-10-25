// ==============================================================================
// ShopSphere AI — Administrative Console & Inventory Governance (PROJ-SHOP-260918)
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Filter,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';
import analyticsData from '../../../fixtures/analytics.json';
import { useOrdersStore } from '@/store/useOrdersStore';
import { CURATED_PRODUCTS } from '@/services/productsData';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Order, Product } from '@/types';

export const AdminDashboard: React.FC = () => {
  const orders = useOrdersStore((state) => state.orders);
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');

  // Search & Filters for orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');

  // Inventory state
  const [inventoryList, setInventoryList] = useState<Product[]>(CURATED_PRODUCTS);
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);
  const [inventorySearch, setInventorySearch] = useState('');

  // Calculate live metrics
  const liveTotalRevenue =
    analyticsData.summary.totalRevenue +
    orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

  const liveOrdersCount = analyticsData.summary.totalOrders + orders.length;

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredInventory = inventoryList.filter((item) =>
    item.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const handleSaveStock = (productId: number) => {
    setInventoryList((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: Math.max(0, tempStockValue) } : item
      )
    );
    setEditingStockId(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Top Banner */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                  ShopSphere Governance
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  Live Operations
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
                Admin Console
              </h1>
              <p className="text-sm text-gray-500 font-normal">
                Real-time commerce telemetry, inventory controls, and order dispatch management.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F2937]'
                }`}
              >
                Overview & KPIs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F2937]'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1F2937]'
                }`}
              >
                Catalog Inventory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Tab 1: Overview & KPIs */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-[#1F2937]">
                    {formatCurrency(liveTotalRevenue)}
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+14.8% vs last cycle</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-[#1F2937]">
                    {liveOrdersCount.toLocaleString()}
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-600 font-bold">100% automated dispatch</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Avg Order Value
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-[#1F2937]">
                    {formatCurrency(analyticsData.summary.averageOrderValue)}
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">Premium curation uplift</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Active Shoppers
                  </CardTitle>
                  <Users className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-[#1F2937]">
                    {analyticsData.summary.activeUsers.toLocaleString()}
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-600 font-bold">Global session active</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </CardTitle>
                  <Activity className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-[#1F2937]">
                    {analyticsData.summary.conversionRate}%
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-600 font-bold">+0.6% AI assistant uplift</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown & Recent Activities 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Category Sales Breakdown (7 Cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                <h2 className="text-base font-bold text-[#1F2937] flex items-center justify-between border-b border-gray-100 pb-3">
                  <span>Category Revenue Contribution</span>
                  <span className="text-xs font-normal text-gray-400">Past 30 Days</span>
                </h2>

                <div className="space-y-4">
                  {analyticsData.topCategories.map((cat) => {
                    const maxSales = Math.max(...analyticsData.topCategories.map((c) => c.sales));
                    const percentage = Math.round((cat.sales / maxSales) * 100);
                    return (
                      <div key={cat.category} className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="capitalize text-[#1F2937]">{cat.category}</span>
                          <span className="font-mono text-emerald-600">
                            {formatCurrency(cat.sales)} ({cat.units} units)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Log (5 Cols) */}
              <div className="lg:col-span-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[#1F2937] border-b border-gray-100 pb-3">
                  System Activity Log
                </h2>

                <div className="space-y-3.5 text-xs">
                  {analyticsData.recentActivities.map((act, index) => (
                    <div key={index} className="flex items-start gap-3 p-2.5 rounded-2xl bg-gray-50">
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                        {act.type === 'order_placed' ? (
                          <ShoppingBag className="h-4 w-4" />
                        ) : act.type === 'assistant_query' ? (
                          <Activity className="h-4 w-4" />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1F2937]">
                          {act.type === 'order_placed'
                            ? `Order Placed: ${act.orderId} (${formatCurrency(act.amount || 0)})`
                            : act.type === 'assistant_query'
                            ? `Style Advisor: "${act.query}"`
                            : `New Shopper Registered: ${act.email}`}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Governance & Status Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Filter by Order ID or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-10 h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {(['all', 'processing', 'in_transit', 'delivered', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-xl">
              <table className="w-full text-left border-collapse text-xs min-w-[750px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Items</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono font-bold text-[#1F2937]">{order.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-[#1F2937]">
                          {order.shippingAddress?.fullName || 'Customer'}
                        </p>
                        <p className="text-[10px] text-gray-400">{order.shippingAddress?.city}</p>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">
                        {order.items.length} items
                      </td>
                      <td className="p-4 font-black text-[#1F2937]">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'in_transit'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : order.status === 'processing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="h-8 px-2 text-xs rounded-lg border border-gray-200 bg-white font-semibold cursor-pointer focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Catalog Inventory Governance */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Filter inventory by name or category..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="pl-10 h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="text-xs font-bold text-gray-500">
                Total Products: {inventoryList.length}
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-xl">
              <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Current Stock</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Stock Status</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnail || item.images?.[0] || ''}
                            alt={item.title}
                            className="h-10 w-10 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <p className="font-bold text-[#1F2937] line-clamp-1">{item.title}</p>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-gray-600 font-medium">
                        {item.category}
                      </td>
                      <td className="p-4 font-black text-[#1F2937]">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="p-4">
                        {editingStockId === item.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Number(e.target.value))}
                              className="w-20 h-8 text-xs rounded-lg border-gray-200 focus-visible:ring-emerald-500"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveStock(item.id)}
                              className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-[#1F2937]">
                            {item.stock} units
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            item.stock > 10
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.stock > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.stock > 10 ? 'Optimal' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingStockId(item.id);
                            setTempStockValue(item.stock);
                          }}
                          className="h-8 px-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          <span>Edit Stock</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
