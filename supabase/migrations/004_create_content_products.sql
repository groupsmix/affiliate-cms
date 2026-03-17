-- Content-Products junction table
-- Maps products to content with ordering and optional custom affiliate URLs

create table content_products (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  placement text,
  display_order integer default 0,
  custom_affiliate_url text,
  unique(content_id, product_id)
);

-- Indexes for lookups
create index idx_content_products_content on content_products(content_id);
create index idx_content_products_product on content_products(product_id);
