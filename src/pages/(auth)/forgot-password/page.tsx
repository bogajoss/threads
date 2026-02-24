import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageTransition } from "@/components/layout";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { forgotPassword } = useAuth();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await forgotPassword(email);
            setSuccess(true);
            addToast("Password reset link sent!");
        } catch (err: any) {
            console.error("Forgot password error:", err);
            setError(err.message || "Failed to send reset link.");
            addToast("Failed to send reset link", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <PageTransition>
                <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8 bg-card border border-border rounded-3xl shadow-xl">
                    <button
                        onClick={() => navigate("/login")}
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </button>

                    <div className="mb-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-2xl bg-black p-4 shadow-lg text-white dark:bg-white dark:text-black">
                                <Mail size={32} />
                            </div>
                        </div>
                        <h2 className="mb-2 text-3xl font-extrabold tracking-tight dark:text-white">
                            Forgot password?
                        </h2>
                        <p className="font-medium text-zinc-500">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6 text-center">
                            <div className="flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 p-6 text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400">
                                <CheckCircle2 size={48} className="mb-2" />
                                <p className="font-bold text-lg">Check your email</p>
                                <p className="text-sm">
                                    We've sent a password reset link to <span className="font-bold underline">{email}</span>.
                                </p>
                            </div>
                            <Button
                                className="w-full justify-center"
                                onClick={() => navigate("/login")}
                            >
                                Back to login
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
                                    label="Email address"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="mt-6 w-full justify-center py-3 text-lg"
                                    loading={loading}
                                >
                                    {loading ? "Sending..." : "Reset password"}
                                </Button>
                            </form>
                        </>
                    )}

                    <div className="mt-8 text-center text-sm">
                        <p className="text-zinc-400">আপনার ইমেইল চেক করুন, আমরা সেখানে একটি রিসেট লিঙ্ক পাঠিয়েছি।</p>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default ForgotPasswordPage;
