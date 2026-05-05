import type { Metadata } from 'next';

import { StructuredData } from '@/components/StructuredData';
import { buildLocalizedMetadata, buildWebPageSchema } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildLocalizedMetadata({
    description:
      locale === 'ar'
        ? 'الشروط والأحكام الخاصة باستخدام موقع الشحري للتطوير العقاري.'
        : 'Terms of use for El Shihry Developments.',
    locale,
    path: '/terms',
    title: locale === 'ar' ? 'الشروط والأحكام | الشحري للتطوير العقاري' : 'Terms of Use | El Shihry Developments',
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const title = isArabic ? 'الشروط والأحكام' : 'Terms of Use';
  const description = isArabic
    ? 'تحدد هذه الصفحة القواعد العامة لاستخدام الموقع والمعلومات المنشورة عليه.'
    : 'This page sets the general rules governing use of the website and the information published on it.';

  return (
    <div className="mx-auto max-w-4xl px-6 pt-40 pb-24">
      <StructuredData data={buildWebPageSchema({ description, locale, path: '/terms', title })} />
      <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
      <div className="mt-10 space-y-8 text-white/70">
        <p>{description}</p>
        <p>
          {isArabic
            ? 'المحتوى الوارد في الموقع هو لأغراض تعريفية وتسويقية عامة، وقد يخضع للتحديث أو التعديل دون إشعار مسبق.'
            : 'The website content is provided for general informational and marketing purposes and may be updated or revised without prior notice.'}
        </p>
        <p>
          {isArabic
            ? 'أي مواعيد أو أسعار أو خطط سداد أو مواصفات يتم تأكيدها فقط من خلال التواصل الرسمي المباشر مع فريق الشركة.'
            : 'Any dates, prices, payment plans, or specifications are confirmed only through direct official communication with the company team.'}
        </p>
        <p>
          {isArabic
            ? 'استخدامك للموقع يعني موافقتك على هذه الشروط وعلى أي تحديثات مستقبلية تطرأ عليها.'
            : 'Your continued use of the website means you accept these terms and any future updates to them.'}
        </p>
      </div>
    </div>
  );
}
