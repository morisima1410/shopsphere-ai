// ==============================================================================
// ShopSphere AI — Product Detail Page Component
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag,
  Heart,
  Sparkles,
  Check,
  Tag,
  Share2,
} from 'lucide-react';
import type { Product } from '@/types';
import { CURATED_PRODUCTS, getProductById } from '@/services/productsData';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import { useCompareStore } from '@/store/useCompareStore';
import { useReviewsStore } from '@/store/useReviewsStore';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link, useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  productId: number;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { navigate } = useRouter();
  const [product, setProduct] = useState<Product | null>(() => getProductById(productId) || null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentUser = useAppStore((state) => state.currentUser);
  const addItemToCart = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useMemo(() => wishlistItems.some((p) => p.id === productId), [wishlistItems, productId]);

  const compareProducts = useCompareStore((state) => state.products);
  const toggleCompare = useCompareStore((state) => state.toggleProduct);
  const isInCompare = useMemo(() => compareProducts.some((p) => p.id === productId), [compareProducts, productId]);

  const allReviews = useReviewsStore((state) => state.reviews);
  const addReview = useReviewsStore((state) => state.addReview);
  const productReviews = useMemo(
    () => allReviews.filter((r) => r.productId === productId),
    [allReviews, productId]
  );

  // New review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewAuthor, setReviewAuthor] = useState<string>(currentUser?.firstName || '');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const found = getProductById(productId) || CURATED_PRODUCTS[0];
    setProduct(found);
    if (found) {
      setSelectedImage(found.thumbnail || found.images?.[0] || '');
      setQuantity(1);
      // Track recently viewed
      useRecentlyViewedStore.getState().addProductView(found.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      id: Date.now(),
      productId,
      reviewerName: reviewAuthor.trim() || 'Verified Customer',
      reviewerEmail: currentUser?.email || 'customer@shopsphere.ai',
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString(),
    });

    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-sm text-stone-500">The product you are requesting is currently unavailable.</p>
        <Link to="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const discountedPrice = calculateDiscountPrice(product.price, product.discountPercentage);
  const hasDiscount = Boolean(product.discountPercentage && product.discountPercentage > 0);
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = () => {
    addItemToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addItemToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const relatedProducts = CURATED_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="w-full bg-[#FAF9F5] text-slate-900 dark:bg-[#080B11] dark:text-slate-50 transition-colors pb-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-in fade-in">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4 dark:border-stone-800">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-blue-600 transition-colors dark:text-stone-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Product Catalog</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Storefront</span>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>

        {/* Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-2 shadow-xl dark:border-stone-800 dark:bg-stone-900">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.title}
                className="h-full w-full rounded-2xl object-cover transition-all duration-500"
              />

              {hasDiscount && (
                <div className="absolute top-5 left-5 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-md">
                  -{Math.round(product.discountPercentage!)}% Off
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
                  isInWishlist
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-white/80 text-stone-700 hover:text-rose-500 hover:bg-white dark:bg-stone-900/80 dark:text-stone-300'
                }`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      selectedImage === img
                        ? 'border-blue-600 shadow-md ring-2 ring-blue-600/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100 dark:border-stone-800'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Safe Demo Notice */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-100/60 p-4 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">Interactive Curation Notice: </span>
              Products added to your cart persist in local session storage and seamlessly flow into the checkout demonstration.
            </div>
          </div>

          {/* Right Column: Product Meta & Purchase Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {product.category}
                </span>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500">128 Verified Ratings</span>
                <span className="text-stone-300">•</span>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-800 text-[11px] font-bold">
                  {product.availabilityStatus || 'In Stock'}
                </Badge>
              </div>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-stone-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-rose-600">
                    Save {formatCurrency(product.price - discountedPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">Taxes calculated at checkout • Carbon-neutral shipping included</p>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Quantity</span>
                <div className="flex items-center rounded-xl border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-800">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 flex items-center justify-center text-sm font-bold text-stone-600 hover:text-slate-900 dark:text-stone-300 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="h-9 w-10 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-9 w-9 flex items-center justify-center text-sm font-bold text-stone-600 hover:text-slate-900 dark:text-stone-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Button
                  onClick={handleAddToCart}
                  className={`h-12 text-xs font-bold gap-2 rounded-xl transition-all cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 active:scale-95'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="h-12 text-xs font-bold rounded-xl border-stone-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-stone-700 dark:hover:bg-blue-950/40 cursor-pointer"
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Compare Matrix Toggle */}
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toggleCompare(product)}
                  className={`h-9 flex-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isInCompare
                      ? 'border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-stone-200 text-stone-600 hover:text-blue-600 dark:border-stone-800 dark:text-stone-300'
                  }`}
                >
                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                  <span>{isInCompare ? '✓ Product In Comparison' : 'Add to Comparison Matrix'}</span>
                </Button>
                <Link to="/compare">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs font-bold rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40">
                    View Matrix
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="h-4 w-4 text-violet-600 shrink-0" />
                <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">30-Day Return Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">2-Year Official Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="space-y-6 pt-10 border-t border-stone-200/80 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Verified Feedback
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Customer Reviews</span>
                <span className="text-sm font-semibold text-stone-400">({productReviews.length})</span>
              </h2>
            </div>
            <Link to="/reviews">
              <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl border-stone-300">
                All Community Reviews →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {productReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500 text-xs dark:border-stone-800">
                  No written reviews yet for this product. Be the first to leave one below!
                </div>
              ) : (
                productReviews.map((rev, index) => (
                  <div
                    key={rev.id || index}
                    className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs dark:bg-blue-950 dark:text-blue-300">
                          {rev.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{rev.reviewerName}</p>
                          <p className="text-[10px] text-stone-400">{new Date(rev.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a Review Form (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Write a Review</h3>

              {reviewSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300 space-y-1">
                  <p className="font-bold">Thank you for your review!</p>
                  <p>Your feedback has been verified and added to the community stream.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300">Your Name</label>
                    <Input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Alex M."
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-400 ml-2">
                        {reviewRating} of 5 stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700 dark:text-stone-300">Review Comments</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with quality, fit, or performance..."
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-stone-700 dark:bg-stone-800"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    Submit Verified Review
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-stone-200/80 dark:border-stone-800">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Coordinated Styling
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                More From This Collection
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
