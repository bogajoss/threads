import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SignupCardProps {
  className?: string;
}

const SignupCard: React.FC<SignupCardProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "bg-[--card] border border-[--border] rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm",
        className,
      )}
    >
      <div className="relative">
        <div className="size-16 animate-spin rounded-full border-4 border-t-transparent border-amber-400 duration-[3000ms]" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          💫
        </span>
      </div>
      <h2 className="mt-2 text-lg font-extrabold leading-tight text-[--foreground]">
        Get your mysys account now!
      </h2>
      <div className="flex w-full flex-col gap-2">
        <button
          onClick={() => navigate("/register")}
          className="w-full cursor-pointer rounded-full bg-zinc-950 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-zinc-950"
        >
          Signup now
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full cursor-pointer rounded-full border border-zinc-200 bg-white py-2.5 text-sm font-black uppercase tracking-wider text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignupCard;
