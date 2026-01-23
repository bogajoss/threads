"use client";
import React from "react";
import { EmojiPicker as EmojiPickerPrimitive } from "frimousse";
import { cn } from "@/lib/utils";

const EmojiPicker = ({ onEmojiSelect, className }) => {
  return (
    <EmojiPickerPrimitive.Root
      onEmojiSelect={onEmojiSelect}
      className={cn(
        "isolate flex h-[350px] w-[320px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <EmojiPickerPrimitive.Search
        className="z-10 mx-3 mt-3 appearance-none rounded-lg border-none bg-zinc-100 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-violet-500 dark:bg-zinc-900 dark:text-white"
        placeholder="Search emojis..."
      />

      <EmojiPickerPrimitive.Viewport className="relative flex-1 outline-none no-scrollbar">
        <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm dark:text-zinc-500">
          Loading…
        </EmojiPickerPrimitive.Loading>

        <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm dark:text-zinc-500">
          No emoji found.
        </EmojiPickerPrimitive.Empty>

        <EmojiPickerPrimitive.List
          className="select-none pb-2"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="bg-white/80 px-4 pt-4 pb-1.5 font-bold text-zinc-500 text-[11px] uppercase tracking-wider backdrop-blur-sm dark:bg-zinc-950/80 dark:text-zinc-400"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="scroll-my-1 px-2" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                className="flex aspect-square size-9 items-center justify-center rounded-lg text-xl transition-colors hover:bg-zinc-100 data-[active]:bg-violet-500/10 data-[active]:text-violet-500 dark:hover:bg-zinc-900 dark:data-[active]:bg-violet-500/20"
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </EmojiPickerPrimitive.Viewport>

      <EmojiPickerPrimitive.ActiveEmoji>
        {({ emoji }) => (
          <div className="flex items-center gap-3 border-t border-zinc-100 p-3 dark:border-zinc-800">
            {emoji ? (
              <>
                <span className="text-2xl">{emoji.emoji}</span>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 truncate">
                  {emoji.label.replace(/:/g, "").replace(/_/g, " ")}
                </span>
              </>
            ) : (
              <span className="text-xs font-medium text-zinc-400">
                Select an emoji...
              </span>
            )}
          </div>
        )}
      </EmojiPickerPrimitive.ActiveEmoji>
    </EmojiPickerPrimitive.Root>
  );
};

export default EmojiPicker;
