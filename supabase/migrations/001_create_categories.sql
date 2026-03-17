-- Categories table
-- Top-level grouping for products and content

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Index for slug-based lookups
create index idx_categories_slug on categories(slug);
