'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const lines = [
  'Where imaging departments',
  'find verified clinical talent.'
];

export function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>('[data-word]');
    if (!words?.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { autoAlpha: 0, y: 44, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.82,
          stagger: 0.075,
          delay: 0.2,
          ease: 'power3.out'
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={ref} className="space-y-2 text-4xl md:text-6xl font-light tracking-[-0.06em] text-text" aria-label="Where imaging departments find verified clinical talent.">
      {lines.map((line) => (
        <span key={line} className="block">
          {line.split(' ').map((word, wordIndex) => (
            <span
              key={`${line}-${wordIndex}`}
              data-word
              className="inline-block pr-[0.34em]"
            >
              {word}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
