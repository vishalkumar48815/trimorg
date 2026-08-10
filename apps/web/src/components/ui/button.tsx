import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-danger/20 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-raised)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--shadow-overlay)]',
        destructive:
          'bg-danger text-danger-foreground shadow-[var(--shadow-raised)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-overlay)]',
        outline:
          'border border-border bg-surface text-surface-foreground shadow-[var(--shadow-raised)] hover:-translate-y-0.5 hover:bg-surface-secondary hover:shadow-[var(--shadow-overlay)]',
        secondary:
          'bg-surface-secondary text-surface-foreground shadow-[var(--shadow-raised)] hover:-translate-y-0.5 hover:bg-surface-tertiary hover:shadow-[var(--shadow-overlay)]',
        ghost:
          'bg-transparent text-foreground hover:-translate-y-0.5 hover:bg-surface-secondary hover:text-foreground',
        link: '!h-auto !px-0 !py-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2.5 has-[>svg]:px-3.5',
        xs: 'h-8 gap-1 px-2.5 text-xs has-[>svg]:px-2',
        sm: 'h-9 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 px-6 has-[>svg]:px-4',
        icon: 'size-11',
        'icon-xs': 'size-8',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
