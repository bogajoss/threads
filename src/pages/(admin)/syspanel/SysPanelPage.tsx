import React from "react";
import { Users, Flag, MessageSquare, Globe, ArrowUpRight, Activity } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { formatTimeAgo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, icon: Icon, isLoading, color }: any) => (
  <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card p-8 transition-all hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/5">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
        {isLoading ? (
          <div className="mt-3 h-10 w-24 animate-pulse rounded-2xl bg-secondary" />
        ) : (
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-4xl font-black tracking-tighter sm:text-5xl">{value}</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> 12%
            </span>
          </div>
        )}
      </div>
      <div className={cn(
        "flex h-14 w-14 items-center justify-center rounded-[1.25rem] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl",
        color || "bg-violet-600 text-white shadow-violet-600/20"
      )}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
    <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary/50">
      <div className={cn("h-full rounded-full transition-all duration-1000", color?.split(' ')[0] || "bg-violet-600")} style={{ width: '65%' }} />
    </div>
  </div>
);

const SysPanelPage: React.FC = () => {
  const { stats, users, posts } = useAdmin();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-2 w-10 rounded-full bg-violet-600" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-violet-500">System Dashboard</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-foreground">
          Platform <span className="text-muted-foreground/40">Vitals.</span>
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Users" 
          value={stats.data?.totalUsers} 
          icon={Users} 
          isLoading={stats.isLoading}
          color="bg-violet-600 text-white shadow-violet-600/20"
        />
        <StatsCard 
          title="Daily Posts" 
          value={stats.data?.totalPosts} 
          icon={MessageSquare} 
          isLoading={stats.isLoading}
          color="bg-blue-600 text-white shadow-blue-600/20"
        />
        <StatsCard 
          title="Communities" 
          value={stats.data?.totalCommunities} 
          icon={Globe} 
          isLoading={stats.isLoading}
          color="bg-emerald-600 text-white shadow-emerald-600/20"
        />
        <StatsCard 
          title="Incidents" 
          value="0" 
          icon={Flag} 
          color="bg-rose-600 text-white shadow-rose-600/20"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Newest Residents */}
        <div className="rounded-[2.5rem] border border-border/50 bg-card p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-violet-500" />
              <h2 className="text-2xl font-black tracking-tight">Recent Onboarding</h2>
            </div>
            <button className="rounded-xl bg-secondary/50 px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              Audit All
            </button>
          </div>
          
          <div className="space-y-4">
            {users.isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 w-full animate-pulse rounded-3xl bg-secondary/50" />)
            ) : (
              (users.data || []).slice(0, 5).map((user: any) => {
                if (!user) return null;
                return (
                  <div key={user.id} className="group flex items-center justify-between rounded-3xl border border-transparent bg-secondary/20 p-4 transition-all hover:border-violet-500/20 hover:bg-secondary/40">
                    <div className="flex min-w-0 items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl ring-4 ring-background shadow-lg transition-transform group-hover:scale-105">
                        <AvatarImage src={user.avatar} className="rounded-2xl object-cover" />
                        <AvatarFallback className="rounded-2xl font-black bg-violet-500/10 text-violet-600">{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-foreground">{user.name}</p>
                        <p className="truncate text-xs font-bold text-muted-foreground">@{user.handle}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                      <span className="text-[10px] font-bold text-muted-foreground/50">2m ago</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Content Feed */}
        <div className="rounded-[2.5rem] border border-border/50 bg-card p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <h2 className="text-2xl font-black tracking-tight">Stream Monitor</h2>
            </div>
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          </div>

          <div className="space-y-4">
            {posts.isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 w-full animate-pulse rounded-3xl bg-secondary/50" />)
            ) : (
              (posts.data || []).slice(0, 5).map((post: any) => {
                if (!post) return null;
                return (
                  <div key={post.id} className="group flex items-start gap-4 rounded-3xl border border-transparent bg-secondary/20 p-5 transition-all hover:border-blue-500/20 hover:bg-secondary/40">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-foreground">@{post.user?.handle}</span>
                        <span className="text-[10px] font-bold text-muted-foreground opacity-50">• {formatTimeAgo(post.created_at)}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-card p-2 shadow-sm border border-border/50">
                      <MessageSquare className="h-3 w-3 text-violet-500" />
                      <span className="text-[10px] font-black">{post.stats?.comments || 0}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SysPanelPage;