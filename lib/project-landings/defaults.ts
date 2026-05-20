import type { Locale } from '@/lib/site-content';
import type {
  LocalizedLandingSections,
  ProjectAggregate,
  ProjectLandingSectionDataMap,
  ProjectLandingSectionKey,
} from '@/lib/project-landings/types';

const LANDING_SECTION_ORDER: ProjectLandingSectionKey[] = [
  'hero',
  'lifestyle_timeline',
  'overview',
  'benefits',
  'location_map',
  'masterpiece_details',
  'panoramic_aura',
  'testimonials',
  'faq',
  'lead_form',
  'seo',
] as const;

function uniqueList(items: Array<string | null | undefined>) {
  return Array.from(new Set(items.map((item) => item?.trim()).filter(Boolean) as string[]));
}

function buildFaqItems(project: ProjectAggregate, locale: Locale) {
  const fromProjectFaq = (project.faq_blocks ?? [])
    .map((item) => ({
      answer: locale === 'ar' ? item.answer_ar || item.answer_en || '' : item.answer_en || item.answer_ar || '',
      question: locale === 'ar' ? item.question_ar || item.question_en || '' : item.question_en || item.question_ar || '',
    }))
    .filter((item) => item.question && item.answer);

  if (fromProjectFaq.length > 0) {
    return fromProjectFaq;
  }

  return locale === 'ar'
    ? [
        {
          question: 'كيف أتعرف على الأسعار والتفاصيل المتاحة؟',
          answer: 'اترك بياناتك وسيتواصل معك فريقنا بسرعة لتوضيح الأسعار، أنظمة السداد، والوحدات الأنسب لاحتياجك.',
        },
        {
          question: 'هل يمكن ترتيب مكالمة أو زيارة للمشروع؟',
          answer: 'نعم، بعد استلام طلبك يمكن لفريق المبيعات ترتيب مكالمة استشارية أو زيارة وفقًا لاحتياجك وتوقيتك.',
        },
      ]
    : [
        {
          question: 'How can I receive pricing and availability details?',
          answer: 'Leave your details and our team will quickly share pricing, payment options, and the most suitable inventory.',
        },
        {
          question: 'Can I arrange a consultation or site visit?',
          answer: 'Yes. Once you submit your request, our sales team can schedule a consultation call or a project visit.',
        },
      ];
}

function getLocalizedProject(project: ProjectAggregate, locale: Locale) {
  return {
    amenities: project.amenities.filter(Boolean),
    description: locale === 'ar' ? project.description_ar : project.description_en,
    details: project.details.map((detail) => (locale === 'ar' ? detail.text_ar : detail.text_en)).filter(Boolean),
    location: locale === 'ar' ? project.location_ar : project.location_en,
    nearbyLandmarks: project.nearby_landmarks.filter(Boolean),
    stats: project.stats
      .map((stat) => ({
        label: locale === 'ar' ? stat.label_ar : stat.label_en,
        value: stat.value,
      }))
      .filter((stat) => stat.label && stat.value),
    title: locale === 'ar' ? project.title_ar : project.title_en,
    unitTypes: project.unit_types.filter(Boolean),
  };
}

function buildHeroSubheadline(project: ProjectAggregate, locale: Locale, description: string, title: string, location: string) {
  if (description) {
    return locale === 'ar'
      ? `${description} صفحة مخصصة لتوضيح القيمة الشرائية للمشروع، إبراز عناصر المقارنة الحاسمة، وتحويل الاهتمام إلى تواصل فعلي مع فريق المبيعات.`
      : `${description} This focused landing experience is built to clarify the project's value, surface the key buying drivers, and turn interest into a real sales conversation.`;
  }

  return locale === 'ar'
    ? `${title}${location ? ` في ${location}` : ''} يقدم تجربة أوضح للمشتري الجاد: صور، مميزات، عناصر مقارنة، وخطوة تواصل سريعة تساعدك على اتخاذ قرار مدروس.`
    : `${title}${location ? ` in ${location}` : ''} gives serious buyers a clearer path forward with visuals, decision-making details, and a fast next step toward a guided consultation.`;
}

