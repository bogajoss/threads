import { supabase } from "@/lib/supabase";
import { transformConversation, transformMessage } from "@/lib/transformers";
import type { Conversation, Message } from "@/types/index";
import { deleteMultipleFiles } from "./storage";

export const getOrCreateConversation = async (
  userId: string,
  targetUserId: string,
): Promise<string> => {
  const { data, error } = await (supabase.rpc as any)("get_or_create_dm", {
    p_user_id: userId,
    p_target_id: targetUserId,
  });

  if (error) throw error;
  return data as string;
};

export const createGroupConversation = async (
  creatorId: string,
  name: string,
  participantIds: string[],
  avatarUrl: string | null = null,
): Promise<string> => {
  const { data: newConv, error: convError } = await (
    supabase.from("conversations") as any
  )
    .insert({
      is_group: true,
      name,
      avatar_url: avatarUrl,
      creator_id: creatorId,
    })
    .select()
    .single();

  if (convError) throw convError;

  const convId = (newConv as any).id;

  const participants = Array.from(new Set([creatorId, ...participantIds])).map(
    (uid) => ({
      conversation_id: convId,
      user_id: uid,
    }),
  );

  const { error: partError } = await (
    supabase.from("conversation_participants") as any
  ).insert(participants);

  if (partError) throw partError;

  return convId;
};

export const addParticipantsToConversation = async (
  conversationId: string,
  userIds: string[],
): Promise<void> => {
  const participants = userIds.map((uid) => ({
    conversation_id: conversationId,
    user_id: uid,
  }));

  const { error } = await (
    supabase.from("conversation_participants") as any
  ).insert(participants);

  if (error) throw error;
};

