import React, { useState } from "react";
import { 
  Shield, 
  Globe, 
  Lock, 
  Save,
  Loader2,
  Users
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const SettingItem = ({ title, description, children, icon: Icon }: any) => (
  <div className="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[--secondary] text-[--foreground]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-black sm:text-base">{title}</h3>
        <p className="text-xs text-[--muted-foreground] sm:text-sm">{description}</p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2 pl-14 sm:pl-0">
      {children}
    </div>
  </div>
);

const SystemSettings: React.FC = () => {
  const { settings, actions } = useAdmin();
  const [localSettings, setLocalSettings] = useState<any>(null);

  React.useEffect(() => {
    if (settings.data && !localSettings) {
      setLocalSettings(settings.data);
    }
  }, [settings.data, localSettings]);

  if (settings.isLoading || !localSettings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  const handleToggle = (key: string) => {
    setLocalSettings({ ...localSettings, [key]: !localSettings[key] });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black lg:text-4xl">System Settings</h1>
          <p className="text-sm text-[--muted-foreground] sm:text-base">Global configuration and platform controls.</p>
        </div>
        <Button 
          onClick={() => actions.updateSettings(localSettings)}
          className="rounded-2xl shadow-lg shadow-violet-500/20"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-8">
        <section className="rounded-3xl border border-[--border] bg-[--card] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-black uppercase tracking-tight">Access & Security</h2>
          </div>
          <div className="divide-y divide-[--border]">
            <SettingItem 
              icon={Lock}
              title="Maintenance Mode" 
              description="Temporarily disable platform access for all non-admin users."
            >
              <button 
                onClick={() => handleToggle('maintenance_mode')}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  localSettings.maintenance_mode ? "bg-violet-500" : "bg-[--secondary]"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  localSettings.maintenance_mode ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </SettingItem>

            <SettingItem 
              icon={Users}
              title="Allow New Signups" 
              description="Control whether new users can create accounts on the platform."
            >
              <button 
                onClick={() => handleToggle('allow_signups')}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  localSettings.allow_signups ? "bg-violet-500" : "bg-[--secondary]"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  localSettings.allow_signups ? "translate-x-5" : "translate-x-0"
                )} />
              </button>
            </SettingItem>
          </div>
        </section>

        <section className="rounded-3xl border border-[--border] bg-[--card] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-black uppercase tracking-tight">Platform Details</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[--muted-foreground]">Site Title</label>
              <Input 
                value={localSettings.site_title || "AntiGravity"}
                onChange={(e) => setLocalSettings({...localSettings, site_title: e.target.value})}
                className="rounded-xl border-[--border] bg-[--secondary]/30 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[--muted-foreground]">Support Email</label>
              <Input 
                value={localSettings.support_email || "admin@antigravity.sys"}
                onChange={(e) => setLocalSettings({...localSettings, support_email: e.target.value})}
                className="rounded-xl border-[--border] bg-[--secondary]/30 font-bold"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-rose-500">Danger Zone</h2>
              <p className="text-xs text-rose-500/60 font-medium">Critical system operations. Use with extreme caution.</p>
            </div>
            <Button variant="danger" className="rounded-2xl">
              Purge System Cache
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
export default SystemSettings;
