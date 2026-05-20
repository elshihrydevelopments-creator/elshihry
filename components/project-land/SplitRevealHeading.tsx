'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { cn } from '@/lib/utils';

export function SplitRevealHeading({
  children,
  className,
  dir,
}: {
  children: string;
  className?: string;
  dir?: 'rtl' | 'ltr';
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shouldUseWordSplit = dir === 'rtl' || /[\u0600-\u06ff]/.test(children);
  const splitItems = shouldUseWordSplit ? children.split(/(\s+)/) : Array.from(children);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const spans = ref.current?.querySelectorAll('[data-split-token]');

      if (!spans?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.fromTo(
        spans,
        { opacity: 0, yPercent: 80 },
        {
          duration: 0.8,
          ease: 'power3.out',
          opacity: 1,
          stagger: 0.012,
          scrollTrigger: {
            start: 'top 82%',
            trigger: ref.current,
          },
          yPercent: 0,
        }
      );
    },
    { scope: ref }
  );

  return (
    <h2
      ref={ref}
      aria-label={children}
      className={cn('text-4xl font-bold text-white md:text-5xl', shouldUseWordSplit ? 'tracking-normal' : 'tracking-tight', className)}
      dir={dir}
    >
      {splitItems.map((item, index) => {
        if (shouldUseWordSplit && /^\s+$/.test(item)) {
          return <span aria-hidden="true" key={`space-${index}`}> </span>;
        }

        const isSpace = item === ' ';

        return (
          <span
            aria-hidden="true"
            className={isSpace ? 'inline-block w-[0.32em]' : 'inline-block will-change-transform'}
            data-split-token=""
            key={`${item}-${index}`}
          >
            {isSpace ? '\u00a0' : item}
          </span>
        );
      })}
    </h2>
  );
}
