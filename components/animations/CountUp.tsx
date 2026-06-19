'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type CountUpProps = {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

export function CountUp({ target, suffix = '', prefix = '', decimals = 0, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setCurrent(target);
      return;
    }

    const counter = { value: 0 };
    let removeTicker: (() => void) | null = null;

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        once: true,
        onEnter() {
          if (removeTicker) return;

          const startTime = gsap.ticker.time;

          const tick = () => {
            const progress = Math.min((gsap.ticker.time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.value = target * eased;
            setCurrent(Number(counter.value.toFixed(decimals)));

            if (progress >= 1 && removeTicker) {
              removeTicker();
              removeTicker = null;
            }
          };

          removeTicker = () => gsap.ticker.remove(tick);
          gsap.ticker.add(tick);
          tick();
        }
      });
    });

    return () => {
      if (removeTicker) removeTicker();
      context.revert();
    };
  }, [decimals, duration, prefix, suffix, target]);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(current);

  return <span ref={ref} className={cn(className)}>{`${prefix}${formatted}${suffix}`}</span>;
}
