import React from "react";
import {
  HomeIcon,
  SearchIcon,
  VideoIcon,
  MessageCircle,
  Bell,
  User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useConversations } from "@/hooks/useConversations";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";

const BottomNav: React.FC = () => {
    const { currentUser } = useAuth();
    const location = useLocation();

    // Hooks might not be available if not wrapped properly or auth is loading, handle gracefully
    const notifications = useNotifications(currentUser);
    const conversations = useConversations(currentUser);
    
    const unreadNotifications = notifications?.unreadCount || 0;
    const unreadMessages = conversations?.unreadCount || 0;

    const navItems = [
    { id: "home", icon: HomeIcon, path: "/feed" },
    { id: "explore", icon: SearchIcon, path: "/explore" },
    { id: "create", icon: VideoIcon, path: "/create", isSpecial: true },
    { id: "notifications", icon: Bell, path: "/notifications", count: unreadNotifications },
    { id: "messages", icon: MessageCircle, path: "/m", count: unreadMessages }, 
    { id: "profile", icon: User, path: currentUser ? `/u/${currentUser.handle}` : "/login", isProfile: true },
    ];

    return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[calc(60px+env(safe-area-inset-bottom))] w-full items-start justify-around border-t border-zinc-200 bg-white/95 backdrop-blur-md px-2 pt-3 pb-[env(safe-area-inset-bottom)] dark:border-zinc-800 dark:bg-black/95 transition-transform duration-300 md:hidden print:hidden touch-manipulation">
        {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && item.path !== '/login' && location.pathname.startsWith(item.path));
        
        if (item.isProfile) {
                return (
                <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                    cn(
                    "relative flex flex-col items-center justify-center transition-all active:scale-90",
                    isActive 
                        ? "ring-2 ring-black dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-black rounded-full" 
                        : ""
                    )
                }
                >
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-800">
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.handle} className="object-cover" />
                      <AvatarFallback>{currentUser?.handle?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </motion.div>
                </NavLink>
                )
        }

        return (
            <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
                cn(
                "relative flex flex-col items-center justify-center p-2 transition-colors active:scale-90", 
                isActive ? "text-black dark:text-white" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
                )
            }
            >
             <motion.div 
                className="relative"
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
             >
                <item.icon 
                    size={26} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? "fill-current" : ""} 
                />
                 <AnimatePresence>
                   {item.count ? (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black"
                      >
                      {item.count > 9 ? "9+" : item.count}
                      </motion.span>
                  ) : null}
                </AnimatePresence>
            </motion.div>
            </NavLink>
        );
        })}
    </nav>
    );
};

export default BottomNav;
