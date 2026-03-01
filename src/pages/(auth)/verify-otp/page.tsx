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
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <PageTransition noBackground className="flex items-center justify-center">
                <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8 bg-card border border-border rounded-3xl shadow-xl">
                    <button
                        onClick={() => navigate(type === "signup" ? "/register" : "/forgot-password")}
                        className="group mb-8 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
                    >
                        <div className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary transition-all group-hover:scale-110">
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
                        <h2 className="mb-3 text-3xl font-extrabold tracking-tight dark:text-white md:text-4xl">
                            Verification
                        </h2>
                        <p className="font-medium text-zinc-500">
                            Enter the 6-digit code sent to <br />
                            <span className="font-bold text-indigo-500">{email}</span>
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-500/10 p-8 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center">
                                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-inner">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <p className="mb-2 font-black text-xl dark:text-white">Verified Successfully</p>
                                    <p className="text-sm text-zinc-500">
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
                                        className="w-full tracking-[1.2rem] rounded-[1.5rem] border border-border bg-secondary px-6 py-6 text-center text-4xl font-black dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:border-indigo-500 focus:outline-none transition-all"
                                        required
                                        autoFocus
                                    />
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
                                        <div className="h-0.5 w-4/5 border-b-2 border-dashed border-zinc-900 dark:border-white" />
                                    </div>
                                </div>
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
                                Verify Account
                            </Button>
                        </form>
                    )}

                    <div className="mt-10 pt-8 text-center border-t border-border">
                        <p className="text-sm font-medium text-zinc-500">
                            Didn't receive the code? {" "}
                            <button
                                onClick={() => navigate(type === "signup" ? "/register" : "/forgot-password")}
                                className="font-bold hover:underline dark:text-white"
                            >
                                Resend Code
                            </button>
                        </p>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default VerifyOTPPage;
