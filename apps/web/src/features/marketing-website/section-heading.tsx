import type { ReactElement } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps): ReactElement {
  return (
    <div className="max-w-3xl space-y-2.5 sm:space-y-4 mb-2 sm:mb-4">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-snug">
        {title}
      </h2>
      <p className="text-xs text-muted-foreground sm:text-base leading-relaxed">{description}</p>
    </div>
  );
}
