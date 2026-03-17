import { supabase } from '../supabase.js';
import type { ContentProduct, ContentProductInsert, ContentProductUpdate } from '../../types/index.js';

const TABLE = 'content_products';

export async function getProductsForContent(contentId: string): Promise<ContentProduct[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('content_id', contentId)
    .order('display_order');

  if (error) throw error;
  return data;
}

export async function getContentForProduct(productId: string): Promise<ContentProduct[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('product_id', productId)
    .order('display_order');

  if (error) throw error;
  return data;
}

export async function linkProductToContent(input: ContentProductInsert): Promise<ContentProduct> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContentProduct(id: string, input: ContentProductUpdate): Promise<ContentProduct> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlinkProductFromContent(contentId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('content_id', contentId)
    .eq('product_id', productId);

  if (error) throw error;
}

export async function unlinkAllProductsFromContent(contentId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('content_id', contentId);

  if (error) throw error;
}

export async function setProductsForContent(
  contentId: string,
  products: Omit<ContentProductInsert, 'content_id'>[]
): Promise<ContentProduct[]> {
  // Remove existing links, then insert new ones
  await unlinkAllProductsFromContent(contentId);

  if (products.length === 0) return [];

  const rows: ContentProductInsert[] = products.map((p, i) => ({
    content_id: contentId,
    product_id: p.product_id,
    placement: p.placement,
    display_order: p.display_order ?? i,
    custom_affiliate_url: p.custom_affiliate_url,
  }));

  const { data, error } = await supabase
    .from(TABLE)
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}
