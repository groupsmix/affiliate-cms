import type { MetadataRoute } from 'next';
import { getSupabase } from '@/lib/supabase-server';

const SITE_URL = process.env.SITE_URL || 'https://example.com';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabase();

  const { data: articles } = await supabase
    .from('content')
    .select('slug, content_type, updated_at')
    .eq('status', 'published')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/comparisons`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/disclosure`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  const contentPages: MetadataRoute.Sitemap = (articles ?? []).map(
    (article: { slug: string; content_type: string; updated_at: string }) => ({
      url: `${SITE_URL}/${article.content_type}/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }),
  );

  return [...staticPages, ...contentPages];
}
