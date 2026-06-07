import type { Locale, ProjectCard } from '@/lib/site-content';

export const PROJECT_LANDING_SECTION_KEYS = [
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

export const PROJECT_LANDING_STATUSES = ['draft', 'published', 'archived'] as const;
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed', 'spam'] as const;
export const PROJECT_UNIT_AVAILABILITY_STATUSES = ['available', 'reserved', 'sold'] as const;

export type ProjectLandingSectionKey = (typeof PROJECT_LANDING_SECTION_KEYS)[number];
export type ProjectLandingStatus = (typeof PROJECT_LANDING_STATUSES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type ProjectUnitAvailabilityStatus = (typeof PROJECT_UNIT_AVAILABILITY_STATUSES)[number];

export type LandingHeroSection = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroImageUrl: string;
  heroImageAlt: string;
  stats: Array<{ label: string; value: string }>;
};

export type LandingOverviewSection = {
  title: string;
  description: string;
  highlights: string[];
};

export type LandingLifestyleTimelineSection = {
  title: string;
  description: string;
  items: Array<{ title: string; caption: string; imageUrl: string }>;
};

export type LandingBenefitsSection = {
  title: string;
  items: Array<{ title: string; description: string }>;
};

export type LandingLocationMapSection = {
  cardImageUrl: string;
  cardTitle: string;
  description: string;
  eyebrow: string;
  mapHref: string;
  mapImageAlt: string;
  mapImageUrl: string;
  points: string[];
  title: string;
};

export type LandingMasterpieceSection = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export type LandingPanoramicAuraSection = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
  ctaLabel: string;
};

export type LandingTestimonialsSection = {
  title: string;
  items: Array<{ name: string; role: string; quote: string }>;
};

export type LandingFaqSection = {
  title: string;
  items: Array<{ question: string; answer: string }>;
};

export type LandingLeadFormSection = {
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  privacyNote: string;
};

export type LandingSeoSection = {
  title: string;
  description: string;
  ogImage: string;
  indexable: boolean;
  fbPixelId?: string;
};

export type ProjectLandingSectionDataMap = {
  benefits: LandingBenefitsSection;
  faq: LandingFaqSection;
  hero: LandingHeroSection;
  lifestyle_timeline: LandingLifestyleTimelineSection;
  lead_form: LandingLeadFormSection;
  location_map: LandingLocationMapSection;
  masterpiece_details: LandingMasterpieceSection;
  overview: LandingOverviewSection;
  panoramic_aura: LandingPanoramicAuraSection;
  seo: LandingSeoSection;
  testimonials: LandingTestimonialsSection;
};

export type ProjectLandingSectionRecord<K extends ProjectLandingSectionKey = ProjectLandingSectionKey> = {
  created_at?: string;
  data: ProjectLandingSectionDataMap[K];
  id?: string;
  is_enabled: boolean;
  locale: Locale;
  project_landing_id?: string;
  section_key: K;
  sort_order: number;
  updated_at?: string;
};

export type LocalizedLandingSections = Record<
  Locale,
  { [K in ProjectLandingSectionKey]: ProjectLandingSectionRecord<K> }
>;

export type ProjectAggregate = {
  amenities: string[];
  area_name: string | null;
  canonical_slug: string | null;
  city: string | null;
  cover_url: string | null;
  created_at?: string | null;
  delivery_date: string | null;
  description_ar: string;
  description_en: string;
  details: Array<{ id?: string; sort_order: number; text_ar: string; text_en: string }>;
  display_order: number;
  faq_blocks: Array<{
    answer_ar?: string;
    answer_en?: string;
    question_ar?: string;
    question_en?: string;
  }>;
  gallery: Array<{ alt_ar?: string | null; alt_en?: string | null; id?: string; image_url: string; sort_order: number }>;
  governorate: string | null;
  id: string;
  indexable: boolean;
  location_ar: string;
  location_en: string;
  meta_description: string | null;
  nearby_landmarks: string[];
  og_description: string | null;
  og_image: string | null;
  og_title: string | null;
  payment_plan_summary: string | null;
  project_type: string | null;
  published: boolean;
  seo_title: string | null;
  slug: string;
  stats: Array<{ id?: string; label_ar: string; label_en: string; sort_order: number; value: string }>;
  status: string | null;
  title_ar: string;
  title_en: string;
  unit_types: string[];
  updated_at?: string | null;
};

