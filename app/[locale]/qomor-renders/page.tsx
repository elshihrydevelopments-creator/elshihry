import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { QomorLandingPageClient } from '@/components/project-land/QomorLandingPageClient';
import { RouteContentProvider } from '@/components/RouteContentProvider';
import { StructuredData } from '@/components/StructuredData';
import { buildBreadcrumbSchema, buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';
import { getProjectLandingBySlug } from '@/lib/project-landings/queries';
import { getRouteContent } from '@/lib/data/route-content';
import { buildDefaultLandingSections } from '@/lib/project-landings/defaults';
import type { ProjectAggregate, ProjectLandingAggregate } from '@/lib/project-landings/types';

// Force dynamic because it relies on headers/cookies via createClient()
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: 'ar' | 'en' }>;
};

// Localized mock values if database row is not yet created
function getMockLanding(locale: 'ar' | 'en'): ProjectLandingAggregate {
  const isArabic = locale === 'ar';
  
  const mockProject: ProjectAggregate = {
    id: 'qomor-renders-temp-id',
    slug: 'qomor-renders',
    title_ar: 'قمر ريندرز',
    title_en: 'Qomor Renders',
    location_ar: 'التجمع الخامس، القاهرة الجديدة',
    location_en: 'Fifth Settlement, New Cairo',
    description_ar: 'مشروع قمر ريندرز يمثل قمة التصميمات المعمارية ثلاثية الأبعاد والمخططات الهندسية الفاخرة للشركة، مع تجربة بصرية سينمائية غامرة.',
    description_en: 'Qomor Renders delivers the pinnacle of luxury 3D architectural renders and engineering layouts by El Shihry Developments.',
    cover_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    seo_title: isArabic ? 'قمر ريندرز | تصاميم ثلاثية الأبعاد فاخرة' : 'Qomor Renders | Luxury 3D Architectural Designs',
    meta_description: isArabic ? 'استكشف رندرات وتصاميم ثلاثية الأبعاد لمشروع قمر ريندرز الفاخر.' : 'Discover luxury 3D rendering designs for Qomor Renders project.',
    og_title: 'Qomor Renders',
    og_description: 'Luxury Architectural 3D Rendering Designs',
    og_image: null,
    canonical_slug: 'qomor-renders',
    indexable: true,
    project_type: isArabic ? 'تصميمات ورندرات فاخرة' : 'Luxury Renders',
    status: isArabic ? 'إطلاق قريب' : 'Launching Soon',
    delivery_date: '2027',
    area_name: isArabic ? 'القاهرة الجديدة' : 'New Cairo',
    city: isArabic ? 'القاهرة' : 'Cairo',
    governorate: isArabic ? 'القاهرة' : 'Cairo',
    amenities: isArabic
      ? ['تصاميم معمارية حديثة', 'إضاءة واقعية متطورة', 'مخططات هندسية كاملة', 'إكساء ومواد مستدامة']
      : ['Modern Architecture', 'Advanced Lighting', 'Full Design Layouts', 'Sustainable Textures'],
    unit_types: isArabic
      ? ['رندرات الفلل الفاخرة', 'رندرات الشقق السكنية', 'رندرات البنتهاوس']
      : ['Villa Renders', 'Apartment Renders', 'Penthouse Renders'],
    payment_plan_summary: isArabic ? 'تسهيلات سداد حتى ٧ سنوات' : 'Up to 7 years payment options',
    nearby_landmarks: isArabic ? ['الجامعة الأمريكية بالقاهرة', 'شارع التسعين'] : ['AUC Campus', 'El Teseen St.'],
    faq_blocks: [],
    display_order: 100,
    published: true,
    details: [],
    stats: [
      { id: '1', label_ar: 'تصميم ثلاثي أبعاد', label_en: '3D Renders', sort_order: 0, value: '48+' },
      { id: '2', label_ar: 'دقة العرض', label_en: 'Visual Quality', sort_order: 1, value: '8K Ultra' },
      { id: '3', label_ar: 'مستشاري التصميم', label_en: 'Lead Advisors', sort_order: 2, value: 'خبراء إيطاليا' },
      { id: '4', label_ar: 'أنظمة سداد', label_en: 'Payment Years', sort_order: 3, value: 'تصل لـ ٧ سنوات' },
    ],
    gallery: [],
  };

  return {
    landing: {
      archived_at: null,
      created_at: new Date().toISOString(),
      created_by: null,
      id: 'qomor-renders-landing-temp-id',
      project_id: 'qomor-renders-temp-id',
      project_slug: 'qomor-renders',
      project_title_ar: mockProject.title_ar,
      project_title_en: mockProject.title_en,
      published_at: new Date().toISOString(),
      status: 'published',
      thumbnail_url: mockProject.cover_url,
      updated_at: new Date().toISOString(),
      updated_by: null,
    },
    media: {
      day_exterior: [],
      highlight_bento: [],
      life_timeline: [],
      night_exterior: [],
    },
    project: mockProject,
    sections: buildDefaultLandingSections(mockProject),
    units: [],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  let landing = null;

  try {
    landing = await getProjectLandingBySlug('qomor-renders');
  } catch {
    // Graceful error fallback
  }

  if (!landing) {
    const fallback = getMockLanding(locale);
    const seo = fallback.sections[locale].seo.data;
    return buildLocalizedMetadata({
      description: seo.description,
      image: fallback.project.cover_url || undefined,
      locale,
      path: '/qomor-renders',
      title: seo.title,
    });
  }

  const seo = landing.sections[locale].seo.data;

  return buildLocalizedMetadata({
    description: seo.description,
    image: seo.ogImage || landing.project.cover_url || undefined,
    locale,
    noIndex: !seo.indexable,
    path: '/qomor-renders',
    title: seo.title,
  });
}

export default async function QomorRendersLandingPage({ params }: PageProps) {
  const { locale } = await params;
  let landing = null;
  let dynamicContent = null;

  try {
    [landing, dynamicContent] = await Promise.all([
      getProjectLandingBySlug('qomor-renders'),
      getRouteContent(['nav', 'footer']),
    ]);
  } catch (err) {
    console.error('[QomorRendersLandingPage] Data fetch failed:', err);
    notFound();
  }

  // Fallback to beautiful default mock project if database has not yet been seeded
  if (!landing) {
    landing = getMockLanding(locale);
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
            path: '/qomor-renders',
            title: seo.title,
          }),
          buildBreadcrumbSchema(locale, [
            { name: locale === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
            { name: localizedProjectTitle, path: '/qomor-renders' },
          ]),
        ]}
      />
      <QomorLandingPageClient landing={landing} locale={locale} />
    </RouteContentProvider>
  );
}
