import React, { createContext, useContext, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  fetchPosts,
  addPost as addPostApi,
  deletePost as deletePostApi,
  updatePost as updatePostApi,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Post } from "@/types/index";

interface PostContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  addPost: (postData: any) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<void>;
  updatePost: (postId: string, data: any) => Promise<void>;
  getPostById: (id: string) => Post | undefined;
  getUserPosts: (handle: string, filter?: "feed" | "media") => Post[];
  loading: boolean;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refreshPosts: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam, 20),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 20) return undefined;
      const lastPost = lastPage[lastPage.length - 1];
      // Use score-based cursor for algorithmic feed
      if (lastPost.score !== undefined && lastPost.feed_id) {
        return `${lastPost.feed_id}:${lastPost.score}`;
      }
      return (
        lastPost.sort_timestamp ||
        lastPost.created_at
      );
    },
  });

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const addPostMutation = useMutation({
    mutationFn: addPostApi,
    onMutate: async (newPostData) => {
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
      const previousPosts = queryClient.getQueryData<InfiniteData<Post[]>>([
        "posts",
        "feed",
      ]);

      if (previousPosts && currentUser) {
        const optimisticPost: Post = {
          id: `temp-${Date.now()}`,
          feed_id: `temp-${Date.now()}`,
          user_id: currentUser.id,
          content: newPostData.content,
          media: newPostData.media || null,
          type: newPostData.type || "text",
          poll: newPostData.poll || null,
          parent_id: newPostData.parentId || null,
          community_id: newPostData.communityId || null,
          quoted_post_id: newPostData.quotedPostId || null,
          created_at: new Date().toISOString(),
          stats: { comments: 0, likes: 0, reposts: 0, views: 0 },
          user: currentUser,
          community: null,
          repostedBy: null,
          timeAgo: "just now",
          sort_timestamp: new Date().toISOString(),
        };

        queryClient.setQueryData<InfiniteData<Post[]>>(
          ["posts", "feed"],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: [[optimisticPost, ...old.pages[0]], ...old.pages.slice(1)],
            };
          },
        );
      }

      return { previousPosts };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "feed"], context.previousPosts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePostApi,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
      const previousPosts = queryClient.getQueryData<InfiniteData<Post[]>>([
        "posts",
        "feed",
      ]);

      queryClient.setQueryData<InfiniteData<Post[]>>(
        ["posts", "feed"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => page.filter((p) => p.id !== postId)),
          };
        },
      );

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "feed"], context.previousPosts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: any }) =>
      updatePostApi(postId, data),
    onMutate: async ({ postId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
      const previousPosts = queryClient.getQueryData<InfiniteData<Post[]>>([
        "posts",
        "feed",
      ]);

      queryClient.setQueryData<InfiniteData<Post[]>>(
        ["posts", "feed"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((post) =>
                post.id === postId ? { ...post, ...data } : post,
              ),
            ),
          };
        },
      );

      return { previousPosts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "feed"], context.previousPosts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });

  const addPost = useCallback(
    async (postData: any): Promise<Post | null> => {
      return await addPostMutation.mutateAsync(postData);
    },
    [addPostMutation],
  );

  const deletePost = useCallback(
    async (postId: string): Promise<void> => {
      await deletePostMutation.mutateAsync(postId);
    },
    [deletePostMutation],
  );

  const updatePost = useCallback(
    async (postId: string, data: any): Promise<void> => {
      await updatePostMutation.mutateAsync({ postId, data });
    },
    [updatePostMutation],
  );

  const setPosts: React.Dispatch<React.SetStateAction<Post[]>> =
    useCallback(() => {
      console.warn(
        "setPosts is deprecated in favor of React Query cache updates",
      );
    }, []);

  const getPostById = useCallback(
    (id: string): Post | undefined => posts.find((p) => p.id === id),
    [posts],
  );

  const getUserPosts = useCallback(
    (handle: string, filter: "feed" | "media" = "feed"): Post[] => {
      const userPosts = posts.filter((post) => {
        if (post.user?.handle === handle) return true;
        if (post.repostedBy && post.repostedBy.handle === handle) return true;
        return false;
      });

      if (filter === "feed") {
        return userPosts.filter((p) => p.parent_id === null);
      }
      if (filter === "media") {
        return userPosts.filter(
          (p) =>
            p.parent_id === null &&
            (p.type === "video" ||
              p.type === "image" ||
              (p.media?.length || 0) > 0),
        );
      }

      return userPosts;
    },
    [posts],
  );

  const refreshPosts = useCallback(() => refetch(), [refetch]);

  const value = useMemo(
    () => ({
      posts,
      setPosts,
      addPost,
      deletePost,
      updatePost,
      getPostById,
      getUserPosts,
      loading: isLoading,
      hasMore: hasNextPage || false,
      isFetchingNextPage,
      fetchNextPage,
      refreshPosts,
    }),
    [
      posts,
      setPosts,
      addPost,
      deletePost,
      updatePost,
      getPostById,
      getUserPosts,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      refreshPosts,
    ],
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePosts = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
