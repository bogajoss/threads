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
        "min-h-screen flex flex-col bg-white text-foreground font-english selection:bg-violet-500 selection:text-white transition-colors duration-200 dark:bg-black",
        darkMode && "dark",
      )}
    >
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black lg:hidden md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-foreground hover:bg-zinc-200 transition-colors dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
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
          <main className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
