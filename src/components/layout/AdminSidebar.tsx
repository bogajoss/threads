import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  Settings, 
  ArrowLeft,
  PieChart,
  Flag,
  X,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/syspanel" },
  { icon: Users, label: "User Control", path: "/syspanel/users" },
  { icon: Flag, label: "Reports Queue", path: "/syspanel/reports" },
  { icon: MessageSquare, label: "Moderation", path: "/syspanel/content" },
  { icon: PieChart, label: "Analytics", path: "/syspanel/analytics" },
  { icon: ShieldAlert, label: "Security", path: "/syspanel/security" },
  { icon: Settings, label: "Preferences", path: "/syspanel/settings" },
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
      {/* Ultra-smooth Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-all duration-500 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-72 border-r border-border/50 bg-card/80 backdrop-blur-2xl transition-all duration-500 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col p-6">
          {/* Brand Identity */}
          <div className="mb-10 flex items-center justify-between px-2">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-xl shadow-violet-600/20 transition-transform group-hover:scale-105">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-foreground">SYSPANEL</h1>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500/80">AntiGravity v2</p>
                </div>
              </div>
            </Link>
            <button 
              onClick={onClose}
              className="rounded-xl p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Back Link */}
          <Link to="/" className="mb-8 group flex items-center gap-3 rounded-2xl border border-border/50 bg-secondary/30 px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>App Dashboard</span>
          </Link>
          
          <div className="mb-4 px-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              Navigation
            </h2>
          </div>

          {/* Navigation with modern pills */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
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
                    "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                    isActive
                      ? "bg-violet-600 text-white shadow-2xl shadow-violet-600/30"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      isActive ? "text-white" : "text-muted-foreground group-hover:text-violet-500"
                    )} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* Elevated User Section */}
          <div className="mt-auto pt-6">
            <div className="rounded-3xl border border-border/50 bg-secondary/20 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-violet-500/20">
                  <AvatarImage src={currentUser?.avatar} className="rounded-2xl" />
                  <AvatarFallback className="rounded-2xl bg-violet-500/10 text-violet-600 font-black">
                    {currentUser?.name?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-foreground">{currentUser?.name}</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-widest text-violet-500">Super Admin</p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-2.5 text-xs font-black text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
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