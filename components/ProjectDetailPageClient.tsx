'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Images,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/components/LanguageProvider';
import { getPhoneHref, getWhatsAppUrl } from '@/lib/site-config';
import type { Locale, ProjectCard } from '@/lib/site-content';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

type LocalizedProjectEntry = Partial<Record<Locale, ProjectCard>>;

function ProjectStateCard({
  icon,
  title,
  description,
  isArabic,
  projectsHref,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isArabic: boolean;
  projectsHref: string;
  cta?: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-32">
      <div className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-10 text-center glass-panel">
        <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
          {icon}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 md:text-base">{description}</p>
        {cta ? (
          <Link
            href={projectsHref as any}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
          >
            {cta}
            <ArrowRight className={cn('h-4 w-4', isArabic ? 'rotate-180' : '')} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function ProjectDetailPageClient({
  entries,
  projectIndex,
  slug,
}: {
  entries: LocalizedProjectEntry;
  projectIndex: number;
  slug: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<Record<string, number>>({});
  const { copy, locale, localizeHref } = useLanguage();
  const isArabic = locale === 'ar';
  const liveProject = copy.projects.items.find((item) => item.slug === slug);
  const project = liveProject ?? entries[locale] ?? entries.en ?? entries.ar ?? null;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  if (!project) {
    return (
      <ProjectStateCard
        icon={<Compass className="h-8 w-8" />}
        title={isArabic ? 'هذا المشروع غير متاح الآن' : 'This Project Is Not Available Right Now'}
        description={
          isArabic
            ? 'قد يكون الرابط غير صحيح أو أن المشروع لم يعد معروضًا حاليًا ضمن مشاريع El Shihry.'
            : 'The link may be incorrect, or this project may no longer be presented within the current El Shihry portfolio.'
        }
        cta={isArabic ? 'العودة إلى المشاريع' : 'Back To Projects'}
        isArabic={isArabic}
        projectsHref={localizeHref('/projects')}
      />
    );
  }

  const fallbackImage = siteImages.projects[Math.max(projectIndex, 0) % siteImages.projects.length];
  const uploadedImages = Array.from(
    new Set(
      [project.cover_url, ...(project.gallery ?? [])].filter(
        (image): image is string => Boolean(image)
      )
    )
  );
  const projectImages = uploadedImages.length > 0 ? uploadedImages : [fallbackImage];
  const visibleStats = project.stats.filter((stat) => stat.label?.trim() && stat.value?.trim());
  const visibleDetails = project.details.filter((detail) => detail?.trim());
  const phoneHref = getPhoneHref();
  const whatsappUrl = getWhatsAppUrl(
    locale === 'ar'
      ? `أرغب في معرفة المزيد عن مشروع ${project.title}`
      : `I want to learn more about the project ${project.title}`
  );
  const heroStats =
    visibleStats.length > 0
      ? visibleStats.slice(0, 3)
      : [
          {
            label: isArabic ? 'الرؤية البصرية' : 'Visual Identity',
            value: String(projectImages.length),
          },
          {
            label: isArabic ? 'العنوان' : 'Address',
            value: project.location || (isArabic ? 'موقع مميز' : 'Prime Address'),
          },
        ];

  const activeImageIndex = selectedImageIndexes[slug] ?? 0;
  const activeImage =
    projectImages[Math.min(activeImageIndex, projectImages.length - 1)] || fallbackImage;
  const setActiveImageIndex = (index: number) =>
    setSelectedImageIndexes((current) => ({ ...current, [slug]: index }));
  const showGalleryNavigation = projectImages.length > 1;
  const handlePreviousImage = () =>
    setActiveImageIndex((activeImageIndex - 1 + projectImages.length) % projectImages.length);
  const handleNextImage = () =>
    setActiveImageIndex((activeImageIndex + 1) % projectImages.length);

  return (
    <div ref={containerRef} className="relative overflow-hidden pb-32">
      <section className="relative flex h-screen w-full items-center justify-center">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src={activeImage}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-rich-black/45 via-rich-black/10 to-rich-black" />
        </motion.div>

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-2 text-gold"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase">
              {project.location || (isArabic ? 'موقع مميز' : 'Prime Location')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold tracking-tighter text-white md:text-8xl"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg"
          >
            {project.description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 hidden w-[92%] max-w-6xl -translate-x-1/2 items-center gap-6 rounded-[2rem] border border-white/10 px-6 py-5 glass-panel md:flex"
        >
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
            {heroStats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="group rounded-[1.4rem] border border-white/5 bg-white/[0.03] px-5 py-4 text-center"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors group-hover:text-gold">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-bold tracking-tight text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="hidden h-14 w-px bg-white/10 xl:block" />

          <div className="flex shrink-0 items-center gap-4 rounded-[1.4rem] border border-gold/20 bg-gold/10 px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Images className="h-5 w-5" />
            </div>
            <div className={cn('space-y-1', isArabic ? 'text-right' : 'text-left')}>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                {isArabic ? 'بصمة المشروع' : 'Project Signature'}
              </p>
              <button
                type="button"
                onClick={() => setSelectedImageIndexes((current) => ({ ...current, [slug]: 0 }))}
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-gold"
              >
                <span>
                  {projectImages.length}{' '}
                  {isArabic
                    ? 'لقطة تبرز فخامة المشروع'
                    : projectImages.length === 1
                      ? 'Signature Frame'
                      : 'Signature Frames'}
                </span>
                <ArrowRight
                  className={cn(
                    'h-4 w-4 transition-transform group-hover:translate-x-1',
                    isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''
                  )}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto -mt-10 max-w-7xl px-6">
        <div className="glass-panel relative z-20 rounded-[2.5rem] border border-white/10 px-6 py-8 md:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className={cn('max-w-3xl space-y-3', isArabic ? 'text-right' : 'text-left')}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                {isArabic ? 'ملخص سريع' : 'Quick Summary'}
              </p>
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                {isArabic ? 'نظرة مركزة على هذا الأصل' : 'A Focused View of This Asset'}
              </h2>
              <p className="text-sm leading-7 text-white/65 md:text-base">{project.description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('whatsapp_click', { locale, placement: 'project_detail', slug })}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
              >
                <MessageCircle className="h-4 w-4" />
                {isArabic ? 'واتساب' : 'WhatsApp'}
              </a>
              <a
                href={phoneHref}
                onClick={() => trackEvent('phone_click', { locale, placement: 'project_detail', slug })}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:border-gold/30 hover:text-gold"
              >
                <PhoneCall className="h-4 w-4" />
                {isArabic ? 'اتصل الآن' : 'Call Now'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-24 px-6 py-32 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-gold">
            {isArabic ? 'نظرة عامة' : 'The Overview'}
          </h2>
          <p className="text-3xl font-medium leading-tight text-white italic md:text-4xl">
            &ldquo;{project.description}&rdquo;
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2"
        >
          {visibleDetails.length > 0 ? (
            visibleDetails.map((detail, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="font-medium text-white/70">{detail}</p>
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm leading-7 text-white/60 md:text-base">
                {isArabic
                  ? 'هذا المشروع صُمم ليعكس رؤية El Shihry في تقديم وجهات ترفع قيمة الأصل وتمنح تجربة معيشية أكثر رقيًا.'
                  : 'This destination reflects El Shihry’s vision of creating assets that elevate value while delivering a more refined lifestyle experience.'}
              </p>
            </div>
          )}
        </motion.div>
      </section>

      <section className="mx-auto mb-32 max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className={cn('max-w-3xl space-y-4', isArabic ? 'text-right' : 'text-left')}>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
              {isArabic ? 'هوية بصرية' : 'Visual Narrative'}
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              {isArabic ? 'تفاصيل تنطق بفخامة El Shihry' : 'Details That Speak The El Shihry Standard'}
            </h2>
            <p className="text-base leading-8 text-white/60 md:text-lg">
              {isArabic
                ? 'استكشف المشاهد التي تعكس جودة التنفيذ، قوة الحضور، وروح الفخامة التي تميّز كل مشروع يحمل اسم El Shihry.'
                : 'Explore the scenes that reflect execution quality, architectural presence, and the sense of luxury behind every El Shihry project.'}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start rounded-full border border-white/10 bg-white/[0.03] px-5 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className={cn('space-y-1', isArabic ? 'text-right' : 'text-left')}>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
                {isArabic ? 'مشاهد المشروع' : 'Project Moments'}
              </p>
              <p className="text-lg font-bold text-white">
                {projectImages.length}{' '}
                {isArabic ? 'لقطة مختارة' : projectImages.length === 1 ? 'Curated View' : 'Curated Views'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
          <motion.div
            key={typeof activeImage === 'string' ? activeImage : (activeImage as any).src}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative min-h-[420px] overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.03] sm:min-h-[560px]"
          >
            <Image
              src={activeImage}
              alt={`${project.title} gallery image ${activeImageIndex + 1}`}
              fill
              sizes="(max-width: 1280px) 100vw, 62vw"
              className="object-contain p-4 sm:p-6"
            />
            <div className="absolute inset-0 bg-linear-to-t from-rich-black/85 via-rich-black/10 to-transparent" />

            {showGalleryNavigation ? (
              <>
                <button
                  type="button"
                  onClick={handlePreviousImage}
                  aria-label={isArabic ? 'الصورة السابقة' : 'Previous image'}
                  className="group absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:border-gold/40 hover:bg-white/16 hover:text-gold sm:left-6 sm:h-14 sm:w-14"
                >
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 via-white/8 to-transparent opacity-80" />
                  <div className="absolute inset-[1px] rounded-full border border-white/10" />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(241,213,130,0.22),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <ChevronLeft className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5 sm:h-6 sm:w-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label={isArabic ? 'الصورة التالية' : 'Next image'}
                  className="group absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition duration-300 hover:border-gold/40 hover:bg-white/16 hover:text-gold sm:right-6 sm:h-14 sm:w-14"
                >
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 via-white/8 to-transparent opacity-80" />
                  <div className="absolute inset-[1px] rounded-full border border-white/10" />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(241,213,130,0.22),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <ChevronRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-6 sm:w-6" />
                </button>
              </>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-rich-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold backdrop-blur-xl">
                  {isArabic ? 'المشهد الأبرز' : 'Featured Scene'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/75 backdrop-blur-xl">
                  {activeImageIndex + 1} / {projectImages.length}
                </span>
              </div>

              <div className="max-w-2xl">
                <h3 className="text-2xl font-bold text-white md:text-3xl">{project.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/65 md:text-base">
                  {isArabic
                    ? 'كل لقطة هنا تعكس جانبًا من شخصية المشروع، من جودة التفاصيل إلى حضور المساحات وأناقة المشهد العام.'
                    : 'Each frame reveals a different layer of the project’s personality, from refined detailing to the elegance of the overall atmosphere.'}
                </p>
              </div>

              {showGalleryNavigation ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-full border border-white/10 bg-rich-black/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-white/55 backdrop-blur-xl">
                    {isArabic ? 'استخدم الأسهم للتنقل' : 'Use arrows to explore'}
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    {projectImages.map((_, index) => (
                      <button
                        key={`gallery-dot-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={
                          isArabic ? `الانتقال للصورة ${index + 1}` : `Go to image ${index + 1}`
                        }
                        className={cn(
                          'h-2.5 rounded-full transition-all duration-300',
                          index === activeImageIndex
                            ? 'w-8 bg-gold shadow-[0_0_18px_rgba(241,213,130,0.45)]'
                            : 'w-2.5 bg-white/35 hover:bg-white/55'
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>

          <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className={cn('space-y-1', isArabic ? 'text-right' : 'text-left')}>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                  {isArabic ? 'المشاهد المختارة' : 'Curated Scenes'}
                </p>
                <p className="text-sm text-white/65">
                  {isArabic
                    ? 'مجموعة لقطات تُبرز جوهر المشروع وتفاصيله الراقية.'
                    : 'A curated collection highlighting the project’s essence and refined details.'}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                <Images className="h-5 w-5" />
              </div>
            </div>

            <div
              data-lenis-prevent
              className="gallery-scrollbar grid max-h-[70vh] grid-cols-2 gap-4 overflow-y-auto pr-2 sm:grid-cols-3 xl:max-h-[560px] xl:grid-cols-2"
            >
              {projectImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    'group relative overflow-hidden rounded-[1.6rem] border text-left transition-all duration-300',
                    index === activeImageIndex
                      ? 'border-gold shadow-[0_0_0_1px_rgba(241,213,130,0.45)]'
                      : 'border-white/8 hover:border-white/20'
                  )}
                >
                  <div className="relative aspect-[4/5] bg-rich-black/60">
                    <Image
                      src={image}
                      alt={`${project.title} thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      className={cn(
                        'object-contain p-2 transition-transform duration-500',
                        index === activeImageIndex ? 'scale-[1.03]' : 'group-hover:scale-105'
                      )}
                    />
                    <div
                      className={cn(
                        'absolute inset-0 transition-colors',
                        index === activeImageIndex
                          ? 'bg-rich-black/20'
                          : 'bg-rich-black/35 group-hover:bg-rich-black/20'
                      )}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
                      <span className="rounded-full bg-rich-black/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md">
                        {index === 0 ? (isArabic ? 'الواجهة الرئيسية' : 'Hero View') : `${index + 1}`}
                      </span>
                      {index === activeImageIndex && (
                        <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-rich-black">
                          {isArabic ? 'مختارة' : 'Selected'}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, x: 20, y: 20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel flex flex-col justify-between gap-6 rounded-[2.5rem] border border-white/10 p-8 md:flex-row md:items-center"
        >
          <div className={cn('space-y-2', isArabic ? 'text-right' : 'text-left')}>
            <div className="flex items-center gap-3 text-gold">
              <ShieldCheck className="h-6 w-6" />
              <h4 className="text-xl font-bold text-white">
                {isArabic ? 'وعد El Shihry' : 'The El Shihry Promise'}
              </h4>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-white/55 md:text-base">
              {isArabic
                ? 'في El Shihry، لا نعرض مشروعًا فحسب، بل نُقدّم تجربة تُجسد قيمة الأصل، أناقة التصميم، وثقة العلامة التي تُعرف بالتفاصيل التي تصنع الفارق.'
                : 'At El Shihry, we do not simply present a project. We deliver an experience that reflects asset value, design elegance, and a brand defined by details that truly set it apart.'}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-gold/20 bg-gold/10 px-5 py-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
              {isArabic ? 'تجربة بصرية' : 'Brand Experience'}
            </p>
            <p className="mt-2 text-lg font-bold text-gold">
              {uploadedImages.length > 0
                ? isArabic
                  ? 'صور تعكس هوية المشروع'
                  : 'Imagery that reflects the project identity'
                : isArabic
                  ? 'سيتم تحديث المشاهد قريبًا'
                  : 'Visuals will be refreshed soon'}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
