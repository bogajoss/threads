import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  ShieldAlert,
  ArrowLeft,
  Flag,
  X,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-black lg:translate-x-0 hidden lg:flex lg:flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white group-hover:bg-violet-700 transition-colors">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Admin Panel</p>
                <p className="text-xs font-semibold text-zinc-500">System v1</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Back to App */}
          <Link
            to="/"
            className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="px-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Navigation
            </p>
            <div className="space-y-1.5 mt-3">
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
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-lg ring-2 ring-violet-600/20">
                  <AvatarImage src={currentUser?.avatar} className="rounded-lg" />
                  <AvatarFallback className="rounded-lg bg-violet-500/10 font-bold text-violet-600">
                    {currentUser?.name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">
                    {currentUser?.name}
                  </p>
                  <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-violet-600">
                    Admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700"
              >
                <LogOut className="h-3.5 w-3.5" />
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