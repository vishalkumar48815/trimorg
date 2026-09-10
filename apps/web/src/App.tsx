import { useLayoutEffect, type ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  AboutPage,
  ContactPage,
  FeaturesPage,
  LandingPage,
  PrivacyPolicyPage,
  PricingPage,
  TermsConditionsPage,
  IndustrySolutionPage,
  CountrySolutionPage,
  BlogPage,
  SecurityPage,
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

function ScrollToTop(): null {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const elementId = hash.replace('#', '');
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash]);

  return null;
}

const EXACT_PUBLIC_ROUTES = new Set([
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/security',
  '/blog',
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
  '/ui-preview',
]);

function isPathPublic(path: string): boolean {
  if (EXACT_PUBLIC_ROUTES.has(path)) return true;
  if (path.startsWith('/solutions/')) return true;
  if (path.startsWith('/country/')) return true;
  if (path.startsWith('/blog/')) return true;
  return false;
}

export function App(): ReactElement {
  const location = useLocation();
  const { isAuthenticated, isLoading, isOnboardingComplete } = useAuth();
  const isPublicRoute = isPathPublic(location.pathname);
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
      <>
        <ScrollToTop />
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
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="/solutions/:slug" element={<IndustrySolutionPage />} />
              <Route path="/country/:countrySlug" element={<CountrySolutionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/ui-preview" element={<UiPreviewPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding/business" replace />;
  }

  return (
    <>
      <ScrollToTop />
      <AppShell />
    </>
  );
}
