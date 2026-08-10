import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { useMutation, type UseQueryResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const { logoutUser } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const defaultValues = useMemo<AddressStepValues>(
    () => ({
      addressLine1: statusQuery.data?.organization?.addressLine1 ?? '',
      addressLine2: statusQuery.data?.organization?.addressLine2 ?? '',
      country: statusQuery.data?.organization?.country ?? '',
      state: statusQuery.data?.organization?.state ?? '',
      city: statusQuery.data?.organization?.city ?? '',
      postalCode: statusQuery.data?.organization?.postalCode ?? '',
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
          description="Capture the address details for this workspace."
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
                <label className="text-sm font-medium text-foreground" htmlFor="address-line-1">
                  Address Line 1 <span className="text-danger">*</span>
                </label>
                <Input
                  id="address-line-1"
                  type="text"
                  placeholder="Street address, area, landmark"
                  {...form.register('addressLine1')}
                />
                {form.formState.errors.addressLine1 ? (
                  <p className="text-sm text-danger">{form.formState.errors.addressLine1.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="address-line-2">
                  Address Line 2
                </label>
                <Input
                  id="address-line-2"
                  type="text"
                  placeholder="Apartment, suite, floor, building"
                  {...form.register('addressLine2')}
                />
                {form.formState.errors.addressLine2 ? (
                  <p className="text-sm text-danger">{form.formState.errors.addressLine2.message}</p>
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
                  <Input id="pincode" type="text" placeholder="400001" {...form.register('postalCode')} />
                  {form.formState.errors.postalCode ? (
                    <p className="text-sm text-danger">{form.formState.errors.postalCode.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" size="lg" onClick={onPrevious}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Previous
                </Button>

                <Button type="submit" size="lg" disabled={addressMutation.isPending}>
                  {addressMutation.isPending ? 'Saving...' : 'Next'}
                  {addressMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard title="Step 2 details" description="Address values stay available after refresh.">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Step 2 stores only the address fields and keeps them ready for later onboarding steps.
              </p>
              <div className="space-y-3">
                {[
                  'Address Line 1 and Address Line 2 are saved separately.',
                  'Country, state, city, and pincode persist on the organization record.',
                  'Previous keeps the business details from Step 1 intact.',
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
