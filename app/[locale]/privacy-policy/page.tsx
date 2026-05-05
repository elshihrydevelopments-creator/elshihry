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
        ? 'سياسة الخصوصية الخاصة بموقع الشحري للتطوير العقاري.'
        : 'Privacy policy for El Shihry Developments.',
    locale,
    path: '/privacy-policy',
    title: locale === 'ar' ? 'سياسة الخصوصية | الشحري للتطوير العقاري' : 'Privacy Policy | El Shihry Developments',
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: 'ar' | 'en' }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const title = isArabic ? 'سياسة الخصوصية' : 'Privacy Policy';
  const description = isArabic
    ? 'نوضح هنا كيف نتعامل مع بيانات التواصل والاستفسارات التي ترسل عبر الموقع.'
    : 'This page explains how we handle contact data and inquiries submitted through the website.';

  return (
    <div className="mx-auto max-w-4xl px-6 pt-40 pb-24">
      <StructuredData data={buildWebPageSchema({ description, locale, path: '/privacy-policy', title })} />
      <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
      <div className="mt-10 space-y-8 text-white/70">
        <p>{description}</p>
        <p>
          {isArabic
            ? 'نقوم باستخدام المعلومات التي تقدمها مثل الاسم ورقم الهاتف والبريد الإلكتروني فقط بهدف التواصل معك بخصوص الاستفسار أو الطلب الذي قمت بإرساله.'
            : 'We use the information you provide, such as your name, phone number, and email address, only to respond to your inquiry or request.'}
        </p>
        <p>
          {isArabic
            ? 'لا نقوم ببيع بياناتك أو مشاركتها مع أطراف غير مرتبطة بخدمة الطلب أو الامتثال القانوني.'
            : 'We do not sell your data or share it with unrelated third parties except when required to fulfill your request or comply with legal obligations.'}
        </p>
        <p>
          {isArabic
            ? 'باستخدامك لهذا الموقع فإنك تقر بالموافقة على هذه السياسة وعلى إمكانية تحديثها عند الحاجة.'
            : 'By using this website, you acknowledge this policy and accept that it may be updated when needed.'}
        </p>
      </div>
    </div>
  );
}
