'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MagneticButton } from '@/components/project-land/MagneticButton';
import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { LandingMasterpieceSection, ProjectLandingMediaItem } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type GalleryImage = { alt: string; src: string };

const FALLBACK_MATERIALS_AR = [
  {
    caption: 'رخام إيطالي فاخر',
    detail: 'كاراره الأبيض بخطوط ذهبية دقيقة',
    label: 'المواد الأولية',
  },
  {
    caption: 'واجهات زجاجية عازلة',
    detail: 'زجاج مزدوج عازل للصوت والحرارة',
    label: 'الهندسة الخارجية',
  },
  {
    caption: 'خشب هندسي دافئ',
    detail: 'أرضيات هيرينغبون يدوية الصنع',
    label: 'التشطيبات الداخلية',
  },
  {
    caption: 'إضاءة معمارية مدمجة',
    detail: 'تقنية LED مخفية بلمسة مصمم',
    label: 'تصميم الإضاءة',
  },
];

const FALLBACK_MATERIALS_EN = [
  {
    caption: 'Italian Marble',
    detail: 'Carrara white with precision gold inlay',
    label: 'Primary Materials',
  },
  {
    caption: 'Acoustic Glass Facades',
    detail: 'Double-pane insulated glazing panels',
    label: 'External Architecture',
  },
  {
    caption: 'Warm Engineered Wood',
    detail: 'Handcrafted herringbone floors',
    label: 'Interior Finishes',
  },
  {
    caption: 'Integrated Architectural Lighting',
    detail: 'Concealed LED by a design studio',
    label: 'Lighting Design',
  },
];

export function ProjectMasterpieceDetails({
  galleryImages,
  isArabic,
  media,
  section,
}: {
  galleryImages: GalleryImage[];
  isArabic: boolean;
  media: ProjectLandingMediaItem[];
  section: LandingMasterpieceSection;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const fallback = isArabic ? FALLBACK_MATERIALS_AR : FALLBACK_MATERIALS_EN;
  const safeImages = galleryImages.length > 0 ? galleryImages : [{ alt: 'Project', src: '/logo.webp' }];

  const items = fallback.map((f, i) => ({
    caption: media[i]?.title || f.caption,
    detail: media[i]?.caption || f.detail,
    image: media[i]?.image_url || safeImages[i % safeImages.length].src,
    label: f.label,
  }));

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Clip-path reveal per card
      const cards = sectionRef.current.querySelectorAll('[data-masterpiece-card]');

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { clipPath: 'inset(0 100% 0 0 round 2rem)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0 round 2rem)',
            delay: i * 0.1,
            duration: 1.1,
            ease: 'power3.inOut',
            opacity: 1,
            scrollTrigger: {
              start: 'top 82%',
              trigger: card,
            },
          }
        );
      });

      // Scroll-driven zoom on inner image element
      const images = sectionRef.current.querySelectorAll('[data-masterpiece-img]');

      images.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1 },
          {
            ease: 'none',
            scale: 1.13,
            scrollTrigger: {
              end: 'bottom top',
              scrub: true,
              start: 'top bottom',
              trigger: img.closest('[data-masterpiece-card]'),
            },
          }
        );
      });

      // Section header reveal
      const header = sectionRef.current.querySelector('[data-masterpiece-header]');

      if (header) {
        gsap.fromTo(
          header.children,
          { opacity: 0, y: 30 },
          {
            duration: 0.9,
            ease: 'power3.out',
            opacity: 1,
            stagger: 0.14,
            y: 0,
            scrollTrigger: {
              start: 'top 85%',
              trigger: header,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
      {/* Section header */}
      <div
        data-masterpiece-header=""
        className={cn('mb-8 max-w-3xl md:mb-16', isArabic ? 'mr-auto text-right' : 'text-left')}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold md:text-xs md:tracking-[0.36em]">
          {section.eyebrow || (isArabic ? 'تفاصيل التحفة' : 'The Masterpiece Details')}
        </p>
        <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="mt-3 text-2xl sm:text-3xl md:text-5xl leading-tight">
          {section.title || (isArabic ? 'كل تفصيلة تحكي قرار التميز' : 'Every Detail Speaks Of Excellence')}
        </SplitRevealHeading>
        <p className={cn('mt-4 max-w-2xl text-xs leading-6 text-white/52 md:text-sm md:leading-8', isArabic ? '' : '')}>
          {section.description || (isArabic
            ? 'المواد ليست خيارات عشوائية. كل عنصر اختير بمعيار واحد: الديمومة والرُّقي.'
            : 'Materials are not arbitrary choices. Each element was selected by one standard: permanence and refinement.')}
        </p>
        <MagneticButton
          href="#lead-form"
          className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-gold px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-rich-black hover:bg-white md:mt-8 md:px-6 md:py-4 md:text-sm md:tracking-[0.22em] md:gap-3"
        >
          {section.ctaLabel || (isArabic ? 'احصل على دليل المواد والتشطيبات' : 'Get The Materials & Finishes Guide')}
        </MagneticButton>
      </div>

      {/* Cards grid — large hero card + 3 detail cards */}
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={`masterpiece-${index}`}
            data-masterpiece-card=""
            data-cursor={isArabic ? 'تفصيل' : 'Detail'}
            className={cn(
              'group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-rich-black md:rounded-[2rem]',
              index === 0 ? 'md:col-span-2 md:row-span-2 min-h-[380px] md:min-h-[520px]' : 'min-h-[220px] md:min-h-[290px]'
            )}
          >
            {/* Scroll-zoomed image layer */}
            <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
              <div data-masterpiece-img="" className="absolute inset-0 will-change-transform">
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-95"
                />
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/28 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,213,130,0.07),transparent_55%)]" />
            </div>

            {/* Text content */}
            <div
              className={cn(
                'relative z-10 flex h-full flex-col justify-end p-5 md:p-6 lg:p-7',
                isArabic ? 'text-right' : 'text-left'
              )}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold/65">{item.label}</p>
              <h3
                className={cn(
                  'mt-2 font-bold text-white md:mt-3',
                  index === 0 ? 'text-xl md:text-3xl lg:text-4xl' : 'text-base md:text-xl'
                )}
              >
                {item.caption}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-white/50 md:mt-3 md:text-sm md:leading-7">{item.detail}</p>
              {/* Gold accent */}
              <div
                className={cn(
                  'mt-4 h-px w-10 bg-gradient-to-r from-gold to-transparent md:mt-5',
                  isArabic ? 'mr-auto bg-gradient-to-l' : ''
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
