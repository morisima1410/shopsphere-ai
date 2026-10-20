// ==============================================================================
// ShopSphere AI — Component Tests: Button (React Testing Library)
// ==============================================================================

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button UI Primitive Component Tests', () => {
  it('renders button with correct text content', () => {
    render(<Button>Add to Cart</Button>);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('triggers onClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Checkout Now</Button>);

    fireEvent.click(screen.getByRole('button', { name: /checkout now/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Action</Button>);

    const button = screen.getByRole('button', { name: /disabled action/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies destructive variant styling classes', () => {
    const { container } = render(<Button variant="destructive">Delete Item</Button>);
    expect(container.firstChild).toHaveClass('bg-red-600');
  });
});
