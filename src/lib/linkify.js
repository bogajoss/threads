import 'linkify-plugin-hashtag';
import 'linkify-plugin-mention';

export const linkifyOptions = {
    formatHref: (href, type) => {
        if (type === 'mention') return `/u/${href.substring(1)}`;
        if (type === 'hashtag') return `/tags/${href.substring(1)}`;
        return href;
    },
    attributes: {
        onClick: (e) => e.stopPropagation(),
        className: 'text-rose-500 dark:text-rose-400 font-bold hover:underline cursor-pointer',
    },
    target: (href, type) => (type === 'url' ? '_blank' : null),
    rel: (href, type) => (type === 'url' ? 'noopener noreferrer' : null),
};
