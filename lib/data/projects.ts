import type { Locale, SiteCopy } from '@/lib/site-content';
import { siteContent } from '@/lib/site-content';
import { getPublicProjects } from '@/lib/project-landings/queries';
import { projectToProjectCard } from '@/lib/project-landings/mappers';
import type { LocalizedProjectEntry, ProjectAggregate } from '@/lib/project-landings/types';

type ProjectsMetaData = Pick<SiteCopy['projects'], 'cta' | 'description' | 'titleFirst' | 'titleSecond'>;

export function buildProjectsMetaFromData(locale: Locale, data: unknown): SiteCopy['projects'] {
  const fallback = siteContent[locale].projects;

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fallback;
  }

  const nextData = data as Partial<ProjectsMetaData>;

  return {
    ...fallback,
    cta: nextData.cta ?? fallback.cta,
    description: nextData.description ?? fallback.description,
    items: fallback.items,
    titleFirst: nextData.titleFirst ?? fallback.titleFirst,
    titleSecond: nextData.titleSecond ?? fallback.titleSecond,
  };
}

export async function getDbBackedProjectsSection(locale: Locale, meta?: SiteCopy['projects']) {
  const projects = await getPublicProjects();

  if (projects.length === 0) {
    return meta ?? siteContent[locale].projects;
  }

  return {
    ...(meta ?? siteContent[locale].projects),
    items: projects.map((project) => projectToProjectCard(project, locale)),
  };
}

export async function getDbProjectEntriesBySlug(slug: string): Promise<{
  entries: LocalizedProjectEntry;
  project: ProjectAggregate | null;
  projectIndex: number;
}> {
  const projects = await getPublicProjects();
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projectIndex >= 0 ? projects[projectIndex] : null;

  if (!project) {
    return {
      entries: {},
      project: null,
      projectIndex: -1,
    };
  }

  return {
    entries: {
      ar: projectToProjectCard(project, 'ar'),
      en: projectToProjectCard(project, 'en'),
    },
    project,
    projectIndex,
  };
}

export async function getDbProjectSlugs() {
  const projects = await getPublicProjects();
  return projects.map((item) => item.slug);
}
