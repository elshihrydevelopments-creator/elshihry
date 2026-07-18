'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useLanguage } from '@/components/LanguageProvider';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function HorizontalScroll() {
  const { copy, locale } = useLanguage();
  const itemCount = copy.lifestyle.items.length;
  const isArabic = locale === 'ar';
  const uploadedLifestyleImages = copy.lifestyle.images ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Detect responsive screen size to adjust visible cards
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let nextVisibleCount = 3;
      if (w < 768) {
        nextVisibleCount = 2; // Mobile: 2 cards
      } else {
        nextVisibleCount = 3; // Tablet & Desktop: 3 cards
      }
      setVisibleCount(nextVisibleCount);
      const nextMaxIndex = Math.max(0, itemCount - nextVisibleCount);
      setCurrentIndex((prev) => Math.min(prev, nextMaxIndex));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemCount]);

  const maxIndex = Math.max(0, itemCount - visibleCount);

  // Autoplay logic: slides left/right every 5 seconds
  useEffect(() => {
    if (maxIndex === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section dir="ltr" className="relative h-screen w-full overflow-hidden bg-rich-black py-20 flex flex-col justify-center">
      {/* Dynamic Localized Header */}
      <div className={cn('absolute top-20 z-10', isArabic ? 'right-6 text-right md:right-12' : 'left-6 text-left md:left-12')}>
        <ScrollRevealHeading
          as="h2"
          localeKey={`lifestyle-heading-${locale}`}
          className={cn(
            'text-4xl font-bold tracking-tighter md:text-6xl',
            isArabic ? 'leading-[1.2]' : 'uppercase'
          )}
          lines={[
            <span key="lifestyle-line" dir={isArabic ? 'rtl' : 'ltr'} className="block">
              {copy.lifestyle.titleFirst} <span className="text-gradient-gold">{copy.lifestyle.titleSecond}</span>
            </span>,
          ]}
        />
      </div>

      {/* Slider Viewport Container */}
      <div 
        className="relative w-full overflow-hidden px-4 md:px-12 mt-16 group/slider"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glassy Floating Nav Buttons */}
        {itemCount > 0 && (
          <>
            <button
              onClick={handlePrev}
              disabled={maxIndex === 0}
              className="absolute left-6 md:left-14 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white transition-all duration-300 hover:border-gold/50 hover:bg-white/15 active:scale-95 shadow-lg disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={maxIndex === 0}
              className="absolute right-6 md:right-14 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white transition-all duration-300 hover:border-gold/50 hover:bg-white/15 active:scale-95 shadow-lg disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Animated Sliding Track */}
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="flex w-full"
          >
            {copy.lifestyle.items.map((item, index) => {
              const imageSource =
                uploadedLifestyleImages[index] ||
                siteImages.lifestyle[index % siteImages.lifestyle.length];

              return (
                <div
                  key={`${locale}-${index}`}
                  className={cn(
                    "shrink-0 px-2 sm:px-3 md:px-4",
                    visibleCount === 2 ? "w-1/2" : visibleCount === 3 ? "w-1/3" : "w-1/4"
                  )}
                >
                  <div className="group relative h-[50vh] w-full overflow-hidden rounded-[2rem] border border-white/5 shadow-xl bg-rich-black-light">
                    <Image
                      src={imageSource}
                      alt={item}
                      fill
                      priority={index <= 2}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
                    
                    <LocaleReveal
                      localeKey={`lifestyle-card-${locale}-${index}`}
                      className={cn('absolute bottom-6 z-10 w-full px-4', isArabic ? 'right-0 text-right' : 'left-0 text-left')}
                    >
                      <ScrollRevealHeading
                        as="h3"
                        localeKey={`lifestyle-card-title-${locale}-${index}`}
                        start="top 95%"
                        className={cn(
                          'text-xl font-bold text-white md:text-2xl',
                          isArabic ? 'leading-[1.35]' : 'tracking-wide uppercase'
                        )}
                        lines={[
                          <span key={`item-${index}`} dir={isArabic ? 'rtl' : 'ltr'} className="block">
                            {item}
                          </span>
                        ]}
                      />
                    </LocaleReveal>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
