import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  verifyOtp: (email: string, token: string, type: "signup" | "recovery") => Promise<any>;
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

  const fetchUserProfileData = useCallback(async (user: any, isInitial: boolean = false) => {
    if (isInitial) setLoading(true);
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
      if (isInitial) setLoading(false);
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

  // Track if we've already performed the initial load
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfileData(session.user, true);
        hasLoadedRef.current = true;
      } else {
        setLoading(false);
        hasLoadedRef.current = true;
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Only show loading if we haven't finished the initial session check
        // or if explicitly signing in without a current session.
        const shouldShowLoading = !hasLoadedRef.current || (event === 'SIGNED_IN' && !currentUser);
        fetchUserProfileData(session.user, shouldShowLoading);
        if (shouldShowLoading) hasLoadedRef.current = true;
      } else {
        setCurrentUser(null);
        setLoading(false);
        hasLoadedRef.current = true;
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfileData, currentUser]);

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

  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const verifyOtp = useCallback(
    async (email: string, token: string, type: "signup" | "recovery") => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });
      if (error) throw error;
      return data;
    },
    [],
  );

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
      forgotPassword,
      resetPassword,
      verifyOtp,
      updateProfile: handleUpdateProfile,
      loading,
    }),
    [
      currentUser,
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
      verifyOtp,
      handleUpdateProfile,
      loading,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
