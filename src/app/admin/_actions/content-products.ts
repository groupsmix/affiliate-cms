'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase-server';

export async function fetchProductsForContent(contentId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content_products')
    .select('*, products(*)')
    .eq('content_id', contentId)
    .order('display_order');

  if (error) throw error;
  return data;
}

export async function linkProductAction(contentId: string, formData: FormData) {
  const supabase = getSupabase();

  const product_id = formData.get('product_id') as string;
  const placement = (formData.get('placement') as string) || null;
  const display_order = parseInt(formData.get('display_order') as string, 10) || 0;

  const { error } = await supabase
    .from('content_products')
    .insert({
      content_id: contentId,
      product_id,
      placement,
      display_order,
      custom_affiliate_url: null,
    });

  if (error) throw error;

  revalidatePath(`/admin/content/${contentId}`);
}

export async function unlinkProductAction(contentId: string, productId: string) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('content_products')
    .delete()
    .eq('content_id', contentId)
    .eq('product_id', productId);

  if (error) throw error;

  revalidatePath(`/admin/content/${contentId}`);
}
