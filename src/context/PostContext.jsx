/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  fetchPosts,
  addPost as addPostApi,
  deletePost as deletePostApi,
  updatePost as updatePostApi,
} from "@/lib/api";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const postsRef = useRef(posts);

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const loadPosts = useCallback(async (isNextPage = false) => {
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

  const addPost = async (postData) => {
    const newPost = await addPostApi(postData);
    // We don't necessarily need to call loadPosts() if realtime is working,
    // but it ensures immediate UI update if subscription is slow.
    loadPosts();
    return newPost;
  };

  const deletePost = async (postId) => {
    await deletePostApi(postId);
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const updatePost = async (postId, data) => {
    await updatePostApi(postId, data);
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...data } : post)),
    );
  };

  const getPostById = (id) => posts.find((p) => p.id === id);

  const getUserPosts = (handle, filter = "feed") => {
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
          (p.type === "video" || p.type === "image" || p.media?.length > 0),
      );
    }
    if (filter === "replies") {
      return userPosts.filter((p) => p.parent_id !== null);
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

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
