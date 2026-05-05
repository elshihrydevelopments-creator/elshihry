'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/components/LanguageProvider';
import type { BlogPost, Locale } from '@/lib/site-content';
import { siteImages } from '@/lib/site-content';
import { cn } from '@/lib/utils';

type LocalizedBlogEntry = Partial<Record<Locale, BlogPost>>;

export function BlogPostPageClient({
  entries,
  postIndex,
  slug,
}: {
  entries: LocalizedBlogEntry;
  postIndex: number;
  slug: string;
}) {
  const { copy, locale, localizeHref } = useLanguage();
  const isArabic = locale === 'ar';
  const livePost = copy.blog.items.find((item) => item.slug === slug);
  const post = livePost ?? entries[locale] ?? entries.en ?? entries.ar ?? null;

  if (!post) {
    return null;
  }

  const heroImage = siteImages.lifestyle[Math.max(postIndex, 0) % siteImages.lifestyle.length];

  return (
    <div className="pb-32">
      <section className="relative flex h-[70vh] w-full items-end px-6 pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover grayscale opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-rich-black via-rich-black/50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center gap-6 text-gold text-xs font-bold tracking-[0.3em] uppercase"
          >
            <Link href={localizeHref('/blog') as any} className="flex items-center gap-2 transition-colors hover:text-white">
              <ArrowLeft className={cn('h-4 w-4', isArabic ? 'rotate-180' : '')} />
              <span>{isArabic ? 'المدونة' : 'The Blog'}</span>
            </Link>
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{post.date}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold">
                SH
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {post.author_name || 'El Shihry Editorial'}
              </div>
            </div>
            <button className="text-white/40 transition-colors hover:text-gold">
              <Share2 className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-24">
        <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
            {isArabic ? 'الخلاصة' : 'Direct Answer'}
          </p>
          <p className="mt-4 text-lg leading-8 text-white/75 md:text-xl">{post.excerpt}</p>
        </div>

        {post.key_takeaways?.length ? (
          <div className="mb-14 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-bold text-white">{isArabic ? 'أهم النقاط' : 'Key Takeaways'}</h2>
            <ul className="mt-6 space-y-4 text-white/70">
              {post.key_takeaways.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          {post.content.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                'text-xl leading-[1.8] text-white/80 font-light italic md:text-2xl',
                index === 0
                  ? 'first-letter:float-left first-letter:mt-2 first-letter:mr-4 first-letter:text-7xl first-letter:font-bold first-letter:text-gold'
                  : ''
              )}
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        <div className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-12 md:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
              {isArabic ? 'الوسوم' : 'Tags'}:
            </span>
            <span className="text-xs font-bold text-gold">{post.tag}</span>
          </div>

          <Link
            href={localizeHref('/blog') as any}
            className="border-b border-gold pb-1 text-xs font-bold tracking-[0.2em] text-white uppercase transition-colors hover:text-gold"
          >
            {isArabic ? 'العودة لجميع المقالات' : 'Back to all articles'}
          </Link>
        </div>

        <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center">
          <h3 className="text-2xl font-bold text-white">
            {isArabic ? 'هل تريد مناقشة مشروع مناسب؟' : 'Ready to discuss the right project?'}
          </h3>
          <p className="mt-3 text-white/65">
            {isArabic
              ? 'يمكن لفريق الشحري مساعدتك في مقارنة المشروعات وخطط السداد وخيارات الاستثمار.'
              : 'The El Shihry team can help you compare projects, payment plans, and investment fit.'}
          </p>
          <Link
            href={localizeHref('/contact') as any}
            onClick={() => trackEvent('project_cta_click', { locale, placement: 'blog_post', slug })}
            className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] text-rich-black transition hover:bg-white"
          >
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>
      </section>

      <section className="mx-auto my-32 max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video overflow-hidden rounded-[4rem] border border-white/5"
        >
          <Image
            src={siteImages.hero}
            alt="Atmosphere"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
        </motion.div>
      </section>
    </div>
  );
}
