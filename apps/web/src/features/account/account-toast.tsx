import type { ReactElement } from 'react';

interface AccountToastProps {
  message: string;
}

export function AccountToast({ message }: AccountToastProps): ReactElement {
  return (
    <div className="fixed right-4 top-4 z-50 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-overlay)]">
      {message}
    </div>
  );
}
