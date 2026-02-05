import React from "react";
import { useLightbox } from "@/context/LightboxContext";

interface ImageAttachmentProps {
  src: string;
}

const ImageAttachment: React.FC<ImageAttachmentProps> = ({ src }) => {
  const { openLightbox } = useLightbox();

  return (
    <div
      className="group mt-3 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800"
      onClick={(e) => {
        e.stopPropagation();
        openLightbox(src);
      }}
    >
      <img
        src={src}
        alt="Attachment"
        className="max-h-[500px] w-full cursor-pointer bg-zinc-100 object-cover transition-transform duration-300 group-hover:scale-[1.01] dark:bg-zinc-800"
      />
    </div>
  );
};

export default ImageAttachment;
