import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { categoryFormSchema } from '@/features/categories/categories.schemas';
import type { CategoryFormValues } from '@/features/categories/categories.types';

interface CategoriesDrawerProps {
  open: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

const DEFAULT_VALUES: CategoryFormValues = {
  name: '',
};

export function CategoriesDrawer({
  open,
  isSaving,
  errorMessage,
  onOpenChange,
  onSubmit,
}: CategoriesDrawerProps): ReactElement {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(DEFAULT_VALUES);
    }
  }, [form, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-none sm:w-[480px] sm:max-w-[480px]">
        <form
          className="flex h-full flex-col"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <SheetHeader className="border-b border-border px-6 pb-6 pt-6">
            <SheetTitle>Create Category</SheetTitle>
            <SheetDescription>Add a category to organize products.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {errorMessage ? (
              <div className="rounded-[16px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="category-name">
                Category Name <span className="text-danger">*</span>
              </label>
              <Input
                id="category-name"
                type="text"
                placeholder="Biscuits"
                {...form.register('name')}
              />
              {form.formState.errors.name ? (
                <p className="text-sm text-danger">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-surface px-6 py-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
