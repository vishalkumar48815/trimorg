import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { useMutation, type UseQueryResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { useAuth } from '@/features/auth/auth-context';
import { savePreferencesStep } from '@/features/onboarding/onboarding.api';
import type { OnboardingStatus } from '@/features/onboarding/onboarding.types';
import {
  preferencesStepSchema,
  type PreferencesStepValues,
} from '@/features/onboarding/onboarding.schemas';

interface PreferencesStepSectionProps {
  statusQuery: UseQueryResult<OnboardingStatus, Error>;
  onPrevious: () => void;
}

const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
] as const;

const FINANCIAL_YEAR_OPTIONS = [
  { value: 1, label: 'January' },
  { value: 4, label: 'April' },
] as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export function PreferencesStepSection({
  statusQuery,
  onPrevious,
}: PreferencesStepSectionProps): ReactElement {
  const navigate = useNavigate();
  const { logoutUser, refetchSession } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const defaultValues = useMemo<PreferencesStepValues>(
    () => ({
      currencyCode: statusQuery.data?.organization?.currencyCode ?? 'INR',
      timezone: statusQuery.data?.organization?.timezone ?? 'Asia/Kolkata',
      financialYearStartMonth: statusQuery.data?.organization?.financialYearStartMonth ?? 4,
    }),
    [statusQuery.data],
  );

  const form = useForm<PreferencesStepValues>({
    resolver: zodResolver(preferencesStepSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const preferencesMutation = useMutation({
    mutationFn: savePreferencesStep,
    onSuccess: async () => {
      setFeedback('Preferences saved.');
      await statusQuery.refetch();
      await refetchSession();
      navigate('/dashboard', { replace: true });
    },
  });

  if (statusQuery.isLoading) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-5xl items-center justify-center px-4 py-10">
        <Card className="w-full max-w-3xl">
          <CardContent className="space-y-4 p-8">
            <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-10 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="h-28 w-full animate-pulse rounded-[16px] bg-muted/70" />
            <div className="h-16 w-full animate-pulse rounded-[16px] bg-muted/70" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (statusQuery.isError) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-5xl items-center justify-center px-4 py-10">
        <SectionCard
          title="Unable to load business setup"
          description={getErrorMessage(statusQuery.error)}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => void statusQuery.refetch()}>Try again</Button>
            <Button variant="outline" onClick={() => void logoutUser()}>
              Sign out
            </Button>
          </div>
        </SectionCard>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PageHeader
          eyebrow="Onboarding"
          title="Business preferences"
          description="Set the currency and regional preferences for this workspace."
          actions={
            <Button variant="ghost" onClick={() => void logoutUser()}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <SectionCard
            title="Step 3 · Business preferences"
            description="Load and update the saved preferences."
          >
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(async (values) => {
                setFeedback(null);
                await preferencesMutation.mutateAsync(values);
              })}
            >
              {feedback ? (
                <div className="rounded-[16px] border border-border bg-surface-secondary/60 px-4 py-3 text-sm text-muted-foreground">
                  {feedback}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="currency-code">
                  Currency <span className="text-danger">*</span>
                </label>
                <select
                  id="currency-code"
                  className="flex h-11 w-full rounded-[16px] border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  {...form.register('currencyCode')}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.currencyCode ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.currencyCode.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="timezone">
                  Timezone <span className="text-danger">*</span>
                </label>
                <Input
                  id="timezone"
                  type="text"
                  placeholder="Asia/Kolkata"
                  {...form.register('timezone')}
                />
                {form.formState.errors.timezone ? (
                  <p className="text-sm text-danger">{form.formState.errors.timezone.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="financial-year-start"
                >
                  Financial Year Start <span className="text-danger">*</span>
                </label>
                <select
                  id="financial-year-start"
                  className="flex h-11 w-full rounded-[16px] border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  {...form.register('financialYearStartMonth', { valueAsNumber: true })}
                >
                  {FINANCIAL_YEAR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.financialYearStartMonth ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.financialYearStartMonth.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" size="lg" onClick={onPrevious}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>

                <Button type="submit" size="lg" disabled={preferencesMutation.isPending}>
                  {preferencesMutation.isPending ? 'Saving...' : 'Finish Setup'}
                  {preferencesMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="Step 3 details"
            description="Preferences stay available after refresh."
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                This step stores the workspace preferences and marks onboarding as complete when
                saved.
              </p>
              <div className="space-y-3">
                {[
                  'Currency defaults to INR.',
                  'Timezone defaults to Asia/Kolkata.',
                  'Financial year can start in January or April.',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[16px] border border-border/80 bg-surface-secondary/40 px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      3
                    </span>
                    <p className="leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
