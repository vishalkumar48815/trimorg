import type { ReactElement, ReactNode } from 'react';
import {
  Card as HeroCard,
  CardContent as HeroCardContent,
  CardDescription as HeroCardDescription,
  CardFooter as HeroCardFooter,
  CardHeader as HeroCardHeader,
  CardTitle as HeroCardTitle,
  type CardContentProps as HeroCardContentProps,
  type CardDescriptionProps as HeroCardDescriptionProps,
  type CardFooterProps as HeroCardFooterProps,
  type CardHeaderProps as HeroCardHeaderProps,
  type CardProps as HeroCardProps,
  type CardTitleProps as HeroCardTitleProps,
} from '@heroui/react';

import { cn } from '@/lib/utils';

interface CardProps extends HeroCardProps {
  children: ReactNode;
}

interface CardHeaderProps extends HeroCardHeaderProps {
  children?: ReactNode;
}

interface CardTitleProps extends HeroCardTitleProps {
  children?: ReactNode;
}

interface CardDescriptionProps extends HeroCardDescriptionProps {
  children?: ReactNode;
}

interface CardContentProps extends HeroCardContentProps {
  children?: ReactNode;
}

interface CardFooterProps extends HeroCardFooterProps {
  children?: ReactNode;
}

function Card({ className, variant = 'secondary', ...props }: CardProps): ReactElement {
  return (
    <HeroCard
      variant={variant}
      className={cn(
        'overflow-hidden rounded-[16px] border border-border bg-surface text-surface-foreground shadow-[var(--shadow-raised)]',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: CardHeaderProps): ReactElement {
  return <HeroCardHeader className={cn('flex flex-col gap-2 px-6 pt-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: CardTitleProps): ReactElement {
  return <HeroCardTitle className={cn('text-lg font-semibold tracking-tight', className)} {...props} />;
}

function CardDescription({ className, ...props }: CardDescriptionProps): ReactElement {
  return <HeroCardDescription className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }: CardContentProps): ReactElement {
  return <HeroCardContent className={cn('px-6 pb-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: CardFooterProps): ReactElement {
  return <HeroCardFooter className={cn('flex items-center gap-3 px-6 pb-6 pt-0', className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
