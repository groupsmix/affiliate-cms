'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

export async function fetchProductById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProductAction(formData: FormData) {
  const supabase = getSupabase();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const tagline = (formData.get('tagline') as string) || null;
  const description = (formData.get('description') as string) || null;
  const website_url = (formData.get('website_url') as string) || null;
  const affiliate_url = (formData.get('affiliate_url') as string) || null;
  const logo_url = (formData.get('logo_url') as string) || null;
  const pricing_model = (formData.get('pricing_model') as string) || null;
  const rating = formData.get('rating') ? Number(formData.get('rating')) : null;

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      tagline,
      description,
      website_url,
      affiliate_url,
      logo_url,
      pricing_model,
      rating,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/admin/products');
  redirect(`/admin/products/${data.id}`);
}

export async function updateProductAction(id: string, formData: FormData) {
  const supabase = getSupabase();

  const name = formData.get('name') as string;
  const tagline = (formData.get('tagline') as string) || null;
  const description = (formData.get('description') as string) || null;
  const website_url = (formData.get('website_url') as string) || null;
  const affiliate_url = (formData.get('affiliate_url') as string) || null;
  const logo_url = (formData.get('logo_url') as string) || null;
  const pricing_model = (formData.get('pricing_model') as string) || null;
  const rating = formData.get('rating') ? Number(formData.get('rating')) : null;

  const { error } = await supabase
    .from('products')
    .update({
      name,
      tagline,
      description,
      website_url,
      affiliate_url,
      logo_url,
      pricing_model,
      rating,
    })
    .eq('id', id);

  if (error) throw error;

  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/admin/products');
}
