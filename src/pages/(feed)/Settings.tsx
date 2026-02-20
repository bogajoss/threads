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
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { useSettings } from "@/hooks";

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
        <p className="text-zinc-500">Please login to view settings.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black md:rounded-xl md:border">
      <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold dark:text-white">Settings</h2>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-2xl space-y-6 p-4 pb-20">
        <section className="space-y-4" aria-label="Account Security Settings">
          <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            Account Security
          </h3>

          <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-expanded={isChangingPassword}
              aria-label="Change Password"
            >
              <Lock size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Change Password
              </span>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            {isChangingPassword && (
              <form
                onSubmit={handlePasswordChange}
                className="animate-in fade-in slide-in-from-top-2 space-y-3 bg-white p-4 dark:bg-black"
              >
                <Input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  aria-label="New Password"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  aria-label="Confirm Password"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    Update Password
                  </Button>
                </div>
              </form>
            )}

            <button
              onClick={handlePasswordReset}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Reset Password via Email"
            >
              <ShieldCheck size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Reset via Email
              </span>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </div>
        </section>

        <section
          className="space-y-4"
          aria-label="Display and Typography Settings"
        >
          <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            Display & Typography
          </h3>
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-900">
            <button
              onClick={toggleDarkMode}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label={`Toggle Dark Mode ${darkMode ? "Off" : "On"}`}
              aria-pressed={darkMode}
            >
              {darkMode ? (
                <Moon size={20} className="text-violet-500" />
              ) : (
                <Sun size={20} className="text-amber-500" />
              )}
              <span className="flex-1 font-medium dark:text-zinc-200">
                Dark Mode
              </span>
              <div
                className={`relate h-6 w-10 rounded-full transition-colors ${darkMode ? "bg-violet-600" : "bg-zinc-300"}`}
              >
                <div
                  className={`absolute top-1 size-4 rounded-full bg-white transition-all ${darkMode ? "left-5" : "left-1"}`}
                />
              </div>
            </button>

            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-zinc-500" />
                <span className="font-medium dark:text-zinc-200">
                  Font Size
                </span>
              </div>
              <Select
                value={fontSize}
                onValueChange={(val: string) => setFontSize(val as any)}
                aria-label="Select Font Size"
              >
                <SelectTrigger
                  className="w-[140px] border-none bg-zinc-100 font-bold capitalize text-violet-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-violet-400 dark:hover:bg-zinc-700"
                  aria-label="Font Size"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-100 bg-white p-1 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                  <SelectItem
                    value="small"
                    className="cursor-pointer rounded-lg py-2.5 font-medium focus:bg-zinc-50 focus:text-violet-600 dark:focus:bg-zinc-800"
                  >
                    Small
                  </SelectItem>
                  <SelectItem
                    value="base"
                    className="cursor-pointer rounded-lg py-2.5 font-medium focus:bg-zinc-50 focus:text-violet-600 dark:focus:bg-zinc-800"
                  >
                    Default
                  </SelectItem>
                  <SelectItem
                    value="large"
                    className="cursor-pointer rounded-lg py-2.5 font-medium focus:bg-zinc-50 focus:text-violet-600 dark:focus:bg-zinc-800"
                  >
                    Large
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-4" aria-label="Data and Storage Settings">
          <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            Data & Storage
          </h3>
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label={`Toggle Data Saver ${dataSaver ? "Off" : "On"}`}
              aria-pressed={dataSaver}
            >
              <Zap size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Data Saver
              </span>
              <div
                className={`relate h-6 w-10 rounded-full transition-colors ${dataSaver ? "bg-emerald-600" : "bg-zinc-300"}`}
              >
                <div
                  className={`absolute top-1 size-4 rounded-full bg-white transition-all ${dataSaver ? "left-5" : "left-1"}`}
                />
              </div>
            </button>

            <button
              onClick={handleClearCache}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Clear Local Cache"
            >
              <Trash size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Clear Local Cache
              </span>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            <button
              onClick={handleDownloadData}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Download My Data"
            >
              <Info size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Download My Data (Export)
              </span>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>
          </div>
        </section>

        <section className="space-y-4" aria-label="Support Settings">
          <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            Support
          </h3>
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-900">
            <button
              onClick={handleReportBug}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Report a Bug"
            >
              <Bell size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Report a Bug
              </span>
              <ChevronRight size={16} className="text-zinc-400" />
            </button>

            <div
              className="flex items-center gap-3 px-4 py-4"
              aria-label="Application Version"
            >
              <Info size={20} className="text-zinc-500" />
              <span className="flex-1 font-medium dark:text-zinc-200">
                Version
              </span>
              <span className="text-zinc-500">1.0.0 (Beta)</span>
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4" aria-label="Danger Zone">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 font-bold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Log Out"
            >
              <LogOut size={20} />
              Log Out
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 p-4 font-bold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/20 dark:bg-rose-900/10 dark:text-rose-500 dark:hover:bg-rose-900/40"
              aria-label="Delete Account Permanently"
            >
              <Trash size={20} />
              Delete Account Permanently
            </button>
          </div>
        </section>

        <div className="py-4 pb-10 text-center text-xs text-zinc-400">
          mysys © 2026. Decentralized & Open Source.
        </div>
      </div>
    </div>
  );
};

export default Settings;
