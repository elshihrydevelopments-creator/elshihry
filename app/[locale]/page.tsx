import type { Metadata } from 'next';

import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Philosophy } from '@/components/Philosophy';
import { ProjectsBento } from '@/components/ProjectsBento';
import { WhyInvest } from '@/components/WhyInvest';
import { ArchitecturalExcellence } from '@/components/ArchitecturalExcellence';
import { FunctionalSections } from '@/components/FunctionalSections';
import { Marquee } from '@/components/Marquee';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { getRouteContent } from '@/lib/data/route-content';
import { buildLocalizedMetadata, buildOrganizationSchema, buildWebPageSchema, buildWebsiteSchema } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = await getRouteContent(['hero', 'about']);
  const hero = content[locale]?.hero;
  const about = content[locale]?.about;

  return buildLocalizedMetadata({
    description: hero?.subtitle || about?.paragraphs?.[0] || 'Luxury real estate developments in Egypt.',
    locale,
    path: '/',
    title:
      locale === 'ar'
        ? 'الشحري للتطوير العقاري | عقارات فاخرة في مصر'
        : 'El Shihry Developments | Luxury Real Estate in Egypt',
  });
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const sectionKeys = ['hero', 'about', 'philosophy', 'projects', 'whyInvest', 'arch', 'marquee', 'lifestyle', 'blog'] as const;
  const content = await getRouteContent([...sectionKeys]);
  const hero = content[locale]?.hero;
  const about = content[locale]?.about;
  const title =
    locale === 'ar'
      ? 'الشحري للتطوير العقاري | عقارات فاخرة في مصر'
      : 'El Shihry Developments | Luxury Real Estate in Egypt';
  const description = hero?.subtitle || about?.paragraphs?.[0] || 'Luxury real estate developments in Egypt.';

  return (
    <RouteContentProvider
      dynamicContent={content}
      locale={locale}
    >
      <StructuredData
        data={[
          {
            ...buildOrganizationSchema(),
            '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://elshihry.com'}/#organization`,
          },
          buildWebsiteSchema(locale),
          buildWebPageSchema({ description, locale, path: '/', title }),
        ]}
      />
      <div className="bg-rich-black min-h-screen overflow-hidden">
        <Hero />
        <About />
        <Philosophy />
        <ProjectsBento />
        <WhyInvest />
        <ArchitecturalExcellence />
        <Marquee />
        <HorizontalScroll />
        <FunctionalSections />
      </div>
    </RouteContentProvider>
  );
}
