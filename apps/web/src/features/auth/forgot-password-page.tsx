import type { ReactElement } from 'react';
import { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/auth-layout';
import { forgotPassword as forgotPasswordRequest } from '@/features/auth/auth.api';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/features/auth/auth.schemas';
import { ApiRequestError } from '@/lib/api';

const forgotHighlights = [
  {
    icon: ShieldCheck,
    title: 'Secure recovery',
    description: 'Password reset is presented as a calm, straightforward recovery flow.',
  },
  {
    icon: Mail,
    title: 'Email first',
    description: 'We keep the flow centered on the email address already tied to your account.',
  },
  {
    icon: ArrowRight,
    title: 'Back to work',
    description: 'Once access is restored, you can continue where you left off without friction.',
  },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to send a reset link.';
}

export function ForgotPasswordPage(): ReactElement {
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {
      setFormMessage('If the account exists, a reset link has been sent.');
      form.reset();
    },
  });

  return (
    <AuthLayout
      heroTitle="Reset access without friction."
      heroDescription="Use your email address to receive a secure link and get back into Trimorg quickly."
      highlights={forgotHighlights}
      cardTitle="Forgot password"
      cardDescription="Enter the email address tied to your Trimorg account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFormMessage(null);
          try {
            await forgotMutation.mutateAsync(values);
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
          <label className="text-sm font-medium text-foreground" htmlFor="forgot-email">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input id="forgot-email" type="email" placeholder="name@company.com" className="pl-9" {...form.register('email')} />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={forgotMutation.isPending}>
          {forgotMutation.isPending ? 'Sending...' : 'Send Reset Link'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthLayout>
  );
}
