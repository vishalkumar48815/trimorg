import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, Phone, RefreshCw, TriangleAlert, User as UserIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { PageContainer } from '@/shell/page-container';
import { AccountToast } from '@/features/account/account-toast';
import { fetchProfile, updateProfile } from '@/features/account/account.api';
import { profileSchema, type ProfileValues } from '@/features/account/account.schemas';

const PROFILE_QUERY_KEY = ['account', 'profile'] as const;
const TOAST_TIMEOUT_MS = 2800;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

export function ProfilePage(): ReactElement {
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const defaultValues = useMemo<ProfileValues>(
    () => ({
      fullName: profileQuery.data?.fullName ?? '',
      mobile: profileQuery.data?.mobile ?? '',
    }),
    [profileQuery.data],
  );

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
      setToastMessage('Profile updated successfully.');
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(null), TOAST_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  if (profileQuery.isLoading) {
    return (
      <PageContainer width="constrained">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-full bg-muted" />
          <div className="h-40 w-full animate-pulse rounded-lg bg-muted/70" />
        </div>
      </PageContainer>
    );
  }

  if (profileQuery.isError) {
    return (
      <PageContainer width="constrained">
        <SectionCard
          title="Unable to load your profile"
          description={getErrorMessage(profileQuery.error)}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void profileQuery.refetch()}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          }
        >
          <div className="flex items-center gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
            <p>We could not load your profile right now.</p>
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
          title="My Profile"
          description="Update the name and mobile number associated with your account."
        />

        <SectionCard
          title="Personal details"
          description="Your email is used to sign in and can't be changed here."
        >
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(async (values) => {
              await updateMutation.mutateAsync(values);
            })}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="profile-full-name">
                Full Name
              </label>
              <div className="relative">
                <UserIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="profile-full-name"
                  type="text"
                  className="pl-9"
                  {...form.register('fullName')}
                />
              </div>
              {form.formState.errors.fullName ? (
                <p className="text-sm text-danger">{form.formState.errors.fullName.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="profile-mobile">
                Mobile
              </label>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="profile-mobile"
                  type="tel"
                  className="pl-9"
                  {...form.register('mobile')}
                />
              </div>
              {form.formState.errors.mobile ? (
                <p className="text-sm text-danger">{form.formState.errors.mobile.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="profile-email">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="profile-email"
                  type="email"
                  className="pl-9"
                  value={profileQuery.data?.email ?? ''}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(defaultValues)}
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
        </SectionCard>
      </div>
    </PageContainer>
  );
}
