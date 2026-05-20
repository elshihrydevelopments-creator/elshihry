import type { Locale, ProjectCard } from '@/lib/site-content';
import { siteContent } from '@/lib/site-content';
import { landingSectionDataSchemaMap } from '@/lib/project-landings/schemas';
import { buildDefaultLandingSections } from '@/lib/project-landings/defaults';
import type {
  LocalizedLandingSections,
  ProjectAggregate,
  ProjectLandingAggregate,
  ProjectLandingMediaGroups,
  ProjectLandingMediaItem,
  ProjectLandingMediaKey,
  ProjectLandingRecord,
  ProjectLandingSectionRecord,
  ProjectLandingSectionKey,
  ProjectUnitAvailabilityStatus,
  ProjectUnitRecord,
} from '@/lib/project-landings/types';

type ProjectRow = {
  amenities?: string[] | null;
  area_name?: string | null;
  canonical_slug?: string | null;
  city?: string | null;
  cover_url?: string | null;
  created_at?: string | null;
  delivery_date?: string | null;
  description_ar: string;
  description_en: string;
  display_order?: number | null;
  faq_blocks?: Array<{
    answer_ar?: string;
    answer_en?: string;
    question_ar?: string;
    question_en?: string;
  }> | null;
  governorate?: string | null;
  id: string;
  indexable?: boolean | null;
  location_ar?: string | null;
  location_en?: string | null;
  meta_description?: string | null;
  nearby_landmarks?: string[] | null;
  og_description?: string | null;
  og_image?: string | null;
  og_title?: string | null;
  payment_plan_summary?: string | null;
  project_details?: Array<{ id?: string; detail_ar: string; detail_en: string; sort_order?: number | null }> | null;
  project_gallery?: Array<{ alt_ar?: string | null; alt_en?: string | null; id?: string; image_url: string; sort_order?: number | null }> | null;
  project_stats?: Array<{ id?: string; label_ar: string; label_en: string; sort_order?: number | null; value: string }> | null;
  project_type?: string | null;
  published?: boolean | null;
  seo_title?: string | null;
  slug: string;
  status?: string | null;
  title_ar: string;
  title_en: string;
  unit_types?: string[] | null;
  updated_at?: string | null;
};

type LandingRow = {
  archived_at?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  id: string;
  project_id: string;
  projects?: ProjectRow | ProjectRow[] | null;
  published_at?: string | null;
  status: string;
  thumbnail_url?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
};

type LandingSectionRow = {
  created_at?: string;
  data: unknown;
  id?: string;
  is_enabled?: boolean | null;
  locale: Locale;
  project_landing_id: string;
  section_key: ProjectLandingSectionKey;
  sort_order?: number | null;
  updated_at?: string;
};

type ProjectUnitRow = {
  area_sqm?: number | null;
  availability_status?: string | null;
  bathrooms?: number | null;
  bedrooms?: number | null;
  floor_number?: number | null;
  floorplan_url?: string | null;
  id: string;
  image_url?: string | null;
  price_egp?: number | null;
  project_id: string;
  sort_order?: number | null;
  title_ar?: string | null;
  title_en?: string | null;
  unit_type_ar?: string | null;
  unit_type_en?: string | null;
};

type ProjectLandingMediaRow = {
  caption?: string | null;
  id: string;
  image_url?: string | null;
  is_enabled?: boolean | null;
  locale: Locale;
  media_key: string;
  sort_order?: number | null;
  title?: string | null;
  video_url?: string | null;
};

const MEDIA_KEYS: ProjectLandingMediaKey[] = ['life_timeline', 'highlight_bento', 'day_exterior', 'night_exterior'];

