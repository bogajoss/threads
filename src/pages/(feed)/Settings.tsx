import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Moon,
  Sun,
  Lock,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Bell,
  Smartphone,
  Info,
  Zap,
  Trash,
  Download,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
} from "@/components/ui";
import { useSettings } from "@/hooks";
import { cn } from "@/lib/utils";

const SettingRow = ({
  icon: Icon,
  label,
  children,
  onClick,
  showChevron = true,
  className,
}: {
  icon: any;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "flex min-h-[56px] w-full items-center gap-3 px-4 py-3 transition-colors active:bg-accent/50",
      onClick && "cursor-pointer",
      className,
    )}
  >
    <div className="flex size-7 items-center justify-center text-foreground/70">
      <Icon size={20} strokeWidth={2} />
    </div>
    <span className="flex-1 text-[16px] font-medium tracking-tight text-foreground">
      {label}
    </span>
    <div className="flex items-center gap-2">
      {children}
      {showChevron && !children && (
        <ChevronRight size={18} className="text-muted-foreground/50" />
      )}
    </div>
  </div>
);

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    darkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    dataSaver,
    setDataSaver,
    isChangingPassword,
    setIsChangingPassword,
    passwordData,
    setPasswordData,
    loading,
    handleLogout,
    handlePasswordChange,
    handlePasswordReset,
    handleClearCache,
    handleDownloadData,
    handleDeleteAccount,
    handleReportBug,
  } = useSettings();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <p className="text-muted-foreground">Please login to view settings.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:rounded-2xl md:border md:border-border">
      {/* iOS Translucent Header using theme variables */}
      <div className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-full transition-all active:scale-90 active:bg-accent"
        >
          <ChevronLeft size={24} strokeWidth={2.5} className="text-foreground" />
        </button>
        <h2 className="text-[20px] font-black tracking-tight text-foreground">Settings</h2>
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-8 p-4 pb-32">
        {/* Account Security */}
        <section className="space-y-2">
          <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Account Security
          </h3>
          <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
            <SettingRow
              icon={Lock}
              label="Change Password"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            />
            
            {isChangingPassword && (
              <div className="animate-in fade-in slide-in-from-top-2 border-t border-border bg-muted/20 p-4">
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <Input
                    type="password"
                    placeholder="New Password"
                    className="h-12 rounded-xl border-border bg-background font-medium shadow-sm"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="h-12 rounded-xl border-border bg-background font-medium shadow-sm"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-full font-bold text-foreground"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      loading={loading}
                      className="rounded-full bg-primary px-6 font-bold text-primary-foreground"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="mx-4 border-t border-border" />
            
            <SettingRow
              icon={ShieldCheck}
              label="Reset via Email"
              onClick={handlePasswordReset}
            />
          </div>
        </section>

        {/* Display & Typography */}
        <section className="space-y-2">
          <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Display & Typography
          </h3>
          <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
            <SettingRow
              icon={darkMode ? Moon : Sun}
              label="Dark Mode"
              showChevron={false}
            >
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </SettingRow>

            <div className="mx-4 border-t border-border" />

            <SettingRow
              icon={Smartphone}
              label="Font Size"
              showChevron={false}
            >
              <Select value={fontSize} onValueChange={(val) => setFontSize(val as any)}>
                <SelectTrigger className="h-8 w-28 border-none bg-accent text-[13px] font-bold text-foreground">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border bg-popover/80 backdrop-blur-xl">
                  <SelectItem value="small" className="font-bold text-popover-foreground">Small</SelectItem>
                  <SelectItem value="base" className="font-bold text-popover-foreground">Default</SelectItem>
                  <SelectItem value="large" className="font-bold text-popover-foreground">Large</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </section>

        {/* Data & Storage */}
        <section className="space-y-2">
          <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Data & Storage
          </h3>
          <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
            <SettingRow
              icon={Zap}
              label="Data Saver"
              showChevron={false}
            >
              <Switch checked={dataSaver} onCheckedChange={(val) => setDataSaver(val)} />
            </SettingRow>

            <div className="mx-4 border-t border-border" />

            <SettingRow
              icon={Trash}
              label="Clear Local Cache"
              onClick={handleClearCache}
            />

            <div className="mx-4 border-t border-border" />

            <SettingRow
              icon={Download}
              label="Export My Data"
              onClick={handleDownloadData}
            />
          </div>
        </section>

        {/* Support */}
        <section className="space-y-2">
          <h3 className="px-4 text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Support
          </h3>
          <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
            <SettingRow
              icon={Bell}
              label="Report a Bug"
              onClick={handleReportBug}
            />

            <div className="mx-4 border-t border-border" />

            <SettingRow
              icon={Info}
              label="Version"
              showChevron={false}
            >
              <span className="text-[14px] font-bold text-muted-foreground">1.0.0 (Beta)</span>
            </SettingRow>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-card font-bold text-foreground shadow-sm border border-border transition-all active:scale-[0.98] active:bg-accent"
            >
              <LogOut size={20} className="text-muted-foreground" />
              Log Out
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/10 bg-destructive/5 font-bold text-destructive transition-all active:scale-[0.98] active:bg-destructive/10"
            >
              <Trash size={20} />
              Delete Account Permanently
            </button>
          </div>
          
          <div className="pt-4 text-center">
            <p className="text-[12px] font-bold text-muted-foreground">
              MySys © 2026
            </p>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
              Decentralized & Open Source
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
