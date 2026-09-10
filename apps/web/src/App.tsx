import { Navigate, Route, Routes, useLocation } from 'react-router';
import type { ReactElement } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AboutPage,
  ContactPage,
  FeaturesPage,
  LandingPage,
  PrivacyPolicyPage,
  PricingPage,
  TermsConditionsPage,
} from '@/features/marketing-website';
import {
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
  SignupPage,
  VerifyEmailPage,
} from '@/features/auth';
import { useAuth } from '@/features/auth/auth-context';
import { OnboardingPage } from '@/features/onboarding';
import { UiPreviewPage } from '@/features/ui-preview';
import { AppShell } from '@/shell/app-shell';

const PUBLIC_ROUTES = new Set([
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
  '/ui-preview',
]);

export function App(): ReactElement {
  const location = useLocation();
  const { isAuthenticated, isLoading, isOnboardingComplete } = useAuth();
  const isPublicRoute = PUBLIC_ROUTES.has(location.pathname);
  const isOnboardingRoute =
    location.pathname === '/onboarding' || location.pathname === '/onboarding/business';
  const redirectTarget = isOnboardingComplete ? '/dashboard' : '/onboarding/business';

  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="rounded-[16px] border border-border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (isOnboardingRoute) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (isOnboardingComplete) {
      return <Navigate to="/dashboard" replace />;
    }

    if (location.pathname === '/onboarding') {
      return <Navigate to="/onboarding/business" replace />;
    }

    return <OnboardingPage />;
  }

  if (isPublicRoute) {
    if (isAuthenticated) {
      return <Navigate to={redirectTarget} replace />;
    }

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${location.pathname}${location.search}`}
          className="min-h-svh"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/ui-preview" element={<UiPreviewPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding/business" replace />;
  }

  return <AppShell />;
}
