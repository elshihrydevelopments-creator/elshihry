import { NextResponse } from 'next/server';

import { createLead } from '@/lib/project-landings/mutations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createLead(body);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit lead' }, { status: 400 });
  }
}
