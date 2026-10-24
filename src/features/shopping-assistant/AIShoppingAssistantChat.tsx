// ==============================================================================
// ShopSphere AI — Rule-Based Conversational Shopping Assistant (Section 7 PRD)
// Fully compliant with MOD-AI-001, MOD-AI-002, MOD-AI-003
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Star,
  Check,
  ChevronDown,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { CURATED_PRODUCTS, getProductById } from '@/services/productsData';
import { getRecommendationsByStrategy } from '@/features/recommendations/recommendationEngine';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';

export interface StructuredIntent {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  minRating?: number;
  searchKeyword?: string;
  seedProductId?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredIntent?: StructuredIntent;
  products?: Product[];
  suggestedFollowUps?: string[];
  isError?: boolean;
}

export const AIShoppingAssistantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addItemToCart = useCartStore((state) => state.addItem);

  // Active conversational context (Section 7.4)
  const [activeContext, setActiveContext] = useState<StructuredIntent>({});
  const [lastShownProducts, setLastShownProducts] = useState<Product[]>([]);

  // Initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am ShopSphere AI's conversational assistant. Tell me what you're shopping for (e.g., 'Show me headphones under $250 with good ratings'), and I'll find matching items.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Show me headphones under $250',
        'Find watches with top ratings',
        'Show me minimalist carry bags',
        'Under $150 gifts',
      ],
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const handleAddToCart = (product: Product) => {
    addItemToCart(product, 1);
    setAddedItemIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  /**
   * Section 7.3: Structured Intent Extraction Engine
   * Converts free-text into structured filter parameters
   */
  const parseIntent = (text: string, currentContext: StructuredIntent): {
    intent: StructuredIntent;
    isFollowUp: boolean;
    isUnparseable: boolean;
  } => {
    const lower = text.toLowerCase().trim();

    // Check for Conversational Refinement (Section 7.4)
    if (lower.includes('cheaper') || lower.includes('less expensive') || lower.includes('lower price')) {
      const referenceMax = currentContext.maxPrice || 350;
      const newMax = Math.max(50, Math.round(referenceMax * 0.7));
      return {
        intent: { ...currentContext, maxPrice: newMax },
        isFollowUp: true,
        isUnparseable: false,
      };
    }

    if (lower.includes('better rating') || lower.includes('higher rating') || lower.includes('best rating')) {
      return {
        intent: { ...currentContext, minRating: 4.8 },
        isFollowUp: true,
        isUnparseable: false,
      };
    }

    if (lower.includes('more like the second') || lower.includes('like the 2nd')) {
      const seed = lastShownProducts[1] || lastShownProducts[0];
      return {
        intent: { seedProductId: seed?.id, category: seed?.category },
        isFollowUp: true,
        isUnparseable: false,
      };
    }

    if (lower.includes('more like the first') || lower.includes('like the 1st')) {
      const seed = lastShownProducts[0];
      return {
        intent: { seedProductId: seed?.id, category: seed?.category },
        isFollowUp: true,
        isUnparseable: false,
      };
    }

    // New or modified query
    const intent: StructuredIntent = {};
    let matchedAnything = false;

    // Reset topic if user says "never mind", "instead", "show me X instead"
    const isTopicReset = lower.includes('instead') || lower.includes('never mind');

    // 1. Category extraction
    if (lower.includes('headphone') || lower.includes('audio') || lower.includes('acoustic') || lower.includes('earbud')) {
      intent.category = 'acoustics';
      matchedAnything = true;
    } else if (lower.includes('watch') || lower.includes('timepiece') || lower.includes('horology') || lower.includes('chronos')) {
      intent.category = 'timepieces';
      matchedAnything = true;
    } else if (lower.includes('bag') || lower.includes('backpack') || lower.includes('carry') || lower.includes('leather')) {
      intent.category = 'carry';
      matchedAnything = true;
    } else if (lower.includes('lamp') || lower.includes('light') || lower.includes('living') || lower.includes('ceramic') || lower.includes('home')) {
      intent.category = 'living';
      matchedAnything = true;
    } else if (lower.includes('sunglasses') || lower.includes('eyewear') || lower.includes('optical')) {
      intent.category = 'optical';
      matchedAnything = true;
    } else if (lower.includes('apparel') || lower.includes('jacket') || lower.includes('coat') || lower.includes('clothing')) {
      intent.category = 'apparel';
      matchedAnything = true;
    } else if (lower.includes('smartphone') || lower.includes('phone')) {
      intent.category = 'acoustics'; // Fallback to tech/acoustics
      matchedAnything = true;
    }

    // 2. Price extraction: "under $200", "under 5000", "< 300", "below 150"
    const priceMatch = lower.match(/(?:under|below|less than|max)\s*(?:[$₹\s])?(\d+)/i);
    if (priceMatch) {
      intent.maxPrice = parseInt(priceMatch[1], 10);
      matchedAnything = true;
    }

    // 3. Rating extraction: "good rating", "top rating", "4 star", "4.5"
    if (lower.includes('good rating') || lower.includes('top rating') || lower.includes('best rating') || lower.includes('4 star') || lower.includes('high rating')) {
      intent.minRating = 4.5;
      matchedAnything = true;
    }

    // 4. Keyword search
    const words = lower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => !['show', 'me', 'find', 'give', 'with', 'the', 'under', 'below', 'good', 'a', 'an', 'in'].includes(w));
    if (words.length > 0) {
      intent.searchKeyword = words.join(' ');
    }

    const genericPhrases = ['hmm not sure', 'not sure', 'idk', 'hello', 'hi', 'hey', 'test', 'help', 'whatever'];
    if (genericPhrases.includes(lower) || (!matchedAnything && !isTopicReset)) {
      return { intent, isFollowUp: false, isUnparseable: true };
    }

    // Merge with existing context if not a topic reset
    const finalIntent: StructuredIntent = isTopicReset
      ? intent
      : {
          category: intent.category || currentContext.category,
          maxPrice: intent.maxPrice || currentContext.maxPrice,
          minRating: intent.minRating || currentContext.minRating,
          searchKeyword: intent.searchKeyword,
        };

    return {
      intent: finalIntent,
      isFollowUp: false,
      isUnparseable: false,
    };
  };

  /**
   * Execute Structured Query against Catalog
   */
  const executeQuery = (intent: StructuredIntent): Product[] => {
    let pool = [...CURATED_PRODUCTS];

    if (intent.seedProductId) {
      const recs = getRecommendationsByStrategy('similar_products', { targetProductId: intent.seedProductId }, pool);
      return recs.map((r) => r.product).slice(0, 3);
    }

    if (intent.category) {
      const catMatches = pool.filter((p) => p.category.toLowerCase() === intent.category?.toLowerCase());
      if (catMatches.length > 0) pool = catMatches;
    }

    if (intent.maxPrice) {
      pool = pool.filter((p) => p.price <= (intent.maxPrice || 1000));
    }

    if (intent.minRating) {
      pool = pool.filter((p) => (p.rating || 0) >= (intent.minRating || 0));
    }

    if (intent.searchKeyword) {
      const kw = intent.searchKeyword.toLowerCase();
      const kwMatches = pool.filter((p) =>
        p.title.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw) ||
        p.category.toLowerCase().includes(kw)
      );
      if (kwMatches.length > 0) pool = kwMatches;
    }

    // Sort by rating and relevancy
    return pool.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    // Simulate assistant thinking & intent execution (350ms)
    setTimeout(() => {
      const { intent, isFollowUp, isUnparseable } = parseIntent(query, activeContext);

      if (isUnparseable) {
        const fallbackMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: "I couldn't confidently parse a specific product category or price filter from that. Try asking something like: 'Show me headphones under $250' or select one of the starter prompts below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          suggestedFollowUps: [
            'Show me headphones under $250',
            'Find watches with top ratings',
            'Show me carry bags',
          ],
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setIsThinking(false);
        return;
      }

      // Update active context
      setActiveContext(intent);

      const results = executeQuery(intent);
      setLastShownProducts(results);

      let responseText = '';
      if (results.length === 0) {
        responseText = `I couldn't find items strictly matching ${intent.category || 'all items'} under ${formatCurrency(intent.maxPrice || 0)}. Here are top alternatives from our collection:`;
      } else if (isFollowUp) {
        responseText = `Refined your search with updated parameters ${intent.maxPrice ? `(capped at ${formatCurrency(intent.maxPrice)})` : ''} ${intent.minRating ? `(min ${intent.minRating}★)` : ''}:`;
      } else {
        responseText = `Found ${results.length} matching items for ${intent.category ? `category: ${intent.category}` : 'your criteria'}${intent.maxPrice ? ` under ${formatCurrency(intent.maxPrice)}` : ''}:`;
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredIntent: intent,
        products: results.length > 0 ? results : CURATED_PRODUCTS.slice(0, 2),
        suggestedFollowUps: [
          'Show me something cheaper',
          'Something with better ratings',
          'Show me more like the first one',
          'Never mind, show me bags instead',
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Action Button (FAB) at bottom-right */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 px-5 py-3.5 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white/80 dark:ring-slate-900/80 group"
          aria-label="Open AI Shopping Assistant"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 text-rose-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-blue-700" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none">ShopSphere Assistant</span>
            <span className="text-[10px] text-blue-100 font-semibold leading-tight">Rule-Based AI</span>
          </div>
        </button>
      )}

      {/* Floating or Docked Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col rounded-3xl border border-stone-200/90 bg-[#FAF9F5] shadow-2xl dark:border-stone-800 dark:bg-stone-900 transition-all duration-300 ${
            isMinimized
              ? 'h-16 w-80'
              : 'h-[580px] max-h-[85vh] w-[95vw] sm:w-[420px]'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-stone-200/90 bg-white px-5 py-3.5 rounded-t-3xl dark:border-stone-800 dark:bg-stone-850 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Shopping Assistant</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-violet-600 border-violet-200 dark:text-violet-300">
                    Rule-Based Mock AI
                  </Badge>
                </h3>
                <p className="text-[10px] text-stone-400">Natural intent parsing & refinement</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Architecture Scope Notice per Section 7.1 */}
              <div className="bg-blue-50/70 px-4 py-1.5 border-b border-blue-100 text-[10px] text-blue-900 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300 flex items-center gap-1.5 shrink-0">
                <Info className="h-3 w-3 shrink-0 text-blue-600" />
                <span>Zero-Cost Guarantee: Uses local rule-based intent parsing (no paid LLM API).</span>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-none">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } space-y-2`}
                  >
                    {/* Text Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-sm font-medium'
                          : msg.isError
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 rounded-bl-xs'
                          : 'bg-white border border-stone-200/90 text-slate-800 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Display Parsed Intent Parameters if Available */}
                      {msg.structuredIntent && Object.keys(msg.structuredIntent).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-700/60 flex flex-wrap gap-1 text-[10px] font-mono text-stone-500 dark:text-stone-400">
                          {msg.structuredIntent.category && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5 dark:bg-stone-700">
                              cat: {msg.structuredIntent.category}
                            </span>
                          )}
                          {msg.structuredIntent.maxPrice && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5 dark:bg-stone-700">
                              max: {formatCurrency(msg.structuredIntent.maxPrice)}
                            </span>
                          )}
                          {msg.structuredIntent.minRating && (
                            <span className="rounded bg-stone-100 px-1.5 py-0.5 dark:bg-stone-700">
                              rating: {msg.structuredIntent.minRating}★
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Inline Product Cards (Section 7.2) */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="w-full space-y-2 pt-1">
                        {msg.products.map((product) => {
                          const unitPrice = calculateDiscountPrice(product.price, product.discountPercentage);
                          const isAdded = addedItemIds.includes(product.id);
                          return (
                            <div
                              key={product.id}
                              className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/90 bg-white p-2.5 shadow-xs hover:border-blue-300 dark:border-stone-800 dark:bg-stone-800/80 transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={product.thumbnail || product.images?.[0] || ''}
                                  alt={product.title}
                                  className="h-12 w-12 rounded-xl object-cover bg-stone-100 shrink-0"
                                />
                                <div className="min-w-0">
                                  <Link
                                    to={`/product/${product.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="font-bold text-slate-900 dark:text-white text-xs hover:text-blue-600 truncate block"
                                  >
                                    {product.title}
                                  </Link>
                                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                      {formatCurrency(unitPrice)}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center text-amber-500 font-bold">
                                      <Star className="h-3 w-3 fill-amber-400 mr-0.5" />
                                      {product.rating || '4.8'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                className={`h-8 px-2.5 text-xs font-bold rounded-lg shrink-0 transition-all cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Suggested Refinements / Starter Prompts */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedFollowUps.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handleSendMessage(prompt)}
                            className="rounded-full border border-stone-200 bg-stone-100/80 px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 transition-colors cursor-pointer text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-stone-400 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {/* Loading / Parsing Indicator */}
                {isThinking && (
                  <div className="flex items-center gap-2 rounded-2xl bg-white p-3 border border-stone-200/90 text-stone-500 text-xs w-36 shadow-xs dark:bg-stone-800 dark:border-stone-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-medium ml-1">Analyzing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Box */}
              <div className="border-t border-stone-200/90 bg-white p-3 rounded-b-3xl dark:border-stone-800 dark:bg-stone-850 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="e.g. Show me headphones under $250..."
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    className="flex-1 h-10 rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-xs text-slate-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <Button
                    type="submit"
                    disabled={!inputQuery.trim() || isThinking}
                    className="h-10 w-10 p-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shrink-0 cursor-pointer shadow-sm"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
