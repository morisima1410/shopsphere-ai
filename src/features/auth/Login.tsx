// ==============================================================================
// ShopSphere AI — Login Component (PROJ-SHOP-260918 | Firebase Auth Connected)
// Theme: Emerald Green (#059669), White, and Charcoal (#1F2937)
// ==============================================================================

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from './AuthLayout';
import { Link, useRouter } from '@/lib/router';
import { useAppStore } from '@/store/useAppStore';
import { loginWithEmail, loginWithGoogle } from './authService';
import { getFirebaseErrorMessage } from '@/firebase';

export const Login: React.FC = () => {
  const { navigate } = useRouter();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  // Form Field State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Submission State
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com).';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const currentUser = useAppStore((state) => state.currentUser);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);

  // Auto-redirect if already signed in
  React.useEffect(() => {
    if (!isAuthLoading && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, isAuthLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await loginWithEmail(email, password);
      setCurrentUser(user);
      setAuthSuccessMessage('Sign in successful! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setIsSubmitting(false);
      setAuthError(getFirebaseErrorMessage(err));
    }
  };

  const handleGoogleSignInClick = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      setAuthSuccessMessage('Signed in with Google! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setIsGoogleLoading(false);
      setAuthError(getFirebaseErrorMessage(err));
    }
  };

  return (
    <AuthLayout activeView="login">
      <div className="space-y-6">
        {/* Headings */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Welcome Back!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F2937] dark:text-white">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-gray-400 font-normal">
            Sign in to continue your personalized shopping experience.
          </p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs sm:text-sm font-medium text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Success Banner */}
        {authSuccessMessage && (
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs sm:text-sm font-medium text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>{authSuccessMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-[#1F2937] dark:text-gray-200"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="name@example.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                className={`pl-10 h-11 text-xs border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white dark:border-gray-700 dark:bg-gray-800/80 ${
                  fieldErrors.email ? 'border-rose-500 focus-visible:ring-rose-500' : 'focus-visible:ring-emerald-500'
                }`}
                disabled={isSubmitting || isGoogleLoading}
              />
            </div>
            {fieldErrors.email && (
              <p id="login-email-error" className="text-xs text-rose-600 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-[#1F2937] dark:text-gray-200"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                className={`pl-10 pr-10 h-11 text-xs border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white dark:border-gray-700 dark:bg-gray-800/80 ${
                  fieldErrors.password ? 'border-rose-500 focus-visible:ring-rose-500' : 'focus-visible:ring-emerald-500'
                }`}
                disabled={isSubmitting || isGoogleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-1.5 rounded-lg"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="login-password-error" className="text-xs text-rose-600 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              id="login-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 dark:border-gray-700 dark:bg-gray-900 cursor-pointer"
              disabled={isSubmitting || isGoogleLoading}
            />
            <label
              htmlFor="login-remember"
              className="text-xs font-medium text-gray-600 dark:text-gray-400 select-none cursor-pointer"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full h-11 text-sm font-bold tracking-wide gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
            <span className="bg-white px-3 text-[#6B7280] dark:bg-gray-900 dark:text-gray-400">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignInClick}
          disabled={isSubmitting || isGoogleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1F2937] shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Link to Register */}
        <div className="text-center text-xs text-[#6B7280] dark:text-gray-400 pt-1">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
