import { NextResponse } from 'next/server';

import { requireAdminUser } from '@/lib/admin-auth';
import { updateLeadStatus } from '@/lib/project-landings/mutations';
import { leadStatusSchema } from '@/lib/project-landings/schemas';
import { createClient } from '@/lib/supabase/server';

type RouteContext = {
  params: Promise<{ leadId: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const supabase = await createClient();
    const auth = await requireAdminUser(supabase);

    if (!auth.ok) {
      return auth.response;
    }

    const { leadId } = await params;
    const body = await req.json();
    const status = leadStatusSchema.parse(body.status);
    await updateLeadStatus(leadId, status);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update lead status' }, { status: 500 });
  }
}