function buildOverviewHighlights(project: ProjectAggregate, locale: Locale, localizedProject: ReturnType<typeof getLocalizedProject>) {
  const details = localizedProject.details.slice(0, 4);
  const extras =
    locale === 'ar'
      ? [
          project.payment_plan_summary ? `أنظمة السداد: ${project.payment_plan_summary}` : null,
          project.delivery_date ? `موعد التسليم: ${project.delivery_date}` : null,
          localizedProject.unitTypes[0] ? `أنواع الوحدات: ${localizedProject.unitTypes.slice(0, 3).join(' - ')}` : null,
          localizedProject.nearbyLandmarks[0] ? `نقاط قريبة: ${localizedProject.nearbyLandmarks.slice(0, 2).join(' - ')}` : null,
        ]
      : [
          project.payment_plan_summary ? `Payment options: ${project.payment_plan_summary}` : null,
          project.delivery_date ? `Delivery target: ${project.delivery_date}` : null,
          localizedProject.unitTypes[0] ? `Unit types: ${localizedProject.unitTypes.slice(0, 3).join(' - ')}` : null,
          localizedProject.nearbyLandmarks[0] ? `Nearby landmarks: ${localizedProject.nearbyLandmarks.slice(0, 2).join(' - ')}` : null,
        ];

  return uniqueList([...details, ...extras]).slice(0, 6);
}

function buildOverviewDescription(project: ProjectAggregate, locale: Locale, description: string, title: string) {
  const deliveryText = project.delivery_date
    ? locale === 'ar'
      ? ` ومع وضوح في موعد التسليم (${project.delivery_date})`
      : ` with a clear delivery target (${project.delivery_date})`
    : '';
  const paymentText = project.payment_plan_summary
    ? locale === 'ar'
      ? ` بالإضافة إلى رؤية أولية لأنظمة السداد`
      : ` plus an early view of the payment structure`
    : '';

  if (description) {
    return locale === 'ar'
      ? `${description} هذه الصفحة تجمع لك أهم النقاط التي يحتاجها المشتري قبل اتخاذ خطوة التواصل${deliveryText}${paymentText}.`
      : `${description} This page brings together the key information buyers want before starting a sales conversation${deliveryText}${paymentText}.`;
  }

  return locale === 'ar'
    ? `${title} مصمم ليمنحك صورة أسرع وأوضح عن قيمة المشروع، أسلوب الحياة المتوقع، والعناصر التي تدعم قرار الشراء${deliveryText}${paymentText}.`
    : `${title} is presented to give you a faster, clearer understanding of the project's value, lifestyle potential, and the details that support a purchase decision${deliveryText}${paymentText}.`;
}

function buildBenefitsItems(project: ProjectAggregate, locale: Locale, localizedProject: ReturnType<typeof getLocalizedProject>) {
  const detailItems = localizedProject.details.slice(0, 4).map((detail, index) => ({
    description: detail,
    title:
      localizedProject.stats[index]?.label ||
      (locale === 'ar' ? `ميزة حاسمة ${index + 1}` : `Key Advantage ${index + 1}`),
  }));

  const extraItems =
    locale === 'ar'
      ? [
          project.project_type
            ? {
                description: `نوع المشروع: ${project.project_type}. هذا يساعدك على فهم طبيعة المنتج العقاري وما إذا كان مناسبًا لأهدافك السكنية أو الاستثمارية.`,
                title: 'منتج عقاري واضح',
              }
            : null,
          project.payment_plan_summary
            ? {
                description: `وجود معلومات أولية عن السداد يسهّل المقارنة بين البدائل ويقربك من قرار شراء عملي.`,
                title: 'مرونة في التخطيط المالي',
              }
            : null,
          localizedProject.amenities[0]
            ? {
                description: `من المزايا المتاحة: ${localizedProject.amenities.slice(0, 4).join(' - ')}.`,
                title: 'عناصر ترفع جودة التجربة',
              }
            : null,
        ]
      : [
          project.project_type
            ? {
                description: `Project type: ${project.project_type}. It helps clarify the real estate product and whether it fits your residential or investment goals.`,
                title: 'A Clear Real Estate Product',
              }
            : null,
          project.payment_plan_summary
            ? {
                description: 'Early visibility on payment structure makes comparison easier and brings you closer to a practical buying decision.',
                title: 'More Flexible Financial Planning',
              }
            : null,
          localizedProject.amenities[0]
            ? {
                description: `Available amenities include ${localizedProject.amenities.slice(0, 4).join(', ')}.`,
                title: 'Experience-Boosting Amenities',
              }
            : null,
        ];

  return [...detailItems, ...extraItems.filter(Boolean)].slice(0, 6) as Array<{ title: string; description: string }>;
}

