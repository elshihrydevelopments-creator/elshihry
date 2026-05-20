import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/keep-alive
 *
 * Sends a lightweight ping to Supabase to prevent the project from
 * pausing due to inactivity (Supabase free tier pauses after ~7 days).
 *
 * Called automatically by Vercel Cron every 3 days (see vercel.json).
 * Protected by the CRON_SECRET environment variable.
 */
export async function GET(req: NextRequest) {
  // ── Security: only allow calls from Vercel Cron or with the secret token ──
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    )
  }

  try {
    // Use a direct admin client — no cookies needed for a cron context
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Lightweight ping: fetch a single row from any small table
    const { error } = await supabase
      .from('projects')
      .select('id')
      .limit(1)

    if (error) throw error

    const timestamp = new Date().toISOString()
    console.log(`[keep-alive] Supabase ping OK — ${timestamp}`)

    return NextResponse.json({
      ok: true,
      message: 'Supabase is alive',
      timestamp,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[keep-alive] Supabase ping FAILED — ${message}`)

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    )
  }
}
