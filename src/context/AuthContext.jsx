/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchProfileByHandle, updateProfile } from '@/services/api';
import { transformUser } from '@/lib/transformers';
import db from '@/data/db.json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState(null);
    const [profiles, setProfiles] = useState(db.profiles);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (user) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                const formattedUser = transformUser(data);
                setCurrentUser(formattedUser);
                setProfiles(prev => ({ ...prev, [formattedUser.handle]: formattedUser }));
            } else {
                // Fallback for new users or demo
                const demoUser = {
                    id: user.id,
                    email: user.email,
                    name: user.email.split('@')[0],
                    handle: user.email.split('@')[0],
                    avatar: 'https://static.hey.xyz/images/brands/lens.svg',
                    verified: false
                };
                setCurrentUser(demoUser);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session.user);
            } else {
                setLoading(false);
            }
        });

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

    const login = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

    const handleUpdateProfile = async (updatedFields) => {
        if (!currentUser) return;
        await updateProfile(currentUser.id, updatedFields);
        await fetchUserProfile(currentUser);
    };

    const getProfileByHandle = async (handle) => {
        if (profiles[handle]) return profiles[handle];
        const profile = await fetchProfileByHandle(handle);
        if (profile) {
            setProfiles(prev => ({ ...prev, [handle]: profile }));
            return profile;
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
            updateProfile: handleUpdateProfile,
            getProfileByHandle,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
