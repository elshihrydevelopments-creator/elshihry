import { revalidatePath, revalidateTag } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { adminProjectPayloadSchema, projectLandingEditorPayloadSchema } from '@/lib/project-landings/schemas';
import { buildDefaultLandingSections } from '@/lib/project-landings/defaults';
import { getAdminProjectById, getProjectLandingByProjectId, getProjectLandingBySlug } from '@/lib/project-landings/queries';
import type {
  AdminProjectPayload,
  LocalizedLandingSections,
  ProjectLeadInput,
  ProjectLeadRecord,
} from '@/lib/project-landings/types';
import { projectLeadInputSchema } from '@/lib/project-landings/schemas';

function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeTextArray(values: string[] | undefined) {
  return (values ?? []).map((item) => item.trim()).filter(Boolean);
}

function buildLandingSectionRows(projectLandingId: string, sections: LocalizedLandingSections) {
  return (['ar', 'en'] as const).flatMap((locale) =>
    Object.values(sections[locale]).map((section) => ({
      data: section.data,
      is_enabled: section.is_enabled,
      locale,
      project_landing_id: projectLandingId,
      section_key: section.section_key,
      sort_order: section.sort_order,
    }))
  );
}

function revalidateSiteSectionsTag() {
  // @ts-ignore - Next 16 types in this environment require the cache profile argument.
  revalidateTag('site-sections', 'default');
}

