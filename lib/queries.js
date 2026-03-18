import { supabase } from './supabase.js';

/**
 * Fetch a single published, active content item by slug and content type.
 *
 * @param {string} slug - The URL slug of the content item.
 * @param {string} contentType - The content type ('best' | 'review' | 'comparison' | 'problem' | 'alternative').
 * @returns {Promise<object|null>} The content row, or null if not found.
 * @throws {Error} If the Supabase query fails.
 */
export async function getContentBySlug(slug, contentType) {
  const { data, error } = await supabase
    .from('content')
    .select(
      'id, title, slug, content_type, primary_keyword, body, ' +
      'excerpt, cover_image_url, author, language, is_featured, ' +
      'meta_title, meta_description, published_at, category_id'
    )
    .eq('slug', slug)
    .eq('content_type', contentType)
    .eq('status', 'published')
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Fetch all active products linked to a content item, ordered by display_order.
 *
 * Returns product fields needed for rendering, plus the mapping fields
 * (placement, display_order, custom_affiliate_url).
 *
 * @param {string} contentId - The UUID of the content item.
 * @returns {Promise<object[]>} Array of product rows with mapping metadata.
 * @throws {Error} If the Supabase query fails.
 */
export async function getProductsByContentId(contentId) {
  const { data, error } = await supabase
    .from('content_products')
    .select(
      'placement, display_order, custom_affiliate_url, ' +
      'product:products(' +
        'id, name, slug, tagline, description, logo_url, ' +
        'website_url, affiliate_url, affiliate_network, ' +
        'commission_type, commission_value, pricing_model, ' +
        'rating, is_featured, meta_title, meta_description' +
      ')'
    )
    .eq('content_id', contentId)
    .eq('products.is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;

  // Flatten: merge mapping fields with product fields, exclude rows
  // where the product join returned null (inactive product filtered out).
  return data
    .filter((row) => row.product !== null)
    .map((row) => ({
      ...row.product,
      placement: row.placement,
      display_order: row.display_order,
      custom_affiliate_url: row.custom_affiliate_url,
    }));
}

/**
 * Fetch related published, active content in the same category,
 * excluding the current item.
 *
 * @param {string} categoryId - The UUID of the category.
 * @param {string} excludeId - The UUID of the content item to exclude.
 * @param {number} [limit=3] - Maximum number of related items to return.
 * @returns {Promise<object[]>} Array of related content rows.
 * @throws {Error} If the Supabase query fails.
 */
export async function getRelatedContent(categoryId, excludeId, limit = 3) {
  const { data, error } = await supabase
    .from('content')
    .select('id, title, slug, content_type, excerpt')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .eq('status', 'published')
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Resolve the affiliate URL for a product within a content context.
 *
 * Returns the custom affiliate URL from the content–product mapping
 * if set, otherwise falls back to the product's default affiliate URL.
 *
 * @param {{ custom_affiliate_url?: string | null }} contentProduct - The content–product mapping row.
 * @param {{ affiliate_url: string }} product - The product row.
 * @returns {string} The resolved affiliate URL.
 */
export function resolveAffiliateUrl(contentProduct, product) {
  return contentProduct.custom_affiliate_url || product.affiliate_url;
}

/**
 * Fetch a single active product by slug.
 *
 * Returns only the affiliate_url field, or null if the product
 * is not found or inactive.
 *
 * @param {string} slug - The URL slug of the product.
 * @returns {Promise<{ affiliate_url: string } | null>} The affiliate URL object, or null.
 * @throws {Error} If the Supabase query fails.
 */
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('affiliate_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
