'use client';

import React, { useEffect, useRef, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type StaggerChildrenProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

export function StaggerChildren({
  as = 'div',
  id,
  className,
  children,
  delay = 0,
  stagger = 0.08,
  once = true
}: StaggerChildrenProps) {
  const ref = useRef<HTMLElement>(null);
  const Component = as;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targets = Array.from(element.querySelectorAll<HTMLElement>('[data-stagger]'));
    if (!targets.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once
          }
        }
      );
    });

    return () => context.revert();
  }, [delay, once, stagger]);

  return (
    <Component id={id} ref={ref as any} className={cn('stagger-children', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<any>, { 'data-stagger': true });
      })}
    </Component>
  );
}
