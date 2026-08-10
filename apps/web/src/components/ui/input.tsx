import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          'flex h-11 w-full rounded-lg border border-field-border bg-field-background px-4 text-sm text-foreground shadow-[var(--shadow-raised)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-field-placeholder focus-visible:border-primary focus-visible:bg-surface focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
