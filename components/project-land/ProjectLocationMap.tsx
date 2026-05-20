'use client';

import Image from 'next/image';
import { MapPin, ArrowUpRight } from 'lucide-react';

import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { LandingLocationMapSection } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type GalleryImage = {
  alt: string;
  src: string;
};

export function ProjectLocationMap({
  galleryImages,
  isArabic,
  section,
}: {
  galleryImages: GalleryImage[];
  isArabic: boolean;
  section: LandingLocationMapSection;
}) {
  const fallbackImage = galleryImages[0] || { alt: section.cardTitle || 'Project location', src: '/logo.webp' };
  const mapImage = section.mapImageUrl || fallbackImage.src;
  const cardImage = section.cardImageUrl || fallbackImage.src;
  const cardTitle = section.cardTitle || section.title;
  const points = section.points.length > 0 ? section.points.slice(0, 3) : isArabic ? ['قريب من المحاور الرئيسية', 'موقع يسهل الوصول إليه', 'منطقة واعدة للنمو'] : ['Close to main roads', 'Easy access location', 'Promising growth area'];

  const inner = (
    <div className="relative min-h-[500px] md:min-h-[660px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-rich-black md:rounded-[2.4rem]">
      <Image
        src={mapImage}
        alt={section.mapImageAlt || section.title}
        fill
        sizes="100vw"
        className="object-cover opacity-75 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,11,0.60),rgba(10,10,11,0.14),rgba(10,10,11,0.50))]" />
      <div className="absolute inset-0 bg-rich-black/18" />

      <div className={cn(
        'relative z-10 grid min-h-[500px] md:min-h-[660px] gap-6 p-5 md:p-10 lg:items-center',
        isArabic ? 'lg:grid-cols-[400px_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_400px]'
      )}>
        <div className={cn('self-start pt-6 text-white md:pt-14 lg:pt-16', isArabic ? 'text-right lg:order-2' : 'text-left')}>
          <p className="text-sm font-light text-white/88 md:text-xl">{section.eyebrow}</p>
          <SplitRevealHeading
            dir={isArabic ? 'rtl' : 'ltr'}
            className="mt-2 text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-white"
          >
            {section.title}
          </SplitRevealHeading>

          <div className="mt-6 md:mt-10">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-gold px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-rich-black transition hover:bg-white hover:scale-105 md:px-8 md:py-4 md:text-sm md:tracking-[0.22em] md:gap-3">
              {isArabic ? 'استكشف الموقع علي الخريطة' : 'Explore On Google Maps'}
              <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
          </div>
        </div>

        <div className={cn('self-center rounded-[1.5rem] bg-white p-5 text-[#0d2b4c] shadow-[0_28px_80px_rgba(0,0,0,0.28)] md:rounded-[2rem] md:p-8', isArabic ? 'text-right' : 'text-left')}>
          <div className={cn('mb-5 md:mb-7 flex', isArabic ? 'justify-end' : 'justify-start')}>
            <div className="relative h-20 w-20 overflow-hidden rounded-[1rem] bg-slate-100 md:h-32 md:w-32 md:rounded-[1.2rem]">
              <Image src={cardImage} alt={cardTitle} fill sizes="(max-width: 768px) 80px, 128px" className="object-cover" />
            </div>
          </div>
          <h3 className="text-xl font-light leading-tight text-[#17395e] md:text-3xl lg:text-[2.2rem]">{cardTitle}</h3>
          <div className="mt-6 space-y-4 md:mt-10 md:space-y-6">
            {points.map((point, index) => (
              <div key={`${point}-${index}`} className={cn('flex items-center gap-3 md:gap-4', isArabic ? 'flex-row-reverse' : '')}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#17395e] md:h-10 md:w-10">
                  <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </span>
                <span className="text-sm leading-6 text-[#111827] md:text-base">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-[1800px] px-3 py-12 sm:px-6 md:py-24">
      {section.mapHref ? (
        <a
          href={section.mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group block cursor-pointer"
          aria-label={isArabic ? 'فتح الموقع على خريطة جوجل' : 'Open location on Google Maps'}
        >
          {inner}
        </a>
      ) : (
        <div className="group">{inner}</div>
      )}
    </section>
  );
}
