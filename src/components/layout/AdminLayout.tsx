import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Bell, ShieldAlert } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const AdminLayout: React.FC = () => {
  const { darkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-zinc-50 text-foreground font-english selection:bg-violet-500 selection:text-white transition-colors duration-200 dark:bg-[#050505]",
        darkMode && "dark",
      )}
    >
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200/50 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-black/80 lg:hidden md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tighter">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-foreground hover:bg-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <Bell className="h-5 w-5 text-zinc-500" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all active:scale-95 shadow-lg shadow-violet-500/20"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 gap-0">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 lg:ml-72 transition-all duration-300">
          <main className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
