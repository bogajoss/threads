import { supabase } from "@/lib/supabase";
import { transformConversation, transformMessage } from "@/lib/transformers";
import type { Conversation, Message } from "@/types/index";

/**
 * Finds an existing conversation between two users or creates a new one.
 */
export const getOrCreateConversation = async (userId: string, targetUserId: string): Promise<string> => {
    const { data: myParticipants } = await (supabase
        .from("conversation_participants") as any)
        .select("conversation_id")
        .eq("user_id", userId);

    const myConvIds = (myParticipants || []).map((p: any) => p.conversation_id);

    const { data: existing } = await (supabase
        .from("conversation_participants") as any)
        .select("conversation_id")
        .eq("user_id", targetUserId)
        .in("conversation_id", myConvIds)
        .maybeSingle();

    if (existing) return existing.conversation_id;

    const { data: newConv, error: convError } = await (supabase
        .from("conversations") as any)
        .insert({}) // Use default values if any, or empty object if allowed
        .select()
        .single();

    if (convError) throw convError;

    await (supabase.from("conversation_participants") as any).insert([
        { conversation_id: (newConv as any).id, user_id: userId },
        { conversation_id: (newConv as any).id, user_id: targetUserId },
    ]);

    return (newConv as any).id;
};

/**
 * Fetches the count of unread messages for a user across all conversations.
 */
export const fetchUnreadMessagesCount = async (userId: string): Promise<number> => {
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

/**
 * Marks all messages in a conversation as read for the current user.
 */
export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
    if (!conversationId || !userId) return;
    const { error } = await (supabase
        .from("messages") as any)
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", userId)
        .eq("is_read", false);

    if (error) throw error;
};

/**
 * Fetches conversations for the current user.
 */
export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
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

    return (data || [])
        .map((item) => transformConversation(item, userId))
        .filter((c): c is Conversation => c !== null)
        .sort((a, b) => {
            if (!a.lastMessageAt) return 1;
            if (!b.lastMessageAt) return -1;
            return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        });
};

/**
 * Fetches messages for a specific conversation with pagination.
 * We fetch in descending order (newest first) to easily get the "last page",
 * then the UI can reverse them or we reverse them here.
 */
export const fetchMessages = async (
    conversationId: string,
    lastTimestamp: string | null = null,
    limit: number = 20
): Promise<Message[]> => {
    let query = supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false }) // Fetch newest first for pagination
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("created_at", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    // Reverse to return oldest-first for display, or let UI handle it. 
    // Usually standardized on returning newest-first (desc) from API if it's paged by time.
    return (data || []).map(transformMessage).filter((m): m is Message => m !== null);
};

export interface Reaction {
    id: string;
    message_id: string;
    user_id: string;
    emoji: string;
    created_at: string;
}

/**
 * Fetches all reactions for a specific conversation.
 * Optimized to only fetch relevant data.
 */
export const fetchReactionsByConversation = async (conversationId: string): Promise<Reaction[]> => {
    // We need to join with messages to filter by conversation_id if reactions table doesn't have it.
    // Assuming message_reactions has message_id.
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
        created_at: r.created_at
    }));
};

/**
 * Deprecated: Use fetchReactionsByConversation
 */
export const fetchAllReactions = async (): Promise<Reaction[]> => {
    console.warn("fetchAllReactions is deprecated for performance reasons.");
    return []; 
};

/**
 * Toggles a reaction on a message.
 */
export const toggleMessageReaction = async (messageId: string, userId: string, emoji: string): Promise<{ action: 'added' | 'removed' | 'updated'; emoji: string }> => {
    const { data: existing } = await (supabase
        .from("message_reactions") as any)
        .select("*")
        .eq("message_id", messageId)
        .eq("user_id", userId)
        .maybeSingle();

        if (existing) {
            if ((existing as any).emoji === emoji) {
                await (supabase.from("message_reactions") as any).delete().eq("id", (existing as any).id);
                return { action: "removed", emoji };
            } else {
                await (supabase
                    .from("message_reactions") as any)
                    .update({ emoji })
                    .eq("id", (existing as any).id);
                return { action: "updated", emoji };
            }
        } else {
            await (supabase
                .from("message_reactions") as any)
                .insert([{ message_id: messageId, user_id: userId, emoji }]);
            return { action: "added", emoji };
        }
    };

/**
 * Sends a new message.
 */
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    content: string,
    type: string = "text",
    media: string[] = [], 
    replyToId: string | null = null,
): Promise<Message | null> => {
    const { data, error } = await (supabase
        .from("messages") as any)
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
    await (supabase
        .from("conversations") as any)
        .update({
            last_message_at: new Date().toISOString(),
            last_message_content:
                type === "image" || (media && media.length > 0)
                    ? "Sent an image"
                    : content,
        })
        .eq("id", conversationId);

    return transformMessage(data?.[0]);
};

/**
 * Deletes a message by ID.
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
    const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);
    if (error) throw error;
};
