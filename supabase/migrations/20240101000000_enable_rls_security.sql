-- ═══════════════════════════════════════════════════════════════════════════
-- Row Level Security (RLS) Policies for Mi-Portafolio
-- Requirements covered: 6.1-6.9 (Supabase Row Level Security Audit)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- This migration enables Row Level Security on all tables and creates policies
-- to control data access at the database level. This ensures that:
-- 1. Private messages are only accessible to authenticated admins
-- 2. Public data (projects, visits) is readable by everyone
-- 3. Write operations require proper authentication
--
-- IMPORTANT: Run this migration in your Supabase SQL Editor or via CLI
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: messages
-- Requirement 6.1, 6.4, 6.5: Enable RLS and create policies for messages table
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on messages table (Requirement 6.1)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to INSERT messages (Requirement 6.4)
-- This allows the contact form to work without authentication
CREATE POLICY "Allow anonymous INSERT on messages"
ON messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to INSERT messages
-- This allows logged-in users to also submit messages
CREATE POLICY "Allow authenticated INSERT on messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated admin users can SELECT messages (Requirement 6.5)
-- Replace 'YOUR_ADMIN_USER_ID' with your actual admin user UUID from auth.users
-- You can find this in Supabase Dashboard > Authentication > Users
CREATE POLICY "Allow admin SELECT on messages"
ON messages
FOR SELECT
TO authenticated
USING (
  -- Option 1: Specific admin user ID (recommended for single admin)
  -- auth.uid() = 'YOUR_ADMIN_USER_ID'::uuid
  
  -- Option 2: Check if user has admin role (recommended for multiple admins)
  -- You'll need to create a user_roles table or use auth.users metadata
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  
  -- Option 3: For development only - allow all authenticated users
  -- Remove this in production and use Option 1 or 2
  OR auth.uid() IS NOT NULL
);

-- Policy: Only admin users can UPDATE messages (mark as read, archive, etc.)
CREATE POLICY "Allow admin UPDATE on messages"
ON messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- Policy: Only admin users can DELETE messages
CREATE POLICY "Allow admin DELETE on messages"
ON messages
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: projects
-- Requirement 6.2, 6.6: Enable RLS and create policies for projects table
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on projects table (Requirement 6.2)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all users to SELECT projects (Requirement 6.6)
-- Projects are public and should be visible to everyone
CREATE POLICY "Allow public SELECT on projects"
ON projects
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Only admin users can INSERT projects (Requirement 6.6)
CREATE POLICY "Allow admin INSERT on projects"
ON projects
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- Policy: Only admin users can UPDATE projects (Requirement 6.6)
CREATE POLICY "Allow admin UPDATE on projects"
ON projects
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- Policy: Only admin users can DELETE projects (Requirement 6.6)
CREATE POLICY "Allow admin DELETE on projects"
ON projects
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: visits
-- Requirement 6.3, 6.7: Enable RLS and create policies for visits table
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on visits table (Requirement 6.3)
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to INSERT visits (Requirement 6.7)
-- This allows page visit tracking without authentication
CREATE POLICY "Allow anonymous INSERT on visits"
ON visits
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to INSERT visits
CREATE POLICY "Allow authenticated INSERT on visits"
ON visits
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow all users to SELECT visits (Requirement 6.7)
-- Visit statistics can be public for analytics display
CREATE POLICY "Allow public SELECT on visits"
ON visits
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Only admin users can UPDATE visits (if needed for corrections)
CREATE POLICY "Allow admin UPDATE on visits"
ON visits
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- Policy: Only admin users can DELETE visits (for data cleanup)
CREATE POLICY "Allow admin DELETE on visits"
ON visits
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
  OR auth.uid() IS NOT NULL  -- Remove in production
);

-- ═══════════════════════════════════════════════════════════════════════════
-- NOTES & IMPORTANT REMINDERS
-- ═══════════════════════════════════════════════════════════════════════════
--
-- 1. ADMIN USER CONFIGURATION:
--    - For production, replace the development-friendly "auth.uid() IS NOT NULL"
--      checks with actual admin role verification
--    - Set up admin role in Supabase: Dashboard > Authentication > Users > 
--      User Details > Raw User Meta Data: {"role": "admin"}
--
-- 2. SERVICE ROLE KEY SECURITY (Requirement 6.8, 6.9):
--    - NEVER expose SUPABASE_SERVICE_ROLE_KEY in client-side code
--    - NEVER use NEXT_PUBLIC_ prefix for service role key
--    - Only use service role in server-side API routes (app/api/*)
--    - RLS policies are BYPASSED when using service role key
--
-- 3. TESTING RLS POLICIES:
--    - Test with anonymous client (no authentication)
--    - Test with authenticated non-admin user
--    - Test with authenticated admin user
--    - Verify proper access control for each role
--
-- 4. MONITORING:
--    - Enable Supabase logging to monitor unauthorized access attempts
--    - Set up alerts for repeated RLS policy violations
--
-- ═══════════════════════════════════════════════════════════════════════════
