-- Chạy file này MỘT LẦN trong Supabase: SQL Editor > New query > dán > Run.
-- Tạo bảng "recipes" để bạn sửa món ăn trong trang quản trị.

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'soup',
  icon text not null default '🍲',
  name text not null,
  time text not null default '',
  serves text not null default '',
  ingredients text not null default '',
  steps text not null default '',
  image_url text not null default '',
  image_pos text not null default '50% 50%',
  credit text not null default '',
  sort int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;
drop policy if exists "recipes read" on public.recipes;
drop policy if exists "recipes write" on public.recipes;
create policy "recipes read" on public.recipes for select to anon, authenticated using (true);
create policy "recipes write" on public.recipes for all to authenticated using (true) with check (true);

-- 6 món mẫu ban đầu (chỉ thêm khi bảng còn trống)
insert into public.recipes (category, icon, name, time, serves, ingredients, steps, image_url, image_pos, credit, sort)
select * from (values
  ('soup', '🍲', 'Lẩu cá tầm măng chua', '35–45 phút', '4 người', E'600–800 g cá tầm cắt khúc\n300 g măng chua, 2 quả cà chua\nDứa, hành tím, thì là, rau ăn lẩu\nNước dùng, nước mắm, gia vị', E'Rã đông cá trong ngăn mát, rửa nhanh và thấm ráo.\nPhi hành tím, xào cà chua và măng chua cho dậy mùi.\nCho nước dùng và dứa vào, đun sôi, nêm chua ngọt vừa ăn.\nThả cá vào nấu chín hoàn toàn, thêm thì là, ăn cùng bún và rau.', 'assets/img/lau.webp', '50% 55%', '', 1),
  ('grill', '🔥', 'Cá tầm nướng muối ớt', '30–40 phút', '3–4 người', E'600 g cá tầm cắt khoanh\nSả, tỏi, ớt băm, dầu ăn\nMuối, đường, nước mắm\nRau sống, chanh ăn kèm', E'Rã đông trong ngăn mát, thấm khô từng khoanh cá.\nTrộn sả, tỏi, ớt và gia vị, ướp cá 15–20 phút trong ngăn mát.\nNướng trên vỉ hoặc nồi chiên, trở mặt, phết chút dầu cho khỏi khô.\nNướng đến khi thịt cá chín đục, dễ tách, dùng nóng với rau.', 'assets/img/nuong.webp', '50% 45%', '', 2),
  ('steam', '🥢', 'Cá tầm hấp xì dầu', '25–30 phút', '2–3 người', E'500–600 g cá tầm\nGừng thái sợi, hành lá, nấm\nXì dầu, chút đường, tiêu\nDầu mè (tuỳ thích)', E'Đặt cá đã rã đông lên đĩa chịu nhiệt, rải gừng và nấm lên mặt.\nPha xì dầu, đường và chút nước rồi rưới lên cá.\nHấp khi nước đã sôi đến khi cá chín hoàn toàn.\nThêm hành lá, tiêu và chút dầu mè trước khi dùng.', 'assets/img/hap.webp', '50% 50%', 'Ảnh minh họa: Pexels', 3),
  ('fry', '🍤', 'Cá tầm chiên giòn', '25–35 phút', '3 người', E'500 g cá tầm cắt miếng\nBột chiên giòn, 1 quả trứng (tuỳ chọn)\nMuối, tiêu, tỏi băm\nDầu ăn và nước chấm', E'Rã đông, thấm thật khô cá rồi ướp nhẹ muối tiêu.\nÁo đều lớp bột mỏng, có thể dùng trứng cho bột bám tốt hơn.\nChiên dầu nóng lửa vừa, trở đều các mặt.\nVớt ra để ráo khi cá chín bên trong, ăn ngay.', 'assets/img/chien.webp', '50% 50%', 'Ảnh: Pexels', 4),
  ('braise', '🍛', 'Cá tầm kho nghệ', '35–45 phút', '3–4 người', E'600 g cá tầm\nNghệ tươi giã nhỏ hoặc bột nghệ\nHành tím, tỏi, tiêu\nNước mắm, đường, nước lọc', E'Ướp cá với nghệ, hành tỏi, nước mắm và chút đường.\nCho cá vào nồi, thêm ít nước rồi đun sôi nhẹ.\nHạ lửa, kho liu riu, trở cá cẩn thận kẻo nát.\nNấu đến khi cá chín kỹ, nước kho sánh và vừa miệng.', 'assets/img/kho.webp', '50% 50%', 'Ảnh minh họa: Pexels', 5),
  ('soup', '🥣', 'Canh chua cá tầm', '25–35 phút', '4 người', E'500–600 g cá tầm\nCà chua, dứa, đậu bắp, bạc hà\nMe hoặc nước cốt chanh\nRau ngổ, ngò gai, gia vị', E'Đun nước với cà chua và dứa, thêm me tạo vị chua.\nCho cá vào nước đang sôi nhẹ, hớt bọt nếu cần.\nThêm đậu bắp, bạc hà, nêm lại chua – mặn – ngọt.\nNấu đến khi cá chín hoàn toàn rồi thêm rau thơm.', 'assets/img/canh-chua.webp', '50% 88%', 'Ảnh minh họa: fmmartian / Pixabay', 6)
) as v(category, icon, name, time, serves, ingredients, steps, image_url, image_pos, credit, sort)
where not exists (select 1 from public.recipes);
