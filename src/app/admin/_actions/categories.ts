'use server';

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
