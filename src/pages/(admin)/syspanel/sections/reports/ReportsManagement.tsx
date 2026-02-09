import React from "react";
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  ExternalLink
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import Button from "@/components/ui/Button";
import { formatTimeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ReportsManagement: React.FC = () => {
  const { reports, actions } = useAdmin();

  if (reports.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const data = reports.data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-3xl font-black lg:text-4xl text-[--foreground]">Reports Queue</h1>
        <p className="text-sm text-[--muted-foreground] sm:text-base">Review and resolve content reports from users.</p>
      </div>

      <div className="grid gap-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[--border] p-12 text-center bg-[--card]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold">Clear Queue!</h3>
            <p className="text-sm text-[--muted-foreground] max-w-xs mx-auto mt-2">
              Great job! All reports have been processed. The platform is clean.
            </p>
          </div>
        ) : (
          data.map((report: any) => (
            <div key={report.id} className="group rounded-3xl border border-[--border] bg-[--card] p-5 sm:p-6 transition-all hover:border-violet-500/30 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <Flag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-rose-500">Reported {report.target_type}</span>
                      <span className="text-xs text-[--muted-foreground]">•</span>
                      <span className="text-xs text-[--muted-foreground]">{formatTimeAgo(report.created_at)}</span>
                    </div>
                    <h3 className="text-sm font-bold sm:text-base mt-0.5">Reported by @{report.reporter?.username || 'anonymous'}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg mr-2",
                    report.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                    report.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" :
                    "bg-zinc-500/10 text-zinc-500"
                  )}>
                    {report.status}
                  </span>
                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-4 rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                        onClick={() => actions.updateReportStatus({ reportId: report.id, status: 'dismissed' })}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="h-9 px-4 rounded-xl"
                        onClick={async () => {
                          if (confirm(`Do you want to DELETE the reported ${report.target_type} and resolve this report?`)) {
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

              <div className="mt-6 rounded-2xl bg-[--secondary]/50 p-4 border border-[--border]">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-tight text-[--muted-foreground]">Reason / Context</span>
                </div>
                <p className="text-sm text-[--foreground] leading-relaxed italic">
                  "{report.reason || 'No specific reason provided.'}"
                </p>
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[--muted-foreground]">Target ID</span>
                     <span className="text-[10px] font-mono opacity-50">{report.target_id}</span>
                   </div>
                   <button className="flex items-center gap-2 text-xs font-bold text-violet-500 hover:underline">
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