export function normalizeProjectRow(row: ProjectRow): ProjectAggregate {
  return {
    amenities: row.amenities ?? [],
    area_name: row.area_name ?? null,
    canonical_slug: row.canonical_slug ?? null,
    city: row.city ?? null,
    cover_url: row.cover_url ?? null,
    created_at: row.created_at ?? null,
    delivery_date: row.delivery_date ?? null,
    description_ar: row.description_ar,
    description_en: row.description_en,
    details: (row.project_details ?? [])
      .map((detail) => ({
        id: detail.id,
        sort_order: detail.sort_order ?? 0,
        text_ar: detail.detail_ar,
        text_en: detail.detail_en,
      }))
      .sort((a, b) => a.sort_order - b.sort_order),
    display_order: row.display_order ?? 0,
    faq_blocks: row.faq_blocks ?? [],
    gallery: (row.project_gallery ?? [])
      .map((image) => ({
        alt_ar: image.alt_ar ?? null,
        alt_en: image.alt_en ?? null,
        id: image.id,
        image_url: image.image_url,
        sort_order: image.sort_order ?? 0,
      }))
      .sort((a, b) => a.sort_order - b.sort_order),
    governorate: row.governorate ?? null,
    id: row.id,
    indexable: row.indexable ?? true,
    location_ar: row.location_ar ?? '',
    location_en: row.location_en ?? row.location_ar ?? '',
    meta_description: row.meta_description ?? null,
    nearby_landmarks: row.nearby_landmarks ?? [],
    og_description: row.og_description ?? null,
    og_image: row.og_image ?? null,
    og_title: row.og_title ?? null,
    payment_plan_summary: row.payment_plan_summary ?? null,
    project_type: row.project_type ?? null,
    published: row.published ?? true,
    seo_title: row.seo_title ?? null,
    slug: row.slug,
    stats: (row.project_stats ?? [])
      .map((stat) => ({
        id: stat.id,
        label_ar: stat.label_ar,
        label_en: stat.label_en,
        sort_order: stat.sort_order ?? 0,
        value: stat.value,
      }))
      .sort((a, b) => a.sort_order - b.sort_order),
    status: row.status ?? null,
    title_ar: row.title_ar,
    title_en: row.title_en,
    unit_types: row.unit_types ?? [],
    updated_at: row.updated_at ?? null,
  };
}

