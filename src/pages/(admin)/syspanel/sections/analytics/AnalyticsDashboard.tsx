import React from "react";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  MousePointer2,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const AnalyticsCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="rounded-3xl border border-[--border] bg-[--card] p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[--secondary] text-[--foreground]">
        <Icon className="h-6 w-6" />
      </div>
      <div className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black uppercase",
        isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      )}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {change}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[--muted-foreground]">{title}</p>
      <h3 className="mt-1 text-3xl font-black">{value}</h3>
    </div>
  </div>
);

import { cn } from "@/lib/utils";

const AnalyticsDashboard: React.FC = () => {
  const { analytics, stats } = useAdmin();

  if (analytics.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black lg:text-4xl text-[--foreground]">Platform Analytics</h1>
          <p className="text-sm text-[--muted-foreground] sm:text-base">Deep dive into platform growth and engagement.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[--border] bg-[--card] p-1.5 shadow-sm">
          <button className="rounded-xl bg-violet-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-violet-500/20">7 Days</button>
          <button className="rounded-xl px-4 py-2 text-xs font-bold text-[--muted-foreground] hover:bg-[--secondary]">30 Days</button>
          <button className="rounded-xl px-4 py-2 text-xs font-bold text-[--muted-foreground] hover:bg-[--secondary]">All Time</button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard 
          title="User Growth" 
          value={stats.data?.totalUsers || 0} 
          change="+12.5%" 
          isPositive={true}
          icon={Users} 
        />
        <AnalyticsCard 
          title="Daily Posts" 
          value={stats.data?.totalPosts || 0} 
          change="+5.2%" 
          isPositive={true}
          icon={MessageSquare} 
        />
        <AnalyticsCard 
          title="Active Sessions" 
          value="482" 
          change="-2.1%" 
          isPositive={false}
          icon={MousePointer2} 
        />
        <AnalyticsCard 
          title="Conversion" 
          value="64%" 
          change="+8.4%" 
          isPositive={true}
          icon={TrendingUp} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-[--border] bg-[--card] p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-black">Engagement Over Time</h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-violet-500" />
                 <span className="text-xs font-bold text-[--muted-foreground]">Posts</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-emerald-500" />
                 <span className="text-xs font-bold text-[--muted-foreground]">Users</span>
               </div>
            </div>
          </div>
          
          <div className="flex h-64 items-end justify-between gap-2 px-2">
            {[40, 60, 45, 90, 65, 80, 50, 70, 85, 45, 60, 75].map((val, i) => (
              <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t-xl bg-violet-500/10 transition-all hover:bg-violet-500" 
                  style={{ height: `${val}%` }}
                />
                <div 
                  className="w-full rounded-t-xl bg-emerald-500/10 transition-all hover:bg-emerald-500" 
                  style={{ height: `${val * 0.6}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between px-2 text-[10px] font-black uppercase tracking-widest text-[--muted-foreground]/50">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[--border] bg-[--card] p-8">
          <h2 className="mb-6 text-xl font-black">Top Channels</h2>
          <div className="space-y-6">
            {[
              { name: "Global Feed", color: "bg-violet-500", percent: 85 },
              { name: "Communities", color: "bg-emerald-500", percent: 65 },
              { name: "Reels", color: "bg-rose-500", percent: 45 },
              { name: "Marketplace", color: "bg-amber-500", percent: 30 },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{item.name}</span>
                  <span className="text-[--muted-foreground]">{item.percent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[--secondary]">
                  <div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
