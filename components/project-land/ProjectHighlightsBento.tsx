'use client';

import { useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { BadgeCheck, Gem, MapPinned, Sparkles } from 'lucide-react';

import { SplitRevealHeading } from '@/components/project-land/SplitRevealHeading';
import type { ProjectLandingMediaItem } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type Highlight = { description: string; title: string };
type GalleryImage = { alt: string; src: string };

function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { damping: 22, stiffness: 180 });
  const springY = useSpring(pointerY, { damping: 22, stiffness: 180 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] will-change-transform', className)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
    >
      {children}
    </motion.div>
  );
}

export function ProjectHighlightsBento({
  galleryImages,
  highlights,
  isArabic,
  media,
}: {
  galleryImages: GalleryImage[];
  highlights: Highlight[];
  isArabic: boolean;
  media: ProjectLandingMediaItem[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const images = useMemo(() => (galleryImages.length > 0 ? galleryImages : [{ alt: 'Project image', src: '/logo.webp' }]), [galleryImages]);
  const icons = [Gem, MapPinned, Sparkles, BadgeCheck];
  const items = useMemo(
    () =>
      (highlights.length > 0
        ? highlights
        : isArabic
          ? [
              { description: 'قيمة المشروع تظهر في التفاصيل التي تخدم القرار اليومي والاستثماري.', title: 'قيمة قابلة للقراءة' },
              { description: 'تجربة موحدة تجمع الموقع، المنتج، ونمط الحياة في سرد واضح.', title: 'تجربة متكاملة' },
            ]
          : [
              { description: 'The project value becomes clear through details that support daily life and investment logic.', title: 'Readable Value' },
              { description: 'A unified experience connects location, product, and lifestyle in one clear story.', title: 'Integrated Experience' },
            ]
      )
        .slice(0, 4)
        .map((item, index) => ({
          ...item,
          image: media[index]?.image_url || images[index % images.length].src,
          video: media[index]?.video_url,
        })),
    [highlights, images, isArabic, media]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24">
      <div className={cn('mb-8 max-w-3xl', isArabic ? 'mr-auto text-right' : 'text-left')}>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold md:text-xs md:tracking-[0.34em]">
          {isArabic ? 'نقاط قوة تفاعلية' : 'Interactive Highlights'}
        </p>
        <SplitRevealHeading dir={isArabic ? 'rtl' : 'ltr'} className="mt-3 text-2xl sm:text-3xl md:text-5xl leading-tight">
          {isArabic ? 'ما يجعل المشروع أعلى من المقارنة السريعة' : 'What Lifts The Project Beyond Quick Comparison'}
        </SplitRevealHeading>
      </div>

      <div className="grid auto-rows-[220px] md:auto-rows-[260px] gap-4 md:gap-5 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <TiltCard
              key={`${item.title}-${index}`}
              className={cn(index === 0 ? 'lg:col-span-2 lg:row-span-2' : '', index === 3 ? 'lg:col-span-2' : '')}
            >
              <div
                className="absolute inset-0"
                data-cursor={item.video ? 'Play' : undefined}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-70" />
                {item.video && hoveredIndex === index ? (
                  <video className="absolute inset-0 h-full w-full object-cover opacity-80" autoPlay muted loop playsInline src={item.video} />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/28 to-transparent" />
              </div>
              <div className={cn('relative z-10 flex h-full flex-col justify-end p-5 md:p-6', isArabic ? 'text-right' : 'text-left')}>
                <div className={cn('mb-auto flex', isArabic ? 'justify-end' : 'justify-start')}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/12 text-gold backdrop-blur-md md:h-12 md:w-12">
                    <Icon className="h-4.5 w-4.5 md:h-5 md:w-5" />
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-lg font-bold text-white md:mt-3 md:text-2xl">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-white/68 md:mt-3 md:text-sm md:leading-7">{item.description}</p>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