export const fetchUnreadMessagesCount = async (
  userId: string,
): Promise<number> => {
  if (!userId) return 0;

  const { data: convs } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  const convIds = convs?.map((c: any) => c.conversation_id) || [];
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

export const markMessagesAsRead = async (
  conversationId: string,
): Promise<void> => {
  if (!conversationId) return;

  const { error } = await (supabase.rpc as any)("mark_messages_read", {
    p_conversation_id: conversationId,
  });

  if (error) throw error;
};

export const fetchConversations = async (
  userId: string,
): Promise<Conversation[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("conversation_participants")
    .select(
      `
            conversation:conversations (
                id,
                is_group,
                name,
                avatar_url,
                creator_id,
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

  const transformed = (data || [])
    .map((item) => transformConversation(item, userId))
    .filter((c): c is Conversation => c !== null);

  // Client-side deduplication for DMs
  // If we have multiple conversations with the same user, keep only the most recent one
  const uniqueConversations: Conversation[] = [];
  const dmUserIds = new Set<string>();

  // Sort by last activity first so we keep the most recent one
  const sorted = [...transformed].sort((a, b) => {
    const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return timeB - timeA;
  });

  for (const conv of sorted) {
    if (!conv.isGroup && conv.user?.id) {
      if (dmUserIds.has(conv.user.id)) {
        continue; // Skip duplicate DM
      }
      dmUserIds.add(conv.user.id);
    }
    uniqueConversations.push(conv);
  }

  return uniqueConversations;
};

export const fetchMessages = async (
  conversationId: string,
  lastTimestamp: string | null = null,
  limit: number = 20,
): Promise<Message[]> => {
  let query = supabase
    .from("messages")
    .select(
      `
            *,
            sender:users!sender_id (
                id,
                username,
                display_name,
                avatar_url
            ),
            reply_to:messages!reply_to_id (
                id,
                content,
                sender:users!sender_id (
                    id,
                    username,
                    display_name
                )
            )
        `,
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || [])
    .map(transformMessage)
    .filter((m): m is Message => m !== null);
};

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export const fetchReactionsByConversation = async (
  conversationId: string,
): Promise<Reaction[]> => {
  const { data, error } = await supabase
    .from("message_reactions")
    .select("*, message:messages!inner(conversation_id)")
    .eq("message.conversation_id", conversationId);

  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    message_id: r.message_id,
    user_id: r.user_id,
    emoji: r.emoji,
    created_at: r.created_at,
  }));
};

export const fetchAllReactions = async (): Promise<Reaction[]> => {
  console.warn("fetchAllReactions is deprecated for performance reasons.");
  return [];
};

export const toggleMessageReaction = async (
  messageId: string,
  userId: string,
  emoji: string,
): Promise<{ action: "added" | "removed" | "updated"; emoji: string }> => {
  const { data: existing } = await (supabase.from("message_reactions") as any)
    .select("*")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    if ((existing as any).emoji === emoji) {
      await (supabase.from("message_reactions") as any)
        .delete()
        .eq("id", (existing as any).id);
      return { action: "removed", emoji };
    } else {
      await (supabase.from("message_reactions") as any)
        .update({ emoji })
        .eq("id", (existing as any).id);
      return { action: "updated", emoji };
    }
  } else {
    await (supabase.from("message_reactions") as any).insert([
      { message_id: messageId, user_id: userId, emoji },
    ]);
    return { action: "added", emoji };
  }
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
  type: string = "text",
  media: any[] = [],
  replyToId: string | null = null,
): Promise<Message | null> => {
  const { data, error } = await (supabase.from("messages") as any)
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

  await (supabase.from("conversations") as any)
    .update({
      last_message_at: new Date().toISOString(),
      last_message_content:
        type === "image"
          ? "Sent an image"
          : type === "video"
            ? "Sent a video"
            : type === "voice"
              ? "Voice message"
              : content,
    })
    .eq("id", conversationId);

  return transformMessage(data?.[0]);
};

export const editMessage = async (
  messageId: string,
  content: string,
): Promise<Message | null> => {
  const { data, error } = await (supabase.from("messages") as any)
    .update({ content })
    .eq("id", messageId)
    .select()
    .single();

  if (error) throw error;
  return transformMessage(data);
};

export const deleteConversation = async (
  conversationId: string,
): Promise<void> => {
  const { data: msgs } = await (supabase
    .from("messages")
    .select("media")
    .eq("conversation_id", conversationId) as any);

  if (msgs && msgs.length > 0) {
    const allUrls: string[] = [];
    msgs.forEach((m: any) => {
      if (m.media) {
        if (Array.isArray(m.media)) allUrls.push(...m.media);
        else allUrls.push(m.media);
      }
    });
    if (allUrls.length > 0) await deleteMultipleFiles(allUrls);
  }

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) throw error;
};

export const leaveConversation = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  const { error } = await (supabase.from("conversation_participants") as any)
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);

  if (error) throw error;
};

export const removeParticipant = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  const { error } = await (supabase.from("conversation_participants") as any)
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);

  if (error) throw error;
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const { data: message } = await (supabase
    .from("messages")
    .select("media")
    .eq("id", messageId)
    .single() as any);

  if (message?.media && Array.isArray(message.media)) {
    await deleteMultipleFiles(message.media);
  } else if (message?.media && typeof message.media === "string") {
    await deleteMultipleFiles([message.media]);
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);
  if (error) throw error;
};

export const fetchConversationParticipants = async (
  conversationId: string,
  page: number = 1,
  limit: number = 50,
): Promise<any[]> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await (supabase
    .from("conversation_participants")
    .select(
      `
            user:users (
                id,
                username,
                display_name,
                avatar_url
            )
        `,
    )
    .eq("conversation_id", conversationId)
    .range(from, to) as any);

  if (error) throw error;
  return (data || []).map((p: any) => p.user);
};

export const updateConversation = async (
  conversationId: string,
  updates: any,
): Promise<any> => {
  const { data, error } = await (supabase.from("conversations") as any)
    .update(updates)
    .eq("id", conversationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
