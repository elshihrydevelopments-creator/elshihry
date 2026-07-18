import { createClient } from '@/lib/supabase/server';
import { buildLandingAggregate, normalizeProjectRow } from '@/lib/project-landings/mappers';
import { buildDefaultLandingSections } from '@/lib/project-landings/defaults';
import type {
  ProjectAggregate,
  ProjectLandingAggregate,
  ProjectLandingRecord,
  ProjectLeadRecord,
} from '@/lib/project-landings/types';

const PROJECT_SELECT = `
  id,
  slug,
  title_ar,
  title_en,
  location_ar,
  location_en,
  description_ar,
  description_en,
  cover_url,
  seo_title,
  meta_description,
  og_title,
  og_description,
  og_image,
  canonical_slug,
  indexable,
  project_type,
  status,
  delivery_date,
  area_name,
  city,
  governorate,
  amenities,
  unit_types,
  payment_plan_summary,
  nearby_landmarks,
  faq_blocks,
  brochure_url,
  display_order,
  published,
  created_at,
  updated_at,
  project_stats ( id, label_ar, label_en, value, sort_order ),
  project_details ( id, detail_ar, detail_en, sort_order ),
  project_gallery ( id, image_url, alt_ar, alt_en, sort_order )
`;

const PROJECT_LANDING_SELECT = `
  id,
  slug,
  title_ar,
  title_en,
  location_ar,
  location_en,
  description_ar,
  description_en,
  cover_url,
  seo_title,
  meta_description,
  og_title,
  og_description,
  og_image,
  canonical_slug,
  indexable,
  project_type,
  status,
  delivery_date,
  area_name,
  city,
  governorate,
  amenities,
  unit_types,
  payment_plan_summary,
  nearby_landmarks,
  faq_blocks,
  brochure_url,
  display_order,
  published,
  created_at,
  updated_at,
  project_stats ( id, label_ar, label_en, value, sort_order ),
  project_details ( id, detail_ar, detail_en, sort_order ),
  project_gallery ( id, image_url, alt_ar, alt_en, sort_order )
`;

async function loadLandingExtras(supabase: Awaited<ReturnType<typeof createClient>>, landingId: string, projectId: string) {
  const [unitsResult, mediaResult] = await Promise.all([
    supabase
      .from('project_units')
      .select(
        'id, project_id, title_ar, title_en, unit_type_ar, unit_type_en, area_sqm, floor_number, price_egp, bedrooms, bathrooms, availability_status, image_url, floorplan_url, sort_order'
      )
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true }),
    supabase
      .from('project_landing_media')
      .select('id, project_landing_id, locale, media_key, title, caption, image_url, video_url, sort_order, is_enabled')
      .eq('project_landing_id', landingId)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true }),
  ]);

  return {
    media: mediaResult.error ? [] : mediaResult.data,
    units: unitsResult.error ? [] : unitsResult.data,
  };
}

const LANDING_SELECT = `
  id,
  project_id,
  status,
  thumbnail_url,
  published_at,
  archived_at,
  created_at,
  updated_at,
  created_by,
  updated_by,
  projects!inner (
    ${PROJECT_LANDING_SELECT}
  )
`;

