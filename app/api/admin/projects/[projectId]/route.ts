import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { getAdminProjectById } from '@/lib/project-landings/queries';
import { upsertAdminProject } from '@/lib/project-landings/mutations';
import { createClient } from '@/lib/supabase/server';

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const { projectId } = await params;
    const data = await getAdminProjectById(projectId);

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load project' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const { projectId } = await params;
    const body = await req.json();
    const result = await upsertAdminProject({ ...body, id: projectId });

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}
