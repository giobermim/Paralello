-- Add username column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Update RLS policies to allow username lookup
CREATE POLICY IF NOT EXISTS "Allow public username lookup for auth"
  ON profiles FOR SELECT
  USING (true);
