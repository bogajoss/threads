import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  updateProfile as updateProfileApi,
  fetchUserProfile,
  updateLastSeen,
} from "@/lib/api";
import type { User } from "@/types/index";

interface AuthContextType {
  currentUser: User | null;
  login: (credentials: any) => Promise<any>;
  signup: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (updatedFields: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfileData = useCallback(async (user: any) => {
    try {
      const data = await fetchUserProfile(user.id);

      if (data) {
        setCurrentUser(data);
      } else {
        const demoUser: User = {
          id: user.id,
          name: user.email?.split("@")[0] || "User",
          handle: user.email?.split("@")[0] || "user",
          avatar: "/default-avatar.webp",
          verified: false,
          role: "user",
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
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    updateLastSeen(currentUser.id);

    const interval = setInterval(() => updateLastSeen(currentUser.id), 30000);

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
  }, [fetchUserProfileData]);

  const login = useCallback(async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const signup = useCallback(
    async ({ email, password, username, name }: any) => {
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
      return user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  const handleUpdateProfile = useCallback(
    async (updatedFields: Partial<User>) => {
      if (!currentUser) return;
      await updateProfileApi(currentUser.id, updatedFields as any);
      await fetchUserProfileData(currentUser);

      queryClient.invalidateQueries({
        queryKey: ["profile", currentUser.handle],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", "user", currentUser.id],
      });
    },
    [currentUser, fetchUserProfileData, queryClient],
  );

  const value = useMemo(
    () => ({
      currentUser,
      login,
      signup,
      logout,
      updateProfile: handleUpdateProfile,
      loading,
    }),
    [currentUser, login, signup, logout, handleUpdateProfile, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
