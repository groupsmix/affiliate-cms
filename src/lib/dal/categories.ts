import { supabase } from '../supabase.js';
import type { Category, CategoryInsert, CategoryUpdate } from '../../types/index.js';

const TABLE = 'categories';

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createCategory(input: CategoryInsert): Promise<Category> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, input: CategoryUpdate): Promise<Category> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
