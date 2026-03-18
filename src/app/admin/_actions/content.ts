'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase-server';
import { validateCreateContent, validateUpdateContent, validateContentStatus, formatErrors } from '@/lib/validation';
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

export async function createContentAction(formData: FormData): Promise<void> {
  const validation = validateCreateContent(formData);
  if (!validation.ok) {
    throw new Error(formatErrors(validation.errors));
  }

  const supabase = getSupabase();

  const title = (formData.get('title') as string).trim();
  const slug = (formData.get('slug') as string).trim();
  const content_type = formData.get('content_type') as ContentType;
  const category_id = (formData.get('category_id') as string) || null;
  const primary_keyword = (formData.get('primary_keyword') as string)?.trim() || null;

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
      faq_items: [],
      pros: [],
      cons: [],
      sub_ratings: [],
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('A content entry with this slug already exists');
    }
    throw new Error(error.message);
  }

  revalidatePath('/admin/content');
  redirect(`/admin/content/${data.id}`);
}

export async function updateContentAction(id: string, formData: FormData): Promise<void> {
  const validation = validateUpdateContent(formData);
  if (!validation.ok) {
    throw new Error(formatErrors(validation.errors));
  }

  const supabase = getSupabase();

  const body = (formData.get('body') as string) || null;
  const excerpt = (formData.get('excerpt') as string) || null;
  const meta_title = (formData.get('meta_title') as string)?.trim() || null;
  const meta_description = (formData.get('meta_description') as string)?.trim() || null;

  const prosRaw = formData.get('pros') as string;
  const consRaw = formData.get('cons') as string;
  const faqRaw = formData.get('faq_items') as string;
  const subRatingsRaw = formData.get('sub_ratings') as string;

  const pros = prosRaw ? prosRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];
  const cons = consRaw ? consRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  let faq_items: Array<{ question: string; answer: string }> = [];
  if (faqRaw) {
    try {
      faq_items = JSON.parse(faqRaw);
    } catch {
      throw new Error('Invalid FAQ JSON format');
    }
  }

  let sub_ratings: Array<{ label: string; score: number }> = [];
  if (subRatingsRaw) {
    try {
      sub_ratings = JSON.parse(subRatingsRaw);
    } catch {
      throw new Error('Invalid sub-ratings JSON format');
    }
  }

  const { error } = await supabase
    .from('content')
    .update({ body, excerpt, meta_title, meta_description, pros, cons, faq_items, sub_ratings })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/content/${id}`);
  revalidatePath('/admin/content');
}

export async function setContentStatusAction(id: string, status: ContentStatus): Promise<void> {
  const validation = validateContentStatus(status);
  if (!validation.ok) {
    throw new Error(formatErrors(validation.errors));
  }

  const supabase = getSupabase();

  const update: Record<string, string | null> = { status };
  if (status === 'published') {
    update.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('content')
    .update(update)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/content/${id}`);
  revalidatePath('/admin/content');
}

export async function deactivateContentAction(id: string): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('content')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/content/${id}`);
  revalidatePath('/admin/content');
}
