'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { LeadCaptureForm } from '@/components/project-land/LeadCaptureForm';
import { LeadCaptureModal } from '@/components/project-land/LeadCaptureModal';
import { LuxuryCursor } from '@/components/project-land/LuxuryCursor';
import { MagneticButton } from '@/components/project-land/MagneticButton';
import { ProjectHighlightsBento } from '@/components/project-land/ProjectHighlightsBento';
import { ProjectLifestyleTimeline } from '@/components/project-land/ProjectLifestyleTimeline';
import { ProjectLocationMap } from '@/components/project-land/ProjectLocationMap';
import { ProjectMasterpieceDetails } from '@/components/project-land/ProjectMasterpieceDetails';
import { ProjectPanoramicAura } from '@/components/project-land/ProjectPanoramicAura';
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

function uniqueStrings(items: Array<string | null | undefined>) {
  return Array.from(new Set(items.map((item) => item?.trim()).filter(Boolean) as string[]));
}

function uniqueImages(images: Array<ShowcaseImage | null | undefined>) {
  const seen = new Set<string>();

  return images.filter((image): image is ShowcaseImage => {
    if (!image?.src || seen.has(image.src)) {
      return false;
    }

    seen.add(image.src);
    return true;
  });
}

export function ProjectLandingPageClient({
  landing,
  locale,
}: {
  landing: ProjectLandingAggregate;
  locale: 'ar' | 'en';
}) {
  const { localizeHref } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sections = landing.sections[locale];
  const hero = sections.hero.data;
  const overview = sections.overview.data;
  const benefits = sections.benefits.data;
  const locationMap = sections.location_map.data;
  const leadForm = sections.lead_form.data;
  const lifestyleTimeline = sections.lifestyle_timeline.data;
  const masterpieceDetails = sections.masterpiece_details.data;
  const panoramicAura = sections.panoramic_aura.data;
  const downloadBrochure = sections.download_brochure?.data;
  const seo = sections.seo?.data;
  const fbPixelId = seo?.fbPixelId;

  const projectTitle = locale === 'ar' ? landing.project.title_ar : landing.project.title_en;
  const projectStats =
    hero.stats.length > 0
      ? hero.stats
      : landing.project.stats.slice(0, 3).map((stat) => ({
          label: locale === 'ar' ? stat.label_ar : stat.label_en,
          value: stat.value,
        }));
  const heroImage =
    hero.heroImageUrl ||
    landing.project.cover_url ||
    landing.project.gallery[0]?.image_url ||
    landing.landing.thumbnail_url ||
    '/logo.webp';
  const galleryImages = uniqueImages([
    { alt: hero.heroImageAlt || projectTitle, src: heroImage },
    ...(landing.project.gallery ?? []).map((image, index) => ({
      alt:
        (locale === 'ar' ? image.alt_ar : image.alt_en) ||
        image.alt_ar ||
        image.alt_en ||
        `${projectTitle} ${isArabic ? 'صورة' : 'Image'} ${index + 1}`,
      src: image.image_url,
    })),
  ]);
  const salesChips = uniqueStrings([
    landing.project.project_type ? `${isArabic ? 'نوع المشروع' : 'Project Type'}: ${landing.project.project_type}` : null,
    landing.project.area_name ? `${isArabic ? 'المنطقة' : 'Area'}: ${landing.project.area_name}` : null,
    landing.project.delivery_date ? `${isArabic ? 'التسليم' : 'Delivery'}: ${landing.project.delivery_date}` : null,
    landing.project.payment_plan_summary ? (isArabic ? 'أنظمة سداد متاحة' : 'Payment Options Available') : null,
  ]);
  const heroHighlights = projectStats.slice(0, 4);
  const benefitItems =
    benefits.items.length > 0
      ? benefits.items
      : overview.highlights.slice(0, 4).map((highlight, index) => ({
          title: isArabic ? `ميزة ${index + 1}` : `Benefit ${index + 1}`,
          description: highlight,
        }));
  const localizedMedia = {
    day: landing.media.day_exterior.filter((item) => item.locale === locale),
    highlights: landing.media.highlight_bento.filter((item) => item.locale === locale),
    night: landing.media.night_exterior.filter((item) => item.locale === locale),
    timeline: landing.media.life_timeline.filter((item) => item.locale === locale),
  };

  useLuxuryScrollEffects();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.48]);

  return (
    <div ref={containerRef} className="bg-rich-black pb-24">
      {fbPixelId && <FacebookPixel pixelId={fbPixelId} event="PageView" />}
      <LuxuryCursor />
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          <Image src={heroImage} alt={hero.heroImageAlt || projectTitle} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(241,213,130,0.18),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,11,0.82)_0%,rgba(10,10,11,0.56)_28%,rgba(10,10,11,0.14)_56%,rgba(10,10,11,0.74)_100%)]" />
          <div className="absolute inset-0 bg-linear-to-b from-[#07141c]/32 via-transparent to-rich-black/88" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-end gap-6 px-4 pt-24 pb-16 md:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:px-10 xl:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:pt-28 lg:pb-20">
          <div className={cn('max-w-4xl', isArabic ? 'text-right' : 'text-left')}>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className={cn(
                'max-w-5xl text-3xl sm:text-4xl font-light tracking-[-0.03em] text-white md:text-6xl lg:text-7xl xl:text-[7rem]',
                isArabic ? 'leading-[1.25] md:leading-[1.15]' : 'leading-[0.95] md:leading-[0.92]'
              )}
            >
              {hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className={cn('mt-4 max-w-3xl text-sm leading-6 text-white/74 md:text-base lg:text-lg md:leading-8', isArabic ? 'ml-auto' : '')}
            >
              {hero.subheadline}
            </motion.p>

            {salesChips.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className={cn('mt-5 flex flex-wrap gap-2', isArabic ? 'justify-end' : 'justify-start')}
              >
                {salesChips.map((chip, index) => (
                  <span
                    key={`${chip}-${index}`}
                    className="rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-[10px] font-semibold text-white/74 backdrop-blur-md md:px-4 md:py-2 md:text-xs md:text-white/76"
                  >
                    {chip}
                  </span>
                ))}
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className={cn('mt-6 flex flex-wrap items-center gap-3 md:mt-9 md:gap-4', isArabic ? 'justify-start' : 'justify-start')}
            >
              <MagneticButton
                href={hero.primaryCtaHref}
                className="inline-flex items-center gap-2.5 rounded-full bg-gold px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-rich-black transition hover:bg-white md:px-6 md:py-4 md:text-sm md:tracking-[0.22em] md:gap-3"
              >
                {hero.primaryCtaLabel}
                <ArrowRight className={cn('h-3.5 w-3.5 md:h-4 md:w-4', isArabic ? 'rotate-180' : '')} />
              </MagneticButton>
              {hero.secondaryCtaLabel ? (
                <Link
                  href={(hero.secondaryCtaHref || localizeHref(`/projects/${landing.project.slug}`)) as any}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-gold/30 hover:text-gold md:border-white/16 md:bg-white/[0.06] md:px-6 md:py-4 md:text-sm md:tracking-[0.22em] md:gap-3"
                >
                  {hero.secondaryCtaLabel}
                </Link>
              ) : null}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="group/bento relative w-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-colors duration-500 hover:bg-white/[0.04] md:rounded-[2.2rem] md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
            <div className={cn("relative z-10 grid gap-2.5 md:gap-3", heroHighlights.length > 2 ? "grid-cols-2" : "grid-cols-1")}>
              {heroHighlights.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-500 hover:border-gold/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(241,213,130,0.1)] md:rounded-[1.6rem] md:p-5"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/50 transition-colors group-hover:text-gold/80 md:text-[10px] md:tracking-[0.2em]">{stat.label}</p>
                  <p className="mt-1.5 text-lg font-light tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1 md:mt-2 md:text-2xl">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <LeadCaptureForm locale={locale} projectSlug={landing.project.slug} section={leadForm} />
      <ProjectLifestyleTimeline galleryImages={galleryImages} isArabic={isArabic} section={lifestyleTimeline} />
      <ProjectHighlightsBento galleryImages={galleryImages} highlights={benefitItems} isArabic={isArabic} media={localizedMedia.highlights} />
      <ProjectLocationMap galleryImages={galleryImages} isArabic={isArabic} section={locationMap} />
      <ProjectMasterpieceDetails galleryImages={galleryImages} isArabic={isArabic} media={localizedMedia.highlights} section={masterpieceDetails} />
      <ProjectPanoramicAura dayMedia={localizedMedia.day} galleryImages={galleryImages} isArabic={isArabic} nightMedia={localizedMedia.night} section={panoramicAura} />
      <ProjectUnitGrid
        galleryImages={galleryImages}
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
