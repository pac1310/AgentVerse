/*
  # Update activities table RLS policies

  1. Changes:
    - Add policy to allow system operations without user auth
    - Ensure any authenticated user can read all activities
    - Allow anon access for reading activities
    - Allow inserts for the system placeholder user

  2. Notes:
    - System activities use the placeholder ID '00000000-0000-0000-0000-000000000000'
    - We want to make reading activities available to all users
*/

-- First modify the SELECT policy to include anonymous users
DROP POLICY IF EXISTS "Anyone can read activities" ON activities;
CREATE POLICY "Anyone can view activities"
  ON activities
  FOR SELECT
  USING (true);

-- Add policy for system logging (using our placeholder UUID)
CREATE POLICY "System can record activities"
  ON activities
  FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Ensure our existing policy for authenticated users remains
-- This should already exist from the initial migration, but we'll confirm
DROP POLICY IF EXISTS "Users can record their own activities" ON activities;
CREATE POLICY "Users can record their own activities"
  ON activities
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id
  );

-- Allow service role to do anything (should already exist)
DROP POLICY IF EXISTS "Service can insert activities" ON activities;
CREATE POLICY "Service can insert activities" 
  ON activities
  FOR INSERT
  TO service_role
  WITH CHECK (true);
