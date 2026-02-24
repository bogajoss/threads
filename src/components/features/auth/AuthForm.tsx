import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { checkUsernameAvailability } from "@/lib/api";

interface AuthFormProps {
  type: "login" | "signup";
  onComplete: () => void;
  onSwitch: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onComplete, onSwitch }) => {
  const { login, signup } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usernameStatus, setUsernameStatus] = useState<{
    loading: boolean;
    available: boolean | null;
  }>({ loading: false, available: null });

  useEffect(() => {
    if (type === "signup" && formData.username.length >= 5) {
      const timer = setTimeout(async () => {
        setUsernameStatus({ loading: true, available: null });
        try {
          const isAvailable = await checkUsernameAvailability(
            formData.username,
          );
          setUsernameStatus({ loading: false, available: isAvailable });
        } catch {
          setUsernameStatus({ loading: false, available: null });
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus({ loading: false, available: null });
    }
  }, [formData.username, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      type === "signup" &&
      (usernameStatus.available === false || formData.username.length < 5)
    ) {
      addToast(
        formData.username.length < 5
          ? "Username must be at least 5 characters"
          : "Please choose a different username",
        "error",
      );
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (type === "login") {
        await login({ email: formData.email, password: formData.password });
        addToast("Welcome back!");
        onComplete();
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          name: formData.name,
        });
        addToast("Account created successfully!");
        onComplete();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(
        err.message || "Authentication failed. Please check your credentials.",
      );
      addToast("Authentication failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8 bg-card border border-border rounded-3xl shadow-xl">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl bg-black p-3 shadow-lg text-white dark:bg-white dark:text-black">
            <img
              src="/logo.webp"
              alt="Logo"
              className="size-16 rounded-2xl shadow-xl"
            />
          </div>
        </div>
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight dark:text-white">
          {type === "login" ? "Welcome back!" : "Join MySys today"}
        </h2>
        <p className="font-medium text-zinc-500">
          The decentralized social network
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        {type === "signup" && (
          <>
            <Input
              label="Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <div className="relative">
              <Input
                label="Username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "");
                  setFormData({ ...formData, username: value });
                }}
                required
              />
              <div className="absolute right-3 top-[38px]">
                {usernameStatus.loading ? (
                  <Loader2 size={18} className="animate-spin text-zinc-400" />
                ) : usernameStatus.available === true ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : usernameStatus.available === false ? (
                  <XCircle size={18} className="text-rose-500" />
                ) : null}
              </div>
            </div>
          </>
        )}

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        {type === "login" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                // Navigate to forgot password page
                window.location.href = "/forgot-password";
              }}
              className="text-xs font-medium text-zinc-500 hover:text-black hover:underline dark:hover:text-white"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="mt-6 w-full justify-center py-3 text-lg"
          loading={loading}
          disabled={
            type === "signup" &&
            (usernameStatus.available === false || formData.username.length < 5)
          }
        >
          {type === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-zinc-500">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <button
          onClick={onSwitch}
          className="ml-1 font-bold hover:underline dark:text-white"
        >
          {type === "login" ? "Sign up" : "Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
