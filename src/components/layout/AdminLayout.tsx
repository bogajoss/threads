import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const AdminLayout: React.FC = () => {
  const { darkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground font-english selection:bg-violet-500 selection:text-white transition-colors duration-300",
        darkMode && "dark"
      )}
    >
      {/* Dynamic Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/50 bg-card/60 px-6 py-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tighter">SYSPANEL</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl bg-secondary/50 p-2.5 text-foreground transition-all active:scale-95">
            <Bell className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-xl bg-violet-600 p-2.5 text-white shadow-lg shadow-violet-600/20 transition-all active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="lg:ml-72 transition-all duration-500">
        <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
          {/* Subtle background glow */}
          <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/5 blur-[120px]" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
