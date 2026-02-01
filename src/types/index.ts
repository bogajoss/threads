export interface User {
    id: string;
    handle: string;
    name: string;
    email?: string;
    avatar: string;
    cover: string;
    verified: boolean;
    bio: string | null;
    location: string | null;
    website: string | null;
    follower_count: number;
    following_count: number;
    lastSeen: string;
}

export interface Media {
    url: string;
    type: 'image' | 'video' | 'file';
    aspect_ratio?: number;
    poster?: string | null;
    name?: string;
    size?: number;
}

export interface PostStats {
    comments: number;
    likes: number;
    reposts: number;
    mirrors?: number;
    shares?: number;
}

export interface CommunityShort {
    id: string;
    handle: string;
    name: string;
    avatar: string;
}

export interface Reposter {
    handle: string;
    name: string;
    id: string;
}

export interface Attachment {
    name: string;
    url: string;
    size?: number;
    type?: string;
}

export interface Post {
    id: string; // The database ID
    feed_id: string; // The unique ID for the feed (handling multiple occurences)
    user_id: string;
    content: string;
    media: Media[] | null;
    type: 'text' | 'image' | 'video';
    poll: any | null; // Define Poll interface if needed
    parent_id: string | null;
    community_id: string | null;
    quoted_post_id: string | null;
    created_at: string;
    stats: PostStats;
    user: User;
    community: CommunityShort | null;
    repostedBy: Reposter | null;
    timeAgo: string;
    comments?: Comment[];
    sort_timestamp?: string;
    sortTimestamp?: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    media: Media[] | null;
    created_at: string;
    parent_id?: string | null;
    stats: {
        likes: number;
        comments?: number;
    };
    user: User;
    timeAgo: string;
}

export interface Notification {
    id: string;
    type: string;
    created_at: string;
    read: boolean;
    is_read: boolean;
    user: string; // Username of actor
    avatar: string; // Avatar of actor
    // Add other specific fields if necessary
}

export interface Story {
    id: string;
    user_id: string;
    media: string; // transformed from media_url
    created_at: string;
    expires_at: string;
    user: User;
}

export interface Community {
    id: string;
    handle: string;
    name: string;
    description: string | null;
    avatar: string;
    cover: string;
    membersCount: number;
    postsCount: number;
    isPrivate: boolean;
    createdAt: string;
    type: "community";
    creatorId: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    type: "text" | "image" | "video";
    media: string[] | null;
    reply_to_id: string | null;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    id: string;
    user: User | null;
    lastMessage: string;
    lastMessageAt: string;
    time: string;
    unread: number;
}

export interface Reaction {
    id: string;
    message_id: string;
    user_id: string;
    emoji: string;
    created_at: string;
}
