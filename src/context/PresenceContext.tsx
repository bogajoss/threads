import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { updateLastSeen } from "@/lib/api";

interface PresenceContextType {
  onlineUsers: Set<string>;
}

const PresenceContext = createContext<PresenceContextType | undefined>(
  undefined,
);

interface PresenceProviderProps {
  children: ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUser?.id) return;

    let mounted = true;
    const channel = supabase.channel("global_presence", {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        if (!mounted) return;
        const newState = channel.presenceState();
        const onlineIds = new Set<string>();
        Object.keys(newState).forEach((id) => onlineIds.add(id));
        setOnlineUsers(onlineIds);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && mounted) {
          await channel.track({
            userId: currentUser.id,
            online_at: new Date().toISOString(),
          });
          updateLastSeen(currentUser.id);
        }
      });

    return () => {
      mounted = false;
      if (currentUser?.id) {
        updateLastSeen(currentUser.id);
      }
      
      // Delay removal to allow socket to finish establishing if it was just created
      // This prevents the "WebSocket is closed before the connection is established" error
      setTimeout(() => {
        supabase.removeChannel(channel).catch(() => {
          // Silent catch
        });
      }, 500);
      
      setOnlineUsers(new Set());
    };
  }, [currentUser?.id]);

  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePresence = (): PresenceContextType => {
  const context = useContext(PresenceContext);
  if (!context)
    throw new Error("usePresence must be used within a PresenceProvider");
  return context;
};
