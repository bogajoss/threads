import React, { type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "ghost"
    | "violet"
    | "animated";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    "rounded-full font-bold inline-flex items-center justify-center relative overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation shadow-sm hover:shadow-md active:opacity-80";

  const variants = {
    primary:
      "text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border-none",
    secondary:
      "text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:text-white dark:bg-zinc-900 dark:hover:bg-zinc-800 border-none",
    outline:
      "text-zinc-900 border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900",
    danger:
      "text-white bg-rose-500 hover:bg-rose-600 border-none shadow-rose-500/10 hover:shadow-rose-500/20",
    ghost:
      "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 border-transparent shadow-none hover:shadow-none",
    violet:
      "text-white bg-violet-600 hover:bg-violet-700 border-none shadow-violet-600/20 hover:shadow-violet-600/30",
    animated:
      "btn-animated bg-zinc-900 text-white dark:bg-white dark:text-black border-none rounded-2xl px-8 py-3 text-lg font-black",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base",
    icon: "p-2 aspect-square",
  };

  if (variant === "animated") {
    const { ...buttonProps } = props as any;
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={cn("btn-animated", className)}
        disabled={disabled || loading}
        {...buttonProps}
      >
        <div className="svg-wrapper-1">
          <div className="svg-wrapper">
            {icon ? (
              <div className="icon-wrapper [&>svg]:w-4 [&>svg]:h-4">{icon}</div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            )}
          </div>
        </div>
        <span className="ml-2 uppercase tracking-wider">{children}</span>
        <div className="absolute inset-0 bg-black/0 active:bg-black/5 transition-colors pointer-events-none" />
      </motion.button>
    );
  }

   
  const { ...buttonProps } = props as any;
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...buttonProps}
    >
      {loading && <span className="mr-2 animate-pulse">...</span>}
      <div
        className={cn("flex items-center gap-x-1.5", loading && "opacity-80")}
      >
        {children}
      </div>

      <div className="absolute inset-0 bg-black/0 active:bg-black/5 transition-colors pointer-events-none" />
    </motion.button>
  );
};

export default Button;
