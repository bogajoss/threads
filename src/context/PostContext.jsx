/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchPosts } from '../services/api';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load from Supabase
    useEffect(() => {
        loadPosts();

        // Optional: Realtime subscription
        const channel = supabase
            .channel('public:posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
                loadPosts();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const loadPosts = async () => {
        try {
            const data = await fetchPosts();
            setPosts(data);
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const addPost = async (content, media = [], type = 'text', userId) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: userId,
                    content,
                    media,
                    type,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) throw error;

        // The list will update automatically if realtime is on, 
        // but we can manually reload or append for speed.
        loadPosts();
        return data[0];
    };

    const getPostById = (id) => posts.find(p => p.id === id);

    const getUserPosts = (handle, filter = 'feed') => {
        let userPosts = posts.filter(post => {
            if (post.user.handle === handle) return true;
            if (post.repostedBy && post.repostedBy.handle === handle) return true;
            return false;
        });

        if (filter === 'media') {
            return userPosts.filter(p => p.category === 'video' || p.category === 'images' || p.media?.length > 0);
        }
        if (filter === 'replies') {
            // In a real app, we'd check if post has a parent_id
            return userPosts.filter(p => p.parent_id !== null);
        }

        return userPosts;
    };

    return (
        <PostContext.Provider value={{
            posts,
            setPosts,
            addPost,
            getPostById,
            getUserPosts,
            loading,
            refreshPosts: loadPosts
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
