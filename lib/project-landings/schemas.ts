import { z } from 'zod';

import { LEAD_STATUSES, PROJECT_LANDING_SECTION_KEYS, PROJECT_LANDING_STATUSES } from '@/lib/project-landings/types';

const textArraySchema = z.array(z.string().trim());

export const projectLandingStatusSchema = z.enum(PROJECT_LANDING_STATUSES);
export const projectLandingSectionKeySchema = z.enum(PROJECT_LANDING_SECTION_KEYS);
export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const landingHeroSectionSchema = z.object({
  eyebrow: z.string().trim().default(''),
  headline: z.string().trim().min(1),
  heroImageAlt: z.string().trim().default(''),
  heroImageUrl: z.string().trim().default(''),
  primaryCtaHref: z.string().trim().default('#lead-form'),
  primaryCtaLabel: z.string().trim().min(1),
  secondaryCtaHref: z.string().trim().default('/projects'),
  secondaryCtaLabel: z.string().trim().default(''),
  stats: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        value: z.string().trim().min(1),
      })
    )
    .max(4)
    .default([]),
  subheadline: z.string().trim().min(1),
});

export const landingOverviewSectionSchema = z.object({
  description: z.string().trim().min(1),
  highlights: textArraySchema.max(6).default([]),
  title: z.string().trim().min(1),
});

export const landingBenefitsSectionSchema = z.object({
  items: z
    .array(
      z.object({
        description: z.string().trim().min(1),
        title: z.string().trim().min(1),
      })
    )
    .max(6)
    .default([]),
  title: z.string().trim().min(1),
});

export const landingLocationMapSectionSchema = z.object({
  cardImageUrl: z.string().trim().default(''),
  cardTitle: z.string().trim().default(''),
  description: z.string().trim().default(''),
  eyebrow: z.string().trim().default(''),
  mapHref: z.string().trim().default(''),
  mapImageAlt: z.string().trim().default(''),
  mapImageUrl: z.string().trim().default(''),
  points: textArraySchema.max(6).default([]),
  title: z.string().trim().default('Location Map'),
});

export const landingTestimonialsSectionSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        quote: z.string().trim().min(1),
        role: z.string().trim().min(1),
      })
    )
    .max(6)
    .default([]),
  title: z.string().trim().min(1),
});

export const landingFaqSectionSchema = z.object({
  items: z
    .array(
      z.object({
        answer: z.string().trim().min(1),
        question: z.string().trim().min(1),
      })
    )
    .max(10)
    .default([]),
  title: z.string().trim().min(1),
});

export const landingLeadFormSectionSchema = z.object({
  description: z.string().trim().min(1),
  privacyNote: z.string().trim().min(1),
  submitLabel: z.string().trim().min(1),
  successMessage: z.string().trim().min(1),
  title: z.string().trim().min(1),
});

export const landingSeoSectionSchema = z.object({
  description: z.string().trim().min(1),
  indexable: z.boolean().default(true),
  ogImage: z.string().trim().default(''),
  title: z.string().trim().min(1),
});

export const landingLifestyleTimelineSectionSchema = z.object({
  description: z.string().trim().min(1),
  items: z
    .array(
      z.object({
        caption: z.string().trim().min(1),
        imageUrl: z.string().trim().default(''),
        title: z.string().trim().min(1),
      })
    )
    .default([]),
  title: z.string().trim().min(1),
});

export const landingMasterpieceSectionSchema = z.object({
  ctaLabel: z.string().trim().min(1),
  description: z.string().trim().min(1),
  eyebrow: z.string().trim().default(''),
  title: z.string().trim().min(1),
});

export const landingPanoramicAuraSectionSchema = z.object({
  ctaLabel: z.string().trim().min(1),
  description: z.string().trim().min(1),
  eyebrow: z.string().trim().default(''),
  metrics: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        value: z.string().trim().min(1),
      })
    )
    .default([]),
  title: z.string().trim().min(1),
});

