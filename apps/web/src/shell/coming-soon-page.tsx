import { PageContainer } from '@/shell/page-container';

interface ComingSoonPageProps {
  title: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <PageContainer width="constrained">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-muted-foreground">This module is currently under development.</p>
        <p className="text-muted-foreground">It will be available in an upcoming sprint.</p>
      </div>
    </PageContainer>
  );
}
