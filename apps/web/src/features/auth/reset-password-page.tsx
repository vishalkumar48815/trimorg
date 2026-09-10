import type { ReactElement } from 'react';
import { useState } from 'react';
import { ArrowRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/auth-layout';
import { resetPassword as resetPasswordRequest } from '@/features/auth/auth.api';
import { resetPasswordSchema, type ResetPasswordValues } from '@/features/auth/auth.schemas';
import { ApiRequestError } from '@/lib/api';

const resetHighlights = [
  {
    icon: ShieldCheck,
    title: 'Protected reset',
    description: 'A password reset flow that feels secure and easy to understand.',
  },
  {
    icon: Lock,
    title: 'Fresh credentials',
    description: 'Choose a new password without changing the rest of your workspace setup.',
  },
  {
    icon: Sparkles,
    title: 'Back to calm',
    description: 'Return to Trimorg with a clean, distraction-free sign-in experience.',
  },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to reset your password.';
}

export function ResetPasswordPage(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get('token') ?? '',
      password: '',
      confirmPassword: '',
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      setFormMessage('Password updated successfully. You can sign in again.');
      form.reset({ token: '', password: '', confirmPassword: '' });
      navigate('/login', { replace: true });
    },
  });

  return (
    <AuthLayout
      heroTitle="Choose a new password."
      heroDescription="Set a fresh password for your Trimorg account and get back to work with less friction."
      highlights={resetHighlights}
      cardTitle="Reset password"
      cardDescription="Choose a strong password for your account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Need to start over?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Return to login
          </Link>
        </p>
      }
    >
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFormMessage(null);
          try {
            await resetMutation.mutateAsync(values);
          } catch (error) {
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
          <label className="text-sm font-medium text-foreground" htmlFor="reset-token">
            Reset Token
          </label>
          <Input
            id="reset-token"
            type="text"
            placeholder="Paste your reset token"
            {...form.register('token')}
          />
          {form.formState.errors.token ? (
            <p className="text-sm text-danger">{form.formState.errors.token.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="reset-password">
            New Password
          </label>
          <Input
            id="reset-password"
            type="password"
            placeholder="Enter a new password"
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-danger">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="reset-confirm-password">
            Confirm Password
          </label>
          <Input
            id="reset-confirm-password"
            type="password"
            placeholder="Confirm your password"
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword ? (
            <p className="text-sm text-danger">{form.formState.errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={resetMutation.isPending}>
          {resetMutation.isPending ? 'Updating...' : 'Update Password'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
