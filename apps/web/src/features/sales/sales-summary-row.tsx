import type { ReactElement } from 'react';

interface SummaryRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
  className?: string;
}

export function SummaryRow({
  label,
  value,
  emphasis = false,
  className = '',
}: SummaryRowProps): ReactElement {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        emphasis ? 'text-base font-semibold text-foreground' : 'text-sm text-muted-foreground'
      } ${className}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
