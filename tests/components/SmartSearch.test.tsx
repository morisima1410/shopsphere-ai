// ==============================================================================
// ShopSphere AI — Component Tests: Smart Search Bar (PRD Enhancement)
// ==============================================================================

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SmartSearchBar } from '@/features/search/SmartSearchBar';
import { RouterProvider } from '@/lib/router';
import { saveRecentSearch } from '@/features/search/searchUtils';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<RouterProvider>{ui}</RouterProvider>);
};

describe('SmartSearchBar Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders input with correct combobox accessibility attributes', () => {
    renderWithRouter(<SmartSearchBar placeholder="Search collections..." />);

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search collections...');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('displays popular searches and recent searches when focused with empty query', async () => {
    saveRecentSearch('Titanium Optics');

    renderWithRouter(<SmartSearchBar />);

    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
    });

    expect(screen.getByText(/recent searches/i)).toBeInTheDocument();
    expect(screen.getByText('Titanium Optics')).toBeInTheDocument();
    expect(screen.getByText(/popular searches/i)).toBeInTheDocument();
  });

  it('shows autocomplete product suggestions after debounced query input', async () => {
    renderWithRouter(<SmartSearchBar />);

    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Aura' } });
    });

    // Advance debounce timer (250ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText(/product suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Studio Wireless ANC/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation using ArrowDown, ArrowUp, and Enter', async () => {
    const handleProductSelect = vi.fn();
    renderWithRouter(
      <SmartSearchBar initialValue="Aura" onProductSelect={handleProductSelect} />
    );

    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
      vi.advanceTimersByTime(300);
    });

    // Press ArrowDown to select first suggestion
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // Press Enter to confirm selection
    act(() => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(handleProductSelect).toHaveBeenCalledTimes(1);
    expect(handleProductSelect.mock.calls[0][0].title).toContain('Aura Studio');
  });

  it('closes dropdown suggestions on Escape key', async () => {
    renderWithRouter(<SmartSearchBar />);

    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
    });

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows smart no-results feedback and alternative recommendations when query has no matches', async () => {
    renderWithRouter(<SmartSearchBar />);

    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'NonexistentProductXYZ123' } });
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText(/no exact matches for/i)).toBeInTheDocument();
    expect(screen.getByText(/popular alternatives you might desire/i)).toBeInTheDocument();
  });

  it('calls onSearchSubmit with the entered query when Search button is clicked', () => {
    const handleSearchSubmit = vi.fn();
    renderWithRouter(<SmartSearchBar onSearchSubmit={handleSearchSubmit} />);

    const input = screen.getByRole('combobox');
    act(() => {
      fireEvent.change(input, { target: { value: 'minimalist carry' } });
    });

    const searchButton = screen.getByRole('button', { name: /submit search/i });
    act(() => {
      fireEvent.click(searchButton);
    });

    expect(handleSearchSubmit).toHaveBeenCalledWith('minimalist carry');
  });
});
