import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { upsertAdminProject } from '@/lib/project-landings/mutations';
import { getAdminProjects } from '@/lib/project-landings/queries';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const data = await getAdminProjects();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const body = await req.json();
    const result = await upsertAdminProject(body);

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save project' }, { status: 500 });
  }
}
