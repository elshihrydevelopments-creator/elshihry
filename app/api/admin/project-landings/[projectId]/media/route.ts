import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ projectId: string }> };

/** GET all media for a landing */
export async function GET(_: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);
    if (!auth.ok) return auth.response;

    const { projectId } = await params;

    const { data: landing } = await supabase
      .from('project_landings')
      .select('id')
      .eq('project_id', projectId)
      .limit(1)
      .maybeSingle();

    if (!landing) return NextResponse.json({ error: 'Landing not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('project_landing_media')
      .select('*')
      .eq('project_landing_id', landing.id)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: data ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** PUT — upsert one or many media items */
export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);
    if (!auth.ok) return auth.response;

    const { projectId } = await params;
    const body = await req.json();
    const items: Array<{
      id?: string;
      media_key: string;
      locale: string;
      title: string;
      caption: string;
      image_url: string;
      video_url?: string | null;
      sort_order: number;
      is_enabled: boolean;
    }> = Array.isArray(body) ? body : [body];

    const { data: landing } = await supabase
      .from('project_landings')
      .select('id')
      .eq('project_id', projectId)
      .limit(1)
      .maybeSingle();

    if (!landing) return NextResponse.json({ error: 'Landing not found' }, { status: 404 });

    const rows = items.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      caption: item.caption ?? '',
      image_url: item.image_url ?? '',
      is_enabled: item.is_enabled ?? true,
      locale: item.locale,
      media_key: item.media_key,
      project_landing_id: landing.id,
      sort_order: item.sort_order ?? 0,
      title: item.title ?? '',
      video_url: item.video_url ?? null,
    }));

    const { data, error } = await supabase
      .from('project_landing_media')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** DELETE — remove a media item by id */
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);
    if (!auth.ok) return auth.response;

    await params; // consume
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { error } = await supabase.from('project_landing_media').delete().eq('id', id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
