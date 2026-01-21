/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import db from '../data/db.json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState(null); // 'login', 'signup'
    const [profiles, setProfiles] = useState(db.profiles);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session.user);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserProfile(session.user);
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (user) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                // Fallback for demo
                const demoUser = {
                    id: user.id,
                    email: user.email,
                    name: user.email.split('@')[0],
                    handle: user.email.split('@')[0],
                    avatar: 'https://static.hey.xyz/images/brands/lens.svg',
                    verified: false
                };
                setCurrentUser(demoUser);
            } else {
                const formattedUser = {
                    ...data,
                    name: data.display_name,
                    handle: data.username,
                    avatar: data.avatar_url || 'https://static.hey.xyz/images/brands/lens.svg',
                    verified: data.is_verified
                };
                setCurrentUser(formattedUser);
                // Also add to profiles list
                setProfiles(prev => ({ ...prev, [formattedUser.handle]: formattedUser }));
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        setAuthMode(null);
        return data;
    };

    const signup = async ({ email, password, username, name }) => {
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username.toLowerCase(),
                    name: name
                }
            }
        });

        if (signUpError) throw signUpError;

        setAuthMode(null);
        return user;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setAuthMode(null);
    };

    const updateProfile = async (updatedFields) => {
        if (!currentUser) return;

        const { error } = await supabase
            .from('users')
            .update({
                display_name: updatedFields.name,
                username: updatedFields.handle,
                avatar_url: updatedFields.avatar,
                bio: updatedFields.bio,
                cover_url: updatedFields.cover
            })
            .eq('id', currentUser.id);

        if (error) throw error;

        const updated = { ...currentUser, ...updatedFields };
        setCurrentUser(updated);
        setProfiles(prev => ({ ...prev, [updated.handle]: updated }));
    };

    const getProfileByHandle = async (handle) => {
        // First check mock profiles
        if (profiles[handle]) return profiles[handle];

        // Then check Supabase
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', handle)
            .single();

        if (data && !error) {
            const formatted = {
                ...data,
                name: data.display_name,
                handle: data.username,
                avatar: data.avatar_url,
                verified: data.is_verified
            };
            setProfiles(prev => ({ ...prev, [handle]: formatted }));
            return formatted;
        }

        return null;
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            authMode,
            setAuthMode,
            profiles,
            login,
            signup,
            logout,
            updateProfile,
            getProfileByHandle,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
