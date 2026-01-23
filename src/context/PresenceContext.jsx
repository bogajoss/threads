/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { updateLastSeen } from "@/services/api";

const PresenceContext = createContext();

export const PresenceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

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
        const onlineIds = new Set();
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

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context)
    throw new Error("usePresence must be used within a PresenceProvider");
  return context;
};
