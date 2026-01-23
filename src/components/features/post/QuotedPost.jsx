import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const QuotedPost = ({ user, time, content }) => (
  <div className="p-4">
    <div className="flex items-center gap-x-2 mb-2">
      <Avatar className="size-6">
        <AvatarImage src={user.avatar} alt={user.handle} />
        <AvatarFallback>{user.handle[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="font-semibold text-sm">{user.handle}</span>
      <span className="text-zinc-500 text-sm">• {time}</span>
    </div>
    <p className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-line">
      {content}
    </p>
  </div>
);

export default QuotedPost;
