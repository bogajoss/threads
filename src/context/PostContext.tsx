/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import type { ReactNode } from "react";
import {
    fetchPosts,
    addPost as addPostApi,
    deletePost as deletePostApi,
    updatePost as updatePostApi,
} from "@/lib/api";
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
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
    const postsRef = useRef<Post[]>(posts);

    useEffect(() => {
        postsRef.current = posts;
    }, [posts]);

    const loadPosts = useCallback(async (isNextPage: boolean = false) => {
        if (isNextPage) setIsFetchingNextPage(true);
        else setLoading(true);

        try {
            const currentPosts = postsRef.current;
            const lastTimestamp =
                isNextPage && currentPosts.length > 0
                    ? currentPosts[currentPosts.length - 1].created_at
                    : null;

            const data = await fetchPosts(lastTimestamp, 10);

            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (isNextPage) {
                setPosts((prev) => [...prev, ...data]);
            } else {
                setPosts(data);
            }
        } catch (err) {
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
            setIsFetchingNextPage(false);
        }
    }, []);

    const fetchNextPage = () => {
        if (!hasMore || isFetchingNextPage) return;
        loadPosts(true);
    };

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const addPost = async (postData: any): Promise<Post | null> => {
        const newPost = await addPostApi(postData);
        // We don't necessarily need to call loadPosts() if realtime is working,
        // but it ensures immediate UI update if subscription is slow.
        loadPosts();
        return newPost;
    };

    const deletePost = async (postId: string): Promise<void> => {
        await deletePostApi(postId);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
    };

    const updatePost = async (postId: string, data: any): Promise<void> => {
        await updatePostApi(postId, data);
        setPosts((prev) =>
            prev.map((post) => (post.id === postId ? { ...post, ...data } : post)),
        );
    };

    const getPostById = (id: string): Post | undefined => posts.find((p) => p.id === id);

    const getUserPosts = (handle: string, filter: "feed" | "media" = "feed"): Post[] => {
        let userPosts = posts.filter((post) => {
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
                    (p.type === "video" || p.type === "image" || ((p.media?.length || 0) > 0)),
            );
        }

        return userPosts;
    };

    return (
        <PostContext.Provider
            value={{
                posts,
                setPosts,
                addPost,
                deletePost,
                updatePost,
                getPostById,
                getUserPosts,
                loading,
                hasMore,
                isFetchingNextPage,
                fetchNextPage,
                refreshPosts: () => loadPosts(false),
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = (): PostContextType => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePosts must be used within a PostProvider");
    }
    return context;
};
