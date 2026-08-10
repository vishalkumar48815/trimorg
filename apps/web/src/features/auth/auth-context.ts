import { createContext, useContext } from 'react';
import type { SessionData } from '@/features/auth/auth.types';

export interface AuthContextValue {
  session: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isOnboardingComplete: boolean;
  logoutUser: () => Promise<void>;
  refetchSession: () => Promise<void>;
}

export const AUTH_QUERY_KEY = ['auth', 'session'] as const;

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
