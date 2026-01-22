import React from 'react';
import VideoPlayer from '@/components/features/post/VideoPlayer';
import FileCard from '@/components/features/post/FileCard';

const MediaGrid = ({ items = [] }) => {
    if (!items || items.length === 0) return null;

    // items can be a single object from old schema or array from new
    const normalizedItems = Array.isArray(items) ? items : [items];
    const media = normalizedItems.filter(i => i.type === 'image' || i.type === 'video');
    const files = normalizedItems.filter(i => i.type === 'file');

    return (
        <div className="mt-3 space-y-2">
            {media.length > 0 && (
                <div className={`grid gap-2 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 ${media.length === 1 ? 'grid-cols-1' :
                    media.length === 2 ? 'grid-cols-2 aspect-[16/9]' :
                        media.length === 3 ? 'grid-cols-2 grid-rows-2 aspect-[16/9]' :
                            'grid-cols-2 grid-rows-2 aspect-[16/9]'
                    }`}>
                    {media.map((item, idx) => (
                        <div
                            key={idx}
                            className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${media.length === 3 && idx === 0 ? 'row-span-2' : ''
                                }`}
                        >
                            {item.type === 'video' ? (
                                <VideoPlayer src={item.url} poster={item.poster} />
                            ) : (
                                <img src={item.url || item.src} className="size-full object-cover" alt="" loading="lazy" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {files.map((file, idx) => (
                <FileCard key={idx} file={file} />
            ))}
        </div>
    );
};

export default MediaGrid;
