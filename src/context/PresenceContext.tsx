/* eslint-disable react-refresh/only-export-components */
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

    const channel = supabase.channel("global_presence", {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        const onlineIds = new Set<string>();
        Object.keys(newState).forEach((id) => onlineIds.add(id));
        setOnlineUsers(onlineIds);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: currentUser.id,
            online_at: new Date().toISOString(),
          });
          // Update DB that user is online now
          updateLastSeen(currentUser.id);
        }
      });

    return () => {
      // Update DB one last time before unmounting (logout/tab switch)
      if (currentUser?.id) {
        updateLastSeen(currentUser.id);
      }
      supabase.removeChannel(channel);
      setOnlineUsers(new Set());
    };
  }, [currentUser?.id]);

  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = (): PresenceContextType => {
  const context = useContext(PresenceContext);
  if (!context)
    throw new Error("usePresence must be used within a PresenceProvider");
  return context;
};
