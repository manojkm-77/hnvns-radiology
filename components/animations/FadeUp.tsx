'use client';

import { useEffect, useRef, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type FadeUpProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function FadeUp({ as = 'div', id, className, children, delay = 0, y = 40, once = true }: FadeUpProps) {
  const ref = useRef<HTMLElement>(null);
  const Component = as;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(element, { autoAlpha: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once
          }
        }
      );
    });

    return () => context.revert();
  }, [delay, once, y]);

  return (
    <Component id={id} ref={ref as any} className={cn(className)}>
      {children}
    </Component>
  );
}
