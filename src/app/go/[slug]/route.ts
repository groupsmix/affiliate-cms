import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = getSupabase();

  // Look up the product by slug
  const { data: product } = await supabase
    .from('products')
    .select('id, affiliate_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (!product) {
    return new NextResponse('Product not found', { status: 404 });
  }

  // Log click event — fire and forget, do not block redirect
  const sourcePath = request.nextUrl.searchParams.get('from') || null;
  const referrer = request.headers.get('referer') || null;
  const userAgent = request.headers.get('user-agent') || null;

  supabase
    .from('click_events')
    .insert({
      product_id: product.id,
      product_slug: slug,
      source_path: sourcePath,
      referrer,
      user_agent: userAgent,
    })
    .then(({ error }) => {
      if (error) {
        console.error('Click logging failed:', error.message);
      }
    });

  // 302 redirect with noindex
  return NextResponse.redirect(product.affiliate_url, {
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex',
    },
  });
}
