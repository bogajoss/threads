import React from "react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const SignupCard = ({ className }) => {
  const { setAuthMode } = useAuth();

  return (
    <div
      className={cn(
        "border border-[--border] rounded-2xl p-8 flex flex-col items-center text-center gap-4 bg-[--card] shadow-sm",
        className,
      )}
    >
      <div className="relative">
        <div className="size-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin duration-[3000ms]" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          💫
        </span>
      </div>
      <h2 className="font-extrabold text-lg text-[--foreground] mt-2 leading-tight">
        Get your Sysm account now!
      </h2>
      <button
        onClick={() => setAuthMode("signup")}
        className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-2.5 rounded-full font-black text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
      >
        Signup now
      </button>
    </div>
  );
};

export default SignupCard;
