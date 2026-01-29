/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
    fetchProfileByHandle,
    updateProfile,
    fetchUserProfile,
    updateLastSeen,
} from "@/lib/api";
import type { User } from "@/types/index";

// Define the shape of the auth context
interface AuthContextType {
    currentUser: User | null;
    authMode: 'login' | 'signup' | null;
    setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup' | null>>;
    profiles: Record<string, User>;
    login: (credentials: any) => Promise<any>;
    signup: (credentials: any) => Promise<any>;
    logout: () => Promise<void>;
    updateProfile: (updatedFields: Partial<User>) => Promise<void>;
    getProfileByHandle: (handle: string) => Promise<User | null>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
    const [profiles, setProfiles] = useState<Record<string, User>>({});
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserProfileData = async (user: any) => {
        try {
            const data = await fetchUserProfile(user.id);

            if (data) {
                setCurrentUser(data);
                setProfiles((prev) => ({
                    ...prev,
                    [data.handle.toLowerCase()]: data,
                }));
            } else {
                // Fallback for new users or demo
                // We need to match the User interface roughly or handle it gracefully
                // For strictness, let's type simulate a basic User object
                const demoUser: User = {
                    id: user.id,
                    // email: user.email, // User interface doesn't have email currently, check types/index.ts
                    name: user.email?.split("@")[0] || "User",
                    handle: user.email?.split("@")[0] || "user",
                    avatar: "/default-avatar.webp",
                    verified: false,
                    cover: "/welcome-banner.webp",
                    bio: null,
                    location: null,
                    website: null,
                    follower_count: 0,
                    following_count: 0,
                    lastSeen: new Date().toISOString(),
                };
                setCurrentUser(demoUser);
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser?.id) return;

        // Update immediately on mount/login
        updateLastSeen(currentUser.id);

        // Update every 30 seconds for higher accuracy
        const interval = setInterval(() => updateLastSeen(currentUser.id), 30000);

        // Update when user returns to the tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                updateLastSeen(currentUser.id);
            }
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", () =>
            updateLastSeen(currentUser.id),
        );

        return () => {
            clearInterval(interval);
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", () =>
                updateLastSeen(currentUser.id),
            );
        };
    }, [currentUser?.id]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfileData(session.user);
            } else {
                setLoading(false);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserProfileData(session.user);
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async ({ email, password }: any) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        setAuthMode(null);
        return data;
    };

    const signup = async ({ email, password, username, name }: any) => {
        const {
            data: { user },
            error: signUpError,
        } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username.toLowerCase(),
                    name: name,
                },
            },
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

    const handleUpdateProfile = async (updatedFields: Partial<User>) => {
        if (!currentUser) return;
        await updateProfile(currentUser.id, updatedFields as any);
        await fetchUserProfileData(currentUser);
    };

    const getProfileByHandle = async (handle: string): Promise<User | null> => {
        const lowerHandle = handle.toLowerCase();
        if (profiles[lowerHandle]) return profiles[lowerHandle];
        const profile = await fetchProfileByHandle(handle);
        if (profile) {
            setProfiles((prev) => ({ ...prev, [lowerHandle]: profile }));
            return profile;
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                authMode,
                setAuthMode,
                profiles,
                login,
                signup,
                logout,
                updateProfile: handleUpdateProfile,
                getProfileByHandle,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
