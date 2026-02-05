-- Migration V10: Fix Chat Creation RLS
-- Allows users to create conversations and see them if they are the creator or a participant

-- 1. Allow INSERT (Creation)
DROP POLICY IF EXISTS "Conversations insert policy" ON public.conversations;
CREATE POLICY "Conversations insert policy" 
ON public.conversations FOR INSERT 
TO authenticated 
WITH CHECK ( true );

-- 2. Allow SELECT (Viewing) if you are a participant OR the creator
DROP POLICY IF EXISTS "Conversations select policy" ON public.conversations;
CREATE POLICY "Conversations select policy" 
ON public.conversations FOR SELECT 
TO authenticated 
USING ( 
  public.is_conversation_participant(id) OR 
  creator_id = auth.uid() 
);

-- 3. Update UPDATE policy
DROP POLICY IF EXISTS "Conversations update policy" ON public.conversations;
CREATE POLICY "Conversations update policy" 
ON public.conversations FOR UPDATE 
TO authenticated 
USING ( public.is_conversation_participant(id) OR creator_id = auth.uid() )
WITH CHECK ( public.is_conversation_participant(id) OR creator_id = auth.uid() );

-- 4. Update DELETE policy
DROP POLICY IF EXISTS "Conversations delete policy" ON public.conversations;
CREATE POLICY "Conversations delete policy" 
ON public.conversations FOR DELETE 
TO authenticated 
USING ( public.is_conversation_participant(id) OR creator_id = auth.uid() );
