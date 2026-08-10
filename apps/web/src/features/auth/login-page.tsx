import type { ReactElement } from 'react';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/auth-layout';
import { login as loginRequest } from '@/features/auth/auth.api';
import { AUTH_QUERY_KEY, useAuth } from '@/features/auth/auth-context';
import { loginSchema, type LoginValues } from '@/features/auth/auth.schemas';
import { ApiRequestError } from '@/lib/api';
import { queryClient } from '@/query-client';

const loginHighlights = [
  {
    icon: ShieldCheck,
    title: 'Secure access',
    description: 'Sign in to a workspace designed for daily business operations.',
  },
  {
    icon: Mail,
    title: 'One workspace',
    description: 'Keep products, sales, and inventory within a single operating surface.',
  },
  {
    icon: Eye,
    title: 'Calm interface',
    description: 'Everything stays readable, minimal, and easy to trust at a glance.',
  },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sign in.';
}

export function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetchSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (session) => {
      setFormMessage('Signed in successfully.');
      queryClient.setQueryData(AUTH_QUERY_KEY, session);

      try {
        await refetchSession();
      } catch {
        // Keep the optimistic session cache so navigation and refresh remain stable.
      }

      navigate(session.user.onboardingCompletedAt ? '/dashboard' : '/onboarding/business', { replace: true });
    },
  });

  return (
    <AuthLayout
      heroTitle="Welcome back."
      heroDescription="Sign in to continue managing products, customers, sales, and inventory from one premium workspace."
      highlights={loginHighlights}
      cardTitle="Login"
      cardDescription="Enter your credentials to access Trimorg."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          New to Trimorg?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      }
    >
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFormMessage(null);
          try {
            await loginMutation.mutateAsync(values);
          } catch (error) {
            if (
              error instanceof ApiRequestError &&
              (error.code === 'EMAIL_NOT_VERIFIED' || error.requiresVerification === true)
            ) {
              navigate(`/verify-email?email=${encodeURIComponent(values.email)}`, { replace: true });
              return;
            }

            setFormMessage(getErrorMessage(error));
          }
        })}
      >
        {formMessage ? (
          <div className="rounded-[16px] border border-border bg-surface-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            {formMessage}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="login-email">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input id="login-email" type="email" placeholder="name@company.com" className="pl-9" {...form.register('email')} />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="login-password">
            Password
          </label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pr-24"
              {...form.register('password')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-8 -translate-y-1/2 gap-2 px-3 text-muted-foreground"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </div>
          {form.formState.errors.password ? (
            <p className="text-sm text-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 rounded border-border bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" size="lg" className="w-full">
          <span className="flex size-5 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground">
            G
          </span>
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}
