import type { Metadata } from 'next';

import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { ContactPageContent } from '@/components/pages/ContactPageContent';
import { getRouteContent } from '@/lib/data/route-content';
import { buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getRouteContent(['contactPage']);
  const contact = content[locale]?.contactPage;

  return buildLocalizedMetadata({
    description: contact?.description || 'Contact El Shihry Developments.',
    locale,
    path: '/contact',
    title: locale === 'ar' ? 'تواصل | الشحري للتطوير العقاري' : 'Contact | El Shihry Developments',
  });
}

export default async function LocalizedContactPage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const content = await getRouteContent(['contactPage', 'footer', 'contact']);
  const contact = content[locale]?.contactPage;
  const description = contact?.description || 'Contact El Shihry Developments.';
  const title = locale === 'ar' ? 'تواصل | الشحري للتطوير العقاري' : 'Contact | El Shihry Developments';

  return (
    <RouteContentProvider dynamicContent={content} locale={locale}>
      <StructuredData data={buildWebPageSchema({ description, locale, path: '/contact', title })} />
      <ContactPageContent />
    </RouteContentProvider>
  );
}
