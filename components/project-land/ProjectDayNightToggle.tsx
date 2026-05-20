'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { ProjectLandingMediaItem } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type GalleryImage = { alt: string; src: string };

export function ProjectDayNightToggle({
  dayMedia,
  galleryImages,
  isArabic,
  nightMedia,
}: {
  dayMedia: ProjectLandingMediaItem[];
  galleryImages: GalleryImage[];
  isArabic: boolean;
  nightMedia: ProjectLandingMediaItem[];
}) {
  const [mode, setMode] = useState<'day' | 'night'>('day');
  const fallback = galleryImages[0] || { alt: 'Project exterior', src: '/logo.webp' };
  const dayImage = dayMedia[0]?.image_url || fallback.src;
  const nightImage = nightMedia[0]?.image_url || galleryImages[1]?.src || fallback.src;
  const title = mode === 'day' ? dayMedia[0]?.title : nightMedia[0]?.title;
  const caption = mode === 'day' ? dayMedia[0]?.caption : nightMedia[0]?.caption;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className={cn('mb-10 max-w-3xl', isArabic ? 'mr-auto text-right' : 'text-left')}>
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-gold">{isArabic ? 'من النهار إلى الليل' : 'Day To Night'}</p>
        <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="mt-4 leading-tight">
          {isArabic ? 'نفس الواجهة، حضور مختلف بعد الغروب' : 'The Same Facade With A Different Evening Presence'}
        </SplitRevealHeading>
      </div>

      <div className="relative min-h-[620px] overflow-hidden rounded-[2.4rem] border border-white/10 bg-rich-black">
        <Image src={dayImage} alt={dayMedia[0]?.title || fallback.alt} fill sizes="100vw" className="object-cover" />
        <motion.div
          animate={{ opacity: mode === 'night' ? 1 : 0 }}
          className="absolute inset-0"
          transition={{ duration: 0.75, ease: 'easeInOut' }}
        >
          <Image src={nightImage} alt={nightMedia[0]?.title || fallback.alt} fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-rich-black/82 via-rich-black/16 to-rich-black/20" />

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <div className={cn('flex flex-col gap-5 rounded-[2rem] border border-white/12 bg-rich-black/58 p-5 backdrop-blur-xl md:flex-row md:items-end md:justify-between', isArabic ? 'text-right' : 'text-left')}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">{title || (mode === 'day' ? 'Day View' : 'Night View')}</p>
              <h3 className="mt-3 max-w-2xl text-2xl font-bold text-white md:text-3xl">
                {caption || (isArabic ? 'تبديل بصري سريع يوضح حضور المشروع في أوقات مختلفة.' : 'A quick visual switch shows how the project reads across the day.')}
              </h3>
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              {[
                { icon: Sun, label: isArabic ? 'نهار' : 'Day', value: 'day' as const },
                { icon: Moon, label: isArabic ? 'ليل' : 'Night', value: 'night' as const },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.value}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition',
                      mode === item.value ? 'bg-gold text-rich-black' : 'text-white/62 hover:text-white'
                    )}
                    onClick={() => setMode(item.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
