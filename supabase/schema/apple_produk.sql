-- Supabase schema: public.apple_produk
-- Source: Applestoremalaysia Supabase project
-- Generated from the current live table schema.

create table if not exists public.apple_produk (
  item_group_id text primary key,
  title text not null,
  description text,
  availability text default 'in stock'::text,
  condition text default 'new'::text,
  brand text default 'Apple'::text,
  link text,
  google_product_category text,
  product_type text,
  quantity_to_sell_on_facebook integer default 0,
  custom_label_0 text default ''::text,
  custom_label_1 text default ''::text,
  custom_label_2 text default ''::text,
  custom_label_3 text default ''::text,
  custom_label_4 text default ''::text,
  custom_label_5 text default ''::text,
  variant_color jsonb not null default '[]'::jsonb,
  variant_size jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  main_features jsonb,
  sub_features jsonb,
  headline text,
  band text
);