function buildLeadDescription(project: ProjectAggregate, locale: Locale, title: string) {
  const unitTypes = project.unit_types.filter(Boolean);

  return locale === 'ar'
    ? `اترك بياناتك ليشاركك فريقنا تفاصيل ${title}${unitTypes.length > 0 ? `، أنواع الوحدات المتاحة` : ''}${project.payment_plan_summary ? '، وخيارات السداد' : ''}، ثم يساعدك في تحديد الخطوة الأنسب حسب احتياجك.`
    : `Share your details and our team will walk you through ${title}${unitTypes.length > 0 ? ', available unit types' : ''}${project.payment_plan_summary ? ', payment options' : ''}, and the most suitable next step for your goals.`;
}

function buildSeoDescription(project: ProjectAggregate, locale: Locale, title: string, description: string) {
  if (description) {
    return description;
  }

  return locale === 'ar'
    ? `اكتشف تفاصيل مشروع ${title} من خلال صفحة هبوط تعرض الصور، المميزات، وأهم عناصر قرار الشراء.`
    : `Discover ${title} through a focused landing page built around visuals, advantages, and the key drivers behind the buying decision.`;
}

function buildDefaultSectionData(project: ProjectAggregate, locale: Locale): ProjectLandingSectionDataMap {
  const localizedProject = getLocalizedProject(project, locale);
  const coverImage = project.cover_url || project.gallery[0]?.image_url || '';
  const title = localizedProject.title;
  const description = localizedProject.description;

  return {
    hero: {
      eyebrow: locale === 'ar' ? 'صفحة مخصصة لتحويل الاهتمام إلى تواصل' : 'A Sales-Focused Project Landing',
      headline: title,
      heroImageAlt: title,
      heroImageUrl: coverImage,
      primaryCtaHref: '#lead-form',
      primaryCtaLabel: locale === 'ar' ? 'اطلب الأسعار والتفاصيل' : 'Request Pricing & Details',
      secondaryCtaHref: `/${locale}/projects/${project.slug}`,
      secondaryCtaLabel: locale === 'ar' ? 'عرض صفحة المشروع الكاملة' : 'View Full Project Page',
      stats: localizedProject.stats.slice(0, 3),
      subheadline: buildHeroSubheadline(project, locale, description, title, localizedProject.location),
    },
    lifestyle_timeline: {
      description: locale === 'ar' ? `كيف تبدو الحياة داخل ${title}؟ استكشف التايم لاين الخاص بالحياة اليومية.` : `How it feels to live in ${title}. Explore the daily life timeline.`,
      items: locale === 'ar'
        ? [
            { caption: 'بداية هادئة فوق تفاصيل يوم مصمم بعناية.', imageUrl: coverImage, title: '٧ صباحًا | قهوة بإطلالة' },
            { caption: 'مساحات مشتركة تمنح اليوم إيقاعًا أكثر خصوصية.', imageUrl: coverImage, title: '١٢ ظهرًا | يوم عمل أنيق' },
            { caption: 'نهاية اليوم تتحول إلى تجربة سكنية كاملة.', imageUrl: coverImage, title: '٥ مساءً | استرخاء ومرافق' },
            { caption: 'الإضاءة المعمارية تكشف حضور المشروع بعد الغروب.', imageUrl: coverImage, title: '٩ مساءً | مشهد ليلي' },
          ]
        : [
            { caption: 'A quieter start above a day shaped around considered details.', imageUrl: coverImage, title: '7 AM | Coffee With A View' },
            { caption: 'Shared spaces give the day a more private rhythm.', imageUrl: coverImage, title: '12 PM | Workday Ease' },
            { caption: 'The end of the day becomes a complete residential experience.', imageUrl: coverImage, title: '5 PM | Amenities Time' },
            { caption: 'Architectural lighting gives the project a distinct evening presence.', imageUrl: coverImage, title: '9 PM | Night Arrival' },
          ],
      title: locale === 'ar' ? 'يوم كامل داخل التجربة' : 'A Day in the Life',
    },
    overview: {
      description: buildOverviewDescription(project, locale, description, title),
      highlights: buildOverviewHighlights(project, locale, localizedProject),
      title: locale === 'ar' ? 'لماذا يستحق هذا المشروع اهتمامك؟' : 'Why This Project Deserves Attention',
    },
    benefits: {
      items: buildBenefitsItems(project, locale, localizedProject),
      title: locale === 'ar' ? 'عوامل تدعم قرار الشراء' : 'Decision Drivers That Matter',
    },
    location_map: {
      cardImageUrl: coverImage,
      cardTitle: title,
      description: locale === 'ar' ? `مكان ${title} على الخريطة` : `Where you can find ${title}`,
      eyebrow: locale === 'ar' ? 'الخريطة والموقع' : `Where you can find ${title}`,
      mapHref: '',
      mapImageAlt: locale === 'ar' ? `خريطة موقع ${title}` : `${title} location map`,
      mapImageUrl: coverImage,
      points:
        localizedProject.nearbyLandmarks.length > 0
          ? localizedProject.nearbyLandmarks.slice(0, 3)
          : locale === 'ar'
            ? ['قريب من المحاور الرئيسية', 'موقع يسهل الوصول إليه', 'منطقة واعدة للنمو']
            : ['Close to main roads', 'Easy access location', 'Promising growth area'],
      title: locale === 'ar' ? 'خريطة الموقع' : 'Location Map',
    },
    masterpiece_details: {
      ctaLabel: locale === 'ar' ? 'احصل على دليل المواد والتشطيبات' : 'Get The Materials & Finishes Guide',
      description: locale === 'ar' ? 'المواد ليست خيارات عشوائية. كل عنصر اختير بمعيار واحد: الديمومة والرُّقي.' : 'Materials are not arbitrary choices. Each element was selected by one standard: permanence and refinement.',
      eyebrow: locale === 'ar' ? 'تفاصيل التحفة' : 'The Masterpiece Details',
      title: locale === 'ar' ? 'كل تفصيلة تحكي قرار التميز' : 'Every Detail Speaks Of Excellence',
    },
    panoramic_aura: {
      ctaLabel: locale === 'ar' ? 'تواصل مع المستشار' : 'Speak With An Advisor',
      description: locale === 'ar' ? 'إطلالة لا تُشترى بالمتر. أجواء تُقاس بالتجربة الأولى عند الوصول.' : 'A view not measured in square meters. An atmosphere felt on first arrival.',
      eyebrow: locale === 'ar' ? 'الأجواء البانورامية' : 'The Panoramic Aura',
      metrics: locale === 'ar'
        ? [
            { label: 'الموقع', value: project.area_name || 'زايد' },
            { label: 'الطابع', value: 'حصري' },
            { label: 'المشهد', value: '٣٦٠°' },
          ]
        : [
            { label: 'Location', value: project.area_name || 'Zayed' },
            { label: 'Character', value: 'Exclusive' },
            { label: 'Panorama', value: '360°' },
          ],
      title: locale === 'ar' ? 'الموقع يعيد تعريف التوقعات' : 'The Location Redefines Expectations',
    },
    testimonials: {
      items: [],
      title: locale === 'ar' ? 'آراء وتجارب' : 'Testimonials',
    },
    faq: {
      items: buildFaqItems(project, locale),
      title: locale === 'ar' ? 'أسئلة قبل اتخاذ الخطوة التالية' : 'Questions Before The Next Step',
    },
    lead_form: {
      description: buildLeadDescription(project, locale, title),
      privacyNote:
        locale === 'ar'
          ? 'بياناتك تستخدم فقط للتواصل معك بخصوص هذا المشروع وتقديم التفاصيل المطلوبة.'
          : 'Your details are only used to contact you about this project and share the requested information.',
      submitLabel: locale === 'ar' ? 'أرسل الطلب الآن' : 'Send My Request',
      successMessage:
        locale === 'ar'
          ? 'تم استلام طلبك بنجاح وسيقوم فريقنا بالتواصل معك في أقرب وقت.'
          : 'Your request has been received successfully. Our team will contact you shortly.',
      title: locale === 'ar' ? 'ابدأ المحادثة مع فريق المبيعات' : 'Start The Conversation With Sales',
    },
    seo: {
      description: buildSeoDescription(project, locale, title, description),
      indexable: true,
      ogImage: coverImage,
      title: locale === 'ar' ? `${title} | صفحة هبوط المشروع` : `${title} | Project Landing`,
    },
  };
}

export function buildDefaultLandingSections(project: ProjectAggregate): LocalizedLandingSections {
  const arSections = {} as LocalizedLandingSections['ar'];
  const enSections = {} as LocalizedLandingSections['en'];

  LANDING_SECTION_ORDER.forEach((sectionKey, index) => {
    const arDataMap = buildDefaultSectionData(project, 'ar');
    const enDataMap = buildDefaultSectionData(project, 'en');

    (arSections as any)[sectionKey] = {
      data: arDataMap[sectionKey],
      is_enabled: true,
      locale: 'ar',
      section_key: sectionKey,
      sort_order: index,
    };

    (enSections as any)[sectionKey] = {
      data: enDataMap[sectionKey],
      is_enabled: true,
      locale: 'en',
      section_key: sectionKey,
      sort_order: index,
    };
  });

  return {
    ar: arSections,
    en: enSections,
  };
}
