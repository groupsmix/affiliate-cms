'use server';

import { getSupabase } from '@/lib/supabase-server';
import type { ContentType } from '@/types/index';

export async function fetchPublishedContent() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('status', 'published')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchPublishedContentByType(contentType: ContentType) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', contentType)
    .eq('status', 'published')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchPublishedContentByTypes(contentTypes: ContentType[]) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .in('content_type', contentTypes)
    .eq('status', 'published')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchPublishedContentWithRatings(contentType: ContentType) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*, content_products(display_order, products(rating))')
    .eq('content_type', contentType)
    .eq('status', 'published')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item) => {
    const contentProducts = (item.content_products || []) as {
      display_order: number;
      products: { rating: number | null } | null;
    }[];
    const sorted = contentProducts.sort((a, b) => a.display_order - b.display_order);
    const topRating = sorted[0]?.products?.rating ?? null;
    return { ...item, topRating };
  });
}

export async function fetchContentByTypeAndSlug(contentType: ContentType, slug: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', contentType)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchProductsForPublicContent(contentId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content_products')
    .select('*, products(*)')
    .eq('content_id', contentId)
    .order('display_order');

  if (error) throw error;
  return data;
}
