import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { archiveProjectLanding, saveProjectLanding } from '@/lib/project-landings/mutations';
import { getProjectLandingByProjectId } from '@/lib/project-landings/queries';
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
    const data = await getProjectLandingByProjectId(projectId);

    if (!data) {
      return NextResponse.json({ error: 'Landing not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load landing' }, { status: 500 });
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
    const data = await saveProjectLanding({ ...body, projectId });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save landing' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const { projectId } = await params;
    await archiveProjectLanding(projectId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to archive landing' }, { status: 500 });
  }
}
