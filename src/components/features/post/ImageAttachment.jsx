import React from 'react';

const ImageAttachment = ({ src }) => (
    <div className="mt-3 group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Attachment" className="max-h-[500px] w-full cursor-pointer bg-zinc-100 object-cover dark:bg-zinc-800 group-hover:scale-[1.01] transition-transform duration-300" />
    </div>
);

export default ImageAttachment;
