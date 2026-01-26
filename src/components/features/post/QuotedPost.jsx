import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { useNavigate } from "react-router-dom";

const QuotedPost = ({ user, time, content }) => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <div className="flex items-center gap-x-2 mb-2">
        <Avatar className="size-6">
          <AvatarImage src={user.avatar} alt={user.handle} />
          <AvatarFallback>{user.handle[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-sm">{user.handle}</span>
        <span className="text-zinc-500 text-sm">• {time}</span>
      </div>
      <Linkify
        options={{
          ...linkifyOptions,
          render: ({ attributes, content: text }) => {
            const { href, ...props } = attributes;
            const isExternal =
              !href.startsWith("/") &&
              (href.startsWith("http") || href.startsWith("www"));

            if (href.startsWith("/u/") || href.startsWith("/explore")) {
              return (
                <span
                  key={text}
                  {...props}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(href);
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
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
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
