'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/components/LanguageProvider';
import { trackEvent } from '@/lib/analytics';
import { LocaleReveal } from '@/components/LocaleReveal';
import { ScrollRevealHeading } from '@/components/ScrollRevealHeading';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const projectLayout = [
  {
    id: 1,
    height: 'h-[60vh]',
    span: 'col-span-12 md:col-span-8',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw',
  },
  {
    id: 2,
    height: 'h-[60vh]',
    span: 'col-span-12 md:col-span-4',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 34vw, 30vw',
  },
  {
    id: 3,
    height: 'h-[50vh]',
    span: 'col-span-12 md:col-span-4',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 34vw, 30vw',
  },
  {
    id: 4,
    height: 'h-[50vh]',
    span: 'col-span-12 md:col-span-8',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw',
  },
];

export function ProjectsBento() {
  const container = useRef<HTMLDivElement>(null);
  const { copy, locale, localizeHref } = useLanguage();
  const headingTitle = locale === 'ar' ? 'مشاريعنا' : `${copy.projects.titleFirst} ${copy.projects.titleSecond}`.trim();
  const headingDescription =
    locale === 'ar'
      ? 'استكشف مجموعة من مشاريعنا التي تعكس رؤيتنا في الابتكار والجودة'
      : copy.projects.description;

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.bento-card');

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        const image = card.querySelector('.bento-img');
        if (image) {
          gsap.to(image, {
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    },
    { dependencies: [locale], scope: container }
  );

  return (
    <section id="projects" ref={container} className="mx-auto max-w-[1400px] px-6 py-8 md:px-12 md:py-32">
      <LocaleReveal
        localeKey={`projects-heading-${locale}`}
        className={cn('mb-10 max-w-3xl md:mb-20', locale === 'ar' ? 'text-right md:ml-auto' : 'text-left')}
      >
        <ScrollRevealHeading
          as="h2"
          localeKey={`projects-heading-title-${locale}`}
          className={cn('mb-4 text-4xl font-bold tracking-tighter md:text-6xl', locale === 'en' ? 'uppercase' : '')}
          lines={[headingTitle]}
        />
        <p className="text-lg text-white/60">{headingDescription}</p>
      </LocaleReveal>

      <div className="grid grid-cols-12 gap-6">
        {projectLayout.map((project, index) => {
          const item = copy.projects.items[index];
          const projectImage = item.cover_url || siteImages.projects[index % siteImages.projects.length];

          return (
            <Link
              key={project.id}
              href={localizeHref(`/projects/${item.slug}`) as any}
              onClick={() => trackEvent('project_cta_click', { locale, placement: 'home_projects', slug: item.slug })}
              className={`bento-card group relative block overflow-hidden rounded-3xl ${project.span} ${project.height}`}
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-rich-black via-rich-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />

              <Image
                src={projectImage}
                alt={item.title}
                fill
                sizes={project.sizes}
                className="bento-img object-cover transition-transform duration-700"
              />

              <LocaleReveal
                localeKey={`project-card-${locale}-${project.id}`}
                className="absolute bottom-0 left-0 z-20 w-full translate-y-4 p-8 transition-transform duration-500 group-hover:translate-y-0"
              >
                <p className="mb-2 text-sm font-bold tracking-[0.25em] text-gold uppercase">{item.location}</p>
                <ScrollRevealHeading
                  as="h3"
                  localeKey={`project-card-title-${locale}-${project.id}`}
                  start="top 90%"
                  className="text-3xl font-bold text-white md:text-4xl"
                  lines={[item.title]}
                />
              </LocaleReveal>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