export async function getPublicProjects(): Promise<ProjectAggregate[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select(PROJECT_SELECT)
      .eq('published', true)
      .order('display_order', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((row) => normalizeProjectRow(row as never));
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string, options?: { includeUnpublished?: boolean }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const supabase = await createClient();
  let query = supabase.from('projects').select(PROJECT_SELECT).eq('slug', slug).limit(1);

  if (!options?.includeUnpublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeProjectRow(data as never);
}

export async function getAdminProjects(): Promise<ProjectAggregate[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .order('display_order', { ascending: false });

  if (error || !data) {
    throw new Error(error?.message || 'Failed to load projects');
  }

  return data.map((row) => normalizeProjectRow(row as never));
}

export async function getAdminProjectById(projectId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('id', projectId)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeProjectRow(data as never);
}

export async function getProjectLandingBySlug(slug: string): Promise<ProjectLandingAggregate | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data: landingRows, error } = await supabase
      .from('project_landings')
      .select(LANDING_SELECT)
      .eq('status', 'published')
      .eq('projects.slug', slug)
      .limit(1);

    if (error || !landingRows || landingRows.length === 0) {
      return null;
    }

    const landingRow = landingRows[0] as any;
    const landingId = landingRow.id as string;
    const projectId = landingRow.project_id as string;
    const { data: sections } = await supabase
      .from('project_landing_sections')
      .select('*')
      .eq('project_landing_id', landingId)
      .in('locale', ['ar', 'en'])
      .order('sort_order', { ascending: true });
    const extras = await loadLandingExtras(supabase, landingId, projectId);

    return buildLandingAggregate(landingRow, sections as any, extras.units as any, extras.media as any);
  } catch (err) {
    console.error(`[getProjectLandingBySlug] Failed for slug="${slug}":`, err);
    return null;
  }
}

export async function getProjectLandingByProjectId(projectId: string): Promise<ProjectLandingAggregate | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data: landingRows, error } = await supabase
      .from('project_landings')
      .select(LANDING_SELECT)
      .eq('project_id', projectId)
      .limit(1);

    if (error || !landingRows || landingRows.length === 0) {
      return null;
    }

    const landingRow = landingRows[0] as any;
    const landingId = landingRow.id as string;
    const projectIdValue = landingRow.project_id as string;
    const { data: sections } = await supabase
      .from('project_landing_sections')
      .select('*')
      .eq('project_landing_id', landingId)
      .in('locale', ['ar', 'en'])
      .order('sort_order', { ascending: true });
    const extras = await loadLandingExtras(supabase, landingId, projectIdValue);

    return buildLandingAggregate(landingRow, sections as any, extras.units as any, extras.media as any);
  } catch (err) {
    console.error(`[getProjectLandingByProjectId] Failed for projectId="${projectId}":`, err);
    return null;
  }
}

export async function getProjectLandingByIdForAlias(projectId: string): Promise<ProjectLandingRecord | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_landings')
    .select(LANDING_SELECT)
    .eq('project_id', projectId)
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  const aggregate = buildLandingAggregate(data[0] as any, []);
  return aggregate.landing;
}

export async function getAdminProjectLandings(): Promise<ProjectLandingRecord[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_landings')
    .select(LANDING_SELECT)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    throw new Error(error?.message || 'Failed to load project landings');
  }

  return data.map((row) => buildLandingAggregate(row as any, []).landing);
}

export async function getAdminLeads(): Promise<ProjectLeadRecord[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select(`
      id,
      project_id,
      project_landing_id,
      locale,
      full_name,
      phone,
      whatsapp_number,
      email,
      message,
      status,
      source_path,
      created_at,
      updated_at,
      projects:projects!inner ( slug, title_ar, title_en )
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    throw new Error(error?.message || 'Failed to load leads');
  }

  return data.map((row: any) => ({
    created_at: row.created_at,
    email: row.email,
    full_name: row.full_name,
    id: row.id,
    locale: row.locale,
    message: row.message,
    phone: row.phone,
    project_id: row.project_id,
    project_landing_id: row.project_landing_id,
    project_slug: row.projects?.slug,
    project_title: row.locale === 'ar' ? row.projects?.title_ar : row.projects?.title_en,
    source_path: row.source_path,
    status: row.status,
    updated_at: row.updated_at,
    whatsapp_number: row.whatsapp_number ?? null,
  }));
}

export function buildLandingSectionsForProject(project: ProjectAggregate) {
  return buildDefaultLandingSections(project);
}

export async function getPublishedProjectLandingSlugs() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('project_landings')
      .select('projects!inner(slug)')
      .eq('status', 'published');

    if (error || !data) {
      return [];
    }

    return Array.from(
      new Set(
        data
          .map((row: any) => row.projects?.slug)
          .filter((slug: unknown): slug is string => typeof slug === 'string' && slug.length > 0)
      )
    );
  } catch {
    return [];
  }
}
