'use client';

import { motion } from 'motion/react';
import { DownloadCloud } from 'lucide-react';
import type { LandingDownloadBrochureSection } from '@/lib/project-landings/types';

interface ProjectBrochureSectionProps {
  section: LandingDownloadBrochureSection;
  brochureUrl?: string | null;
  isArabic: boolean;
}

export function ProjectBrochureSection({ section, brochureUrl, isArabic }: ProjectBrochureSectionProps) {
  if (!brochureUrl) return null;

  return (
    <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-rich-black py-20 md:py-32 border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(241,213,130,0.08),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mb-6 text-3xl font-extralight text-white md:text-5xl lg:text-6xl">
            {section.title}
          </h2>
          
          <p className="mx-auto mb-12 max-w-2xl text-sm leading-7 text-white/60 md:text-base md:leading-8">
            {section.description}
          </p>
          
          <div className="flex justify-center">
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gold px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-rich-black shadow-[0_0_40px_rgba(241,213,130,0.3)] transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_60px_rgba(241,213,130,0.5)] active:scale-95"
            >
              <span className="absolute inset-0 w-full translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
              
              <DownloadCloud className="h-5 w-5" />
              <span className="relative z-10">{section.ctaLabel}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
