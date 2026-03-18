'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase-server';
import type { ContentStatus, ContentType } from '@/types/index';

export async function fetchContentList() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchContentById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createContentAction(formData: FormData) {
  const supabase = getSupabase();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content_type = formData.get('content_type') as ContentType;
  const category_id = (formData.get('category_id') as string) || null;
  const primary_keyword = (formData.get('primary_keyword') as string) || null;

  const { data, error } = await supabase
    .from('content')
    .insert({
      title,
      slug,
      content_type,
      category_id,
      primary_keyword,
      status: 'draft' as ContentStatus,
      language: 'ar',
      is_featured: false,
      is_active: true,
      body: null,
      excerpt: null,
      cover_image_url: null,
      author: null,
      meta_title: null,
      meta_description: null,
      published_at: null,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/admin/content');
  redirect(`/admin/content/${data.id}`);
}

export async function updateContentAction(id: string, formData: FormData) {
  const supabase = getSupabase();

  const body = (formData.get('body') as string) || null;
  const excerpt = (formData.get('excerpt') as string) || null;
  const meta_title = (formData.get('meta_title') as string) || null;
  const meta_description = (formData.get('meta_description') as string) || null;

  const { error } = await supabase
    .from('content')
    .update({ body, excerpt, meta_title, meta_description })
    .eq('id', id);

  if (error) throw error;

  revalidatePath(`/admin/content/${id}`);
  revalidatePath('/admin/content');
}

export async function setContentStatusAction(id: string, status: ContentStatus) {
  const supabase = getSupabase();

  const update: Record<string, string | null> = { status };
  if (status === 'published') {
    update.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('content')
    .update(update)
    .eq('id', id);

  if (error) throw error;

  revalidatePath(`/admin/content/${id}`);
  revalidatePath('/admin/content');
}

export async function deactivateContentAction(id: string) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('content')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;

  revalidatePath(`/admin/content/${id}`);
  revalidatePath('/admin/content');
}
