import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RichText from "@/components/ui/rich-text";
import type { User } from "@/types";

interface QuotedPostProps {
  user: User;
  time: string;
  content: string;
}

const QuotedPost: React.FC<QuotedPostProps> = ({ user, time, content }) => {
  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          <Avatar className="size-6">
            <AvatarImage src={user.avatar} alt={user.handle} />
            <AvatarFallback>{user.handle[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{user.handle}</span>
        </div>
        <span className="text-xs text-zinc-500 sm:text-sm">{time}</span>
      </div>
      <RichText
        content={content}
        className="text-sm text-zinc-800 dark:text-zinc-300"
      />
    </div>
  );
};

export default QuotedPost;
