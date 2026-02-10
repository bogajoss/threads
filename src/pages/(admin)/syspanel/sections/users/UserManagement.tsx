import React, { useState } from "react";
import {
  Search,
  Loader2,
  Users,
  ShieldCheck,
  ShieldX,
  Lock,
  Unlock,
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
} from "@/components/ui";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface FilterState {
  role: string;
  status: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    role: "all",
    status: "all",
  });
  const { users, actions } = useAdmin();

  const filteredUsers = (users.data || []).filter((user) => {
    if (!user) return false;

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filters.role === "all" || user.role === filters.role;

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "verified" && user.verified) ||
      (filters.status === "unverified" && !user.verified) ||
      (filters.status === "banned" && user.isBanned);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (users.isLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-sm font-semibold text-zinc-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">User Directory</h1>
            <p className="text-sm text-zinc-500">
              Manage platform users and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search by name or handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl border-zinc-200 bg-white pl-10 text-sm font-medium dark:border-zinc-800 dark:bg-black"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
            <SelectTrigger className="w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl dark:bg-zinc-900">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl dark:bg-zinc-900">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          {(filters.role !== "all" || filters.status !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ role: "all", status: "all" })}
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white py-12 text-center dark:bg-black">
            <Users className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            <p className="mt-4 font-semibold text-zinc-600 dark:text-zinc-400">
              No users found
            </p>
            <p className="text-sm text-zinc-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-black">
            {filteredUsers.map((user) => {
              if (!user) return null;

              return (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-zinc-200 dark:ring-zinc-800">
                        <AvatarImage src={user.avatar} className="rounded-2xl" />
                        <AvatarFallback className="rounded-2xl bg-violet-500/10 text-sm font-bold text-violet-600">
                          {user.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.verified && (
                        <ShieldCheck className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-blue-500 p-0.5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-foreground">
                        {user.name}
                      </h3>
                      <p className="truncate text-sm text-zinc-500">
                        @{user.handle}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {/* Role Badge */}
                    <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
                      <Lock className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        {user.role}
                      </span>
                    </div>

                    {/* Verification Status */}
                    {user.verified && (
                      <div className="flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3 py-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                          Verified
                        </span>
                      </div>
                    )}

                    {/* Ban Status */}
                    {user.isBanned && (
                      <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3 py-1.5">
                        <ShieldX className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                          Banned
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:justify-end">
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        actions.updateRole({
                          userId: user.id,
                          role: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="w-[130px] rounded-lg border-zinc-200 text-xs font-semibold dark:border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl dark:bg-zinc-900">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        actions.toggleVerification({
                          userId: user.id,
                          verified: !user.verified,
                        })
                      }
                      title={
                        user.verified ? "Remove verification" : "Verify user"
                      }
                      className="h-9 rounded-lg px-3"
                    >
                      {user.verified ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const action = user.isBanned ? "unban" : "ban";
                        if (
                          confirm(
                            `Are you sure you want to ${action} @${user.handle}?`
                          )
                        ) {
                          actions.toggleBan({
                            userId: user.id,
                            banned: !user.isBanned,
                          });
                        }
                      }}
                      title={user.isBanned ? "Unban user" : "Ban user"}
                      className={cn(
                        "h-9 rounded-lg px-3",
                        user.isBanned
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-400"
                      )}
                    >
                      {user.isBanned ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <ShieldX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing <span className="font-semibold text-foreground">{filteredUsers.length}</span> of{" "}
          <span className="font-semibold text-foreground">{users.data?.length || 0}</span> users
        </p>
      </div>
    </div>
  );
};

export default UserManagement;