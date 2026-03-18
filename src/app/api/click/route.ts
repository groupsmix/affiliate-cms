import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export const runtime = 'edge';

/**
 * Click tracking redirect endpoint.
 * Records the click event in the database, then redirects to the affiliate URL.
 *
 * Usage: /api/click?url=<affiliate_url>&product=<product_slug>&content=<content_slug>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get('url');
  const productSlug = searchParams.get('product') || null;
  const contentSlug = searchParams.get('content') || null;

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Record click asynchronously (don't block the redirect)
  try {
    const supabase = getSupabase();
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;

    await supabase.from('click_events').insert({
      product_slug: productSlug,
      content_slug: contentSlug,
      destination_url: url,
      user_agent: userAgent,
      referrer,
    });
  } catch {
    // Don't block the redirect if tracking fails
    console.error('Failed to record click event');
  }

  return NextResponse.redirect(url, { status: 302 });
}
