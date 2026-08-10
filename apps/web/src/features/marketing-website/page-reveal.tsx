import type { ReactElement, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageReveal({ children, className, delay = 0 }: PageRevealProps): ReactElement {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
