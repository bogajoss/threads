import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const AuthForm = ({ type, onComplete, onSwitch }) => {
  const { login, signup } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
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
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.message || "Authentication failed. Please check your credentials.",
      );
      addToast("Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-black dark:bg-white dark:text-black text-white p-3 rounded-2xl shadow-lg">
          <img
            src="/logo.webp"
            alt="Logo"
            className="size-16 rounded-2xl shadow-xl border-2 border-zinc-100 dark:border-zinc-800"
          />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold mb-2 dark:text-white tracking-tight">
          {type === "login" ? "Welcome back!" : "Join Sysm today"}
        </h2>
        <p className="text-zinc-500 font-medium">
          The decentralized social network
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm">
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {type === "signup" && (
          <>
            <Input
              label="Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Username"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => {
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
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <Button
          type="submit"
          className="w-full justify-center py-3 mt-6 text-lg"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : type === "login" ? (
            "Log in"
          ) : (
            "Sign up"
          )}
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
          className="font-bold ml-1 hover:underline dark:text-white"
        >
          {type === "login" ? "Sign up" : "Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
