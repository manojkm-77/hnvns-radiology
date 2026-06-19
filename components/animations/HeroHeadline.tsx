'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const lines = [
  'Radiology intelligence',
  'for faster, clearer',
  'clinical decisions'
];

export function HeroHeadline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>('[data-word]');
    if (!words?.length) return;

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
  }, []);

  return (
    <div ref={ref} className="space-y-2" aria-label="Radiology intelligence for faster, clearer clinical decisions">
      {lines.map((line, lineIndex) => (
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
    </div>
  );
}
