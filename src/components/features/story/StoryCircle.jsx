import React from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const StoryCircle = ({ user, onClick, isAddStory = false }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 group shrink-0"
  >
    <div
      className={`relative p-0.5 rounded-full ${!isAddStory ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-violet-600" : "bg-transparent"}`}
    >
      <div className="bg-white dark:bg-black rounded-full p-0.5">
        <div className="relative">
          <Avatar className="size-14 sm:size-16 border border-zinc-100 dark:border-zinc-800">
            <AvatarImage
              src={user.avatar}
              alt={user.handle}
              className="object-cover"
            />
            <AvatarFallback>{user.handle?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {isAddStory && (
            <div className="absolute bottom-0 right-0 bg-violet-600 border-2 border-white dark:border-black rounded-full p-1 text-white shadow-lg">
              <Plus size={14} strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
    </div>
    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 truncate w-16 text-center leading-tight">
      {isAddStory ? "Add Story" : user.handle}
    </span>
  </button>
);

export default StoryCircle;
