/*
  # Add system user for activity tracking

  1. Changes:
    - Insert a placeholder system user row in auth.users with a hardcoded UUID
    - This ensures our activities with user_id '00000000-0000-0000-0000-000000000000' have a valid foreign key reference

  2. Notes:
    - We're using raw SQL to add directly to auth.users
    - This user will never be used for actual authentication
    - This approach prevents foreign key constraint errors
*/

-- First check if the system user already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000'::uuid
  ) THEN
    -- Insert the system user if it doesn't exist
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      '00000000-0000-0000-0000-000000000000'::uuid,
      'system@oneai-platform.internal',
      'SYSTEM_USER_NOT_FOR_LOGIN',
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"system"}',
      '{"name":"System"}',
      false,
      'authenticated'
    );
    
    RAISE NOTICE 'System user created successfully.';
  ELSE
    RAISE NOTICE 'System user already exists.';
  END IF;
END
$$;
