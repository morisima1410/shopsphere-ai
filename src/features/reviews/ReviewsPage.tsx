// ==============================================================================
// ShopSphere AI — Customer Reviews & Rating Showcase (PROJ-SHOP-260918)
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useReviewsStore } from '@/store/useReviewsStore';
import { useAppStore } from '@/store/useAppStore';
import { CURATED_PRODUCTS, getProductById } from '@/services/productsData';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const ReviewsPage: React.FC = () => {
  const reviews = useReviewsStore((state) => state.reviews);
  const addReview = useReviewsStore((state) => state.addReview);
  const currentUser = useAppStore((state) => state.currentUser);

  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<number | 'all'>('all');

  // Review Form state
  const [formProductId, setFormProductId] = useState<number>(CURATED_PRODUCTS[0]?.id || 1);
  const [formRating, setFormRating] = useState<number>(5);
  const [formName, setFormName] = useState<string>(
    currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : ''
  );
  const [formEmail, setFormEmail] = useState<string>(currentUser?.email || '');
  const [formComment, setFormComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    const matchesProduct = selectedProductId === 'all' || r.productId === selectedProductId;
    return matchesRating && matchesProduct;
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const countsByStar = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage:
      totalReviews > 0
        ? Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100)
        : 0,
  }));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    addReview({
      id: Date.now(),
      productId: Number(formProductId),
      reviewerName: formName.trim() || 'Verified Shopper',
      reviewerEmail: formEmail.trim() || 'shopper@example.com',
      rating: formRating,
      comment: formComment.trim(),
      date: new Date().toISOString(),
    });

    setFormComment('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] pb-24">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Trust & Community Insights
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1F2937]">
            Customer Reviews & Ratings
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            Real feedback from verified customers across our curated collections.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Metrics & Filter Bar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Rating Summary Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <div className="text-center space-y-2 border-b border-gray-100 pb-5">
                <span className="text-5xl font-black text-[#1F2937]">
                  {averageRating}
                </span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500">Based on {totalReviews} verified customer reviews</p>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-2 text-xs">
                {countsByStar.map(({ star, count, percentage }) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingFilter(ratingFilter === star ? 'all' : star)}
                    className="w-full flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  >
                    <span className="w-12 font-bold text-gray-700 flex items-center gap-1">
                      <span>{star}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-8 text-right font-mono text-gray-400 text-[11px]">{count}</span>
                  </button>
                ))}
              </div>

              {/* Filter Reset if active */}
              {ratingFilter !== 'all' && (
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-500">Filtering: {ratingFilter} Stars</span>
                  <button
                    onClick={() => setRatingFilter('all')}
                    className="text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Write a Review Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#1F2937] flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>Write a Product Review</span>
              </h3>

              {isSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">Thank you for sharing your experience!</p>
                  <p>Your review is now displayed in the verified customer community.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Select Product</label>
                    <select
                      value={formProductId}
                      onChange={(e) => setFormProductId(Number(e.target.value))}
                      className="w-full h-10 px-3 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CURATED_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-600 ml-2">
                        {formRating} Stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Your Name</label>
                    <Input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Jordan V."
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Email Address</label>
                    <Input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="h-10 text-xs rounded-xl border-gray-200 focus-visible:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Your Review</label>
                    <textarea
                      rows={3}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="Tell the community about craftsmanship, material, comfort..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    Post Customer Review
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Customer Reviews Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Showing {filteredReviews.length} Community Reviews
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Filter by Product:</span>
                <select
                  value={selectedProductId}
                  onChange={(e) =>
                    setSelectedProductId(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="h-8 px-2.5 text-xs rounded-lg border border-gray-200 bg-white font-medium focus:ring-1 focus:ring-emerald-500 text-[#1F2937]"
                >
                  <option value="all">All Products</option>
                  {CURATED_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-xs text-gray-500">
                No reviews match your filter selection. Try selecting &quot;All Products&quot; or a different star rating.
              </div>
            ) : (
              filteredReviews.map((rev, idx) => {
                const product = getProductById(rev.productId);
                return (
                  <div
                    key={rev.id || idx}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-300 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 font-black text-white text-sm shadow-sm">
                          {rev.reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-[#1F2937]">
                              {rev.reviewerName}
                            </h4>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              <ShieldCheck className="h-3 w-3 text-emerald-600" />
                              <span>Verified Buyer</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400">
                            {new Date(rev.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Associated Product Mini Card */}
                    {product && (
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 rounded-2xl bg-gray-50 p-2.5 border border-gray-100 hover:border-emerald-300 transition-colors group"
                      >
                        <img
                          src={product.thumbnail || product.images?.[0] || ''}
                          alt={product.title}
                          className="h-10 w-10 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1F2937] truncate group-hover:text-emerald-600">
                            {product.title}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.category}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-600 mr-2" />
                      </Link>
                    )}

                    <p className="text-sm text-gray-700 leading-relaxed font-normal">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
