/*
  # Create activity tracking table

  1. New Tables
    - `activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `user_name` (text, the name of the user)
      - `action` (text, the action performed - registered, updated, used, commented on)
      - `subject_id` (uuid, the id of the related object, typically an agent)
      - `subject_name` (text, the name of the related object)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `activities` table
    - Add policies for authenticated users to read all activities
    - Allow the system to insert activities
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  user_name text NOT NULL,
  action text NOT NULL,
  subject_id uuid,
  subject_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add an index on created_at for faster queries when sorting by recency
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);

-- Enable row level security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read activities
CREATE POLICY "Anyone can read activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow the service role to insert activities (will be used by triggers and backend services)
CREATE POLICY "Service can insert activities"
  ON activities
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to create records of their own activities
CREATE POLICY "Users can record their own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
