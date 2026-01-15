-- Add username column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Update RLS policy to allow public username lookup for authentication
DROP POLICY IF EXISTS "Allow public username lookup for authentication" ON profiles;
CREATE POLICY "Allow public username lookup for authentication"
ON profiles FOR SELECT
USING (true);

-- Create a function to get email from username
CREATE OR REPLACE FUNCTION get_email_from_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email TEXT;
  v_user_id UUID;
BEGIN
  -- Get user_id from profiles
  SELECT id INTO v_user_id
  FROM profiles
  WHERE username = p_username;
  
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get email from auth.users
  SELECT email INTO v_email
  FROM auth.users
  WHERE id = v_user_id;
  
  RETURN v_email;
END;
$$;

COMMENT ON COLUMN profiles.username IS 'Unique username for login, alternative to email';
