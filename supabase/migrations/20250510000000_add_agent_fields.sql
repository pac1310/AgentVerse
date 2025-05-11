/*
  # Add missing fields to agents table

  1. Changes
    - Add detailed_description column for LLM-generated detailed descriptions
    - Add api_endpoint, example_request, example_response, demo_url columns for integration info
    
  2. Notes
    - These fields are used in the frontend but were missing from the database schema
*/

-- Add detailed_description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'detailed_description'
  ) THEN
    ALTER TABLE agents ADD COLUMN detailed_description text;
  END IF;
END $$;

-- Add api_endpoint column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'api_endpoint'
  ) THEN
    ALTER TABLE agents ADD COLUMN api_endpoint text;
  END IF;
END $$;

-- Add example_request column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'example_request'
  ) THEN
    ALTER TABLE agents ADD COLUMN example_request text;
  END IF;
END $$;

-- Add example_response column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'example_response'
  ) THEN
    ALTER TABLE agents ADD COLUMN example_response text;
  END IF;
END $$;

-- Add demo_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'demo_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN demo_url text;
  END IF;
END $$;

-- Fix the RLS policy to allow updates by anyone
DROP POLICY IF EXISTS "Users can update their own agents" ON agents;
CREATE POLICY "Anyone can update agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true); 