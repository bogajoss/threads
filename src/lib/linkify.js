import * as linkify from 'linkifyjs';
import hashtag from 'linkify-plugin-hashtag';
import mention from 'linkify-plugin-mention';

// Register plugins
linkify.registerPlugin('hashtag', hashtag);
linkify.registerPlugin('mention', mention);

export const linkifyOptions = {
    formatHref: (href, type) => {
        if (type === 'mention') return `/u/${href.substring(1)}`;
        if (type === 'hashtag') return `/explore?q=${encodeURIComponent(href)}`;
        return href;
    },
    attributes: {
        onClick: (e) => e.stopPropagation(),
        className: 'text-rose-500 dark:text-rose-400 font-bold hover:underline cursor-pointer',
    },
    target: (href, type) => (type === 'url' ? '_blank' : null),
    rel: (href, type) => (type === 'url' ? 'noopener noreferrer' : null),
};
