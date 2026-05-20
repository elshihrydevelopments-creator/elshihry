import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { getAdminProjectLandings } from '@/lib/project-landings/queries';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const data = await getAdminProjectLandings();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load project landings' }, { status: 500 });
  }
}
