import type { Metadata } from 'next';

import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { AboutPageContent } from '@/components/pages/AboutPageContent';
import { getRouteContent } from '@/lib/data/route-content';
import { buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getRouteContent(['about', 'aboutLeadership', 'aboutValues', 'philosophy']);
  const about = content[locale]?.about;

  return buildLocalizedMetadata({
    description: about?.paragraphs?.[0] || 'About El Shihry Developments.',
    locale,
    path: '/about',
    title: locale === 'ar' ? 'من نحن | الشهري للتطوير العقاري' : 'About | El Shihry Developments',
  });
}

export default async function LocalizedAboutPage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const content = await getRouteContent(['about', 'aboutLeadership', 'aboutValues', 'philosophy']);
  const about = content[locale]?.about;
  const description = about?.paragraphs?.[0] || 'About El Shihry Developments.';
  const title = locale === 'ar' ? 'من نحن | الشهري للتطوير العقاري' : 'About | El Shihry Developments';

  return (
    <RouteContentProvider dynamicContent={content} locale={locale}>
      <StructuredData data={buildWebPageSchema({ description, locale, path: '/about', title })} />
      <AboutPageContent />
    </RouteContentProvider>
  );
}
