-- Migration V8: Add mark_messages_read function
-- Created: 2026-02-01

CREATE OR REPLACE FUNCTION mark_messages_read(p_conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is a participant
  IF EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id
    AND user_id = auth.uid()
  ) THEN
    -- Update unread messages sent by others
    UPDATE public.messages
    SET is_read = true
    WHERE conversation_id = p_conversation_id
    AND sender_id != auth.uid()
    AND is_read = false;
  ELSE
    RAISE EXCEPTION 'Not a participant of this conversation';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
