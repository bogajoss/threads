import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const QuotedPost = ({ user, time, content }) => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-x-2 mb-2">
        <div className="flex items-center gap-x-2">
          <Avatar className="size-6">
            <AvatarImage src={user.avatar} alt={user.handle} />
            <AvatarFallback>{user.handle[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{user.handle}</span>
        </div>
        <span className="text-zinc-500 text-xs sm:text-sm">{time}</span>
      </div>
      <Linkify
        options={{
          ...linkifyOptions,
          render: ({ attributes, content: text }) => {
            const { href, ...props } = attributes;
            const origin = window.location.origin;

            // Check if link is internal
            let internalPath = null;
            if (href.startsWith("/")) {
              internalPath = href;
            } else if (href.startsWith(origin)) {
              internalPath = href.replace(origin, "");
            }

            if (internalPath) {
              return (
                <span
                  key={text}
                  {...props}
                  className={cn("text-violet-600 dark:text-violet-400 font-medium hover:underline cursor-pointer", props.className)}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(internalPath);
                  }}
                >
                  {text}
                </span>
              );
            }

            return (
              <a
                key={text}
                href={href}
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("text-violet-600 dark:text-violet-400 hover:underline", props.className)}
                onClick={(e) => e.stopPropagation()}
              >
                {text}
              </a>
            );
          },
        }}
      >
        <p className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-line">
          {content}
        </p>
      </Linkify>
    </div>
  );
};

export default QuotedPost;
