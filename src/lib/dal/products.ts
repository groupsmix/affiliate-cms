import { supabase } from '../supabase.js';
import type { Product, ProductInsert, ProductUpdate, ProductFilters } from '../../types/index.js';

const TABLE = 'products';

export async function listProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase.from(TABLE).select('*');

  if (filters?.category_id) query = query.eq('category_id', filters.category_id);
  if (filters?.is_featured !== undefined) query = query.eq('is_featured', filters.is_featured);
  if (filters?.is_active !== undefined) query = query.eq('is_active', filters.is_active);

  const { data, error } = await query.order('name');

  if (error) throw error;
  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProduct(input: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: ProductUpdate): Promise<Product> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return listProducts({ is_featured: true, is_active: true });
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return listProducts({ category_id: categoryId, is_active: true });
}
