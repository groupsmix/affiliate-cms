'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase-server';

export async function fetchCategories() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createCategoryAction(formData: FormData) {
  const supabase = getSupabase();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = (formData.get('description') as string) || null;

  const { error } = await supabase
    .from('categories')
    .insert({ name, slug, description });

  if (error) throw error;
  revalidatePath('/admin/categories');
}

export async function deleteCategoryAction(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/admin/categories');
}
