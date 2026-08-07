import { PageContainer } from '@/shell/page-container';

export function NotFoundPage() {
  return (
    <PageContainer width="constrained">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </PageContainer>
  );
}
