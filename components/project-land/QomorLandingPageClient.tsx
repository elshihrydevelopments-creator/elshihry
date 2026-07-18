'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, ChevronDown, Maximize2, X } from 'lucide-react';

import { LeadCaptureForm } from '@/components/project-land/LeadCaptureForm';
import { LeadCaptureModal } from '@/components/project-land/LeadCaptureModal';
import { LuxuryCursor } from '@/components/project-land/LuxuryCursor';
import { MagneticButton } from '@/components/project-land/MagneticButton';
import { ProjectHighlightsBento } from '@/components/project-land/ProjectHighlightsBento';
import { ProjectLocationMap } from '@/components/project-land/ProjectLocationMap';
import { ProjectUnitGrid } from '@/components/project-land/ProjectUnitGrid';
import { ProjectBrochureSection } from '@/components/project-land/ProjectBrochureSection';
import { useLuxuryScrollEffects } from '@/components/project-land/useLuxuryScrollEffects';
import { useLanguage } from '@/components/LanguageProvider';
import { FacebookPixel } from '@/components/project-land/FacebookPixel';
import type { ProjectLandingAggregate } from '@/lib/project-landings/types';
import { cn } from '@/lib/utils';

type ShowcaseImage = {
  alt: string;
  src: string;
};

// Default high-quality visual fallbacks
const FALLBACK_VIDEO = 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e2ed9e130da1c6157299f24231b&profile_id=165&oauth2_token_id=57447761';
const FALLBACK_RENDER_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
];

function uniqueStrings(items: Array<string | null | undefined>) {
  return Array.from(new Set(items.map((item) => item?.trim()).filter(Boolean) as string[]));
}

