/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import db from '../data/db.json';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState(() =>
        db.posts.map(p => ({
            ...p,
            user: db.profiles[p.userHandle]
        }))
    );

    const addPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const getPostById = (id) => posts.find(p => p.id === id);

    const getUserPosts = (handle, filter = 'feed') => {
        let userPosts = posts.filter(post => {
            if (post.user.handle === handle) return true;
            if (post.repostedBy && post.repostedBy.handle === handle) return true;
            return false;
        });

        // Add mock posts from profile data if exists
        const profileData = db.profiles[handle];
        if (profileData && profileData.posts) {
            userPosts = [...userPosts, ...profileData.posts];
        }

        if (filter === 'media') {
            return userPosts.filter(p => p.category === 'video' || p.category === 'images' || p.media);
        }
        if (filter === 'replies') {
            return userPosts.filter(p => p.content && p.content.length < 50);
        }

        return userPosts;
    };

    return (
        <PostContext.Provider value={{
            posts,
            setPosts,
            addPost,
            getPostById,
            getUserPosts
        }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};
