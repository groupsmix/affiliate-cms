import { getProductBySlug } from '../../../lib/queries.js';

/**
 * Affiliate redirect route.
 * GET /go/:slug → 302 redirect to product.affiliate_url
 * Returns 404 if product not found or inactive.
 */
export async function GET(request, { params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: product.affiliate_url,
      'X-Robots-Tag': 'noindex',
    },
  });
}
