-- Chạy toàn bộ file này một lần trong Supabase: SQL Editor > New query > Run.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price text not null default 'Liên hệ',
  unit text not null default '/kg',
  image_url text not null default '',
  in_stock boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null default ''
);

alter table public.products enable row level security;
alter table public.settings enable row level security;

-- Ai cũng xem được (trang khách). Chỉ người đã đăng nhập mới được sửa.
drop policy if exists "products read" on public.products;
drop policy if exists "products write" on public.products;
drop policy if exists "settings read" on public.settings;
drop policy if exists "settings write" on public.settings;

create policy "products read" on public.products for select to anon, authenticated using (true);
create policy "products write" on public.products for all to authenticated using (true) with check (true);
create policy "settings read" on public.settings for select to anon, authenticated using (true);
create policy "settings write" on public.settings for all to authenticated using (true) with check (true);

-- Kho ảnh sản phẩm
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "images read" on storage.objects;
drop policy if exists "images insert" on storage.objects;
drop policy if exists "images update" on storage.objects;
drop policy if exists "images delete" on storage.objects;

create policy "images read" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
create policy "images insert" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "images update" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "images delete" on storage.objects for delete to authenticated using (bucket_id = 'product-images');

-- Dữ liệu ban đầu (sửa thoải mái trong trang quản trị)
insert into public.settings (key, value) values
  ('zalo', '0336544246'),
  ('open_time', '08:00'),
  ('close_time', '18:00'),
  ('delivery_area', 'Nhắn Zalo để biết khu vực giao hàng'),
  ('banner_text', ''),
  ('banner_on', 'false')
on conflict (key) do nothing;

insert into public.products (name, description, price, unit, sort) values
  ('Cá tầm nguyên con sơ chế', 'Đã làm sạch, sẵn sàng nấu lẩu, nướng, hấp.', 'Liên hệ', '/kg', 1),
  ('Cá tầm cắt khúc', 'Chia phần vừa ăn cho bữa cơm gia đình.', 'Liên hệ', '/kg', 2),
  ('Cá tầm phi lê', 'Lọc xương, dễ chế biến, hợp món chiên và hấp.', 'Liên hệ', '/kg', 3);
