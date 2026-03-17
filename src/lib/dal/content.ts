import { supabase } from '../supabase.js';
import type { Content, ContentInsert, ContentUpdate, ContentFilters, ContentStatus } from '../../types/index.js';

const TABLE = 'content';

export async function listContent(filters?: ContentFilters): Promise<Content[]> {
  let query = supabase.from(TABLE).select('*');

  if (filters?.category_id) query = query.eq('category_id', filters.category_id);
  if (filters?.content_type) query = query.eq('content_type', filters.content_type);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.is_featured !== undefined) query = query.eq('is_featured', filters.is_featured);
  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active);
  if (filters?.language) query = query.eq('language', filters.language);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContentById(id: string): Promise<Content | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getContentBySlug(slug: string): Promise<Content | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createContent(input: ContentInsert): Promise<Content> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContent(id: string, input: ContentUpdate): Promise<Content> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContent(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// --- Status workflow helpers ---

export async function setContentStatus(id: string, status: ContentStatus): Promise<Content> {
  const update: ContentUpdate = { status };

  // Auto-set published_at when publishing
  if (status === 'published') {
    update.published_at = new Date().toISOString();
  }

  return updateContent(id, update);
}

export async function publishContent(id: string): Promise<Content> {
  return setContentStatus(id, 'published');
}

export async function unpublishContent(id: string): Promise<Content> {
  return setContentStatus(id, 'draft');
}

// --- Query helpers ---

export async function getPublishedContent(): Promise<Content[]> {
  return listContent({ status: 'published', is_active: true });
}

export async function getContentByCategory(categoryId: string): Promise<Content[]> {
  return listContent({ category_id: categoryId, status: 'published', is_active: true });
}

export async function getFeaturedContent(): Promise<Content[]> {
  return listContent({ is_featured: true, status: 'published', is_active: true });
}
