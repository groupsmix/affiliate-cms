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
