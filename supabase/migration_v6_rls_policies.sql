-- Migration V6: Enable RLS and add Policies
-- Created: 2026-02-01

-- ==========================================
-- 1. ENABLE RLS ON ALL TABLES
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. USERS POLICIES
-- ==========================================

CREATE POLICY "Profiles are viewable by everyone" 
ON public.users FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = id ) 
WITH CHECK ( (select auth.uid()) = id );

-- ==========================================
-- 3. POSTS POLICIES
-- ==========================================

CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can create posts" 
ON public.posts FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can update their own posts" 
ON public.posts FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = user_id ) 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can delete their own posts" 
ON public.posts FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

-- ==========================================
-- 4. COMMENTS POLICIES
-- ==========================================

CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = user_id ) 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

-- ==========================================
-- 5. LIKES & REPOSTS
-- ==========================================

CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can like posts" 
ON public.likes FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can unlike posts" 
ON public.likes FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

CREATE POLICY "Comment likes are viewable by everyone" 
ON public.comment_likes FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can like comments" 
ON public.comment_likes FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can unlike comments" 
ON public.comment_likes FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

CREATE POLICY "Reposts are viewable by everyone" 
ON public.reposts FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can repost" 
ON public.reposts FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can remove their reposts" 
ON public.reposts FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

-- ==========================================
-- 6. FOLLOWS
-- ==========================================

CREATE POLICY "Follows are viewable by everyone" 
ON public.follows FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can follow others" 
ON public.follows FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = follower_id );

CREATE POLICY "Users can unfollow" 
ON public.follows FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = follower_id );

-- ==========================================
-- 7. NOTIFICATIONS
-- ==========================================

CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
TO authenticated 
USING ( (select auth.uid()) = recipient_id );

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = recipient_id ) 
WITH CHECK ( (select auth.uid()) = recipient_id );

-- ==========================================
-- 8. COMMUNITIES
-- ==========================================

CREATE POLICY "Communities are viewable by everyone" 
ON public.communities FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can create communities" 
ON public.communities FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = creator_id );

CREATE POLICY "Creators can update their communities" 
ON public.communities FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = creator_id ) 
WITH CHECK ( (select auth.uid()) = creator_id );

CREATE POLICY "Community memberships are viewable by everyone" 
ON public.community_members FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Users can join communities" 
ON public.community_members FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can leave communities" 
ON public.community_members FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

-- ==========================================
-- 9. MESSAGING
-- ==========================================

CREATE POLICY "Users can view conversations they are part of" 
ON public.conversations FOR SELECT 
TO authenticated 
USING ( 
  id IN (
    SELECT conversation_id FROM public.conversation_participants 
    WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can view participants of their conversations" 
ON public.conversation_participants FOR SELECT 
TO authenticated 
USING ( 
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants 
    WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can view messages in their conversations" 
ON public.messages FOR SELECT 
TO authenticated 
USING ( 
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants 
    WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can send messages to their conversations" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK ( 
  (select auth.uid()) = sender_id AND
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants 
    WHERE user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can react to messages in their conversations" 
ON public.message_reactions FOR INSERT 
TO authenticated 
WITH CHECK ( 
  (select auth.uid()) = user_id AND
  message_id IN (
    SELECT m.id FROM public.messages m
    JOIN public.conversation_participants cp ON m.conversation_id = cp.conversation_id
    WHERE cp.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can view message reactions in their conversations" 
ON public.message_reactions FOR SELECT 
TO authenticated 
USING ( 
  message_id IN (
    SELECT m.id FROM public.messages m
    JOIN public.conversation_participants cp ON m.conversation_id = cp.conversation_id
    WHERE cp.user_id = (select auth.uid())
  )
);

-- ==========================================
-- 10. STORIES
-- ==========================================

CREATE POLICY "Stories are viewable by everyone" 
ON public.stories FOR SELECT 
TO authenticated, anon 
USING ( expires_at > NOW() );

CREATE POLICY "Authenticated users can create stories" 
ON public.stories FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can delete their own stories" 
ON public.stories FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );

-- ==========================================
-- 11. HASHTAGS & MISC
-- ==========================================

CREATE POLICY "Hashtags are viewable by everyone" 
ON public.hashtags FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Post hashtags are viewable by everyone" 
ON public.post_hashtags FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Link previews are viewable by everyone" 
ON public.link_previews FOR SELECT 
TO authenticated, anon 
USING ( true );
