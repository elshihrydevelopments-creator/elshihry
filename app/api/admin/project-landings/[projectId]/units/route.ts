import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ projectId: string }> };

/** GET all units for a project */
export async function GET(_: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);
    if (!auth.ok) return auth.response;

    const { projectId } = await params;
    const { data, error } = await supabase
      .from('project_units')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: data ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** PUT — upsert one or many units */
export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);
    if (!auth.ok) return auth.response;

    const { projectId } = await params;
    const body = await req.json();
    const items: Array<{
      id?: string;
      title_ar: string;
      title_en: string;
      unit_type_ar: string;
      unit_type_en: string;
      area_sqm?: number | null;
      floor_number?: number | null;
      price_egp?: number | null;
      bedrooms?: number | null;
      bathrooms?: number | null;
      availability_status: string;
      image_url?: string | null;
      floorplan_url?: string | null;
      sort_order: number;
    }> = Array.isArray(body) ? body : [body];

    const rows = items.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      area_sqm: item.area_sqm ?? null,
      availability_status: item.availability_status ?? 'available',
      bathrooms: item.bathrooms ?? null,
      bedrooms: item.bedrooms ?? null,
      floor_number: item.floor_number ?? null,
      floorplan_url: item.floorplan_url ?? null,
      image_url: item.image_url ?? null,
      price_egp: item.price_egp ?? null,
      project_id: projectId,
      sort_order: item.sort_order ?? 0,
      title_ar: item.title_ar ?? '',
      title_en: item.title_en ?? '',
      unit_type_ar: item.unit_type_ar ?? '',
      unit_type_en: item.unit_type_en ?? '',
    }));

    const { data, error } = await supabase
      .from('project_units')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** DELETE — remove a unit by id */
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);
    if (!auth.ok) return auth.response;

    await params;
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { error } = await supabase.from('project_units').delete().eq('id', id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
