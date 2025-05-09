/*
  # Add file storage for agent logos
  
  1. Changes
    - Add storage bucket for agent logos
    - Add trigger to update updated_at timestamp
    - Add policy for file access
*/

-- Create a bucket for agent logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-logos', 'agent-logos', true);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to agent logos
CREATE POLICY "Agent logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'agent-logos' );

-- Allow authenticated users to upload agent logos
CREATE POLICY "Users can upload agent logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'agent-logos' );

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();