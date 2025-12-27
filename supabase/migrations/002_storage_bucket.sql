-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated uploads (using anon for simplicity)
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

CREATE POLICY "Allow deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');
