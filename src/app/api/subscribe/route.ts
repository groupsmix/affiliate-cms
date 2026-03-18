import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export const runtime = 'edge';

/**
 * Newsletter subscription endpoint.
 * Inserts email into the subscribers table.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Check for duplicate
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
    }

    const { error } = await supabase
      .from('subscribers')
      .insert({ email, source: 'website' });

    if (error) {
      console.error('Subscription error:', error.message);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
