import type { Metadata } from 'next';

import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { BlogPageContent } from '@/components/pages/BlogPageContent';
import { getRouteContent } from '@/lib/data/route-content';
import { buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getRouteContent(['blog']);
  const blog = content[locale]?.blog;

  return buildLocalizedMetadata({
    description: blog?.description || 'El Shihry blog and market updates.',
    locale,
    path: '/blog',
    title: locale === 'ar' ? 'المدونة | الشحري للتطوير العقاري' : 'Blog | El Shihry Developments',
  });
}

export default async function LocalizedBlogPage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const content = await getRouteContent(['blog']);
  const blog = content[locale]?.blog;
  const description = blog?.description || 'El Shihry blog and market updates.';
  const title = locale === 'ar' ? 'المدونة | الشحري للتطوير العقاري' : 'Blog | El Shihry Developments';

  return (
    <RouteContentProvider dynamicContent={content} locale={locale}>
      <StructuredData data={buildWebPageSchema({ description, locale, path: '/blog', title })} />
      <BlogPageContent />
    </RouteContentProvider>
  );
}
