import React from "react";
import { useNavigate } from "react-router-dom";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";
import { cn } from "@/lib/utils";

interface RichTextProps {
    content: string;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const RichText: React.FC<RichTextProps> = ({ content, className, onClick }) => {
    const navigate = useNavigate();

    // Temporary hack replacement until we fix the linkify-plugin-hashtag/mention
    // or if we want to keep the existing behavior from PostContent
    const processContent = (text: string) => {
        // Replicating the logic from PostContent.tsx where it replaces #hash with internal.tag URL
        // This allows Linkify to catch it as a URL and we can intercept it in render
        return text.replace(/#([\u0980-\u09FF\w]+)/g, "https://internal.tag/$1");
    };

    const processedContent = typeof content === "string" ? processContent(content) : content;

    return (
        <div className={cn("whitespace-pre-line break-words", className)} onClick={onClick}>
            <Linkify
                options={{
                    ...linkifyOptions,
                    render: ({ attributes, content: linkContent }) => {
                        const { href, ...props } = attributes;
                        const origin = window.location.origin;

                        // Handle Hashtags (intercepted via fake URL)
                        if (href.includes("internal.tag/")) {
                            const tag = decodeURIComponent(href.split("internal.tag/")[1]);
                            return (
                                <span
                                    key={linkContent as string}
                                    {...props}
                                    className={cn(
                                        "cursor-pointer font-bold text-blue-600 hover:underline dark:text-blue-400",
                                        props.className
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/tags/${tag}`);
                                    }}
                                >
                                    #{tag}
                                </span>
                            );
                        }

                        // Handle Mentions (linkify-plugin-mention usually outputs /u/user)
                        // or if linkifyOptions formats it that way.
                        // Let's check if it's an internal path
                        let internalPath = null;
                        if (href.startsWith("/")) {
                            internalPath = href;
                        } else if (href.startsWith(origin)) {
                            internalPath = href.replace(origin, "");
                        }

                        if (internalPath) {
                            return (
                                <span
                                    key={linkContent as string}
                                    {...props}
                                    className={cn(
                                        "cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400",
                                        props.className
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(internalPath!);
                                    }}
                                >
                                    {linkContent}
                                </span>
                            );
                        }

                        // External Links
                        return (
                            <a
                                key={linkContent as string}
                                href={href}
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "text-blue-600 hover:underline dark:text-blue-400",
                                    props.className
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {linkContent}
                            </a>
                        );
                    },
                }}
            >
                {processedContent}
            </Linkify>
        </div>
    );
};

export default RichText;
