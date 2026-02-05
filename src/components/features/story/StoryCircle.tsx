import React from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StoryCircleProps {
  user: {
    avatar: string;
    handle: string;
  };
  onClick: () => void;
  isAddStory?: boolean;
  isSeen?: boolean;
}

const StoryCircle: React.FC<StoryCircleProps> = ({
  user,
  onClick,
  isAddStory = false,
  isSeen = false,
}) => (
  <button
    onClick={onClick}
    className="group flex shrink-0 flex-col items-center gap-2"
  >
    <div
      className={`relative p-0.5 rounded-full ${
        isAddStory
          ? "bg-transparent"
          : isSeen
            ? "bg-zinc-200 dark:bg-zinc-800"
            : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-violet-600"
      }`}
    >
      <div className="rounded-full bg-white p-0.5 dark:bg-black">
        <div className="relative">
          <Avatar className="size-14 border border-zinc-100 dark:border-zinc-800 sm:size-16">
            <AvatarImage
              src={user.avatar}
              alt={user.handle}
              className="object-cover"
            />
            <AvatarFallback>{user.handle?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          {isAddStory && (
            <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-violet-600 p-1 text-white shadow-lg dark:border-black">
              <Plus size={14} strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
    </div>
    <span className="w-16 truncate text-center text-[11px] font-semibold leading-tight text-zinc-600 dark:text-zinc-400">
      {isAddStory ? "Add Story" : user.handle}
    </span>
  </button>
);

export default StoryCircle;
