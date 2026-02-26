import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  ShieldX,
  Unlock,
  Pencil,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Switch,
  VerifiedIcon,
  ProIcon,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui";
import { useAdmin } from "@/hooks/useAdmin";
import { cn, formatTimeAgo } from "@/lib/utils";
import { motion } from "motion/react";

interface FilterState {
  role: string;
  status: string;
  sortBy: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    role: "all",
    status: "all",
    sortBy: "newest",
  });
  const { users, actions } = useAdmin();
  const [managingUser, setManagingUser] = useState<any | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    let result = (users.data || []).filter((user: any) => {
      if (!user) return false;

      const matchesSearch =
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.handle?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesRole = filters.role === "all" || user.role === filters.role;

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "verified" && user.verified) ||
        (filters.status === "pro" && user.isPro) ||
        (filters.status === "banned" && user.isBanned);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sorting
    result.sort((a: any, b: any) => {
      if (filters.sortBy === "newest") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      if (filters.sortBy === "oldest") return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      if (filters.sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

    return result;
  }, [users.data, searchTerm, filters]);

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u: any) => u.id));
    }
  };

  if (users.isLoading) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <Users className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-violet-500" />
        </div>
        <p className="animate-pulse text-sm font-black uppercase tracking-widest text-zinc-500">
          Syncing User Data...
        </p>
      </div>
    );
  }

  const stats = {
    total: users.data?.length || 0,
    verified: users.data?.filter((u: any) => u.verified).length || 0,
    pro: users.data?.filter((u: any) => u.isPro).length || 0,
    banned: users.data?.filter((u: any) => u.isBanned).length || 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", count: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Verified", count: stats.verified, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Pro Members", count: stats.pro, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Banned", count: stats.banned, icon: ShieldX, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10" },
        ].map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <div className={cn("rounded-2xl p-3", item.bg)}>
                <item.icon className={cn("h-6 w-6", item.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{item.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="rounded-[2.5rem] border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-zinc-900/50 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-violet-500" />
            <Input
              placeholder="Search by name, handle, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-2xl border-zinc-200/50 bg-zinc-50/50 pl-12 text-[15px] font-medium transition-all focus:ring-4 focus:ring-violet-500/10 dark:border-white/5 dark:bg-zinc-950"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-950 border border-zinc-200/50 dark:border-white/5">
              {[
                { id: "all", label: "All" },
                { id: "user", label: "Users" },
                { id: "moderator", label: "Mods" },
                { id: "admin", label: "Admins" },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setFilters({ ...filters, role: role.id })}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all",
                    filters.role === role.id 
                      ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-800 dark:text-white" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
              <SelectTrigger className="h-11 w-[140px] rounded-2xl border-zinc-200/50 bg-zinc-50/50 font-bold dark:border-white/5 dark:bg-zinc-950">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl dark:bg-zinc-900">
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="pro">Pro Only</SelectItem>
                <SelectItem value="banned">Banned Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(v) => setFilters({ ...filters, sortBy: v })}>
              <SelectTrigger className="h-11 w-[140px] rounded-2xl border-zinc-200/50 bg-zinc-50/50 font-bold dark:border-white/5 dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl dark:bg-zinc-900">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedUsers.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="flex items-center justify-between rounded-2xl bg-violet-600 px-6 py-3 text-white shadow-lg shadow-violet-600/20 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <p className="text-sm font-black uppercase tracking-widest">
                {selectedUsers.length} Selected
              </p>
              <div className="h-4 w-px bg-white/20" />
              <button onClick={selectAllVisible} className="text-xs font-bold hover:underline">
                {selectedUsers.length === filteredUsers.length ? "Deselect All" : "Select All Visible"}
              </button>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="secondary" size="sm" className="h-9 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 border-none">
                 Bulk Verify
               </Button>
               <Button variant="danger" size="sm" className="h-9 rounded-xl font-bold">
                 Bulk Ban
               </Button>
               <button onClick={() => setSelectedUsers([])} className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors">
                 <MoreHorizontal className="h-5 w-5 rotate-90" />
               </button>
            </div>
          </motion.div>
        )}

        {/* User Card Grid */}
        <div className="pt-4">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
                <Users className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p className="mt-6 text-xl font-black text-zinc-900 dark:text-white">No Users Found</p>
              <p className="mt-2 text-zinc-500">Try broadening your search or resetting filters</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-2xl h-11 px-8 font-black border-zinc-200/50"
                onClick={() => {setSearchTerm(""); setFilters({ role: "all", status: "all", sortBy: "newest" });}}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredUsers.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => toggleSelectUser(user.id)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-[2.5rem] border p-5 transition-all duration-300 cursor-pointer",
                    selectedUsers.includes(user.id)
                      ? "border-violet-600 bg-violet-50/30 ring-1 ring-violet-600/50 dark:bg-violet-500/5"
                      : "border-zinc-200/50 bg-zinc-50/30 hover:border-violet-500/30 hover:bg-white dark:border-white/5 dark:bg-zinc-950/30 dark:hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-md">
                          <AvatarImage src={user.avatar} className="object-cover" />
                          <AvatarFallback className="rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 font-black text-violet-600 dark:from-zinc-800 dark:to-zinc-900">
                            {user.name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.verified && (
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm dark:bg-zinc-900">
                            <VerifiedIcon size={18} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-zinc-900 dark:text-white leading-tight">
                          {user.name}
                        </h3>
                        <p className="truncate text-xs font-bold text-zinc-400">@{user.handle}</p>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "flex h-6 items-center gap-1.5 rounded-full px-2.5 py-1",
                      user.role === 'admin' ? "bg-violet-500/10 text-violet-600" : "bg-zinc-100 dark:bg-white/5 text-zinc-500"
                    )}>
                       <span className="text-[9px] font-black uppercase tracking-widest">
                         {user.role}
                       </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {user.isPro && (
                      <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1">
                        <ProIcon size={12} />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-amber-700 dark:text-amber-400">PRO</span>
                      </div>
                    )}
                    {user.isBanned && (
                      <div className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-1">
                        <ShieldX className="h-3 w-3 text-rose-600" />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-rose-600">BANNED</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 dark:bg-white/5">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-500">
                        {user.created_at ? formatTimeAgo(user.created_at) : "Joined long ago"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setManagingUser(user); }}
                        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 active:scale-95"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Manage
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-zinc-200/50 dark:border-white/5">
                          <DropdownMenuItem onClick={() => actions.toggleVerification({ userId: user.id, verified: !user.verified })} className="font-bold gap-2">
                            <VerifiedIcon size={18} />
                            {user.verified ? "Remove Badge" : "Verify User"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            if (confirm(`Ban @${user.handle}?`)) actions.toggleBan({ userId: user.id, banned: !user.isBanned });
                          }} className={cn("font-bold gap-2", user.isBanned ? "text-emerald-600" : "text-rose-600")}>
                            {user.isBanned ? <Unlock size={18} /> : <ShieldX size={18} />}
                            {user.isBanned ? "Unban User" : "Ban User"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="font-bold gap-2">
                            <Users size={18} />
                            Profile Activity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between rounded-[2.5rem] border border-zinc-200/50 bg-white px-8 py-5 dark:border-white/5 dark:bg-zinc-900/50 shadow-sm">
        <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">
          Showing <span className="text-zinc-900 dark:text-white font-black">{filteredUsers.length}</span> of {users.data?.length || 0} Platform Members
        </p>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 font-black border-zinc-200/50 uppercase tracking-tighter">Export Data</Button>
        </div>
      </div>

      {managingUser && (
        <ManageUserDialog
          user={managingUser}
          onClose={() => setManagingUser(null)}
          actions={actions}
        />
      )}
    </div>
  );
};

