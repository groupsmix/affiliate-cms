import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
  );
}

const adminClient = createClient(supabaseUrl, serviceRoleKey);

/**
 * Create a new content stub in draft status.
 *
 * @param {{ title: string, slug: string, contentType: string, categoryId?: string, primaryKeyword?: string }} params
 * @returns {Promise<string>} The inserted row id.
 */
export async function createContentStub({ title, slug, contentType, categoryId, primaryKeyword }) {
  const { data, error } = await adminClient
    .from('content')
    .insert({
      title,
      slug,
      content_type: contentType,
      category_id: categoryId || null,
      primary_keyword: primaryKeyword || null,
      status: 'draft',
      is_active: true,
      language: 'ar',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

/**
 * Attach a product to a content item.
 *
 * @param {{ contentId: string, productId: string, placement?: string, displayOrder?: number, customAffiliateUrl?: string | null }} params
 * @returns {Promise<object>} The inserted content_products row.
 */
export async function attachProduct({
  contentId,
  productId,
  placement = 'mentioned',
  displayOrder = 0,
  customAffiliateUrl = null,
}) {
  const { data, error } = await adminClient
    .from('content_products')
    .insert({
      content_id: contentId,
      product_id: productId,
      placement,
      display_order: displayOrder,
      custom_affiliate_url: customAffiliateUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update body, excerpt, and meta fields for a content item.
 *
 * @param {{ contentId: string, body: string, excerpt: string, metaTitle: string, metaDescription: string }} params
 * @returns {Promise<object>} The updated content row.
 */
export async function updateContentBody({ contentId, body, excerpt, metaTitle, metaDescription }) {
  const { data, error } = await adminClient
    .from('content')
    .update({
      body,
      excerpt,
      meta_title: metaTitle,
      meta_description: metaDescription,
    })
    .eq('id', contentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Set the status of a content item.
 * If status is 'published', also sets published_at to now.
 *
 * @param {{ contentId: string, status: 'draft' | 'review' | 'published' }} params
 * @returns {Promise<object>} The updated content row.
 */
export async function setStatus({ contentId, status }) {
  const allowed = ['draft', 'review', 'published'];
  if (!allowed.includes(status)) {
    throw new Error(`Invalid status "${status}". Allowed: ${allowed.join(', ')}`);
  }

  const updates = { status };

  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await adminClient
    .from('content')
    .update(updates)
    .eq('id', contentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft-deactivate a content item (never delete).
 *
 * @param {{ contentId: string }} params
 * @returns {Promise<object>} The updated content row.
 */
export async function deactivateContent({ contentId }) {
  const { data, error } = await adminClient
    .from('content')
    .update({ is_active: false })
    .eq('id', contentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
