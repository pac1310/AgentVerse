/*
  # Add storage for agent logos

  1. Changes
    - Add logo_url column to agents table
    - Add trigger for updating timestamps
    
  2. Notes
    - Storage bucket and policies are managed through Supabase dashboard
    - Logo URLs will be stored in the agents table
*/

-- Add logo_url column to agents table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN logo_url text;
  END IF;
END $$;

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_agents_updated_at'
  ) THEN
    CREATE TRIGGER update_agents_updated_at
      BEFORE UPDATE ON agents
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;