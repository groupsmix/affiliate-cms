-- Click event tracking for affiliate outbound links
create table click_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_slug text not null,
  source_path text,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_click_events_product on click_events(product_slug);
create index idx_click_events_created on click_events(created_at desc);
