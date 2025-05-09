-- Add detailed_description column to agents table
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS detailed_description TEXT;

-- Comment on the column
COMMENT ON COLUMN agents.detailed_description IS 'Detailed AI-generated description of the agent';

-- For any existing records that don't have a detailed description yet,
-- we'll generate them using the HuggingFace API through the application. 