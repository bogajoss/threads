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
        "min-h-screen bg-zinc-50 text-foreground font-english selection:bg-violet-500 selection:text-white transition-colors duration-300 dark:bg-zinc-950",
        darkMode && "dark"
      )}
    >
      {/* Simple Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 dark:bg-black lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight">SYSPANEL</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-900">
            <Bell className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="lg:ml-72 transition-all duration-500">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
