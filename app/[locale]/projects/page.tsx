import type { Metadata } from 'next';

import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { ProjectsPageContent } from '@/components/pages/ProjectsPageContent';
import { getRouteContent } from '@/lib/data/route-content';
import { buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getRouteContent(['projects']);
  const projects = content[locale]?.projects;

  return buildLocalizedMetadata({
    description: projects?.description || 'Browse El Shihry projects.',
    locale,
    path: '/projects',
    title: locale === 'ar' ? 'المشاريع | الشحري للتطوير العقاري' : 'Projects | El Shihry Developments',
  });
}

export default async function LocalizedProjectsPage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const content = await getRouteContent(['projects']);
  const projects = content[locale]?.projects;
  const description = projects?.description || 'Browse El Shihry projects.';
  const title = locale === 'ar' ? 'المشاريع | الشحري للتطوير العقاري' : 'Projects | El Shihry Developments';

  return (
    <RouteContentProvider dynamicContent={content} locale={locale}>
      <StructuredData data={buildWebPageSchema({ description, locale, path: '/projects', title })} />
      <ProjectsPageContent />
    </RouteContentProvider>
  );
}
