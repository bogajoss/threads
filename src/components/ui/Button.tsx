import React, { type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "violet";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "rounded-full font-bold inline-flex items-center justify-center relative overflow-hidden transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 touch-manipulation shadow-sm hover:shadow-md";

  const variants = {
    primary:
      "text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 dark:bg-white dark:text-black dark:border-white dark:hover:bg-zinc-200",
    secondary:
      "text-zinc-900 border border-zinc-200 bg-white hover:bg-zinc-50 dark:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800",
    outline:
      "text-zinc-900 border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900",
    danger:
      "text-white bg-rose-500 hover:bg-rose-600 border border-rose-500 shadow-rose-500/10 hover:shadow-rose-500/20",
    ghost:
      "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 border-transparent shadow-none hover:shadow-none",
    violet:
      "text-white bg-violet-600 hover:bg-violet-700 border border-violet-600 shadow-violet-600/20 hover:shadow-violet-600/30",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base",
    icon: "p-2 aspect-square",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
      <div
        className={cn("flex items-center gap-x-1.5", loading && "opacity-80")}
      >
        {children}
      </div>

      {/* Subtle overlay for click effect */}
      <div className="absolute inset-0 bg-black/0 active:bg-black/5 transition-colors pointer-events-none" />
    </button>
  );
};

export default Button;
