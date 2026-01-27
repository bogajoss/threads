/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchProfileByHandle, updateProfile, fetchUserProfile, updateLastSeen } from "@/lib/api";
import { MOCK_PROFILES } from "@/lib/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserProfileData = async (user) => {
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
        const demoUser = {
          id: user.id,
          email: user.email,
          name: user.email.split("@")[0],
          handle: user.email.split("@")[0],
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sysm",
          verified: false,
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
    window.addEventListener("beforeunload", () => updateLastSeen(currentUser.id));

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", () => updateLastSeen(currentUser.id));
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

  const handleUpdateProfile = async (updatedFields) => {
    if (!currentUser) return;
    await updateProfile(currentUser.id, updatedFields);
    await fetchUserProfileData(currentUser);
  };

  const getProfileByHandle = async (handle) => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