export function normalizeProjectUnits(rows: ProjectUnitRow[] | null | undefined): ProjectUnitRecord[] {
  return (rows ?? [])
    .map((row) => {
      const availabilityStatus: ProjectUnitAvailabilityStatus =
        row.availability_status === 'reserved' || row.availability_status === 'sold' ? row.availability_status : 'available';

      return {
        area_sqm: row.area_sqm ?? null,
        availability_status: availabilityStatus,
        bathrooms: row.bathrooms ?? null,
        bedrooms: row.bedrooms ?? null,
        floor_number: row.floor_number ?? null,
        floorplan_url: row.floorplan_url ?? null,
        id: row.id,
        image_url: row.image_url ?? null,
        price_egp: row.price_egp ?? null,
        project_id: row.project_id,
        sort_order: row.sort_order ?? 0,
        title_ar: row.title_ar ?? '',
        title_en: row.title_en ?? row.title_ar ?? '',
        unit_type_ar: row.unit_type_ar ?? '',
        unit_type_en: row.unit_type_en ?? row.unit_type_ar ?? '',
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function normalizeLandingMedia(rows: ProjectLandingMediaRow[] | null | undefined): ProjectLandingMediaGroups {
  const groups = MEDIA_KEYS.reduce(
    (current, key) => ({
      ...current,
      [key]: [],
    }),
    {} as ProjectLandingMediaGroups
  );

  (rows ?? []).forEach((row) => {
    if (!MEDIA_KEYS.includes(row.media_key as ProjectLandingMediaKey) || row.is_enabled === false || !row.image_url) {
      return;
    }

    groups[row.media_key as ProjectLandingMediaKey].push({
      caption: row.caption ?? '',
      id: row.id,
      image_url: row.image_url,
      is_enabled: row.is_enabled ?? true,
      locale: row.locale,
      media_key: row.media_key as ProjectLandingMediaKey,
      sort_order: row.sort_order ?? 0,
      title: row.title ?? '',
      video_url: row.video_url ?? null,
    } satisfies ProjectLandingMediaItem);
  });

  MEDIA_KEYS.forEach((key) => {
    groups[key].sort((a, b) => a.sort_order - b.sort_order);
  });

  return groups;
}

export function projectToProjectCard(project: ProjectAggregate, locale: Locale): ProjectCard {
  return {
    amenities: project.amenities,
    area_name: project.area_name ?? undefined,
    canonical_slug: project.canonical_slug ?? undefined,
    city: project.city ?? undefined,
    cover_url: project.cover_url ?? undefined,
    delivery_date: project.delivery_date ?? undefined,
    description: locale === 'ar' ? project.description_ar : project.description_en,
    details: project.details.map((detail) => (locale === 'ar' ? detail.text_ar : detail.text_en)).filter(Boolean),
    faq_blocks: (project.faq_blocks ?? []).map((item) => ({
      answer: locale === 'ar' ? item.answer_ar || item.answer_en || '' : item.answer_en || item.answer_ar || '',
      question: locale === 'ar' ? item.question_ar || item.question_en || '' : item.question_en || item.question_ar || '',
    })),
    gallery: project.gallery.map((image) => image.image_url),
    governorate: project.governorate ?? undefined,
    indexable: project.indexable,
    location: locale === 'ar' ? project.location_ar : project.location_en,
    meta_description: project.meta_description ?? undefined,
    og_description: project.og_description ?? undefined,
    og_image: project.og_image ?? undefined,
    og_title: project.og_title ?? undefined,
    payment_plan_summary: project.payment_plan_summary ?? undefined,
    project_type: project.project_type ?? undefined,
    seo_title: project.seo_title ?? undefined,
    slug: project.slug,
    stats: project.stats.map((stat) => ({
      label: locale === 'ar' ? stat.label_ar : stat.label_en,
      value: stat.value,
    })),
    status: project.status ?? undefined,
    title: locale === 'ar' ? project.title_ar : project.title_en,
    unit_types: project.unit_types,
  };
}

export function buildProjectsSectionFromDb(projects: ProjectAggregate[], locale: Locale) {
  const fallback = siteContent[locale].projects;

  return {
    ...fallback,
    items: projects.length > 0 ? projects.map((project) => projectToProjectCard(project, locale)) : fallback.items,
  };
}

export function normalizeLandingRow(row: LandingRow): ProjectLandingRecord {
  const project = Array.isArray(row.projects) ? row.projects[0] : row.projects;

  return {
    archived_at: row.archived_at ?? null,
    created_at: row.created_at ?? null,
    created_by: row.created_by ?? null,
    id: row.id,
    project_id: row.project_id,
    project_slug: project?.slug,
    project_thumbnail: project?.cover_url ?? null,
    project_title_ar: project?.title_ar,
    project_title_en: project?.title_en,
    published_at: row.published_at ?? null,
    status: row.status as ProjectLandingRecord['status'],
    thumbnail_url: row.thumbnail_url ?? null,
    updated_at: row.updated_at ?? null,
    updated_by: row.updated_by ?? null,
  };
}

export function normalizeLandingSections(
  project: ProjectAggregate,
  landingId: string,
  rows: LandingSectionRow[] | null | undefined
): LocalizedLandingSections {
  const defaults = buildDefaultLandingSections(project);

  (rows ?? []).forEach((row) => {
    const locale = row.locale;
    const sectionKey = row.section_key;
    const schema = landingSectionDataSchemaMap[sectionKey];
    const parsed = schema.safeParse(row.data);

    (defaults[locale] as any)[sectionKey] = {
      created_at: row.created_at,
      data: parsed.success ? parsed.data : defaults[locale][sectionKey].data,
      id: row.id,
      is_enabled: row.is_enabled ?? true,
      locale,
      project_landing_id: landingId,
      section_key: sectionKey,
      sort_order: row.sort_order ?? defaults[locale][sectionKey].sort_order,
      updated_at: row.updated_at,
    } as ProjectLandingSectionRecord<typeof sectionKey>;
  });

  return defaults;
}

export function buildLandingAggregate(
  landingRow: LandingRow,
  sectionRows: LandingSectionRow[] | null | undefined,
  unitRows?: ProjectUnitRow[] | null,
  mediaRows?: ProjectLandingMediaRow[] | null
): ProjectLandingAggregate {
  const projectRow = Array.isArray(landingRow.projects) ? landingRow.projects[0] : landingRow.projects;

  if (!projectRow) {
    throw new Error('Landing is missing a linked project record.');
  }

  const project = normalizeProjectRow(projectRow);
  const landing = normalizeLandingRow(landingRow);

  return {
    landing,
    media: normalizeLandingMedia(mediaRows),
    project,
    sections: normalizeLandingSections(project, landing.id, sectionRows),
    units: normalizeProjectUnits(unitRows),
  };
}
