import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Key, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageTransition } from "@/components/layout";

const VerifyOTPPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { verifyOtp } = useAuth();
    const { addToast } = useToast();

    const email = searchParams.get("email") || "";
    const type = (searchParams.get("type") as "signup" | "recovery") || "signup";

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (token.length < 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await verifyOtp(email, token, type);
            setSuccess(true);
            addToast(type === "signup" ? "Account verified!" : "Code verified!");

            // Navigate after a short delay
            setTimeout(() => {
                if (type === "signup") {
                    navigate("/");
                } else {
                    navigate("/reset-password");
                }
            }, 1500);
        } catch (err: any) {
            console.error("OTP Verification error:", err);
            setError(err.message || "Invalid or expired code. Please try again.");
            addToast("Verification failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -right-[15%] -top-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute -left-[15%] -bottom-[10%] h-[50%] w-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            <PageTransition>
                <div className="relative z-10 mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/40 p-1 shadow-2xl backdrop-blur-2xl">
                        <div className="rounded-[2.4rem] bg-gradient-to-b from-white/[0.08] to-transparent p-8 md:p-10">
                            <button
                                onClick={() => navigate(type === "signup" ? "/register" : "/forgot-password")}
                                className="group mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                            >
                                <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all group-hover:scale-110 group-hover:bg-white/10">
                                    <ArrowLeft size={16} />
                                </div>
                                Change Email
                            </button>

                            <div className="mb-10 text-center">
                                <div className="mb-6 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 scale-150 bg-indigo-500/20 blur-2xl rounded-full" />
                                        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-4 shadow-xl shadow-indigo-500/20 text-white">
                                            <Key size={40} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                                    Verification
                                </h2>
                                <p className="font-medium text-zinc-400">
                                    Enter the 6-digit code sent to <br />
                                    <span className="font-bold text-indigo-400">{email}</span>
                                </p>
                            </div>

                            {success ? (
                                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                    <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-500/10 p-8 border border-emerald-500/20 text-emerald-400 text-center">
                                        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-inner">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <p className="mb-2 font-black text-xl text-white">Verified Successfully</p>
                                            <p className="text-sm text-zinc-400">
                                                {type === "signup"
                                                    ? "Welcome to MySys! Getting things ready..."
                                                    : "Identity confirmed. One more step..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="••••••"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ""))}
                                                className="w-full tracking-[1.2rem] rounded-[2rem] border border-white/10 bg-white/5 px-6 py-6 text-center text-4xl font-black text-white placeholder:text-zinc-700 focus:border-indigo-500 focus:bg-white/[0.08] focus:outline-none transition-all"
                                                required
                                                autoFocus
                                            />
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                                                <div className="h-0.5 w-4/5 border-b-2 border-dashed border-white" />
                                            </div>
                                        </div>
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
                                        Verify Account
                                    </Button>
                                </form>
                            )}

                            <div className="mt-10 pt-8 text-center border-t border-white/5">
                                <p className="text-sm font-medium text-zinc-500">
                                    Didn't receive the code? {" "}
                                    <button
                                        onClick={() => navigate(type === "signup" ? "/register" : "/forgot-password")}
                                        className="font-bold text-white hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default VerifyOTPPage;
