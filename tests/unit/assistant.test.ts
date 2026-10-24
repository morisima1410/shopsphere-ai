// ==============================================================================
// ShopSphere AI — Unit Tests: AI Assistant Structured Intent Parsing (PRD Section 7 & 17)
// ==============================================================================

import { describe, it, expect } from 'vitest';

interface StructuredIntent {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  minRating?: number;
  searchKeyword?: string;
  seedProductId?: number;
}

function parseIntent(text: string, currentContext: StructuredIntent = {}): {
  intent: StructuredIntent;
  isFollowUp: boolean;
  isUnparseable: boolean;
} {
  const lower = text.toLowerCase().trim();

  // Follow-up refinement
  if (lower.includes('cheaper') || lower.includes('lower price')) {
    const referenceMax = currentContext.maxPrice || 350;
    const newMax = Math.max(50, Math.round(referenceMax * 0.7));
    return {
      intent: { ...currentContext, maxPrice: newMax },
      isFollowUp: true,
      isUnparseable: false,
    };
  }

  if (lower.includes('better rating') || lower.includes('higher rating')) {
    return {
      intent: { ...currentContext, minRating: 4.8 },
      isFollowUp: true,
      isUnparseable: false,
    };
  }

  const intent: StructuredIntent = {};
  let matchedAnything = false;

  // Category
  if (lower.includes('headphone') || lower.includes('audio') || lower.includes('acoustic')) {
    intent.category = 'acoustics';
    matchedAnything = true;
  } else if (lower.includes('watch') || lower.includes('timepiece')) {
    intent.category = 'timepieces';
    matchedAnything = true;
  } else if (lower.includes('bag') || lower.includes('carry')) {
    intent.category = 'carry';
    matchedAnything = true;
  }

  // Price ceiling
  const priceMatch = lower.match(/(?:under|below|less than|max)\s*(?:[$₹\s])?(\d+)/i);
  if (priceMatch) {
    intent.maxPrice = parseInt(priceMatch[1], 10);
    matchedAnything = true;
  }

  // Rating floor
  if (lower.includes('good rating') || lower.includes('top rating') || lower.includes('4 star')) {
    intent.minRating = 4.5;
    matchedAnything = true;
  }

  if (!matchedAnything) {
    return { intent, isFollowUp: false, isUnparseable: true };
  }

  return {
    intent: {
      category: intent.category || currentContext.category,
      maxPrice: intent.maxPrice || currentContext.maxPrice,
      minRating: intent.minRating || currentContext.minRating,
    },
    isFollowUp: false,
    isUnparseable: false,
  };
}

describe('AI Shopping Assistant Structured Intent Parser (PRD Section 7)', () => {
  it('MOD-AI-001: parses category and price ceiling from free text', () => {
    const { intent, isUnparseable } = parseIntent('Show me headphones under 5000');
    expect(isUnparseable).toBe(false);
    expect(intent.category).toBe('acoustics');
    expect(intent.maxPrice).toBe(5000);
  });

  it('parses category and minimum rating threshold', () => {
    const { intent, isUnparseable } = parseIntent('Show me watches with good ratings');
    expect(isUnparseable).toBe(false);
    expect(intent.category).toBe('timepieces');
    expect(intent.minRating).toBe(4.5);
  });

  it('MOD-AI-002: handles conversational refinement "show me something cheaper"', () => {
    const initialContext: StructuredIntent = { category: 'acoustics', maxPrice: 300 };
    const { intent, isFollowUp } = parseIntent('show me something cheaper', initialContext);

    expect(isFollowUp).toBe(true);
    expect(intent.category).toBe('acoustics');
    expect(intent.maxPrice).toBeLessThan(300);
  });

  it('handles conversational refinement "something with better ratings"', () => {
    const initialContext: StructuredIntent = { category: 'carry', maxPrice: 200 };
    const { intent, isFollowUp } = parseIntent('something with better ratings', initialContext);

    expect(isFollowUp).toBe(true);
    expect(intent.category).toBe('carry');
    expect(intent.minRating).toBe(4.8);
  });

  it('MOD-AI-003: identifies unparseable input and flags for clarifying fallback', () => {
    const { isUnparseable } = parseIntent('hmm not sure');
    expect(isUnparseable).toBe(true);
  });
});
