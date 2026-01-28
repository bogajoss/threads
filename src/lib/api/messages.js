import { supabase } from "@/lib/supabase";
import { transformConversation, transformMessage } from "@/lib/transformers";

/**
 * Finds an existing conversation between two users or creates a new one.
 */
export const getOrCreateConversation = async (userId, targetUserId) => {
  const { data: myParticipants } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  const myConvIds = myParticipants.map((p) => p.conversation_id);

  const { data: existing } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", targetUserId)
    .in("conversation_id", myConvIds)
    .maybeSingle();

  if (existing) return existing.conversation_id;

  const { data: newConv, error: convError } = await supabase
    .from("conversations")
    .insert([{}])
    .select()
    .single();

  if (convError) throw convError;

  await supabase.from("conversation_participants").insert([
    { conversation_id: newConv.id, user_id: userId },
    { conversation_id: newConv.id, user_id: targetUserId },
  ]);

  return newConv.id;
};

/**
 * Fetches the count of unread messages for a user across all conversations.
 */
export const fetchUnreadMessagesCount = async (userId) => {
  if (!userId) return 0;

  const { data: convs } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  const convIds = convs?.map(c => c.conversation_id) || [];
  if (convIds.length === 0) return 0;

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .neq("sender_id", userId)
    .in("conversation_id", convIds);

  if (error) throw error;
  return count || 0;
};

/**
 * Marks all messages in a conversation as read for the current user.
 */
export const markMessagesAsRead = async (conversationId, userId) => {
  if (!conversationId || !userId) return;
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("is_read", false);

  if (error) throw error;
};

/**
 * Fetches conversations for the current user.
 */
export const fetchConversations = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("conversation_participants")
    .select(
      `
            conversation:conversations (
                id,
                last_message_at,
                last_message_content,
                participants:conversation_participants (
                    user:users (
                        id,
                        username,
                        display_name,
                        avatar_url,
                        last_seen_at
                    )
                ),
                messages (
                    id,
                    is_read,
                    sender_id
                )
            )
        `,
    )
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((item) => transformConversation(item, userId)).sort((a, b) => {
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });
};

/**
 * Fetches messages for a specific conversation.
 */
export const fetchMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map(transformMessage);
};

/**
 * Fetches all message reactions.
 */
export const fetchAllReactions = async () => {
  const { data, error } = await supabase.from("message_reactions").select("*");
  if (error) throw error;
  return data || [];
};

/**
 * Toggles a reaction on a message.
 */
export const toggleMessageReaction = async (messageId, userId, emoji) => {
  const { data: existing } = await supabase
    .from("message_reactions")
    .select("*")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    if (existing.emoji === emoji) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
      return { action: "removed", emoji };
    } else {
      await supabase
        .from("message_reactions")
        .update({ emoji })
        .eq("id", existing.id);
      return { action: "updated", emoji };
    }
  } else {
    await supabase
      .from("message_reactions")
      .insert([{ message_id: messageId, user_id: userId, emoji }]);
    return { action: "added", emoji };
  }
};

/**
 * Fetches all reactions for a conversation.
 */
export const fetchReactionsByConversation = async (conversationId) => {
  const { data, error } = await supabase
    .from("message_reactions")
    .select("*, message:messages!inner(conversation_id)")
    .eq("message.conversation_id", conversationId);

  if (error) throw error;
  return data;
};

/**
 * Sends a new message.
 */
export const sendMessage = async (
  conversationId,
  senderId,
  content,
  type = "text",
  media = [],
  replyToId = null,
) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
        media,
        reply_to_id: replyToId,
      },
    ])
    .select();

  if (error) throw error;

  // Update conversation last_message details manually since we don't have a DB trigger
  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date(),
      last_message_content: type === "image" || (media && media.length > 0) ? "Sent an image" : content,
    })
    .eq("id", conversationId);

  return data[0];
};

/**
 * Deletes a message by ID.
 */
export const deleteMessage = async (messageId) => {
  const { error } = await supabase.from("messages").delete().eq("id", messageId);
  if (error) throw error;
};
