'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/components/LanguageProvider';
import { siteImages } from '@/lib/site-content';

export function ProjectsPageContent() {
  const { copy, locale, localizeHref } = useLanguage();
  const isArabic = locale === 'ar';

  return (
    <div className="pt-40 pb-32 px-6 overflow-hidden">
      <div className="mx-auto mb-24 max-w-7xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-xs font-bold tracking-[0.4em] text-gold uppercase"
        >
          {isArabic ? 'مشاريعنا العقارية' : 'Our Portfolio'}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-bold tracking-tight text-white md:text-8xl"
        >
          {copy.projects.titleFirst} <br />
          <span className="text-gradient-gold">{copy.projects.titleSecond}</span>
        </motion.h1>
      </div>

      <div className="motion-safe mx-auto max-w-7xl columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
        {copy.projects.items.map((project, index) => {
          const aspects = ['aspect-3/4', 'aspect-4/5', 'aspect-square', 'aspect-[9/16]'];
          const aspectClass = aspects[index % aspects.length];
          const projectImage = project.cover_url || siteImages.projects[index % siteImages.projects.length];

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="group relative mb-8 break-inside-avoid"
            >
              <Link
                href={localizeHref(`/projects/${project.slug}`) as any}
                onClick={() => trackEvent('project_cta_click', { locale, placement: 'projects_index', slug: project.slug })}
                className={`glass-panel relative block overflow-hidden rounded-[2.5rem] border border-white/10 shadow-xl ${aspectClass}`}
              >
                <Image
                  src={projectImage}
                  alt={project.title}
                  fill
                  className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-x-0 bottom-0 flex h-full translate-y-4 flex-col justify-end bg-linear-to-t from-rich-black via-rich-black/80 to-transparent p-8 pt-32 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="mb-2 flex shrink-0 items-center gap-2 text-gold opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{project.location}</span>
                  </div>

                  <h3 className="mb-3 line-clamp-2 text-2xl font-bold text-white transition-colors duration-500 group-hover:text-gold">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-white uppercase opacity-0 transition-opacity duration-500 delay-200 group-hover:opacity-100">
                    <span className="border-b border-gold pb-0.5">{copy.projects.cta}</span>
                    <ArrowUpRight className="h-4 w-4 text-gold" />
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-10 rounded-full border border-white/10 bg-rich-black/60 px-3 py-1 backdrop-blur-md">
                  <span className="text-[8px] font-bold tracking-[0.2em] text-gold uppercase">Shihry Classic</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