export const landingSectionDataSchemaMap = {
  benefits: landingBenefitsSectionSchema,
  faq: landingFaqSectionSchema,
  hero: landingHeroSectionSchema,
  lead_form: landingLeadFormSectionSchema,
  lifestyle_timeline: landingLifestyleTimelineSectionSchema,
  location_map: landingLocationMapSectionSchema,
  masterpiece_details: landingMasterpieceSectionSchema,
  overview: landingOverviewSectionSchema,
  panoramic_aura: landingPanoramicAuraSectionSchema,
  seo: landingSeoSectionSchema,
  testimonials: landingTestimonialsSectionSchema,
} as const;

export const landingSectionRecordSchema = z.object({
  data: z.unknown(),
  is_enabled: z.boolean().default(true),
  locale: z.enum(['ar', 'en']),
  section_key: projectLandingSectionKeySchema,
  sort_order: z.number().int().nonnegative(),
});

export const projectLandingEditorPayloadSchema = z.object({
  projectId: z.string().uuid(),
  sections: z.object({
    ar: z.record(z.string(), z.unknown()),
    en: z.record(z.string(), z.unknown()),
  }),
  status: projectLandingStatusSchema,
  thumbnailUrl: z.string().trim().nullable(),
});

export const projectLeadInputSchema = z.object({
  email: z.string().trim().email().optional().or(z.literal('')),
  full_name: z.string().trim().min(2).max(120),
  locale: z.enum(['ar', 'en']),
  message: z.string().trim().max(2000).optional().default(''),
  phone: z.string().trim().min(6).max(30),
  project_slug: z.string().trim().min(1),
  source_path: z.string().trim().min(1),
  whatsapp_number: z.string().trim().min(6).max(30).optional().or(z.literal('')),
  utm_source: z.string().trim().optional().default(''),
  utm_medium: z.string().trim().optional().default(''),
  utm_campaign: z.string().trim().optional().default(''),
  page_url: z.string().trim().optional().default(''),
});

export const adminProjectPayloadSchema = z.object({
  amenities: textArraySchema.default([]),
  area_name: z.string().trim().default(''),
  city: z.string().trim().default(''),
  cover_url: z.string().trim().default(''),
  delivery_date: z.string().trim().default(''),
  description_ar: z.string().trim().min(1),
  description_en: z.string().trim().min(1),
  details: z.array(
    z.object({
      id: z.string().uuid().optional(),
      sort_order: z.number().int().nonnegative(),
      text_ar: z.string().trim().min(1),
      text_en: z.string().trim().min(1),
    })
  ),
  display_order: z.number().int().nonnegative().default(0),
  faq_blocks: z
    .array(
      z.object({
        answer_ar: z.string().trim().optional().default(''),
        answer_en: z.string().trim().optional().default(''),
        question_ar: z.string().trim().optional().default(''),
        question_en: z.string().trim().optional().default(''),
      })
    )
    .default([]),
  gallery: z.array(
    z.object({
      alt_ar: z.string().trim().optional().default(''),
      alt_en: z.string().trim().optional().default(''),
      id: z.string().uuid().optional(),
      image_url: z.string().trim().min(1),
      sort_order: z.number().int().nonnegative(),
    })
  ),
  governorate: z.string().trim().default(''),
  id: z.string().uuid().optional(),
  location_ar: z.string().trim().min(1),
  location_en: z.string().trim().min(1),
  payment_plan_summary: z.string().trim().default(''),
  project_type: z.string().trim().default(''),
  published: z.boolean().default(true),
  slug: z.string().trim().min(1),
  stats: z.array(
    z.object({
      id: z.string().uuid().optional(),
      label_ar: z.string().trim().min(1),
      label_en: z.string().trim().min(1),
      sort_order: z.number().int().nonnegative(),
      value: z.string().trim().min(1),
    })
  ),
  status: z.string().trim().default(''),
  title_ar: z.string().trim().min(1),
  title_en: z.string().trim().min(1),
  unit_types: textArraySchema.default([]),
});
