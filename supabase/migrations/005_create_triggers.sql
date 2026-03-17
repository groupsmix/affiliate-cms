-- Auto-update updated_at timestamp on row changes

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
