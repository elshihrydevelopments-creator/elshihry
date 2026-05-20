'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

import { MagneticButton } from '@/components/project-land/MagneticButton';
import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { LandingPanoramicAuraSection, ProjectLandingMediaItem } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type GalleryImage = { alt: string; src: string };

export function ProjectPanoramicAura({
  dayMedia,
  galleryImages,
  isArabic,
  nightMedia,
  section,
}: {
  dayMedia: ProjectLandingMediaItem[];
  galleryImages: GalleryImage[];
  isArabic: boolean;
  nightMedia: ProjectLandingMediaItem[];
  section: LandingPanoramicAuraSection;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const fallback = galleryImages[0] || { alt: 'Project panoramic view', src: '/logo.webp' };

  // Background = day exterior (or first gallery image)
  const bgImage = dayMedia[0]?.image_url || fallback.src;
  // Foreground depth layer = night exterior (creates parallax depth)
  const fgImage = nightMedia[0]?.image_url || galleryImages[1]?.src || fallback.src;

  // ── Mouse-follow parallax ──────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 32, stiffness: 70 });
  const springY = useSpring(mouseY, { damping: 32, stiffness: 70 });

  // Background drifts slowly (shallow depth)
  const bgX = useTransform(springX, [-1, 1], ['-2%', '2%']);
  const bgY = useTransform(springY, [-1, 1], ['-2%', '2%']);

  // Foreground moves more (deeper plane)
  const fgX = useTransform(springX, [-1, 1], ['-5%', '5%']);
  const fgY = useTransform(springY, [-1, 1], ['-5%', '5%']);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // ── Scroll-triggered clip-path reveal (cinematic box opens) ───────────────
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Section slides open from a tight inset
      gsap.fromTo(
        sectionRef.current,
        { clipPath: 'inset(6% 5% 6% 5% round 2.4rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0rem)',
          ease: 'power2.inOut',
          scrollTrigger: {
            end: 'top 25%',
            scrub: 1.4,
            start: 'top 88%',
            trigger: sectionRef.current,
          },
        }
      );

      // Staggered text reveal
      const textEls = sectionRef.current.querySelectorAll('[data-aura-text]');

      gsap.fromTo(
        textEls,
        { opacity: 0, y: 44 },
        {
          duration: 1,
          ease: 'power3.out',
          opacity: 1,
          stagger: 0.14,
          y: 0,
          scrollTrigger: {
            start: 'top 65%',
            trigger: sectionRef.current,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] md:min-h-[92vh] overflow-hidden"
      data-cursor={isArabic ? 'استكشف' : 'Explore'}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* ── Layer 1: slow background ──────────────────────────────────────── */}
      <motion.div
        className="absolute inset-[-6%] will-change-transform"
        style={{ x: bgX, y: bgY }}
      >
        <Image
          alt={dayMedia[0]?.title || 'Project panoramic view'}
          className="object-cover"
          fill
          priority={false}
          sizes="100vw"
          src={bgImage}
        />
      </motion.div>

      {/* ── Layer 2: fast foreground depth overlay ────────────────────────── */}
      <motion.div
        className="absolute inset-[-6%] will-change-transform opacity-35 mix-blend-overlay"
        style={{ x: fgX, y: fgY }}
      >
        <Image
          alt="Depth layer"
          className="object-cover"
          fill
          priority={false}
          sizes="100vw"
          src={fgImage}
        />
      </motion.div>

      {/* ── Cinematic overlays ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.54),rgba(10,10,11,0.14)_42%,rgba(10,10,11,0.76))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,rgba(10,10,11,0.55))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(241,213,130,0.09),transparent_52%)]" />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-[70vh] md:min-h-[92vh] items-center py-12 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
          <div className={cn('max-w-2xl', isArabic ? 'mr-auto text-right' : 'text-left')}>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold md:text-xs md:tracking-[0.4em]">
              {section.eyebrow || (isArabic ? 'الأجواء البانورامية' : 'The Panoramic Aura')}
            </p>

            <div data-aura-text="">
              <SplitRevealHeading
                dir={isArabic ? 'rtl' : 'ltr'}
                className="mt-3 text-3xl leading-tight md:text-6xl xl:text-7xl"
              >
                {section.title || (isArabic ? 'الموقع يعيد تعريف التوقعات' : 'The Location Redefines Expectations')}
              </SplitRevealHeading>
            </div>

            <p data-aura-text="" className="mt-4 max-w-xl text-xs leading-6 text-white/58 md:mt-7 md:text-base md:leading-9">
              {section.description || (isArabic
                ? 'إطلالة لا تُشترى بالمتر. أجواء تُقاس بالتجربة الأولى عند الوصول.'
                : 'A view not measured in square meters. An atmosphere felt on first arrival.')}
            </p>

            {/* ── Metrics strip ─────────────────────────────────────────────── */}
            <div
              data-aura-text=""
              className={cn(
                'mt-6 inline-flex overflow-hidden rounded-xl border border-white/12 bg-rich-black/38 backdrop-blur-xl md:mt-10 md:rounded-2xl',
                isArabic ? 'flex-row-reverse' : ''
              )}
            >
              {(section.metrics.length > 0 ? section.metrics : (isArabic
                ? [
                    { label: 'الموقع', value: 'الشيخ زايد' },
                    { label: 'الطابع', value: 'حصري' },
                    { label: 'المشهد', value: '٣٦٠°' },
                  ]
                : [
                    { label: 'Location', value: 'Sheikh Zayed' },
                    { label: 'Character', value: 'Exclusive' },
                    { label: 'Panorama', value: '360°' },
                  ]
              )).map((item, i, arr) => (
                <div
                  key={i}
                  className={cn(
                    'px-4 py-3 text-center md:px-7 md:py-5',
                    i < arr.length - 1 ? 'border-r border-white/10' : ''
                  )}
                >
                  <p className="text-[8px] font-bold uppercase tracking-[0.24em] text-white/38 md:text-[9px] md:tracking-[0.32em]">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-gold md:mt-2 md:text-base">{item.value}</p>
                </div>
              ))}
            </div>

            <div data-aura-text="" className={cn('mt-6 flex gap-4 md:mt-8', isArabic ? 'flex-row-reverse justify-end' : '')}>
              <MagneticButton
                href="#lead-form"
                className="inline-flex items-center gap-2.5 rounded-full bg-gold px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-rich-black hover:bg-white md:px-6 md:py-4 md:text-sm md:tracking-[0.22em] md:gap-3"
              >
                {section.ctaLabel || (isArabic ? 'تواصل مع المستشار' : 'Speak With An Advisor')}
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
