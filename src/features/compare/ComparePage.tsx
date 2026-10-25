// ==============================================================================
// ShopSphere AI — Side-by-Side Product Comparison Matrix (PROJ-SHOP-260918)
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React from 'react';
import {
  Sliders,
  Trash2,
  Plus,
  Star,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { useCartStore } from '@/store/useCartStore';
import { CURATED_PRODUCTS } from '@/services/productsData';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';

export const ComparePage: React.FC = () => {
  const products = useCompareStore((state) => state.products);
  const removeProduct = useCompareStore((state) => state.removeProduct);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const addProduct = useCompareStore((state) => state.addProduct);
  const addItemToCart = useCartStore((state) => state.addItem);

  const [addedIds, setAddedIds] = React.useState<number[]>([]);

  const handleAddToCart = (product: Product) => {
    addItemToCart(product, 1);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const handleAddSampleProducts = () => {
    // Add first 3 curated products for instant side-by-side comparison
    CURATED_PRODUCTS.slice(0, 3).forEach((p) => addProduct(p));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Decision Matrix & Specifications
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
                Product Comparison
              </h1>
              <p className="text-sm text-gray-500 font-normal">
                Evaluate features, dimensions, warranties, and pricing side-by-side.
              </p>
            </div>

            {products.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompare}
                className="text-xs font-bold rounded-xl border-gray-200 text-gray-700 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                <span>Clear Comparison</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Sliders className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1F2937]">No Products in Comparison</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Select up to 4 items while browsing the catalog to inspect their specifications, materials, and ratings side-by-side.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleAddSampleProducts}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 px-5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Load Sample Comparison Matrix</span>
              </Button>
              <Link to="/shop">
                <Button variant="outline" className="font-bold rounded-xl h-11 px-5 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                  Browse Full Catalog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold">
                Comparing {products.length} of 4 items
              </span>
              {products.length < 4 && (
                <Link to="/shop" className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add another product</span>
                </Link>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-xl">
              <table className="w-full text-left border-collapse min-w-[700px]">
                {/* Product Headers */}
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider w-44">
                      Specification
                    </th>
                    {products.map((product) => {
                      const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
                      const isAdded = addedIds.includes(product.id);
                      return (
                        <th key={product.id} className="p-5 align-top min-w-[220px]">
                          <div className="space-y-3">
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={product.thumbnail || product.images?.[0] || ''}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeProduct(product.id)}
                                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-rose-600 hover:bg-white shadow-sm cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                {product.category}
                              </span>
                              <Link to={`/product/${product.id}`} className="block hover:text-emerald-600 transition-colors">
                                <h3 className="font-bold text-[#1F2937] text-sm line-clamp-2">
                                  {product.title}
                                </h3>
                              </Link>
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-[#1F2937]">
                                {formatCurrency(discountedPrice)}
                              </span>
                              {product.discountPercentage && product.discountPercentage > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                            </div>

                            <Button
                              onClick={() => handleAddToCart(product)}
                              size="sm"
                              className={`w-full text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                isAdded ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                                  <span>Add to Cart</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Attribute Rows */}
                <tbody className="divide-y divide-gray-100 text-xs">
                  {/* Rating */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Rating</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className="flex items-center gap-1.5 font-bold text-[#1F2937]">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{p.rating ? Number(p.rating).toFixed(1) : '4.8'}</span>
                          <span className="text-gray-400 font-normal text-[11px]">(120+ verified reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Stock Status</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <Check className="h-3.5 w-3.5" />
                          <span>{p.stock > 0 ? `In Stock (${p.stock} units)` : 'Pre-Order'}</span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Brand</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 font-medium text-gray-800">
                        {p.brand || 'ShopSphere Studio'}
                      </td>
                    ))}
                  </tr>

                  {/* Warranty */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Warranty</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 text-gray-600">
                        {p.warrantyInformation || '2-Year Official Manufacturer Warranty'}
                      </td>
                    ))}
                  </tr>

                  {/* Shipping */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Shipping</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 text-gray-600">
                        {p.shippingInformation || 'Carbon-neutral express priority delivery (2-3 business days)'}
                      </td>
                    ))}
                  </tr>

                  {/* Return Policy */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Return Policy</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 text-gray-600">
                        {p.returnPolicy || '30-Day risk-free return guarantee'}
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="p-4 font-bold text-gray-500 bg-gray-50/50">Overview</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 text-gray-600 leading-relaxed font-normal">
                        {p.description}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
