// ==============================================================================
// ShopSphere AI — AI Shopping Assistant & Style Calibrator Modal
// Theme: Emerald Green (#059669) + Pure White (#FFFFFF) + Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Cpu,
  ArrowRight,
  Check,
  ShoppingBag,
  Sliders,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AestheticPersona,
  BudgetTier,
  generateRecommendations,
} from '@/features/recommendations/recommendationEngine';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { Link } from '@/lib/router';

interface AIPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPersonalizationModal: React.FC<AIPersonalizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [persona, setPersona] = useState<AestheticPersona>('minimalist');
  const [budget, setBudget] = useState<BudgetTier>('balanced');
  const addItemToCart = useCartStore((state) => state.addItem);

  if (!isOpen) return null;

  const recommendations = generateRecommendations({ persona, budget }).slice(0, 3);

  const personas = [
    {
      id: 'minimalist' as AestheticPersona,
      title: 'Minimalist Luxury',
      subtitle: 'Pure geometry, neutral obsidian tones, and full-grain leather',
    },
    {
      id: 'audiophile' as AestheticPersona,
      title: 'Audiophile & Tech Purist',
      subtitle: 'Acoustic titanium drivers and studio-grade reference playback',
    },
    {
      id: 'urban' as AestheticPersona,
      title: 'Urban Modernist',
      subtitle: 'Seam-sealed weather membranes and modular carry solutions',
    },
    {
      id: 'architectural' as AestheticPersona,
      title: 'Architectural Living',
      subtitle: 'Textured stoneware ceramics and sculptural illumination',
    },
  ];

  const budgets = [
    { id: 'any' as BudgetTier, label: 'All Price Ranges' },
    { id: 'budget' as BudgetTier, label: 'Under $200' },
    { id: 'balanced' as BudgetTier, label: '$150 – $350' },
    { id: 'premium' as BudgetTier, label: '$250 & Above' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-[#F9FAFB] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1F2937] flex items-center gap-2">
                <span>Personalized Style Calibrator</span>
                <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                  Rule-Based Engine
                </span>
              </h2>
              <p className="text-[11px] text-gray-500">Fine-tune your personal product feed in real time</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Persona Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-emerald-600" />
              <span>Select Your Aesthetic Persona</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personas.map((p) => {
                const isSelected = persona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersona(p.id)}
                    className={`rounded-2xl p-3.5 text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-white text-[#1F2937] shadow-md ring-2 ring-emerald-600/20'
                        : 'border-gray-200 bg-white/70 hover:bg-white text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{p.title}</span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-normal">{p.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1F2937]">
              Budget Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {budgets.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(b.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    budget === b.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Calibrated Matches */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                Top Calibrated Recommendations
              </span>
              <span className="text-[11px] text-gray-500 font-mono">3 matches found</span>
            </div>

            <div className="space-y-3">
              {recommendations.map(({ product, matchScore, matchReason }) => {
                const discountedPrice = calculateDiscountPrice(
                  product.price,
                  product.discountPercentage
                );
                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail || product.images?.[0] || ''}
                        alt={product.title}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 bg-gray-100"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            {product.category}
                          </span>
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold">
                            {matchScore}% Match
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1F2937] line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{matchReason}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <span className="text-sm font-black text-[#1F2937]">
                        {formatCurrency(discountedPrice)}
                      </span>

                      <Button
                        size="sm"
                        onClick={() => {
                          addItemToCart(product, 1);
                          onClose();
                        }}
                        className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white p-4">
          <Link to="/shop" onClick={onClose} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
            Browse All Products in Catalog →
          </Link>

          <Button onClick={onClose} className="h-9 px-4 text-xs font-bold bg-[#1F2937] text-white hover:bg-gray-800 rounded-xl cursor-pointer">
            Close Calibrator
          </Button>
        </div>
      </div>
    </div>
  );
};
