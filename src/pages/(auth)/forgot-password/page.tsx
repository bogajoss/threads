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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
                <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-emerald-600/20 blur-[120px]" />
            </div>

            <PageTransition>
                <div className="relative z-10 mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/40 p-1 shadow-2xl backdrop-blur-2xl">
                        <div className="rounded-[2.4rem] bg-gradient-to-b from-white/[0.08] to-transparent p-8 md:p-10">
                            <button
                                onClick={() => navigate("/login")}
                                className="group mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                            >
                                <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:bg-white/10">
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
                                <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                                    Forgot Password?
                                </h2>
                                <p className="text-balance font-medium text-zinc-400">
                                    No worries, we'll send you reset instructions.
                                </p>
                            </div>

                            {success ? (
                                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                                    <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-500/10 p-8 border border-emerald-500/20 text-emerald-400">
                                        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-inner">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="mb-2 font-black text-xl text-white">Check your email</p>
                                            <p className="text-sm leading-relaxed text-zinc-400">
                                                We've sent a 6-digit reset code to <br />
                                                <span className="font-bold text-emerald-400 underline decoration-emerald-500/50 underline-offset-4">{email}</span>.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full rounded-2xl bg-white py-6 text-lg font-bold text-black hover:bg-zinc-200"
                                        onClick={() => navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=recovery`)}
                                    >
                                        Enter code manually
                                    </Button>
                                    <div className="text-center">
                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
                                        >
                                            Didn't get the email? Try again
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 rounded-2xl border-white/10 bg-white/5 px-6 text-white placeholder:text-zinc-600 focus:border-violet-500 focus:bg-white/[0.08]"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-2xl bg-violet-600 py-6 text-lg font-bold text-white shadow-xl shadow-violet-600/20 hover:bg-violet-500 disabled:opacity-50"
                                        loading={loading}
                                    >
                                        Send reset instructions
                                    </Button>
                                </form>
                            )}

                            <div className="mt-10 border-t border-white/5 pt-8 text-center">
                                <p className="text-sm font-medium text-zinc-500">
                                    Please check your inbox and spam folder for the reset instructions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default ForgotPasswordPage;
