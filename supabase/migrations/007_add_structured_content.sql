-- Structured content fields for FAQ, pros, cons, sub-ratings
alter table content add column faq_items jsonb default '[]'::jsonb;
alter table content add column pros jsonb default '[]'::jsonb;
alter table content add column cons jsonb default '[]'::jsonb;
alter table content add column sub_ratings jsonb default '[]'::jsonb;

comment on column content.faq_items is 'Array of {question, answer} objects';
comment on column content.pros is 'Array of strings';
comment on column content.cons is 'Array of strings';
comment on column content.sub_ratings is 'Array of {label, score} objects, score 1-5';
