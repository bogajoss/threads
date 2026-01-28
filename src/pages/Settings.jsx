import React from "react";
import {
    LogOut,
    User,
    Moon,
    Sun,
    Lock,
    ChevronRight,
    ShieldCheck,
    Bell,
    Smartphone,
    Info,
    Zap,
    Trash
} from "lucide-react";
import {
    Button,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui";
import { useSettings } from "@/hooks";

const Settings = () => {
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
        handleReportBug
    } = useSettings();

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="text-zinc-500">Please login to view settings.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black md:rounded-xl md:border border-zinc-100 dark:border-zinc-800">
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-xl font-bold dark:text-white">Settings</h2>
            </div>

            <div className="p-4 space-y-6 max-w-2xl mx-auto w-full pb-20 mt-4">
                {/* Account Section */}
                <section className="space-y-4" aria-label="Account Security Settings">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Account Security</h3>

                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-expanded={isChangingPassword}
                            aria-label="Change Password"
                        >
                            <Lock size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Change Password</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordChange} className="p-4 space-y-3 bg-white dark:bg-black animate-in fade-in slide-in-from-top-2">
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    aria-label="New Password"
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    aria-label="Confirm Password"
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button type="button" variant="secondary" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Password"}</Button>
                                </div>
                            </form>
                        )}

                        <button
                            onClick={handlePasswordReset}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-label="Reset Password via Email"
                        >
                            <ShieldCheck size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Reset via Email</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>
                    </div>
                </section>

                {/* Appearance & Font Section */}
                <section className="space-y-4" aria-label="Display and Typography Settings">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Display & Typography</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={toggleDarkMode}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-label={`Toggle Dark Mode ${darkMode ? "Off" : "On"}`}
                            aria-pressed={darkMode}
                        >
                            {darkMode ? <Moon size={20} className="text-violet-500" /> : <Sun size={20} className="text-amber-500" />}
                            <span className="flex-1 font-medium dark:text-zinc-200">Dark Mode</span>
                            <div className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-violet-600' : 'bg-zinc-300'}`}>
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${darkMode ? 'left-5' : 'left-1'}`} />
                            </div>
                        </button>

                        <div className="px-4 py-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Smartphone size={20} className="text-zinc-500" />
                                <span className="font-medium dark:text-zinc-200">Font Size</span>
                            </div>
                            <Select value={fontSize} onValueChange={setFontSize} aria-label="Select Font Size">
                                <SelectTrigger className="w-[140px] bg-zinc-100 dark:bg-zinc-800 border-none font-bold text-violet-600 dark:text-violet-400 capitalize transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700" aria-label="Font Size">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-2xl rounded-xl p-1">
                                    <SelectItem value="small" className="py-2.5 rounded-lg focus:bg-zinc-50 dark:focus:bg-zinc-800 focus:text-violet-600 font-medium cursor-pointer">Small</SelectItem>
                                    <SelectItem value="base" className="py-2.5 rounded-lg focus:bg-zinc-50 dark:focus:bg-zinc-800 focus:text-violet-600 font-medium cursor-pointer">Default</SelectItem>
                                    <SelectItem value="large" className="py-2.5 rounded-lg focus:bg-zinc-50 dark:focus:bg-zinc-800 focus:text-violet-600 font-medium cursor-pointer">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                {/* Usage & Data Saver Section */}
                <section className="space-y-4" aria-label="Data and Storage Settings">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Data & Storage</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={() => setDataSaver(!dataSaver)}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-label={`Toggle Data Saver ${dataSaver ? "Off" : "On"}`}
                            aria-pressed={dataSaver}
                        >
                            <Zap size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Data Saver</span>
                            <div className={`w-10 h-6 rounded-full relative transition-colors ${dataSaver ? 'bg-emerald-600' : 'bg-zinc-300'}`}>
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${dataSaver ? 'left-5' : 'left-1'}`} />
                            </div>
                        </button>

                        <button
                            onClick={handleClearCache}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-label="Clear Local Cache"
                        >
                            <Trash size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Clear Local Cache</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>

                        <button
                            onClick={handleDownloadData}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-label="Download My Data"
                        >
                            <Info size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Download My Data (Export)</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>
                    </div>
                </section>

                {/* Support Section */}
                <section className="space-y-4" aria-label="Support Settings">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Support</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={handleReportBug}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            aria-label="Report a Bug"
                        >
                            <Bell size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Report a Bug</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>

                        <div className="px-4 py-4 flex items-center gap-3" aria-label="Application Version">
                            <Info size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Version</span>
                            <span className="text-zinc-500">1.0.0 (Beta)</span>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4 pt-4" aria-label="Danger Zone">
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                            aria-label="Log Out"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                            aria-label="Delete Account Permanently"
                        >
                            <Trash size={20} />
                            Delete Account Permanently
                        </button>
                    </div>
                </section>

                <div className="text-center text-xs text-zinc-400 py-4 pb-10">
                    Sysm © 2026. Decentralized & Open Source.
                </div>
            </div>
        </div>
    );
};

export default Settings;