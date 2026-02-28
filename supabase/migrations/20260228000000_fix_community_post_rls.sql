-- Fix: Only allow posting to communities if the user is a member,
-- and only if it's a public community OR they are an admin in a private one.
-- This aligns with the UI logic in Community.tsx and prevents unauthorized posting from /create.

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;

CREATE POLICY "Authenticated users can create posts" ON public.posts 
FOR INSERT TO authenticated 
WITH CHECK (
  (SELECT auth.uid()) = user_id 
  AND public.is_not_banned()
  AND (
    community_id IS NULL -- Public post (not in a community)
    OR EXISTS (
      SELECT 1 FROM public.community_members cm
      JOIN public.communities c ON c.id = cm.community_id
      WHERE cm.community_id = posts.community_id
      AND cm.user_id = auth.uid()
      AND (
        NOT c.is_private -- Public community: any member can post
        OR cm.role = 'admin' -- Private community: only admin can post
      )
    )
  )
);
