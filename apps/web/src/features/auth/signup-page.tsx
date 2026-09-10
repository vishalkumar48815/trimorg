import type { ReactElement } from 'react';
import { useState } from 'react';
import { ArrowRight, BarChart3, Boxes, Mail, ReceiptText, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/features/auth/auth-layout';
import { register as registerRequest } from '@/features/auth/auth.api';
import { registerSchema, type RegisterValues } from '@/features/auth/auth.schemas';
import { ApiRequestError } from '@/lib/api';

const signupHighlights = [
  {
    icon: Boxes,
    title: 'Inventory Management',
    description: 'Keep your products, stock, and replenishment organized in one calm workspace.',
  },
  {
    icon: ReceiptText,
    title: 'Faster Billing',
    description: 'Move from order to invoice with a cleaner flow designed for speed.',
  },
  {
    icon: BarChart3,
    title: 'Business Insights',
    description: 'Track the signals that matter with a layout built for clarity first.',
  },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to create your account.';
}

export function SignupPage(): ReactElement {
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
  });

  return (
    <AuthLayout
      heroTitle="Run your business. We'll handle the operations."
      heroDescription="Create your Trimorg workspace and bring inventory, billing, and reporting into one premium operating system."
      highlights={signupHighlights}
      cardTitle="Create account"
      cardDescription="Set up your Trimorg workspace in a few calm steps."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      }
    >
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setFormMessage(null);
          try {
            const result = await registerMutation.mutateAsync({
              businessName: values.businessName,
              email: values.email,
              fullName: values.fullName,
              mobile: values.mobile,
              password: values.password,
            });

            if (result.requiresVerification) {
              navigate(`/verify-email?email=${encodeURIComponent(values.email)}`, {
                replace: true,
              });
              return;
            }

            setFormMessage(
              result.message ?? 'Account created. Check your email to verify your account.',
            );
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="signup-full-name">
              Full Name
            </label>
            <Input
              id="signup-full-name"
              type="text"
              placeholder="John Smith"
              {...form.register('fullName')}
            />
            {form.formState.errors.fullName ? (
              <p className="text-sm text-danger">{form.formState.errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="signup-business-name">
              Business Name
            </label>
            <Input
              id="signup-business-name"
              type="text"
              placeholder="Trimorg Traders"
              {...form.register('businessName')}
            />
            {form.formState.errors.businessName ? (
              <p className="text-sm text-danger">{form.formState.errors.businessName.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="signup-email">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signup-email"
              type="email"
              placeholder="name@company.com"
              className="pl-9"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email ? (
            <p className="text-sm text-danger">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="signup-mobile-number">
            Mobile Number
          </label>
          <div className="relative">
            <Smartphone
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="signup-mobile-number"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-9"
              {...form.register('mobile')}
            />
          </div>
          {form.formState.errors.mobile ? (
            <p className="text-sm text-danger">{form.formState.errors.mobile.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="signup-password">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              {...form.register('password')}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-danger">{form.formState.errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="signup-confirm-password"
            >
              Confirm Password
            </label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm your password"
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-sm text-danger">{form.formState.errors.confirmPassword.message}</p>
            ) : null}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
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
