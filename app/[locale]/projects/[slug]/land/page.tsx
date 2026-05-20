import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectLandingPageClient } from '@/components/project-land/ProjectLandingPageClient';
import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { buildBreadcrumbSchema, buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';
import { getProjectLandingBySlug } from '@/lib/project-landings/queries';
import { getRouteContent } from '@/lib/data/route-content';

// Always render dynamically — this page relies on cookies() via createClient()
// and must never be statically generated at build time.
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: 'ar' | 'en'; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  let landing = null;
  try {
    landing = await getProjectLandingBySlug(slug);
  } catch {
    // Fall back to a generic no-index tag if data fetch fails
  }

  if (!landing) {
    return buildLocalizedMetadata({
      description: 'Project landing page is not available.',
      locale,
      noIndex: true,
      path: `/projects/${slug}/land`,
      title: 'Project Landing | El Shihry',
    });
  }

  const seo = landing.sections[locale].seo.data;

  return buildLocalizedMetadata({
    description: seo.description,
    image: seo.ogImage || landing.project.cover_url || undefined,
    locale,
    noIndex: !seo.indexable,
    path: `/projects/${slug}/land`,
    title: seo.title,
  });
}

export default async function ProjectLandingPage({ params }: PageProps) {
  const { locale, slug } = await params;

  let landing = null;
  let dynamicContent = null;

  try {
    [landing, dynamicContent] = await Promise.all([
      getProjectLandingBySlug(slug),
      getRouteContent(['nav', 'footer']),
    ]);
  } catch (err) {
    console.error(`[ProjectLandingPage] Data fetch failed for slug="${slug}":`, err);
    notFound();
  }

  if (!landing) {
    notFound();
  }

  const seo = landing.sections[locale].seo.data;
  const localizedProjectTitle = locale === 'ar' ? landing.project.title_ar : landing.project.title_en;

  return (
    <RouteContentProvider dynamicContent={dynamicContent} locale={locale}>
      <StructuredData
        data={[
          buildWebPageSchema({
            description: seo.description,
            locale,
            path: `/projects/${slug}/land`,
            title: seo.title,
          }),
          buildBreadcrumbSchema(locale, [
            { name: locale === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
            { name: locale === 'ar' ? 'المشاريع' : 'Projects', path: '/projects' },
            { name: localizedProjectTitle, path: `/projects/${slug}` },
            { name: locale === 'ar' ? 'صفحة المشروع' : 'Project Landing', path: `/projects/${slug}/land` },
          ]),
        ]}
      />
      <ProjectLandingPageClient landing={landing} locale={locale} />
    </RouteContentProvider>
  );
}
