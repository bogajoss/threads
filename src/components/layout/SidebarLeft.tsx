import React from "react";
import { User } from "lucide-react";
import {
  HomeIcon,
  ChatIcon,
  CommunityIcon,
  ReelsIcon,
  NotificationsIcon,
} from "@/components/ui";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useConversations } from "@/hooks/useConversations";
import CreateActionMenu from "./CreateActionMenu";

const SidebarLeft: React.FC<Record<string, never>> = () => {
  const { currentUser } = useAuth();
  const { unreadCount: notificationsCount } = useNotifications(currentUser);
  const { unreadCount: messagesCount } = useConversations(currentUser);

  const navItems = [
    { id: "home", icon: HomeIcon, path: "/feed" },
    { id: "community", icon: CommunityIcon, path: "/community" },
    { id: "reels", icon: ReelsIcon, path: "/r" },
    { id: "messages", icon: ChatIcon, path: "/m" },
    { id: "notifications", icon: NotificationsIcon, path: "/notifications" },
    {
      id: "profile",
      icon: User,
      path: currentUser ? `/u/${currentUser.handle}` : "/login",
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-[68px] shrink-0 self-start flex-col items-center border-r border-zinc-100 bg-white py-5 transition-colors duration-200 dark:border-zinc-800 dark:bg-black md:flex">
      <Link to="/" className="mb-8 transition-transform hover:scale-110">
        <img src="/logo.webp" alt="Logo" className="size-8 rounded-lg" />
      </Link>

      <nav className="flex w-full flex-col items-center gap-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            aria-label={item.id}
            className={({ isActive }) =>
              `relative rounded-xl border border-transparent p-2.5 transition-all duration-200 ${isActive ? "border-zinc-200 bg-zinc-100 text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`
            }
          >
            <item.icon size={26} strokeWidth={2.5} />
            {item.id === "notifications" && notificationsCount > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black"></span>
            )}
            {item.id === "messages" && messagesCount > 0 && (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black"></span>
            )}
          </NavLink>
        ))}

        {currentUser && (
          <div className="mt-2">
            <CreateActionMenu
              triggerClassName="rounded-xl bg-zinc-950 p-2.5 text-white dark:bg-white dark:text-zinc-950"
            />
          </div>
        )}
      </nav>
    </aside>
  );
};

export default SidebarLeft;
