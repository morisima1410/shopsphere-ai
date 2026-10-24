// ==============================================================================
// ShopSphere AI — Product Card Component (Editorial Architecture)
// ==============================================================================

import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Sparkles, Check, ArrowUpRight, Sliders } from 'lucide-react';
import type { Product } from '@/types';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useCompareStore } from '@/store/useCompareStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link } from '@/lib/router';

interface ProductCardProps {
  product: Product;
  matchScore?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, matchScore }) => {
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addItemToCart = useCartStore((state) => state.addItem);
  const compareProducts = useCompareStore((state) => state.products);
  const toggleCompare = useCompareStore((state) => state.toggleProduct);

  const isInWishlist = wishlistItems.some((p) => p.id === product.id);
  const isInCompare = compareProducts.some((p) => p.id === product.id);

  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
  const hasDiscount = Boolean(product.discountPercentage && product.discountPercentage > 0);

  const imageSrc = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
          <Link to={`/product/${product.id}`} className="block h-full w-full">
            <img
              src={imageSrc}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Compare Quick Action */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isInCompare
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/80 text-stone-600 hover:text-blue-600 hover:bg-white dark:bg-stone-900/80 dark:text-stone-300'
            }`}
            aria-label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
            title={isInCompare ? 'In Comparison Matrix' : 'Add to Compare'}
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>

          {/* Wishlist Heart Action */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isInWishlist
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-white/80 text-stone-600 hover:text-rose-500 hover:bg-white dark:bg-stone-900/80 dark:text-stone-300'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Match Score or Discount Badge */}
          {matchScore ? (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-rose-400" />
              <span>{matchScore}</span>
            </div>
          ) : hasDiscount ? (
            <div className="absolute bottom-3 left-3 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              -{Math.round(product.discountPercentage!)}% Off
            </div>
          ) : null}
        </div>

        {/* Product Metadata */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[11px] dark:text-blue-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 font-normal">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and Quick Add Actions */}
      <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {formatCurrency(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-stone-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/product/${product.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:border-blue-400 hover:text-blue-600 dark:border-stone-700 dark:text-stone-300 transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex h-8 items-center gap-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 active:scale-95'
            }`}
            aria-label="Add to cart"
          >
            {addedAnimation ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
