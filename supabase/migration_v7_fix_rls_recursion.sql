-- Migration V7: Fix RLS Recursion (Version 2)
-- Created: 2026-02-01

-- 1. Create a helper function to check conversation membership
-- This function runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_id = conv_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop all messaging policies to start fresh
DROP POLICY IF EXISTS "Users can view conversations they are part of" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own participation" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view other participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can react to messages in their conversations" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can view message reactions in their conversations" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can remove their own reactions" ON public.message_reactions;

-- 3. Apply non-recursive policies using the helper function

-- Conversations
CREATE POLICY "Conversations select policy" 
ON public.conversations FOR SELECT 
TO authenticated 
USING ( public.is_conversation_participant(id) );

-- Conversation Participants
-- Rule: You can see a record if it's YOURS, or if you are in the same conversation
CREATE POLICY "Participants select policy" 
ON public.conversation_participants FOR SELECT 
TO authenticated 
USING ( 
  user_id = auth.uid() OR 
  public.is_conversation_participant(conversation_id) 
);

-- Messages
CREATE POLICY "Messages select policy" 
ON public.messages FOR SELECT 
TO authenticated 
USING ( public.is_conversation_participant(conversation_id) );

CREATE POLICY "Messages insert policy" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK ( 
  sender_id = auth.uid() AND 
  public.is_conversation_participant(conversation_id) 
);

-- Message Reactions
CREATE POLICY "Reactions select policy" 
ON public.message_reactions FOR SELECT 
TO authenticated 
USING ( 
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_id 
    AND public.is_conversation_participant(m.conversation_id)
  )
);

CREATE POLICY "Reactions insert policy" 
ON public.message_reactions FOR INSERT 
TO authenticated 
WITH CHECK ( 
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_id 
    AND public.is_conversation_participant(m.conversation_id)
  )
);

CREATE POLICY "Reactions delete policy" 
ON public.message_reactions FOR DELETE 
TO authenticated 
USING ( user_id = auth.uid() );