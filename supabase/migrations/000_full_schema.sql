-- Full schema: Run this file to set up the entire database in one go.
-- Individual migrations (001-005) are provided for incremental setup.

-- ============================================================
-- CATEGORIES
-- ============================================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create index idx_categories_slug on categories(slug);

-- ============================================================
-- PRODUCTS
-- ============================================================
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

create index idx_products_slug on products(slug);
create index idx_products_category on products(category_id);
create index idx_products_featured on products(is_featured) where is_featured = true;
create index idx_products_active on products(is_active) where is_active = true;

-- ============================================================
-- CONTENT
-- ============================================================
create table content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category_id uuid references categories(id),
  content_type text not null check (
    content_type in ('best', 'review', 'comparison', 'problem', 'alternative')
  ),
  primary_keyword text,
  body text,
  excerpt text,
  cover_image_url text,
  status text default 'draft' check (
    status in ('draft', 'review', 'published')
  ),
  author text,
  language text default 'ar',
  is_featured boolean default false,
  is_active boolean default true,
  meta_title text,
  meta_description text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_content_slug on content(slug);
create index idx_content_category on content(category_id);
create index idx_content_status on content(status);
create index idx_content_type on content(content_type);
create index idx_content_featured on content(is_featured) where is_featured = true;
create index idx_content_published on content(status, published_at) where status = 'published';

-- ============================================================
-- CONTENT_PRODUCTS
-- ============================================================
create table content_products (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  placement text,
  display_order integer default 0,
  custom_affiliate_url text,
  unique(content_id, product_id)
);

create index idx_content_products_content on content_products(content_id);
create index idx_content_products_product on content_products(product_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated
  before update on products
  for each row execute function set_updated_at();

create trigger trg_content_updated
  before update on content
  for each row execute function set_updated_at();
