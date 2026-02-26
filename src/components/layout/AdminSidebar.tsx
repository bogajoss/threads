import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  ShieldAlert,
  ArrowLeft,
  Flag,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";

const menuItems = [
  { icon: Users, label: "User Control", path: "/syspanel/users" },
  { icon: Flag, label: "Reports Queue", path: "/syspanel/reports" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-zinc-200/50 bg-white/80 backdrop-blur-xl transition-all duration-300 dark:border-white/5 dark:bg-black/80 lg:translate-x-0 hidden lg:flex lg:flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto custom-scrollbar">
          {/* Brand */}
          <div className="flex items-center justify-between border-b border-zinc-200/50 p-6 dark:border-white/5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105 group-active:scale-95">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-black tracking-tighter text-zinc-900 dark:text-white">Admin Hub</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 opacity-70">System Control</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 mt-4">
            <p className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Overview
            </p>
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                      isActive
                        ? "bg-violet-600 text-white shadow-xl shadow-violet-600/20 active:scale-95"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500")} />
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-2">
             <Link
                to="/"
                className="flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 px-4 py-3 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-100 dark:border-white/5 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Link>
          </div>

          {/* User Section */}
          <div className="p-4 mt-auto">
            <div className="rounded-[2rem] border border-zinc-200/50 bg-gradient-to-b from-white to-zinc-50/50 p-5 dark:border-white/5 dark:from-zinc-900/50 dark:to-zinc-950/50 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-md">
                  <AvatarImage
                    src={currentUser?.avatar}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-2xl bg-violet-500/10 font-black text-violet-600">
                    {currentUser?.name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-black text-zinc-900 dark:text-white">
                    {currentUser?.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="truncate text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      System Admin
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/10 py-3 text-[13px] font-black text-rose-600 transition-all hover:bg-rose-500 hover:text-white dark:bg-rose-500/5 dark:hover:bg-rose-500 active:scale-95"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
