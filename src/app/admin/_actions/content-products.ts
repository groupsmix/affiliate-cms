'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase-server';
import { validateLinkProduct, validateUUID, formatErrors } from '@/lib/validation';

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

export async function linkProductAction(contentId: string, formData: FormData): Promise<void> {
  const idCheck = validateUUID(contentId, 'content_id');
  if (!idCheck.ok) {
    throw new Error(formatErrors(idCheck.errors));
  }

  const validation = validateLinkProduct(formData);
  if (!validation.ok) {
    throw new Error(formatErrors(validation.errors));
  }

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

  if (error) {
    if (error.code === '23505') {
      throw new Error('This product is already linked to this content');
    }
    throw new Error(error.message);
  }

  revalidatePath(`/admin/content/${contentId}`);
}

export async function unlinkProductAction(contentId: string, productId: string): Promise<void> {
  const idCheck1 = validateUUID(contentId, 'content_id');
  const idCheck2 = validateUUID(productId, 'product_id');
  if (!idCheck1.ok || !idCheck2.ok) {
    throw new Error(formatErrors([...idCheck1.errors, ...idCheck2.errors]));
  }

  const supabase = getSupabase();

  const { error } = await supabase
    .from('content_products')
    .delete()
    .eq('content_id', contentId)
    .eq('product_id', productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/content/${contentId}`);
}
