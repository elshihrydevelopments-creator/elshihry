import { notFound, redirect } from 'next/navigation';

import { getProjectLandingBySlug } from '@/lib/project-landings/queries';
import { ThankYouClient } from './ThankYouClient';

export default async function ThankYouPage(props: {
  params: Promise<{ locale: 'ar' | 'en'; slug: string }>;
  searchParams: Promise<{ name?: string; phone?: string }>;
}) {
  const [{ locale, slug }, searchParams] = await Promise.all([props.params, props.searchParams]);

  // ── Guard: only accessible after form submission ──
  if (!searchParams.name) {
    redirect(`/${locale}/projects/${slug}/land`);
  }

  const landing = await getProjectLandingBySlug(slug);
  if (!landing) notFound();

  const isArabic = locale === 'ar';
  const projectTitle = isArabic ? landing.project.title_ar : landing.project.title_en;
  const clientName = searchParams.name ?? '';
  const clientPhone = searchParams.phone ?? '';
  const seo = landing.sections[locale].seo.data;
  const fbPixelId = seo?.fbPixelId;

  return (
    <ThankYouClient
      locale={locale}
      slug={slug}
      projectTitle={projectTitle ?? slug}
      clientName={clientName}
      clientPhone={clientPhone}
      fbPixelId={fbPixelId}
    />
  );
}
