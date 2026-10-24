// ==============================================================================
// ShopSphere AI — Forgot Password Component (PROJ-SHOP-260918 | Firebase Connected)
// Theme: Clean Ivory & White, Cobalt Blue, Vibrant Violet, and Subtle Coral
// ==============================================================================

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from './AuthLayout';
import { Link } from '@/lib/router';
import { resetPassword } from './authService';
import { getFirebaseErrorMessage } from '@/firebase';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setFieldError('Email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFieldError('Please enter a valid email address.');
      return false;
    }
    setFieldError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      setAuthError(getFirebaseErrorMessage(err));
    }
  };

  return (
    <AuthLayout activeView="forgot-password">
      <div className="space-y-6">
        {/* Headings */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span>Account Recovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Forgot Your Password?
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-normal">
            Enter your registered email address and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {/* Global Auth Error Banner */}
        {authError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs sm:text-sm font-medium text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Success Feedback Card */}
        {isSuccess ? (
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                <p className="font-bold">Reset instructions sent!</p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  A password recovery email has been dispatched to <strong className="font-mono text-emerald-950 dark:text-emerald-100">{email}</strong>. Reset instructions simulated for testing and demo. Please check your inbox and follow the link to create a new password.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/login" className="w-full">
                <Button variant="default" className="w-full h-11 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="reset-email"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  placeholder="name@example.com"
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? 'reset-email-error' : undefined}
                  className={`pl-10 h-11 text-xs border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white dark:border-stone-700 dark:bg-stone-800/80 ${
                    fieldError ? 'border-rose-500 focus-visible:ring-rose-500' : 'focus-visible:ring-blue-600'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {fieldError && (
                <p id="reset-email-error" className="text-xs text-rose-600 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {fieldError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="w-full h-11 text-sm font-bold tracking-wide gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </Button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-blue-600 dark:text-stone-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
