import type { ChangeEvent, ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Building2, ImageUp, Loader2, RefreshCw, TriangleAlert } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { PageContainer } from '@/shell/page-container';
import { AccountToast } from '@/features/account/account-toast';
import {
  fetchOrganizationProfile,
  updateOrganizationProfile,
} from '@/features/account/account.api';
import {
  businessSettingsSchema,
  type BusinessSettingsValues,
} from '@/features/account/account.schemas';
import { businessTypeOptions } from '@/features/onboarding/onboarding.schemas';

const ORGANIZATION_QUERY_KEY = ['account', 'organization'] as const;
const TOAST_TIMEOUT_MS = 2800;

// Mirrors the currency list already used in onboarding's preferences step.
const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
] as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export function BusinessSettingsPage(): ReactElement {
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const organizationQuery = useQuery({
    queryKey: ORGANIZATION_QUERY_KEY,
    queryFn: fetchOrganizationProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const defaultValues = useMemo<BusinessSettingsValues>(
    () => ({
      businessName: organizationQuery.data?.businessName ?? '',
      businessType: organizationQuery.data?.businessType ?? '',
      gst: organizationQuery.data?.gst ?? '',
      addressLine1: organizationQuery.data?.addressLine1 ?? '',
      addressLine2: organizationQuery.data?.addressLine2 ?? '',
      city: organizationQuery.data?.city ?? '',
      state: organizationQuery.data?.state ?? '',
      postalCode: organizationQuery.data?.postalCode ?? '',
      country: organizationQuery.data?.country ?? '',
      currencyCode: organizationQuery.data?.currencyCode ?? 'INR',
      timezone: organizationQuery.data?.timezone ?? 'Asia/Kolkata',
      logoDataUrl: '',
      logoFileName: organizationQuery.data?.logoFileName ?? '',
      logoMimeType: organizationQuery.data?.logoMimeType ?? '',
    }),
    [organizationQuery.data],
  );

  const form = useForm<BusinessSettingsValues>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    setLogoPreview(organizationQuery.data?.logoUrl ?? null);
  }, [defaultValues, form, organizationQuery.data?.logoUrl]);

  const updateMutation = useMutation({
    mutationFn: updateOrganizationProfile,
    onSuccess: async (organization) => {
      queryClient.setQueryData(ORGANIZATION_QUERY_KEY, organization);
      setToastMessage('Business settings updated successfully.');
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(null), TOAST_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      form.setValue('logoDataUrl', dataUrl, { shouldDirty: true });
      form.setValue('logoFileName', file.name, { shouldDirty: true });
      form.setValue('logoMimeType', file.type, { shouldDirty: true });
      setLogoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (organizationQuery.isLoading) {
    return (
      <PageContainer width="constrained">
        <div className="space-y-4">
          <div className="h-8 w-56 animate-pulse rounded-full bg-muted" />
          <div className="h-96 w-full animate-pulse rounded-lg bg-muted/70" />
        </div>
      </PageContainer>
    );
  }

  if (organizationQuery.isError) {
    return (
      <PageContainer width="constrained">
        <SectionCard
          title="Unable to load business settings"
          description={getErrorMessage(organizationQuery.error)}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void organizationQuery.refetch()}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          }
        >
          <div className="flex items-center gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
            <p>We could not load your business settings right now.</p>
          </div>
        </SectionCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="constrained">
      <div className="flex flex-col gap-6">
        {toastMessage ? <AccountToast message={toastMessage} /> : null}

        <PageHeader
          eyebrow="Account"
          title="Business Settings"
          description="Manage your organization's identity, address, and regional preferences."
        />

        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(async (values) => {
            await updateMutation.mutateAsync(values);
          })}
        >
          <SectionCard
            title="Business identity"
            description="How your business is identified across Trimorg."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="business-name">
                  Business Name
                </label>
                <div className="relative">
                  <Building2
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="business-name"
                    type="text"
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
                  Business Type
                </label>
                <select
                  id="business-type"
                  className="flex h-11 w-full rounded-lg border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="gst">
                  GST
                </label>
                <Input id="gst" type="text" placeholder="Optional" {...form.register('gst')} />
                {form.formState.errors.gst ? (
                  <p className="text-sm text-danger">{form.formState.errors.gst.message}</p>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-foreground">Logo</span>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-secondary">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Business logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageUp className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                    <ImageUp className="h-4 w-4" aria-hidden="true" />
                    Upload logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Placeholder upload — stored with your organization record.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Address" description="Used on invoices and official documents.">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="address-line-1">
                  Address Line 1
                </label>
                <Input id="address-line-1" type="text" {...form.register('addressLine1')} />
                {form.formState.errors.addressLine1 ? (
                  <p className="text-sm text-danger">
                    {form.formState.errors.addressLine1.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="address-line-2">
                  Address Line 2
                </label>
                <Input
                  id="address-line-2"
                  type="text"
                  placeholder="Optional"
                  {...form.register('addressLine2')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="city">
                  City
                </label>
                <Input id="city" type="text" {...form.register('city')} />
                {form.formState.errors.city ? (
                  <p className="text-sm text-danger">{form.formState.errors.city.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="state">
                  State
                </label>
                <Input id="state" type="text" {...form.register('state')} />
                {form.formState.errors.state ? (
                  <p className="text-sm text-danger">{form.formState.errors.state.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="postal-code">
                  Pincode
                </label>
                <Input id="postal-code" type="text" {...form.register('postalCode')} />
                {form.formState.errors.postalCode ? (
                  <p className="text-sm text-danger">{form.formState.errors.postalCode.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="country">
                  Country
                </label>
                <Input id="country" type="text" {...form.register('country')} />
                {form.formState.errors.country ? (
                  <p className="text-sm text-danger">{form.formState.errors.country.message}</p>
                ) : null}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Regional preferences"
            description="Applied across invoices, reports, and dates."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  className="flex h-11 w-full rounded-lg border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
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
                  Timezone
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
            </div>
          </SectionCard>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset(defaultValues);
                setLogoPreview(organizationQuery.data?.logoUrl ?? null);
              }}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
