import "linkify-plugin-hashtag"
import "linkify-plugin-mention"

export const linkifyOptions = {
    formatHref: (href: string, type: string) => {
        if (type === "mention") return `/u/${href.substring(1)}`
        if (type === "hashtag") return `/tags/${href.substring(1)}`
        return href
    },
    attributes: {
        onClick: (e: any) => e.stopPropagation(),
        className:
            "cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400",
    },
    // Adding validate for hashtags to include Bangla characters if the plugin allows
    validate: {
        hashtag: (value: string) => {
            return /^#[\u0980-\u09FF\w]+$/.test(value);
        }
    },
    target: (_href: string, type: string) => (type === "url" ? "_blank" : undefined),
    rel: (_href: string, type: string) =>
        type === "url" ? "noopener noreferrer" : undefined,
} as any
