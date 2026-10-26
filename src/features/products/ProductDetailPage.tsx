// ==============================================================================
// ShopSphere AI — Product Detail Page Component
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
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
  TrendingDown,
  LineChart,
} from 'lucide-react';
import type { Product } from '@/types';
import { CURATED_PRODUCTS, getProductById } from '@/services/productsData';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import { useCompareStore } from '@/store/useCompareStore';
import { useReviewsStore } from '@/store/useReviewsStore';
import { useAppStore } from '@/store/useAppStore';
import { usePriceAdvisorStore } from '@/store/usePriceAdvisorStore';
import { PriceHistoryChart } from '@/features/price-advisor';
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

  const userId = currentUser?.id;
  const trackedProducts = usePriceAdvisorStore((state) => state.trackedProducts);
  const togglePriceTracking = usePriceAdvisorStore((state) => state.toggleTracking);

  const storageKey = `${userId !== undefined && userId !== null ? String(userId) : 'guest'}_${productId}`;
  const trackedData = trackedProducts[storageKey];
  const isTracked = Boolean(trackedData);
  const [showPriceHistory, setShowPriceHistory] = useState(false);

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
        <h2 className="text-2xl font-black text-[#1F2937]">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you are requesting is currently unavailable.</p>
        <Link to="/shop">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Return to Catalog</Button>
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
    <div className="w-full bg-[#F9FAFB] text-[#1F2937] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-in fade-in">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Product Catalog</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Storefront</span>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="font-semibold text-[#1F2937] truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>

        {/* Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-xl">
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
                    : 'bg-white/80 text-gray-700 hover:text-rose-500 hover:bg-white'
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
                        ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                        : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Safe Demo Notice */}
            <div className="rounded-2xl border border-gray-200 bg-emerald-50/50 p-4 text-xs text-gray-600">
              <span className="font-bold text-[#1F2937]">Interactive Curation Notice: </span>
              Products added to your cart persist in local session storage and seamlessly flow into the checkout demonstration.
            </div>
          </div>

          {/* Right Column: Product Meta & Purchase Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {product.category}
                </span>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F2937] leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 font-bold text-[#1F2937]">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">128 Verified Ratings</span>
                <span className="text-gray-300">•</span>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 text-[11px] font-bold">
                  {product.availabilityStatus || 'In Stock'}
                </Badge>
              </div>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#1F2937]">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-rose-600">
                    Save {formatCurrency(product.price - discountedPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">Taxes calculated at checkout • Carbon-neutral shipping included</p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#1F2937]">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 flex items-center justify-center text-sm font-bold text-gray-600 hover:text-[#1F2937] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="h-9 w-10 flex items-center justify-center text-xs font-bold text-[#1F2937]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-9 w-9 flex items-center justify-center text-sm font-bold text-gray-600 hover:text-[#1F2937] cursor-pointer"
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
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 active:scale-95'
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
                  className="h-12 text-xs font-bold rounded-xl border-gray-200 text-gray-800 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
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
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:text-emerald-700 hover:border-emerald-200'
                  }`}
                >
                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                  <span>{isInCompare ? '✓ Product In Comparison' : 'Add to Comparison Matrix'}</span>
                </Button>
                <Link to="/compare">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs font-bold rounded-xl text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                    View Matrix
                  </Button>
                </Link>
              </div>

              {/* Price Drop Advisor Section */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-950">
                      Price Drop Advisor
                    </span>
                  </div>

                  <Link to="/price-advisor" className="text-[11px] font-semibold text-emerald-700 hover:underline">
                    Advisor Hub →
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => product && togglePriceTracking(product, userId)}
                    className={`h-9 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isTracked
                        ? 'bg-emerald-600 hover:bg-rose-600 text-white'
                        : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full mr-1.5 ${isTracked ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
                    <span>{isTracked ? 'Tracking Active (Click to Stop)' : 'Track Price Drops'}</span>
                  </Button>

                  {isTracked && trackedData && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPriceHistory((prev) => !prev)}
                      className="h-9 text-xs font-bold rounded-xl border-emerald-200 text-emerald-800 hover:bg-white cursor-pointer"
                    >
                      <LineChart className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      <span>{showPriceHistory ? 'Hide History' : 'View Price History'}</span>
                    </Button>
                  )}
                </div>

                {/* Expanded Price History Chart */}
                {showPriceHistory && trackedData && (
                  <div className="pt-2">
                    <PriceHistoryChart
                      productTitle={trackedData.productTitle}
                      snapshots={trackedData.priceSnapshots}
                      trackedAt={trackedData.trackedAt}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-gray-600 font-medium">Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-gray-600 font-medium">30-Day Return Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] text-gray-600 font-medium">2-Year Official Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="space-y-6 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Verified Feedback
              </span>
              <h2 className="text-2xl font-black text-[#1F2937] flex items-center gap-2">
                <span>Customer Reviews</span>
                <span className="text-sm font-semibold text-gray-400">({productReviews.length})</span>
              </h2>
            </div>
            <Link to="/reviews">
              <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                All Community Reviews →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {productReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 text-xs">
                  No written reviews yet for this product. Be the first to leave one below!
                </div>
              ) : (
                productReviews.map((rev, index) => (
                  <div
                    key={rev.id || index}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                          {rev.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1F2937]">{rev.reviewerName}</p>
                          <p className="text-[10px] text-gray-400">{new Date(rev.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-normal">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a Review Form (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#1F2937]">Write a Review</h3>

              {reviewSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">Thank you for your review!</p>
                  <p>Your feedback has been verified and added to the community stream.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Your Name</label>
                    <Input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Alex M."
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Rating</label>
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
                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-600 ml-2">
                        {reviewRating} of 5 stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Review Comments</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with quality, fit, or performance..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer"
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
          <div className="space-y-6 pt-10 border-t border-gray-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Coordinated Styling
              </span>
              <h2 className="text-2xl font-black text-[#1F2937]">
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
