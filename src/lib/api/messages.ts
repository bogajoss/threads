import { supabase } from "@/lib/supabase";
import { transformConversation, transformMessage } from "@/lib/transformers";
import type { Conversation, Message } from "@/types/index";
import { deleteMultipleFiles } from "./storage";

/**
 * Finds an existing DM (non-group) conversation between two users or creates a new one.
 */
export const getOrCreateConversation = async (userId: string, targetUserId: string): Promise<string> => {
    // 1. Get all DM conversation IDs where I am a participant
    const { data: myParticipants } = await (supabase
        .from("conversation_participants") as any)
        .select("conversation_id, conversation:conversations!inner(is_group)")
        .eq("user_id", userId)
        .eq("conversation.is_group", false);

    const myDMConvIds = (myParticipants || []).map((p: any) => p.conversation_id);

    // 2. Check if target user is in any of those same DM conversations
    const { data: existing } = await (supabase
        .from("conversation_participants") as any)
        .select("conversation_id")
        .eq("user_id", targetUserId)
        .in("conversation_id", myDMConvIds)
        .maybeSingle();

    if (existing) return existing.conversation_id;

    // 3. Create new DM conversation if none exists
    const { data: newConv, error: convError } = await (supabase
        .from("conversations") as any)
        .insert({ is_group: false }) 
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
 * Creates a new Group Conversation.
 */
export const createGroupConversation = async (
    creatorId: string, 
    name: string, 
    participantIds: string[], 
    avatarUrl: string | null = null
): Promise<string> => {
    // 1. Create conversation record
    const { data: newConv, error: convError } = await (supabase
        .from("conversations") as any)
        .insert({ 
            is_group: true, 
            name, 
            avatar_url: avatarUrl,
            creator_id: creatorId 
        })
        .select()
        .single();

    if (convError) throw convError;

    const convId = (newConv as any).id;

    // 2. Add participants (including creator)
    const participants = Array.from(new Set([creatorId, ...participantIds])).map(uid => ({
        conversation_id: convId,
        user_id: uid
    }));

    const { error: partError } = await (supabase
        .from("conversation_participants") as any)
        .insert(participants);

    if (partError) throw partError;

    return convId;
};

/**
 * Adds new members to an existing conversation.
 */
export const addParticipantsToConversation = async (
    conversationId: string, 
    userIds: string[]
): Promise<void> => {
    const participants = userIds.map(uid => ({
        conversation_id: conversationId,
        user_id: uid
    }));

    const { error } = await (supabase
        .from("conversation_participants") as any)
        .insert(participants);

    if (error) throw error;
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
export const markMessagesAsRead = async (conversationId: string, _userId: string): Promise<void> => {
    if (!conversationId) return;
    
    const { error } = await (supabase.rpc as any)('mark_messages_read', {
        p_conversation_id: conversationId
    });

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
        .select(`
            *,
            sender:users!sender_id (
                id,
                username,
                display_name,
                avatar_url
            )
        `)
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
 * Deletes an entire conversation and all its messages.
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
    // 1. Fetch all messages to clean up media
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

    // 2. Delete conversation (cascades to participants and messages)
    const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

    if (error) throw error;
};

/**
 * Removes a user from a conversation (Leave Group).
 */
export const leaveConversation = async (conversationId: string, userId: string): Promise<void> => {
    const { error } = await (supabase
        .from("conversation_participants") as any)
        .delete()
        .eq("conversation_id", conversationId)
        .eq("user_id", userId);

    if (error) throw error;
};

/**
 * Deletes a message by ID and cleans up its media from storage.
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
    // 1. Fetch message to get media URLs
    const { data: message } = await (supabase
        .from("messages")
        .select("media")
        .eq("id", messageId)
        .single() as any);

    if (message?.media && Array.isArray(message.media)) {
        // 2. Delete files from storage
        await deleteMultipleFiles(message.media);
    } else if (message?.media && typeof message.media === 'string') {
        // Handle case where media might be a single string URL
        await deleteMultipleFiles([message.media]);
    }

    // 3. Delete from database
    const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);
    if (error) throw error;
};

/**
 * Fetches participants of a conversation.
 */
export const fetchConversationParticipants = async (conversationId: string): Promise<any[]> => {
    const { data, error } = await (supabase
        .from("conversation_participants")
        .select(`
            user:users (
                id,
                username,
                display_name,
                avatar_url
            )
        `)
        .eq("conversation_id", conversationId) as any)
    
    if (error) throw error;
    return (data || []).map((p: any) => p.user);
};

/**
 * Updates conversation details.
 */
export const updateConversation = async (conversationId: string, updates: any): Promise<any> => {
    const { data, error } = await (supabase
        .from("conversations") as any)
        .update(updates)
        .eq("id", conversationId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
