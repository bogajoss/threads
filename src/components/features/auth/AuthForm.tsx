import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        addToast("Confirm Your Email", "info");
        onSwitch(); // Switch to login page
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
    <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl bg-black p-3 shadow-lg text-white dark:bg-white dark:text-black">
            <img
              src="/logo.webp"
              alt="Logo"
              className="size-16 rounded-2xl border-2 border-zinc-100 shadow-xl dark:border-zinc-800"
            />
          </div>
        </div>
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight dark:text-white">
          {type === "login" ? "Welcome back!" : "Join Sysm today"}
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
            <Input
              label="Username"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                setFormData({ ...formData, username: value });
              }}
              required
            />
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

        <Button
          type="submit"
          className="mt-6 w-full justify-center py-3 text-lg"
          loading={loading}
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
