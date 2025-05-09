-- This script will update any NULL logo_url values to the default 'brain' value
-- This ensures existing records have a valid default icon if no custom image was uploaded

-- Update logo_url to 'brain' where it's currently NULL
UPDATE agents
SET logo_url = 'brain'
WHERE logo_url IS NULL;

-- Verify the changes
SELECT id, name, logo_url FROM agents; 