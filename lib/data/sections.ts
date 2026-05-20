import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { siteContent, Locale } from '@/lib/site-content';
import { getDbBackedProjectsSection } from '@/lib/data/projects';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeWithSectionFallback(sectionKey: string, locale: Locale, data: unknown) {
  const fallback = (siteContent[locale] as any)[sectionKey];

  if (isPlainObject(fallback) && isPlainObject(data)) {
    return {
      ...fallback,
      ...data,
    };
  }

  return data ?? fallback;
}

export async function getLiveSiteContent() {
  // If we don't have keys, fallback completely to static
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return siteContent;
  }

  try {
    const supabase = await createClient();
    const [{ data: sectionsData, error: sectionsError }, { data: blogData, error: blogError }] = await Promise.all([
      supabase.from('site_sections').select('section_key, locale, data'),
      supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false })
    ]);

    if (sectionsError || !sectionsData) {
      return siteContent;
    }

    const dynamicContent: any = {
      ar: { ...siteContent.ar },
      en: { ...siteContent.en }
    };

    sectionsData.forEach(row => {
      if (row.locale === 'ar' || row.locale === 'en') {
        const sectionKey = row.section_key === 'projects_meta' ? 'projects' : row.section_key;
        dynamicContent[row.locale][sectionKey] = mergeWithSectionFallback(sectionKey, row.locale, row.data);
      }
    });

    if (blogData && !blogError) {
      dynamicContent.ar.blog.items = blogData.filter(p => p.locale === 'ar').map(post => ({
        slug: post.slug,
        title: post.title,
        date: new Date(post.published_at || post.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' }),
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content,
        cover_url: post.cover_url,
        author_name: post.author_name,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
      }));

      dynamicContent.en.blog.items = blogData.filter(p => p.locale === 'en').map(post => ({
        slug: post.slug,
        title: post.title,
        date: new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        tag: post.tag,
        excerpt: post.excerpt,
        content: post.content,
        cover_url: post.cover_url,
        author_name: post.author_name,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
      }));
    }

    const [arProjects, enProjects] = await Promise.all([
      getDbBackedProjectsSection('ar', dynamicContent.ar.projects),
      getDbBackedProjectsSection('en', dynamicContent.en.projects),
    ]);

    dynamicContent.ar.projects = arProjects;
    dynamicContent.en.projects = enProjects;

    return dynamicContent;
  } catch (e) {
    return siteContent;
  }
}

export const getSectionData = unstable_cache(
  async (sectionKey: string, locale: Locale = 'ar') => {
    // If we don't have keys, fallback to local content
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('Supabase URL missing, falling back to local file context');
      return (siteContent[locale] as any)[sectionKey];
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('site_sections')
        .select('data')
        .eq('section_key', sectionKey)
        .eq('locale', locale)
        .single();
      
      if (error || !data) {
        console.warn('Supabase section fetch error, fallback up', error);
        return (siteContent[locale] as any)[sectionKey];
      }

      return mergeWithSectionFallback(sectionKey, locale, data.data);
    } catch (e) {
      return (siteContent[locale] as any)[sectionKey];
    }
  },
  ['site-sections'],
  { tags: ['site-sections'], revalidate: 3600 }
);

// Function strictly for Admin to read directly from Supabase (bypassing cache)
export async function getAdminSectionData(sectionKey: string, locale: Locale = 'ar') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (siteContent[locale] as any)[sectionKey];
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_sections')
    .select('data')
    .eq('section_key', sectionKey)
    .eq('locale', locale)
    .single();
  
  if (error || !data) return (siteContent[locale] as any)[sectionKey];
  return mergeWithSectionFallback(sectionKey, locale, data.data);
}

export const getAllSiteContent = unstable_cache(
  async () => getLiveSiteContent(),
  ['all-site-sections'],
  { tags: ['site-sections'], revalidate: 3600 }
);
