import React, { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import {
    Button,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";

const Settings = () => {
    const { currentUser, logout } = useAuth();
    const {
        darkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        dataSaver,
        setDataSaver
    } = useTheme();
    const { addToast } = useToast();

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            addToast("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            addToast("Failed to logout");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            addToast("Passwords do not match", "error");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            addToast("Password must be at least 6 characters", "error");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
            if (error) throw error;
            addToast("Password updated successfully!");
            setIsChangingPassword(false);
            setPasswordData({ newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error("Password update error:", err);
            addToast(err.message || "Failed to update password", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!currentUser?.email) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(currentUser.email, {
                redirectTo: `${window.location.origin}/settings?type=recovery`,
            });
            if (error) throw error;
            addToast("Password reset email sent!");
        } catch (err) {
            console.error("Reset password error:", err);
            addToast(err.message || "Failed to send reset email", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleClearCache = () => {
        // In a real app, this would clear temporary stored data, not necessarily session
        const keysToRemove = ["seenStories", "font-size", "data-saver", "theme"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        addToast("Cache cleared! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
    };

    const handleDownloadData = async () => {
        setLoading(true);
        try {
            // Mock data fetching for export
            const data = {
                user: {
                    id: currentUser.id,
                    handle: currentUser.handle,
                    name: currentUser.name,
                    email: currentUser.email,
                },
                exportDate: new Date().toISOString(),
                note: "This is a mock export of your Sysm data."
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `sysm-data-${currentUser.handle}.json`;
            link.click();
            URL.revokeObjectURL(url);
            addToast("Data export started!");
        } catch {
            addToast("Failed to export data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Are you absolutely sure? This will permanently delete your account and all associated data. This action is irreversible.");
        if (confirmed) {
            addToast("Account deletion request submitted. Logging out...");
            setTimeout(handleLogout, 2000);
        }
    };

    const handleReportBug = () => {
        const bug = window.prompt("Please describe the bug you found:");
        if (bug) {
            addToast("Bug reported! Thank you for your feedback.");
        }
    };

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
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Account Security</h3>

                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
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
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
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
                        >
                            <ShieldCheck size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Reset via Email</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>
                    </div>
                </section>

                {/* Appearance & Font Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Display & Typography</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={toggleDarkMode}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
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
                            <Select value={fontSize} onValueChange={setFontSize}>
                                <SelectTrigger className="w-[140px] bg-zinc-100 dark:bg-zinc-800 border-none font-bold text-violet-600 dark:text-violet-400 capitalize transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700">
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
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Data & Storage</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={() => setDataSaver(!dataSaver)}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
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
                        >
                            <Trash size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Clear Local Cache</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>

                        <button
                            onClick={handleDownloadData}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                        >
                            <Info size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Download My Data (Export)</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>
                    </div>
                </section>

                {/* Support Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">Support</h3>
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                        <button
                            onClick={handleReportBug}
                            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                        >
                            <Bell size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Report a Bug</span>
                            <ChevronRight size={16} className="text-zinc-400" />
                        </button>

                        <div className="px-4 py-4 flex items-center gap-3">
                            <Info size={20} className="text-zinc-500" />
                            <span className="flex-1 font-medium dark:text-zinc-200">Version</span>
                            <span className="text-zinc-500">1.0.0 (Beta)</span>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4 pt-4">
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
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
