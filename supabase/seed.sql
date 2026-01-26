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
insert into posts (
  title, 
  slug, 
  content, 
  image_url, 
  is_published, 
  price, 
  code, 
  status, 
  type, 
  tags, 
  description,
  specs,
  pedigree,
  videos
) values 
(
  'Murai Batu Borneo Premium',
  'murai-batu-borneo-premium',
  'Murai batu dari kalimantan dengan kualitas suara yang jernih dan mental fighter',
  'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
  true,
  5500000,
  'MB-BOR-001',
  'available',
  'bird',
  ARRAY['murai batu', 'borneo', 'fighter', 'premium'],
  'Burung murai batu asal Borneo dengan karakteristik ekor panjang dan volume suara yang keras. Cocok untuk kontes.',
  '[{"label": "Jenis", "value": "Murai Batu Borneo"}, {"label": "Usia", "value": "2 Tahun"}, {"label": "Ekor", "value": "28cm"}]'::jsonb,
  '{"ayah": "Jawara Nasional 2024", "ibu": "Keturunan Murai Medan"}'::jsonb,
  '{"youtube": "", "tiktok": ""}'::jsonb
),
(
  'Kacer Jawa Jawara',
  'kacer-jawa-jawara',
  'Kacer jawa dengan mental yang kuat dan gaya tarung yang atraktif',
  'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=400',
  true,
  2500000,
  'KC-JW-002',
  'available',
  'bird',
  ARRAY['kacer', 'jawa', 'jawara'],
  'Kacer jawa dengan performa kontes yang bagus, sudah terbiasa lingkungan lomba.',
  '[{"label": "Jenis", "value": "Kacer Jawa"}, {"label": "Usia", "value": "1.5 Tahun"}, {"label": "Warna", "value": "Hitam Legam"}]'::jsonb,
  '{}'::jsonb,
  '{"youtube": ""}'::jsonb
),
(
  'Cendet Madura Super',
  'cendet-madura-super',
  'Cendet madura dengan variasi suara yang banyak dan ngeroll panjang',
  'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400',
  true,
  1800000,
  'CD-MD-003',
  'sold',
  'bird',
  ARRAY['cendet', 'madura', 'ngeroll'],
  'Cendet dari madura dengan ciri khas suara roll panjang dan variasi isian yang beragam.',
  '[{"label": "Jenis", "value": "Cendet Madura"}, {"label": "Usia", "value": "1 Tahun"}]'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb
);


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
