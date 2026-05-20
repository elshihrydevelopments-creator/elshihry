import type { MetadataRoute } from 'next';

import { getBlogSlugs, getProjectSlugs } from '@/lib/data/public-content';
import { getPublishedProjectLandingSlugs } from '@/lib/project-landings/queries';
import { withLocale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site-config';

const staticPaths = ['/', '/about', '/projects', '/blog', '/contact', '/privacy-policy', '/terms'] as const;
const locales = ['ar', 'en'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, landingSlugs, blogSlugs] = await Promise.all([
    getProjectSlugs(),
    getPublishedProjectLandingSlugs(),
    getBlogSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      alternates: {
        languages: {
          ar: `${siteConfig.siteUrl}${withLocale('ar', path)}`,
          en: `${siteConfig.siteUrl}${withLocale('en', path)}`,
        },
      },
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : 0.8,
      url: `${siteConfig.siteUrl}${withLocale(locale, path)}`,
    }))
  );

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      alternates: {
        languages: {
          ar: `${siteConfig.siteUrl}${withLocale('ar', `/projects/${slug}`)}`,
          en: `${siteConfig.siteUrl}${withLocale('en', `/projects/${slug}`)}`,
        },
      },
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      url: `${siteConfig.siteUrl}${withLocale(locale, `/projects/${slug}`)}`,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      alternates: {
        languages: {
          ar: `${siteConfig.siteUrl}${withLocale('ar', `/blog/${slug}`)}`,
          en: `${siteConfig.siteUrl}${withLocale('en', `/blog/${slug}`)}`,
        },
      },
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      url: `${siteConfig.siteUrl}${withLocale(locale, `/blog/${slug}`)}`,
    }))
  );

  const landingEntries: MetadataRoute.Sitemap = landingSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      alternates: {
        languages: {
          ar: `${siteConfig.siteUrl}${withLocale('ar', `/projects/${slug}/land`)}`,
          en: `${siteConfig.siteUrl}${withLocale('en', `/projects/${slug}/land`)}`,
        },
      },
      changeFrequency: 'weekly' as const,
      priority: 0.75,
      url: `${siteConfig.siteUrl}${withLocale(locale, `/projects/${slug}/land`)}`,
    }))
  );

  return [...staticEntries, ...projectEntries, ...landingEntries, ...blogEntries];
}
