import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Plus, RefreshCw, Tags, TriangleAlert } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { SectionCard } from '@/components/ui/section-card';
import { PageContainer } from '@/shell/page-container';
import { CategoriesDrawer } from '@/features/categories/categories-drawer';
import { CategoriesSkeleton } from '@/features/categories/categories-skeleton';
import { CategoriesTable } from '@/features/categories/categories-table';
import { createCategory, fetchCategories } from '@/features/categories/categories.api';
import type { CategoryFormValues } from '@/features/categories/categories.types';

const CATEGORIES_QUERY_KEY = ['categories'] as const;
const TOAST_TIMEOUT_MS = 2800;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

function CategoriesToast({ message }: { message: string }): ReactElement {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-[16px] border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-overlay)]">
      {message}
    </div>
  );
}

function CategoriesErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): ReactElement {
  return (
    <SectionCard
      title="Unable to load categories"
      description={message}
      action={
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      }
    >
      <div className="flex items-center gap-3 rounded-[16px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
        <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p>We could not load the category list right now.</p>
      </div>
    </SectionCard>
  );
}

export function CategoriesPage(): ReactElement {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      setDrawerError(null);
      setIsDrawerOpen(false);
      setToastMessage('Category created successfully.');
    },
    onError: (error: unknown) => {
      setDrawerError(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, TOAST_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toastMessage]);

  let content: ReactElement;

  if (categoriesQuery.isLoading) {
    content = <CategoriesSkeleton />;
  } else if (categoriesQuery.isError) {
    content = (
      <CategoriesErrorState
        message={getErrorMessage(categoriesQuery.error)}
        onRetry={() => void categoriesQuery.refetch()}
      />
    );
  } else {
    const categories = categoriesQuery.data ?? [];

    content =
      categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories have been added yet."
          description="Create your first category to organize products."
          primaryAction={
            <Button
              type="button"
              onClick={() => {
                setDrawerError(null);
                setIsDrawerOpen(true);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Category
            </Button>
          }
        />
      ) : (
        <CategoriesTable categories={categories} />
      );
  }

  const handleDrawerSubmit = async (values: CategoryFormValues): Promise<void> => {
    setDrawerError(null);
    await createCategoryMutation.mutateAsync(values);
  };

  return (
    <PageContainer width="full">
      <div className="flex flex-col gap-6">
        {toastMessage ? <CategoriesToast message={toastMessage} /> : null}

        <PageHeader
          eyebrow="Categories"
          title="Categories"
          description="Organize your product catalog with clean category groups."
          actions={
            <Button
              type="button"
              onClick={() => {
                setDrawerError(null);
                setIsDrawerOpen(true);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Category
            </Button>
          }
        />

        {content}
      </div>

      <CategoriesDrawer
        open={isDrawerOpen}
        isSaving={createCategoryMutation.isPending}
        errorMessage={drawerError}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) {
            setDrawerError(null);
          }
        }}
        onSubmit={handleDrawerSubmit}
      />
    </PageContainer>
  );
}
