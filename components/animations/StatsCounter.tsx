'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type StatsCounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export function StatsCounter({ value, decimals = 0, prefix = '', suffix = '' }: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setCurrent(value);
      return;
    }

    const counter = { count: 0 };
    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0.5, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true
          }
        }
      );

      gsap.to(counter, {
        count: value,
        duration: 1.45,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true
        },
        onUpdate() {
          setCurrent(counter.count);
        }
      });
    });

    return () => context.revert();
  }, [decimals, prefix, suffix, value]);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(current);

  return <span ref={ref}>{`${prefix}${formatted}${suffix}`}</span>;
}
