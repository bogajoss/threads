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
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-xs font-bold text-muted-foreground">Loading directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and platform permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl font-bold">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="h-10 rounded-xl font-bold bg-violet-600">
            <Zap className="mr-2 h-4 w-4" />
            Provision
          </Button>
        </div>
      </div>

      {/* Simplified Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input 
          className="h-12 rounded-xl border-border bg-card pl-12 text-sm font-medium focus:ring-violet-500/10" 
          placeholder="Search by name or handle..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.map((user) => {
          if (!user) return null;
          return (
            <div key={user.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 rounded-xl ring-2 ring-zinc-50 dark:ring-zinc-900">
                      <AvatarImage src={user.avatar} className="rounded-xl object-cover" />
                      <AvatarFallback className="rounded-xl bg-violet-50 text-violet-600 font-bold">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.verified && (
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-0.5 ring-2 ring-card">
                        <ShieldCheck className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-foreground">{user.name}</h3>
                    <p className="truncate text-[11px] text-muted-foreground font-medium">@{user.handle}</p>
                  </div>
                </div>
                <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Role</p>
                    <select 
                      value={user.role}
                      onChange={(e) => actions.updateRole({ userId: user.id, role: e.target.value as any })}
                      className="w-full bg-transparent text-[10px] font-bold uppercase tracking-widest text-violet-600 focus:outline-none"
                    >
                      <option value="user">USER</option>
                      <option value="moderator">MODERATOR</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                  <div 
                    onClick={() => actions.toggleVerification({ userId: user.id, verified: !user.verified })}
                    className="rounded-xl bg-zinc-50 p-3 cursor-pointer dark:bg-zinc-900/50"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("h-1.5 w-1.5 rounded-full", user.verified ? "bg-blue-500" : "bg-zinc-300")} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {user.verified ? "Verified" : "Basic"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 rounded-xl bg-zinc-100 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all">
                    Activity
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all dark:bg-rose-500/10">
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