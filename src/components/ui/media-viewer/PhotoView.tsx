import React from "react";
import { motion } from "motion/react";

interface PhotoViewProps {
    url: string;
    scale: number;
}

const PhotoView: React.FC<PhotoViewProps> = ({ url, scale }) => {
    return (
        <motion.img
            src={url}
            animate={{ scale }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl pointer-events-none"
            alt=""
        />
    );
};

export default PhotoView;