export function QomorLandingPageClient({
  landing,
  locale,
}: {
  landing: ProjectLandingAggregate;
  locale: 'ar' | 'en';
}) {
  const { localizeHref } = useLanguage();
  const isArabic = locale === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const sections = landing.sections[locale];
  const hero = sections.hero.data;
  const overview = sections.overview.data;
  const benefits = sections.benefits.data;
  const locationMap = sections.location_map.data;
  const leadForm = sections.lead_form.data;
  const downloadBrochure = sections.download_brochure?.data;
  const seo = sections.seo?.data;
  const fbPixelId = seo?.fbPixelId;

  const projectTitle = isArabic ? landing.project.title_ar : landing.project.title_en;
  
  // Use DB video url or a premium fallback
  const heroVideo = hero.heroVideoUrl || FALLBACK_VIDEO;
  const coverImage = landing.project.cover_url || landing.project.gallery[0]?.image_url || FALLBACK_RENDER_IMAGES[0];

  const projectStats =
    hero.stats.length > 0
      ? hero.stats
      : landing.project.stats.slice(0, 4).map((stat) => ({
          label: isArabic ? stat.label_ar : stat.label_en,
          value: stat.value,
        }));

  // Build the renders list
  const renders: ShowcaseImage[] = (landing.project.gallery && landing.project.gallery.length > 0)
    ? landing.project.gallery.map((img, index) => ({
        alt: (isArabic ? img.alt_ar : img.alt_en) || `${projectTitle} Render ${index + 1}`,
        src: img.image_url,
      }))
    : FALLBACK_RENDER_IMAGES.map((src, index) => ({
        alt: `Qomor Renders 3D Design ${index + 1}`,
        src,
      }));

  const salesChips = uniqueStrings([
    landing.project.project_type ? `${isArabic ? 'نوع المشروع' : 'Project Type'}: ${landing.project.project_type}` : null,
    landing.project.area_name ? `${isArabic ? 'المنطقة' : 'Area'}: ${landing.project.area_name}` : null,
    landing.project.delivery_date ? `${isArabic ? 'التسليم' : 'Delivery'}: ${landing.project.delivery_date}` : null,
    landing.project.payment_plan_summary ? (isArabic ? 'أنظمة سداد مرنة' : 'Flexible Payments') : null,
  ]);

  const benefitItems =
    benefits.items.length > 0
      ? benefits.items
      : overview.highlights.slice(0, 4).map((highlight, index) => ({
          title: isArabic ? `ميزة ${index + 1}` : `Advantage ${index + 1}`,
          description: highlight,
        }));

  const highlightsMedia = landing.media.highlight_bento.filter((item) => item.locale === locale);

  useLuxuryScrollEffects();


  // Scroll triggers for Parallax Grid Gallery
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryScroll } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });

  const rawY1 = useTransform(galleryScroll, [0, 1], [0, -140]);
  const rawY2 = useTransform(galleryScroll, [0, 1], [0, 140]);
  const rawY3 = useTransform(galleryScroll, [0, 1], [0, -220]);

  const y1 = useSpring(rawY1, { damping: 25, stiffness: 120 });
  const y2 = useSpring(rawY2, { damping: 25, stiffness: 120 });
  const y3 = useSpring(rawY3, { damping: 25, stiffness: 120 });

  // Separate images into columns for masonry layout
  const col1 = renders.filter((_, i) => i % 3 === 0);
  const col2 = renders.filter((_, i) => i % 3 === 1);
  const col3 = renders.filter((_, i) => i % 3 === 2);

  return (
    <div className="bg-rich-black pb-24 font-sans select-none overflow-x-hidden">
      {fbPixelId && <FacebookPixel pixelId={fbPixelId} event="PageView" />}
      <LuxuryCursor />

      {/* ── CINEMATIC SCROLL ZOOM HERO ── */}
      {/* ── FULL SCREEN HERO ── */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-rich-black">
        {/* Background Image & Video */}
        <div className="absolute inset-0">
          <Image
            src={hero.heroImageUrl || FALLBACK_RENDER_IMAGES[0]}
            alt={hero.heroImageAlt || hero.headline}
            fill
            className="object-cover"
            priority
          />
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/80 via-[#0a0a0b]/40 to-[#0a0a0b]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,213,130,0.15),transparent_60%)]" />
        </div>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col items-start justify-center px-4 pt-20 text-start md:px-12"
        >
          {hero.eyebrow && (
            <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-gold md:text-xs">
              {hero.eyebrow}
            </span>
          )}
          <h1
            className={cn(
              'max-w-4xl text-4xl sm:text-5xl font-extralight tracking-[-0.03em] text-white md:text-6xl lg:text-[5.5rem]',
              isArabic ? 'leading-[1.25]' : 'leading-[0.92]'
            )}
          >
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-white/70 md:text-base lg:text-lg md:leading-8">
            {hero.subheadline}
          </p>

          <div className="mt-10 flex flex-wrap justify-start items-center gap-4">
            <MagneticButton
              href="#lead-form"
              className="inline-flex items-center gap-2.5 rounded-full bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-rich-black transition hover:bg-white md:text-sm"
            >
              {hero.primaryCtaLabel}
              <ArrowRight className={cn('h-4 w-4', isArabic ? 'rotate-180' : '')} />
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* ── OVERVIEW SECTION ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className={cn(isArabic ? 'text-right' : 'text-left')}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">{isArabic ? 'نظرة عامة' : 'Overview'}</span>
            <h2 className="mt-3 text-3xl font-extralight text-white md:text-5xl lg:text-6xl">{overview.title}</h2>
            <p className="mt-6 text-sm leading-7 text-white/60 md:text-base md:leading-8">{overview.description}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_12px_48px_rgba(0,0,0,0.5)]">
            <Image src={coverImage} alt={projectTitle} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── PARALLAX MASONRY GALLERY ── */}
      <section ref={galleryRef} className="py-20 md:py-32 bg-rich-black-light border-y border-white/5">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className={cn('mb-16 max-w-3xl', isArabic ? 'mr-auto text-right' : 'text-left')}>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">{isArabic ? 'تصاميم ثلاثية الأبعاد' : '3D RENDERS GALLERY'}</span>
            <h2 className="mt-3 text-3xl font-extralight text-white md:text-5xl lg:text-6xl">
              {isArabic ? 'شبكة البارالاكس للتصاميم المعمارية' : 'Cinematic Architectural Depth'}
            </h2>
            <p className="mt-4 text-sm text-white/50 md:text-base">
              {isArabic ? 'استكشف أدق التفاصيل والمخططات الهندسية للمشروع بأبعاد بصرية عميقة عند التمرير.' : 'Scroll to view our premium 3D design cards moving independently to reveal structural layout.'}
            </p>
          </div>

          {/* Three-Column Parallax Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 min-h-[140vh]">
            
            {/* Column 1 - Upward Parallax */}
            <motion.div style={{ y: y1 }} className="flex flex-col gap-6 lg:gap-8">
              {col1.map((img, idx) => (
                <div
                  key={`col1-${idx}`}
                  onClick={() => setActiveImageIndex(renders.findIndex((r) => r.src === img.src))}
                  className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/8 bg-rich-black shadow-lg"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <Maximize2 className="h-8 w-8 text-gold scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-white/70">{img.alt}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Column 2 - Downward Parallax */}
            <motion.div style={{ y: y2 }} className="flex flex-col gap-6 lg:gap-8 lg:mt-24">
              {col2.map((img, idx) => (
                <div
                  key={`col2-${idx}`}
                  onClick={() => setActiveImageIndex(renders.findIndex((r) => r.src === img.src))}
                  className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/8 bg-rich-black shadow-lg"
                >
                  <div className="relative aspect-[1/1] w-full overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <Maximize2 className="h-8 w-8 text-gold scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-white/70">{img.alt}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Column 3 - Faster Upward Parallax */}
            <motion.div style={{ y: y3 }} className="flex flex-col gap-6 lg:gap-8">
              {col3.map((img, idx) => (
                <div
                  key={`col3-${idx}`}
                  onClick={() => setActiveImageIndex(renders.findIndex((r) => r.src === img.src))}
                  className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/8 bg-rich-black shadow-lg"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <Maximize2 className="h-8 w-8 text-gold scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-white/70">{img.alt}</p>
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── BENTO HIGHLIGHTS (BENEFITS) ── */}
      <ProjectHighlightsBento
        galleryImages={renders}
        highlights={benefitItems}
        isArabic={isArabic}
        media={highlightsMedia}
      />

      {/* ── GEOGRAPHIC LOCATION & MAP ── */}
      <ProjectLocationMap
        galleryImages={renders}
        isArabic={isArabic}
        section={locationMap}
      />

      {/* ── UNITS DATABASE GRID ── */}
      <ProjectUnitGrid
        galleryImages={renders}
        isArabic={isArabic}
        projectUnitTypes={landing.project.unit_types.filter(Boolean)}
        units={landing.units}
      />

      {/* ── BROCHURE DOWNLOAD ── */}
      {sections.download_brochure?.is_enabled && downloadBrochure && landing.project.brochure_url && (
        <ProjectBrochureSection
          brochureUrl={landing.project.brochure_url}
          isArabic={isArabic}
          section={downloadBrochure}
        />
      )}

      {/* ── LEAD CAPTURE FORM SECTION ── */}
      <div id="lead-form">
        <LeadCaptureForm locale={locale} projectSlug={landing.project.slug} section={leadForm} />
      </div>

      {/* ── FAQS & TESTIMONIALS ── */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-32">
        {/* Testimonials */}
        {sections.testimonials.data.items.length > 0 && (
          <div className="mb-24">
            <h3 className="mb-8 text-center text-xl font-bold uppercase tracking-[0.2em] text-gold">{sections.testimonials.data.title}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {sections.testimonials.data.items.map((t, idx) => (
                <div key={idx} className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 glass-panel">
                  <p className="text-base italic leading-7 text-white/80">&quot;{t.quote}&quot;</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-white/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Accordion */}
        {sections.faq.data.items.length > 0 && (
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-10 text-center text-2xl font-light text-white md:text-4xl">{sections.faq.data.title}</h3>
            <div className="space-y-4">
              {sections.faq.data.items.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-white/5 bg-white/[0.015] p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                    <h4 className="text-sm font-bold md:text-base">{item.question}</h4>
                    <span className="shrink-0 rounded-full bg-gold/10 p-1.5 text-gold group-open:-rotate-180 transition-transform duration-300">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="mt-4 text-xs leading-6 text-white/60 md:text-sm md:leading-7">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── LIGHTBOX MODAL OVERLAY ── */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition hover:bg-gold hover:text-rich-black"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Slider Navigation */}
            <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img
                src={renders[activeImageIndex].src}
                alt={renders[activeImageIndex].alt}
                className="max-h-[80vh] max-w-[85vw] object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 text-center">
                <p className="text-sm font-semibold text-white/90">{renders[activeImageIndex].alt}</p>
                <span className="text-[10px] text-white/40">
                  {activeImageIndex + 1} / {renders.length}
                </span>
              </div>
            </div>

            {/* Prev/Next buttons */}
            <button
              onClick={() => setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : renders.length - 1))}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white hover:bg-gold hover:text-rich-black transition-all',
                isArabic ? 'left-6' : 'left-6'
              )}
            >
              &larr;
            </button>
            <button
              onClick={() => setActiveImageIndex((prev) => (prev !== null && prev < renders.length - 1 ? prev + 1 : 0))}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white hover:bg-gold hover:text-rich-black transition-all',
                isArabic ? 'right-6' : 'right-6'
              )}
            >
              &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating consult button for mobile */}
      <AnimatePresence>
        {!isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 md:hidden"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative flex w-full max-w-sm items-center justify-center gap-2 overflow-hidden rounded-full bg-gold py-4 text-sm font-bold uppercase tracking-[0.16em] text-rich-black shadow-[0_12px_40px_rgba(241,213,130,0.38)] active:scale-95 transition-transform"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/45 [animation:shimmer_3.2s_infinite]" />
              {isArabic ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leads modal capture */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        projectSlug={landing.project.slug}
        section={leadForm}
      />
    </div>
  );
}
