import React, { useState } from "react";
import {
  Flag,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trash2,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ReportsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { reports, actions } = useAdmin();
  const [filterStatus, setFilterStatus] = useState("all");
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  if (reports.isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const allReports = (reports.data || []) as any[];
  const filteredReports =
    filterStatus === "all"
      ? allReports
      : allReports.filter((r: any) => r.status === filterStatus);

  const statusCounts = {
    pending: allReports.filter((r: any) => r.status === "pending").length,
    resolved: allReports.filter((r: any) => r.status === "resolved").length,
    dismissed: allReports.filter((r: any) => r.status === "dismissed").length,
  };

  const handleViewContent = (report: any) => {
    try {
      const { target_type, target_id, target_data } = report;

      switch (target_type?.toLowerCase()) {
        case "post":
          navigate(`/p/${target_id}`);
          break;
        case "comment":
          // Navigate to post with comment context
          if (target_data?.post_id) {
            navigate(`/p/${target_data.post_id}?highlight=${target_id}`);
          }
          break;
        case "user": {
          // Try to get user handle from target_data or use ID
          const userHandle = target_data?.handle || target_id;
          navigate(`/u/${userHandle}`);
          break;
        }
        case "community":
          navigate(`/c/${target_id}`);
          break;
        case "profile": {
          const profileHandle = target_data?.handle || target_id;
          navigate(`/u/${profileHandle}`);
          break;
        }
        default:
          console.warn("Unknown report type:", target_type);
      }
    } catch (error) {
      console.error("Error navigating to content:", error);
    }
  };

  const handleResolveReport = async (report: any) => {
    if (
      confirm(`Delete the reported ${report.target_type} and mark as resolved?`)
    ) {
      setDeletingReportId(report.id);
      try {
        await new Promise((resolve) => {
          const timeoutId = setTimeout(resolve, 500);
          actions.deleteTarget({
            type: report.target_type,
            id: report.target_id,
          });
          return () => clearTimeout(timeoutId);
        });

        actions.updateReportStatus({
          reportId: report.id,
          status: "resolved",
        });
      } finally {
        setDeletingReportId(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Moderation Queue
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Review and resolve community reported content
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white p-1 shadow-sm dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5">
           <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Reports</p>
              <p className="text-xl font-black text-rose-600">{allReports.length}</p>
           </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Action Required",
            count: statusCounts.pending,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
          },
          {
            label: "Resolved",
            count: statusCounts.resolved,
            icon: CheckCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
          {
            label: "Dismissed",
            count: statusCounts.dismissed,
            icon: AlertCircle,
            color: "text-zinc-600 dark:text-zinc-400",
            bg: "bg-zinc-500/10",
            border: "border-zinc-500/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-all duration-300 dark:bg-zinc-900/50",
              stat.border
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn("rounded-2xl p-3 shadow-inner transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-foreground">
                  {stat.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/50 pb-6 dark:border-white/5">
        <p className="text-sm font-bold text-zinc-500">
          Showing <span className="text-zinc-900 dark:text-white">{filteredReports.length}</span> individual reports
        </p>
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-11 w-[160px] rounded-xl border-zinc-200/50 bg-white font-bold shadow-sm dark:border-white/5 dark:bg-zinc-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl dark:bg-zinc-900">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-white py-24 dark:border-white/5 dark:bg-zinc-900/20">
          <div className="relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
             <div className="relative rounded-[2rem] bg-emerald-500/10 p-8 shadow-inner">
               <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
             </div>
          </div>
          <h3 className="mt-8 text-2xl font-black text-zinc-900 dark:text-white">All Clear</h3>
          <p className="mt-2 max-w-[280px] text-center font-medium text-zinc-500">
            Great job! No reports are currently waiting for your attention.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredReports.map((report: any) => (
            <div
              key={report.id}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white shadow-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 dark:border-white/5 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 shadow-inner">
                    <Flag className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Type</span>
                       <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                         {report.target_type || "unknown"}
                       </span>
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight mt-0.5">
                      Report by @{report.reporter?.username || "anonymous"}
                    </h3>
                  </div>
                </div>
                <div className="hidden sm:block">
                   <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider shadow-sm transition-colors",
                      report.status === "pending"
                        ? "bg-amber-500 text-white shadow-amber-500/20"
                        : report.status === "resolved"
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-zinc-500 text-white shadow-zinc-500/20",
                    )}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="px-6 pb-6 flex-1">
                <div className="rounded-3xl bg-zinc-50/50 p-5 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                   <p className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-2">Reason</p>
                   <p className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                     "{report.reason || "No additional context provided."}"
                   </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-zinc-400 px-2">
                   <span>ID: {report.target_id.slice(0, 12)}...</span>
                   <span>{formatTimeAgo(report.created_at)}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-auto border-t border-zinc-100 bg-zinc-50/30 p-4 px-6 dark:border-white/5 dark:bg-zinc-950/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() => handleViewContent(report)}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-black text-zinc-700 shadow-sm transition-all hover:bg-zinc-100 active:scale-95 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Inspect Content
                  </button>

                  {report.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => actions.updateReportStatus({ reportId: report.id, status: "dismissed" })}
                        className="flex-1 sm:flex-none h-11 items-center justify-center rounded-2xl px-5 text-sm font-black text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white active:scale-95"
                        disabled={deletingReportId === report.id}
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(report)}
                        disabled={deletingReportId === report.id}
                        className="flex-1 sm:flex-none flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50"
                      >
                        {deletingReportId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
