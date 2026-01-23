/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchPosts, addPost as addPostApi } from "@/services/api";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = async (postData) => {
    const newPost = await addPostApi(postData);
    // We don't necessarily need to call loadPosts() if realtime is working,
    // but it ensures immediate UI update if subscription is slow.
    loadPosts();
    return newPost;
  };

  const getPostById = (id) => posts.find((p) => p.id === id);

  const getUserPosts = (handle, filter = "feed") => {
    let userPosts = posts.filter((post) => {
      if (post.user?.handle === handle) return true;
      if (post.repostedBy && post.repostedBy.handle === handle) return true;
      return false;
    });

    if (filter === "media") {
      return userPosts.filter(
        (p) => p.type === "video" || p.type === "image" || p.media?.length > 0,
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
        getPostById,
        getUserPosts,
        loading,
        refreshPosts: loadPosts,
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
