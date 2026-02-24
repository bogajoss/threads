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
            <PageTransition>
                <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8 bg-card border border-border rounded-3xl shadow-xl">
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-2xl bg-black p-4 shadow-lg text-white dark:bg-white dark:text-black">
                                <Lock size={32} />
                            </div>
                        </div>
                        <h2 className="mb-2 text-3xl font-extrabold tracking-tight dark:text-white">
                            Set new password
                        </h2>
                        <p className="font-medium text-zinc-500">
                            Must be at least 6 characters.
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6 text-center">
                            <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 p-6 text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400">
                                <CheckCircle2 size={48} className="mb-2" />
                                <p className="font-bold text-lg">Password reset</p>
                                <p className="text-sm">
                                    Your password has been successfully reset. Redirecting you to login...
                                </p>
                            </div>
                            <Button
                                className="w-full justify-center"
                                onClick={() => navigate("/login")}
                            >
                                Go to login
                            </Button>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="New password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Confirm new password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="mt-6 w-full justify-center py-3 text-lg"
                                    loading={loading}
                                >
                                    {loading ? "Updating..." : "Reset password"}
                                </Button>
                            </form>
                        </>
                    )}

                    <div className="mt-8 text-center text-sm">
                        <p className="text-zinc-400 italic">পাসওয়ার্ড রিসেট করার পর আপনাকে লগইন পেজে নিয়ে যাওয়া হবে।</p>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default ResetPasswordPage;
