import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { PageContainer } from '@/shell/page-container';
import { ApiRequestError } from '@/lib/api';
import { AccountToast } from '@/features/account/account-toast';
import { changePassword } from '@/features/account/account.api';
import { changePasswordSchema, type ChangePasswordValues } from '@/features/account/account.schemas';

const TOAST_TIMEOUT_MS = 2800;

interface PasswordFieldProps {
  id: string;
  label: string;
  visible: boolean;
  onToggleVisible: () => void;
  register: UseFormRegisterReturn;
  error?: string;
}

function PasswordField({
  id,
  label,
  visible,
  onToggleVisible,
  register,
  error,
}: PasswordFieldProps): ReactElement {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Input id={id} type={visible ? 'text' : 'password'} className="pr-24" {...register} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-1 my-auto h-8 gap-2 px-3 text-muted-foreground"
          onClick={onToggleVisible}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          {visible ? 'Hide' : 'Show'}
        </Button>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

export function ChangePasswordPage(): ReactElement {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [visibility, setVisibility] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      form.reset();
      setToastMessage('Password updated successfully.');
    },
    onError: (error: unknown) => {
      if (error instanceof ApiRequestError && error.code === 'InvalidCurrentPassword') {
        form.setError('currentPassword', { message: error.message });
        return;
      }

      form.setError('root', {
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setToastMessage(null), TOAST_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  return (
    <PageContainer width="constrained">
      <div className="flex flex-col gap-6">
        {toastMessage ? <AccountToast message={toastMessage} /> : null}

        <PageHeader
          eyebrow="Account"
          title="Change Password"
          description="Choose a strong password you don't use anywhere else."
        />

        <SectionCard
          title="Update password"
          description="You'll stay signed in here; other devices will need to sign in again."
        >
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(async (values) => {
              await changePasswordMutation.mutateAsync(values);
            })}
          >
            {form.formState.errors.root ? (
              <div className="flex items-center gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                <KeyRound className="h-4 w-4 shrink-0" aria-hidden="true" />
                <p>{form.formState.errors.root.message}</p>
              </div>
            ) : null}

            <PasswordField
              id="current-password"
              label="Current Password"
              visible={visibility.current}
              onToggleVisible={() =>
                setVisibility((current) => ({ ...current, current: !current.current }))
              }
              register={form.register('currentPassword')}
              error={form.formState.errors.currentPassword?.message}
            />

            <PasswordField
              id="new-password"
              label="New Password"
              visible={visibility.next}
              onToggleVisible={() =>
                setVisibility((current) => ({ ...current, next: !current.next }))
              }
              register={form.register('newPassword')}
              error={form.formState.errors.newPassword?.message}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm Password"
              visible={visibility.confirm}
              onToggleVisible={() =>
                setVisibility((current) => ({ ...current, confirm: !current.confirm }))
              }
              register={form.register('confirmPassword')}
              error={form.formState.errors.confirmPassword?.message}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                {changePasswordMutation.isPending ? (
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