function revalidateProjectPaths(slug?: string | null) {
  revalidateSiteSectionsTag();
  revalidatePath('/', 'layout');
  revalidatePath('/');

  ['ar', 'en'].forEach((locale) => {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/projects`);

    if (slug) {
      revalidatePath(`/${locale}/projects/${slug}`);
      revalidatePath(`/${locale}/projects/${slug}/land`);
      revalidatePath(`/${locale}/projects/${slug}/thank-you`);
    }
  });

  revalidatePath('/projects');
  revalidatePath('/[locale]/projects/[slug]', 'page');
  revalidatePath('/[locale]/projects/[slug]/land', 'page');
}

export async function revalidateProjectContentById(projectId: string) {
  const project = await getAdminProjectById(projectId);
  revalidateProjectPaths(project?.slug);
}

async function ensureLandingForProject(projectId: string) {
  const current = await getProjectLandingByProjectId(projectId);

  if (current) {
    return current;
  }

  const project = await getAdminProjectById(projectId);

  if (!project) {
    throw new Error('Project not found while creating landing.');
  }

  const supabase = await createClient();
  const { data: landingRow, error } = await supabase
    .from('project_landings')
    .insert({
      project_id: projectId,
      status: 'draft',
      thumbnail_url: project.cover_url,
    })
    .select('*')
    .single();

  if (error || !landingRow) {
    throw new Error(error?.message || 'Failed to create project landing');
  }

  const sections = buildDefaultLandingSections(project);
  const { error: sectionsError } = await supabase
    .from('project_landing_sections')
    .upsert(buildLandingSectionRows(landingRow.id, sections), {
      onConflict: 'project_landing_id,locale,section_key',
    });

  if (sectionsError) {
    throw new Error(sectionsError.message);
  }

  const aggregate = await getProjectLandingByProjectId(projectId);

  if (!aggregate) {
    throw new Error('Landing was created but could not be loaded.');
  }

  return aggregate;
}

export async function upsertAdminProject(payload: AdminProjectPayload) {
  const parsed = adminProjectPayloadSchema.parse(payload);
  const previousProject = parsed.id ? await getAdminProjectById(parsed.id) : null;
  const supabase = await createClient();

  const projectPayload = {
    amenities: normalizeTextArray(parsed.amenities),
    area_name: normalizeOptionalText(parsed.area_name),
    city: normalizeOptionalText(parsed.city),
    cover_url: normalizeOptionalText(parsed.cover_url),
    delivery_date: normalizeOptionalText(parsed.delivery_date),
    description_ar: parsed.description_ar,
    description_en: parsed.description_en,
    display_order: parsed.display_order,
    faq_blocks: parsed.faq_blocks,
    governorate: normalizeOptionalText(parsed.governorate),
    location_ar: parsed.location_ar,
    location_en: parsed.location_en,
    payment_plan_summary: normalizeOptionalText(parsed.payment_plan_summary),
    brochure_url: normalizeOptionalText(parsed.brochure_url),
    project_type: normalizeOptionalText(parsed.project_type),
    published: parsed.published,
    slug: parsed.slug,
    status: normalizeOptionalText(parsed.status),
    title_ar: parsed.title_ar,
    title_en: parsed.title_en,
    unit_types: normalizeTextArray(parsed.unit_types),
  };

  const saveMethod = parsed.id
    ? supabase.from('projects').update(projectPayload).eq('id', parsed.id).select('id, slug').single()
    : supabase.from('projects').insert(projectPayload).select('id, slug').single();

  const { data: projectRow, error } = await saveMethod;

  if (error || !projectRow) {
    throw new Error(error?.message || 'Failed to save project');
  }

  const projectId = projectRow.id as string;

  await supabase.from('project_stats').delete().eq('project_id', projectId);
  await supabase.from('project_details').delete().eq('project_id', projectId);
  await supabase.from('project_gallery').delete().eq('project_id', projectId);

  if (parsed.stats.length > 0) {
    const { error: statsError } = await supabase.from('project_stats').insert(
      parsed.stats.map((stat, index) => ({
        label_ar: stat.label_ar,
        label_en: stat.label_en,
        project_id: projectId,
        sort_order: stat.sort_order ?? index,
        value: stat.value,
      }))
    );

    if (statsError) {
      throw new Error(statsError.message);
    }
  }

  if (parsed.details.length > 0) {
    const { error: detailsError } = await supabase.from('project_details').insert(
      parsed.details.map((detail, index) => ({
        detail_ar: detail.text_ar,
        detail_en: detail.text_en,
        project_id: projectId,
        sort_order: detail.sort_order ?? index,
      }))
    );

    if (detailsError) {
      throw new Error(detailsError.message);
    }
  }

  if (parsed.gallery.length > 0) {
    const { error: galleryError } = await supabase.from('project_gallery').insert(
      parsed.gallery.map((image, index) => ({
        alt_ar: normalizeOptionalText(image.alt_ar),
        alt_en: normalizeOptionalText(image.alt_en),
        image_url: image.image_url,
        project_id: projectId,
        sort_order: image.sort_order ?? index,
      }))
    );

    if (galleryError) {
      throw new Error(galleryError.message);
    }
  }

  const landing = await ensureLandingForProject(projectId);
  revalidateProjectPaths(projectRow.slug as string);

  if (previousProject?.slug && previousProject.slug !== projectRow.slug) {
    revalidateProjectPaths(previousProject.slug);
  }

  return {
    landing,
    projectId,
    slug: projectRow.slug as string,
  };
}

export async function saveProjectLanding(payload: unknown) {
  const parsed = projectLandingEditorPayloadSchema.parse(payload);
  const currentLanding = await ensureLandingForProject(parsed.projectId);
  const supabase = await createClient();

  const sectionRows = buildLandingSectionRows(currentLanding.landing.id, parsed.sections as LocalizedLandingSections);
  const { error: updateError } = await supabase
    .from('project_landings')
    .update({
      archived_at: parsed.status === 'archived' ? new Date().toISOString() : null,
      published_at: parsed.status === 'published' ? new Date().toISOString() : currentLanding.landing.published_at,
      status: parsed.status,
      thumbnail_url: parsed.thumbnailUrl,
    })
    .eq('project_id', parsed.projectId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (parsed.brochureUrl !== undefined) {
    const { error: projectUpdateError } = await supabase
      .from('projects')
      .update({ brochure_url: normalizeOptionalText(parsed.brochureUrl) })
      .eq('id', parsed.projectId);

    if (projectUpdateError) {
      throw new Error(projectUpdateError.message);
    }
  }

  const { error: sectionsError } = await supabase
    .from('project_landing_sections')
    .upsert(sectionRows, { onConflict: 'project_landing_id,locale,section_key' });

  if (sectionsError) {
    throw new Error(sectionsError.message);
  }

  revalidateProjectPaths(currentLanding.project.slug);

  return getProjectLandingByProjectId(parsed.projectId);
}

export async function archiveProjectLanding(projectId: string) {
  const landing = await ensureLandingForProject(projectId);
  const supabase = await createClient();
  const { error } = await supabase
    .from('project_landings')
    .update({
      archived_at: new Date().toISOString(),
      status: 'archived',
    })
    .eq('project_id', projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateProjectPaths(landing.project.slug);
}

export async function createLead(input: ProjectLeadInput): Promise<ProjectLeadRecord> {
  const parsed = projectLeadInputSchema.parse(input);
  const landing = await getProjectLandingBySlug(parsed.project_slug);

  if (!landing || landing.landing.status !== 'published') {
    throw new Error('Landing page is not available for submissions.');
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .insert({
      email: parsed.email || null,
      full_name: parsed.full_name,
      locale: parsed.locale,
      message: parsed.message || '',
      phone: parsed.phone,
      project_id: landing.project.id,
      project_landing_id: landing.landing.id,
      source_path: parsed.source_path,
      status: 'new',
      whatsapp_number: parsed.whatsapp_number || null,
    })
    .select('id, created_at, updated_at, project_id, project_landing_id, locale, full_name, phone, whatsapp_number, email, message, status, source_path')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to save lead');
  }

  const crmApiUrl = process.env.CRM_API_URL;
  const crmApiKey = process.env.CRM_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elshihry.com';

  if (crmApiUrl && crmApiKey) {
    try {
      const response = await fetch(`${crmApiUrl}/api/webhooks/website/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': crmApiKey,
          'Origin': siteUrl,
        },
        body: JSON.stringify({
          name: parsed.full_name,
          phone: parsed.phone,
          whatsapp: parsed.whatsapp_number || parsed.phone,
          email: parsed.email || undefined,
          message: parsed.message || `Project: ${landing.project.title_en} (${landing.project.slug})`,
          page_url: parsed.page_url || undefined,
          utm_source: parsed.utm_source || undefined,
          utm_medium: parsed.utm_medium || undefined,
          utm_campaign: parsed.utm_campaign || undefined,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || result.error || 'Failed to submit lead to CRM');
      }
    } catch (crmError: any) {
      console.error('Error sending lead to CRM:', crmError.message);
      throw new Error(crmError.message || 'CRM Webhook Submission failed');
    }
  } else {
    console.warn('CRM Integration skipped: CRM_API_URL or CRM_API_KEY is not defined in environment variables.');
  }

  return {
    ...data,
    project_slug: landing.project.slug,
    project_title: parsed.locale === 'ar' ? landing.project.title_ar : landing.project.title_en,
  };
}

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('leads').update({ status }).eq('id', leadId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteAdminProject(projectId: string) {
  const project = await getAdminProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidateProjectPaths(project.slug);
}
