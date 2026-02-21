-- ============================================================================
-- FINAL SOLUTION: Disable triggers first, then update
-- Self-hosted Supabase
-- ============================================================================

-- STEP 1: Find the exact trigger and function names
-- ============================================================================
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    proname as function_name,
    prosrc as function_source
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relnamespace = 'public'::regnamespace
   OR tgname LIKE '%role%'
   OR tgname LIKE '%admin%';

-- STEP 2: Drop the problematic triggers temporarily
-- ============================================================================
-- Based on the error, these are the trigger names to drop:

-- Drop trigger on public.users
DROP TRIGGER IF EXISTS protect_role_column ON public.users;

-- Drop trigger on public.admins (if exists)
DROP TRIGGER IF EXISTS sync_admin_role ON public.admins;

-- Drop the trigger functions (if they exist)
DROP FUNCTION IF EXISTS protect_role_column() CASCADE;
DROP FUNCTION IF EXISTS sync_admin_role() CASCADE;

-- STEP 3: Now update the user to admin
-- ============================================================================
-- Update auth.users metadata
UPDATE auth.users 
SET raw_app_meta_data = '{"role": "admin", "is_admin": true}'::jsonb,
    raw_user_meta_data = '{"role": "admin", "is_admin": true}'::jsonb
WHERE id = 'd7995159-7bcc-4fe2-92c7-a0333602eb78';

-- Update public.users role
UPDATE public.users 
SET role = 'admin',
    roles = 'Elite'
WHERE id = 'd7995159-7bcc-4fe2-92c7-a0333602eb78';

-- Insert into admins table
INSERT INTO public.admins (user_id, role)
VALUES ('d7995159-7bcc-4fe2-92c7-a0333602eb78', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- STEP 4: Recreate the triggers (IMPORTANT - restore security!)
-- ============================================================================
-- You need to get the original trigger definitions from your migration files
-- Check: /supabase/migrations/ for the original CREATE TRIGGER statements

-- Example (replace with your actual trigger definitions from migrations):
-- CREATE OR REPLACE FUNCTION protect_role_column()
-- RETURNS trigger AS $$
-- BEGIN
--   -- original function code here
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER protect_role_column
--   AFTER UPDATE ON public.users
--   FOR EACH ROW EXECUTE FUNCTION protect_role_column();

-- STEP 5: Verify the changes
-- ============================================================================
SELECT 
  u.id,
  u.username,
  u.email,
  u.role as user_role,
  u.roles as user_roles,
  a.role as admin_role,
  au.raw_app_meta_data,
  au.raw_user_meta_data,
  u.is_verified,
  u.created_at
FROM public.users u
LEFT JOIN public.admins a ON u.id = a.user_id
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.id = 'd7995159-7bcc-4fe2-92c7-a0333602eb78';

-- ============================================================================
-- ALTERNATIVE: If you can't drop triggers, use psql as postgres superuser
-- ============================================================================
/*
1. Connect via psql as postgres user:
   psql -h <your-host> -U postgres -d postgres

2. Connect to your database:
   \c kong_production

3. Disable all triggers:
   ALTER TABLE public.users DISABLE TRIGGER ALL;
   ALTER TABLE public.admins DISABLE TRIGGER ALL;

4. Update:
   UPDATE public.users SET role = 'admin' WHERE id = 'd7995159-7bcc-4fe2-92c7-a0333602eb78';

5. Enable triggers back:
   ALTER TABLE public.users ENABLE TRIGGER ALL;
   ALTER TABLE public.admins ENABLE TRIGGER ALL;
*/

-- ============================================================================
-- ANOTHER ALTERNATIVE: Update the migration file and re-run migrations
-- ============================================================================
/*
1. Find the migration file that created the protect_role_column trigger
2. Edit it to exclude this user or add an exception
3. Re-run migrations
*/
