import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
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
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
            addToast("Password reset link sent!");
        } catch (err: any) {
            console.error("Forgot password error:", err);
            addToast("Failed to send reset link", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <PageTransition noBackground className="flex items-center justify-center">
                <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8 bg-card border border-border rounded-3xl shadow-xl">
                    <button
                        onClick={() => navigate("/login")}
                        className="group mb-8 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
                    >
                        <div className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary transition-all group-hover:scale-110">
                            <ArrowLeft size={16} />
                        </div>
                        Back to login
                    </button>

                    <div className="mb-10 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 scale-150 bg-violet-500/20 blur-2xl rounded-full" />
                                <div className="relative flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-violet-700 p-4 shadow-xl shadow-violet-500/20 text-white">
                                    <Mail size={40} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                        <h2 className="mb-3 text-3xl font-extrabold tracking-tight dark:text-white md:text-4xl">
                            Forgot Password?
                        </h2>
                        <p className="text-balance font-medium text-zinc-500">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-500/10 p-8 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-inner">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="mb-2 font-black text-xl dark:text-white">Check your email</p>
                                    <p className="text-sm leading-relaxed text-zinc-500">
                                        We've sent a 6-digit reset code to <br />
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/50 underline-offset-4">{email}</span>.
                                    </p>
                                </div>
                            </div>
                            <Button
                                className="w-full py-4 text-lg font-bold"
                                onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=recovery`)}
                            >
                                Enter code manually
                            </Button>
                            <div className="text-center">
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    Didn't get the email? Try again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full py-4 text-lg font-bold"
                                loading={loading}
                            >
                                Send reset instructions
                            </Button>
                        </form>
                    )}

                    <div className="mt-10 border-t border-border pt-8 text-center">
                        <p className="text-sm font-medium text-zinc-500">
                            Please check your inbox and spam folder for the reset instructions.
                        </p>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default ForgotPasswordPage;
