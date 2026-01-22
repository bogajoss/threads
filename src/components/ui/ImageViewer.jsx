import React from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';

const ImageViewer = ({ images, currentIndex = 0, onClose, onNavigate }) => {
    if (!images || images.length === 0) return null;

    const currentImage = images[currentIndex];
    const hasMultiple = images.length > 1;

    const handlePrev = (e) => {
        e.stopPropagation();
        if (onNavigate && currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (onNavigate && currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
        }
    };

    const handleDownload = (e) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white font-medium">
                    {hasMultiple ? `${currentIndex + 1} / ${images.length}` : ''}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleDownload}
                        className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Download"
                    >
                        <Download size={22} />
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Close"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full h-full relative flex items-center justify-center p-4">
                {hasMultiple && currentIndex > 0 && (
                    <button 
                        onClick={handlePrev}
                        className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}
                
                <img 
                    src={currentImage} 
                    className="max-w-full max-h-full object-contain select-none shadow-2xl animate-in zoom-in-95 duration-300" 
                    alt="" 
                    onClick={(e) => e.stopPropagation()}
                />

                {hasMultiple && currentIndex < images.length - 1 && (
                    <button 
                        onClick={handleNext}
                        className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>
            
            {/* Thumbnails if multiple */}
            {hasMultiple && (
                <div className="absolute bottom-6 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-2xl overflow-x-auto max-w-[90%] hide-scrollbar" onClick={e => e.stopPropagation()}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => onNavigate(idx)}
                            className={`size-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                                idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                            }`}
                        >
                            <img src={img} className="size-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
