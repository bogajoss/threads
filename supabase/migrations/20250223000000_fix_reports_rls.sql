-- Fix RLS policies for reports table
-- 1. Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
DROP POLICY IF EXISTS "Elite/Admins can view and manage reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can view reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;

-- 2. Create new, clean policies
-- Allow any authenticated user to insert a report (ensuring they are the reporter)
CREATE POLICY "Users can create reports"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- Allow users to view their own reports 
-- This is necessary so that after a .insert(), the client can successfully .select() the row it just created.
CREATE POLICY "Users can view own reports"
ON public.reports
FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- Allow admins/moderators to view and manage all reports
-- Uses the is_admin() helper function defined in 20240218000000_audit_fixes.sql
CREATE POLICY "Admins can manage all reports"
ON public.reports
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
