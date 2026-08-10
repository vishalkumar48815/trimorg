import type { ReactElement, ReactNode } from 'react';
import { I18nProvider, RouterProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { useHref, useNavigate } from 'react-router';
import { AuthProvider } from '@/features/auth/auth-provider';
import { queryClient } from '@/query-client';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): ReactElement {
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.18, ease: 'easeOut' }}>
      <I18nProvider locale="en-US">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider navigate={navigate} useHref={useHref}>
              {children}
            </RouterProvider>
          </AuthProvider>
        </QueryClientProvider>
      </I18nProvider>
    </MotionConfig>
  );
}
