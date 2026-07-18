import { createClient } from '@/lib/supabase/server';
import type { BlogPost, Locale, SiteCopy } from '@/lib/site-content';
import { siteContent } from '@/lib/site-content';
import { getDbBackedProjectsSection } from '@/lib/data/projects';

export type PartialSiteContent = Partial<Record<Locale, Partial<SiteCopy>>>;
export type SiteSectionKey = keyof SiteCopy;

type SectionRow = {
  data: unknown;
  locale: Locale;
  section_key: string;
};

type BlogRow = {
  author_name?: string;
  content: string[];
  cover_url?: string;
  created_at: string;
  excerpt: string;
  expert_source?: string;
  faq_blocks?: Array<{ answer: string; question: string }>;
  indexable?: boolean;
  key_takeaways?: string[];
  locale: Locale;
  meta_description?: string;
  og_description?: string;
  og_image?: string;
  og_title?: string;
  published_at?: string;
  reviewed_by?: string;
  seo_title?: string;
  slug: string;
  sources?: string[];
  tag: string;
  title: string;
  updated_at?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeWithSectionFallback(sectionKey: SiteSectionKey, locale: Locale, data: unknown) {
  const fallback = siteContent[locale][sectionKey];

  if (isPlainObject(fallback) && isPlainObject(data)) {
    return {
      ...fallback,
      ...data,
    };
  }

  return data ?? fallback;
}

function getFallbackSections(sectionKeys: SiteSectionKey[]): PartialSiteContent {
  const uniqueKeys = Array.from(new Set(sectionKeys));
  const buildLocaleFallback = (locale: Locale) =>
    Object.fromEntries(uniqueKeys.map((sectionKey) => [sectionKey, siteContent[locale][sectionKey]])) as Partial<SiteCopy>;

  return {
    ar: buildLocaleFallback('ar'),
    en: buildLocaleFallback('en'),
  };
}

function mapBlogPosts(posts: BlogRow[] | null | undefined): Record<Locale, BlogPost[]> {
  return {
    ar: (posts ?? [])
      .filter((post) => post.locale === 'ar')
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        date: new Date(post.published_at || post.created_at).toLocaleDateString('ar-EG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content,
        cover_url: post.cover_url,
        author_name: post.author_name,
        expert_source: post.expert_source,
        faq_blocks: post.faq_blocks,
        indexable: post.indexable,
        key_takeaways: post.key_takeaways,
        meta_description: post.meta_description,
        og_description: post.og_description,
        og_image: post.og_image,
        og_title: post.og_title,
        published_at: post.published_at,
        reviewed_by: post.reviewed_by,
        seo_title: post.seo_title,
        sources: post.sources,
        created_at: post.created_at,
        updated_at: post.updated_at,
      })),
    en: (posts ?? [])
      .filter((post) => post.locale === 'en')
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content,
        cover_url: post.cover_url,
        author_name: post.author_name,
        expert_source: post.expert_source,
        faq_blocks: post.faq_blocks,
        indexable: post.indexable,
        key_takeaways: post.key_takeaways,
        meta_description: post.meta_description,
        og_description: post.og_description,
        og_image: post.og_image,
        og_title: post.og_title,
        published_at: post.published_at,
        reviewed_by: post.reviewed_by,
        seo_title: post.seo_title,
        sources: post.sources,
        created_at: post.created_at,
        updated_at: post.updated_at,
      })),
  };
}

export async function getRouteContent(sectionKeys: SiteSectionKey[]): Promise<PartialSiteContent> {
  const uniqueKeys = Array.from(new Set([...sectionKeys, 'contact' as SiteSectionKey]));
  const fallback = getFallbackSections(uniqueKeys);
  const dbSectionKeys = uniqueKeys.map((sectionKey) => (sectionKey === 'projects' ? 'projects_meta' : sectionKey));

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const shouldFetchBlogPosts = uniqueKeys.includes('blog');

    const [{ data: sectionRows, error: sectionsError }, { data: blogPosts, error: blogError }] =
      await Promise.all([
        supabase
          .from('site_sections')
          .select('section_key, locale, data')
          .in('section_key', dbSectionKeys)
          .in('locale', ['ar', 'en']),
        shouldFetchBlogPosts
          ? supabase
              .from('blog_posts')
              .select('*')
              .eq('published', true)
              .order('published_at', { ascending: false })
          : Promise.resolve({ data: null, error: null }),
      ]);

    if (sectionsError || !sectionRows) {
      return fallback;
    }

    const content: PartialSiteContent = {
      ar: { ...(fallback.ar ?? {}) },
      en: { ...(fallback.en ?? {}) },
    };

    sectionRows.forEach((row) => {
      if (row.locale !== 'ar' && row.locale !== 'en') {
        return;
      }

      const locale = row.locale as Locale;
      const sectionKey = (row.section_key === 'projects_meta' ? 'projects' : row.section_key) as SiteSectionKey;
      content[locale] ??= {};
      const localizedContent = content[locale] as Record<string, unknown>;
      localizedContent[sectionKey] = mergeWithSectionFallback(sectionKey, locale, row.data);
    });

    if (shouldFetchBlogPosts && !blogError) {
      const localizedPosts = mapBlogPosts(blogPosts as BlogRow[] | null | undefined);

      (['ar', 'en'] as const).forEach((locale) => {
        const existingBlogSection = (content[locale]?.blog ?? fallback[locale]?.blog) as SiteCopy['blog'];
        content[locale] ??= {};
        content[locale].blog = {
          ...existingBlogSection,
          items: localizedPosts[locale],
        };
      });
    }

    if (uniqueKeys.includes('projects')) {
      const [arProjects, enProjects] = await Promise.all([
        getDbBackedProjectsSection('ar', content.ar?.projects as SiteCopy['projects'] | undefined),
        getDbBackedProjectsSection('en', content.en?.projects as SiteCopy['projects'] | undefined),
      ]);

      content.ar ??= {};
      content.en ??= {};
      content.ar.projects = arProjects;
      content.en.projects = enProjects;
    }

    return content;
  } catch {
    return fallback;
  }
}
