// ==============================================================================
// ShopSphere AI — Playwright End-to-End Suite (Step 1 & Step 2 Auth)
// ==============================================================================

import { test, expect } from '@playwright/test';

test.describe('ShopSphere AI App & Authentication E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display ShopSphere AI brand and welcome title', async ({ page }) => {
    await expect(page).toHaveTitle(/ShopSphere AI/);

    const brandHeading = page.locator('h1');
    await expect(brandHeading).toContainText('Welcome to ShopSphere AI');
  });

  test('should display the official tagline', async ({ page }) => {
    await expect(
      page.getByText('Personalized Shopping, Powered by Intelligence')
    ).toBeVisible();
  });

  test('should navigate to login page and render login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
    await expect(page.locator('main').getByRole('button', { name: /sign in$/i })).toBeVisible();
  });

  test('should validate empty login form submission', async ({ page }) => {
    await page.goto('/login');
    await page.locator('main').getByRole('button', { name: /sign in$/i }).click();
    await expect(page.getByText(/email address is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should navigate to register page and validate required fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/full name is required/i)).toBeVisible();
    await expect(page.getByText(/email address is required/i)).toBeVisible();
  });

  test('should navigate to forgot-password view and display demo recovery card', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /forgot your password/i })).toBeVisible();
    await page.getByLabel(/email address/i).fill('user@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.getByText(/reset instructions simulated/i)).toBeVisible();
  });
});
