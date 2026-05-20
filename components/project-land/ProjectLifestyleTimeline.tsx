'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { LandingLifestyleTimelineSection, ProjectLandingMediaItem } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type TimelineImage = { alt: string; src: string };

export function ProjectLifestyleTimeline({
  galleryImages,
  isArabic,
  section,
}: {
  galleryImages: TimelineImage[];
  isArabic: boolean;
  section: LandingLifestyleTimelineSection;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const items = useMemo(() => {
    if (section.items && section.items.length > 0) {
      return section.items.map((item) => ({
        caption: item.caption,
        image: item.imageUrl || galleryImages[0]?.src || '/logo.webp',
        title: item.title,
      }));
    }

    return [{
      caption: isArabic ? 'يتم إضافة المحتوى قريباً...' : 'Content coming soon...',
      image: galleryImages[0]?.src || '/logo.webp',
      title: isArabic ? 'لحظة جديدة' : 'New Moment',
    }];
  }, [galleryImages, isArabic, section.items]);

  // ── Auto-advance Logic ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  function handleManualChange(index: number) {
    setActiveIndex(index);
    setIsAutoPlaying(false); // Stop auto-play on manual interaction

    // Optional: Resume after some time
    setTimeout(() => setIsAutoPlaying(true), 15000);
  }

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !pinRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const trigger = ScrollTrigger.create({
        end: () => `+=${Math.max(items.length, 2) * window.innerHeight * 0.72}`,
        onUpdate: (self) => {
          // If the user is actively scrolling, sync the index with scroll progress
          if (self.isActive) {
            const nextIndex = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            setActiveIndex(nextIndex);
            setIsAutoPlaying(false); // Pause auto-play while scrolling
          }
        },
        onLeave: () => setIsAutoPlaying(true),
        pin: pinRef.current,
        scrub: true,
        start: 'top top',
        trigger: sectionRef.current,
      });

      return () => trigger.kill();
    },
    { dependencies: [items.length], scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="landing-overview" className="relative bg-rich-black py-10 md:py-20">
      <div ref={pinRef} className="relative min-h-[90vh] md:min-h-[110vh] overflow-hidden rounded-[2rem] md:rounded-[3rem] mx-3 md:mx-8">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={cn(
              'absolute inset-0 transition duration-1000 ease-in-out will-change-transform',
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
            )}
          >
            <Image src={item.image} alt={item.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,11,0.92),rgba(10,10,11,0.48),rgba(10,10,11,0.82))]" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex min-h-[90vh] md:min-h-[110vh] max-w-7xl items-center px-4 py-16 md:px-12 md:py-32">
          <div className={cn('max-w-2xl w-full', isArabic ? 'mr-auto text-right' : 'text-left')}>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold/80 md:mb-6 md:tracking-[0.34em]">
              {section.title || (isArabic ? 'حياة يومية مختارة' : 'Life In Motion')}
            </p>
            <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="text-2xl sm:text-3xl md:text-5xl leading-tight">
              {section.description || (isArabic ? 'يوم كامل داخل التجربة، لا مجرد عنوان عقاري' : 'A Full Day Inside The Experience')}
            </SplitRevealHeading>

            <div className="mt-8 space-y-3 md:mt-14 md:space-y-4">
              {items.map((item, index) => (
                <button
                  key={`${item.title}-button-${index}`}
                  onClick={() => handleManualChange(index)}
                  className={cn(
                    'block w-full rounded-xl border px-4 py-3 text-start transition-all duration-500 md:rounded-[1.4rem] md:px-5 md:py-4',
                    isArabic ? 'text-right' : 'text-left',
                    index === activeIndex ? 'border-gold/40 bg-gold/10 text-white translate-x-2' : 'border-white/10 bg-white/[0.03] text-white/44 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">{String(index + 1).padStart(2, '0')}</span>
                    {index === activeIndex && (
                      <div className={cn('h-0.5 w-8 animate-grow-x bg-gold/50', isArabic ? 'origin-right' : 'origin-left')} />
                    )}
                  </div>
                  <span className="mt-1.5 block text-base font-semibold md:mt-2 md:text-xl">{item.title}</span>
                  <span className="mt-1.5 block text-xs leading-6 text-white/62 md:mt-2 md:text-sm md:leading-7">{item.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
