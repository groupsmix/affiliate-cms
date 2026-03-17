// ============================================================
// Database row types (matching Supabase schema)
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string;
  affiliate_url: string;
  affiliate_network: string | null;
  commission_type: string | null;
  commission_value: number | null;
  pricing_model: string | null;
  rating: number | null;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  content_type: ContentType;
  primary_keyword: string | null;
  body: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  status: ContentStatus;
  author: string | null;
  language: string;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentProduct {
  id: string;
  content_id: string;
  product_id: string;
  placement: string | null;
  display_order: number;
  custom_affiliate_url: string | null;
}

// ============================================================
// Enum-like types
// ============================================================

export type ContentType = 'best' | 'review' | 'comparison' | 'problem' | 'alternative';
export type ContentStatus = 'draft' | 'review' | 'published';

// ============================================================
// Insert/Update types (omit auto-generated fields)
// ============================================================

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type CategoryUpdate = Partial<Omit<Category, 'id' | 'created_at'>>;

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;

export type ContentInsert = Omit<Content, 'id' | 'created_at' | 'updated_at'>;
export type ContentUpdate = Partial<Omit<Content, 'id' | 'created_at' | 'updated_at'>>;

export type ContentProductInsert = Omit<ContentProduct, 'id'>;
export type ContentProductUpdate = Partial<Omit<ContentProduct, 'id' | 'content_id' | 'product_id'>>;

// ============================================================
// Query filter types
// ============================================================

export interface ProductFilters {
  category_id?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface ContentFilters {
  category_id?: string;
  content_type?: ContentType;
  status?: ContentStatus;
  is_featured?: boolean;
  is_active?: boolean;
  language?: string;
}
