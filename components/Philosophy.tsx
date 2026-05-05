'use client';

import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

import { useLanguage } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';

function RevealWord({
  index,
  progress,
  total,
  word,
}: {
  index: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  total: number;
  word: string;
}) {
  const revealSpan = 0.68;
  const start = (index / total) * revealSpan;
  const end = Math.min(start + 0.18, 1);

  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const blur = useTransform(progress, [start, end], [7, 0]);
  const y = useTransform(progress, [start, end], [12, 0]);
  const color = useTransform(progress, [start, end], ['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.98)']);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.span
      style={{ opacity, y, filter, color }}
      className="inline-block will-change-transform"
    >
      {word}
    </motion.span>
  );
}

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';
  const words = copy.philosophy.text.split(' ').filter(Boolean);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'end 52%'],
  });

  return (
    <section
      id="vision"
      ref={sectionRef}
      className="relative mx-auto min-h-[72vh] max-w-[1400px] px-6 md:min-h-[155vh] md:px-12"
    >
      <div className="flex min-h-[72vh] items-center justify-center py-8 md:sticky md:top-0 md:min-h-screen md:py-24">
        <div className="absolute inset-x-8 top-1/2 h-48 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative max-w-6xl">
          <div className={cn('mb-8 flex items-center justify-center gap-4', isArabic ? 'flex-row-reverse' : '')}>
            <span className="text-[10px] font-semibold tracking-[0.4em] text-gold/70 uppercase">
              {isArabic ? 'الرؤية' : 'Philosophy'}
            </span>
            <span className="h-px w-20 bg-gold/25" />
          </div>

          <h2
            dir={isArabic ? 'rtl' : 'ltr'}
            className={cn(
              'flex flex-wrap justify-center gap-x-3 gap-y-4 text-center text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl',
              isArabic ? 'leading-[1.8]' : 'uppercase leading-[1.25]'
            )}
          >
            {words.map((word, index) => (
              <RevealWord
                key={`${word}-${index}`}
                index={index}
                progress={scrollYProgress}
                total={words.length}
                word={word}
              />
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
