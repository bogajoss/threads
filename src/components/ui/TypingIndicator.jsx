import React from "react";
import { cn } from "@/lib/utils";

const TypingIndicator = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-1 px-1 py-1.5", className)}>
      <div className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-dot-pulse" />
      <div className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-dot-pulse [animation-delay:0.2s]" />
      <div className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-dot-pulse [animation-delay:0.4s]" />
    </div>
  );
};

export default TypingIndicator;
