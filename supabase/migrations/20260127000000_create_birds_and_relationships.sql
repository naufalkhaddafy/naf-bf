-- 1. Create 'posts' table (The Listing)
-- Moved from initial_schema to here to consolidate "Marketplace" feature
CREATE TABLE IF NOT EXISTS posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text, 
  image_url text, 
  is_published boolean DEFAULT false,
  price bigint, 
  status text DEFAULT 'available', -- available, sold, booked
  type text DEFAULT 'bird_listing', -- bird_listing, article
  tags text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'birds' table (Individual Bird Data)
CREATE TABLE IF NOT EXISTS birds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL, -- Ring Number / ID
  species text NOT NULL,
  gender text CHECK (gender IN ('male', 'female', 'unknown')),
  birth_date date,
  description text,
  images text[], -- Array of image URLs
  videos jsonb, -- { main: "url", others: [] }
  pedigree jsonb, -- Family tree structure
  specs jsonb, -- { tail_length: "20cm", etc }
  status text DEFAULT 'available', -- available, sold, deceased
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create 'post_birds' junction table (1 Post -> Many Birds, though logically 1 or 2)
CREATE TABLE IF NOT EXISTS post_birds (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  bird_id uuid REFERENCES birds(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, bird_id)
);

-- 4. Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE birds ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_birds ENABLE ROW LEVEL SECURITY;

-- 5. Policies for 'posts'
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public view published posts" ON posts;
  DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
  DROP POLICY IF EXISTS "Admins can insert posts" ON posts;
  DROP POLICY IF EXISTS "Admins can update posts" ON posts;
  DROP POLICY IF EXISTS "Admins can delete posts" ON posts;
END $$;

CREATE POLICY "Public view published posts" ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all posts" ON posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert posts" ON posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update posts" ON posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete posts" ON posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Policies for 'birds'
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view birds" ON birds;
  DROP POLICY IF EXISTS "Admins can insert birds" ON birds;
  DROP POLICY IF EXISTS "Admins can update birds" ON birds;
  DROP POLICY IF EXISTS "Admins can delete birds" ON birds;
END $$;

CREATE POLICY "Public can view birds" ON birds FOR SELECT USING (true);
CREATE POLICY "Admins can insert birds" ON birds FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update birds" ON birds FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete birds" ON birds FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Policies for 'post_birds'
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view post_birds" ON post_birds;
  DROP POLICY IF EXISTS "Admins can manage post_birds" ON post_birds;
END $$;

CREATE POLICY "Public can view post_birds" ON post_birds FOR SELECT USING (true);
CREATE POLICY "Admins can manage post_birds" ON post_birds FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
