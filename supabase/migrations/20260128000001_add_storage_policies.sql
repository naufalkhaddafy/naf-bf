-- Create the 'media' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;



-- Policy: Allow Public Read Access (so images can be seen by everyone)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Policy: Allow Authenticated Users to Upload (INSERT)
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow Authenticated Users to Update/Delete
DROP POLICY IF EXISTS "Authenticated users can update/delete" ON storage.objects;
CREATE POLICY "Authenticated users can update/delete"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND auth.role() = 'authenticated'
);
