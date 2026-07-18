'use server';

import { createClient } from '@/lib/supabase/server';
import { buildDefaultLandingSections } from '@/lib/project-landings/defaults';
import { revalidatePath } from 'next/cache';

export async function seedQomorRendersProject() {
  const supabase = await createClient();

  // 1. Check if the project already exists
  let insertedProject;
  const { data: existingProject } = await supabase
    .from('projects')
    .select('id, cover_url')
    .eq('slug', 'qomor-renders')
    .single();

  // 2. Insert the project
  const projectData = {
    slug: 'qomor-renders',
    title_ar: 'قمر ريندرز',
    title_en: 'Qomor Renders',
    location_ar: 'التجمع الخامس، القاهرة الجديدة',
    location_en: 'Fifth Settlement, New Cairo',
    description_ar: 'مشروع قمر ريندرز يمثل قمة التصميمات المعمارية ثلاثية الأبعاد والمخططات الهندسية الفاخرة للشركة، مع تجربة بصرية سينمائية غامرة.',
    description_en: 'Qomor Renders delivers the pinnacle of luxury 3D architectural renders and engineering layouts by El Shihry Developments.',
    cover_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    seo_title: 'قمر ريندرز | تصاميم ثلاثية الأبعاد فاخرة',
    meta_description: 'استكشف رندرات وتصاميم ثلاثية الأبعاد لمشروع قمر ريندرز الفاخر.',
    og_title: 'Qomor Renders',
    og_description: 'Luxury Architectural 3D Rendering Designs',
    canonical_slug: 'qomor-renders',
    indexable: true,
    project_type: 'تصميمات ورندرات فاخرة',
    status: 'إطلاق قريب',
    delivery_date: '2027',
    area_name: 'القاهرة الجديدة',
    city: 'القاهرة',
    governorate: 'القاهرة',
    amenities: ['تصاميم معمارية حديثة', 'إضاءة واقعية متطورة', 'مخططات هندسية كاملة', 'إكساء ومواد مستدامة'],
    unit_types: ['رندرات الفلل الفاخرة', 'رندرات الشقق السكنية', 'رندرات البنتهاوس'],
    payment_plan_summary: 'تسهيلات سداد حتى ٧ سنوات',
    nearby_landmarks: ['الجامعة الأمريكية بالقاهرة', 'شارع التسعين'],
    published: true,
    display_order: 100,
  };

  if (existingProject) {
    insertedProject = existingProject;
    
    // Update the existing project
    await supabase.from('projects').update(projectData).eq('id', existingProject.id);
  } else {
    const { data: newProject, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select('id, title_ar, title_en, cover_url, slug')
      .single();

    if (projectError || !newProject) {
      console.error('Project Insert Error:', projectError);
      return { success: false, error: 'حدث خطأ أثناء إنشاء المشروع.' };
    }
    insertedProject = newProject;
  }

  // 3. Insert initial stats
  const stats = [
    { project_id: insertedProject.id, label_ar: 'تصميم ثلاثي أبعاد', label_en: '3D Renders', sort_order: 0, value: '48+' },
    { project_id: insertedProject.id, label_ar: 'دقة العرض', label_en: 'Visual Quality', sort_order: 1, value: '8K Ultra' },
    { project_id: insertedProject.id, label_ar: 'مستشاري التصميم', label_en: 'Lead Advisors', sort_order: 2, value: 'خبراء إيطاليا' },
    { project_id: insertedProject.id, label_ar: 'أنظمة سداد', label_en: 'Payment Years', sort_order: 3, value: 'تصل لـ ٧ سنوات' },
  ];

  const { error: statsError } = await supabase.from('project_stats').insert(stats);
  if (statsError) {
    console.error('Stats Insert Error:', statsError);
  }

  // 4. Create Landing Page
  // We need to pass a mock project object to buildDefaultLandingSections to get default values
  const mockProjectForDefaults: any = {
    ...projectData,
    id: insertedProject.id,
    stats: stats,
    details: [],
    gallery: [],
  };

  const sections = buildDefaultLandingSections(mockProjectForDefaults);

  let landingId: string;
  const { data: existingLanding } = await supabase
    .from('project_landings')
    .select('id')
    .eq('project_id', insertedProject.id)
    .single();

  if (existingLanding) {
    landingId = existingLanding.id;
    
    // Update it just in case
    await supabase.from('project_landings').update({
      status: 'published',
      thumbnail_url: insertedProject.cover_url,
    }).eq('id', landingId);
  } else {
    const landingData = {
      project_id: insertedProject.id,
      status: 'published',
      thumbnail_url: insertedProject.cover_url,
    };

    const { data: insertedLanding, error: landingError } = await supabase
      .from('project_landings')
      .insert(landingData)
      .select('id')
      .single();

    if (landingError || !insertedLanding) {
      console.error('Landing Insert Error:', landingError);
      return { success: false, error: 'حدث خطأ أثناء إنشاء صفحة الهبوط.' };
    }
    landingId = insertedLanding.id;
  }

  // 5. Insert Sections
  const { error: sectionsError } = await supabase
    .from('project_landing_sections')
    .upsert({
      landing_id: landingId,
      sections: sections,
    }, { onConflict: 'landing_id' });

  if (sectionsError) {
    console.error('Sections Insert Error:', sectionsError);
    return { success: false, error: 'حدث خطأ أثناء إدراج الأقسام.' };
  }
  
  // Insert initial media empty array
  const { error: mediaError } = await supabase
    .from('project_landing_media')
    .upsert({
      landing_id: landingId,
      day_exterior: [],
      night_exterior: [],
      highlight_bento: [],
      life_timeline: []
    }, { onConflict: 'landing_id' });

  if (mediaError) {
     console.error('Media Insert Error:', mediaError);
  }

  revalidatePath('/admin/qomor-renders');
  revalidatePath('/qomor-renders');
  revalidatePath('/ar/qomor-renders');
  revalidatePath('/en/qomor-renders');

  return { success: true };
}
