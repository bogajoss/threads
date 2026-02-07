import React from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const Status: React.FC = () => {
  const systems = [
    { name: "API Service", status: "operational" },
    { name: "Realtime Messaging", status: "operational" },
    { name: "Storage Service", status: "operational" },
    { name: "Authentication", status: "degraded", message: "Intermittent login delays" },
    { name: "Website", status: "operational" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="text-emerald-500" size={20} />;
      case "degraded":
        return <Clock className="text-amber-500" size={20} />;
      default:
        return <AlertCircle className="text-rose-500" size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">System Status</h1>
        <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 size={16} />
          All Systems Operational
        </div>
      </div>

      <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        {systems.map((system) => (
          <div key={system.name} className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <h3 className="font-bold text-black dark:text-white">{system.name}</h3>
              {system.message && <p className="text-sm text-zinc-500">{system.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm capitalize text-zinc-500">{system.status}</span>
              {getStatusIcon(system.status)}
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-4 pt-8">
        <h2 className="text-2xl font-bold">Incident History</h2>
        <div className="space-y-6">
          <div className="relative border-l-2 border-zinc-100 pl-6 dark:border-zinc-800">
            <div className="absolute -left-[9px] top-0 size-4 rounded-full border-2 border-white bg-zinc-200 dark:border-black dark:bg-zinc-800" />
            <p className="text-sm font-medium text-zinc-500">February 7, 2026</p>
            <h3 className="mt-1 font-bold text-black dark:text-white">Intermittent Login Delays</h3>
            <p className="mt-2 text-sm text-zinc-500">We are investigating reports of slow login times. Our team is working on a fix.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Status;
