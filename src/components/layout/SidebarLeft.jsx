import React from "react";
import { Home, Compass, Film, Mail, Bell, User, Plus } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useMessages } from "@/hooks/useMessages";

const SidebarLeft = ({ onPostClick }) => {
  const { currentUser } = useAuth();
  const { unreadCount: notificationsCount } = useNotifications(currentUser);
  const { unreadCount: messagesCount } = useMessages(currentUser);

  const navItems = [
    { id: "home", icon: Home, path: "/" },
    { id: "explore", icon: Compass, path: "/explore" },
    { id: "reels", icon: Film, path: "/reels" },
    { id: "messages", icon: Mail, path: "/messages" },
    { id: "notifications", icon: Bell, path: "/notifications" },
    {
      id: "profile",
      icon: User,
      path: currentUser ? `/u/${currentUser.handle}` : "/explore",
    },
  ];

  return (
    <aside className="sticky top-0 hidden md:flex h-screen w-[68px] flex-col items-center py-5 border-r border-zinc-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-black transition-colors duration-200">
      <Link to="/" className="mb-8 hover:scale-110 transition-transform">
        <img
          src="https://archive.systemadminbd.com/wp-content/uploads/2024/06/cropped-20240613_193200-270x270.png"
          alt="Logo"
          className="size-8 rounded-lg"
        />
      </Link>

      <nav className="flex flex-col gap-y-4 w-full items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `p-2.5 rounded-xl transition-all duration-200 border border-transparent relative ${isActive ? "text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`
            }
          >
            <item.icon size={26} strokeWidth={2.5} />
            {item.id === "notifications" && notificationsCount > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-black"></span>
            )}
            {item.id === "messages" && messagesCount > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-black"></span>
            )}
          </NavLink>
        ))}

        {currentUser && (
          <button
            onClick={onPostClick}
            className="p-2.5 mt-2 rounded-xl text-white bg-zinc-950 dark:bg-white dark:text-zinc-950 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg cursor-pointer"
            title="Create Post"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>
        )}
      </nav>
    </aside>
  );
};

export default SidebarLeft;
