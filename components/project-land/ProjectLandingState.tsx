'use client';

import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export function ProjectLandingState({
  ctaHref,
  ctaLabel,
  description,
  isArabic,
  title,
}: {
  ctaHref: string;
  ctaLabel: string;
  description: string;
  isArabic: boolean;
  title: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-32">
      <div className="glass-panel w-full max-w-3xl rounded-[2.6rem] border border-white/10 p-10 text-center">
        <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/60 md:text-base">{description}</p>
        <Link
          href={ctaHref as any}
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
        >
          {ctaLabel}
          <ArrowRight className={cn('h-4 w-4', isArabic ? 'rotate-180' : '')} />
        </Link>
      </div>
    </div>
  );
}
