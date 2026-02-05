import React from "react";
// @ts-ignore
import {
  HomeIcon,
  ChatIcon,
  CommunityIcon,
  ReelsIcon,
  NotificationsIcon,
} from "@/components/ui";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useConversations } from "@/hooks/useConversations";

interface BottomNavProps {
  handleProfileClick: (handle: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ handleProfileClick }) => {
  const { currentUser } = useAuth();
  const { unreadCount: notificationsCount } = useNotifications(currentUser);
  const { unreadCount: messagesCount } = useConversations(currentUser);
  const location = useLocation();

  const navItems = [
    { id: "home", icon: HomeIcon, path: "/feed" },
    { id: "community", icon: CommunityIcon, path: "/community" },
    { id: "reels", icon: ReelsIcon, path: "/reels" },
    { id: "messages", icon: ChatIcon, path: "/m" },
    { id: "notifications", icon: NotificationsIcon, path: "/notifications" },
  ];

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-[40] flex h-16 items-center border-t border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          aria-label={item.id}
          className={({ isActive }) =>
            `relative flex h-full flex-1 flex-col items-center justify-center transition-all duration-200 ${isActive ? "text-black dark:text-white" : "text-zinc-400 opacity-70"}`
          }
        >
          {({ isActive }) => (
            <>
              {/* @ts-ignore */}
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              {item.id === "notifications" && notificationsCount > 0 && (
                <span className="absolute right-[30%] top-3 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black"></span>
              )}
              {item.id === "messages" && messagesCount > 0 && (
                <span className="absolute right-[30%] top-3 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black"></span>
              )}
            </>
          )}
        </NavLink>
      ))}
      <button
        onClick={() => {
          if (currentUser) handleProfileClick(currentUser.handle);
        }}
        aria-label="My Profile"
        className="flex h-full flex-1 flex-col items-center justify-center"
      >
        <Avatar
          className={`size-7 border-2 ${location.pathname.startsWith("/u/") ? "border-black dark:border-white" : "border-transparent opacity-70"}`}
        >
          <AvatarImage
            src={currentUser?.avatar || "/default-avatar.webp"}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback>
            {currentUser?.handle?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
    </nav>
  );
};

export default BottomNav;
