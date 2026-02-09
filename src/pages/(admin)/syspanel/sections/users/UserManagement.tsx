import React, { useState } from "react";
import { 
  Search, 
  UserX, 
  Filter,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, actions } = useAdmin();

  const filteredUsers = (users.data || []).filter(user => 
    user && (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (users.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing user directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-violet-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Infrastructure</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl text-foreground">User <span className="text-muted-foreground/40">Directory.</span></h1>
          <p className="text-sm font-bold text-muted-foreground">Orchestrate accounts, permissions and network security.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" className="rounded-2xl border border-border/50 bg-card px-6">
            <Filter className="mr-2 h-4 w-4 text-violet-500" />
            Filters
          </Button>
          <Button size="md" className="rounded-2xl bg-violet-600 shadow-xl shadow-violet-600/20">
            <Zap className="mr-2 h-4 w-4" />
            Provision
          </Button>
        </div>
      </div>

      {/* Search HUD */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-violet-500" />
        </div>
        <Input 
          className="h-16 rounded-[1.5rem] border-border/50 bg-card pl-14 text-base font-bold shadow-sm transition-all focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/50" 
          placeholder="Lookup handle, display name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.map((user) => {
          if (!user) return null;
          return (
            <div key={user.id} className="group relative rounded-[2rem] border border-border/50 bg-card p-6 transition-all hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/5">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 rounded-2xl ring-4 ring-secondary/50 transition-transform group-hover:scale-105">
                      <AvatarImage src={user.avatar} className="rounded-2xl object-cover" />
                      <AvatarFallback className="rounded-2xl bg-violet-500/10 text-violet-600 font-black text-xl">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.verified && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                        <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-foreground">{user.name}</h3>
                    <p className="truncate text-xs font-bold text-muted-foreground">@{user.handle}</p>
                  </div>
                </div>
                <button className="rounded-xl p-2 text-muted-foreground hover:bg-secondary transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-secondary/30 p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Authorization</p>
                    <select 
                      value={user.role}
                      onChange={(e) => actions.updateRole({ userId: user.id, role: e.target.value as any })}
                      className="w-full bg-transparent text-xs font-black uppercase tracking-wider focus:outline-none text-violet-600 cursor-pointer"
                    >
                      <option value="user">USER</option>
                      <option value="moderator">MODERATOR</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                  <div 
                    onClick={() => actions.toggleVerification({ userId: user.id, verified: !user.verified })}
                    className="rounded-2xl bg-secondary/30 p-3 cursor-pointer transition-colors hover:bg-secondary/50"
                  >
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Integrity</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        user.verified ? "bg-blue-500" : "bg-muted-foreground/30"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {user.verified ? "Verified" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 rounded-xl bg-secondary/50 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                    User Logs
                  </button>
                  <button className="rounded-xl bg-rose-500/10 p-3 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserManagement;