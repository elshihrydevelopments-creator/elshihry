'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type IdleWindow = Window & {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
};

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const lastLoggedVideoUrlRef = useRef<string | null>(null);
  const { copy, content, locale, localizeHref } = useLanguage();
  const isRTL = locale === 'ar';
  const [readyVideoUrl, setReadyVideoUrl] = useState('');
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const alternateLocale = locale === 'ar' ? 'en' : 'ar';
  const posterUrl =
    copy.hero.posterUrl ||
    content[alternateLocale].hero.posterUrl ||
    siteImages.hero;
  const videoUrl =
    copy.hero.videoUrl ||
    content[alternateLocale].hero.videoUrl ||
    '';

  useGSAP(
    () => {
      gsap.to(videoLayerRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { dependencies: [locale], scope: container }
  );

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const scheduleVideoLoad = () => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(() => {
          setShouldLoadVideo(true);
        }, { timeout: 1200 });

        return;
      }

      timeoutId = window.setTimeout(() => {
        setShouldLoadVideo(true);
      }, 250);
    };

    const frameId = window.requestAnimationFrame(scheduleVideoLoad);

    return () => {
      window.cancelAnimationFrame(frameId);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (idleId !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (lastLoggedVideoUrlRef.current === videoUrl) {
      return;
    }

    lastLoggedVideoUrlRef.current = videoUrl;
    console.info('[Hero] runtime videoUrl:', videoUrl || '(empty)');
  }, [videoUrl]);

  useEffect(() => {
    const video = videoElementRef.current;

    if (!video || !shouldLoadVideo || !videoUrl) {
      return;
    }

    video.load();

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay can be blocked transiently; keep the poster visible until playback starts.
      });
    }
  }, [shouldLoadVideo, videoUrl]);

  return (
    <section
      ref={container}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative flex h-screen w-full items-center overflow-hidden"
    >
      {/* ─── Video Background ─── */}
      <div ref={videoLayerRef} className="absolute inset-0 -top-[15%] z-0 h-[130%] w-full">
        {/* gradient overlay: darker on the content side */}
        <div 
          className={cn(
            "absolute inset-0 z-10 bg-gradient-to-r from-rich-black/85 via-rich-black/50 to-rich-black/20",
            isRTL && "bg-gradient-to-l"
          )} 
        />
        <Image
          src={posterUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <video
          ref={videoElementRef}
          autoPlay
          muted
          loop
          playsInline
          src={shouldLoadVideo && videoUrl ? videoUrl : undefined}
          preload="metadata"
          onCanPlay={() => setReadyVideoUrl(videoUrl)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            readyVideoUrl === videoUrl ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-16">
        <div className={cn("max-w-3xl", isRTL && " text-right")}>

          {/* Badge */}
          <LocaleReveal localeKey={`hero-badge-${locale}`} className="mb-6">
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-[0.25em] text-white/60 uppercase backdrop-blur-sm'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              {copy.hero.badge}
            </span>
          </LocaleReveal>

          {/* Heading */}
          <ScrollRevealHeading
            as="h1"
            localeKey={`hero-heading-${locale}`}
            start="top 92%"
            className={cn(
              'mb-6 font-bold tracking-tighter text-white',
              'text-4xl leading-[1.05] md:text-5xl lg:text-6xl',
              locale === 'en' ? 'uppercase' : 'leading-[1.15]'
            )}
            lines={[
              copy.hero.titleFirst,
              <span key="hero-gold" className="text-gradient-gold block">
                {copy.hero.titleSecond}
              </span>,
            ]}
          />

          {/* Subtitle */}
          <LocaleReveal localeKey={`hero-copy-${locale}`} className="mb-10">
            <p
              className={cn(
                'max-w-xl text-sm font-light text-white/60 md:text-base',
                locale === 'ar' ? 'leading-8' : 'tracking-wide leading-relaxed'
              )}
            >
              {copy.hero.subtitle}
            </p>
          </LocaleReveal>

          {/* Buttons */}
          <LocaleReveal localeKey={`hero-btns-${locale}`}>
            <div className={cn('flex flex-wrap gap-4')}>

              {/* Primary — Download Portfolio */}
              <a
                href={siteConfig.portfolioPath}
                download
                onClick={() => trackEvent('brochure_download', { locale, placement: 'hero' })}
                className={cn(
                  'group inline-flex items-center gap-3 rounded-full px-7 py-3.5',
                  'bg-white text-rich-black text-sm font-semibold tracking-wide',
                  'transition-all duration-300 hover:bg-gold hover:text-rich-black',
                  'shadow-[0_0_30px_rgba(255,255,255,0.08)]'
                )}
              >
                {!isRTL && <span>{copy.hero.btnDownload}</span>}
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full bg-rich-black/10',
                    'transition-transform duration-300',
                    isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                  )}
                >
                  {isRTL ? (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </span>
                {isRTL && <span>{copy.hero.btnDownload}</span>}
              </a>

              {/* Secondary — See Our Projects */}
              <Link
                href={localizeHref('/projects') as any}
                onClick={() => trackEvent('project_cta_click', { locale, placement: 'hero' })}
                className={cn(
                  'group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5',
                  'text-sm font-medium text-white/80 tracking-wide',
                  'transition-all duration-300 hover:border-gold/60 hover:text-white backdrop-blur-sm'
                )}
              >
                {!isRTL && <span>{copy.hero.btnProjects}</span>}
                {isRTL ? (
                  <ArrowUpLeft
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      'group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 group-hover:text-gold'
                    )}
                  />
                ) : (
                  <ArrowUpRight
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold'
                    )}
                  />
                )}
                {isRTL && <span>{copy.hero.btnProjects}</span>}
              </Link>

            </div>
          </LocaleReveal>
        </div>
      </div>

    </section>
  );
}
