import type { ReactElement, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSession, logout } from '@/features/auth/auth.api';
import { AUTH_QUERY_KEY, AuthContext } from '@/features/auth/auth-context';
import type { AuthContextValue } from '@/features/auth/auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchSession,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  const value: AuthContextValue = {
    session: sessionQuery.data ?? null,
    isLoading: sessionQuery.isLoading,
    isAuthenticated: Boolean(sessionQuery.data?.user),
    isEmailVerified: Boolean(sessionQuery.data?.user.isEmailVerified),
    isOnboardingComplete: Boolean(sessionQuery.data?.user.onboardingCompletedAt),
    logoutUser: async () => {
      await logoutMutation.mutateAsync();
    },
    refetchSession: async () => {
      await sessionQuery.refetch();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
