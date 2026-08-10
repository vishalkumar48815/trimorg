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
import { saveAddressStep } from '@/features/onboarding/onboarding.api';
import type { OnboardingStatus } from '@/features/onboarding/onboarding.types';
import {
  addressStepSchema,
  type AddressStepValues,
} from '@/features/onboarding/onboarding.schemas';

interface AddressStepSectionProps {
  statusQuery: UseQueryResult<OnboardingStatus, Error>;
  onPrevious: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export function AddressStepSection({
  statusQuery,
  onPrevious,
}: AddressStepSectionProps): ReactElement {
  const navigate = useNavigate();
  const { logoutUser, refetchSession } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const defaultValues = useMemo<AddressStepValues>(
    () => ({
      businessAddress: statusQuery.data?.organization?.addressLine1 ?? '',
      country: statusQuery.data?.organization?.country ?? '',
      state: statusQuery.data?.organization?.state ?? '',
      city: statusQuery.data?.organization?.city ?? '',
      pincode: statusQuery.data?.organization?.postalCode ?? '',
    }),
    [statusQuery.data],
  );

  const form = useForm<AddressStepValues>({
    resolver: zodResolver(addressStepSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const addressMutation = useMutation({
    mutationFn: saveAddressStep,
    onSuccess: async () => {
      setFeedback('Business address saved.');
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
        <SectionCard title="Unable to load business setup" description={getErrorMessage(statusQuery.error)}>
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
          title="Business address"
          description="Capture the business address details for this workspace."
          actions={
            <Button variant="ghost" onClick={() => void logoutUser()}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <SectionCard title="Step 2 · Business address" description="Load and update the saved address details.">
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(async (values) => {
                setFeedback(null);
                await addressMutation.mutateAsync(values);
              })}
            >
              {feedback ? (
                <div className="rounded-[16px] border border-border bg-surface-secondary/60 px-4 py-3 text-sm text-muted-foreground">
                  {feedback}
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="business-address">
                  Business Address <span className="text-danger">*</span>
                </label>
                <textarea
                  id="business-address"
                  rows={4}
                  placeholder="Street address, area, landmark"
                  className="flex w-full rounded-[16px] border border-field-border bg-field-background px-4 py-3 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-field-placeholder focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  {...form.register('businessAddress')}
                />
                {form.formState.errors.businessAddress ? (
                  <p className="text-sm text-danger">{form.formState.errors.businessAddress.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="country">
                    Country <span className="text-danger">*</span>
                  </label>
                  <Input id="country" type="text" placeholder="India" {...form.register('country')} />
                  {form.formState.errors.country ? (
                    <p className="text-sm text-danger">{form.formState.errors.country.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="state">
                    State <span className="text-danger">*</span>
                  </label>
                  <Input id="state" type="text" placeholder="Maharashtra" {...form.register('state')} />
                  {form.formState.errors.state ? (
                    <p className="text-sm text-danger">{form.formState.errors.state.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="city">
                    City <span className="text-danger">*</span>
                  </label>
                  <Input id="city" type="text" placeholder="Mumbai" {...form.register('city')} />
                  {form.formState.errors.city ? (
                    <p className="text-sm text-danger">{form.formState.errors.city.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="pincode">
                    Pincode <span className="text-danger">*</span>
                  </label>
                  <Input id="pincode" type="text" placeholder="400001" {...form.register('pincode')} />
                  {form.formState.errors.pincode ? (
                    <p className="text-sm text-danger">{form.formState.errors.pincode.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" size="lg" onClick={onPrevious}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>

                <Button type="submit" size="lg" disabled={addressMutation.isPending}>
                  {addressMutation.isPending ? 'Saving...' : 'Finish setup'}
                  {addressMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard title="Final step" description="Saving this completes onboarding and opens the dashboard.">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                When you finish this step, Trimorg marks the workspace as ready and sends you to the dashboard.
              </p>
              <div className="space-y-3">
                {[
                  'Business details are saved first.',
                  'Address details complete the current onboarding flow.',
                  'After save, your session refreshes and the dashboard opens automatically.',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[16px] border border-border/80 bg-surface-secondary/40 px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      2
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
