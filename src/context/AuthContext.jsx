/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchProfileByHandle, updateProfile } from '@/services/api';
import { transformUser } from '@/lib/transformers';
import { MOCK_PROFILES } from '@/lib/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState(null);
    const [profiles, setProfiles] = useState({});
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
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sysm',
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
        if (!currentUser?.id) return;

        const updateLastSeen = async () => {
            await supabase
                .from('users')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', currentUser.id);
        };

        // Update immediately on mount/login
        updateLastSeen();

        // Update every 30 seconds for higher accuracy
        const interval = setInterval(updateLastSeen, 30000);

        // Update when user returns to the tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                updateLastSeen();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', updateLastSeen);

        return () => {
            clearInterval(interval);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', updateLastSeen);
        };
    }, [currentUser?.id]);

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
