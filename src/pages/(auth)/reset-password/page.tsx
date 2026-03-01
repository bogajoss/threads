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
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <PageTransition noBackground className="flex items-center justify-center">
                <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8 bg-card border border-border rounded-3xl shadow-xl">
                    <div className="mb-10 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 scale-150 bg-emerald-500/20 blur-2xl rounded-full" />
                                <div className="relative flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 shadow-xl shadow-emerald-500/20 text-white">
                                    <Lock size={40} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                        <h2 className="mb-3 text-3xl font-extrabold tracking-tight dark:text-white md:text-4xl">
                            New Password
                        </h2>
                        <p className="font-medium text-zinc-500">
                            Create a secure password for your account.
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-500/10 p-8 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center">
                                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-inner">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <p className="mb-2 font-black text-xl dark:text-white">Password Updated</p>
                                    <p className="text-sm text-zinc-500 italic">
                                        Redirecting you to login...
                                    </p>
                                </div>
                            </div>
                            <Button
                                className="w-full py-4 text-lg font-bold"
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
                                    required
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-in slide-in-from-top-2">
                                    <AlertCircle size={18} />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg font-bold"
                                loading={loading}
                            >
                                Update Password
                            </Button>
                        </form>
                    )}

                    <div className="mt-10 pt-8 text-center border-t border-border">
                        <p className="text-xs font-medium text-zinc-500 italic">
                            After resetting, you will be automatically redirected to the login page.
                        </p>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default ResetPasswordPage;