// --- Sub-component: Manage User Dialog ---
const ManageUserDialog = ({ user, onClose, actions }: { user: any, onClose: () => void, actions: any }) => {
  const [userRole, setUserRole] = useState(user.roles || 'Newbie');
  const [isPro, setIsPro] = useState(user.isPro || false);
  const [proValidity, setProValidity] = useState<number>(30);
  const [isProDirty, setIsProDirty] = useState(false);
  const [isUserRoleDirty, setIsUserRoleDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    let proDays: number | null = null;
    if (isProDirty) {
      proDays = isPro ? proValidity : 0;
    }

    try {
      if (isUserRoleDirty || isProDirty) {
        await actions.adminUpdateUserAsync({
          userId: user.id,
          role: isUserRoleDirty ? userRole : null,
          proValidityDays: proDays,
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-2">
             <Avatar className="h-12 w-12 rounded-2xl">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="font-black text-violet-600">{user.name[0]}</AvatarFallback>
             </Avatar>
             <div>
                <DialogTitle className="text-xl font-black tracking-tight">Manage User</DialogTitle>
                <p className="text-sm font-bold text-zinc-500">@{user.handle}</p>
             </div>
          </div>
          <DialogDescription className="text-zinc-500 font-medium leading-relaxed">
            Configure system permissions and membership status for this account.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 pt-0 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Community Rank</Label>
              <Select value={userRole} onValueChange={(v) => { setUserRole(v); setIsUserRoleDirty(true); }}>
                <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50 font-bold dark:bg-zinc-900 dark:border-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Newbie">Newbie (Level 1)</SelectItem>
                  <SelectItem value="Hunter">Hunter (Level 2)</SelectItem>
                  <SelectItem value="Elite">Elite (Level 3)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:bg-zinc-900 dark:border-white/5">
              <div className="space-y-0.5">
                <Label className="text-sm font-black text-zinc-900 dark:text-white">Pro Membership</Label>
                <p className="text-[10px] font-bold text-zinc-500">Enable premium features</p>
              </div>
              <Switch checked={isPro} onCheckedChange={(v) => { setIsPro(v); setIsProDirty(true); }} />
            </div>

            {isPro && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Access Duration</Label>
                <Select value={String(proValidity)} onValueChange={(v) => { setProValidity(Number(v)); setIsProDirty(true); }}>
                  <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50 font-bold dark:bg-zinc-900 dark:border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="365">365 Days (1 Year)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </div>

        <DialogFooter className="bg-zinc-50 dark:bg-zinc-950 p-6 flex gap-3 sm:justify-end">
          <Button variant="ghost" onClick={onClose} className="rounded-2xl font-black uppercase text-xs">Discard</Button>
          <Button onClick={handleSave} loading={saving} className="rounded-2xl font-black uppercase text-xs px-8 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">
            Commit Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
