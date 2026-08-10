import type { ReactElement } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps): ReactElement {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}
