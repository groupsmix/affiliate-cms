-- Content table
-- Stores articles, reviews, comparisons, etc.

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

-- Indexes for common lookups
create index idx_content_slug on content(slug);
create index idx_content_category on content(category_id);
create index idx_content_status on content(status);
create index idx_content_type on content(content_type);
create index idx_content_featured on content(is_featured) where is_featured = true;
create index idx_content_published on content(status, published_at) where status = 'published';
