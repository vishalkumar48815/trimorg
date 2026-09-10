import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building2, Loader2, LogOut } from 'lucide-react';
import { useMutation, type UseQueryResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { useAuth } from '@/features/auth/auth-context';
import type { OnboardingStatus } from '@/features/onboarding/onboarding.types';
import { saveBusinessStep } from '@/features/onboarding/onboarding.api';
import {
  businessStepSchema,
  businessTypeOptions,
  type BusinessStepValues,
} from '@/features/onboarding/onboarding.schemas';

interface BusinessStepSectionProps {
  statusQuery: UseQueryResult<OnboardingStatus, Error>;
  onStepComplete: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export function BusinessStepSection({
  statusQuery,
  onStepComplete,
}: BusinessStepSectionProps): ReactElement {
  const { logoutUser } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const defaultValues = useMemo<BusinessStepValues>(
    () => ({
      businessName: statusQuery.data?.organization?.businessName ?? '',
      businessType:
        statusQuery.data?.organization?.businessType &&
        statusQuery.data.organization.businessType !== 'Pending'
          ? statusQuery.data.organization.businessType
          : '',
    }),
    [statusQuery.data],
  );

  const form = useForm<BusinessStepValues>({
    resolver: zodResolver(businessStepSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const businessMutation = useMutation({
    mutationFn: saveBusinessStep,
    onSuccess: async () => {
      setFeedback('Business details saved.');
      await statusQuery.refetch();
      onStepComplete();
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
            <div className="h-28 w-full animate-pulse rounded-[16px] bg-muted/70" />
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
          title="Business details"
          description="Save the name and category for the business you're setting up in Trimorg."
          actions={
            <Button variant="ghost" onClick={() => void logoutUser()}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <SectionCard
            title="Step 1 · Business details"
            description="Enter the primary business identity for this workspace."
          >
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(async (values) => {
                setFeedback(null);
                await businessMutation.mutateAsync(values);
              })}
            >
              {feedback ? (
                <div className="rounded-[16px] border border-border bg-surface-secondary/60 px-4 py-3 text-sm text-muted-foreground">
                  {feedback}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="business-name">
                  Business Name <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Building2
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="Trimorg Traders"
                    className="pl-9"
                    {...form.register('businessName')}
                  />
                </div>
                {form.formState.errors.businessName ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.businessName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="business-type">
                  Business Type <span className="text-danger">*</span>
                </label>
                <select
                  id="business-type"
                  className="flex h-11 w-full rounded-[16px] border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  {...form.register('businessType')}
                >
                  <option value="">Select business type</option>
                  {businessTypeOptions.map((businessType) => (
                    <option key={businessType} value={businessType}>
                      {businessType}
                    </option>
                  ))}
                </select>
                {form.formState.errors.businessType ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.businessType.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  This saves only the business name and business type for your workspace.
                </p>
                <Button type="submit" size="lg" disabled={businessMutation.isPending}>
                  {businessMutation.isPending ? 'Saving...' : 'Save business details'}
                  {businessMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="What happens next"
            description="Your saved values will reload here after refresh."
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Trimorg stores the business record in your workspace so onboarding can continue with
                a consistent identity.
              </p>
              <div className="space-y-3">
                {[
                  'Business details are fetched from the current onboarding status.',
                  'Saving updates the existing workspace record.',
                  'Refresh the page to confirm the persisted values load back in.',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[16px] border border-border/80 bg-surface-secondary/40 px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      1
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
