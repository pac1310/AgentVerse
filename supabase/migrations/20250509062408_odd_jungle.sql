/*
  # Create agents table

  1. New Tables
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, required)
      - `version` (text, required)
      - `logo` (text)
      - `input_format` (text)
      - `output_format` (text)
      - `capabilities` (text[], required)
      - `categories` (text[], required)
      - `dependencies` (text[])
      - `performance_score` (integer)
      - `reliability_score` (integer)
      - `latency` (integer)
      - `documentation_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `creator_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `agents` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  version text NOT NULL,
  logo text,
  input_format text,
  output_format text,
  capabilities text[] NOT NULL DEFAULT '{}',
  categories text[] NOT NULL DEFAULT '{}',
  dependencies text[] DEFAULT '{}',
  performance_score integer,
  reliability_score integer,
  latency integer,
  documentation_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  creator_id uuid REFERENCES auth.users(id)
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all agents
CREATE POLICY "Anyone can read agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own agents
CREATE POLICY "Users can create their own agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Allow users to update their own agents
CREATE POLICY "Users can update their own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);