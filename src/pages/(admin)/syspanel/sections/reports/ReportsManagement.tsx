import React from "react";
import { 
  Flag, 
  CheckCircle, 
  ExternalLink
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { Button, Skeleton } from "@/components/ui";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ReportsManagement: React.FC = () => {
  const { reports, actions } = useAdmin();

  if (reports.isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const data = reports.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Reports Queue</h1>
        <p className="text-sm text-muted-foreground">Monitor and resolve community reported content.</p>
      </div>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 mb-4 dark:bg-emerald-500/10">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">Queue is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">Great job! All reports have been cleared.</p>
          </div>
        ) : (
          data.map((report: any) => (
            <div key={report.id} className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10">
                    <Flag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Reported {report.target_type}</span>
                      <span className="text-[10px] text-muted-foreground">• {formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 className="text-base font-bold mt-0.5">Report by @{report.reporter?.username || 'anonymous'}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg",
                    report.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500" :
                    report.status === 'resolved' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500" :
                    "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/10 dark:text-zinc-500"
                  )}>
                    {report.status}
                  </span>
                  
                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-9 px-4 rounded-xl font-bold"
                        onClick={() => actions.updateReportStatus({ reportId: report.id, status: 'dismissed' })}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        className="h-9 px-4 rounded-xl font-bold"
                        onClick={async () => {
                          if (confirm(`Delete the reported ${report.target_type} and resolve?`)) {
                            await actions.deleteTarget({ type: report.target_type, id: report.target_id });
                            actions.updateReportStatus({ reportId: report.id, status: 'resolved' });
                          } else {
                            actions.updateReportStatus({ reportId: report.id, status: 'resolved' });
                          }
                        }}
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Reporter's Context</p>
                <p className="text-sm font-medium leading-relaxed italic text-foreground">
                  "{report.reason || 'No additional context provided.'}"
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-muted-foreground uppercase">Target ID</span>
                     <span className="text-[10px] font-mono text-muted-foreground/60">{report.target_id}</span>
                   </div>
                   <button className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:underline">
                     <ExternalLink className="h-3 w-3" />
                     View Content
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsManagement;