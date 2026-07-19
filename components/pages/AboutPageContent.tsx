'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Award, Building2, MapPin, Shield, UserRound, Zap } from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { siteConfig } from '@/lib/site-config';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function AboutPageContent() {
  const { copy, locale } = useLanguage();
  const isArabic = locale === 'ar';
  const leadershipImageUrl = copy.aboutLeadership.imageUrl.trim();
  const leadershipImageSrc = leadershipImageUrl || siteImages.lifestyle[3];
  const leadershipImageKey =
    typeof leadershipImageSrc === 'string' ? leadershipImageSrc : (leadershipImageSrc as any).src;

  return (
    <div className="pt-32 pb-20 overflow-x-hidden">
      <section className="relative mb-20 flex h-[60vh] items-center justify-center overflow-hidden px-6">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={siteImages.about}
            alt="About Background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-b from-rich-black via-transparent to-rich-black" />
        </motion.div>

        <div className="relative z-10 max-w-4xl space-y-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-bold tracking-[0.5em] text-gold uppercase"
          >
            {copy.about.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
          >
            {copy.about.titleLines[0]} <br />
            <span className="text-gradient-gold">{copy.about.titleLines[1]}</span>
          </motion.h1>
        </div>
      </section>

      <section className="motion-safe mx-auto mb-32 grid max-w-7xl items-center gap-16 px-6 md:px-12 lg:grid-cols-2">
        <div className={cn('space-y-8', isArabic ? 'order-2 text-right' : 'text-left')}>
          {copy.about.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.2 }}
              className="text-lg md:text-xl leading-relaxed text-white/70 italic font-light"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative aspect-square overflow-hidden rounded-[3rem] border border-white/10 glass-panel shadow-2xl"
        >
          <Image
            src={siteImages.lifestyle[1]}
            alt="Craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </section>

      <section className="relative mb-32 overflow-hidden border-y border-white/10 bg-white/5 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-medium tracking-tight text-white leading-tight"
          >
            &ldquo;{copy.philosophy.text}&rdquo;
          </motion.blockquote>
        </div>
        <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />
      </section>

      <section className="mx-auto mb-40 max-w-7xl px-6 md:px-12">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl uppercase tracking-widest">
            {copy.aboutValues.title}
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gold" />
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {copy.aboutValues.items.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel group rounded-[3rem] border border-white/5 p-10 text-center transition-all duration-500 hover:border-gold/30"
            >
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform group-hover:scale-110">
                {index === 0 ? (
                  <Award className="h-8 w-8" />
                ) : index === 1 ? (
                  <Shield className="h-8 w-8" />
                ) : (
                  <Zap className="h-8 w-8" />
                )}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">{value.title}</h3>
              <p className="text-white/50 leading-relaxed italic">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-32 max-w-7xl px-6 md:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {(copy.about.cards || []).map((item, index) => {
            const cardIcons = [UserRound, MapPin, Building2];
            const Icon = cardIcons[index] || Building2;

            return (
              <div key={item.label || index} className="glass-panel rounded-[2rem] border border-white/10 p-8">
                <Icon className="h-6 w-6 text-gold" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-white/35">{item.label}</p>
                <p className="mt-3 text-lg text-white">{item.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-40 bg-rich-black-light px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className={cn('mb-20', isArabic ? 'text-right' : 'text-left')}>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
              {isArabic ? 'رحلة الإنجاز' : 'Journey of Achievement'}
            </h2>
            <p className="text-gold/60 text-sm font-bold tracking-[0.4em] uppercase">
              {isArabic ? 'محطات تاريخية' : 'Key Milestones'}
            </p>
          </div>

          <div className="relative space-y-24">
            <div
              className={cn(
                'absolute top-0 bottom-0 hidden w-px bg-white/10 md:block',
                isArabic ? 'right-1/2' : 'left-1/2'
              )}
            />

            {copy.about.milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={cn(
                  'flex flex-col items-center gap-12 md:flex-row',
                  index % 2 !== 0 && !isArabic ? 'md:flex-row-reverse' : '',
                  index % 2 === 0 && isArabic ? 'md:flex-row-reverse' : ''
                )}
              >
                <div className="w-full text-center md:w-1/2 md:text-start">
                  <span className="text-6xl font-black text-white/5 transition-colors group-hover:text-gold/20">
                    {milestone.year}
                  </span>
                  <h4 className="mb-4 text-2xl font-bold text-gold uppercase tracking-widest">
                    {milestone.title}
                  </h4>
                  <p className="text-lg font-light italic leading-relaxed text-white/60">
                    {milestone.description}
                  </p>
                </div>
                <div className="z-10 hidden h-6 w-6 rounded-full border-4 border-rich-black bg-gold shadow-[0_0_20px_rgba(241,213,130,0.5)] md:block" />
                <div className="w-full md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-7xl px-6 md:px-12">
        <div className="glass-panel relative grid items-center gap-20 overflow-hidden rounded-[4rem] border border-white/5 p-12 md:p-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-3/4 overflow-hidden rounded-[3rem] grayscale transition-all duration-1000 hover:grayscale-0 md:aspect-square"
          >
            <Image
              key={leadershipImageKey}
              src={leadershipImageSrc}
              alt={copy.aboutLeadership.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized={typeof leadershipImageSrc === 'string'}
            />
          </motion.div>
          <div className={cn('space-y-8', isArabic ? 'text-right' : 'text-left')}>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-white md:text-5xl">
                {copy.aboutLeadership.name}
              </h3>
              <p className="text-gold text-sm font-bold tracking-[0.3em] uppercase">
                {copy.aboutLeadership.position}
              </p>
            </div>
            <p className="text-2xl md:text-3xl font-light italic leading-snug text-white/80">
              &ldquo;{copy.aboutLeadership.quote}&rdquo;
            </p>
            <div className="h-px w-20 bg-gold/50" />
          </div>
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold/5 blur-[120px]" />
        </div>
      </section>
    </div>
  );
}
