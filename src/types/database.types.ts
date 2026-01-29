export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    username: string
                    display_name: string
                    email: string
                    bio: string | null
                    avatar_url: string | null
                    cover_url: string | null
                    website: string | null
                    location: string | null
                    is_verified: boolean
                    following_count: number
                    follower_count: number
                    posts_count: number
                    last_seen_at: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    display_name: string
                    email: string
                    bio?: string | null
                    avatar_url?: string | null
                    cover_url?: string | null
                    website?: string | null
                    location?: string | null
                    is_verified?: boolean
                    following_count?: number
                    follower_count?: number
                    posts_count?: number
                    last_seen_at?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    display_name?: string
                    email?: string
                    bio?: string | null
                    avatar_url?: string | null
                    cover_url?: string | null
                    website?: string | null
                    location?: string | null
                    is_verified?: boolean
                    following_count?: number
                    follower_count?: number
                    posts_count?: number
                    last_seen_at?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            follows: {
                Row: {
                    follower_id: string
                    following_id: string
                    created_at: string
                }
                Insert: {
                    follower_id: string
                    following_id: string
                    created_at?: string
                }
                Update: {
                    follower_id?: string
                    following_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "follows_follower_id_fkey"
                        columns: ["follower_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "follows_following_id_fkey"
                        columns: ["following_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            communities: {
                Row: {
                    id: string
                    handle: string
                    name: string
                    description: string | null
                    avatar_url: string | null
                    cover_url: string | null
                    creator_id: string | null
                    members_count: number
                    posts_count: number
                    is_private: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    handle: string
                    name: string
                    description?: string | null
                    avatar_url?: string | null
                    cover_url?: string | null
                    creator_id?: string | null
                    members_count?: number
                    posts_count?: number
                    is_private?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    handle?: string
                    name?: string
                    description?: string | null
                    avatar_url?: string | null
                    cover_url?: string | null
                    creator_id?: string | null
                    members_count?: number
                    posts_count?: number
                    is_private?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "communities_creator_id_fkey"
                        columns: ["creator_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            community_members: {
                Row: {
                    community_id: string
                    user_id: string
                    role: string | null
                    created_at: string
                }
                Insert: {
                    community_id: string
                    user_id: string
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    community_id?: string
                    user_id?: string
                    role?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "community_members_community_id_fkey"
                        columns: ["community_id"]
                        referencedRelation: "communities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "community_members_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            posts: {
                Row: {
                    id: string
                    user_id: string
                    community_id: string | null
                    parent_id: string | null
                    content: string | null
                    type: 'text' | 'image' | 'video' | 'poll' | 'repost' | 'file'
                    media: Json | null
                    poll: Json | null
                    quoted_post_id: string | null
                    likes_count: number
                    comments_count: number
                    mirrors_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    community_id?: string | null
                    parent_id?: string | null
                    content?: string | null
                    type?: 'text' | 'image' | 'video' | 'poll' | 'repost' | 'file'
                    media?: Json | null
                    poll?: Json | null
                    quoted_post_id?: string | null
                    likes_count?: number
                    comments_count?: number
                    mirrors_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    community_id?: string | null
                    parent_id?: string | null
                    content?: string | null
                    type?: 'text' | 'image' | 'video' | 'poll' | 'repost' | 'file'
                    media?: Json | null
                    poll?: Json | null
                    quoted_post_id?: string | null
                    likes_count?: number
                    comments_count?: number
                    mirrors_count?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "posts_community_id_fkey"
                        columns: ["community_id"]
                        referencedRelation: "communities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "posts_parent_id_fkey"
                        columns: ["parent_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "posts_quoted_post_id_fkey"
                        columns: ["quoted_post_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    }
                ]
            }
            comments: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                    content: string
                    media: Json | null
                    likes_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                    content: string
                    media?: Json | null
                    likes_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                    content?: string
                    media?: Json | null
                    likes_count?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "comments_post_id_fkey"
                        columns: ["post_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            likes: {
                Row: {
                    post_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    post_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    post_id?: string
                    user_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "likes_post_id_fkey"
                        columns: ["post_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "likes_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reposts: {
                Row: {
                    post_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    post_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    post_id?: string
                    user_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reposts_post_id_fkey"
                        columns: ["post_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reposts_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            hashtags: {
                Row: {
                    id: string
                    name: string
                    usage_count: number
                    last_used_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    usage_count?: number
                    last_used_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    usage_count?: number
                    last_used_at?: string
                }
                Relationships: []
            }
            post_hashtags: {
                Row: {
                    post_id: string
                    hashtag_id: string
                }
                Insert: {
                    post_id: string
                    hashtag_id: string
                }
                Update: {
                    post_id?: string
                    hashtag_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "post_hashtags_post_id_fkey"
                        columns: ["post_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "post_hashtags_hashtag_id_fkey"
                        columns: ["hashtag_id"]
                        referencedRelation: "hashtags"
                        referencedColumns: ["id"]
                    }
                ]
            }
            link_previews: {
                Row: {
                    url: string
                    title: string | null
                    description: string | null
                    image: string | null
                    site_name: string | null
                    last_used_at: string
                    created_at: string
                }
                Insert: {
                    url: string
                    title?: string | null
                    description?: string | null
                    image?: string | null
                    site_name?: string | null
                    last_used_at?: string
                    created_at?: string
                }
                Update: {
                    url?: string
                    title?: string | null
                    description?: string | null
                    image?: string | null
                    site_name?: string | null
                    last_used_at?: string
                    created_at?: string
                }
                Relationships: []
            }
            conversations: {
                Row: {
                    id: string
                    created_at: string
                    last_message_at: string
                    last_message_content: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    last_message_at?: string
                    last_message_content?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    last_message_at?: string
                    last_message_content?: string | null
                }
                Relationships: []
            }
            conversation_participants: {
                Row: {
                    conversation_id: string
                    user_id: string
                }
                Insert: {
                    conversation_id: string
                    user_id: string
                }
                Update: {
                    conversation_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "conversation_participants_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversation_participants_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            messages: {
                Row: {
                    id: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    type: string | null
                    media: Json | null
                    reply_to_id: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    type?: string | null
                    media?: Json | null
                    reply_to_id?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    sender_id?: string
                    content?: string
                    type?: string | null
                    media?: Json | null
                    reply_to_id?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_reply_to_id_fkey"
                        columns: ["reply_to_id"]
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    }
                ]
            }
            message_reactions: {
                Row: {
                    id: string
                    message_id: string
                    user_id: string
                    emoji: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    message_id: string
                    user_id: string
                    emoji: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    message_id?: string
                    user_id?: string
                    emoji?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "message_reactions_message_id_fkey"
                        columns: ["message_id"]
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "message_reactions_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            stories: {
                Row: {
                    id: string
                    user_id: string
                    media_url: string
                    type: string | null
                    expires_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    media_url: string
                    type?: string | null
                    expires_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    media_url?: string
                    type?: string | null
                    expires_at?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "stories_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            notifications: {
                Row: {
                    id: string
                    recipient_id: string
                    actor_id: string
                    type: string
                    post_id: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    recipient_id: string
                    actor_id: string
                    type: string
                    post_id?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    recipient_id?: string
                    actor_id?: string
                    type?: string
                    post_id?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "notifications_recipient_id_fkey"
                        columns: ["recipient_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "notifications_actor_id_fkey"
                        columns: ["actor_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "notifications_post_id_fkey"
                        columns: ["post_id"]
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            unified_posts: {
                Row: {
                    id: string
                    user_id: string
                    content: string | null
                    media: Json | null
                    type: string | null
                    poll: Json | null
                    parent_id: string | null
                    community_id: string | null
                    quoted_post_id: string | null
                    created_at: string
                    reposter_id: string | null
                    sort_timestamp: string
                    comments_count: number | null
                    likes_count: number | null
                    mirrors_count: number | null
                    author_data: Json | null
                    reposter_data: Json | null
                    community_data: Json | null
                    feed_id: string
                }
            }
        }
        Functions: {
            [_: string]: never
        }
        Enums: {
            post_type: 'text' | 'image' | 'video' | 'poll' | 'repost' | 'file'
            notification_type: 'like' | 'mention' | 'follow' | 'repost' | 'comment'
        }
    }
}