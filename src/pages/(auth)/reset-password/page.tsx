import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Lock, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageTransition } from "@/components/layout";
import { supabase } from "@/lib/supabase";

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const { addToast } = useToast();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check if the user is redirected via a recovery link
        supabase.auth.onAuthStateChange(async (event) => {
            if (event !== "PASSWORD_RECOVERY") {
                // If they just manually visited /reset-password without being in recovery mode
                // Note: In some Supabase versions, this check might be different
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await resetPassword(password);
            setSuccess(true);
            addToast("Password updated successfully!");

            // Navigate to login after a short delay
            setTimeout(() => navigate("/login"), 3000);
        } catch (err: any) {
            console.error("Reset password error:", err);
            setError(err.message || "Failed to update password.");
            addToast("Failed to update password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-[5%] top-[10%] h-[60%] w-[60%] rounded-full bg-emerald-600/10 blur-[140px]" />
                <div className="absolute -right-[5%] bottom-[10%] h-[60%] w-[60%] rounded-full bg-violet-600/10 blur-[140px]" />
            </div>

            <PageTransition>
                <div className="relative z-10 mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/40 p-1 shadow-2xl backdrop-blur-2xl">
                        <div className="rounded-[2.4rem] bg-gradient-to-b from-white/[0.08] to-transparent p-8 md:p-10">
                            <div className="mb-10 text-center">
                                <div className="mb-6 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 scale-150 bg-emerald-500/20 blur-2xl rounded-full" />
                                        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 shadow-xl shadow-emerald-500/20 text-white">
                                            <Lock size={40} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                                    New Password
                                </h2>
                                <p className="font-medium text-zinc-400">
                                    Create a secure password for your account.
                                </p>
                            </div>

                            {success ? (
                                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                    <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-500/10 p-8 border border-emerald-500/20 text-emerald-400 text-center">
                                        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-inner">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <p className="mb-2 font-black text-xl text-white">Password Updated</p>
                                            <p className="text-sm text-zinc-400 italic">
                                                Redirecting you to login...
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full rounded-2xl bg-white py-6 text-lg font-bold text-black hover:bg-zinc-200 shadow-xl"
                                        onClick={() => navigate("/login")}
                                    >
                                        Go to Login
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-5">
                                        <Input
                                            label="New Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 rounded-2xl border-white/10 bg-white/5 px-6 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:bg-white/[0.08]"
                                            required
                                        />
                                        <Input
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-14 rounded-2xl border-white/10 bg-white/5 px-6 text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:bg-white/[0.08]"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-400 border border-rose-500/20 animate-in slide-in-from-top-2">
                                            <AlertCircle size={18} />
                                            <span className="font-medium">{error}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full rounded-2xl bg-white py-6 text-lg font-bold text-black hover:bg-zinc-200 shadow-xl"
                                        loading={loading}
                                    >
                                        Update Password
                                    </Button>
                                </form>
                            )}

                            <div className="mt-10 pt-8 text-center border-t border-white/5">
                                <p className="text-xs font-medium text-zinc-500 italic">
                                    After resetting, you will be automatically redirected to the login page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default ResetPasswordPage;