export type ProjectLandingRecord = {
  archived_at: string | null;
  created_at: string | null;
  created_by: string | null;
  id: string;
  project_id: string;
  project_title_ar?: string;
  project_title_en?: string;
  project_slug?: string;
  project_thumbnail?: string | null;
  published_at: string | null;
  status: ProjectLandingStatus;
  thumbnail_url: string | null;
  updated_at: string | null;
  updated_by: string | null;
};

export type ProjectUnitRecord = {
  area_sqm: number | null;
  availability_status: ProjectUnitAvailabilityStatus;
  bathrooms: number | null;
  bedrooms: number | null;
  floor_number: number | null;
  floorplan_url: string | null;
  id: string;
  image_url: string | null;
  price_egp: number | null;
  project_id: string;
  sort_order: number;
  title_ar: string;
  title_en: string;
  unit_type_ar: string;
  unit_type_en: string;
};

export type ProjectLandingMediaKey = 'life_timeline' | 'highlight_bento' | 'day_exterior' | 'night_exterior';

export type ProjectLandingMediaItem = {
  caption: string;
  id: string;
  image_url: string;
  is_enabled: boolean;
  locale: Locale;
  media_key: ProjectLandingMediaKey;
  sort_order: number;
  title: string;
  video_url: string | null;
};

export type ProjectLandingMediaGroups = Record<ProjectLandingMediaKey, ProjectLandingMediaItem[]>;

export type ProjectLandingAggregate = {
  landing: ProjectLandingRecord;
  media: ProjectLandingMediaGroups;
  project: ProjectAggregate;
  sections: LocalizedLandingSections;
  units: ProjectUnitRecord[];
};

export type ProjectLeadRecord = {
  created_at: string;
  email: string | null;
  full_name: string;
  id: string;
  locale: Locale;
  message: string;
  phone: string;
  project_id: string;
  project_landing_id: string;
  project_slug?: string;
  project_title?: string;
  source_path: string;
  status: LeadStatus;
  updated_at?: string;
  whatsapp_number: string | null;
};

export type ProjectLeadInput = {
  email?: string;
  full_name: string;
  locale: Locale;
  message?: string;
  phone: string;
  project_slug: string;
  source_path: string;
  whatsapp_number?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  page_url?: string;
};

export type ProjectLandingEditorPayload = {
  projectId: string;
  sections: LocalizedLandingSections;
  status: ProjectLandingStatus;
  thumbnailUrl: string | null;
};

export type AdminProjectPayload = {
  amenities: string[];
  area_name: string;
  city: string;
  cover_url: string;
  delivery_date: string;
  description_ar: string;
  description_en: string;
  details: Array<{ id?: string; sort_order: number; text_ar: string; text_en: string }>;
  display_order: number;
  faq_blocks: Array<{
    answer_ar?: string;
    answer_en?: string;
    question_ar?: string;
    question_en?: string;
  }>;
  gallery: Array<{ alt_ar?: string; alt_en?: string; id?: string; image_url: string; sort_order: number }>;
  governorate: string;
  id?: string;
  location_ar: string;
  location_en: string;
  payment_plan_summary: string;
  project_type: string;
  published: boolean;
  slug: string;
  stats: Array<{ id?: string; label_ar: string; label_en: string; sort_order: number; value: string }>;
  status: string;
  title_ar: string;
  title_en: string;
  unit_types: string[];
};

export type LocalizedProjectEntry = Partial<Record<Locale, ProjectCard>>;
