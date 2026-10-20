// ==============================================================================
// ShopSphere AI — Component Tests: Authentication (Firebase Connected)
// ==============================================================================

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '@/features/auth/Login';
import { Register } from '@/features/auth/Register';
import { ForgotPassword } from '@/features/auth/ForgotPassword';
import { RouterProvider } from '@/lib/router';
import * as authService from '@/features/auth/authService';

vi.mock('@/features/auth/authService', () => ({
  loginWithEmail: vi.fn().mockResolvedValue({
    id: 'user_123',
    uid: 'user_123',
    username: 'test',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'customer',
  }),
  registerWithEmail: vi.fn().mockResolvedValue({
    id: 'user_123',
    uid: 'user_123',
    username: 'alex',
    email: 'alex@example.com',
    firstName: 'Alex',
    lastName: 'Morgan',
    role: 'customer',
  }),
  loginWithGoogle: vi.fn().mockResolvedValue({
    id: 'google_123',
    uid: 'google_123',
    username: 'googleuser',
    email: 'google@example.com',
    firstName: 'Google',
    lastName: 'User',
    role: 'customer',
  }),
  resetPassword: vi.fn().mockResolvedValue(undefined),
  logoutUser: vi.fn().mockResolvedValue(undefined),
  mapFirebaseUser: vi.fn((fbUser) => ({
    id: fbUser?.uid || '1',
    uid: fbUser?.uid || '1',
    username: 'shopper',
    email: fbUser?.email || '',
    firstName: 'Shopper',
    lastName: '',
    role: 'customer',
  })),
}));

describe('Step 2 & Firebase Authentication UI Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Component', () => {
    it('renders heading, form inputs, remember me, and Google sign-in button', () => {
      render(
        <RouterProvider>
          <Login />
        </RouterProvider>
      );

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText(/remember me on this device/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting an empty form', async () => {
      render(
        <RouterProvider>
          <Login />
        </RouterProvider>
      );

      const submitButton = screen.getByRole('button', { name: /sign in$/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/^password is required/i)).toBeInTheDocument();
      });
      expect(authService.loginWithEmail).not.toHaveBeenCalled();
    });

    it('shows validation error for invalid email format', async () => {
      render(
        <RouterProvider>
          <Login />
        </RouterProvider>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /sign in$/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email-string' } });
      fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
      expect(authService.loginWithEmail).not.toHaveBeenCalled();
    });

    it('toggles password visibility between text and password', () => {
      render(
        <RouterProvider>
          <Login />
        </RouterProvider>
      );

      const passwordInput = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      const toggleButton = screen.getByRole('button', { name: /show password/i });
      fireEvent.click(toggleButton);

      expect(passwordInput.type).toBe('text');

      const hideButton = screen.getByRole('button', { name: /hide password/i });
      fireEvent.click(hideButton);

      expect(passwordInput.type).toBe('password');
    });

    it('triggers Firebase login and displays success banner on valid submit', async () => {
      render(
        <RouterProvider>
          <Login />
        </RouterProvider>
      );

      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'valid@example.com' } });
      fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'Password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in$/i }));

      await waitFor(() => {
        expect(authService.loginWithEmail).toHaveBeenCalledWith('valid@example.com', 'Password123');
        expect(screen.getByText(/sign in successful/i)).toBeInTheDocument();
      });
    });

    it('triggers Firebase Google popup login on Google button click', async () => {
      render(
        <RouterProvider>
          <Login />
        </RouterProvider>
      );

      fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

      await waitFor(() => {
        expect(authService.loginWithGoogle).toHaveBeenCalled();
        expect(screen.getByText(/signed in with google/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Component', () => {
    it('renders heading, all registration inputs, terms checkbox, and Google sign-up button', () => {
      render(
        <RouterProvider>
          <Register />
        </RouterProvider>
      );

      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password', { selector: 'input' })).toBeInTheDocument();
      expect(screen.getByLabelText(/i agree to the/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument();
    });

    it('validates empty inputs and unaccepted terms', async () => {
      render(
        <RouterProvider>
          <Register />
        </RouterProvider>
      );

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/^password is required\./i)).toBeInTheDocument();
        expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
        expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
      });
      expect(authService.registerWithEmail).not.toHaveBeenCalled();
    });

    it('validates password mismatch and password strength', async () => {
      render(
        <RouterProvider>
          <Register />
        </RouterProvider>
      );

      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Morgan' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@example.com' } });
      fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'short' } });
      fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'different' } });
      fireEvent.click(screen.getByLabelText(/i agree to the/i));

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
      expect(authService.registerWithEmail).not.toHaveBeenCalled();
    });

    it('calls Firebase registerWithEmail on valid submission', async () => {
      render(
        <RouterProvider>
          <Register />
        </RouterProvider>
      );

      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Morgan' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@example.com' } });
      fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'Password123' } });
      fireEvent.click(screen.getByLabelText(/i agree to the/i));

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(authService.registerWithEmail).toHaveBeenCalledWith('Alex Morgan', 'alex@example.com', 'Password123');
        expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('ForgotPassword Component', () => {
    it('renders heading, email input, and submit button', () => {
      render(
        <RouterProvider>
          <ForgotPassword />
        </RouterProvider>
      );

      expect(screen.getByRole('heading', { name: /forgot your password/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    it('validates email on submit and triggers Firebase resetPassword', async () => {
      render(
        <RouterProvider>
          <ForgotPassword />
        </RouterProvider>
      );

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      // Test empty
      fireEvent.click(submitButton);
      const form = submitButton.closest('form');
      if (form) fireEvent.submit(form);
      await waitFor(() => {
        expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      });
      expect(authService.resetPassword).not.toHaveBeenCalled();

      // Test valid email
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com');
        expect(screen.getByText(/reset instructions sent/i)).toBeInTheDocument();
      });
    });
  });
});
