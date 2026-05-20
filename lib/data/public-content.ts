import type { BlogPost, Locale, ProjectCard, SiteCopy } from '@/lib/site-content';

import { getDbProjectEntriesBySlug, getDbProjectSlugs } from '@/lib/data/projects';
import { getRouteContent } from '@/lib/data/route-content';

type LocalizedEntry<T> = Partial<Record<Locale, T>>;

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export async function getProjectSlugs() {
  const dbSlugs = await getDbProjectSlugs();

  if (dbSlugs.length > 0) {
    return unique(dbSlugs);
  }

  const content = await getRouteContent(['projects']) as Record<Locale, Partial<SiteCopy>>;
  return unique([
    ...(content.en?.projects?.items ?? []).map((item) => item.slug),
    ...(content.ar?.projects?.items ?? []).map((item) => item.slug),
  ]);
}

export async function getProjectEntriesBySlug(slug: string): Promise<{
  entries: LocalizedEntry<ProjectCard>;
  projectIndex: number;
}> {
  const dbResult = await getDbProjectEntriesBySlug(slug);

  if (dbResult.project) {
    return {
      entries: dbResult.entries,
      projectIndex: dbResult.projectIndex,
    };
  }

  const content = await getRouteContent(['projects']) as Record<Locale, Partial<SiteCopy>>;
  const englishProjects = content.en?.projects?.items ?? [];
  const arabicProjects = content.ar?.projects?.items ?? [];
  const englishIndex = englishProjects.findIndex((item) => item.slug === slug);
  const arabicIndex = arabicProjects.findIndex((item) => item.slug === slug);

  return {
    entries: {
      en: englishIndex >= 0 ? englishProjects[englishIndex] : undefined,
      ar: arabicIndex >= 0 ? arabicProjects[arabicIndex] : undefined,
    },
    projectIndex: englishIndex >= 0 ? englishIndex : arabicIndex,
  };
}

export async function getBlogSlugs() {
  const content = await getRouteContent(['blog']) as Record<Locale, Partial<SiteCopy>>;

  return unique([
    ...(content.en?.blog?.items ?? []).map((item) => item.slug),
    ...(content.ar?.blog?.items ?? []).map((item) => item.slug),
  ]);
}

export async function getBlogEntriesBySlug(slug: string): Promise<{
  entries: LocalizedEntry<BlogPost>;
  postIndex: number;
}> {
  const content = await getRouteContent(['blog']) as Record<Locale, Partial<SiteCopy>>;
  const englishPosts = content.en?.blog?.items ?? [];
  const arabicPosts = content.ar?.blog?.items ?? [];
  const englishIndex = englishPosts.findIndex((item) => item.slug === slug);
  const arabicIndex = arabicPosts.findIndex((item) => item.slug === slug);

  return {
    entries: {
      en: englishIndex >= 0 ? englishPosts[englishIndex] : undefined,
      ar: arabicIndex >= 0 ? arabicPosts[arabicIndex] : undefined,
    },
    postIndex: englishIndex >= 0 ? englishIndex : arabicIndex,
  };
}

export function pickPreferredLocaleEntry<T>(entries: LocalizedEntry<T>) {
  return entries.en ?? entries.ar ?? null;
}
