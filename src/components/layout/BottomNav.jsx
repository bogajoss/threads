import React from "react";
import { Home, Users, Film, Mail, Bell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useMessages } from "@/hooks/useMessages";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const BottomNav = ({ handleProfileClick }) => {
  const { currentUser } = useAuth();
  const { unreadCount: notificationsCount } = useNotifications(currentUser);
  const { unreadCount: messagesCount } = useMessages(currentUser);
  const location = useLocation();

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "community", icon: Users, path: "/community" },
    { id: "reels", icon: Film, path: "/reels" },
    { id: "messages", icon: Mail, path: "/messages" },
    { id: "notifications", icon: Bell, path: "/notifications" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[40] flex h-16 items-center border-t border-zinc-100 bg-white/90 pb-safe backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center h-full transition-all duration-200 relative ${isActive ? "text-black dark:text-white" : "text-zinc-400 opacity-70"}`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              {item.id === "notifications" && notificationsCount > 0 && (
                <span className="absolute top-3 right-[30%] size-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-black"></span>
              )}
              {item.id === "messages" && messagesCount > 0 && (
                <span className="absolute top-3 right-[30%] size-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-black"></span>
              )}
            </>
          )}
        </NavLink>
      ))}
      <button
        onClick={() => {
          if (currentUser) handleProfileClick(currentUser.handle);
        }}
        className="flex-1 flex flex-col items-center justify-center h-full"
      >
        <Avatar
          className={`size-7 border-2 ${location.pathname.startsWith("/u/") ? "border-black dark:border-white" : "border-transparent opacity-70"}`}
        >
          <AvatarImage
            src={
              currentUser?.avatar ||
              "/default-avatar.webp"
            }
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
