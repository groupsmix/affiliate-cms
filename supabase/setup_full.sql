-- ============================================================
-- AFFILIATE CMS — FULL SETUP
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ============================================================
-- 1. SCHEMA: Create all tables
-- ============================================================

-- CATEGORIES
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create index if not exists idx_categories_slug on categories(slug);

-- PRODUCTS
create table if not exists products (
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

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_featured on products(is_featured) where is_featured = true;
create index if not exists idx_products_active on products(is_active) where is_active = true;

-- CONTENT
create table if not exists content (
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

create index if not exists idx_content_slug on content(slug);
create index if not exists idx_content_category on content(category_id);
create index if not exists idx_content_status on content(status);
create index if not exists idx_content_type on content(content_type);
create index if not exists idx_content_featured on content(is_featured) where is_featured = true;
create index if not exists idx_content_published on content(status, published_at) where status = 'published';

-- CONTENT_PRODUCTS
create table if not exists content_products (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  placement text,
  display_order integer default 0,
  custom_affiliate_url text,
  unique(content_id, product_id)
);

create index if not exists idx_content_products_content on content_products(content_id);
create index if not exists idx_content_products_product on content_products(product_id);

-- ============================================================
-- 2. TRIGGERS: Auto-update updated_at
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop if exists to avoid errors on re-run
drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_content_updated on content;
create trigger trg_content_updated
  before update on content
  for each row execute function set_updated_at();

-- ============================================================
-- 3. RLS: Enable Row Level Security on all tables
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table content enable row level security;
alter table content_products enable row level security;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================

-- Drop existing policies if re-running
drop policy if exists "categories_public_select" on categories;
drop policy if exists "categories_auth_all" on categories;
drop policy if exists "products_public_select" on products;
drop policy if exists "products_auth_all" on products;
drop policy if exists "content_public_select" on content;
drop policy if exists "content_auth_all" on content;
drop policy if exists "content_products_public_select" on content_products;
drop policy if exists "content_products_auth_all" on content_products;

-- CATEGORIES: public SELECT, authenticated ALL
create policy "categories_public_select"
  on categories for select
  to anon, authenticated
  using (true);

create policy "categories_auth_all"
  on categories for all
  to authenticated
  using (true)
  with check (true);

-- PRODUCTS: public SELECT only when is_active = true, authenticated ALL
create policy "products_public_select"
  on products for select
  to anon
  using (is_active = true);

create policy "products_auth_all"
  on products for all
  to authenticated
  using (true)
  with check (true);

-- CONTENT: public SELECT only when status = 'published' AND is_active = true, authenticated ALL
create policy "content_public_select"
  on content for select
  to anon
  using (status = 'published' and is_active = true);

create policy "content_auth_all"
  on content for all
  to authenticated
  using (true)
  with check (true);

-- CONTENT_PRODUCTS: authenticated ALL, public SELECT for safe join access
create policy "content_products_public_select"
  on content_products for select
  to anon
  using (
    exists (
      select 1 from content c
      where c.id = content_id
        and c.status = 'published'
        and c.is_active = true
    )
  );

create policy "content_products_auth_all"
  on content_products for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- 5. TEST DATA: Insert one category and one product
-- ============================================================

insert into categories (name, slug, description)
values (
  'أدوات النشرات البريدية',
  'newsletter-tools',
  'أدوات وخدمات إدارة وإرسال النشرات البريدية'
)
on conflict (slug) do nothing;

insert into products (name, slug, category_id, tagline, website_url, affiliate_url, affiliate_network, pricing_model, rating, is_featured, is_active)
values (
  'Mailchimp',
  'mailchimp',
  (select id from categories where slug = 'newsletter-tools'),
  'منصة تسويق بريدي شاملة',
  'https://mailchimp.com',
  'https://affiliate.mailchimp.com/example',
  'Impact',
  'freemium',
  4.5,
  true,
  true
)
on conflict (slug) do nothing;

-- ============================================================
-- 6. VERIFICATION: Confirm setup
-- ============================================================

select '--- TABLE CHECK ---' as section;
select table_name, 
       (select count(*) from information_schema.columns c where c.table_name = t.table_name and c.table_schema = 'public') as column_count
from information_schema.tables t
where table_schema = 'public' 
  and table_name in ('categories', 'products', 'content', 'content_products')
order by table_name;

select '--- RLS STATUS ---' as section;
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relname in ('categories', 'products', 'content', 'content_products')
order by relname;

select '--- RLS POLICIES ---' as section;
select tablename, policyname, permissive, roles, cmd, qual
from pg_policies
where tablename in ('categories', 'products', 'content', 'content_products')
order by tablename, policyname;

select '--- ROW COUNTS ---' as section;
select 'categories' as table_name, count(*) as rows from categories
union all
select 'products', count(*) from products
union all
select 'content', count(*) from content
union all
select 'content_products', count(*) from content_products;

select '--- TEST DATA ---' as section;
select id, name, slug from categories;
select id, name, slug, rating, is_featured from products;
