-- =============================================
-- SEED DATA untuk NAF Birdfarm
-- =============================================
-- File ini digunakan untuk mengisi data awal saat development
-- Jalankan dengan: supabase db seed
-- =============================================

-- 1. Contoh Admin Profile (gunakan dengan auth.users yang sudah ada)
-- CATATAN: User harus dibuat dulu via Supabase Auth, kemudian insert profile
-- insert into profiles (id, email, role)
-- values 
--   ('YOUR-AUTH-USER-UUID', 'admin@nafbirdfarm.com', 'admin');


-- 2. Sample Posts / Birds untuk testing
-- 2. Sample Data for Birds & Posts
-- We'll use fixed UUIDs to easily link them in post_birds

-- A. Insert Birds first
insert into birds (
  id,
  code,
  species,
  gender,
  birth_date,
  description,
  images,
  videos,
  pedigree,
  specs,
  price,
  status
) values 
(
  'b0000000-0000-0000-0000-000000000001',
  'MB-BOR-001',
  'Murai Batu Borneo',
  'male',
  '2022-01-01',
  'Burung murai batu asal Borneo dengan karakteristik ekor panjang dan volume suara yang keras.',
  ARRAY['https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400'],
  '{"youtube": "", "tiktok": ""}'::jsonb,
  '{"ayah": "Jawara Nasional 2024", "ibu": "Keturunan Murai Medan"}'::jsonb,
  '[{"label": "Jenis", "value": "Murai Batu Borneo"}, {"label": "Usia", "value": "2 Tahun"}, {"label": "Ekor", "value": "28cm"}]'::jsonb,
  7000000,
  'available'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'KC-JW-002',
  'Kacer Jawa',
  'male',
  '2022-06-01',
  'Kacer jawa dengan performa kontes yang bagus, sudah terbiasa lingkungan lomba.',
  ARRAY['https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=400'],
  '{"youtube": ""}'::jsonb,
  '{}'::jsonb,
  '[{"label": "Jenis", "value": "Kacer Jawa"}, {"label": "Usia", "value": "1.5 Tahun"}, {"label": "Warna", "value": "Hitam Legam"}]'::jsonb,
  3500000,
  'available'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'CD-MD-003',
  'Cendet Madura',
  'male',
  '2023-01-01',
  'Cendet dari madura dengan ciri khas suara roll panjang dan variasi isian yang beragam.',
  ARRAY['https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400'],
  '{}'::jsonb,
  '{}'::jsonb,
  '[{"label": "Jenis", "value": "Cendet Madura"}, {"label": "Usia", "value": "1 Tahun"}]'::jsonb,
  2000000,
  'sold'
),
(
  'b0000000-0000-0000-0000-000000000004',
  'MB-JAWARA-01',
  'Murai Batu Medan',
  'male',
  '2020-01-01',
  'Indukan Jantan (Sire) legendaris, juara nasional 3x.',
  ARRAY['https://images.unsplash.com/photo-1552728089-57bdde30ebd1?w=400'],
  '{}'::jsonb,
  '{}'::jsonb,
  '[{"label": "Prestasi", "value": "Juara Nasional 2021, 2022"}]'::jsonb,
  0,
  'breeder'
),
(
  'b0000000-0000-0000-0000-000000000005',
  'MB-RATU-01',
  'Murai Batu Bahorok',
  'female',
  '2021-03-01',
  'Indukan Betina (Dam) trah panjang, body big.',
  ARRAY['https://images.unsplash.com/photo-1615822462375-a87d01247d6a?w=400'],
  '{}'::jsonb,
  '{}'::jsonb,
  '[{"label": "Trah", "value": "Bahorok Super"}]'::jsonb,
  0,
  'breeder'
);

-- B. Insert Posts (Listings)
insert into posts (
  id,
  title, 
  slug, 
  content, 
  image_url, 
  is_published, 
  price, 
  status, 
  type, 
  tags
) values 
(
  'a0000000-0000-0000-0000-000000000001',
  'Murai Batu Borneo Premium',
  'murai-batu-borneo-premium',
  'Murai batu dari kalimantan dengan kualitas suara yang jernih dan mental fighter. Siap pantau di kandang.',
  'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
  true,
  5500000,
  'available',
  'bird_listing',
  ARRAY['murai batu', 'borneo', 'fighter', 'premium']
),
(
  'a0000000-0000-0000-0000-000000000002',
  'Kacer Jawa Jawara',
  'kacer-jawa-jawara',
  'Kacer jawa dengan mental yang kuat dan gaya tarung yang atraktif. Jaminan tidak bagong.',
  'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=400',
  true,
  2500000,
  'available',
  'bird_listing',
  ARRAY['kacer', 'jawa', 'jawara']
),
(
  'a0000000-0000-0000-0000-000000000003',
  'Cendet Madura Super',
  'cendet-madura-super',
  'Cendet madura dengan variasi suara yang banyak dan ngeroll panjang.',
  'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400',
  true,
  1800000,
  'sold',
  'bird_listing',
  ARRAY['cendet', 'madura', 'ngeroll']
);

-- C. Link Posts to Birds
insert into post_birds (post_id, bird_id) values
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'), -- Murai Post -> Murai Bird
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002'), -- Kacer Post -> Kacer Bird
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003'); -- Cendet Post -> Cendet Bird


-- 3. Sample Leads (Contoh data customer inquiries)
insert into leads (name, phone, message, status) values
('Budi Santoso', '081234567890', 'Mau tanya harga murai batu yang ready stock', 'new'),
('Ahmad Wijaya', '085678901234', 'Ada kacer yang sudah jadi untuk kontes?', 'contacted'),
('Dewi Lestari', '087890123456', 'Mau beli cendet untuk pemula, minta rekomendasi', 'new');


-- 4. Sample Subscribers
insert into subscribers (email) values
('penggemar.burung@gmail.com'),
('kicaumania@yahoo.com'),
('bird.lover.id@gmail.com');


-- =============================================
-- SELESAI
-- =============================================
-- Untuk menjalankan seed:
-- 1. Pastikan Supabase lokal sudah running: supabase start
-- 2. Jalankan seed: supabase db seed
-- =============================================
