-- Add integration fields to the agents table
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS api_endpoint TEXT,
ADD COLUMN IF NOT EXISTS example_request TEXT,
ADD COLUMN IF NOT EXISTS example_response TEXT;

-- Add comments for documentation
COMMENT ON COLUMN agents.api_endpoint IS 'API endpoint for the agent';
COMMENT ON COLUMN agents.example_request IS 'Example JSON request for the agent';
COMMENT ON COLUMN agents.example_response IS 'Example JSON response from the agent'; 