-- Products table
-- Stores affiliate product data with category linkage

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category_id uuid references categories(id),
  tagline text,
  description text,
  logo_url text,
  website_url text not null,
  affiliate_url text not null,
  affiliate_network text,
  commission_type text,
  commission_value numeric,
  pricing_model text,
  rating numeric(2,1),
  is_featured boolean default false,
  is_active boolean default true,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for common lookups
create index idx_products_slug on products(slug);
create index idx_products_category on products(category_id);
create index idx_products_featured on products(is_featured) where is_featured = true;
create index idx_products_active on products(is_active) where is_active = true;
