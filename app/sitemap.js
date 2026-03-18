import { supabase } from '../lib/supabase.js';

/**
 * Generate a sitemap from all published, active content rows.
 * URL format: /[contentType]/[slug]
 *
 * @returns {Promise<Array<{ url: string, lastModified: string }>>}
 */
export default async function sitemap() {
  const { data, error } = await supabase
    .from('content')
    .select('slug, content_type, updated_at')
    .eq('status', 'published')
    .eq('is_active', true);

  if (error) {
    return [];
  }

  return data.map((row) => ({
    url: `/${row.content_type}/${row.slug}`,
    lastModified: row.updated_at,
  }));
}
