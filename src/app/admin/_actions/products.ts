'use server';

import { getSupabase } from '@/lib/supabase-server';

export async function fetchProductsList() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}
