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
import { Button, Skeleton } from "@/components/ui";
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

  const allReports = reports.data || [];
  const filteredReports =
    filterStatus === "all"
      ? allReports
      : allReports.filter((r) => r.status === filterStatus);

  const statusCounts = {
    pending: allReports.filter((r) => r.status === "pending").length,
    resolved: allReports.filter((r) => r.status === "resolved").length,
    dismissed: allReports.filter((r) => r.status === "dismissed").length,
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
        case "user":
          // Try to get user handle from target_data or use ID
          const userHandle = target_data?.handle || target_id;
          navigate(`/u/${userHandle}`);
          break;
        case "community":
          navigate(`/c/${target_id}`);
          break;
        case "profile":
          const profileHandle = target_data?.handle || target_id;
          navigate(`/u/${profileHandle}`);
          break;
        default:
          console.warn("Unknown report type:", target_type);
      }
    } catch (error) {
      console.error("Error navigating to content:", error);
    }
  };

  const handleResolveReport = async (report: any) => {
    if (
      confirm(
        `Delete the reported ${report.target_type} and mark as resolved?`
      )
    ) {
      setDeletingReportId(report.id);
      try {
        await new Promise((resolve) => {
          const timeoutId = setTimeout(resolve, 500);
          actions.deleteTarget(
            { type: report.target_type, id: report.target_id }
          );
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white">
            <Flag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Reports Queue</h1>
            <p className="text-sm text-zinc-500">
              Monitor and resolve community reported content
            </p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Pending",
            count: statusCounts.pending,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Resolved",
            count: statusCounts.resolved,
            icon: CheckCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Dismissed",
            count: statusCounts.dismissed,
            icon: AlertCircle,
            color: "text-zinc-600 dark:text-zinc-400",
            bg: "bg-zinc-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("rounded-xl p-2", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-foreground">
                    {stat.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Showing {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""}
        </p>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] rounded-xl border-zinc-200 dark:border-zinc-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl dark:bg-zinc-900">
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-black">
          <div className="rounded-2xl bg-emerald-500/10 p-4">
            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="mt-4 font-bold text-foreground">Queue is empty</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Great job! All reports have been cleared.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report: any) => (
            <div
              key={report.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
            >
              {/* Report Header */}
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4 min-w-0 flex-1">
                  {/* Icon */}
                  <div className="relative h-12 w-12 shrink-0">
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-rose-500/10">
                      <Flag className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                        {report.target_type || "unknown"}
                      </span>
                      <span className="text-xs text-zinc-500">
                        • {formatTimeAgo(report.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2 truncate font-semibold text-foreground">
                      Report by @{report.reporter?.username || "anonymous"}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {report.reason || "No additional context provided."}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap",
                      report.status === "pending"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : report.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400"
                    )}
                  >
                    {report.status === "pending" && (
                      <Clock className="h-3 w-3" />
                    )}
                    {report.status === "resolved" && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    {report.status === "dismissed" && (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Target Info */}
              <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Target ID
                    </p>
                    <p className="mt-1 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                      {report.target_id}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContent(report)}
                    className="w-full gap-2 rounded-lg sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Content
                  </Button>
                </div>
              </div>

              {/* Actions */}
              {report.status === "pending" && (
                <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        actions.updateReportStatus({
                          reportId: report.id,
                          status: "dismissed",
                        })
                      }
                      className="rounded-lg"
                      disabled={deletingReportId === report.id}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolveReport(report)}
                      disabled={deletingReportId === report.id}
                      className="rounded-lg bg-rose-600 hover:bg-rose-700"
                    >
                      {deletingReportId === report.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resolving...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Resolve
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;