'use client';

import { FadeUp } from '@/components/animations/FadeUp';
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

type RevealSectionProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function RevealSection({ as = 'section', id, className, children, delay = 0 }: RevealSectionProps) {
  return (
    <FadeUp as={as} id={id} className={cn('reveal-section', className)} delay={delay} y={40}>
      {children}
    </FadeUp>
  );
}
