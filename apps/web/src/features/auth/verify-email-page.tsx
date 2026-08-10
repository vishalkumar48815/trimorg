import type { ReactElement } from 'react';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/auth-layout';
import { resendOtp as resendOtpRequest, verifyEmail as verifyEmailRequest } from '@/features/auth/auth.api';
import { verifyEmailSchema, type VerifyEmailValues } from '@/features/auth/auth.schemas';
import { ApiRequestError } from '@/lib/api';

const verifyHighlights = [
  {
    icon: Mail,
    title: 'Confirm ownership',
    description: 'Email verification keeps each workspace tied to the right business contact.',
  },
  {
    icon: ShieldCheck,
    title: 'Protect access',
    description: 'Verification adds one more calm layer before a workspace becomes active.',
  },
  {
    icon: CheckCircle2,
    title: 'Quick continuation',
    description: 'Once verified, the sign-in flow stays short and easy to return to later.',
  },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to verify your email.';
}

export function VerifyEmailPage(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const email = searchParams.get('email') ?? '';

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email,
      otp: '',
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyEmailRequest,
    onSuccess: () => {
      setFormMessage('Email verified successfully. You can now sign in.');
      form.reset({ email, otp: '' });
      navigate(`/login?email=${encodeURIComponent(email)}`, { replace: true });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtpRequest,
    onSuccess: () => {
      setFormMessage('A new OTP has been generated. Please check the backend console.');
    },
  });

  return (
    <AuthLayout
      heroTitle="Confirm your email address."
      heroDescription="Enter the OTP shown in the backend console to activate your Trimorg workspace."
      highlights={verifyHighlights}
      cardTitle="Verify email"
      cardDescription="Enter your email and the 6-digit OTP to continue."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already verified?{' '}
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
            await verifyMutation.mutateAsync(values);
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
          <label className="text-sm font-medium text-foreground" htmlFor="verify-email">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="verify-email"
              type="email"
              readOnly
              className="pl-9"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="verify-otp">
            OTP
          </label>
          <Input
            id="verify-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            {...form.register('otp')}
          />
          {form.formState.errors.otp ? (
            <p className="text-sm text-danger">{form.formState.errors.otp.message}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" size="lg" className="w-full" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={resendMutation.isPending || !email}
            onClick={async () => {
              setFormMessage(null);
              try {
                await resendMutation.mutateAsync({ email });
              } catch (error) {
                setFormMessage(getErrorMessage(error));
              }
            }}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {resendMutation.isPending ? 'Resending...' : 'Resend OTP'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
