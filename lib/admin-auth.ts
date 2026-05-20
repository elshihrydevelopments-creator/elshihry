import type { User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { safeGetUser } from '@/lib/supabase/auth';

export const ADMIN_EMAIL = 'elshihry2027@gmail.com';

export async function requireAdminUser(
  supabase: {
    auth: {
      getUser: () => Promise<{ data: { user: User | null }; error?: unknown }>;
    };
  }
) {
  const { user } = await safeGetUser(supabase);

  if (!user || user.email !== ADMIN_EMAIL) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }),
      user: null,
    };
  }

  return {
    ok: true as const,
    response: null,
    user,
  };
}
